const SolarCalculatorConfig = require('../models/SolarCalculatorConfig');
const SolarPanel = require('../models/SolarPanel');
const SolarInverter = require('../models/SolarInverter');

/**
 * Get active configuration or seed defaults if none exist
 */
const getActiveConfig = async () => {
  let config = await SolarCalculatorConfig.findOne({ status: 'Published' });
  if (!config) {
    config = await SolarCalculatorConfig.create({
      version: '1.0.0',
      status: 'Published'
    });
  }
  return config;
};

/**
 * Perform dynamic solar calculation matching SolarSquare precision
 */
const calculateSolar = async (inputData) => {
  const config = await getActiveConfig();

  // 1. Get Panels & Inverters
  const panels = await SolarPanel.find({ status: 'Active' });
  let panel = panels.find(p => p._id.toString() === inputData.panelId) || panels.find(p => p.isDefault) || panels[0];
  
  if (!panel) {
    panel = {
      manufacturer: 'Tier 1 Standard',
      brand: 'Mono PERC Half-Cut',
      model: '550W High Efficiency',
      wattage: 550,
      efficiency: 21.5,
      price: 12500
    };
  }

  const inverters = await SolarInverter.find({ status: 'Active' });

  // 2. Parse Inputs & Pincode Lookup
  const {
    monthlyBill = config.defaultBillAmount || 6900,
    monthlyConsumption = 0,
    pincode = '641101',
    city = 'Coimbatore',
    state = 'Tamil Nadu',
    solarCoverage = 100,
    propertyType = 'Residential',
    roofType = 'RCC',
    gridConnection = 'On Grid'
  } = inputData;

  // Check if pincode has specific tariff override
  let activeTariff = config.baseTariff || 8.5;
  let activeGenFactor = config.generationFactor || 4.2;

  if (pincode && config.pincodeRules && config.pincodeRules.length > 0) {
    const matchedRule = config.pincodeRules.find(r => r.pincode === pincode.toString().trim());
    if (matchedRule) {
      if (matchedRule.tariff) activeTariff = matchedRule.tariff;
      if (matchedRule.generationFactor) activeGenFactor = matchedRule.generationFactor;
    }
  }

  let calcBill = Number(monthlyBill) || 6900;
  let calcConsumption = Number(monthlyConsumption) || 0;

  if (calcConsumption <= 0 && calcBill > 0) {
    calcConsumption = Math.round(calcBill / activeTariff);
  }

  // 3. Solar Target kWh
  const targetMonthlykWh = (calcConsumption * solarCoverage) / 100;

  // 4. Calculate Exact System Capacity (kW)
  const prFactor = config.lossMode === 'ratio' ? (config.performanceRatio / 100) : 0.80;
  const dailyGenPerKW = activeGenFactor * prFactor;
  const monthlyGenPerKW = dailyGenPerKW * 30;

  let rawKW = targetMonthlykWh / monthlyGenPerKW;

  const minKW = config.minCapacity || 1.0;
  const maxKW = config.maxCapacity || 100.0;
  
  // Exact double decimal system size (e.g. 10.26 kw)
  let systemSizeKW = Math.max(minKW, Math.min(maxKW, rawKW));
  systemSizeKW = Number(systemSizeKW.toFixed(2));

  // 5. Calculate Required Roof Area (e.g. 608 sq. ft.)
  const roofAreaPerKW = config.roofAreaSqFtPerKW || 60;
  const requiredRoofArea = Math.round(systemSizeKW * roofAreaPerKW);

  // 6. Panel Count & Inverter
  const panelWattage = panel.wattage || 550;
  const panelCount = Math.ceil((systemSizeKW * 1000) / panelWattage);

  let selectedInverter = inverters.find(i => i.type === gridConnection && i.capacityKW >= systemSizeKW);
  if (!selectedInverter) {
    selectedInverter = inverters.find(i => i.isDefault) || {
      manufacturer: 'Premium Tier 1',
      model: `${systemSizeKW} kW ${gridConnection} Smart Inverter`,
      capacityKW: systemSizeKW,
      type: gridConnection,
      price: Math.round(systemSizeKW * 7000)
    };
  }

  // 7. Generation Estimation
  const dailyGeneration = Math.round(systemSizeKW * dailyGenPerKW * 10) / 10;
  const monthlyGeneration = Math.round(dailyGeneration * 30);
  const annualGeneration = Math.round(dailyGeneration * 365);

  // 8. Financial Savings (Monthly, Yearly, Lifetime 25-Year)
  const energyOffsetKWh = Math.min(monthlyGeneration, calcConsumption);
  const monthlySavings = Math.round(energyOffsetKWh * activeTariff);
  const yearlySavings = Math.round(monthlySavings * 12);

  // Lifetime Cumulative 25-Year Savings with Tariff Inflation
  const inflationRate = (config.tariffInflationRate || 3.5) / 100;
  const lifetimeHorizon = config.lifetimeYears || 25;
  let lifetimeSavings = 0;
  let currentYearSavings = yearlySavings;

  for (let yr = 1; yr <= lifetimeHorizon; yr++) {
    lifetimeSavings += currentYearSavings;
    currentYearSavings = currentYearSavings * (1 + inflationRate);
  }
  lifetimeSavings = Math.round(lifetimeSavings);

  // 9. Cost, Subsidy & Net Cost
  let grossCost = 0;
  if (config.pricingModel === 'perKW') {
    grossCost = systemSizeKW * config.perKwPrice;
  } else {
    grossCost = (panelCount * (panel.price || 12000)) + (selectedInverter.price || (systemSizeKW * 7000)) + (systemSizeKW * 15000);
  }

  const gstRate = config.gstRate || 12;
  let estimatedCost = Math.round(grossCost * (1 + gstRate / 100));

  let centralSubsidy = 0;
  if (config.subsidyEnabled) {
    if (systemSizeKW <= 1) centralSubsidy = 30000;
    else if (systemSizeKW <= 2) centralSubsidy = 60000;
    else centralSubsidy = 78000;
  }

  const netCost = Math.max(0, estimatedCost - centralSubsidy);
  const roiYears = yearlySavings > 0 ? Number((netCost / yearlySavings).toFixed(1)) : 0;

  // 10. Environmental Impact
  const co2ReducedTons = Number((annualGeneration * 0.00082).toFixed(1)); // 0.82 kg CO2 per kWh
  const treesPlanted = Math.round(co2ReducedTons * 45); // ~45 trees per ton CO2

  // 11. Snapshot Audit
  const calculationSnapshot = {
    configVersion: config.version,
    timestamp: new Date(),
    inputs: { monthlyBill: calcBill, monthlyConsumption: calcConsumption, pincode, city, state },
    outputs: { systemSizeKW, requiredRoofArea, monthlySavings, yearlySavings, lifetimeSavings }
  };

  return {
    systemSizeKW,
    requiredRoofArea,
    monthlySavings,
    yearlySavings,
    lifetimeSavings,
    
    calcBill,
    calcConsumption,
    activeTariff,
    pincode,
    city,
    state,

    dailyGeneration,
    monthlyGeneration,
    annualGeneration,
    panelCount,
    panelWattage,
    panelModel: `${panel.brand} ${panel.model} (${panelWattage}W)`,
    inverterModel: selectedInverter.model,

    estimatedCost,
    centralSubsidy,
    netCost,
    roiYears,

    co2ReducedTons,
    treesPlanted,

    guaranteeBadgeText: config.guaranteeBadgeText || 'We offer 25-year performance warranty with GoodZero™',
    disclaimer: config.disclaimerText,
    calculationSnapshot
  };
};

module.exports = { getActiveConfig, calculateSolar };
