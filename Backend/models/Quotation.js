const mongoose = require('mongoose');

const quotationSchema = new mongoose.Schema({
  name: String,
  phone: String,
  email: String,
  location: String,
  state: String,
  monthlyBill: Number,
  connectionType: String,
  roofArea: Number,
  phase: String,
  recommendedKW: Number,
  estimatedCost: Number,
  centralSubsidy: Number,
  netCost: Number,
  monthlySavings: Number,
  roiYears: Number,
  annualGeneration: Number,
  pdfUrl: String,
  status: { type: String, default: 'New' },
  adminNotes: String,
  sentViaWhatsApp: { type: Boolean, default: false },
  sentViaEmail: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Quotation', quotationSchema);
