const express = require('express');
const router = express.Router();
const { pingSearchEngines, submitIndexNow, getSEOAudit } = require('../services/seoIndexingService');
const { buildSitemapXml } = require('../utils/sitemapGenerator');

// GET /api/seo/audit - Comprehensive SEO status & search console audit
router.get('/audit', async (req, res) => {
  try {
    const audit = await getSEOAudit();
    res.json({ success: true, audit });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// POST /api/seo/ping - Ping Google & Bing with sitemap and trigger IndexNow
router.post('/ping', async (req, res) => {
  try {
    const { sitemapUrl, urls } = req.body || {};
    const pingResult = await pingSearchEngines(sitemapUrl);
    
    let indexNowResult = null;
    if (urls && Array.isArray(urls) && urls.length > 0) {
      indexNowResult = await submitIndexNow(urls);
    }

    res.json({
      success: true,
      message: 'Search engines pinged successfully',
      pingResult,
      indexNowResult
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// GET /api/seo/urls - Preview all URLs currently scheduled for sitemap indexing
router.get('/urls', async (req, res) => {
  try {
    const clientUrl = (process.env.CLIENT_URL || 'https://spcsolarcbe.com').replace(/\/$/, '');
    const { count } = await buildSitemapXml(clientUrl);
    res.json({
      success: true,
      domain: clientUrl,
      totalIndexedUrls: count,
      sitemapUrl: `${clientUrl}/sitemap.xml`
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

module.exports = router;
