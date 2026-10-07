const Lead = require('../models/Lead');

exports.createLead = async (req, res) => {
  try {
    const { phone, name, city, state, source, notes } = req.body;
    
    if (!phone) {
      return res.status(400).json({ success: false, message: 'Phone number is required' });
    }

    const newLead = new Lead({
      phone: phone.trim(),
      name: (name || '').trim(),
      city: (city || '').trim(),
      state: (state || '').trim(),
      source: source || 'Quotation Modal (₹1,000 Offer)',
      notes: notes || '',
      status: 'New'
    });

    await newLead.save();
    res.status(201).json({ success: true, message: 'Lead captured successfully', lead: newLead });
  } catch (error) {
    console.error('Error saving lead:', error);
    res.status(500).json({ success: false, message: 'Server error while capturing lead' });
  }
};

exports.getLeads = async (req, res) => {
  try {
    const leads = await Lead.find().sort({ createdAt: -1 });
    res.status(200).json({ success: true, leads });
  } catch (error) {
    console.error('Error fetching leads:', error);
    res.status(500).json({ success: false, message: 'Server error while fetching leads' });
  }
};

exports.updateLead = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, notes, name, city, state } = req.body;

    const updateData = {};
    if (status) updateData.status = status;
    if (notes !== undefined) updateData.notes = notes;
    if (name) updateData.name = name;
    if (city) updateData.city = city;
    if (state) updateData.state = state;

    const updatedLead = await Lead.findByIdAndUpdate(
      id,
      updateData,
      { new: true, runValidators: true }
    );

    if (!updatedLead) {
      return res.status(404).json({ success: false, message: 'Lead not found' });
    }

    res.status(200).json({ success: true, message: 'Lead updated successfully', lead: updatedLead });
  } catch (error) {
    console.error('Error updating lead:', error);
    res.status(500).json({ success: false, message: 'Server error while updating lead' });
  }
};

exports.deleteLead = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedLead = await Lead.findByIdAndDelete(id);
    
    if (!deletedLead) {
      return res.status(404).json({ success: false, message: 'Lead not found' });
    }

    res.status(200).json({ success: true, message: 'Lead deleted successfully' });
  } catch (error) {
    console.error('Error deleting lead:', error);
    res.status(500).json({ success: false, message: 'Server error while deleting lead' });
  }
};
