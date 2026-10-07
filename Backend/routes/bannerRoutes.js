const express = require('express');
const router = express.Router();
const upload = require('../middleware/uploadMiddleware');
const { protect } = require('../middleware/authMiddleware');

const { 
  getBanners, 
  getAllBannersAdmin, 
  uploadBanner, 
  updateBanner, 
  toggleBannerStatus, 
  deleteBanner 
} = require('../controllers/BannerController');

// Public route to fetch active banners for homepage
router.get('/', getBanners);

// Protected admin routes
router.get('/admin', protect, getAllBannersAdmin);
router.post('/', protect, upload.any(), (req, res, next) => {
  if (req.files && req.files.length > 0) req.file = req.files[0];
  next();
}, uploadBanner);
router.put('/:id', protect, upload.any(), (req, res, next) => {
  if (req.files && req.files.length > 0) req.file = req.files[0];
  next();
}, updateBanner);
router.patch('/:id/toggle', protect, toggleBannerStatus);
router.delete('/:id', protect, deleteBanner);

module.exports = router;
