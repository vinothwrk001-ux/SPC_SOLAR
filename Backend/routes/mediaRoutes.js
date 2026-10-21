const express = require('express');
const router = express.Router();
const { mediaUpload } = require('../middleware/mediaUpload');
const { protect } = require('../middleware/authMiddleware');
const {
  listAssets,
  uploadAsset,
  deleteAsset,
  toggleFavorite,
  bulkAction,
  getMetrics,
  listAlbums,
  createAlbum,
  deleteAlbum,
} = require('../controllers/mediaController');

// Metrics & Albums
router.get('/metrics', getMetrics);
router.get('/albums', listAlbums);
router.post('/albums', protect, createAlbum);
router.delete('/albums/:id', protect, deleteAlbum);

// Assets
router.get('/', listAssets);
router.post('/upload', protect, mediaUpload.array('files', 20), uploadAsset);
router.put('/:id/favorite', protect, toggleFavorite);
router.post('/bulk-action', protect, bulkAction);
router.delete('/:id', protect, deleteAsset);

module.exports = router;
