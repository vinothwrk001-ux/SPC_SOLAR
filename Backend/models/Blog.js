const mongoose = require('mongoose');

const blogSchema = new mongoose.Schema({
  title: String,
  slug: String,
  excerpt: String,
  content: String,
  thumbnail: String,
  category: String,
  tags: [String],
  metaTitle: String,
  metaDescription: String,
  isPublished: { type: Boolean, default: false },
  publishedAt: Date,
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Blog', blogSchema);
