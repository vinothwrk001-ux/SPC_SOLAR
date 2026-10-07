const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');
const GalleryComponent = require('./models/GalleryComponent');
require('dotenv').config();

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/spc_solar';

const seedSolarSystems = async () => {
  try {
    await mongoose.connect(MONGO_URI);
    console.log('MongoDB Connected');

    const sourceDir = path.join(__dirname, '../Frontend/src/assets');
    const destDir = path.join(__dirname, 'uploads');

    if (!fs.existsSync(destDir)) {
      fs.mkdirSync(destDir, { recursive: true });
    }

    const imagesToSeed = [
      { filename: 'Offgrid.png', title: 'Off-Grid Solar System', category: 'Solar Systems' },
      { filename: 'Ongrid.png', title: 'On-Grid Solar System', category: 'Solar Systems' },
      { filename: 'hybrid.png', title: 'Hybrid Solar System', category: 'Solar Systems' }
    ];

    for (let item of imagesToSeed) {
      const srcPath = path.join(sourceDir, item.filename);
      const uniqueFilename = `seed-solar-${Date.now()}-${item.filename.replace(/ /g, '_')}`;
      const destPath = path.join(destDir, uniqueFilename);

      if (fs.existsSync(srcPath)) {
        fs.copyFileSync(srcPath, destPath);
        
        await GalleryComponent.create({
          title: item.title,
          description: `High efficiency ${item.title.toLowerCase()} for reliable power generation.`,
          category: item.category,
          imageUrl: `/uploads/${uniqueFilename}`
        });
        
        console.log(`Seeded: ${item.title}`);
      } else {
        console.log(`File not found: ${srcPath}`);
      }
    }

    console.log('Solar Systems Seeding Completed');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding solar systems:', error);
    process.exit(1);
  }
};

seedSolarSystems();
