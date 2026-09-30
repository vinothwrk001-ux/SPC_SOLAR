const Blog = require('../models/Blog');
const Category = require('../models/Category');
const { slugify, calculateReadingTime, extractTOC, sanitizeHTML } = require('../utils/blogUtils');

// ==========================================
// PUBLIC BLOG ENDPOINTS
// ==========================================

const getPublicBlogs = async (req, res) => {
  try {
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 9;
    const skip = (page - 1) * limit;

    const { category, tag, search, featured, popular } = req.query;

    const query = {
      status: 'PUBLISHED',
      $or: [
        { publishedAt: { $lte: new Date() } },
        { publishedAt: { $exists: false } }
      ]
    };

    if (category) {
      query.category = category;
    }

    if (tag) {
      query.tags = tag;
    }

    if (featured === 'true') {
      query.isFeatured = true;
    }

    if (popular === 'true') {
      query.isPopular = true;
    }

    if (search) {
      query.$text = { $search: search };
    }

    const total = await Blog.countDocuments(query);
    const blogs = await Blog.find(query)
      .select('-content')
      .sort({ publishedAt: -1, createdAt: -1 })
      .skip(skip)
      .limit(limit);

    res.json({
      blogs,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
        hasNextPage: page * limit < total,
        hasPreviousPage: page > 1
      }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getPublicBlogBySlug = async (req, res) => {
  try {
    const { slug } = req.params;
    const blog = await Blog.findOne({ slug }).populate('relatedBlogs', 'title slug excerpt featuredImage category publishedAt readingTime');

    if (!blog) {
      return res.status(404).json({ message: 'Blog article not found' });
    }

    // Check if published or preview mode request
    const isPreview = req.query.preview === 'true';
    if (!isPreview && blog.status !== 'PUBLISHED') {
      return res.status(404).json({ message: 'Blog article is not published' });
    }

    // Increment views asynchronously
    if (!isPreview) {
      Blog.findByIdAndUpdate(blog._id, { $inc: { views: 1 } }).exec();
    }

    // Dynamic TOC extraction if empty
    const toc = blog.toc && blog.toc.length > 0 ? blog.toc : extractTOC(blog.content);

    res.json({
      ...blog.toObject(),
      toc
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getFeaturedAndPopularBlogs = async (req, res) => {
  try {
    const baseQuery = { status: 'PUBLISHED' };

    const featured = await Blog.find({ ...baseQuery, isFeatured: true })
      .select('-content')
      .sort({ publishedAt: -1 })
      .limit(3);

    const popular = await Blog.find(baseQuery)
      .select('-content')
      .sort({ views: -1, likes: -1 })
      .limit(5);

    const latest = await Blog.find(baseQuery)
      .select('-content')
      .sort({ publishedAt: -1 })
      .limit(5);

    res.json({ featured, popular, latest });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ==========================================
// ADMIN CMS ENDPOINTS (PROTECTED)
// ==========================================

const getAdminBlogs = async (req, res) => {
  try {
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 10;
    const skip = (page - 1) * limit;

    const { status, search, category } = req.query;

    const query = {};
    if (status && status !== 'ALL') {
      query.status = status;
    }
    if (category) {
      query.category = category;
    }
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { tags: { $regex: search, $options: 'i' } }
      ];
    }

    const total = await Blog.countDocuments(query);
    const blogs = await Blog.find(query)
      .select('-content')
      .sort({ updatedAt: -1 })
      .skip(skip)
      .limit(limit);

    // Calculate Admin Stats Overview
    const stats = {
      total: await Blog.countDocuments({}),
      published: await Blog.countDocuments({ status: 'PUBLISHED' }),
      drafts: await Blog.countDocuments({ status: 'DRAFT' }),
      scheduled: await Blog.countDocuments({ status: 'SCHEDULED' }),
      archived: await Blog.countDocuments({ status: 'ARCHIVED' }),
      totalViewsAggregate: await Blog.aggregate([{ $group: { _id: null, totalViews: { $sum: '$views' } } }])
    };

    const totalViews = stats.totalViewsAggregate[0]?.totalViews || 0;

    res.json({
      blogs,
      stats: {
        total: stats.total,
        published: stats.published,
        drafts: stats.drafts,
        scheduled: stats.scheduled,
        archived: stats.archived,
        totalViews
      },
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getBlogById = async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);
    if (!blog) return res.status(404).json({ message: 'Blog not found' });
    res.json(blog);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const createBlog = async (req, res) => {
  try {
    const {
      title,
      subtitle,
      slug: customSlug,
      excerpt,
      content,
      contentFormat,
      featuredImage,
      author,
      category,
      tags,
      status,
      scheduledAt,
      seo,
      faq,
      relatedBlogs,
      isFeatured,
      isPopular,
      allowComments
    } = req.body;

    if (!title || !content) {
      return res.status(400).json({ message: 'Title and content are required' });
    }

    // Generate unique slug
    let finalSlug = slugify(customSlug || title);
    const slugExists = await Blog.findOne({ slug: finalSlug });
    if (slugExists) {
      finalSlug = `${finalSlug}-${Date.now().toString().slice(-4)}`;
    }

    const sanitizedContent = sanitizeHTML(content);
    const calculatedReadingTime = calculateReadingTime(sanitizedContent);
    const generatedTOC = extractTOC(sanitizedContent);

    const newBlog = new Blog({
      title,
      subtitle: subtitle || '',
      slug: finalSlug,
      excerpt: excerpt || title,
      content: sanitizedContent,
      contentFormat: contentFormat || 'HTML',
      featuredImage: featuredImage || {},
      author: author || { name: req.admin?.username || 'SPC Solar Admin' },
      category: category || 'Solar Basics',
      tags: Array.isArray(tags) ? tags : [],
      status: status || 'DRAFT',
      scheduledAt: scheduledAt ? new Date(scheduledAt) : null,
      publishedAt: status === 'PUBLISHED' ? new Date() : null,
      readingTime: calculatedReadingTime,
      seo: seo || {
        metaTitle: title,
        metaDescription: excerpt || title,
        focusKeyword: category || ''
      },
      toc: generatedTOC,
      faq: Array.isArray(faq) ? faq : [],
      relatedBlogs: Array.isArray(relatedBlogs) ? relatedBlogs : [],
      isFeatured: !!isFeatured,
      isPopular: !!isPopular,
      allowComments: allowComments !== undefined ? allowComments : true,
      createdBy: req.admin?._id,
      updatedBy: req.admin?._id
    });

    const saved = await newBlog.save();
    res.status(201).json(saved);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const updateBlog = async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);
    if (!blog) return res.status(404).json({ message: 'Blog not found' });

    const {
      title,
      subtitle,
      slug: newSlug,
      excerpt,
      content,
      contentFormat,
      featuredImage,
      author,
      category,
      tags,
      status,
      scheduledAt,
      seo,
      faq,
      relatedBlogs,
      isFeatured,
      isPopular,
      allowComments
    } = req.body;

    if (title) blog.title = title;
    if (subtitle !== undefined) blog.subtitle = subtitle;

    // Handle slug uniqueness check
    if (newSlug && newSlug !== blog.slug) {
      const slugClean = slugify(newSlug);
      const existing = await Blog.findOne({ slug: slugClean, _id: { $ne: blog._id } });
      if (existing) {
        return res.status(400).json({ message: 'A blog with this slug already exists' });
      }
      blog.slug = slugClean;
    }

    if (excerpt !== undefined) blog.excerpt = excerpt;

    if (content) {
      const sanitizedContent = sanitizeHTML(content);
      blog.content = sanitizedContent;
      blog.readingTime = calculateReadingTime(sanitizedContent);
      blog.toc = extractTOC(sanitizedContent);
    }

    if (contentFormat) blog.contentFormat = contentFormat;
    if (featuredImage) blog.featuredImage = featuredImage;
    if (author) blog.author = author;
    if (category) blog.category = category;
    if (tags) blog.tags = tags;

    if (status) {
      blog.status = status;
      if (status === 'PUBLISHED' && !blog.publishedAt) {
        blog.publishedAt = new Date();
      }
    }

    if (scheduledAt !== undefined) blog.scheduledAt = scheduledAt ? new Date(scheduledAt) : null;
    if (seo) blog.seo = seo;
    if (faq) blog.faq = faq;
    if (relatedBlogs) blog.relatedBlogs = relatedBlogs;
    if (isFeatured !== undefined) blog.isFeatured = isFeatured;
    if (isPopular !== undefined) blog.isPopular = isPopular;
    if (allowComments !== undefined) blog.allowComments = allowComments;

    blog.updatedBy = req.admin?._id;

    const updated = await blog.save();
    res.json(updated);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const publishBlog = async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);
    if (!blog) return res.status(404).json({ message: 'Blog not found' });

    blog.status = 'PUBLISHED';
    blog.publishedAt = new Date();
    await blog.save();
    res.json({ message: 'Blog published successfully', blog });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const unpublishBlog = async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);
    if (!blog) return res.status(404).json({ message: 'Blog not found' });

    blog.status = 'DRAFT';
    await blog.save();
    res.json({ message: 'Blog set to draft', blog });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const scheduleBlog = async (req, res) => {
  try {
    const { scheduledAt } = req.body;
    if (!scheduledAt) return res.status(400).json({ message: 'Scheduled date/time is required' });

    const blog = await Blog.findById(req.params.id);
    if (!blog) return res.status(404).json({ message: 'Blog not found' });

    blog.status = 'SCHEDULED';
    blog.scheduledAt = new Date(scheduledAt);
    await blog.save();

    res.json({ message: `Blog scheduled for ${blog.scheduledAt}`, blog });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const archiveBlog = async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);
    if (!blog) return res.status(404).json({ message: 'Blog not found' });

    blog.status = 'ARCHIVED';
    await blog.save();
    res.json({ message: 'Blog archived', blog });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const duplicateBlog = async (req, res) => {
  try {
    const original = await Blog.findById(req.params.id);
    if (!original) return res.status(404).json({ message: 'Original blog not found' });

    const duplicateTitle = `${original.title} (Copy)`;
    let duplicateSlug = slugify(duplicateTitle);
    const slugExists = await Blog.findOne({ slug: duplicateSlug });
    if (slugExists) {
      duplicateSlug = `${duplicateSlug}-${Date.now().toString().slice(-4)}`;
    }

    const copyData = original.toObject();
    delete copyData._id;
    delete copyData.createdAt;
    delete copyData.updatedAt;

    const newBlog = new Blog({
      ...copyData,
      title: duplicateTitle,
      slug: duplicateSlug,
      status: 'DRAFT',
      publishedAt: null,
      scheduledAt: null,
      views: 0,
      likes: 0,
      createdBy: req.admin?._id
    });

    const saved = await newBlog.save();
    res.status(201).json(saved);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const deleteBlog = async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);
    if (!blog) return res.status(404).json({ message: 'Blog not found' });

    await Blog.findByIdAndDelete(req.params.id);
    res.json({ message: 'Blog permanently deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Image Upload Endpoint for Blog Content / Featured Images
const uploadBlogImage = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No image file uploaded' });
    }
    const imageUrl = `/uploads/${req.file.filename}`;
    res.json({
      url: imageUrl,
      publicId: req.file.filename,
      alt: req.file.originalname
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getPublicBlogs,
  getPublicBlogBySlug,
  getFeaturedAndPopularBlogs,
  getAdminBlogs,
  getBlogById,
  createBlog,
  updateBlog,
  publishBlog,
  unpublishBlog,
  scheduleBlog,
  archiveBlog,
  duplicateBlog,
  deleteBlog,
  uploadBlogImage
};