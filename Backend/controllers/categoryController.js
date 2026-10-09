const Category = require('../models/Category');
const Blog = require('../models/Blog');
const { slugify } = require('../utils/blogUtils');

const DEFAULT_CATEGORIES = [
  { name: 'Government Schemes', slug: 'government-schemes', description: 'PM Surya Ghar scheme, TANGEDCO subsidies and policy updates.' },
  { name: 'Solar Basics', slug: 'solar-basics', description: 'Beginner guides on how solar panels, inverters and net metering work.' },
  { name: 'Residential Solar', slug: 'residential-solar', description: 'Rooftop solar installations and cost guides for homes and villas.' },
  { name: 'Commercial Solar', slug: 'commercial-solar', description: 'Rooftop solar solutions for businesses, industries, and institutions.' },
  { name: 'Solar Maintenance', slug: 'solar-maintenance', description: 'Panel cleaning, inverter health checks, and preventive maintenance.' },
  { name: 'Subsidies & Net Metering', slug: 'subsidies-net-metering', description: 'Net metering guidelines, DISCOM approvals, and tariff rules.' }
];

const getCategories = async (req, res) => {
  try {
    let categories = await Category.find().sort({ name: 1 });
    if (!categories || categories.length === 0) {
      await Category.insertMany(DEFAULT_CATEGORIES);
      categories = await Category.find().sort({ name: 1 });
    }
    res.json(categories);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const createCategory = async (req, res) => {
  try {
    const { name, description, image, seoTitle, seoDescription } = req.body;
    if (!name) return res.status(400).json({ message: 'Category name is required' });

    const slug = slugify(name);
    const existing = await Category.findOne({ slug });
    if (existing) return res.status(400).json({ message: 'Category already exists' });

    const category = new Category({
      name,
      slug,
      description: description || '',
      image: image || '',
      seoTitle: seoTitle || name,
      seoDescription: seoDescription || description || ''
    });

    const saved = await category.save();
    res.status(201).json(saved);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const updateCategory = async (req, res) => {
  try {
    const { name, description, image, seoTitle, seoDescription, status } = req.body;
    const category = await Category.findById(req.params.id);
    if (!category) return res.status(404).json({ message: 'Category not found' });

    if (name) {
      category.name = name;
      category.slug = slugify(name);
    }
    if (description !== undefined) category.description = description;
    if (image !== undefined) category.image = image;
    if (seoTitle !== undefined) category.seoTitle = seoTitle;
    if (seoDescription !== undefined) category.seoDescription = seoDescription;
    if (status !== undefined) category.status = status;

    const updated = await category.save();
    res.json(updated);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const deleteCategory = async (req, res) => {
  try {
    const category = await Category.findById(req.params.id);
    if (!category) return res.status(404).json({ message: 'Category not found' });

    // Check if blogs depend on this category
    const count = await Blog.countDocuments({ category: category.name });
    if (count > 0) {
      return res.status(400).json({
        message: `Cannot delete category. ${count} blogs are assigned to this category.`
      });
    }

    await Category.findByIdAndDelete(req.params.id);
    res.json({ message: 'Category deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getCategories,
  createCategory,
  updateCategory,
  deleteCategory
};
