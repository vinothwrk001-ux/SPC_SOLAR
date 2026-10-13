const mongoose = require('mongoose');

const serviceSchema = new mongoose.Schema({
  title: { type: String, required: true },
  slug: { type: String },
  category: { type: String, default: 'Residential' },
  price: { type: String, default: '₹65,000 / kW' },
  startingPrice: { type: Number },
  capacity: { type: String, default: '1 kW – 10 kW' },
  warranty: { type: String, default: '25 Years' },
  shortDesc: { type: String, default: '' },
  fullDesc: { type: String, default: '' },
  benefits: [{ type: String }],
  image: { type: String, default: '' },
  isActive: { type: Boolean, default: true },
  isFeatured: { type: Boolean, default: true },
  order: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Service', serviceSchema);
