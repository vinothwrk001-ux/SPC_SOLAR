const express = require('express');
const router = express.Router();
const upload = require('../middleware/uploadMiddleware');
const {
  getProjects,
  getProjectById,
  createProject,
  updateProject,
  deleteProject,
  toggleFeatured
} = require('../controllers/projectController');
const { protect } = require('../middleware/authMiddleware');

router.route('/')
  .get(getProjects)
  .post(protect, upload.single('image'), createProject);

router.route('/:id')
  .get(getProjectById)
  .put(protect, upload.single('image'), updateProject)
  .delete(protect, deleteProject);

router.route('/:id/feature')
  .patch(protect, toggleFeatured);

module.exports = router;