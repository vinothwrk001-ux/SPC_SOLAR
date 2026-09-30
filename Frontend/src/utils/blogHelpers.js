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
  const options = { year: 'numeric', month: 'short', day: 'numeric' };
  return new Date(dateString).toLocaleDateString('en-US', options);
};

export const sanitizeHTML = (content) => {
  if (!content) return '';
  return DOMPurify.sanitize(content, {
    ADD_TAGS: ['iframe'],
    ADD_ATTR: ['allow', 'allowfullscreen', 'frameborder', 'scrolling', 'target', 'rel']
  });
};

export const generateArticleSchema = (blog, siteUrl = 'http://localhost:5173') => {
  if (!blog) return null;
  const canonical = blog.seo?.canonicalUrl || `${siteUrl}/blog/${blog.slug}`;
  const imageUrl = blog.featuredImage?.url
    ? (blog.featuredImage.url.startsWith('http') ? blog.featuredImage.url : `${siteUrl}${blog.featuredImage.url}`)
    : `${siteUrl}/assets/solar-hero.jpg`;

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
