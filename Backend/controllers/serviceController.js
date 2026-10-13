const Service = require('../models/Service');
const path = require('path');
const fs = require('fs');

const INITIAL_SERVICES = [
  {
    title: 'Residential Solar (Rooftop)',
    category: 'Residential',
    price: '₹65,000 / kW',
    capacity: '1 kW – 10 kW',
    warranty: '25–30 Years Panel Warranty',
    shortDesc: 'Transform your unused roof into a power plant. Generate clean electricity, drastically reduce electricity bills, and secure PM Surya Ghar subsidy.',
    fullDesc: 'Complete residential rooftop solar solutions with net-metering synchronization and government subsidy processing up to ₹78,000.',
    benefits: [
      'Up to 100% reduction in electricity bills',
      'PM Surya Ghar subsidy up to ₹78,000',
      'Increases property value',
      'Net-metering support'
    ],
    image: 'https://images.unsplash.com/photo-1509391366360-5157625bf958?auto=format&fit=crop&q=80&w=800',
    isActive: true,
    isFeatured: true,
    order: 1
  },
  {
    title: 'Commercial Solar',
    category: 'Commercial',
    price: '₹58,000 / kW',
    capacity: '10 kW – 100 kW+',
    warranty: '25 Years Performance Warranty',
    shortDesc: 'Empower your business with clean energy. Lock in your energy costs for the next 25 years and achieve your ESG carbon reduction goals.',
    fullDesc: 'Tailored commercial solar power systems for malls, hospitals, office campuses, and institutions with 40% accelerated depreciation.',
    benefits: [
      'Accelerated depreciation benefits (up to 40%)',
      'Protection against tariff hikes',
      'Quick ROI (3–4 years)',
      'Green building certifications'
    ],
    image: 'https://images.unsplash.com/photo-1592833159155-c62df1b65634?auto=format&fit=crop&q=80&w=800',
    isActive: true,
    isFeatured: true,
    order: 2
  },
  {
    title: 'Industrial Solar (EPC)',
    category: 'Industrial',
    price: '₹55,000 / kW',
    capacity: '100 kW – Multi-Megawatt',
    warranty: '25 Years Performance Guarantee',
    shortDesc: 'Large-scale megawatt installations designed for maximum efficiency and durability — complete Engineering, Procurement, and Construction.',
    fullDesc: 'High-voltage industrial captive solar power plants with heavy-duty mounting structures and remote SCADA generation telemetry.',
    benefits: [
      'Dramatic reduction in operating expenses',
      'Zero production disruptions during installation',
      'Heavy-duty wind resistant structures',
      'Grid synchronization and HT metering'
    ],
    image: 'https://images.unsplash.com/photo-1497435334941-8c899ee9e8e9?auto=format&fit=crop&q=80&w=800',
    isActive: true,
    isFeatured: true,
    order: 3
  },
  {
    title: 'Solar Maintenance & AMC',
    category: 'Maintenance',
    price: '₹1,200 / panel/yr',
    capacity: 'All system sizes',
    warranty: '24/7 Technician Dispatch SLA',
    shortDesc: 'Keep your solar plant operating at peak efficiency. Regular robotic panel cleaning, inverter diagnostics, string testing, and warranty claims.',
    fullDesc: 'Preventive maintenance, thermal drone imaging, inverter servicing, and immediate breakdown support.',
    benefits: [
      'Up to 25% higher annual power yield',
      'Preventive panel thermal scanning',
      'Fast warranty replacements',
      'Bi-annual detailed performance reports'
    ],
    image: 'https://images.unsplash.com/photo-1508873696983-2df5293cb395?auto=format&fit=crop&q=80&w=800',
    isActive: true,
    isFeatured: false,
    order: 4
  },
  {
    title: 'Battery Storage & Hybrid',
    category: 'Storage',
    price: '₹45,000 / kWh',
    capacity: '5 kWh – 50 kWh',
    warranty: '10 Years Battery Life Cycle',
    shortDesc: 'Store daytime solar energy to power your nighttime operations or backup critical loads during unpredictable grid power outages.',
    fullDesc: 'Advanced LiFePO4 lithium battery storage systems with smart hybrid inverters for complete round-the-clock independence.',
    benefits: [
      'Zero power blackout disruption',
      'Peak tariff time-of-day arbitrage',
      'Safe LiFePO4 battery chemistry',
      'Intelligent smartphone app controls'
    ],
    image: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&q=80&w=800',
    isActive: true,
    isFeatured: false,
    order: 5
  },
  {
    title: 'Agricultural & Solar Pumping',
    category: 'Agricultural',
    price: 'PM KUSUM Subsidy',
    capacity: '3 HP – 10 HP pumps',
    warranty: '5 Years Comprehensive System',
    shortDesc: 'Reliable daytime irrigation for farms without depending on diesel generator fuel or irregular rural power grid supply.',
    fullDesc: 'Solar water pumping solutions under PM-KUSUM scheme with up to 90% combined central and state government subsidy.',
    benefits: [
      'Zero recurring fuel and electric bills',
      'Reliable daytime watering schedules',
      'High subsidy under PM KUSUM',
      'Submersible and surface pump compatibility'
    ],
    image: 'https://images.unsplash.com/photo-1545208942-e1c9c916524b?auto=format&fit=crop&q=80&w=800',
    isActive: true,
    isFeatured: false,
    order: 6
  }
];

const normalizeServiceData = (body, file) => {
  const data = { ...body };
  if (file) {
    data.image = `/uploads/${file.filename}`;
  }

  if (typeof data.isActive === 'string') {
    data.isActive = data.isActive === 'true';
  }
  if (typeof data.isFeatured === 'string') {
    data.isFeatured = data.isFeatured === 'true';
  }

  // Handle benefits if passed as comma-separated or JSON
  if (typeof data.benefits === 'string') {
    try {
      data.benefits = JSON.parse(data.benefits);
    } catch {
      data.benefits = data.benefits.split(',').map(b => b.trim()).filter(Boolean);
    }
  }

  return data;
};

// GET /api/services
const getServices = async (req, res) => {
  try {
    let data = await Service.find().sort({ order: 1, createdAt: -1 });
    if (!data || data.length === 0) {
      try {
        await Service.insertMany(INITIAL_SERVICES);
        data = await Service.find().sort({ order: 1, createdAt: -1 });
      } catch (seedErr) {
        console.error('Error auto-seeding initial services:', seedErr);
      }
    }
    res.json(data);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET /api/services/:id
const getServiceById = async (req, res) => {
  try {
    const data = await Service.findById(req.params.id);
    if (data) res.json(data);
    else res.status(404).json({ message: 'Service not found' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// POST /api/services
const createService = async (req, res) => {
  try {
    const serviceData = normalizeServiceData(req.body, req.file);
    if (!serviceData.title) {
      return res.status(400).json({ message: 'Title is required' });
    }
    const data = new Service(serviceData);
    const saved = await data.save();
    res.status(201).json(saved);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// PUT /api/services/:id
const updateService = async (req, res) => {
  try {
    const serviceData = normalizeServiceData(req.body, req.file);
    const updated = await Service.findByIdAndUpdate(req.params.id, serviceData, { new: true });
    if (!updated) return res.status(404).json({ message: 'Service not found' });
    res.json(updated);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// DELETE /api/services/:id
const deleteService = async (req, res) => {
  try {
    const existing = await Service.findById(req.params.id);
    if (!existing) return res.status(404).json({ message: 'Service not found' });

    if (existing.image && existing.image.startsWith('/uploads/')) {
      const filePath = path.join(__dirname, '..', existing.image);
      if (fs.existsSync(filePath)) {
        try { fs.unlinkSync(filePath); } catch (e) { /* ignore */ }
      }
    }

    await Service.findByIdAndDelete(req.params.id);
    res.json({ message: 'Service removed successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// PATCH /api/services/:id/status
const toggleServiceStatus = async (req, res) => {
  try {
    const service = await Service.findById(req.params.id);
    if (!service) return res.status(404).json({ message: 'Service not found' });
    service.isActive = !service.isActive;
    await service.save();
    res.json(service);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getServices,
  getServiceById,
  createService,
  updateService,
  deleteService,
  toggleServiceStatus
};