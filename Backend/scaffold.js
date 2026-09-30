const fs = require('fs');
const path = require('path');

const models = ['Service', 'Project', 'Blog', 'Testimonial', 'Contact'];

models.forEach(model => {
  const lowerName = model.toLowerCase();
  
  // Controller
  const controllerContent = `
const ${model} = require('../models/${model}');

const get${model}s = async (req, res) => {
  try {
    const data = await ${model}.find();
    res.json(data);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const get${model}ById = async (req, res) => {
  try {
    const data = await ${model}.findById(req.params.id);
    if (data) res.json(data);
    else res.status(404).json({ message: '${model} not found' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const create${model} = async (req, res) => {
  try {
    const data = new ${model}(req.body);
    const savedData = await data.save();
    res.status(201).json(savedData);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const update${model} = async (req, res) => {
  try {
    const data = await ${model}.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(data);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const delete${model} = async (req, res) => {
  try {
    await ${model}.findByIdAndDelete(req.params.id);
    res.json({ message: '${model} removed' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { get${model}s, get${model}ById, create${model}, update${model}, delete${model} };
  `;
  fs.writeFileSync(path.join(__dirname, 'controllers', lowerName + 'Controller.js'), controllerContent.trim());

  // Route
  const routeContent = `
const express = require('express');
const router = express.Router();
const { get${model}s, get${model}ById, create${model}, update${model}, delete${model} } = require('../controllers/' + '${lowerName}Controller');
const { protect } = require('../middleware/authMiddleware');

router.route('/').get(get${model}s).post(protect, create${model});
router.route('/:id').get(get${model}ById).put(protect, update${model}).delete(protect, delete${model});

module.exports = router;
  `;
  fs.writeFileSync(path.join(__dirname, 'routes', lowerName + 'Routes.js'), routeContent.trim());
});

console.log("Basic controllers and routes generated.");
