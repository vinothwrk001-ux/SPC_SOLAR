const SolarCalculatorConfig = require('../models/SolarCalculatorConfig');
const SolarPanel = require('../models/SolarPanel');
const SolarInverter = require('../models/SolarInverter');
const Quotation = require('../models/Quotation');
const User = require('../models/User');
const { getActiveConfig, calculateSolar } = require('../services/solarCalculatorService');

// --- PUBLIC APIS ---

// @desc Get public solar calculator config & masters
// @route GET /api/solar-calculator/config
const getPublicConfig = async (req, res) => {
  try {
    const config = await getActiveConfig();
    const panels = await SolarPanel.find({ status: 'Active' }).select('-price');
    const inverters = await SolarInverter.find({ status: 'Active' }).select('-price');

    res.json({
      config: {
        solarCoverageOptions: config.solarCoverageOptions,
        baseTariff: config.baseTariff,
        perKwPrice: config.perKwPrice,
        minCapacity: config.minCapacity,
        maxCapacity: config.maxCapacity,
        roofAreaSqFtPerKW: config.roofAreaSqFtPerKW,
        minBillAmount: config.minBillAmount,
        maxBillAmount: config.maxBillAmount,
        defaultBillAmount: config.defaultBillAmount,
        guaranteeBadgeText: config.guaranteeBadgeText,
        disclaimerText: config.disclaimerText,
        subsidyEnabled: config.subsidyEnabled,
        subsidyDisclaimer: config.subsidyDisclaimer,
        paybackEnabled: config.paybackEnabled
      },
      panels,
      inverters
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc Process dynamic calculation
// @route POST /api/solar-calculator/calculate
const performCalculation = async (req, res) => {
  try {
    const result = await calculateSolar(req.body);
    res.json(result);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc Create lead from calculator result
// @route POST /api/solar-calculator/leads
const createCalculatorLead = async (req, res) => {
  try {
    const {
      name,
      phone,
      email,
      location,
      state,
      propertyType,
      roofType,
      roofArea,
      connectionType,
      phase,
      calculationResult,
      appliedCoupon,
      couponDiscount,
      netCost
    } = req.body;

    if (!name || !phone) {
      return res.status(400).json({ message: 'Name and Phone are required' });
    }

    let userId = req.user ? req.user._id : undefined;

    // If unauthenticated, try to find an existing user with matching email or phone
    if (!userId) {
      try {
        const query = [];
        if (email) query.push({ email: email.toLowerCase().trim() });
        if (phone) query.push({ phone: phone.trim() });
        if (query.length > 0) {
          const matchedUser = await User.findOne({ $or: query });
          if (matchedUser) {
            userId = matchedUser._id;
          }
        }
      } catch (err) {
        console.warn('User matching error:', err.message);
      }
    }

    const discount = Number(couponDiscount) || 0;
    const computedNetCost = netCost !== undefined 
      ? Number(netCost) 
      : (calculationResult?.netCost ? Math.max(0, calculationResult.netCost - discount) : calculationResult?.netCost);

    const leadData = {
      user: userId,
      name,
      phone,
      email,
      location,
      state,
      propertyType,
      roofType,
      roofArea,
      connectionType,
      phase,

      monthlyBill: calculationResult?.calcBill,
      monthlyConsumption: calculationResult?.calcConsumption,
      effectiveTariff: calculationResult?.effectiveTariff,
      solarCoverage: calculationResult?.solarCoverage,

      recommendedKW: calculationResult?.recommendedKW,
      panelModel: calculationResult?.panelModel,
      panelWattage: calculationResult?.panelWattage,
      panelCount: calculationResult?.panelCount,
      inverterModel: calculationResult?.inverterModel,

      dailyGeneration: calculationResult?.dailyGeneration,
      monthlyGeneration: calculationResult?.monthlyGeneration,
      annualGeneration: calculationResult?.annualGeneration,

      estimatedCost: calculationResult?.estimatedCost,
      centralSubsidy: calculationResult?.centralSubsidy,
      couponDiscount: discount,
      appliedCoupon: appliedCoupon || (discount > 0 ? { discountAmount: discount } : undefined),
      netCost: computedNetCost,
      monthlySavings: calculationResult?.monthlySavings,
      annualSavings: calculationResult?.annualSavings,
      roiYears: calculationResult?.roiYears,
      roofWarning: calculationResult?.roofWarning,

      calculationSnapshot: calculationResult?.calculationSnapshot || {},
      status: 'New'
    };

    const newQuotationLead = new Quotation(leadData);
    const savedLead = await newQuotationLead.save();

    res.status(201).json({
      message: 'Lead captured successfully',
      leadId: savedLead._id,
      savedLead
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};


// --- ADMIN APIS ---

// @desc Get full admin configuration
// @route GET /api/admin/solar-calculator/config
const getAdminConfig = async (req, res) => {
  try {
    const config = await getActiveConfig();
    res.json(config);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc Update admin configuration & publish new version
// @route PUT /api/admin/solar-calculator/config
const updateAdminConfig = async (req, res) => {
  try {
    let config = await SolarCalculatorConfig.findOne({ status: 'Published' });
    if (!config) {
      config = new SolarCalculatorConfig(req.body);
    } else {
      Object.assign(config, req.body);
      // Auto-increment version if needed
      const currentVerParts = (config.version || '1.0.0').split('.');
      const minor = parseInt(currentVerParts[2] || '0') + 1;
      config.version = `${currentVerParts[0]}.${currentVerParts[1]}.${minor}`;
    }
    config.updatedBy = req.admin?.username || 'Admin';

    const updated = await config.save();
    res.json(updated);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// --- PANELS MASTER ADMIN APIS ---
const getPanels = async (req, res) => {
  try {
    const panels = await SolarPanel.find().sort({ createdAt: -1 });
    res.json(panels);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const createPanel = async (req, res) => {
  try {
    if (req.body.isDefault) {
      await SolarPanel.updateMany({}, { isDefault: false });
    }
    const panel = new SolarPanel(req.body);
    const saved = await panel.save();
    res.status(201).json(saved);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const updatePanel = async (req, res) => {
  try {
    if (req.body.isDefault) {
      await SolarPanel.updateMany({ _id: { $ne: req.params.id } }, { isDefault: false });
    }
    const updated = await SolarPanel.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updated);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const deletePanel = async (req, res) => {
  try {
    await SolarPanel.findByIdAndDelete(req.params.id);
    res.json({ message: 'Panel removed' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// --- INVERTERS MASTER ADMIN APIS ---
const getInverters = async (req, res) => {
  try {
    const inverters = await SolarInverter.find().sort({ createdAt: -1 });
    res.json(inverters);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const createInverter = async (req, res) => {
  try {
    if (req.body.isDefault) {
      await SolarInverter.updateMany({}, { isDefault: false });
    }
    const inverter = new SolarInverter(req.body);
    const saved = await inverter.save();
    res.status(201).json(saved);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const updateInverter = async (req, res) => {
  try {
    if (req.body.isDefault) {
      await SolarInverter.updateMany({ _id: { $ne: req.params.id } }, { isDefault: false });
    }
    const updated = await SolarInverter.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updated);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const deleteInverter = async (req, res) => {
  try {
    await SolarInverter.findByIdAndDelete(req.params.id);
    res.json({ message: 'Inverter removed' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getPublicConfig,
  performCalculation,
  createCalculatorLead,
  getAdminConfig,
  updateAdminConfig,
  getPanels,
  createPanel,
  updatePanel,
  deletePanel,
  getInverters,
  createInverter,
  updateInverter,
  deleteInverter
};
