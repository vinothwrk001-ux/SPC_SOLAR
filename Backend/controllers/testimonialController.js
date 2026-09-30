const Testimonial = require('../models/Testimonial');

const getTestimonials = async (req, res) => {
  try {
    const data = await Testimonial.find();
    res.json(data);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getTestimonialById = async (req, res) => {
  try {
    const data = await Testimonial.findById(req.params.id);
    if (data) res.json(data);
    else res.status(404).json({ message: 'Testimonial not found' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const createTestimonial = async (req, res) => {
  try {
    const data = new Testimonial(req.body);
    const savedData = await data.save();
    res.status(201).json(savedData);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const updateTestimonial = async (req, res) => {
  try {
    const data = await Testimonial.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(data);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const deleteTestimonial = async (req, res) => {
  try {
    await Testimonial.findByIdAndDelete(req.params.id);
    res.json({ message: 'Testimonial removed' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getTestimonials, getTestimonialById, createTestimonial, updateTestimonial, deleteTestimonial };