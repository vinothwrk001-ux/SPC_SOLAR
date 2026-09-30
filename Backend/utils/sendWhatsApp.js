const sendWhatsApp = async (phone, message, pdfUrl) => {
  // Logic for WhatsApp API (e.g. Twilio or WATI)
  console.log(`Sending WhatsApp to ${phone}: ${message}`);
  // In a real scenario, make an axios call to process.env.WHATSAPP_API_URL
};

module.exports = sendWhatsApp;
