const mongoose = require('mongoose');

const testimonialSchema = new mongoose.Schema({
  name: String,
  location: String,
  systemSize: String,
  rating: Number,
  review: String,
  photo: String,
  isActive: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Testimonial', testimonialSchema);
