import { DEFAULT_SEO } from './defaultSEO';

/**
 * Master LocalBusiness & Solar Energy Company Schema
 * Triggers Google Maps, Local 3-Pack & Knowledge Graph for "solar company in coimbatore"
 */
export const getLocalBusinessSchema = () => ({
  '@context': 'https://schema.org',
  '@type': ['LocalBusiness', 'SolarEnergyCompany', 'HomeAndConstructionBusiness'],
  '@id': `${DEFAULT_SEO.siteUrl}/#localbusiness`,
  name: DEFAULT_SEO.siteName,
  legalName: DEFAULT_SEO.brandName,
  url: DEFAULT_SEO.siteUrl,
  logo: DEFAULT_SEO.defaultLogo,
  image: [
    DEFAULT_SEO.defaultImage,
    DEFAULT_SEO.defaultLogo,
  ],
  description: DEFAULT_SEO.defaultDescription,
  telephone: DEFAULT_SEO.contact.phone,
  email: DEFAULT_SEO.contact.email,
  priceRange: DEFAULT_SEO.contact.priceRange,
  currenciesAccepted: 'INR',
  paymentAccepted: 'Cash, Credit Card, UPI, Net Banking, Cheque, Bank Transfer',
  address: {
    '@type': 'PostalAddress',
    streetAddress: DEFAULT_SEO.contact.address.streetAddress,
    addressLocality: DEFAULT_SEO.contact.address.addressLocality,
    addressRegion: DEFAULT_SEO.contact.address.addressRegion,
    postalCode: DEFAULT_SEO.contact.address.postalCode,
    addressCountry: DEFAULT_SEO.contact.address.addressCountry,
  },
  geo: {
    '@type': 'GeoCoordinates',
    latitude: DEFAULT_SEO.contact.geo.latitude,
    longitude: DEFAULT_SEO.contact.geo.longitude,
  },
  openingHoursSpecification: [
    {
      '@type': 'OpeningHoursSpecification',
      dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
      opens: '10:00',
      closes: '19:00',
    },
  ],
  areaServed: DEFAULT_SEO.contact.areaServed.map((area) => ({
    '@type': 'AdministrativeArea',
    name: area,
  })),
  sameAs: [
    DEFAULT_SEO.social.facebook,
    DEFAULT_SEO.social.instagram,
    DEFAULT_SEO.social.youtube,
    DEFAULT_SEO.social.linkedin,
  ],
  hasOfferCatalog: {
    '@type': 'OfferCatalog',
    name: 'Solar Power Solutions & Installation Services',
    itemListElement: [
      {
        '@type': 'Offer',
        itemOffered: {
          '@type': 'Service',
          name: 'Rooftop Solar Installation',
          description: 'Turnkey residential and commercial rooftop solar installation with PM Surya Ghar subsidy assistance in Coimbatore.',
        },
      },
      {
        '@type': 'Offer',
        itemOffered: {
          '@type': 'Service',
          name: 'On-Grid Solar Systems',
          description: 'Grid-tied solar systems with TANGEDCO bi-directional net metering to reduce electricity bills by up to 90%.',
        },
      },
      {
        '@type': 'Offer',
        itemOffered: {
          '@type': 'Service',
          name: 'Hybrid & Off-Grid Solar Systems',
          description: 'Battery-backed solar systems ensuring 24/7 uninterrupted power for residential, agricultural and commercial use.',
        },
      },
      {
        '@type': 'Offer',
        itemOffered: {
          '@type': 'Service',
          name: 'PM Surya Ghar Muft Bijli Yojana Subsidy',
          description: 'Complete liaisoning and doorstep assistance for government solar subsidy up to ₹78,000 in Tamil Nadu.',
        },
      },
      {
        '@type': 'Offer',
        itemOffered: {
          '@type': 'Service',
          name: 'Commercial & Industrial Solar EPC',
          description: 'High-capacity MW and kW scale solar plants for factories, textile mills, educational institutions, and hospitals.',
        },
      },
    ],
  },
});

/**
 * Organization Schema
 */
export const getOrganizationSchema = () => ({
  '@context': 'https://schema.org',
  '@type': 'Organization',
  '@id': `${DEFAULT_SEO.siteUrl}/#organization`,
  name: DEFAULT_SEO.siteName,
  legalName: DEFAULT_SEO.brandName,
  url: DEFAULT_SEO.siteUrl,
  logo: {
    '@type': 'ImageObject',
    url: DEFAULT_SEO.defaultLogo,
    width: '250',
    height: '60',
  },
  contactPoint: {
    '@type': 'ContactPoint',
    telephone: DEFAULT_SEO.contact.phone,
    contactType: 'customer service',
    areaServed: 'IN',
    availableLanguage: ['en', 'ta'],
  },
  sameAs: [
    DEFAULT_SEO.social.facebook,
    DEFAULT_SEO.social.instagram,
    DEFAULT_SEO.social.youtube,
    DEFAULT_SEO.social.linkedin,
  ],
});

/**
 * WebSite Schema with Sitelinks SearchBox
 */
export const getWebSiteSchema = () => ({
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  '@id': `${DEFAULT_SEO.siteUrl}/#website`,
  url: DEFAULT_SEO.siteUrl,
  name: DEFAULT_SEO.siteName,
  description: DEFAULT_SEO.defaultDescription,
  publisher: {
    '@id': `${DEFAULT_SEO.siteUrl}/#organization`,
  },
  potentialAction: {
    '@type': 'SearchAction',
    target: `${DEFAULT_SEO.siteUrl}/blog?search={search_term_string}`,
    'query-input': 'required name=search_term_string',
  },
  inLanguage: DEFAULT_SEO.locale,
});

/**
 * BreadcrumbList Schema
 * Supports both { name, url } and { label, to } formats, resilient to undefined
 * @param {Array<{ name?: string, label?: string, url?: string, to?: string }>} items
 */
export const getBreadcrumbSchema = (items = []) => {
  if (!Array.isArray(items) || items.length === 0) return null;

  const validItems = items.filter(Boolean);
  const itemListElement = validItems.map((item, index) => {
    const rawName = item?.name || item?.label || item?.title || `Item ${index + 1}`;
    const rawUrl = item?.url || item?.to || item?.href || item?.path || '';

    let fullUrl = DEFAULT_SEO.siteUrl;
    if (rawUrl) {
      const strUrl = String(rawUrl).trim();
      if (strUrl.startsWith('http://') || strUrl.startsWith('https://')) {
        fullUrl = strUrl;
      } else {
        fullUrl = `${DEFAULT_SEO.siteUrl}${strUrl.startsWith('/') ? strUrl : `/${strUrl}`}`;
      }
    }

    return {
      '@type': 'ListItem',
      position: index + 1,
      name: rawName,
      item: fullUrl,
    };
  });

  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement,
  };
};

/**
 * FAQPage Schema
 * @param {Array<{ question: string, answer: string }>} faqs
 */
export const getFAQSchema = (faqs = []) => {
  if (!Array.isArray(faqs) || faqs.length === 0) return null;

  const validFaqs = faqs.filter((f) => f && f.question && f.answer);
  if (validFaqs.length === 0) return null;

  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: validFaqs.map((faq) => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer,
      },
    })),
  };
};

/**
 * Article / BlogPosting Schema
 */
export const getArticleSchema = ({
  title = '',
  description = '',
  url = '',
  image = '',
  datePublished,
  dateModified,
  authorName = 'SPC Solar Technical Editorial Team',
  tags = [],
} = {}) => {
  const strUrl = url ? String(url).trim() : '';
  const fullUrl = strUrl
    ? (strUrl.startsWith('http://') || strUrl.startsWith('https://') 
        ? strUrl 
        : `${DEFAULT_SEO.siteUrl}${strUrl.startsWith('/') ? strUrl : `/${strUrl}`}`)
    : DEFAULT_SEO.siteUrl;

  const strImage = image ? String(image).trim() : '';
  const fullImage = strImage
    ? (strImage.startsWith('http://') || strImage.startsWith('https://')
        ? strImage
        : `${DEFAULT_SEO.siteUrl}${strImage.startsWith('/') ? strImage : `/${strImage}`}`)
    : DEFAULT_SEO.defaultImage;

  return {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': fullUrl,
    },
    headline: title,
    description: description,
    image: fullImage,
    datePublished: datePublished ? new Date(datePublished).toISOString() : new Date().toISOString(),
    dateModified: dateModified ? new Date(dateModified).toISOString() : new Date().toISOString(),
    author: {
      '@type': 'Person',
      name: authorName,
    },
    publisher: {
      '@type': 'Organization',
      name: DEFAULT_SEO.siteName,
      logo: {
        '@type': 'ImageObject',
        url: DEFAULT_SEO.defaultLogo,
      },
    },
    keywords: Array.isArray(tags) ? tags.join(', ') : String(tags || ''),
  };
};
