const Lead = require('../models/Lead');

exports.createLead = async (req, res) => {
  try {
    const { phone, password, name, city, state } = req.body;
    
    // We can just create a new lead, or if the phone exists, update it.
    // Let's just create a new lead for every submission.
    const newLead = new Lead({
      phone,
      password, // Storing in plain text as it's just a dummy lead capture mechanism, not a real auth system.
      name,
      city,
      state
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
