require('dotenv').config();
const mongoose = require('mongoose');
const connectDB = require('./config/db');
const Reel = require('./models/Reel');

const seedReels = async () => {
  try {
    await connectDB();
    const count = await Reel.countDocuments();
    if (count === 0) {
      await Reel.create([
        {
          title: '5kW Rooftop Solar Installation Timelapse',
          description: 'Watch our engineering team install 9 high-efficiency Mono PERC panels in just 2 days! Zero electricity bill achieved for customer in Delhi.',
          videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-solar-panels-on-a-roof-41551-large.mp4',
          thumbnailUrl: 'https://images.unsplash.com/photo-1508514177221-188b1cf16e9d?w=800&auto=format&fit=crop&q=80',
          category: 'Installation',
          tags: ['Rooftop', '5kW', 'Delhi', 'Installation'],
          systemCapacity: '5 kW System',
          location: 'Delhi NCR',
          linkedService: 'Residential Solar Installation',
          status: 'Published',
          showOnStorefront: true,
          viewsCount: 1420,
          likesCount: 184,
          savesCount: 42
        },
        {
          title: 'Client Story: Bill Reduced from ₹12,000 to ₹0',
          description: 'Mr. Sharma shares his real experience after installing 10kW On-Grid Solar System with Net Metering.',
          videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-close-up-of-solar-panels-in-the-sun-41550-large.mp4',
          thumbnailUrl: 'https://images.unsplash.com/photo-1509391365360-2e959784a276?w=800&auto=format&fit=crop&q=80',
          category: 'Testimonial',
          tags: ['Testimonial', 'Savings', '10kW', 'Net Metering'],
          systemCapacity: '10 kW System',
          location: 'Coimbatore, Tamil Nadu',
          linkedService: 'Commercial & Industrial Solar',
          status: 'Published',
          showOnStorefront: true,
          viewsCount: 2890,
          likesCount: 312,
          savesCount: 95
        },
        {
          title: 'PM Surya Ghar Scheme: How to get ₹78,000 Subsidy',
          description: 'Complete guide on government solar subsidies for residential homeowners. We handle 100% paperless subsidy processing.',
          videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-worker-installing-a-solar-panel-41549-large.mp4',
          thumbnailUrl: 'https://images.unsplash.com/photo-1542336391-ae2936d8eff4?w=800&auto=format&fit=crop&q=80',
          category: 'Subsidy Explainer',
          tags: ['Subsidy', 'PM Surya Ghar', 'Government Scheme'],
          systemCapacity: '3 kW System',
          location: 'Jaipur, Rajasthan',
          linkedService: 'PM Surya Ghar Subsidy Assistance',
          status: 'Published',
          showOnStorefront: true,
          viewsCount: 5120,
          likesCount: 640,
          savesCount: 210
        }
      ]);
      console.log('✅ Default Solar Reels Seeded!');
    } else {
      console.log('Reels already exist in database.');
    }
    process.exit(0);
  } catch (error) {
    console.error('Error seeding reels:', error);
    process.exit(1);
  }
};

seedReels();
