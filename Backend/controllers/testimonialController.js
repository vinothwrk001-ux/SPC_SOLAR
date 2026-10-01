const Testimonial = require('../models/Testimonial');

// @desc Get public approved testimonials
// @route GET /api/testimonials
const getApprovedTestimonials = async (req, res) => {
  try {
    const data = await Testimonial.find({ status: 'Approved' }).sort({ createdAt: -1 });
    res.json(data);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc Submit a review by a customer/client (Saved as Pending for Admin Approval)
// @route POST /api/testimonials/submit
const submitCustomerReview = async (req, res) => {
  try {
    const { name, location, systemSize, rating, review } = req.body;
    if (!name || !review) {
      return res.status(400).json({ message: 'Name and review content are required' });
    }

    const newTestimonial = new Testimonial({
      name,
      location: location || 'Homeowner',
      systemSize: systemSize || '',
      rating: Number(rating) || 5,
      review,
      status: 'Pending',
      source: 'Customer'
    });

    const saved = await newTestimonial.save();
    res.status(201).json({
      message: 'Thank you for your review! It will be displayed after admin approval.',
      testimonial: saved
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// --- ADMIN CONTROLLERS ---

// @desc Get all testimonials for Admin
// @route GET /api/testimonials/admin/all
const getAllTestimonialsAdmin = async (req, res) => {
  try {
    const data = await Testimonial.find().sort({ createdAt: -1 });
    res.json(data);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc Admin directly creates an approved testimonial
// @route POST /api/testimonials/admin
const createAdminTestimonial = async (req, res) => {
  try {
    const testimonial = new Testimonial({
      ...req.body,
      status: req.body.status || 'Approved',
      source: 'Admin'
    });
    const saved = await testimonial.save();
    res.status(201).json(saved);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc Admin updates testimonial status (Approve / Reject)
// @route PUT /api/testimonials/admin/:id/status
const updateTestimonialStatus = async (req, res) => {
  try {
    const { status } = req.body;
    if (!['Approved', 'Pending', 'Rejected'].includes(status)) {
      return res.status(400).json({ message: 'Invalid status' });
    }

    const updated = await Testimonial.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );
    res.json(updated);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc Delete testimonial
// @route DELETE /api/testimonials/admin/:id
const deleteTestimonial = async (req, res) => {
  try {
    await Testimonial.findByIdAndDelete(req.params.id);
    res.json({ message: 'Testimonial removed successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getApprovedTestimonials,
  submitCustomerReview,
  getAllTestimonialsAdmin,
  createAdminTestimonial,
  updateTestimonialStatus,
  deleteTestimonial
};