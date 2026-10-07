const express = require('express');
const router = express.Router();
const upload = require('../middleware/uploadMiddleware');
const { protect } = require('../middleware/authMiddleware'); // assuming admin auth middleware exists

const {
  getGalleryComponents,
  createGalleryComponent,
  createBatchGalleryComponents,
  deleteGalleryComponent,
  updateGalleryComponent
} = require('../controllers/GalleryComponentController');

router.route('/')
  .get(getGalleryComponents)
  .post(protect, upload.single('image'), createGalleryComponent);

router.route('/batch')
  .post(protect, upload.array('images', 50), createBatchGalleryComponents);

router.route('/:id')
  .put(protect, upload.single('image'), updateGalleryComponent)
  .delete(protect, deleteGalleryComponent);

module.exports = router;
