import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { DEFAULT_SEO } from './defaultSEO';

/**
 * Utility helper to set or create a <meta> tag by name or property attribute.
 */
const updateMetaTag = (attr, key, content) => {
  if (typeof document === 'undefined') return;
  if (!content && content !== '') return;

  let element = document.querySelector(`meta[${attr}="${key}"]`);
  if (!element) {
    element = document.createElement('meta');
    element.setAttribute(attr, key);
    document.head.appendChild(element);
  }
  element.setAttribute('content', content);
};

/**
 * Utility helper to set or create a <link> tag by rel attribute.
 */
const updateLinkTag = (rel, href) => {
  if (typeof document === 'undefined') return;
  if (!href) return;

  let element = document.querySelector(`link[rel="${rel}"]`);
  if (!element) {
    element = document.createElement('link');
    element.setAttribute('rel', rel);
    document.head.appendChild(element);
  }
  element.setAttribute('href', href);
};

/**
 * Utility helper to inject or update JSON-LD Schema.org scripts.
 */
const updateJsonLd = (schema, id = 'spc-seo-schema') => {
  if (typeof document === 'undefined') return;

  // Remove existing schema if any
  const existing = document.getElementById(id);
  if (existing) {
    existing.remove();
  }

  if (!schema) return;

  const script = document.createElement('script');
  script.id = id;
  script.type = 'application/ld+json';
  script.text = JSON.stringify(schema, null, 2);
  document.head.appendChild(script);
};

/**
 * Production-Grade Master SEO Head Component
 */
export const SEOHead = ({
  title,
  description,
  keywords,
  canonical,
  ogImage,
  ogImageAlt,
  ogType = 'website',
  robots = 'index, follow',
  schema,
  article,
  children,
}) => {
  const location = useLocation();

  useEffect(() => {
    // 1. Calculate final values with fallbacks
    const formattedTitle = title
      ? title.includes('SPC Solar')
        ? title
        : `${title} | SPC Solar Coimbatore`
      : DEFAULT_SEO.defaultTitle;

    const finalDescription = description || DEFAULT_SEO.defaultDescription;
    const finalKeywords = Array.isArray(keywords)
      ? keywords.join(', ')
      : keywords || DEFAULT_SEO.defaultKeywords.join(', ');

    const currentUrl = canonical
      ? canonical.startsWith('http')
        ? canonical
        : `${DEFAULT_SEO.siteUrl}${canonical.startsWith('/') ? canonical : `/${canonical}`}`
      : `${DEFAULT_SEO.siteUrl}${location.pathname === '/' ? '' : location.pathname}`;

    const finalImage = ogImage
      ? ogImage.startsWith('http')
        ? ogImage
        : `${DEFAULT_SEO.siteUrl}${ogImage.startsWith('/') ? ogImage : `/${ogImage}`}`
      : DEFAULT_SEO.defaultImage;

    const finalImageAlt = ogImageAlt || `${title || 'SPC Solar'} — Smart Power Controls Coimbatore`;

    // 2. Set Document Title
    document.title = formattedTitle;

    // 3. Standard Meta Tags
    updateMetaTag('name', 'description', finalDescription);
    updateMetaTag('name', 'keywords', finalKeywords);
    updateMetaTag('name', 'robots', robots);
    updateMetaTag('name', 'author', DEFAULT_SEO.siteName);
    updateMetaTag('name', 'geo.region', 'IN-TN');
    updateMetaTag('name', 'geo.placename', 'Coimbatore');
    updateMetaTag('name', 'geo.position', `${DEFAULT_SEO.contact.geo.latitude};${DEFAULT_SEO.contact.geo.longitude}`);
    updateMetaTag('name', 'ICBM', `${DEFAULT_SEO.contact.geo.latitude}, ${DEFAULT_SEO.contact.geo.longitude}`);

    // 4. Canonical URL
    updateLinkTag('canonical', currentUrl);

    // 5. OpenGraph Tags (Facebook, WhatsApp, LinkedIn)
    updateMetaTag('property', 'og:site_name', DEFAULT_SEO.siteName);
    updateMetaTag('property', 'og:type', ogType);
    updateMetaTag('property', 'og:title', formattedTitle);
    updateMetaTag('property', 'og:description', finalDescription);
    updateMetaTag('property', 'og:url', currentUrl);
    updateMetaTag('property', 'og:image', finalImage);
    updateMetaTag('property', 'og:image:secure_url', finalImage);
    updateMetaTag('property', 'og:image:alt', finalImageAlt);
    updateMetaTag('property', 'og:image:width', '1200');
    updateMetaTag('property', 'og:image:height', '630');
    updateMetaTag('property', 'og:locale', DEFAULT_SEO.locale);

    // 6. Twitter Card Tags
    updateMetaTag('name', 'twitter:card', 'summary_large_image');
    updateMetaTag('name', 'twitter:site', DEFAULT_SEO.twitterHandle);
    updateMetaTag('name', 'twitter:title', formattedTitle);
    updateMetaTag('name', 'twitter:description', finalDescription);
    updateMetaTag('name', 'twitter:image', finalImage);
    updateMetaTag('name', 'twitter:image:alt', finalImageAlt);

    // 7. Article Specific Meta (for Blogs)
    if (ogType === 'article' && article) {
      if (article.publishedTime) {
        updateMetaTag('property', 'article:published_time', new Date(article.publishedTime).toISOString());
      }
      if (article.modifiedTime) {
        updateMetaTag('property', 'article:modified_time', new Date(article.modifiedTime).toISOString());
      }
      if (article.author) {
        updateMetaTag('property', 'article:author', article.author);
      }
      if (article.section) {
        updateMetaTag('property', 'article:section', article.section);
      }
      if (Array.isArray(article.tags)) {
        article.tags.forEach(tag => updateMetaTag('property', 'article:tag', tag));
      }
    }

    // 8. Inject Structured Data (JSON-LD)
    if (schema) {
      updateJsonLd(schema, 'spc-seo-schema');
    }

    // Cleanup on unmount or route change
    return () => {
      const activeSchema = document.getElementById('spc-seo-schema');
      if (activeSchema) {
        activeSchema.remove();
      }
    };
  }, [
    title,
    description,
    keywords,
    canonical,
    ogImage,
    ogImageAlt,
    ogType,
    robots,
    schema,
    article,
    location.pathname,
  ]);

  return children || null;
};

/**
 * Custom hook version of SEOHead for functional/imperative usage
 */
export const useSEO = (seoProps = {}) => {
  const location = useLocation();

  useEffect(() => {
    const formattedTitle = seoProps.title
      ? seoProps.title.includes('SPC Solar')
        ? seoProps.title
        : `${seoProps.title} | SPC Solar Coimbatore`
      : DEFAULT_SEO.defaultTitle;

    const finalDescription = seoProps.description || DEFAULT_SEO.defaultDescription;
    const finalKeywords = Array.isArray(seoProps.keywords)
      ? seoProps.keywords.join(', ')
      : seoProps.keywords || DEFAULT_SEO.defaultKeywords.join(', ');

    const currentUrl = seoProps.canonical
      ? seoProps.canonical.startsWith('http')
        ? seoProps.canonical
        : `${DEFAULT_SEO.siteUrl}${seoProps.canonical.startsWith('/') ? seoProps.canonical : `/${seoProps.canonical}`}`
      : `${DEFAULT_SEO.siteUrl}${location.pathname === '/' ? '' : location.pathname}`;

    const finalImage = seoProps.ogImage
      ? seoProps.ogImage.startsWith('http')
        ? seoProps.ogImage
        : `${DEFAULT_SEO.siteUrl}${seoProps.ogImage.startsWith('/') ? seoProps.ogImage : `/${seoProps.ogImage}`}`
      : DEFAULT_SEO.defaultImage;

    document.title = formattedTitle;

    updateMetaTag('name', 'description', finalDescription);
    updateMetaTag('name', 'keywords', finalKeywords);
    updateMetaTag('name', 'robots', seoProps.robots || 'index, follow');
    updateLinkTag('canonical', currentUrl);

    updateMetaTag('property', 'og:site_name', DEFAULT_SEO.siteName);
    updateMetaTag('property', 'og:type', seoProps.ogType || 'website');
    updateMetaTag('property', 'og:title', formattedTitle);
    updateMetaTag('property', 'og:description', finalDescription);
    updateMetaTag('property', 'og:url', currentUrl);
    updateMetaTag('property', 'og:image', finalImage);

    updateMetaTag('name', 'twitter:card', 'summary_large_image');
    updateMetaTag('name', 'twitter:title', formattedTitle);
    updateMetaTag('name', 'twitter:description', finalDescription);
    updateMetaTag('name', 'twitter:image', finalImage);

    if (seoProps.schema) {
      updateJsonLd(seoProps.schema, 'spc-seo-schema');
    }

    return () => {
      const activeSchema = document.getElementById('spc-seo-schema');
      if (activeSchema) {
        activeSchema.remove();
      }
    };
  }, [seoProps, location.pathname]);
};

export default SEOHead;
