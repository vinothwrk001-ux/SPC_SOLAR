const Project = require('../models/Project');
const path = require('path');
const fs = require('fs');

const INITIAL_PROJECTS = [
  {
    title: "Gamesa Solar Park",
    client: "Gamesa",
    capacity: "1500 kW",
    type: "Industrial",
    clientType: "Industrial",
    location: "Tamil Nadu",
    savings: "₹1.8 Cr/yr",
    description: "1,500 kW (1.5 MW) high-capacity utility-scale solar park commissioned for Gamesa, generating clean renewable power with high-voltage grid export.",
    image: "https://images.unsplash.com/photo-1509391366360-5157625bf958?auto=format&fit=crop&q=80&w=1200",
    isFeatured: true,
    isFeatures: true,
  },
  {
    title: "Nazareth Textile Mill",
    client: "Nazareth Textile Mill",
    capacity: "1000 kW",
    type: "Industrial",
    clientType: "Industrial",
    location: "Nazareth, Tamil Nadu",
    savings: "₹1.2 Cr/yr",
    description: "1,000 kW (1 MW) megawatt-scale textile mill solar power installation equipped with high-efficiency bi-facial panels and automated monitoring.",
    image: "https://images.unsplash.com/photo-1545208942-e1c9c916524b?auto=format&fit=crop&q=80&w=1200",
    isFeatured: true,
    isFeatures: true,
  },
  {
    title: "JYOTI Metal Solutions",
    client: "JYOTI - Total Metal Solution",
    capacity: "350 kW",
    type: "Industrial",
    clientType: "Industrial",
    location: "Tamil Nadu",
    savings: "₹42 L/yr",
    description: "350 kW industrial rooftop solar power plant designed for heavy fabrication and metal tooling operations.",
    image: "https://images.unsplash.com/photo-1497435334941-8c899ee9e8e9?auto=format&fit=crop&q=80&w=1200",
    isFeatured: true,
    isFeatures: true,
  },
  {
    title: "G Square Group",
    client: "G Square Group",
    capacity: "320 Street Lights",
    type: "Infrastructure",
    clientType: "Infrastructure",
    location: "Tamil Nadu",
    savings: "₹15 L/yr",
    description: "320 standalone intelligent dusk-to-dawn solar street light installations across premium gated community townships for G Square Group.",
    image: "https://images.unsplash.com/photo-1508873696983-2df5293cb395?auto=format&fit=crop&q=80&w=1200",
    isFeatured: true,
    isFeatures: true,
  },
  {
    title: "DMS Hospital",
    client: "DMS Hospital",
    capacity: "70 kW",
    type: "Commercial",
    clientType: "Commercial",
    location: "Tamil Nadu",
    savings: "₹8.5 L/yr",
    description: "70 kW commercial rooftop solar setup providing 24/7 clean, dependable power to vital healthcare equipment and patient wards.",
    image: "https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&q=80&w=1200",
    isFeatured: false,
    isFeatures: false,
  },
  {
    title: "Jayapriya City Funds",
    client: "Jayapriya Constructions Pvt Ltd",
    capacity: "70 kW",
    type: "Commercial",
    clientType: "Commercial",
    location: "Tamil Nadu",
    savings: "₹8.4 L/yr",
    description: "70 kW rooftop solar project for Jayapriya Constructions Pvt Ltd corporate headquarters, eliminating peak commercial power tariffs.",
    image: "https://images.unsplash.com/photo-1592833159155-c62df1b65634?auto=format&fit=crop&q=80&w=1200",
    isFeatured: false,
    isFeatures: false,
  },
  {
    title: "St. Joan of Arc",
    client: "St. Joan of Arc Campus",
    capacity: "40 kW",
    type: "Commercial",
    clientType: "Commercial",
    location: "Tamil Nadu",
    savings: "₹4.8 L/yr",
    description: "40 kW institutional solar installation powering classrooms, computer labs, and campus infrastructure.",
    image: "https://images.unsplash.com/photo-1562774053-701939374585?auto=format&fit=crop&q=80&w=1200",
    isFeatured: false,
    isFeatures: false,
  },
  {
    title: "IndianOil (Sholavur & Shanthi Plant)",
    client: "IndianOil",
    capacity: "25 kW",
    type: "Commercial",
    clientType: "Commercial",
    location: "Sholavur, Tamil Nadu",
    savings: "₹3.2 L/yr",
    description: "Dual solar deployment for IndianOil Sholavur FIIT Station and Shanthi Water Plant facility.",
    image: "https://images.unsplash.com/photo-1508514177221-188b1cf16e9d?auto=format&fit=crop&q=80&w=1200",
    isFeatured: false,
    isFeatures: false,
  },
  {
    title: "Bharat Petroleum (Rajai Fuel Station)",
    client: "Bharat Petroleum (BPCL)",
    capacity: "10 kW",
    type: "Commercial",
    clientType: "Commercial",
    location: "Chennai, Tamil Nadu",
    savings: "₹1.2 L/yr",
    description: "10 kW commercial solar canopy installation for BPCL Rajai Fuel Station in Chennai, supporting round-the-clock fuel retail operations.",
    image: "https://images.unsplash.com/photo-1527018606412-a613d017b271?auto=format&fit=crop&q=80&w=1200",
    isFeatured: false,
    isFeatures: false,
  },
  {
    title: "Hindustan Petroleum (Praba Agency)",
    client: "HP (Hindustan Petroleum)",
    capacity: "10 kW",
    type: "Commercial",
    clientType: "Commercial",
    location: "Trichy, Tamil Nadu",
    savings: "₹1.2 L/yr",
    description: "10 kW commercial rooftop solar installation for HP Praba Agency in Trichy, lowering operational electricity expenditures.",
    image: "https://images.unsplash.com/photo-1497435334941-8c899ee9e8e9?auto=format&fit=crop&q=80&w=1200",
    isFeatured: false,
    isFeatures: false,
  },
  {
    title: "Institutional Campus Solar Lights",
    client: "Educational Institution Campus",
    capacity: "100 Street Lights",
    type: "Infrastructure",
    clientType: "Infrastructure",
    location: "Tamil Nadu",
    savings: "₹5.0 L/yr",
    description: "100 automated solar street lights installed across institutional roadways, providing eco-friendly perimeter security illumination.",
    image: "https://images.unsplash.com/photo-1508873696983-2df5293cb395?auto=format&fit=crop&q=80&w=1200",
    isFeatured: false,
    isFeatures: false,
  },
  {
    title: "Coimbatore Smart Villa Solar",
    client: "Residential Villa",
    capacity: "10 kW",
    type: "Residential",
    clientType: "Residential",
    location: "RS Puram, Coimbatore",
    savings: "₹1.1 L/yr",
    description: "10 kW premium on-grid rooftop solar system with bi-directional net-metering and PM Surya Ghar subsidy benefit.",
    image: "https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&q=80&w=1200",
    isFeatured: false,
    isFeatures: false,
  },
  {
    title: "Eco Green Residence",
    client: "Residential Homeowner",
    capacity: "5 kW",
    type: "Residential",
    clientType: "Residential",
    location: "Trichy, Tamil Nadu",
    savings: "₹65 K/yr",
    description: "5 kW rooftop solar plant reducing home electricity tariff by up to 90% with Tier-1 mono PERC panels.",
    image: "https://images.unsplash.com/photo-1509391366360-5157625bf958?auto=format&fit=crop&q=80&w=1200",
    isFeatured: false,
    isFeatures: false,
  },
  {
    title: "Agri-Solar Irrigation Farm",
    client: "Agro Farm Enterprise",
    capacity: "25 kW",
    type: "Industrial",
    clientType: "Industrial",
    location: "Thanjavur, Tamil Nadu",
    savings: "₹2.8 L/yr",
    description: "25 kW solar-powered agricultural pumping and drip irrigation array ensuring reliable daytime irrigation without grid outages.",
    image: "https://images.unsplash.com/photo-1545208942-e1c9c916524b?auto=format&fit=crop&q=80&w=1200",
    isFeatured: false,
    isFeatures: false,
  }
];

// Helper to normalize project payload
const normalizeProjectData = (body, file) => {
  const data = { ...body };

  if (file) {
    data.image = `/uploads/${file.filename}`;
  }

  // Sync type and clientType
  const clientType = data.clientType || data.type || 'Residential';
  data.clientType = clientType;
  data.type = clientType;

  // Handle boolean values from multipart/form-data
  if (typeof data.isFeatured === 'string') {
    data.isFeatured = data.isFeatured === 'true';
  } else if (data.isFeatured === undefined && data.isFeatures !== undefined) {
    data.isFeatured = typeof data.isFeatures === 'string' ? data.isFeatures === 'true' : Boolean(data.isFeatures);
  }
  data.isFeatures = Boolean(data.isFeatured);

  // Sync images array
  if (data.image) {
    if (!data.images || data.images.length === 0) {
      data.images = [data.image];
    }
  }

  return data;
};

// GET /api/projects
const getProjects = async (req, res) => {
  try {
    let data = await Project.find().sort({ isFeatured: -1, createdAt: -1 });
    
    // Auto-seed if empty
    if (!data || data.length === 0) {
      try {
        await Project.insertMany(INITIAL_PROJECTS);
        data = await Project.find().sort({ isFeatured: -1, createdAt: -1 });
      } catch (seedErr) {
        console.error('Error auto-seeding initial projects:', seedErr);
      }
    }

    res.json(data);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET /api/projects/:id
const getProjectById = async (req, res) => {
  try {
    const data = await Project.findById(req.params.id);
    if (data) {
      res.json(data);
    } else {
      res.status(404).json({ message: 'Project not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// POST /api/projects
const createProject = async (req, res) => {
  try {
    const projectData = normalizeProjectData(req.body, req.file);

    if (!projectData.title || !projectData.location || !projectData.capacity) {
      return res.status(400).json({ message: 'Title, location, and capacity are required.' });
    }

    // Default fallback image if none provided
    if (!projectData.image) {
      projectData.image = 'https://images.unsplash.com/photo-1509391366360-5157625bf958?auto=format&fit=crop&q=80&w=800';
      projectData.images = [projectData.image];
    }

    const newProject = new Project(projectData);
    const savedData = await newProject.save();
    res.status(201).json(savedData);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// PUT /api/projects/:id
const updateProject = async (req, res) => {
  try {
    const projectData = normalizeProjectData(req.body, req.file);

    const existing = await Project.findById(req.params.id);
    if (!existing) {
      return res.status(404).json({ message: 'Project not found' });
    }

    // If new file uploaded and previous image was local, optionally remove old file
    if (req.file && existing.image && existing.image.startsWith('/uploads/')) {
      const oldPath = path.join(__dirname, '..', existing.image);
      if (fs.existsSync(oldPath)) {
        try { fs.unlinkSync(oldPath); } catch (e) { /* ignore */ }
      }
    }

    const updated = await Project.findByIdAndUpdate(req.params.id, projectData, { new: true });
    res.json(updated);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// DELETE /api/projects/:id
const deleteProject = async (req, res) => {
  try {
    const existing = await Project.findById(req.params.id);
    if (!existing) {
      return res.status(404).json({ message: 'Project not found' });
    }

    // Remove local image file if exists
    if (existing.image && existing.image.startsWith('/uploads/')) {
      const filePath = path.join(__dirname, '..', existing.image);
      if (fs.existsSync(filePath)) {
        try { fs.unlinkSync(filePath); } catch (e) { /* ignore */ }
      }
    }

    await Project.findByIdAndDelete(req.params.id);
    res.json({ message: 'Project removed successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// PATCH /api/projects/:id/feature
const toggleFeatured = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    project.isFeatured = !project.isFeatured;
    project.isFeatures = project.isFeatured;
    await project.save();

    res.json(project);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getProjects,
  getProjectById,
  createProject,
  updateProject,
  deleteProject,
  toggleFeatured
};