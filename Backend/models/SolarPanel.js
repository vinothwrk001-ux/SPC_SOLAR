const mongoose = require('mongoose');

const solarPanelSchema = new mongoose.Schema({
  manufacturer: { type: String, required: true },
  brand: { type: String, required: true },
  model: { type: String, required: true },
  wattage: { type: Number, required: true }, // e.g. 550
  efficiency: { type: Number, default: 21.5 }, // %
  price: { type: Number, default: 12000 },
  gst: { type: Number, default: 12 },
  warrantyYears: { type: Number, default: 25 },
  isDefault: { type: Boolean, default: false },
  status: { type: String, enum: ['Active', 'Inactive'], default: 'Active' }
}, { timestamps: true });

module.exports = mongoose.model('SolarPanel', solarPanelSchema);
