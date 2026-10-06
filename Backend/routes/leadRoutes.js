const express = require('express');
const router = express.Router();
const leadController = require('../controllers/LeadController');
const { protect } = require('../middleware/authMiddleware');

// Public route to capture leads
router.post('/', leadController.createLead);

// Protected admin route to view leads
router.get('/', protect, leadController.getLeads);

module.exports = router;
