const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();
const Admin = require('./models/Admin');

const seedAdmin = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    
    const count = await Admin.countDocuments();
    if (count > 0) {
      const existing = await Admin.find({});
      console.log('Admin already exists:');
      existing.forEach(a => console.log(`- Username: ${a.username}, Email: ${a.email}`));
      process.exit(0);
    }

    const hashedPassword = await bcrypt.hash('admin123', 10);

    const defaultAdmin = new Admin({
      username: 'admin',
      email: 'admin@spcsolar.com',
      password: hashedPassword
    });

    await defaultAdmin.save();
    console.log('✅ Default Admin created successfully!');
    console.log('Email: admin@spcsolar.com');
    console.log('Password: admin123');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding admin:', error);
    process.exit(1);
  }
};

seedAdmin();
