const path = require('path');
const fs = require('fs');
require('dotenv').config();
require('dotenv').config({ path: path.join(__dirname, '.env') });
require('dotenv').config({ path: path.join(__dirname, '../.env') });
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const connectDB = require('./config/db');
const mongoose = require('mongoose');

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
  if (cloudStatus && cloudStatus.enabled) {
    console.log(`☁️  [Cloudinary] Connected successfully! Remote cloud storage active.`);
  } else {
    console.log(`📁 [Media Storage] Local disk mode active (/uploads/media). Add Cloudinary keys to .env to enable Cloud.`);
  }
  try {
    startSchedulerEngine();
  } catch (err) {
    console.warn('Scheduler engine warning:', err.message);
  }
}).catch((err) => {
  console.error('DB connect warning:', err.message);
});

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

// Health Check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'ok',
    uptime: Math.floor(process.uptime()),
    timestamp: new Date().toISOString(),
    node: process.version,
    database: mongoose.connection.readyState === 1 ? 'connected' : 'connecting'
  });
});

// Dedicated Favicon Handler
app.get(['/favicon.ico', '/favicon.svg'], (req, res) => {
  const possibleFavicons = [
    distPath ? path.join(distPath, 'favicon.ico') : null,
    distPath ? path.join(distPath, 'favicon.svg') : null,
    path.join(__dirname, '../dist/favicon.svg'),
    path.join(__dirname, '../dist/favicon.ico'),
    path.join(__dirname, '../Frontend/public/favicon.svg'),
    path.join(__dirname, 'public/favicon.svg')
  ].filter(Boolean);

  const found = possibleFavicons.find((f) => fs.existsSync(f));
  if (found) {
    if (found.endsWith('.svg')) {
      res.type('image/svg+xml');
    } else {
      res.type('image/x-icon');
    }
    return res.sendFile(found);
  }
  return res.status(204).end();
});

// Serve Frontend build in Production
const possibleDistPaths = [
  path.join(__dirname, '../Frontend/dist'),
  path.join(__dirname, 'dist'),
  path.join(__dirname, '../dist'),
  path.join(process.cwd(), 'Frontend/dist'),
  path.join(process.cwd(), 'dist')
];
const distPath = possibleDistPaths.find((p) => fs.existsSync(p)) || null;

if (distPath) {
  console.log(`📦 [Frontend] Serving static production build from: ${distPath}`);
  app.use(express.static(distPath));
  // Express 5 compatible catch-all for SPA client-side routing
  app.use((req, res, next) => {
    if (req.method !== 'GET') return next();
    if (req.path.startsWith('/api') || req.path.startsWith('/uploads')) {
      return next();
    }
    const indexPath = path.join(distPath, 'index.html');
    if (fs.existsSync(indexPath)) {
      return res.sendFile(indexPath);
    }
    return next();
  });
} else {
  console.warn('⚠️  [Frontend] dist directory not found. API routes are active.');
  app.get('/', (req, res) => {
    res.status(200).send(`
      <!DOCTYPE html>
      <html>
        <head><title>SPC Solar - Server</title></head>
        <body style="font-family:sans-serif;text-align:center;padding:50px;">
          <h2>☀️ SPC Solar Backend Server is Live!</h2>
          <p>Frontend production bundle is being compiled or dist not found.</p>
          <p><a href="/health">Check Health</a></p>
        </body>
      </html>
    `);
  });
}

// Error Middleware
app.use(errorHandler);

// Process Safety Handlers
process.on('uncaughtException', (err) => {
  console.error('⚠️ [Uncaught Exception]:', err.message);
});

process.on('unhandledRejection', (reason) => {
  console.error('⚠️ [Unhandled Rejection]:', reason);
});

// Server binding configuration
const DEFAULT_PORT = 5000;
const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : DEFAULT_PORT;
const HOST = process.env.HOST || '0.0.0.0';

let server = null;

function startServer(targetPort, retriesLeft = 3) {
  let srv;
  if (typeof PhusionPassenger !== 'undefined') {
    try {
      PhusionPassenger.configure({ autoInstall: false });
    } catch (e) {}
    srv = app.listen('passenger', () => {
      console.log('🚀 Server started via Phusion Passenger socket');
    });
  } else {
    srv = app.listen(targetPort, HOST, () => {
      console.log(`🚀 Server successfully listening on http://${HOST}:${targetPort}`);
    });
  }

  srv.on('error', (err) => {
    if (err.code === 'EADDRINUSE') {
      console.error(`❌ [PORT CONFLICT] Port ${targetPort} is already in use.`);
      if (retriesLeft > 0 && !process.env.PORT) {
        const nextPort = targetPort + 1;
        console.log(`🔄 Retrying on fallback port ${nextPort} (${retriesLeft} retries left)...`);
        startServer(nextPort, retriesLeft - 1);
      } else {
        console.error(`💥 Fatal: Cannot bind to port ${targetPort}. Please check process.env.PORT or conflicting processes.`);
      }
    } else {
      console.error('Server error:', err);
    }
  });

  server = srv;
  return srv;
}

startServer(PORT);

module.exports = app;
