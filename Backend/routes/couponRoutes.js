const express = require('express');
const router = express.Router();
const {
  getPublicCouponConfig,
  getAdminCouponConfig,
  updateAdminCouponConfig,
  getIssuedCouponsAdmin,
  updateUserCouponStatusAdmin,
} = require('../controllers/couponController');
const { protect } = require('../middleware/authMiddleware');

// Public route for calculator & promotion banners
router.get('/config', getPublicCouponConfig);

// Admin routes (Protected)
router.get('/admin/config', protect, getAdminCouponConfig);
router.put('/admin/config', protect, updateAdminCouponConfig);
router.get('/admin/issued', protect, getIssuedCouponsAdmin);
router.put('/admin/status/:userId', protect, updateUserCouponStatusAdmin);

module.exports = router;
