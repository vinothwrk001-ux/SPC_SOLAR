const express = require('express');
const router = express.Router();
const {
  getApprovedTestimonials,
  submitCustomerReview,
  getAllTestimonialsAdmin,
  createAdminTestimonial,
  updateAdminTestimonial,
  updateTestimonialStatus,
  deleteTestimonial
} = require('../controllers/testimonialController');
const { protect } = require('../middleware/authMiddleware');
const upload = require('../middleware/uploadMiddleware');

const uploadFields = upload.fields([
  { name: 'photo', maxCount: 1 },
  { name: 'image', maxCount: 1 }
]);

// Public endpoints
router.get('/', getApprovedTestimonials);
router.post('/submit', uploadFields, submitCustomerReview);

// Admin endpoints (Protected)
router.get('/admin/all', protect, getAllTestimonialsAdmin);
router.post('/admin', protect, uploadFields, createAdminTestimonial);
router.put('/admin/:id', protect, uploadFields, updateAdminTestimonial);
router.put('/admin/:id/status', protect, updateTestimonialStatus);
router.delete('/admin/:id', protect, deleteTestimonial);

module.exports = router;