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
