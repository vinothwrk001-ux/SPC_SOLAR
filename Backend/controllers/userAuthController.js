const User = require('../models/User');
const Quotation = require('../models/Quotation');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { assignWelcomeCouponToUser } = require('./couponController');

// Helper to generate JWT token
const generateToken = (id) => {
  return jwt.sign({ id, role: 'user' }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE || '7d',
  });
};

// @desc    Register a new user
// @route   POST /api/user/register
// @access  Public
const registerUser = async (req, res) => {
  try {
    const { name, email, password, phone, address } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: 'Please provide name, email, and password' });
    }

    if (password.length < 6) {
      return res.status(400).json({ message: 'Password must be at least 6 characters long' });
    }

    const emailRegex = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ message: 'Please provide a valid email address' });
    }

    // Check if user exists
    const userExists = await User.findOne({ email: email.toLowerCase().trim() });
    if (userExists) {
      return res.status(400).json({ message: 'An account with this email already exists' });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create user
    const user = await User.create({
      name: name.trim(),
      email: email.toLowerCase().trim(),
      password: hashedPassword,
      phone: phone ? phone.trim() : '',
      address: address || {},
    });

    if (user) {
      // Automatically associate any prior anonymous quotes submitted with this email or phone
      try {
        const query = [{ email: user.email }];
        if (user.phone) query.push({ phone: user.phone });
        await Quotation.updateMany(
          { $or: query, user: { $exists: false } },
          { $set: { user: user._id } }
        );
      } catch (err) {
        console.warn('Could not link prior quotes:', err.message);
      }

      // Automatically assign welcome coupon if active
      await assignWelcomeCouponToUser(user);

      res.status(201).json({
        _id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        address: user.address,
        role: user.role,
        coupon: user.coupon,
        token: generateToken(user._id),
        message: 'Account created successfully!',
      });
    } else {
      res.status(400).json({ message: 'Invalid user data received' });
    }
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ message: error.message || 'Server error during registration' });
  }
};

// @desc    Authenticate user & get token
// @route   POST /api/user/login
// @access  Public
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Please provide both email and password' });
    }

    const user = await User.findOne({ email: email.toLowerCase().trim() });

    if (user && (await user.matchPassword(password))) {
      // Ensure user has welcome coupon if eligible
      if (!user.coupon || !user.coupon.code || user.coupon.status === 'None') {
        await assignWelcomeCouponToUser(user);
      }

      res.json({
        _id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        address: user.address,
        role: user.role,
        coupon: user.coupon,
        token: generateToken(user._id),
        message: 'Logged in successfully!',
      });
    } else {
      res.status(401).json({ message: 'Invalid email or password' });
    }
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: error.message || 'Server error during login' });
  }
};

// @desc    Get user profile
// @route   GET /api/user/me
// @access  Private (User)
const getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('-password');
    if (user) {
      res.json(user);
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update user profile
// @route   PUT /api/user/profile
// @access  Private (User)
const updateUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    if (user) {
      user.name = req.body.name?.trim() || user.name;
      user.phone = req.body.phone?.trim() !== undefined ? req.body.phone.trim() : user.phone;
      
      if (req.body.address) {
        user.address = {
          street: req.body.address.street ?? user.address?.street ?? '',
          city: req.body.address.city ?? user.address?.city ?? '',
          state: req.body.address.state ?? user.address?.state ?? '',
          pincode: req.body.address.pincode ?? user.address?.pincode ?? '',
        };
      }

      const updatedUser = await user.save();

      res.json({
        _id: updatedUser._id,
        name: updatedUser.name,
        email: updatedUser.email,
        phone: updatedUser.phone,
        address: updatedUser.address,
        role: updatedUser.role,
        message: 'Profile updated successfully',
      });
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Change password
// @route   PUT /api/user/change-password
// @access  Private (User)
const changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({ message: 'Please provide both current and new passwords' });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({ message: 'New password must be at least 6 characters long' });
    }

    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const isMatch = await user.matchPassword(currentPassword);
    if (!isMatch) {
      return res.status(400).json({ message: 'Current password is incorrect' });
    }

    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(newPassword, salt);
    await user.save();

    res.json({ message: 'Password changed successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get quotations for logged-in user
// @route   GET /api/user/quotations
// @access  Private (User)
const getUserQuotations = async (req, res) => {
  try {
    const user = req.user;
    const query = [{ user: user._id }];
    if (user.email) query.push({ email: user.email });
    if (user.phone) query.push({ phone: user.phone });

    const quotations = await Quotation.find({ $or: query }).sort({ createdAt: -1 });

    res.json(quotations);
  } catch (error) {
    console.error('Error fetching user quotations:', error);
    res.status(500).json({ message: error.message });
  }
};

// @desc    Logout user
// @route   POST /api/user/logout
// @access  Public
const logoutUser = (req, res) => {
  res.json({ message: 'Logged out successfully' });
};

module.exports = {
  registerUser,
  loginUser,
  getUserProfile,
  updateUserProfile,
  changePassword,
  getUserQuotations,
  logoutUser,
};
