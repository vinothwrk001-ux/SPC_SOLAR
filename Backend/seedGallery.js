const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');
const GalleryComponent = require('./models/GalleryComponent');
require('dotenv').config();

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/spc_solar';

const seedGallery = async () => {
  try {
    await mongoose.connect(MONGO_URI);
    console.log('MongoDB Connected');

    const sourceDir = path.join(__dirname, '../Frontend/src/assets');
    const destDir = path.join(__dirname, 'uploads');

    if (!fs.existsSync(destDir)) {
      fs.mkdirSync(destDir, { recursive: true });
    }

    const imagesToSeed = [
      { filename: 'Four-Angle Solar Junction Box Showcase.png', title: 'Solar Junction Box Showcase' },
      { filename: 'Four-View Industrial Energy Storage Cabinet.png', title: 'Industrial Energy Storage Cabinet' },
      { filename: 'Four-View Modern Solar Inverter Showcase.png', title: 'Modern Solar Inverter Showcase' },
      { filename: 'MC4 Solar Cable Connector Views.png', title: 'MC4 Solar Cable Connector Views' },
      { filename: 'Multi-Angle Solar Distribution Enclosure.png', title: 'Solar Distribution Enclosure' },
      { filename: 'Solar Panel Multi-View Catalog Display.png', title: 'Solar Panel Catalog Display' }
    ];

    for (let item of imagesToSeed) {
      const srcPath = path.join(sourceDir, item.filename);
      const uniqueFilename = `seed-${Date.now()}-${item.filename.replace(/ /g, '_')}`;
      const destPath = path.join(destDir, uniqueFilename);

      if (fs.existsSync(srcPath)) {
        fs.copyFileSync(srcPath, destPath);
        
        await GalleryComponent.create({
          title: item.title,
          description: `High quality ${item.title.toLowerCase()} for solar projects.`,
          imageUrl: `/uploads/${uniqueFilename}`
        });
        
        console.log(`Seeded: ${item.title}`);
      } else {
        console.log(`File not found: ${srcPath}`);
      }
    }

    console.log('Gallery Seeding Completed');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding gallery:', error);
    process.exit(1);
  }
};

seedGallery();
