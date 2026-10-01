const express = require('express');
const router = express.Router();
const {
  getApprovedTestimonials,
  submitCustomerReview,
  getAllTestimonialsAdmin,
  createAdminTestimonial,
  updateTestimonialStatus,
  deleteTestimonial
} = require('../controllers/testimonialController');
const { protect } = require('../middleware/authMiddleware');

// Public endpoints
router.get('/', getApprovedTestimonials);
router.post('/submit', submitCustomerReview);

// Admin endpoints (Protected)
router.get('/admin/all', protect, getAllTestimonialsAdmin);
router.post('/admin', protect, createAdminTestimonial);
router.put('/admin/:id/status', protect, updateTestimonialStatus);
router.delete('/admin/:id', protect, deleteTestimonial);

module.exports = router;