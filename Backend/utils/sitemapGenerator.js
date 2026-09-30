const Blog = require('../models/Blog');
const Category = require('../models/Category');

const generateSitemap = async (req, res) => {
  try {
    const clientUrl = process.env.CLIENT_URL || 'http://localhost:5173';

    const blogs = await Blog.find({ status: 'PUBLISHED', publishedAt: { $lte: new Date() } }).select('slug updatedAt');
    const categories = await Category.find({ status: 'ACTIVE' }).select('slug updatedAt');

    let xml = `<?xml version="1.0" encoding="UTF-8"?>\n`;
    xml += `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n`;

    // Static pages
    const staticPages = ['', '/about', '/services', '/projects', '/subsidy', '/blog', '/contact', '/quotation'];
    staticPages.forEach((page) => {
      xml += `  <url>\n    <loc>${clientUrl}${page}</loc>\n    <changefreq>weekly</changefreq>\n    <priority>0.8</priority>\n  </url>\n`;
    });

    // Blog Category pages
    categories.forEach((cat) => {
      xml += `  <url>\n    <loc>${clientUrl}/blog/category/${cat.slug}</loc>\n    <changefreq>weekly</changefreq>\n    <priority>0.7</priority>\n  </url>\n`;
    });

    // Published Blog detail pages
    blogs.forEach((blog) => {
      const lastMod = blog.updatedAt ? new Date(blog.updatedAt).toISOString() : new Date().toISOString();
      xml += `  <url>\n    <loc>${clientUrl}/blog/${blog.slug}</loc>\n    <lastmod>${lastMod}</lastmod>\n    <changefreq>daily</changefreq>\n    <priority>0.9</priority>\n  </url>\n`;
    });

    xml += `</urlset>`;

    res.header('Content-Type', 'application/xml');
    res.send(xml);
  } catch (error) {
    res.status(500).send('Error generating sitemap');
  }
};

module.exports = { generateSitemap };
