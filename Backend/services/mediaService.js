const crypto = require('crypto');
const fs = require('fs');
const path = require('path');
const { MediaAsset } = require('../models/MediaAsset');
const { MediaAlbum } = require('../models/MediaAlbum');
const { configureCloudinary } = require('../config/cloudinary');

// Local uploads directory for Media Manager
const LOCAL_MEDIA_DIR = path.join(__dirname, '../uploads/media');
if (!fs.existsSync(LOCAL_MEDIA_DIR)) {
  fs.mkdirSync(LOCAL_MEDIA_DIR, { recursive: true });
}

/**
 * Calculates SHA-256 binary hash of the uploaded buffer
 */
function calculateContentHash(buffer) {
  if (!Buffer.isBuffer(buffer)) {
    throw new TypeError('Buffer required for content hashing');
  }
  return crypto.createHash('sha256').update(buffer).digest('hex');
}

/**
 * Helper to upload buffer to Cloudinary
 */
async function uploadBufferToCloudinary(file, folder) {
  const { enabled, cloudinary } = configureCloudinary();
  if (!enabled) throw new Error('Cloudinary not configured');

  const resourceType = file.mimetype === 'application/pdf'
    ? 'raw'
    : file.mimetype.startsWith('video/') ? 'video' : 'image';

  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      { folder: `spcsolar/${folder}`, resource_type: resourceType },
      (err, result) => (err ? reject(err) : resolve(result))
    );
    stream.end(file.buffer);
  });
}

/**
 * Helper to write buffer to local uploads disk
 */
async function saveBufferToLocal(file, hash) {
  const ext = path.extname(file.originalname) || (file.mimetype.startsWith('video/') ? '.mp4' : '.jpg');
  const filename = `${hash}${ext}`;
  const fullPath = path.join(LOCAL_MEDIA_DIR, filename);

  if (!fs.existsSync(fullPath)) {
    await fs.promises.writeFile(fullPath, file.buffer);
  }

  const secureUrl = `/uploads/media/${filename}`;
  return {
    secureUrl,
    localPath: fullPath,
    filename,
  };
}

/**
 * Polling helper for race-condition winner
 */
async function pollForReady(hash, timeoutMs = 5000) {
  const start = Date.now();
  while (Date.now() - start < timeoutMs) {
    await new Promise((r) => setTimeout(r, 300));
    const asset = await MediaAsset.findOne({ contentHash: hash });
    if (asset?.status === 'READY') return asset;
    if (asset?.status === 'FAILED') return null;
  }
  return null;
}

function assetToResult(asset) {
  const doc = asset.toObject ? asset.toObject() : asset;
  return {
    ...doc,
    url: doc.secureUrl,
    publicId: doc.cloudinaryPublicId || doc.localPath,
  };
}

// ── Main Deduplicated Upload Entry Point ───────────────────────────────────────
async function uploadIfNotExists(file, context = {}) {
  const {
    folder = file.mimetype.startsWith('video/') ? 'reels' : 'general',
    entityType,
    entityId,
    field,
    createdBy = 'admin',
    visibility = 'public',
  } = context;

  const hash = calculateContentHash(file.buffer);

  // 1. Check if hash exists in READY or ORPHANED state (Content Deduplication)
  const existing = await MediaAsset.findOne({
    contentHash: hash,
    status: { $in: ['READY', 'ORPHANED'] },
  });

  if (existing) {
    if (existing.status === 'ORPHANED') {
      existing.status = 'READY';
      existing.orphanedAt = undefined;
      await existing.save();
    }
    if (entityType && entityId) {
      await addReference(existing._id, { entityType, entityId, field });
    }
    const result = assetToResult(existing);
    result.wasDeduplicated = true;
    return result;
  }

  // Determine resource type
  const isVideo = file.mimetype.startsWith('video/');
  const isPdf = file.mimetype === 'application/pdf';
  const resourceType = isPdf ? 'raw' : isVideo ? 'video' : 'image';
  const format = (path.extname(file.originalname) || '').replace('.', '').toLowerCase() || (isVideo ? 'mp4' : 'jpg');

  // 2. Claim upload slot (Race-condition safe via unique index on contentHash)
  let asset;
  try {
    asset = await MediaAsset.create({
      contentHash: hash,
      status: 'UPLOADING',
      folder,
      resourceType,
      format,
      mimeType: file.mimetype,
      fileSize: file.size,
      originalFilename: file.originalname,
      visibility,
      createdBy: createdBy || 'admin',
      secureUrl: 'pending',
    });
  } catch (err) {
    if (err.code === 11000) {
      // Race condition: concurrent identical upload. Wait for first upload to finish
      const winner = await pollForReady(hash);
      if (winner) {
        if (entityType && entityId) {
          await addReference(winner._id, { entityType, entityId, field });
        }
        const res = assetToResult(winner);
        res.wasDeduplicated = true;
        return res;
      }
      asset = await MediaAsset.findOne({ contentHash: hash });
      if (!asset) throw err;
      asset.status = 'UPLOADING';
      await asset.save();
    } else {
      throw err;
    }
  }

  // 3. Perform Storage (Cloudinary if configured, otherwise local disk)
  const { enabled: cloudinaryEnabled } = configureCloudinary();

  try {
    if (cloudinaryEnabled) {
      const result = await uploadBufferToCloudinary(file, folder);
      asset.storageProvider    = 'cloudinary';
      asset.cloudinaryPublicId = result.public_id;
      asset.secureUrl          = result.secure_url;
      asset.resourceType       = result.resource_type || resourceType;
      asset.format             = result.format || format;
      asset.width              = result.width;
      asset.height             = result.height;
      asset.duration           = result.duration; // Cloudinary supplies video duration
      asset.fileSize           = result.bytes || file.size;
    } else {
      const localResult = await saveBufferToLocal(file, hash);
      asset.storageProvider = 'local';
      asset.secureUrl       = localResult.secureUrl;
      asset.localPath       = localResult.localPath;
      asset.fileSize        = file.size;
    }

    asset.status = 'READY';
    await asset.save();
  } catch (err) {
    asset.status = 'FAILED';
    await asset.save().catch(() => {});
    throw err;
  }

  if (entityType && entityId) {
    await addReference(asset._id, { entityType, entityId, field });
  }

  return assetToResult(asset);
}

// ── Reference Tracking & Lifecycle ───────────────────────────────────────────
async function addReference(mediaId, { entityType, entityId, field }) {
  if (!entityType || !entityId) return;

  const existing = await MediaAsset.findOne({
    _id: mediaId,
    'references.entityType': entityType,
    'references.entityId': String(entityId),
    ...(field ? { 'references.field': field } : {}),
  });
  if (existing) return;

  await MediaAsset.findByIdAndUpdate(mediaId, {
    $push: { references: { entityType, entityId: String(entityId), field } },
    $inc:  { usageCount: 1 },
    $set:  { status: 'READY', orphanedAt: null },
  });
}

async function removeReference(mediaId, entityType, entityId) {
  const asset = await MediaAsset.findById(mediaId);
  if (!asset) return;

  const initialCount = asset.references.length;
  asset.references = asset.references.filter(
    (r) => !(r.entityType === entityType && String(r.entityId) === String(entityId))
  );
  const diff = initialCount - asset.references.length;
  if (diff > 0) asset.usageCount = Math.max(0, asset.usageCount - diff);

  if (asset.usageCount === 0 && asset.references.length === 0 && asset.status === 'READY') {
    asset.status = 'ORPHANED';
    asset.orphanedAt = new Date();
  }
  await asset.save();
}

/**
 * Sync entity references: add references to new media, remove from unlinked media
 */
async function syncEntityReferences(newMediaIds = [], entityType, entityId, field = null) {
  if (!entityType || !entityId) return;
  const strEntityId = String(entityId);
  const normalizedNewIds = newMediaIds.map((id) => String(id)).filter(Boolean);

  // 1. Add references to newly added assets
  for (const id of normalizedNewIds) {
    await addReference(id, { entityType, entityId: strEntityId, field });
  }

  // 2. Remove references from assets no longer linked
  const previouslyReferenced = await MediaAsset.find({
    'references.entityType': entityType,
    'references.entityId': strEntityId,
    ...(field ? { 'references.field': field } : {}),
    _id: { $nin: normalizedNewIds },
  });

  for (const asset of previouslyReferenced) {
    await removeReference(asset._id, entityType, strEntityId);
  }
}

/**
 * Specifically synchronizes media URLs for a Reel (videoUrl and thumbnailUrl)
 */
async function syncReelMedia(reelId, videoUrl, thumbnailUrl) {
  if (!reelId) return;
  const urls = [videoUrl, thumbnailUrl].filter(Boolean);
  if (!urls.length) return;

  // Find matching assets by secureUrl
  const matchingAssets = await MediaAsset.find({
    secureUrl: { $in: urls }
  });

  for (const asset of matchingAssets) {
    const field = asset.secureUrl === videoUrl ? 'videoUrl' : 'thumbnailUrl';
    await addReference(asset._id, {
      entityType: 'Reel',
      entityId: String(reelId),
      field
    });
  }
}

/**
 * Called when a Reel is deleted to safely remove all references
 */
async function onReelDeleted(reelId) {
  if (!reelId) return;
  const referencedAssets = await MediaAsset.find({
    'references.entityType': 'Reel',
    'references.entityId': String(reelId)
  });

  for (const asset of referencedAssets) {
    await removeReference(asset._id, 'Reel', String(reelId));
  }
}

// ── Safe Deletion ─────────────────────────────────────────────────────────────
async function safeDelete(mediaId, createdBy = null) {
  const asset = await MediaAsset.findById(mediaId);
  if (!asset) return { success: false, message: 'Asset not found' };

  if (asset.status === 'DELETED') {
    return { success: true, message: 'Already deleted' };
  }

  // Prevent deletion if actively in use by any entity
  if ((asset.references || []).length > 0 || asset.usageCount > 0) {
    return {
      success: false,
      isConflict: true,
      message: `Cannot delete: in active use by ${asset.references.length} entity/entities`,
      references: asset.references,
    };
  }

  asset.status = 'DELETING';
  await asset.save();

  // If Cloudinary asset:
  if (asset.storageProvider === 'cloudinary' && asset.cloudinaryPublicId) {
    const { enabled, cloudinary } = configureCloudinary();
    if (enabled) {
      try {
        await cloudinary.uploader.destroy(asset.cloudinaryPublicId, {
          resource_type: asset.resourceType || 'image',
        });
      } catch (cloudErr) {
        console.warn('Cloudinary destroy warning:', cloudErr.message);
      }
    }
  }

  // If Local asset:
  if (asset.storageProvider === 'local' && asset.localPath) {
    try {
      if (fs.existsSync(asset.localPath)) {
        await fs.promises.unlink(asset.localPath);
      }
    } catch (fsErr) {
      console.warn('Local file unlink warning:', fsErr.message);
    }
  }

  asset.status = 'DELETED';
  asset.deletedAt = new Date();
  await asset.save();

  // Remove from albums
  await MediaAlbum.updateMany({ coverImage: mediaId }, { $unset: { coverImage: '' } });
  return { success: true, message: 'Asset safely deleted' };
}

// ── Query & Bulk Operations ───────────────────────────────────────────────────
async function listAssets({
  page = 1,
  limit = 24,
  status,
  format,
  resourceType,
  folder,
  search,
  albumId,
  isFavorite,
} = {}) {
  const filter = {};

  if (status) {
    filter.status = status;
  } else {
    filter.status = { $ne: 'DELETED' };
  }

  if (format) filter.format = format;
  if (folder) filter.folder = folder;

  if (resourceType && resourceType !== 'all') {
    filter.resourceType = resourceType;
  }

  if (isFavorite === 'true' || isFavorite === true) {
    filter.isFavorite = true;
  }

  if (albumId) {
    filter.albums = albumId;
  }

  if (search) {
    const re = new RegExp(String(search).replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'i');
    filter.$or = [
      { originalFilename: re },
      { cloudinaryPublicId: re },
      { contentHash: re },
      { folder: re },
    ];
  }

  const numericPage = Math.max(parseInt(page, 10) || 1, 1);
  const numericLimit = Math.min(Math.max(parseInt(limit, 10) || 24, 1), 100);
  const skip = (numericPage - 1) * numericLimit;

  const [assets, total] = await Promise.all([
    MediaAsset.find(filter)
      .populate('albums', 'name slug')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(numericLimit)
      .lean(),
    MediaAsset.countDocuments(filter),
  ]);

  return {
    assets,
    total,
    page: numericPage,
    pages: Math.ceil(total / numericLimit),
  };
}

async function toggleFavorite(mediaId) {
  const asset = await MediaAsset.findById(mediaId);
  if (!asset) return null;
  asset.isFavorite = !asset.isFavorite;
  await asset.save();
  return asset;
}

async function bulkAction(action, assetIds, { targetAlbumId } = {}) {
  if (!Array.isArray(assetIds) || !assetIds.length) {
    throw new Error('assetIds array required');
  }

  const filter = { _id: { $in: assetIds } };

  if (action === 'addToAlbum' && targetAlbumId) {
    const res = await MediaAsset.updateMany(filter, { $addToSet: { albums: targetAlbumId } });
    return { modifiedCount: res.modifiedCount };
  }

  if (action === 'removeFromAlbum' && targetAlbumId) {
    const res = await MediaAsset.updateMany(filter, { $pull: { albums: targetAlbumId } });
    return { modifiedCount: res.modifiedCount };
  }

  if (action === 'moveToAlbum' && targetAlbumId) {
    const res = await MediaAsset.updateMany(filter, { $set: { albums: [targetAlbumId] } });
    return { modifiedCount: res.modifiedCount };
  }

  if (action === 'delete') {
    let deletedCount = 0;
    let failedCount = 0;
    const failures = [];

    for (const id of assetIds) {
      const res = await safeDelete(id);
      if (res.success) {
        deletedCount++;
      } else {
        failedCount++;
        failures.push({ id, message: res.message });
      }
    }
    return { deletedCount, failedCount, failures };
  }

  throw new Error('Invalid bulk action');
}

async function getMetrics() {
  const [statusCounts, typeCounts, totalBytes] = await Promise.all([
    MediaAsset.aggregate([
      { $group: { _id: '$status', count: { $sum: 1 } } },
    ]),
    MediaAsset.aggregate([
      { $match: { status: { $ne: 'DELETED' } } },
      { $group: { _id: '$resourceType', count: { $sum: 1 } } },
    ]),
    MediaAsset.aggregate([
      { $match: { status: { $ne: 'DELETED' } } },
      { $group: { _id: null, totalSize: { $sum: '$fileSize' } } },
    ]),
  ]);

  const byStatus = Object.fromEntries(statusCounts.map((s) => [s._id, s.count]));
  const byType = Object.fromEntries(typeCounts.map((t) => [t._id, t.count]));

  return {
    totalAssets: Object.values(byStatus).reduce((a, b) => a + b, 0),
    readyAssets: byStatus.READY || 0,
    orphanedAssets: byStatus.ORPHANED || 0,
    failedAssets: byStatus.FAILED || 0,
    deletedAssets: byStatus.DELETED || 0,
    imageAssets: byType.image || 0,
    videoAssets: byType.video || 0, // Reels & Videos
    rawAssets: byType.raw || 0,
    totalStorageBytes: totalBytes[0]?.totalSize || 0,
  };
}

module.exports = {
  uploadIfNotExists,
  addReference,
  removeReference,
  syncEntityReferences,
  syncReelMedia,
  onReelDeleted,
  safeDelete,
  listAssets,
  toggleFavorite,
  bulkAction,
  getMetrics,
  calculateContentHash,
};
