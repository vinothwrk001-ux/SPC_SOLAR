const mongoose = require('mongoose');

const quotationSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  name: { type: String, required: true },
  phone: { type: String, required: true },
  email: String,
  location: String,
  state: String,
  propertyType: { type: String, default: 'Residential' },
  roofType: { type: String, default: 'RCC' },
  roofArea: Number,
  connectionType: { type: String, default: 'On Grid' },
  phase: { type: String, default: 'Single' },
  
  // Inputs from calculator
  inputType: { type: String, enum: ['bill', 'consumption', 'both'], default: 'bill' },
  monthlyBill: Number,
  monthlyConsumption: Number,
  effectiveTariff: Number,
  solarCoverage: { type: Number, default: 100 },
  
  // Output parameters
  recommendedKW: Number,
  panelModel: String,
  panelWattage: Number,
  panelCount: Number,
  inverterModel: String,
  
  dailyGeneration: Number,
  monthlyGeneration: Number,
  annualGeneration: Number,
  
  estimatedCost: Number,
  centralSubsidy: Number,
  couponDiscount: { type: Number, default: 0 },
  appliedCoupon: {
    code: String,
    discountAmount: Number,
  },
  netCost: Number,
  monthlySavings: Number,
  annualSavings: Number,
  roiYears: Number,
  roofWarning: { type: Boolean, default: false },

  // Auditability Snapshot (Version + All configuration parameters active at quotation time)
  calculationSnapshot: { type: Object },

  pdfUrl: String,
  status: { type: String, default: 'New' },
  adminNotes: String,
  sentViaWhatsApp: { type: Boolean, default: false },
  sentViaEmail: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Quotation', quotationSchema);
