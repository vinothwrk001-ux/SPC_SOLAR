const https = require('https');
const { invalidateSitemapCache, buildSitemapXml } = require('../utils/sitemapGenerator');

/**
 * Perform a lightweight GET request with timeout
 */
const firePing = (url) => {
  return new Promise((resolve) => {
    try {
      const parsedUrl = new URL(url);
      const req = https.get(parsedUrl, { timeout: 8000 }, (res) => {
        resolve({ url, status: res.statusCode, success: res.statusCode >= 200 && res.statusCode < 400 });
      });
      req.on('error', (err) => {
        resolve({ url, error: err.message, success: false });
      });
      req.on('timeout', () => {
        req.destroy();
        resolve({ url, error: 'Request timed out', success: false });
      });
    } catch (err) {
      resolve({ url, error: err.message, success: false });
    }
  });
};

/**
 * Ping Google and Bing with the sitemap location
 */
const pingSearchEngines = async (customSitemapUrl = null) => {
  // Invalidate any stale in-memory sitemap cache
  invalidateSitemapCache();

  const baseUrl = (process.env.CLIENT_URL || 'https://spcsolarcbe.com').replace(/\/$/, '');
  const sitemapUrl = customSitemapUrl || `${baseUrl}/sitemap.xml`;
  const encodedSitemap = encodeURIComponent(sitemapUrl);

  const targets = [
    { name: 'Google Ping', url: `https://www.google.com/ping?sitemap=${encodedSitemap}` },
    { name: 'Bing Ping', url: `https://www.bing.com/ping?sitemap=${encodedSitemap}` }
  ];

  console.log(`[SEO Engine] Pinging search engine crawlers with: ${sitemapUrl}`);

  const results = await Promise.all(
    targets.map(async (target) => {
      const res = await firePing(target.url);
      return {
        service: target.name,
        targetUrl: target.url,
        status: res.status || null,
        success: res.success,
        error: res.error || null
      };
    })
  );

  return {
    sitemapUrl,
    timestamp: new Date().toISOString(),
    results
  };
};

/**
 * Submit URLs directly via IndexNow protocol (supported by Bing, Yandex, Seznam)
 */
const submitIndexNow = async (urls = []) => {
  if (!urls || urls.length === 0) return { skipped: true, reason: 'No URLs provided' };

  const host = (process.env.CLIENT_URL || 'https://spcsolarcbe.com')
    .replace(/^https?:\/\//, '')
    .replace(/\/$/, '');
  
  const key = process.env.INDEXNOW_KEY || 'spcsolarcbe2026indexnow';
  const postData = JSON.stringify({
    host,
    key,
    keyLocation: `https://${host}/${key}.txt`,
    urlList: urls
  });

  return new Promise((resolve) => {
    try {
      const req = https.request(
        'https://api.indexnow.org/indexnow',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json; charset=utf-8',
            'Content-Length': Buffer.byteLength(postData)
          },
          timeout: 8000
        },
        (res) => {
          resolve({
            status: res.statusCode,
            success: res.statusCode === 200 || res.statusCode === 202,
            submittedCount: urls.length
          });
        }
      );

      req.on('error', (err) => {
        resolve({ success: false, error: err.message });
      });

      req.write(postData);
      req.end();
    } catch (err) {
      resolve({ success: false, error: err.message });
    }
  });
};

/**
 * Comprehensive SEO Health & Verification Audit
 */
const getSEOAudit = async () => {
  const baseUrl = (process.env.CLIENT_URL || 'https://spcsolarcbe.com').replace(/\/$/, '');
  const { count } = await buildSitemapXml(baseUrl);

  return {
    domain: baseUrl,
    sitemapUrl: `${baseUrl}/sitemap.xml`,
    robotsTxtUrl: `${baseUrl}/robots.txt`,
    totalIndexedUrls: count,
    googleSearchConsole: {
      sitemapSubmissionStatus: 'Ready',
      recommendedAction: 'Submit https://spcsolarcbe.com/sitemap.xml directly in Google Search Console > Sitemaps',
      verificationMethodsSupported: [
        'HTML tag in index.html (google-site-verification)',
        'Domain DNS TXT record',
        'Google Analytics / Tag Manager'
      ]
    },
    localSEOMetadata: {
      businessName: 'SPC Solar (Smart Power Controls)',
      city: 'Coimbatore',
      state: 'Tamil Nadu',
      country: 'India',
      coordinates: '11.0168, 76.9558',
      focusKeywords: [
        'best solar in coimbatore',
        'solar company in coimbatore',
        'rooftop solar coimbatore',
        'pm surya ghar subsidy coimbatore'
      ]
    },
    timestamp: new Date().toISOString()
  };
};

module.exports = {
  pingSearchEngines,
  submitIndexNow,
  getSEOAudit
};
