const mongoose = require('mongoose');

const validStatuses = [
  'New', 'Contacted', 'Quoted', 'Follow-up', 'In Discussion', 'Converted', 'Closed', 'Lost',
  'NEW', 'CONTACTED', 'QUOTED', 'FOLLOW_UP', 'IN_DISCUSSION', 'CONVERTED', 'CLOSED', 'LOST'
];

const leadSchema = new mongoose.Schema({
  phone: { type: String, required: true },
  name: { type: String, default: '' },
  city: { type: String, default: '' },
  state: { type: String, default: '' },
  source: { type: String, default: 'Quotation Modal (₹1,000 Offer)' },
  status: { 
    type: String, 
    enum: validStatuses,
    default: 'New' 
  },
  notes: { type: String, default: '' },
  monthlyBill: { type: String, default: '' },
  systemSize: { type: String, default: '' },
  email: { type: String, default: '' },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Lead', leadSchema);
