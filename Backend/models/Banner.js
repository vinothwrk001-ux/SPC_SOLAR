const mongoose = require('mongoose');

const bannerSchema = new mongoose.Schema({
  mediaUrl: {
    type: String,
    default: '',
  },
  imageUrl: {
    type: String,
    default: '',
  },
  mediaType: {
    type: String,
    enum: ['image', 'video'],
    default: 'image',
  },
  title: {
    type: String,
    default: '',
  },
  subtitle: {
    type: String,
    default: '',
  },
  ctaText: {
    type: String,
    default: '',
  },
  ctaUrl: {
    type: String,
    default: '',
  },
  secondaryCtaText: {
    type: String,
    default: '',
  },
  secondaryCtaUrl: {
    type: String,
    default: '',
  },
  order: {
    type: Number,
    default: 0,
  },
  isActive: {
    type: Boolean,
    default: true,
  },
}, { timestamps: true });

bannerSchema.pre('validate', function () {
  if (!this.imageUrl && this.mediaUrl) {
    this.imageUrl = this.mediaUrl;
  }
  if (!this.mediaUrl && this.imageUrl) {
    this.mediaUrl = this.imageUrl;
  }
});

module.exports = mongoose.model('Banner', bannerSchema);
