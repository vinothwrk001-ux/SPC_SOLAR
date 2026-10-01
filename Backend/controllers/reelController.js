const Reel = require('../models/Reel');
const path = require('path');

// @desc Get public reels feed
// @route GET /api/reels
const getPublicReels = async (req, res) => {
  try {
    const { category, tag } = req.query;
    let query = { status: 'Published', showOnStorefront: true };
    if (category) query.category = category;
    if (tag) query.tags = { $in: [tag] };

    const reels = await Reel.find(query).sort({ createdAt: -1 });
    res.json(reels);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc Get single reel details
// @route GET /api/reels/:id
const getReelById = async (req, res) => {
  try {
    const reel = await Reel.findById(req.params.id);
    if (!reel) return res.status(404).json({ message: 'Reel not found' });
    res.json(reel);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc Record view count
// @route POST /api/reels/:id/view
const recordReelView = async (req, res) => {
  try {
    const reel = await Reel.findByIdAndUpdate(
      req.params.id,
      { $inc: { viewsCount: 1 } },
      { new: true }
    );
    res.json({ viewsCount: reel?.viewsCount || 0 });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc Toggle like on a reel
// @route POST /api/reels/:id/like
const toggleReelLike = async (req, res) => {
  try {
    const { sessionId = 'guest' } = req.body;
    const reel = await Reel.findById(req.params.id);
    if (!reel) return res.status(404).json({ message: 'Reel not found' });

    const hasLiked = reel.likes.includes(sessionId);
    if (hasLiked) {
      reel.likes = reel.likes.filter(id => id !== sessionId);
      reel.likesCount = Math.max(0, reel.likesCount - 1);
    } else {
      reel.likes.push(sessionId);
      reel.likesCount += 1;
    }

    await reel.save();
    res.json({ liked: !hasLiked, likesCount: reel.likesCount });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc Toggle bookmark/save on a reel
// @route POST /api/reels/:id/save
const toggleReelSave = async (req, res) => {
  try {
    const { sessionId = 'guest' } = req.body;
    const reel = await Reel.findById(req.params.id);
    if (!reel) return res.status(404).json({ message: 'Reel not found' });

    const hasSaved = reel.saves.includes(sessionId);
    if (hasSaved) {
      reel.saves = reel.saves.filter(id => id !== sessionId);
      reel.savesCount = Math.max(0, reel.savesCount - 1);
    } else {
      reel.saves.push(sessionId);
      reel.savesCount += 1;
    }

    await reel.save();
    res.json({ saved: !hasSaved, savesCount: reel.savesCount });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc Post comment on a reel
// @route POST /api/reels/:id/comment
const addReelComment = async (req, res) => {
  try {
    const { name = 'Solar Client', text } = req.body;
    if (!text) return res.status(400).json({ message: 'Comment text is required' });

    const reel = await Reel.findById(req.params.id);
    if (!reel) return res.status(404).json({ message: 'Reel not found' });

    const newComment = { name, text, createdAt: new Date() };
    reel.comments.push(newComment);
    reel.commentsCount = reel.comments.length;

    await reel.save();
    res.status(201).json({ comments: reel.comments, commentsCount: reel.commentsCount });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc Track quote calculator clicks from reel
// @route POST /api/reels/:id/quote-click
const recordQuoteClick = async (req, res) => {
  try {
    const reel = await Reel.findByIdAndUpdate(
      req.params.id,
      { $inc: { quoteClicksCount: 1 } },
      { new: true }
    );
    res.json({ quoteClicksCount: reel?.quoteClicksCount || 0 });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// --- ADMIN CONTROLLERS ---

// @desc Get all reels for Admin dashboard
// @route GET /api/reels/admin/all
const getAdminReels = async (req, res) => {
  try {
    const reels = await Reel.find().sort({ createdAt: -1 });
    res.json(reels);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc Create new Reel
// @route POST /api/reels/admin
const createReel = async (req, res) => {
  try {
    let videoUrl = req.body.videoUrl || '';
    let thumbnailUrl = req.body.thumbnailUrl || '';

    if (req.files && req.files.videoFile) {
      videoUrl = `/uploads/${req.files.videoFile[0].filename}`;
    }
    if (req.files && req.files.thumbnailFile) {
      thumbnailUrl = `/uploads/${req.files.thumbnailFile[0].filename}`;
    }

    if (!videoUrl) {
      return res.status(400).json({ message: 'Video URL or file is required' });
    }

    const tagsArray = typeof req.body.tags === 'string' 
      ? req.body.tags.split(',').map(t => t.trim()).filter(Boolean)
      : (req.body.tags || []);

    const newReel = new Reel({
      title: req.body.title || 'Solar Installation Reel',
      description: req.body.description || '',
      videoUrl,
      thumbnailUrl,
      category: req.body.category || 'Installation',
      tags: tagsArray,
      systemCapacity: req.body.systemCapacity || '5 kW System',
      location: req.body.location || 'Coimbatore, Tamil Nadu',
      linkedService: req.body.linkedService || 'Rooftop Solar Installation',
      status: req.body.status || 'Published',
      showOnStorefront: req.body.showOnStorefront !== undefined ? req.body.showOnStorefront : true
    });

    const saved = await newReel.save();
    res.status(201).json(saved);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc Update Reel
// @route PUT /api/reels/admin/:id
const updateReel = async (req, res) => {
  try {
    let updateData = { ...req.body };

    if (req.files && req.files.videoFile) {
      updateData.videoUrl = `/uploads/${req.files.videoFile[0].filename}`;
    }
    if (req.files && req.files.thumbnailFile) {
      updateData.thumbnailUrl = `/uploads/${req.files.thumbnailFile[0].filename}`;
    }

    if (typeof updateData.tags === 'string') {
      updateData.tags = updateData.tags.split(',').map(t => t.trim()).filter(Boolean);
    }

    const updated = await Reel.findByIdAndUpdate(req.params.id, updateData, { new: true });
    res.json(updated);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc Delete Reel
// @route DELETE /api/reels/admin/:id
const deleteReel = async (req, res) => {
  try {
    await Reel.findByIdAndDelete(req.params.id);
    res.json({ message: 'Reel deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
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
};
