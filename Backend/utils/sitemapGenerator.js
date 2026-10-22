const Blog = require('../models/Blog');
const Category = require('../models/Category');
const Tag = require('../models/Tag');
const Project = require('../models/Project');

// Helper to escape special XML characters
const escapeXml = (unsafe) => {
  if (!unsafe) return '';
  return String(unsafe)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
};

// In-memory cache for ultra-fast crawler response
let cachedXml = null;
let lastCacheTime = 0;
const CACHE_TTL_MS = 30 * 60 * 1000; // 30 minutes

const invalidateSitemapCache = () => {
  cachedXml = null;
  lastCacheTime = 0;
};

const buildSitemapXml = async (clientUrl) => {
  const baseUrl = (clientUrl || process.env.CLIENT_URL || 'https://spcsolarcbe.com').replace(/\/$/, '');

  // 1. Fetch published blogs with featured images
  let blogs = [];
  try {
    blogs = await Blog.find({ 
      status: 'PUBLISHED', 
      publishedAt: { $lte: new Date() } 
    }).select('slug title excerpt featuredImage updatedAt publishedAt').lean();
  } catch (e) {
    console.warn('[Sitemap] Blog fetch error:', e.message);
  }

  // 2. Fetch categories
  let categories = [];
  try {
    categories = await Category.find({ status: 'ACTIVE' }).select('slug name updatedAt').lean();
  } catch (e) {
    console.warn('[Sitemap] Category fetch error:', e.message);
  }

  // 3. Fetch tags
  let tags = [];
  try {
    tags = await Tag.find({}).select('slug name updatedAt').lean();
  } catch (e) {
    console.warn('[Sitemap] Tag fetch error:', e.message);
  }

  // 4. Fetch projects
  let projects = [];
  try {
    projects = await Project.find({}).select('title image completedDate createdAt').lean();
  } catch (e) {
    console.warn('[Sitemap] Project fetch error:', e.message);
  }

  const nowIso = new Date().toISOString();

  let xml = `<?xml version="1.0" encoding="UTF-8"?>\n`;
  xml += `<urlset\n`;
  xml += `  xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"\n`;
  xml += `  xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">\n\n`;

  // ── 1. Core Static Landing Pages ─────────────────────────────────────────────
  const staticRoutes = [
    { loc: '', changefreq: 'daily', priority: '1.0', images: [
      { loc: `${baseUrl}/og-image.png`, title: 'Best Solar in Coimbatore - SPC Solar Rooftop Installations' },
      { loc: `${baseUrl}/logo.png`, title: 'SPC Solar Official Logo' }
    ]},
    { loc: '/services', changefreq: 'weekly', priority: '0.9' },
    { loc: '/subsidy', changefreq: 'weekly', priority: '0.9' },
    { loc: '/quotation', changefreq: 'weekly', priority: '0.9' },
    { loc: '/projects', changefreq: 'weekly', priority: '0.9' },
    { loc: '/about', changefreq: 'monthly', priority: '0.8' },
    { loc: '/contact', changefreq: 'monthly', priority: '0.8' },
    { loc: '/components', changefreq: 'monthly', priority: '0.8' },
    { loc: '/reels', changefreq: 'weekly', priority: '0.8' },
    { loc: '/blog', changefreq: 'daily', priority: '0.9' },
  ];

  staticRoutes.forEach((route) => {
    xml += `  <url>\n`;
    xml += `    <loc>${baseUrl}${route.loc}</loc>\n`;
    xml += `    <lastmod>${nowIso}</lastmod>\n`;
    xml += `    <changefreq>${route.changefreq}</changefreq>\n`;
    xml += `    <priority>${route.priority}</priority>\n`;
    if (route.images && route.images.length > 0) {
      route.images.forEach((img) => {
        xml += `    <image:image>\n`;
        xml += `      <image:loc>${escapeXml(img.loc)}</image:loc>\n`;
        if (img.title) xml += `      <image:title>${escapeXml(img.title)}</image:title>\n`;
        xml += `    </image:image>\n`;
      });
    }
    xml += `  </url>\n`;
  });

  // ── 2. Dynamic Published Blog Posts ─────────────────────────────────────────
  blogs.forEach((blog) => {
    const lastMod = blog.updatedAt ? new Date(blog.updatedAt).toISOString() : nowIso;
    xml += `  <url>\n`;
    xml += `    <loc>${baseUrl}/blog/${escapeXml(blog.slug)}</loc>\n`;
    xml += `    <lastmod>${lastMod}</lastmod>\n`;
    xml += `    <changefreq>daily</changefreq>\n`;
    xml += `    <priority>0.9</priority>\n`;

    const imgUrl = blog.featuredImage?.url;
    if (imgUrl) {
      const fullImgUrl = imgUrl.startsWith('http') 
        ? imgUrl 
        : `${baseUrl}${imgUrl.startsWith('/') ? '' : '/'}${imgUrl}`;
      xml += `    <image:image>\n`;
      xml += `      <image:loc>${escapeXml(fullImgUrl)}</image:loc>\n`;
      xml += `      <image:title>${escapeXml(blog.title || 'Solar Article')}</image:title>\n`;
      if (blog.excerpt) xml += `      <image:caption>${escapeXml(blog.excerpt)}</image:caption>\n`;
      xml += `    </image:image>\n`;
    }
    xml += `  </url>\n`;
  });

  // ── 3. Blog Category Archives ───────────────────────────────────────────────
  categories.forEach((cat) => {
    const lastMod = cat.updatedAt ? new Date(cat.updatedAt).toISOString() : nowIso;
    xml += `  <url>\n`;
    xml += `    <loc>${baseUrl}/blog/category/${escapeXml(cat.slug)}</loc>\n`;
    xml += `    <lastmod>${lastMod}</lastmod>\n`;
    xml += `    <changefreq>weekly</changefreq>\n`;
    xml += `    <priority>0.7</priority>\n`;
    xml += `  </url>\n`;
  });

  // ── 4. Blog Tag Archives ────────────────────────────────────────────────────
  tags.forEach((tag) => {
    const lastMod = tag.updatedAt ? new Date(tag.updatedAt).toISOString() : nowIso;
    xml += `  <url>\n`;
    xml += `    <loc>${baseUrl}/blog/tag/${escapeXml(tag.slug)}</loc>\n`;
    xml += `    <lastmod>${lastMod}</lastmod>\n`;
    xml += `    <changefreq>weekly</changefreq>\n`;
    xml += `    <priority>0.7</priority>\n`;
    xml += `  </url>\n`;
  });

  xml += `</urlset>`;
  return { xml, count: staticRoutes.length + blogs.length + categories.length + tags.length };
};

const generateSitemap = async (req, res) => {
  try {
    const now = Date.now();
    if (cachedXml && (now - lastCacheTime < CACHE_TTL_MS)) {
      res.header('Content-Type', 'application/xml; charset=utf-8');
      res.header('Cache-Control', 'public, max-age=1800, stale-while-revalidate=86400');
      return res.send(cachedXml);
    }

    const clientUrl = (process.env.CLIENT_URL || 'https://spcsolarcbe.com').replace(/\/$/, '');
    const { xml } = await buildSitemapXml(clientUrl);

    cachedXml = xml;
    lastCacheTime = now;

    res.header('Content-Type', 'application/xml; charset=utf-8');
    res.header('Cache-Control', 'public, max-age=1800, stale-while-revalidate=86400');
    res.send(xml);
  } catch (error) {
    console.error('[Sitemap] Critical generation failure:', error);
    // Graceful fallback to avoid 500 error for Googlebot
    const clientUrl = (process.env.CLIENT_URL || 'https://spcsolarcbe.com').replace(/\/$/, '');
    const fallbackXml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url><loc>${clientUrl}/</loc><priority>1.0</priority></url>
  <url><loc>${clientUrl}/services</loc><priority>0.9</priority></url>
  <url><loc>${clientUrl}/subsidy</loc><priority>0.9</priority></url>
  <url><loc>${clientUrl}/quotation</loc><priority>0.9</priority></url>
  <url><loc>${clientUrl}/projects</loc><priority>0.9</priority></url>
  <url><loc>${clientUrl}/blog</loc><priority>0.9</priority></url>
  <url><loc>${clientUrl}/about</loc><priority>0.8</priority></url>
  <url><loc>${clientUrl}/contact</loc><priority>0.8</priority></url>
</urlset>`;
    res.header('Content-Type', 'application/xml; charset=utf-8');
    res.send(fallbackXml);
  }
};

module.exports = { 
  generateSitemap, 
  buildSitemapXml, 
  invalidateSitemapCache 
};
