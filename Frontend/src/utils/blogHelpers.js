import DOMPurify from 'dompurify';

export const slugify = (text) => {
  if (!text) return '';
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')
    .replace(/[^\w\-]+/g, '')
    .replace(/\-\-+/g, '-')
    .replace(/^-+/, '')
    .replace(/-+$/, '');
};

export const formatDate = (dateString) => {
  if (!dateString) return 'Draft';
  try {
    const safeDateStr = typeof dateString === 'string' ? dateString.replace(' ', 'T') : dateString;
    const d = new Date(safeDateStr);
    if (isNaN(d.getTime())) return 'Recent';
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return d.toLocaleDateString('en-US', options);
  } catch {
    return 'Recent';
  }
};

export const sanitizeHTML = (content) => {
  if (!content) return '';
  return DOMPurify.sanitize(content, {
    ADD_TAGS: ['iframe'],
    ADD_ATTR: ['allow', 'allowfullscreen', 'frameborder', 'scrolling', 'target', 'rel']
  });
};

export const getImageUrl = (input) => {
  if (!input) return null;
  
  let url = input;
  // If an object is passed (e.g. { url: '...' }, { secure_url: '...' }, { src: '...' })
  if (typeof input === 'object' && input !== null) {
    url = input.url || input.secure_url || input.src || input.path || '';
  }
  
  if (typeof url !== 'string') return null;
  const cleanUrl = url.trim();
  if (!cleanUrl) return null;

  if (cleanUrl.startsWith('http') || cleanUrl.startsWith('data:') || cleanUrl.startsWith('blob:')) {
    return cleanUrl;
  }
  
  const backendUrl = import.meta.env.VITE_BACKEND_URL 
    || (import.meta.env.VITE_API_URL ? import.meta.env.VITE_API_URL.replace(/\/api$/, '') : '')
    || (typeof window !== 'undefined' && !['localhost', '127.0.0.1'].includes(window.location.hostname) ? window.location.origin : 'http://localhost:5000');
    
  if (cleanUrl.startsWith('/uploads/')) {
     return `${backendUrl}${cleanUrl}`;
  }
  
  // If it's just a filename like 'hybrid.png' or '/assets/...'
  if (cleanUrl.startsWith('/assets/')) return cleanUrl;
  
  return `${backendUrl}/uploads/${cleanUrl.startsWith('/') ? cleanUrl.slice(1) : cleanUrl}`;
};

export const generateArticleSchema = (blog, siteUrl = (typeof window !== 'undefined' ? window.location.origin : 'https://spcsolarcbe.com')) => {
  if (!blog) return null;
  const canonical = blog.seo?.canonicalUrl || `${siteUrl}/blog/${blog.slug}`;
  
  let rawImg = '';
  if (typeof blog.featuredImage === 'string') {
    rawImg = blog.featuredImage;
  } else if (blog.featuredImage && typeof blog.featuredImage === 'object') {
    rawImg = blog.featuredImage.url || blog.featuredImage.secure_url || '';
  }
  if (!rawImg && blog.mainImage) {
    rawImg = typeof blog.mainImage === 'string' ? blog.mainImage : (blog.mainImage.url || '');
  }

  let imageUrl = `${siteUrl}/assets/solar-hero.jpg`;
  if (rawImg && typeof rawImg === 'string') {
    const trimmed = rawImg.trim();
    if (trimmed.startsWith('http')) {
      imageUrl = trimmed;
    } else {
      imageUrl = `${siteUrl}${trimmed.startsWith('/') ? '' : '/'}${trimmed}`;
    }
  }

  return {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': canonical
    },
    headline: blog.seo?.metaTitle || blog.title,
    description: blog.seo?.metaDescription || blog.excerpt || blog.title,
    image: imageUrl,
    author: {
      '@type': 'Person',
      name: blog.author?.name || 'SPC Solar Expert'
    },
    publisher: {
      '@type': 'Organization',
      name: 'SPC Solar',
      logo: {
        '@type': 'ImageObject',
        url: `${siteUrl}/assets/logo.png`
      }
    },
    datePublished: blog.publishedAt || blog.createdAt,
    dateModified: blog.updatedAt || blog.publishedAt || blog.createdAt
  };
};

export const generateFAQSchema = (faqs) => {
  if (!Array.isArray(faqs) || faqs.length === 0) return null;

  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((f) => ({
      '@type': 'Question',
      name: f.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: f.answer
      }
    }))
  };
};
