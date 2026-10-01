const mongoose = require('mongoose');

const testimonialSchema = new mongoose.Schema({
  name: { type: String, required: true },
  location: { type: String, default: 'Solar Client' }, // e.g. "Homeowner, Delhi"
  systemSize: { type: String, default: '' }, // e.g. "5 kW System"
  rating: { type: Number, default: 5, min: 1, max: 5 },
  review: { type: String, required: true },
  photo: { type: String, default: '' },
  status: { type: String, enum: ['Approved', 'Pending', 'Rejected'], default: 'Pending' },
  source: { type: String, enum: ['Customer', 'Admin'], default: 'Customer' },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Testimonial', testimonialSchema);
