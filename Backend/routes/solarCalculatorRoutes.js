const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const { optionalUser } = require('../middleware/userAuthMiddleware');
const {
  getPublicConfig,
  performCalculation,
  createCalculatorLead,
  getAdminConfig,
  updateAdminConfig,
  getPanels,
  createPanel,
  updatePanel,
  deletePanel,
  getInverters,
  createInverter,
  updateInverter,
  deleteInverter
} = require('../controllers/solarCalculatorController');

// Public endpoints
router.get('/config', getPublicConfig);
router.post('/calculate', performCalculation);
router.post('/leads', optionalUser, createCalculatorLead);

// Admin endpoints (Protected)
router.get('/admin/config', protect, getAdminConfig);
router.put('/admin/config', protect, updateAdminConfig);

router.get('/admin/panels', protect, getPanels);
router.post('/admin/panels', protect, createPanel);
router.put('/admin/panels/:id', protect, updatePanel);
router.delete('/admin/panels/:id', protect, deletePanel);

router.get('/admin/inverters', protect, getInverters);
router.post('/admin/inverters', protect, createInverter);
router.put('/admin/inverters/:id', protect, updateInverter);
router.delete('/admin/inverters/:id', protect, deleteInverter);

module.exports = router;
