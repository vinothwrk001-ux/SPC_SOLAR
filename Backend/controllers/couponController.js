const CouponConfig = require('../models/CouponConfig');
const User = require('../models/User');

// Helper to get or initialize default config
const getOrCreateDefaultConfig = async () => {
  let config = await CouponConfig.findOne();
  if (!config) {
    config = await CouponConfig.create({
      isActive: true,
      codeType: 'fixed',
      couponCode: 'WELCOME1000',
      codePrefix: 'SPC',
      discountAmount: 1000,
      title: 'New Customer Installation Discount',
      description: 'Flat ₹1,000 reduction applied on your final rooftop solar turnkey installation invoice.',
      minSystemSizeKW: 1,
      validityDays: 60,
      terms: [
        'Valid on all grid-connected rooftop solar installations (1 kW and above).',
        'Discount amount is directly deducted from the final turnkey installation invoice after installation.',
        'Applicable once per registered consumer connection.',
        'Can be combined with PM Surya Ghar Muft Bijli Yojana Central Subsidy.',
      ],
      updatedBy: 'System',
    });
  }
  return config;
};

// Helper: Assign welcome coupon to a user if eligible
const assignWelcomeCouponToUser = async (user) => {
  try {
    // If user already has a valid coupon, don't overwrite
    if (user.coupon && user.coupon.code && user.coupon.status !== 'None') {
      return user.coupon;
    }

    const config = await getOrCreateDefaultConfig();
    if (!config.isActive) {
      return null;
    }

    let generatedCode = config.couponCode || 'WELCOME1000';
    if (config.codeType === 'unique') {
      const randomSuffix = Math.random().toString(36).substring(2, 6).toUpperCase();
      generatedCode = `${config.codePrefix || 'SPC'}-${config.discountAmount}-${randomSuffix}`;
    }

    const now = new Date();
    const expiresAt = new Date(now.getTime() + (config.validityDays || 60) * 24 * 60 * 60 * 1000);

    user.coupon = {
      code: generatedCode,
      discountAmount: config.discountAmount || 1000,
      title: config.title || 'New Customer Installation Discount',
      description: config.description || 'Flat reduction on final installation invoice.',
      status: 'Active',
      issuedAt: now,
      expiresAt: expiresAt,
      claimedAt: null,
      claimedNotes: '',
    };

    await user.save();
    return user.coupon;
  } catch (error) {
    console.error('Error assigning welcome coupon:', error);
    return null;
  }
};

// @desc    Get public coupon configuration (for Calculator, Banners)
// @route   GET /api/coupon/config
// @access  Public
const getPublicCouponConfig = async (req, res) => {
  try {
    const config = await getOrCreateDefaultConfig();
    res.json({
      isActive: config.isActive,
      couponCode: config.couponCode,
      discountAmount: config.discountAmount,
      title: config.title,
      description: config.description,
      minSystemSizeKW: config.minSystemSizeKW,
      terms: config.terms,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get admin coupon configuration
// @route   GET /api/coupon/admin/config
// @access  Private (Admin)
const getAdminCouponConfig = async (req, res) => {
  try {
    const config = await getOrCreateDefaultConfig();
    res.json(config);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update admin coupon configuration
// @route   PUT /api/coupon/admin/config
// @access  Private (Admin)
const updateAdminCouponConfig = async (req, res) => {
  try {
    let config = await CouponConfig.findOne();
    if (!config) {
      config = new CouponConfig(req.body);
    } else {
      Object.assign(config, req.body);
    }

    config.updatedBy = req.admin?.username || 'Admin';
    const updated = await config.save();

    res.json({
      message: 'Coupon configuration updated successfully!',
      config: updated,
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Get all users with issued welcome coupons (Admin view)
// @route   GET /api/coupon/admin/issued
// @access  Private (Admin)
const getIssuedCouponsAdmin = async (req, res) => {
  try {
    const users = await User.find({
      'coupon.code': { $exists: true, $ne: '' },
      'coupon.status': { $in: ['Active', 'Claimed', 'Expired'] },
    })
      .select('name email phone address coupon createdAt')
      .sort({ 'coupon.issuedAt': -1 });

    res.json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update a customer's coupon status (e.g. Mark as Claimed / Deducted after installation)
// @route   PUT /api/coupon/admin/status/:userId
// @access  Private (Admin)
const updateUserCouponStatusAdmin = async (req, res) => {
  try {
    const { status, claimedNotes } = req.body;
    const user = await User.findById(req.params.userId);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (!user.coupon) {
      return res.status(400).json({ message: 'User does not have a coupon' });
    }

    user.coupon.status = status || user.coupon.status;
    if (status === 'Claimed') {
      user.coupon.claimedAt = new Date();
    }
    if (claimedNotes !== undefined) {
      user.coupon.claimedNotes = claimedNotes;
    }

    await user.save();

    res.json({
      message: `Coupon status updated to ${user.coupon.status}`,
      coupon: user.coupon,
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

module.exports = {
  getOrCreateDefaultConfig,
  assignWelcomeCouponToUser,
  getPublicCouponConfig,
  getAdminCouponConfig,
  updateAdminCouponConfig,
  getIssuedCouponsAdmin,
  updateUserCouponStatusAdmin,
};
