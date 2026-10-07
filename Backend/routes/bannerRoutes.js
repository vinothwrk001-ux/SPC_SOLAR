const express = require('express');
const router = express.Router();
const upload = require('../middleware/uploadMiddleware');
const { protect } = require('../middleware/authMiddleware');

const { getBanner, uploadBanner } = require('../controllers/BannerController');

router.route('/')
  .get(getBanner)
  .post(protect, upload.single('image'), uploadBanner);

module.exports = router;
