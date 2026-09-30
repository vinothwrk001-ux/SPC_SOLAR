const express = require('express');
const router = express.Router();
const { getTags, createTag, deleteTag } = require('../controllers/tagController');
const { protect } = require('../middleware/authMiddleware');

router.route('/')
  .get(getTags)
  .post(protect, createTag);

router.route('/:id')
  .delete(protect, deleteTag);

module.exports = router;
