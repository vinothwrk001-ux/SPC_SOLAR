const Tag = require('../models/Tag');
const { slugify } = require('../utils/blogUtils');

const getTags = async (req, res) => {
  try {
    const tags = await Tag.find().sort({ name: 1 });
    res.json(tags);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const createTag = async (req, res) => {
  try {
    const { name, description } = req.body;
    if (!name) return res.status(400).json({ message: 'Tag name is required' });

    const slug = slugify(name);
    const existing = await Tag.findOne({ slug });
    if (existing) return res.status(400).json({ message: 'Tag already exists' });

    const tag = new Tag({
      name,
      slug,
      description: description || ''
    });

    const saved = await tag.save();
    res.status(201).json(saved);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const deleteTag = async (req, res) => {
  try {
    const tag = await Tag.findById(req.params.id);
    if (!tag) return res.status(404).json({ message: 'Tag not found' });

    await Tag.findByIdAndDelete(req.params.id);
    res.json({ message: 'Tag deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getTags,
  createTag,
  deleteTag
};
