const mongoose = require('mongoose');
const { Schema, model } = mongoose;

const STATUSES = ['UPLOADING', 'READY', 'ORPHANED', 'DELETING', 'DELETED', 'FAILED'];
const RESOURCE_TYPES = ['image', 'video', 'raw'];
const VISIBILITIES = ['public', 'private', 'restricted'];

const ReferenceSchema = new Schema(
  {
    entityType: { type: String, required: true }, // e.g., "Reel", "Product", "Blog", "Banner", "GalleryComponent"
    entityId:   { type: String, required: true }, // Document ID
    field:      { type: String },                 // e.g., "videoUrl", "thumbnailUrl", "coverImage"
    createdAt:  { type: Date, default: Date.now },
  },
  { _id: false }
);

const MediaAssetSchema = new Schema(
  {
    // Deduplication Key
    contentHash:        { type: String, required: true, unique: true, index: true },
    hashAlgorithm:      { type: String, default: 'sha256' },

    // Storage Identifiers
    storageProvider:    { type: String, enum: ['cloudinary', 'local'], default: 'local' },
    cloudinaryPublicId: { type: String, index: true, sparse: true },
    secureUrl:          { type: String, required: true },
    localPath:          { type: String },

    // Metadata
    resourceType:       { type: String, enum: RESOURCE_TYPES, default: 'image', index: true },
    format:             { type: String },
    mimeType:           { type: String },
    fileSize:           { type: Number, default: 0 },
    width:              { type: Number },
    height:             { type: Number },
    duration:           { type: Number }, // Video duration in seconds (for Reels)
    folder:             { type: String, default: 'general', index: true },
    originalFilename:   { type: String },

    // Albums & Favorites
    albums:             [{ type: Schema.Types.ObjectId, ref: 'MediaAlbum' }],
    isFavorite:         { type: Boolean, default: false, index: true },

    // Lifecycle
    status:             { type: String, enum: STATUSES, default: 'UPLOADING', index: true },
    visibility:         { type: String, enum: VISIBILITIES, default: 'public' },

    // Reference Tracking & Safe GC
    references:         { type: [ReferenceSchema], default: [] },
    usageCount:         { type: Number, default: 0, index: true },

    orphanedAt:         { type: Date },
    deletedAt:          { type: Date },

    // Tenant / Creator Scoping
    createdBy:          { type: String, index: true, default: 'system' },
    metadata:           { type: Schema.Types.Mixed, default: {} },
  },
  { timestamps: true }
);

// Indexes
MediaAssetSchema.index({ status: 1, orphanedAt: 1 });
MediaAssetSchema.index({ resourceType: 1, createdAt: -1 });
MediaAssetSchema.index({ 'references.entityType': 1, 'references.entityId': 1 });

module.exports = {
  MediaAsset: model('MediaAsset', MediaAssetSchema)
};
