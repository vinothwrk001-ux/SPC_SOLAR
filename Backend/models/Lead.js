const mongoose = require('mongoose');

const leadSchema = new mongoose.Schema({
  phone: { type: String, required: true },
  password: { type: String, required: true },
  name: { type: String, default: '' },
  city: { type: String, default: '' },
  state: { type: String, default: '' },
  status: { type: String, default: 'New' },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Lead', leadSchema);
