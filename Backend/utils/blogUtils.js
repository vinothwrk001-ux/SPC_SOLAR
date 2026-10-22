/**
 * Blog Utilities (Pure CommonJS - No ESM or heavy JSDOM dependencies)
 */

const slugify = (text) => {
  if (!text) return '';
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-') // Replace spaces with -
    .replace(/[^\w\-]+/g, '') // Remove all non-word chars
    .replace(/\-\-+/g, '-') // Replace multiple - with single -
    .replace(/^-+/, '') // Trim - from start
    .replace(/-+$/, ''); // Trim - from end
};

const calculateReadingTime = (content) => {
  if (!content) return 1;
  const wordsPerMinute = 200;
  const text = content.replace(/<[^>]*>/g, ' '); // Strip HTML tags
  const words = text.trim().split(/\s+/).filter(Boolean).length;
  const time = Math.ceil(words / wordsPerMinute);
  return time > 0 ? time : 1;
};

const extractTOC = (htmlContent) => {
  if (!htmlContent) return [];
  const headingRegex = /<h([2-3])[^>]*>(.*?)<\/h[2-3]>/gi;
  const toc = [];
  let match;

  while ((match = headingRegex.exec(htmlContent)) !== null) {
    const level = parseInt(match[1], 10);
    const rawText = match[2].replace(/<[^>]*>/g, '').trim();
    const id = slugify(rawText);
    if (rawText) {
      toc.push({ id, text: rawText, level });
    }
  }

  return toc;
};

/**
 * Pure CommonJS HTML Sanitizer
 * Strips script tags, style injections, dangerous event handlers, and javascript: URIs.
 * Avoids isomorphic-dompurify/jsdom/encoding-lite ESM incompatibility on Node/Hostinger.
 */
const sanitizeHTML = (htmlContent) => {
  if (!htmlContent || typeof htmlContent !== 'string') return '';

  return htmlContent
    // Remove script tags and contents
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    // Remove object, embed, applet tags and contents
    .replace(/<(object|embed|applet)\b[^<]*(?:(?!<\/\1>)<[^<]*)*<\/\1>/gi, '')
    // Remove inline event handlers (e.g. onclick, onerror, onload)
    .replace(/\s+on[a-z]+\s*=\s*(['\"][^'\"]*['\"]|[^\s>]+)/gi, '')
    // Disarm javascript: and vbscript: URIs in href and src
    .replace(/(href|src)\s*=\s*['"]\s*(?:javascript|vbscript|data(?!\s*:\s*image)):[^'"]*['"]/gi, '$1="#"')
    // Remove dangerous meta/link/base tags
    .replace(/<(meta|link|base)\b[^>]*>/gi, '')
    .trim();
};

module.exports = {
  slugify,
  calculateReadingTime,
  extractTOC,
  sanitizeHTML
};
