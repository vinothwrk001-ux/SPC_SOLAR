require('dotenv').config();
const mongoose = require('mongoose');
const connectDB = require('./config/db');
const Testimonial = require('./models/Testimonial');

const seedTestimonials = async () => {
  try {
    await connectDB();
    const count = await Testimonial.countDocuments();
    if (count === 0) {
      await Testimonial.create([
        {
          name: 'Rahul Sharma',
          location: 'Homeowner, Delhi',
          systemSize: '5kW System',
          rating: 5,
          review: 'Installed a 5kW system. My electricity bill went from ₹6,000 to virtually zero! The team was highly professional and the installation was completed in just two days.',
          status: 'Approved',
          source: 'Admin'
        },
        {
          name: 'Meera Reddy',
          location: 'Factory Owner, Hyderabad',
          systemSize: '200kW Industrial System',
          rating: 5,
          review: 'SPC Solar executed our 200kW project flawlessly without disrupting our production schedule. The ROI has been better than projected — we broke even in 4 years.',
          status: 'Approved',
          source: 'Admin'
        },
        {
          name: 'Vikram Singh',
          location: 'Resident, Jaipur',
          systemSize: '3kW System',
          rating: 5,
          review: 'They processed my PM Surya Ghar subsidy completely on my behalf. Received ₹78,000 without any hassle. Real experts in navigating government schemes.',
          status: 'Approved',
          source: 'Admin'
        }
      ]);
      console.log('✅ Default Approved Testimonials Seeded!');
    } else {
      console.log('Testimonials already exist.');
    }
    process.exit(0);
  } catch (error) {
    console.error('Error seeding testimonials:', error);
    process.exit(1);
  }
};

seedTestimonials();
