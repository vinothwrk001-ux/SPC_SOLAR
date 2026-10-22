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
 * @param {Array<{ name: string, url: string }>} items
 */
export const getBreadcrumbSchema = (items = []) => {
  const itemListElement = items.map((item, index) => ({
    '@type': 'ListItem',
    position: index + 1,
    name: item.name,
    item: item.url.startsWith('http')
      ? item.url
      : `${DEFAULT_SEO.siteUrl}${item.url.startsWith('/') ? item.url : `/${item.url}`}`,
  }));

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
  if (!faqs || faqs.length === 0) return null;

  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((faq) => ({
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
  title,
  description,
  url,
  image,
  datePublished,
  dateModified,
  authorName = 'SPC Solar Technical Editorial Team',
  tags = [],
}) => ({
  '@context': 'https://schema.org',
  '@type': 'BlogPosting',
  mainEntityOfPage: {
    '@type': 'WebPage',
    '@id': url.startsWith('http') ? url : `${DEFAULT_SEO.siteUrl}${url.startsWith('/') ? url : `/${url}`}`,
  },
  headline: title,
  description: description,
  image: image ? (image.startsWith('http') ? image : `${DEFAULT_SEO.siteUrl}${image.startsWith('/') ? image : `/${image}`}`) : DEFAULT_SEO.defaultImage,
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
  keywords: tags.join(', '),
});
