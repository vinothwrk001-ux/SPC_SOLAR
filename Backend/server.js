require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const path = require('path');
const connectDB = require('./config/db');

// Route imports
const authRoutes = require('./routes/authRoutes');
const userAuthRoutes = require('./routes/userAuthRoutes');
const couponRoutes = require('./routes/couponRoutes');
const serviceRoutes = require('./routes/serviceRoutes');
const projectRoutes = require('./routes/projectRoutes');
const blogRoutes = require('./routes/blogRoutes');
const categoryRoutes = require('./routes/categoryRoutes');
const tagRoutes = require('./routes/tagRoutes');
const quotationRoutes = require('./routes/quotationRoutes');
const testimonialRoutes = require('./routes/testimonialRoutes');
const contactRoutes = require('./routes/contactRoutes');
const solarCalculatorRoutes = require('./routes/solarCalculatorRoutes');
const reelRoutes = require('./routes/reelRoutes');
const leadRoutes = require('./routes/leadRoutes');
const galleryComponentRoutes = require('./routes/galleryComponentRoutes');
const bannerRoutes = require('./routes/bannerRoutes');
const { errorHandler } = require('./middleware/errorMiddleware');
const { generateSitemap } = require('./utils/sitemapGenerator');
const { startSchedulerEngine } = require('./utils/schedulerEngine');

const app = express();

// Database Connection
connectDB();

// Start Background Auto-Scheduler
startSchedulerEngine();

// Middlewares
app.use(express.json());
app.use(cors({ origin: process.env.CLIENT_URL || true, credentials: true }));
app.use(helmet());
app.use(helmet.crossOriginResourcePolicy({ policy: "cross-origin" })); // Allow serving images
app.use(morgan('dev'));

// Static folder for uploads
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Dynamic Sitemap & Robots.txt
app.get('/sitemap.xml', generateSitemap);
app.get('/robots.txt', (req, res) => {
  const clientUrl = process.env.CLIENT_URL || 'http://localhost:5173';
  res.type('text/plain');
  res.send(`User-agent: *\nAllow: /\nDisallow: /admin/\nDisallow: /api/\nSitemap: ${clientUrl}/sitemap.xml`);
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/user', userAuthRoutes);
app.use('/api/coupon', couponRoutes);
app.use('/api/services', serviceRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/blogs', blogRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/tags', tagRoutes);
app.use('/api/quotations', quotationRoutes);
app.use('/api/testimonials', testimonialRoutes);
app.use('/api/contact', contactRoutes);
app.use('/api/solar-calculator', solarCalculatorRoutes);
app.use('/api/reels', reelRoutes);
app.use('/api/leads', leadRoutes);
app.use('/api/gallery-components', galleryComponentRoutes);
app.use('/api/banner', bannerRoutes);

// Error Middleware
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
