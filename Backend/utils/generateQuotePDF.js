const PDFDocument = require('pdfkit');
const fs = require('fs');
const path = require('path');

const generateQuotePDF = (quotation, res) => {
  const doc = new PDFDocument();
  const filename = `Quote-${quotation._id}.pdf`;
  const pdfPath = path.join(__dirname, '../uploads', filename);

  // doc.pipe(fs.createWriteStream(pdfPath));
  doc.pipe(res); // directly sending to response for download in admin panel if needed
  
  doc.fontSize(20).text('SOLAR QUOTATION', { align: 'center' });
  doc.moveDown();
  doc.fontSize(14).text(`Customer: ${quotation.name}`);
  doc.text(`System Size: ${quotation.recommendedKW} kW`);
  doc.text(`Estimated Cost: ₹${quotation.estimatedCost}`);
  doc.text(`Subsidy: ₹${quotation.centralSubsidy}`);
  doc.text(`Net Cost: ₹${quotation.netCost}`);

  doc.end();
};

module.exports = generateQuotePDF;
