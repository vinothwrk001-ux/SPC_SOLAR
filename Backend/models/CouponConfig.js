const mongoose = require('mongoose');

const couponConfigSchema = new mongoose.Schema(
  {
    isActive: {
      type: Boolean,
      default: true,
    },
    codeType: {
      type: String,
      enum: ['fixed', 'unique'],
      default: 'fixed',
    },
    couponCode: {
      type: String,
      default: 'WELCOME1000',
      trim: true,
      uppercase: true,
    },
    codePrefix: {
      type: String,
      default: 'SPC',
      trim: true,
      uppercase: true,
    },
    discountAmount: {
      type: Number,
      default: 1000,
      min: [0, 'Discount amount cannot be negative'],
    },
    title: {
      type: String,
      default: 'New Customer Solar Welcome Voucher',
      trim: true,
    },
    description: {
      type: String,
      default: 'Special installation discount deducted from your final turnkey rooftop solar invoice.',
      trim: true,
    },
    minSystemSizeKW: {
      type: Number,
      default: 1,
    },
    validityDays: {
      type: Number,
      default: 60,
    },
    terms: {
      type: [String],
      default: [
        'Valid on all grid-connected rooftop solar installations (1 kW and above).',
        'Discount is directly deducted from the final turnkey installation invoice after installation.',
        'Applicable once per registered consumer connection.',
        'Can be combined with PM Surya Ghar Muft Bijli Yojana Central Subsidy.',
      ],
    },
    updatedBy: {
      type: String,
      default: 'Admin',
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('CouponConfig', couponConfigSchema);
