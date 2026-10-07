const Banner = require('../models/Banner');
const fs = require('fs');
const path = require('path');

// @desc    Get active home banners (or single banner for backwards compatibility)
// @route   GET /api/banner
// @access  Public
exports.getBanners = async (req, res) => {
  try {
    const banners = await Banner.find({ isActive: true }).sort({ order: 1, createdAt: -1 });
    
    // For backwards compatibility: if client expects a single object or array
    const primaryBanner = banners.length > 0 ? banners[0] : null;

    res.json({
      success: true,
      count: banners.length,
      banners,
      // Backwards compatibility fields:
      _id: primaryBanner?._id,
      imageUrl: primaryBanner?.imageUrl || primaryBanner?.mediaUrl || '',
      mediaUrl: primaryBanner?.mediaUrl || primaryBanner?.imageUrl || '',
      mediaType: primaryBanner?.mediaType || 'image',
      title: primaryBanner?.title || '',
      subtitle: primaryBanner?.subtitle || '',
      ctaText: primaryBanner?.ctaText || '',
      ctaUrl: primaryBanner?.ctaUrl || '',
      isActive: primaryBanner ? primaryBanner.isActive : false
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server Error', error: error.message });
  }
};

// @desc    Get all banners for admin (including inactive)
// @route   GET /api/banner/admin
// @access  Private/Admin
exports.getAllBannersAdmin = async (req, res) => {
  try {
    const banners = await Banner.find({}).sort({ order: 1, createdAt: -1 });
    res.json({ success: true, count: banners.length, banners });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server Error', error: error.message });
  }
};

// @desc    Upload / Add new banner slide (Image or Video)
// @route   POST /api/banner
// @access  Private/Admin
exports.uploadBanner = async (req, res) => {
  try {
    if (!req.file && !req.body.mediaUrl) {
      return res.status(400).json({ success: false, message: 'Please upload an image or video file' });
    }

    let mediaUrl = req.body.mediaUrl;
    let mediaType = req.body.mediaType || 'image';

    if (req.file) {
      mediaUrl = `/uploads/${req.file.filename}`;
      if (req.file.mimetype.startsWith('video') || /\.(mp4|webm|mov|mkv)$/i.test(req.file.originalname)) {
        mediaType = 'video';
      } else {
        mediaType = 'image';
      }
    }

    const {
      title = '',
      subtitle = '',
      ctaText = '',
      ctaUrl = '',
      secondaryCtaText = '',
      secondaryCtaUrl = '',
      order = 0,
      isActive = true
    } = req.body;

    const banner = new Banner({
      mediaUrl,
      imageUrl: mediaUrl,
      mediaType,
      title,
      subtitle,
      ctaText,
      ctaUrl,
      secondaryCtaText,
      secondaryCtaUrl,
      order: Number(order) || 0,
      isActive: isActive === 'true' || isActive === true
    });

    const savedBanner = await banner.save();
    res.status(201).json({ success: true, message: 'Banner added successfully', banner: savedBanner });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server Error', error: error.message });
  }
};

// @desc    Update banner details
// @route   PUT /api/banner/:id
// @access  Private/Admin
exports.updateBanner = async (req, res) => {
  try {
    const { id } = req.params;
    const banner = await Banner.findById(id);

    if (!banner) {
      return res.status(404).json({ success: false, message: 'Banner not found' });
    }

    if (req.file) {
      // If updating media, remove old media file if on local disk
      const oldMedia = banner.mediaUrl || banner.imageUrl;
      if (oldMedia && oldMedia.startsWith('/uploads/')) {
        const oldFilePath = path.join(__dirname, '..', oldMedia);
        if (fs.existsSync(oldFilePath)) {
          try { fs.unlinkSync(oldFilePath); } catch (e) {}
        }
      }
      banner.mediaUrl = `/uploads/${req.file.filename}`;
      banner.imageUrl = banner.mediaUrl;
      if (req.file.mimetype.startsWith('video') || /\.(mp4|webm|mov|mkv)$/i.test(req.file.originalname)) {
        banner.mediaType = 'video';
      } else {
        banner.mediaType = 'image';
      }
    }

    // Ensure fallback values if old document lacked them
    if (!banner.mediaUrl && banner.imageUrl) {
      banner.mediaUrl = banner.imageUrl;
    }
    if (!banner.imageUrl && banner.mediaUrl) {
      banner.imageUrl = banner.mediaUrl;
    }
    if (!banner.mediaType) {
      banner.mediaType = 'image';
    }

    const {
      title,
      subtitle,
      ctaText,
      ctaUrl,
      secondaryCtaText,
      secondaryCtaUrl,
      order,
      isActive,
      mediaType
    } = req.body;

    if (title !== undefined) banner.title = title;
    if (subtitle !== undefined) banner.subtitle = subtitle;
    if (ctaText !== undefined) banner.ctaText = ctaText;
    if (ctaUrl !== undefined) banner.ctaUrl = ctaUrl;
    if (secondaryCtaText !== undefined) banner.secondaryCtaText = secondaryCtaText;
    if (secondaryCtaUrl !== undefined) banner.secondaryCtaUrl = secondaryCtaUrl;
    if (order !== undefined) banner.order = Number(order) || 0;
    if (isActive !== undefined) banner.isActive = isActive === 'true' || isActive === true;
    if (mediaType !== undefined && !req.file) banner.mediaType = mediaType;

    const updated = await banner.save();
    res.json({ success: true, message: 'Banner updated successfully', banner: updated });
  } catch (error) {
    console.error('Update banner error:', error);
    res.status(500).json({ success: false, message: error.message || 'Server Error' });
  }
};

// @desc    Toggle active status
// @route   PATCH /api/banner/:id/toggle
// @access  Private/Admin
exports.toggleBannerStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const banner = await Banner.findById(id);

    if (!banner) {
      return res.status(404).json({ success: false, message: 'Banner not found' });
    }

    banner.isActive = !banner.isActive;
    await banner.save();

    res.json({ success: true, message: `Banner ${banner.isActive ? 'activated' : 'deactivated'}`, banner });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server Error', error: error.message });
  }
};

// @desc    Delete banner
// @route   DELETE /api/banner/:id
// @access  Private/Admin
exports.deleteBanner = async (req, res) => {
  try {
    const { id } = req.params;
    const banner = await Banner.findById(id);

    if (!banner) {
      return res.status(404).json({ success: false, message: 'Banner not found' });
    }

    if (banner.mediaUrl && banner.mediaUrl.startsWith('/uploads/')) {
      const filePath = path.join(__dirname, '..', banner.mediaUrl);
      if (fs.existsSync(filePath)) {
        try { fs.unlinkSync(filePath); } catch (e) {}
      }
    }

    await banner.deleteOne();
    res.json({ success: true, message: 'Banner deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server Error', error: error.message });
  }
};

