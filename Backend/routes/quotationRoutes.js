const express = require('express');
const router = express.Router();
const path = require('path');
const fs = require('fs');
const multer = require('multer');
const { 
  getQuotations, 
  getQuotationById, 
  createQuotation, 
  updateQuotationStatus, 
  deleteQuotation, 
  sendQuotation,
  uploadQuotationPdf
} = require('../controllers/quotationController');
const { protect } = require('../middleware/authMiddleware');
const { optionalUser } = require('../middleware/userAuthMiddleware');

// Storage configuration for quotation PDFs
const quotationsDir = path.join(__dirname, '../uploads/quotations');
if (!fs.existsSync(quotationsDir)) {
  fs.mkdirSync(quotationsDir, { recursive: true });
}

const quotationStorage = multer.diskStorage({
  destination(req, file, cb) {
    cb(null, quotationsDir);
  },
  filename(req, file, cb) {
    // If client supplied a valid originalname matching .pdf, preserve and sanitize it
    if (file.originalname && file.originalname.toLowerCase().endsWith('.pdf')) {
      const sanitized = path.basename(file.originalname).replace(/[^a-zA-Z0-9_.-]/g, '_');
      return cb(null, sanitized);
    }
    const rawRef = req.body?.refNo || 'QUOTE';
    const cleanRef = rawRef.replace(/[^a-zA-Z0-9_-]/g, '');
    const cleanName = (req.body?.customerName || '').replace(/[^a-zA-Z0-9_-]/g, '_');
    const namePart = cleanName ? `_${cleanName}` : '';
    cb(null, `SPC_Solar_Quotation_${cleanRef}${namePart}.pdf`);
  }
});

const uploadPdf = multer({
  storage: quotationStorage,
  limits: { fileSize: 30 * 1024 * 1024 }, // 30MB
  fileFilter(req, file, cb) {
    if (file.mimetype === 'application/pdf' || path.extname(file.originalname).toLowerCase() === '.pdf') {
      cb(null, true);
    } else {
      cb(new Error('Only PDF files are allowed'));
    }
  }
});

router.route('/').get(protect, getQuotations).post(optionalUser, createQuotation);
router.post('/upload-pdf', uploadPdf.single('pdf'), uploadQuotationPdf);
router.route('/:id').get(protect, getQuotationById).delete(protect, deleteQuotation);
router.put('/:id/status', protect, updateQuotationStatus);
router.post('/:id/send', protect, sendQuotation);

module.exports = router;
