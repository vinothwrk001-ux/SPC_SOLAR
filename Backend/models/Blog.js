const mongoose = require('mongoose');

const blogSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    subtitle: { type: String, default: '' },
    slug: { type: String, required: true, unique: true, lowercase: true, trim: true },
    excerpt: { type: String, default: '' },
    content: { type: String, required: true },
    contentFormat: { type: String, enum: ['HTML', 'MARKDOWN'], default: 'HTML' },

    featuredImage: {
      url: { type: String, default: '' },
      publicId: { type: String, default: '' },
      alt: { type: String, default: 'Solar energy blog article image' },
      width: { type: Number, default: 1200 },
      height: { type: Number, default: 630 }
    },
    thumbnailImage: {
      url: { type: String, default: '' },
      publicId: { type: String, default: '' },
      alt: { type: String, default: 'Blog thumbnail image' },
    },
    mainImage: {
      url: { type: String, default: '' },
      publicId: { type: String, default: '' },
      alt: { type: String, default: 'Blog main image' },
    },

    author: {
      userId: { type: mongoose.Schema.Types.ObjectId, ref: 'Admin' },
      name: { type: String, default: 'SPC Solar Team' },
      avatar: { type: String, default: '' },
      bio: { type: String, default: 'Solar energy experts and renewable technology consultants.' },
      designation: { type: String, default: 'Solar Energy Consultant' }
    },

    category: { type: String, required: true, default: 'Solar Basics' },
    categoryRef: { type: mongoose.Schema.Types.ObjectId, ref: 'Category' },
    tags: [{ type: String, trim: true }],

    status: {
      type: String,
      enum: ['DRAFT', 'PUBLISHED', 'SCHEDULED', 'ARCHIVED'],
      default: 'DRAFT'
    },

    publishedAt: { type: Date },
    scheduledAt: { type: Date },

    readingTime: { type: Number, default: 3 }, // in minutes
    views: { type: Number, default: 0 },
    likes: { type: Number, default: 0 },

    seo: {
      metaTitle: { type: String, default: '' },
      metaDescription: { type: String, default: '' },
      focusKeyword: { type: String, default: '' },
      keywords: [{ type: String }],
      canonicalUrl: { type: String, default: '' },
      ogTitle: { type: String, default: '' },
      ogDescription: { type: String, default: '' },
      ogImage: { type: String, default: '' },
      noIndex: { type: Boolean, default: false },
      noFollow: { type: Boolean, default: false }
    },

    toc: [
      {
        id: { type: String },
        text: { type: String },
        level: { type: Number, default: 2 }
      }
    ],

    faq: [
      {
        question: { type: String },
        answer: { type: String }
      }
    ],

    relatedBlogs: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Blog' }],

    isFeatured: { type: Boolean, default: false },
    isPopular: { type: Boolean, default: false },
    allowComments: { type: Boolean, default: true },

    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'Admin' },
    updatedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'Admin' }
  },
  { timestamps: true }
);

// Database Indexes for High Performance Queries & Search
blogSchema.index({ status: 1, publishedAt: -1 });
blogSchema.index({ category: 1, status: 1 });
blogSchema.index({ tags: 1, status: 1 });
blogSchema.index({ title: 'text', excerpt: 'text', content: 'text', tags: 'text' });

module.exports = mongoose.model('Blog', blogSchema);
