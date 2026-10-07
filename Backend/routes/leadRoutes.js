const express = require('express');
const router = express.Router();
const leadController = require('../controllers/LeadController');
const { protect } = require('../middleware/authMiddleware');

// Public route to capture leads from the website modal
router.post('/', leadController.createLead);

// Protected admin routes to view, update and delete leads
router.get('/', protect, leadController.getLeads);
router.put('/:id', protect, leadController.updateLead);
router.delete('/:id', protect, leadController.deleteLead);

module.exports = router;
