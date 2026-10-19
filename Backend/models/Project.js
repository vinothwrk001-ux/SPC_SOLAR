const mongoose = require('mongoose');

const projectSchema = new mongoose.Schema({
  title: { type: String, required: true },
  location: { type: String, required: true },
  capacity: { type: String, required: true },
  clientType: { type: String, default: 'Residential' },
  type: { type: String, default: 'Residential' },
  description: { type: String, default: '' },
  image: { type: String, default: '' },
  images: [{ type: String }],
  savings: { type: String, default: '' },
  client: { type: String, default: '' },
  completedDate: { type: Date },
  isFeatured: { type: Boolean, default: false },
  isFeatures: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Project', projectSchema);
