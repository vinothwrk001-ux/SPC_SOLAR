const mongoose = require('mongoose');

const solarCalculatorConfigSchema = new mongoose.Schema({
  version: { type: String, default: '1.0.0' },
  status: { type: String, enum: ['Published', 'Draft', 'Archived'], default: 'Published' },
  
  // Generation Configuration
  generationFactor: { type: Number, default: 4.2 }, // kWh per kW per day
  generationFactorUnit: { type: String, enum: ['daily', 'monthly', 'annual'], default: 'daily' },
  peakSunHours: { type: Number, default: 5.0 },
  performanceRatio: { type: Number, default: 80 }, // %
  lossMode: { type: String, enum: ['ratio', 'detailed'], default: 'ratio' },
  losses: {
    panel: { type: Number, default: 2 },
    temp: { type: Number, default: 8 },
    inverter: { type: Number, default: 4 },
    cable: { type: Number, default: 2 },
    soiling: { type: Number, default: 3 },
    other: { type: Number, default: 1 }
  },

  // Capacity & Roof Configuration
  minCapacity: { type: Number, default: 1.0 }, // kW
  maxCapacity: { type: Number, default: 100.0 }, // kW
  capacityIncrement: { type: Number, default: 0.01 }, // kW (e.g. 10.26 kw exact precision like SolarSquare)
  roofAreaSqFtPerKW: { type: Number, default: 60 }, // sq.ft per kW (SolarSquare standard e.g. 608 sq.ft for 10.26kW)

  // Bill Slider Range (Configurable by Admin)
  minBillAmount: { type: Number, default: 500 },
  maxBillAmount: { type: Number, default: 50000 },
  defaultBillAmount: { type: Number, default: 6900 },

  // Tariff & Lifetime Savings Configuration
  baseTariff: { type: Number, default: 8.5 }, // ₹ per kWh
  tariffInflationRate: { type: Number, default: 3.5 }, // % annual tariff rise
  lifetimeYears: { type: Number, default: 25 }, // 25-year lifetime savings horizon
  guaranteeBadgeText: { type: String, default: 'We offer 25-year performance warranty with GoodZero™ Solar Protection' },

  // Pincode / City Lookup Rules (Configurable by Admin)
  pincodeRules: [{
    pincode: String,
    city: String,
    state: String,
    tariff: Number,
    generationFactor: Number
  }],

  // Pricing Configuration
  pricingModel: { type: String, enum: ['perKW', 'component', 'hybrid'], default: 'perKW' },
  perKwPrice: { type: Number, default: 45000 }, // ₹ per kW
  gstRate: { type: Number, default: 12 }, // %
  gstInclusive: { type: Boolean, default: false },

  // Subsidy Configuration
  subsidyEnabled: { type: Boolean, default: true },
  subsidyRules: [{
    minKW: Number,
    maxKW: Number,
    subsidyPerKW: Number,
    maxCap: Number
  }],
  subsidyDisclaimer: { type: String, default: 'Government subsidy estimates are subject to scheme eligibility and state authority approvals (e.g. PM Surya Ghar).' },

  // Payback & Coverage Configuration
  paybackEnabled: { type: Boolean, default: true },
  solarCoverageOptions: { type: [Number], default: [50, 75, 100] },
  
  // Seasonal factors (1.0 = baseline 100%)
  monthlyFactorMode: { type: String, enum: ['constant', 'seasonal'], default: 'seasonal' },
  monthlyFactors: {
    Jan: { type: Number, default: 0.95 },
    Feb: { type: Number, default: 1.00 },
    Mar: { type: Number, default: 1.10 },
    Apr: { type: Number, default: 1.15 },
    May: { type: Number, default: 1.20 },
    Jun: { type: Number, default: 0.90 },
    Jul: { type: Number, default: 0.80 },
    Aug: { type: Number, default: 0.82 },
    Sep: { type: Number, default: 0.92 },
    Oct: { type: Number, default: 1.02 },
    Nov: { type: Number, default: 1.00 },
    Dec: { type: Number, default: 0.94 }
  },

  disclaimerText: {
    type: String,
    default: 'Solar generation, savings, system capacity, pricing and payback figures shown are estimates based on the information provided and configured assumptions.'
  },

  updatedBy: { type: String, default: 'System Admin' }
}, { timestamps: true });

module.exports = mongoose.model('SolarCalculatorConfig', solarCalculatorConfigSchema);
