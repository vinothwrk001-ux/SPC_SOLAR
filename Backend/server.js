require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const path = require('path');
const fs = require('fs');
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
const mediaRoutes = require('./routes/mediaRoutes');
const { errorHandler } = require('./middleware/errorMiddleware');
const { generateSitemap } = require('./utils/sitemapGenerator');
const { startSchedulerEngine } = require('./utils/schedulerEngine');
const { ensureDefaultAlbums } = require('./services/albumService');
const { verifyCloudinaryConnection } = require('./config/cloudinary');

const app = express();

// Database Connection & Initial Seeding
connectDB().then(async () => {
  ensureDefaultAlbums().catch((err) => console.warn('Album init warning:', err.message));
  const cloudStatus = await verifyCloudinaryConnection();
  if (cloudStatus.enabled) {
    console.log(`☁️  [Cloudinary] Connected successfully! Remote cloud storage active.`);
  } else {
    console.log(`📁 [Media Storage] Local disk mode active (/uploads/media). Add Cloudinary keys to .env to enable Cloud.`);
  }
});

// Start Background Auto-Scheduler
startSchedulerEngine();

// Middlewares
app.use(express.json());

const allowedOrigins = [
  process.env.CLIENT_URL,
  'https://spcsolarcbe.com',
  'https://www.spcsolarcbe.com',
  'http://spcsolarcbe.com',
  'http://www.spcsolarcbe.com',
  'http://localhost:5173',
  'http://localhost:5174',
  'http://localhost:5175',
  'http://localhost:3000',
  'http://127.0.0.1:5173',
  'http://127.0.0.1:5174',
  'http://127.0.0.1:5175',
  'http://127.0.0.1:3000'
].filter(Boolean);

app.use(cors({
  origin: (origin, callback) => {
    // Allow non-browser requests (Postman, curl, SSR, mobile, etc.)
    if (!origin) return callback(null, true);
    if (
      allowedOrigins.includes(origin) ||
      /^https?:\/\/(www\.)?spcsolarcbe\.com$/.test(origin) ||
      /^http:\/\/localhost:\d+$/.test(origin) ||
      /^http:\/\/127\.0\.0\.1:\d+$/.test(origin) ||
      process.env.NODE_ENV !== 'production'
    ) {
      return callback(null, true);
    }
    return callback(new Error(`CORS policy does not allow access from ${origin}`));
  },
  credentials: true
}));

app.use(helmet());
app.use(helmet.crossOriginResourcePolicy({ policy: "cross-origin" })); // Allow serving images
app.use(morgan('dev'));

// Static folder for uploads
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Dynamic Sitemap & Robots.txt
app.get('/sitemap.xml', generateSitemap);
app.get('/robots.txt', (req, res) => {
  const clientUrl = (process.env.CLIENT_URL || 'https://spcsolarcbe.com').replace(/\/$/, '');
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
app.use('/api/media', mediaRoutes);

// Serve Frontend build in Production
const frontendDist = path.join(__dirname, '../Frontend/dist');
const localDist = path.join(__dirname, 'dist');
const distPath = fs.existsSync(frontendDist) ? frontendDist : fs.existsSync(localDist) ? localDist : null;

if (distPath) {
  app.use(express.static(distPath));
  app.get('*', (req, res, next) => {
    if (req.path.startsWith('/api') || req.path.startsWith('/uploads')) {
      return next();
    }
    res.sendFile(path.join(distPath, 'index.html'));
  });
}

// Error Middleware
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

const server = app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on port ${PORT}`);
});

server.on('error', (err) => {
  if (err.code === 'EADDRINUSE') {
    console.error(`\n❌ [PORT CONFLICT] Port ${PORT} is already in use by another application!`);
    console.error(`👉 Close the conflicting process or change PORT in .env.\n`);
  } else {
    console.error('Server error:', err);
  }
});
