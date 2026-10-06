const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please add a name'],
      trim: true,
    },
    email: {
      type: String,
      required: [true, 'Please add an email'],
      unique: true,
      lowercase: true,
      trim: true,
      match: [
        /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
        'Please add a valid email',
      ],
    },
    password: {
      type: String,
      required: [true, 'Please add a password'],
      minlength: [6, 'Password must be at least 6 characters'],
    },
    phone: {
      type: String,
      trim: true,
      default: '',
    },
    address: {
      street: { type: String, default: '' },
      city: { type: String, default: '' },
      state: { type: String, default: 'Tamil Nadu' },
      pincode: { type: String, default: '' },
    },
    role: {
      type: String,
      enum: ['user'],
      default: 'user',
    },
    avatar: {
      type: String,
      default: '',
    },
    coupon: {
      code: { type: String, default: '' },
      discountAmount: { type: Number, default: 0 },
      title: { type: String, default: '' },
      description: { type: String, default: '' },
      status: {
        type: String,
        enum: ['Active', 'Claimed', 'Expired', 'None'],
        default: 'None',
      },
      issuedAt: { type: Date },
      expiresAt: { type: Date },
      claimedAt: { type: Date },
      claimedNotes: { type: String, default: '' },
    },
  },
  {
    timestamps: true,
  }
);

// Match user entered password to hashed password in database
userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model('User', userSchema);
