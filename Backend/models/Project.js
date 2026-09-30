const mongoose = require('mongoose');

const projectSchema = new mongoose.Schema({
  title: String,
  location: String,
  capacity: String,
  clientType: String,
  description: String,
  images: [String],
  completedDate: Date,
  isFeatures: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Project', projectSchema);
