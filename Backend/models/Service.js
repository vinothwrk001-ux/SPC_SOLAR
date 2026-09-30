const mongoose = require('mongoose');

const serviceSchema = new mongoose.Schema({
  title: String,
  slug: String,
  icon: String,
  shortDesc: String,
  fullDesc: String,
  benefits: [String],
  startingPrice: Number,
  image: String,
  isActive: { type: Boolean, default: true },
  order: Number,
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Service', serviceSchema);
