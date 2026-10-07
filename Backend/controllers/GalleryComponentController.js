const GalleryComponent = require('../models/GalleryComponent');
const fs = require('fs');
const path = require('path');

// @desc    Get all gallery components
// @route   GET /api/gallery-components
// @access  Public
exports.getGalleryComponents = async (req, res) => {
  try {
    const components = await GalleryComponent.find().sort({ createdAt: -1 });
    res.json(components);
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

// @desc    Create a new gallery component
// @route   POST /api/gallery-components
// @access  Private/Admin
exports.createGalleryComponent = async (req, res) => {
  try {
    const { title, description, category } = req.body;

    if (!req.file) {
      return res.status(400).json({ message: 'Please upload an image' });
    }

    const imageUrl = `/uploads/${req.file.filename}`;

    const component = new GalleryComponent({
      title,
      description,
      category: category || 'Components',
      imageUrl,
    });

    const savedComponent = await component.save();
    res.status(201).json(savedComponent);
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

// @desc    Create multiple gallery components in batch
// @route   POST /api/gallery-components/batch
// @access  Private/Admin
exports.createBatchGalleryComponents = async (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ message: 'Please upload at least one image' });
    }

    const { category, defaultTitle, defaultDescription } = req.body;
    let itemsData = [];
    if (req.body.items) {
      try {
        itemsData = typeof req.body.items === 'string' ? JSON.parse(req.body.items) : req.body.items;
      } catch (e) {
        itemsData = [];
      }
    }

    const createdComponents = [];

    for (let i = 0; i < req.files.length; i++) {
      const file = req.files[i];
      const customMeta = itemsData[i] || {};
      
      const fallbackTitle = file.originalname
        ? file.originalname.replace(/\.[^/.]+$/, '').replace(/[-_]/g, ' ')
        : `Image ${i + 1}`;

      const finalTitle = (customMeta.title && customMeta.title.trim())
        ? customMeta.title.trim()
        : (defaultTitle ? (req.files.length > 1 ? `${defaultTitle} - ${i + 1}` : defaultTitle) : fallbackTitle);
      
      const finalDescription = (customMeta.description !== undefined && customMeta.description !== null)
        ? customMeta.description
        : (defaultDescription || '');
      
      const finalCategory = customMeta.category?.trim() || category?.trim() || 'Components';
      const imageUrl = `/uploads/${file.filename}`;

      const component = new GalleryComponent({
        title: finalTitle,
        description: finalDescription,
        category: finalCategory,
        imageUrl,
      });

      const saved = await component.save();
      createdComponents.push(saved);
    }

    res.status(201).json({
      message: `Successfully uploaded ${createdComponents.length} images`,
      components: createdComponents
    });
  } catch (error) {
    res.status(500).json({ message: 'Server Error during batch upload', error: error.message });
  }
};

// @desc    Delete a gallery component
// @route   DELETE /api/gallery-components/:id
// @access  Private/Admin
exports.deleteGalleryComponent = async (req, res) => {
  try {
    const component = await GalleryComponent.findById(req.params.id);

    if (!component) {
      return res.status(404).json({ message: 'Gallery component not found' });
    }

    // Delete image file if it exists locally
    if (component.imageUrl && component.imageUrl.startsWith('/uploads/')) {
      const filePath = path.join(__dirname, '..', component.imageUrl);
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
    }

    await component.deleteOne();
    res.json({ message: 'Gallery component removed' });
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

// @desc    Update a gallery component
// @route   PUT /api/gallery-components/:id
// @access  Private/Admin
exports.updateGalleryComponent = async (req, res) => {
  try {
    const { title, description, category } = req.body;
    const component = await GalleryComponent.findById(req.params.id);

    if (!component) {
      return res.status(404).json({ message: 'Gallery component not found' });
    }

    if (title) component.title = title;
    if (description !== undefined) component.description = description;
    if (category) component.category = category;

    if (req.file) {
      // Delete old image
      if (component.imageUrl && component.imageUrl.startsWith('/uploads/')) {
        const filePath = path.join(__dirname, '..', component.imageUrl);
        if (fs.existsSync(filePath)) {
          fs.unlinkSync(filePath);
        }
      }
      component.imageUrl = `/uploads/${req.file.filename}`;
    }

    const updatedComponent = await component.save();
    res.json(updatedComponent);
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};
