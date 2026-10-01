const mongoose = require('mongoose');

const solarInverterSchema = new mongoose.Schema({
  manufacturer: { type: String, required: true },
  model: { type: String, required: true },
  type: { type: String, enum: ['On Grid', 'Off Grid', 'Hybrid'], default: 'On Grid' },
  capacityKW: { type: Number, required: true },
  price: { type: Number, default: 35000 },
  warrantyYears: { type: Number, default: 10 },
  isDefault: { type: Boolean, default: false },
  status: { type: String, enum: ['Active', 'Inactive'], default: 'Active' }
}, { timestamps: true });

module.exports = mongoose.model('SolarInverter', solarInverterSchema);
