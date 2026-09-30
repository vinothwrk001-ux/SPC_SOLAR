const express = require('express');
const router = express.Router();
const { getQuotations, getQuotationById, createQuotation, updateQuotationStatus, deleteQuotation, sendQuotation } = require('../controllers/quotationController');
const { protect } = require('../middleware/authMiddleware');

router.route('/').get(protect, getQuotations).post(createQuotation);
router.route('/:id').get(protect, getQuotationById).delete(protect, deleteQuotation);
router.put('/:id/status', protect, updateQuotationStatus);
router.post('/:id/send', protect, sendQuotation);

module.exports = router;
