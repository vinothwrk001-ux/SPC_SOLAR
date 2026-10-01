require('dotenv').config();
const mongoose = require('mongoose');
const connectDB = require('./config/db');
const SolarCalculatorConfig = require('./models/SolarCalculatorConfig');
const SolarPanel = require('./models/SolarPanel');
const SolarInverter = require('./models/SolarInverter');

const seedSolarCalculator = async () => {
  try {
    await connectDB();
    console.log('Connected to DB...');

    // 1. Config
    const existingConfig = await SolarCalculatorConfig.findOne({ status: 'Published' });
    if (!existingConfig) {
      await SolarCalculatorConfig.create({
        version: '1.0.0',
        status: 'Published',
        generationFactor: 4.2,
        peakSunHours: 5.0,
        performanceRatio: 80,
        minCapacity: 1.0,
        maxCapacity: 100.0,
        capacityIncrement: 0.5,
        roofAreaSqFtPerKW: 80,
        baseTariff: 8.0,
        pricingModel: 'perKW',
        perKwPrice: 45000,
        gstRate: 12,
        subsidyEnabled: true,
        paybackEnabled: true
      });
      console.log('Initial SolarCalculatorConfig created.');
    }

    // 2. Solar Panels
    const panelCount = await SolarPanel.countDocuments();
    if (panelCount === 0) {
      await SolarPanel.create([
        {
          manufacturer: 'Longi Solar',
          brand: 'Hi-MO 6',
          model: '550W Mono PERC',
          wattage: 550,
          efficiency: 21.5,
          price: 12500,
          isDefault: true,
          status: 'Active'
        },
        {
          manufacturer: 'Jinko Solar',
          brand: 'Tiger Neo',
          model: '575W N-Type',
          wattage: 575,
          efficiency: 22.2,
          price: 13500,
          isDefault: false,
          status: 'Active'
        }
      ]);
      console.log('Default SolarPanels seeded.');
    }

    // 3. Inverters
    const inverterCount = await SolarInverter.countDocuments();
    if (inverterCount === 0) {
      await SolarInverter.create([
        {
          manufacturer: 'Sungrow',
          model: 'SG5.0RS 5kW String Inverter',
          type: 'On Grid',
          capacityKW: 5,
          price: 35000,
          isDefault: true,
          status: 'Active'
        },
        {
          manufacturer: 'SolarEdge',
          model: 'SE10K 10kW Hybrid Inverter',
          type: 'Hybrid',
          capacityKW: 10,
          price: 75000,
          isDefault: false,
          status: 'Active'
        }
      ]);
      console.log('Default SolarInverters seeded.');
    }

    console.log('Solar Calculator Seeding Completed Successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding solar calculator data:', error);
    process.exit(1);
  }
};

seedSolarCalculator();
