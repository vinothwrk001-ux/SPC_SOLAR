const express = require('express');
const router = express.Router();
const upload = require('../middleware/uploadMiddleware');
const { protect } = require('../middleware/authMiddleware');
const {
  getPublicBlogs,
  getPublicBlogBySlug,
  getFeaturedAndPopularBlogs,
  getAdminBlogs,
  getBlogById,
  createBlog,
  updateBlog,
  publishBlog,
  unpublishBlog,
  scheduleBlog,
  archiveBlog,
  duplicateBlog,
  deleteBlog,
  uploadBlogImage
} = require('../controllers/blogController');

// Public Routes
router.get('/', getPublicBlogs);
router.get('/widgets/featured-popular', getFeaturedAndPopularBlogs);
router.get('/slug/:slug', getPublicBlogBySlug);

// Admin Routes (Protected)
router.get('/admin/all', protect, getAdminBlogs);
router.post('/admin/upload-image', protect, upload.single('image'), uploadBlogImage);
router.post('/admin', protect, createBlog);
router.get('/admin/:id', protect, getBlogById);
router.put('/admin/:id', protect, updateBlog);
router.delete('/admin/:id', protect, deleteBlog);

// Admin Actions
router.put('/admin/:id/publish', protect, publishBlog);
router.put('/admin/:id/unpublish', protect, unpublishBlog);
router.put('/admin/:id/schedule', protect, scheduleBlog);
router.put('/admin/:id/archive', protect, archiveBlog);
router.post('/admin/:id/duplicate', protect, duplicateBlog);

module.exports = router;