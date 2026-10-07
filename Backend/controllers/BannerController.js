const Banner = require('../models/Banner');
const fs = require('fs');
const path = require('path');

// @desc    Get active home banner
// @route   GET /api/banner
// @access  Public
exports.getBanner = async (req, res) => {
  try {
    const banner = await Banner.findOne({ isActive: true }).sort({ createdAt: -1 });
    if (!banner) {
      return res.status(404).json({ message: 'No active banner found' });
    }
    res.json(banner);
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

// @desc    Upload new home banner
// @route   POST /api/banner
// @access  Private/Admin
exports.uploadBanner = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'Please upload an image' });
    }

    const imageUrl = `/uploads/${req.file.filename}`;

    // Optional: delete old banners to save space, or just deactivate them
    const oldBanners = await Banner.find({});
    for (let old of oldBanners) {
      if (old.imageUrl && old.imageUrl.startsWith('/uploads/')) {
        const filePath = path.join(__dirname, '..', old.imageUrl);
        if (fs.existsSync(filePath)) {
          fs.unlinkSync(filePath);
        }
      }
      await old.deleteOne();
    }

    const banner = new Banner({
      imageUrl,
      isActive: true,
    });

    const savedBanner = await banner.save();
    res.status(201).json(savedBanner);
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};
