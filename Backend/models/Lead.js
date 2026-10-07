const mongoose = require('mongoose');

const leadSchema = new mongoose.Schema({
  phone: { type: String, required: true },
  name: { type: String, default: '' },
  city: { type: String, default: '' },
  state: { type: String, default: '' },
  source: { type: String, default: 'Quotation Modal (₹1,000 Offer)' },
  status: { 
    type: String, 
    enum: ['New', 'Contacted', 'Quoted', 'Follow-up', 'Converted', 'Closed'], 
    default: 'New' 
  },
  notes: { type: String, default: '' },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Lead', leadSchema);
