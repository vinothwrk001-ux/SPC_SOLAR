const mongoose = require('mongoose');
require('dotenv').config();
const Blog = require('./models/Blog');
const Category = require('./models/Category');
const Tag = require('./models/Tag');

const seedInitialData = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB for seeding...');

    // Seed Categories
    const categoriesData = [
      { name: 'Government Schemes', slug: 'government-schemes', description: 'PM Surya Ghar scheme, state rooftop solar subsidies and policy updates.' },
      { name: 'Solar Basics', slug: 'solar-basics', description: 'Beginner guides on how solar panels, inverters and net metering work.' },
      { name: 'Solar Maintenance', slug: 'solar-maintenance', description: 'Panel cleaning, inverter health checks, and preventive maintenance.' },
      { name: 'Commercial Solar', slug: 'commercial-solar', description: 'Rooftop solar for factories, warehouses, and corporate offices.' }
    ];

    for (const cat of categoriesData) {
      await Category.findOneAndUpdate({ slug: cat.slug }, cat, { upsert: true });
    }
    console.log('✅ Categories seeded');

    // Seed Tags
    const tagsData = ['pm-surya-ghar', 'net-metering', 'rooftop-solar', 'solar-subsidy', 'inverter-guide', 'solar-maintenance'];
    for (const tagName of tagsData) {
      const slug = tagName.toLowerCase();
      await Tag.findOneAndUpdate({ slug }, { name: tagName, slug }, { upsert: true });
    }
    console.log('✅ Tags seeded');

    // Seed Sample Published Blogs
    const sampleBlogs = [
      {
        title: 'Everything You Need to Know About PM Surya Ghar Scheme 2025',
        subtitle: 'Complete breakdown of rooftop subsidies up to ₹78,000 for residential households',
        slug: 'everything-you-need-to-know-about-pm-surya-ghar-scheme-2025',
        excerpt: 'The central government provides a direct subsidy for installing rooftop solar panels. Learn how much you get and how to apply.',
        content: `
          <h2>Introduction to PM Surya Ghar: Muft Bijli Yojana</h2>
          <p>The <strong>PM Surya Ghar: Muft Bijli Yojana</strong> is a flagship initiative launched by the Government of India to empower 1 crore households with free rooftop solar electricity. The program offers direct financial assistance deposited straight to the beneficiary's bank account.</p>

          <h2>Subsidy Amount Breakdown</h2>
          <p>The financial assistance is calculated based on system capacity in kilowatts (kW):</p>
          <ul>
            <li><strong>Up to 2 kW system:</strong> ₹30,000 per kW (Total ₹60,000 for 2 kW)</li>
            <li><strong>3 kW system:</strong> Additional ₹18,000 for the 3rd kW (Total ₹78,000 cap)</li>
            <li><strong>Above 3 kW system:</strong> Capped at ₹78,000 maximum subsidy</li>
          </ul>

          <h2>How Net Metering Works</h2>
          <p>Net metering allows you to send excess electricity generated during sunny daytime hours back to the local electricity grid. At night, you draw power from the grid. At the end of the month, your electricity bill reflects only the net difference.</p>

          <blockquote class="border-l-4 border-red pl-4 italic text-gray">
            "With net metering and government subsidy combined, the payback period for a 3 kW solar plant is reduced to just 3 to 3.5 years."
          </blockquote>

          <h2>Application Process</h2>
          <p>Homeowners can register directly on the national portal or contact authorized solar vendors like <strong>SPC Solar</strong> to handle net-metering approval, site inspection, and installation.</p>
        `,
        category: 'Government Schemes',
        tags: ['pm-surya-ghar', 'solar-subsidy', 'rooftop-solar'],
        status: 'PUBLISHED',
        publishedAt: new Date(),
        readingTime: 4,
        views: 142,
        isFeatured: true,
        featuredImage: {
          url: 'https://images.unsplash.com/photo-1509391366360-5157625bf958?auto=format&fit=crop&q=80&w=1200',
          alt: 'Rooftop solar installation'
        },
        author: {
          name: 'SPC Solar Expert',
          designation: 'Senior Renewable Engineer'
        },
        faq: [
          {
            question: 'What is the maximum subsidy under PM Surya Ghar scheme?',
            answer: 'The maximum subsidy is capped at ₹78,000 for systems with capacity of 3 kW or higher.'
          },
          {
            question: 'How long does it take for subsidy credit?',
            answer: 'Once the net meter is commissioned and inspected, the subsidy is credited to your bank account within 30 days.'
          }
        ]
      },
      {
        title: 'Top 5 Maintenance Tips to Maximize Solar Panel Efficiency',
        subtitle: 'Simple maintenance practices to ensure 25+ years of peak generation',
        slug: 'top-5-maintenance-tips-to-maximize-solar-panel-efficiency',
        excerpt: 'Dust and bird droppings can lower solar power generation by up to 25%. Here is how to keep your panels clean.',
        content: `
          <h2>Why Solar Panel Cleaning Matters</h2>
          <p>Solar photovoltaic modules convert direct sunlight into electricity. Accumulated dust, industrial soot, and debris create shadows on the silicon cells, reducing generation efficiency drastically.</p>

          <h2>5 Essential Maintenance Tips</h2>
          <h3>1. Clean Panels Early Morning or Evening</h3>
          <p>Never spray cold water on scorching hot glass panel surfaces at noon, as thermal shock can cause micro-cracks in the glass.</p>

          <h3>2. Use Soft Microfiber Brushes</h3>
          <p>Avoid harsh abrasives or chemical detergents. Soft microfiber squeegees with clean water are ideal for wiping dust away.</p>

          <h3>3. Inspect Inverter Error Indicators</h3>
          <p>Check the LED display on your solar inverter once a week to verify grid sync and daily generation output.</p>

          <h3>4. Trim Overhanging Tree Branches</h3>
          <p>Shading from nearby tree branches between 9:00 AM and 4:00 PM significantly impacts generation.</p>

          <h3>5. Schedule Annual Electrical Audits</h3>
          <p>Have an SPC Solar technician check DC wiring insulation, earthing pit resistance, and surge protection devices once every 12 months.</p>
        `,
        category: 'Solar Maintenance',
        tags: ['solar-maintenance', 'inverter-guide'],
        status: 'PUBLISHED',
        publishedAt: new Date(),
        readingTime: 3,
        views: 89,
        isFeatured: false,
        featuredImage: {
          url: 'https://images.unsplash.com/photo-1611365892502-8eebf8c148e3?auto=format&fit=crop&q=80&w=1200',
          alt: 'Solar panel cleaning and maintenance'
        },
        author: {
          name: 'SPC Technical Team',
          designation: 'Maintenance Lead'
        },
        faq: [
          {
            question: 'How often should solar panels be cleaned in India?',
            answer: 'In dusty urban or industrial environments, cleaning panels once every 15 days is recommended.'
          }
        ]
      }
    ];

    for (const bData of sampleBlogs) {
      await Blog.findOneAndUpdate({ slug: bData.slug }, bData, { upsert: true });
    }

    console.log('✅ Initial Blog Articles Seeded Successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding data:', error);
    process.exit(1);
  }
};

seedInitialData();
