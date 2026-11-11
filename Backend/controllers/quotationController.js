const Quotation = require('../models/Quotation');

const getQuotations = async (req, res) => {
  try {
    const data = await Quotation.find();
    res.json(data);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getQuotationById = async (req, res) => {
  try {
    const data = await Quotation.findById(req.params.id);
    if (data) res.json(data);
    else res.status(404).json({ message: 'Quotation not found' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const createQuotation = async (req, res) => {
  try {
    const payload = { ...req.body };
    if (req.user && !payload.user) {
      payload.user = req.user._id;
    }
    const data = new Quotation(payload);
    const savedData = await data.save();
    res.status(201).json(savedData);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const updateQuotationStatus = async (req, res) => {
  try {
    const data = await Quotation.findByIdAndUpdate(req.params.id, { status: req.body.status }, { new: true });
    res.json(data);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const deleteQuotation = async (req, res) => {
  try {
    await Quotation.findByIdAndDelete(req.params.id);
    res.json({ message: 'Quotation removed' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const sendQuotation = async (req, res) => {
  // Logic for sending PDF via WhatsApp/Email to be implemented
  res.json({ message: 'Sent successfully' });
};

const uploadQuotationPdf = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No PDF file uploaded' });
    }

    const filename = req.file.filename;
    const relativeUrl = `/uploads/quotations/${filename}`;
    
    // Determine public URL
    const clientUrl = (process.env.CLIENT_URL || 'https://spcsolarcbe.com').replace(/\/$/, '');
    const publicUrl = `${clientUrl}${relativeUrl}`;

    // If quotation ref or phone is provided, find and update or mark sent
    if (req.body.refNo) {
      await Quotation.findOneAndUpdate(
        { 
          $or: [
            { adminNotes: { $regex: req.body.refNo } },
            { phone: req.body.phone, name: req.body.customerName }
          ]
        },
        { pdfUrl: publicUrl, sentViaWhatsApp: true },
        { sort: { createdAt: -1 } }
      ).catch(() => {});
    }

    res.json({
      message: 'PDF uploaded successfully',
      url: relativeUrl,
      publicUrl,
      filename
    });
  } catch (error) {
    console.error('Error uploading quotation PDF:', error);
    res.status(500).json({ message: error.message });
  }
};

module.exports = { 
  getQuotations, 
  getQuotationById, 
  createQuotation, 
  updateQuotationStatus, 
  deleteQuotation, 
  sendQuotation,
  uploadQuotationPdf
};
