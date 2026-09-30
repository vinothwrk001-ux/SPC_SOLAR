const DOMPurify = require('isomorphic-dompurify');

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

const sanitizeHTML = (htmlContent) => {
  if (!htmlContent) return '';
  return DOMPurify.sanitize(htmlContent, {
    ADD_TAGS: ['iframe'], // Allow Youtube/Vimeo embeds safely
    ADD_ATTR: ['allow', 'allowfullscreen', 'frameborder', 'scrolling', 'target', 'rel']
  });
};

module.exports = {
  slugify,
  calculateReadingTime,
  extractTOC,
  sanitizeHTML
};
