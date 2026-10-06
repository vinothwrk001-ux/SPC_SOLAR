const express = require('express');
const router = express.Router();
const {
  registerUser,
  loginUser,
  getUserProfile,
  updateUserProfile,
  changePassword,
  getUserQuotations,
  logoutUser,
} = require('../controllers/userAuthController');
const { protectUser } = require('../middleware/userAuthMiddleware');

// Public routes
router.post('/register', registerUser);
router.post('/login', loginUser);
router.post('/logout', logoutUser);

// Protected routes (Logged in user only)
router.get('/me', protectUser, getUserProfile);
router.put('/profile', protectUser, updateUserProfile);
router.put('/change-password', protectUser, changePassword);
router.get('/quotations', protectUser, getUserQuotations);

module.exports = router;
