const mongoose = require('mongoose');

const commentSchema = new mongoose.Schema({
  name: { type: String, default: 'Solar Visitor' },
  text: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
});

const reelSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, default: '' },
  videoUrl: { type: String, required: true },
  thumbnailUrl: { type: String, default: '' },
  category: { 
    type: String, 
    enum: ['Installation', 'Testimonial', 'Commercial', 'Subsidy Explainer', 'Products'], 
    default: 'Installation' 
  },
  tags: [{ type: String }],
  systemCapacity: { type: String, default: '5 kW System' },
  location: { type: String, default: 'Coimbatore, Tamil Nadu' },
  linkedService: { type: String, default: 'Rooftop Solar Installation' },
  
  status: { type: String, enum: ['Published', 'Draft', 'Archived'], default: 'Published' },
  showOnStorefront: { type: Boolean, default: true },

  // Metrics
  viewsCount: { type: Number, default: 0 },
  likesCount: { type: Number, default: 0 },
  commentsCount: { type: Number, default: 0 },
  sharesCount: { type: Number, default: 0 },
  savesCount: { type: Number, default: 0 },
  quoteClicksCount: { type: Number, default: 0 },

  // Interactive Collections / Arrays
  likes: [{ type: String }], // sessionId or user identifier
  saves: [{ type: String }],
  comments: [commentSchema]
}, { timestamps: true });

module.exports = mongoose.model('Reel', reelSchema);
