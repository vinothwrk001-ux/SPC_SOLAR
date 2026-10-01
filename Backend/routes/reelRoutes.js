const express = require('express');
const router = express.Router();
const upload = require('../middleware/uploadMiddleware');
const { protect } = require('../middleware/authMiddleware');
const {
  getPublicReels,
  getReelById,
  recordReelView,
  toggleReelLike,
  toggleReelSave,
  addReelComment,
  recordQuoteClick,
  getAdminReels,
  createReel,
  updateReel,
  deleteReel
} = require('../controllers/reelController');

// Public routes
router.get('/', getPublicReels);
router.get('/:id', getReelById);
router.post('/:id/view', recordReelView);
router.post('/:id/like', toggleReelLike);
router.post('/:id/save', toggleReelSave);
router.post('/:id/comment', addReelComment);
router.post('/:id/quote-click', recordQuoteClick);

// Admin routes (Protected)
router.get('/admin/all', protect, getAdminReels);
router.post(
  '/admin',
  protect,
  upload.fields([
    { name: 'videoFile', maxCount: 1 },
    { name: 'thumbnailFile', maxCount: 1 }
  ]),
  createReel
);
router.put(
  '/admin/:id',
  protect,
  upload.fields([
    { name: 'videoFile', maxCount: 1 },
    { name: 'thumbnailFile', maxCount: 1 }
  ]),
  updateReel
);
router.delete('/admin/:id', protect, deleteReel);

module.exports = router;
