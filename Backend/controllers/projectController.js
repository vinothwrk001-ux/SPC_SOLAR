const Project = require('../models/Project');
const path = require('path');
const fs = require('fs');

const INITIAL_PROJECTS = [
  {
    title: "Green Valley Residence",
    capacity: "5 kW",
    type: "Residential",
    clientType: "Residential",
    location: "Pune, MH",
    savings: "₹72K/yr",
    description: "5 kW on-grid rooftop solar plant installed with Tier-1 mono PERC half-cut panels, reducing homeowner electricity bills by 90%.",
    image: "https://images.unsplash.com/photo-1509391366360-5157625bf958?auto=format&fit=crop&q=80&w=800",
    isFeatured: true,
    isFeatures: true,
  },
  {
    title: "TechPark Corporate",
    capacity: "150 kW",
    type: "Commercial",
    clientType: "Commercial",
    location: "Bangalore, KA",
    savings: "₹18L/yr",
    description: "150 kW commercial solar installation powering corporate headquarters with clean renewable energy and 3.5-year payback.",
    image: "https://images.unsplash.com/photo-1592833159155-c62df1b65634?auto=format&fit=crop&q=80&w=800",
    isFeatured: true,
    isFeatures: true,
  },
  {
    title: "Apex Manufacturing",
    capacity: "500 kW",
    type: "Industrial",
    clientType: "Industrial",
    location: "Ahmedabad, GJ",
    savings: "₹60L/yr",
    description: "500 kW captive industrial solar plant for heavy machinery operations, eliminating diesel generator costs and tariff spikes.",
    image: "https://images.unsplash.com/photo-1497435334941-8c899ee9e8e9?auto=format&fit=crop&q=80&w=800",
    isFeatured: true,
    isFeatures: true,
  },
  {
    title: "Sharma Villa",
    capacity: "10 kW",
    type: "Residential",
    clientType: "Residential",
    location: "Delhi, DL",
    savings: "₹1.4L/yr",
    description: "10 kW luxury villa solar setup equipped with lithium battery storage and hybrid inverter for 24/7 uninterrupted power.",
    image: "https://images.unsplash.com/photo-1508873696983-2df5293cb395?auto=format&fit=crop&q=80&w=800",
    isFeatured: false,
    isFeatures: false,
  },
  {
    title: "Sunrise Mall",
    capacity: "300 kW",
    type: "Commercial",
    clientType: "Commercial",
    location: "Mumbai, MH",
    savings: "₹36L/yr",
    description: "300 kW elevated solar canopy rooftop installation covering mall parking and utility decks, feeding central HVAC.",
    image: "https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&q=80&w=800",
    isFeatured: false,
    isFeatures: false,
  },
  {
    title: "Omega Textiles",
    capacity: "1 MW",
    type: "Industrial",
    clientType: "Industrial",
    location: "Surat, GJ",
    savings: "₹1.2Cr/yr",
    description: "1 MW megawatt-scale textile mill solar plant with remote SCADA monitoring, bi-facial panels, and automated robotic cleaning.",
    image: "https://images.unsplash.com/photo-1545208942-e1c9c916524b?auto=format&fit=crop&q=80&w=800",
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
    let data = await Project.find().sort({ createdAt: -1 });
    
    // Auto-seed if empty
    if (!data || data.length === 0) {
      try {
        await Project.insertMany(INITIAL_PROJECTS);
        data = await Project.find().sort({ createdAt: -1 });
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