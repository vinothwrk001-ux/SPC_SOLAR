const express = require('express');
const router = express.Router();
const upload = require('../middleware/uploadMiddleware');
const {
  getServices,
  getServiceById,
  createService,
  updateService,
  deleteService,
  toggleServiceStatus
} = require('../controllers/serviceController');
const { protect } = require('../middleware/authMiddleware');

router.route('/')
  .get(getServices)
  .post(protect, upload.single('image'), createService);

router.route('/:id')
  .get(getServiceById)
  .put(protect, upload.single('image'), updateService)
  .delete(protect, deleteService);

router.route('/:id/status')
  .patch(protect, toggleServiceStatus);

module.exports = router;