const mediaService = require('../services/mediaService');
const albumService = require('../services/albumService');

// @desc List media assets with search, filters, pagination
// @route GET /api/media
const listAssets = async (req, res) => {
  try {
    const result = await mediaService.listAssets(req.query);
    res.json({ success: true, ...result });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// @desc Upload one or multiple media assets (Deduplicated)
// @route POST /api/media/upload
const uploadAsset = async (req, res) => {
  try {
    const files = req.files || (req.file ? [req.file] : []);
    if (!files.length) {
      return res.status(400).json({ success: false, message: 'No files uploaded' });
    }

    const createdBy = req.admin?.username || 'admin';
    const folder = req.body.folder || 'general';
    const entityType = req.body.entityType;
    const entityId = req.body.entityId;
    const field = req.body.field;

    const assets = await Promise.all(
      files.map((file) =>
        mediaService.uploadIfNotExists(file, {
          folder,
          createdBy,
          entityType,
          entityId,
          field,
        })
      )
    );

    const dupes = assets.filter((a) => a.wasDeduplicated).length;
    res.status(201).json({
      success: true,
      assets,
      message: `Processed ${assets.length} file(s)${dupes ? ` (${dupes} deduplicated instantly)` : ''}`,
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// @desc Safe delete asset (Protected against in-use assets)
// @route DELETE /api/media/:id
const deleteAsset = async (req, res) => {
  try {
    const result = await mediaService.safeDelete(req.params.id);
    if (!result.success) {
      const status = result.isConflict ? 409 : 400;
      return res.status(status).json({ success: false, ...result });
    }
    res.json({ success: true, ...result });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// @desc Toggle favorite status
// @route PUT /api/media/:id/favorite
const toggleFavorite = async (req, res) => {
  try {
    const asset = await mediaService.toggleFavorite(req.params.id);
    if (!asset) return res.status(404).json({ success: false, message: 'Asset not found' });
    res.json({ success: true, asset });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// @desc Bulk action (delete, addToAlbum, etc.)
// @route POST /api/media/bulk-action
const bulkAction = async (req, res) => {
  try {
    const { action, assetIds, targetAlbumId } = req.body;
    const result = await mediaService.bulkAction(action, assetIds, { targetAlbumId });
    res.json({ success: true, result });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

// @desc Get media registry metrics
// @route GET /api/media/metrics
const getMetrics = async (req, res) => {
  try {
    const metrics = await mediaService.getMetrics();
    res.json({ success: true, metrics });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// @desc List all albums with live asset counts
// @route GET /api/media/albums
const listAlbums = async (req, res) => {
  try {
    const albums = await albumService.listAlbums();
    res.json({ success: true, albums });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// @desc Create album
// @route POST /api/media/albums
const createAlbum = async (req, res) => {
  try {
    const album = await albumService.createAlbum(req.body, req.admin?.username || 'admin');
    res.status(201).json({ success: true, album });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

// @desc Delete album
// @route DELETE /api/media/albums/:id
const deleteAlbum = async (req, res) => {
  try {
    const album = await albumService.deleteAlbum(req.params.id);
    res.json({ success: true, album });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

module.exports = {
  listAssets,
  uploadAsset,
  deleteAsset,
  toggleFavorite,
  bulkAction,
  getMetrics,
  listAlbums,
  createAlbum,
  deleteAlbum,
};
