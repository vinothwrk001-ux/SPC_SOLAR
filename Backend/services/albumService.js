const { MediaAlbum } = require('../models/MediaAlbum');
const { MediaAsset } = require('../models/MediaAsset');

async function listAlbums() {
  const albums = await MediaAlbum.aggregate([
    { $sort: { createdAt: -1 } },
    {
      $lookup: {
        from: 'mediaassets',
        let: { albumId: '$_id' },
        pipeline: [
          {
            $match: {
              $expr: {
                $and: [
                  { $in: ['$$albumId', { $ifNull: ['$albums', []] }] },
                  { $ne: ['$status', 'DELETED'] },
                ],
              },
            },
          },
          { $count: 'count' },
        ],
        as: 'stats',
      },
    },
    {
      $addFields: {
        assetCount: { $ifNull: [{ $arrayElemAt: ['$stats.count', 0] }, 0] },
      },
    },
    { $project: { stats: 0 } },
  ]);

  return albums;
}

async function createAlbum(data, createdBy = 'admin') {
  const slug = (data.name || '').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
  return await MediaAlbum.create({
    name: data.name,
    slug,
    description: data.description,
    createdBy,
  });
}

async function deleteAlbum(id) {
  const album = await MediaAlbum.findByIdAndDelete(id);
  if (!album) throw new Error('Album not found');

  // Pull album ID from associated assets
  await MediaAsset.updateMany({ albums: id }, { $pull: { albums: id } });
  return album;
}

async function ensureDefaultAlbums() {
  const defaults = [
    { name: 'Solar Reels', description: 'Video reels and clips for social showcasing' },
    { name: 'Projects Gallery', description: 'Solar rooftop and commercial installation project photos' },
    { name: 'Components & Inverters', description: 'Solar panels, hybrid inverters, and battery equipment' },
    { name: 'Blog Assets', description: 'Editorial imagery, schematics, and subsidy guides' },
  ];

  for (const item of defaults) {
    const slug = item.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    const exists = await MediaAlbum.findOne({ slug });
    if (!exists) {
      await MediaAlbum.create({ ...item, slug, createdBy: 'system' });
    }
  }
}

module.exports = {
  listAlbums,
  createAlbum,
  deleteAlbum,
  ensureDefaultAlbums,
};
