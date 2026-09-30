import React from 'react';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import Button from '../ui/Button';
import { FaWhatsapp, FaDownload } from 'react-icons/fa';

const QuotationResult = ({ result, customerData }) => {
  
  const generatePDF = () => {
    const doc = new jsPDF();
    
    // Header
    doc.setFillColor(211, 47, 47); // Red
    doc.rect(0, 0, 210, 30, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(22);
    doc.setFont("helvetica", "bold");
    doc.text("SOLAR QUOTATION", 105, 20, { align: 'center' });
    
    // Customer Details
    doc.setTextColor(10, 10, 10);
    doc.setFontSize(12);
    doc.text(`Name: ${customerData.name}`, 15, 45);
    doc.text(`Location: ${customerData.location}, ${customerData.state}`, 15, 52);
    doc.text(`Phone: ${customerData.phone}`, 15, 59);
    doc.text(`Date: ${new Date().toLocaleDateString()}`, 150, 45);
    
    // System Recommendation
    doc.setFontSize(14);
    doc.setTextColor(211, 47, 47);
    doc.text("SYSTEM RECOMMENDATION", 15, 75);
    
    doc.autoTable({
      startY: 80,
      head: [['Parameter', 'Details']],
      body: [
        ['Connection Type', customerData.connectionType],
        ['Average Monthly Bill', `Rs. ${customerData.monthlyBill}`],
        ['Recommended System Size', `${result.recommendedKW} kW`],
        ['Annual Generation Capacity', `${result.annualGeneration} kWh/year`]
      ],
      headStyles: { fillColor: [10, 10, 10] },
      alternateRowStyles: { fillColor: [245, 245, 245] }
    });
    
    // Cost Breakdown
    doc.text("COST BREAKDOWN & ROI", 15, doc.lastAutoTable.finalY + 15);
    
    doc.autoTable({
      startY: doc.lastAutoTable.finalY + 20,
      head: [['Description', 'Amount (Rs.)']],
      body: [
        ['Estimated Gross Cost', `${result.estimatedCost.toLocaleString()}`],
        ['PM Surya Ghar Subsidy', `-${result.centralSubsidy.toLocaleString()}`],
        ['Net Cost to Customer', `${result.netCost.toLocaleString()}`],
      ],
      foot: [['Estimated Monthly Savings', `${result.monthlySavings.toLocaleString()}`]],
      headStyles: { fillColor: [211, 47, 47] },
      footStyles: { fillColor: [10, 10, 10] },
      alternateRowStyles: { fillColor: [245, 245, 245] }
    });

    doc.setTextColor(10, 10, 10);
    doc.setFontSize(11);
    doc.text(`Estimated Return on Investment (ROI): ${result.roiYears} Years`, 15, doc.lastAutoTable.finalY + 15);
    
    // Watermark
    doc.setTextColor(200, 200, 200);
    doc.setFontSize(50);
    doc.text("VALID FOR 30 DAYS", 105, 200, { align: 'center', angle: 45 });
    
    // Footer
    doc.setFontSize(10);
    doc.setTextColor(100, 100, 100);
    doc.text("SPC Solar - 123 Solar Street, Green City", 105, 280, { align: 'center' });
    doc.text("info@spcsolar.com | +91 9876543210", 105, 285, { align: 'center' });

    doc.save(`SPCSolar_Quote_${customerData.name.replace(' ', '_')}.pdf`);
  };

  const sendWhatsApp = () => {
    const msg = `Hello ${customerData.name},\nHere is your solar quotation from SPC Solar:\n- System Size: ${result.recommendedKW} kW\n- Estimated Cost: Rs. ${result.estimatedCost}\n- Subsidy: Rs. ${result.centralSubsidy}\n- Net Cost: Rs. ${result.netCost}\n\nOur team will contact you shortly!`;
    const url = `https://wa.me/91${customerData.phone}?text=${encodeURIComponent(msg)}`;
    window.open(url, '_blank');
  };

  return (
    <div className="bg-surface p-6 rounded-card shadow-card sticky top-24 border border-gray-light">
      <h2 className="text-2xl font-heading mb-6 border-b border-gray-light pb-4">YOUR QUOTATION</h2>
      
      <div className="space-y-6">
        <div className="bg-white p-4 rounded-sm border-l-4 border-black shadow-sm">
          <p className="text-sm text-gray mb-1 uppercase tracking-wider font-accent">Recommended System</p>
          <h3 className="text-3xl font-heading text-black">{result.recommendedKW} <span className="text-xl">kW</span></h3>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="bg-white p-4 rounded-sm shadow-sm">
            <p className="text-xs text-gray mb-1 uppercase">Estimated Cost</p>
            <p className="font-heading text-lg text-black">₹{result.estimatedCost.toLocaleString()}</p>
          </div>
          <div className="bg-green-50 p-4 rounded-sm shadow-sm">
            <p className="text-xs text-green-700 mb-1 uppercase">Subsidy</p>
            <p className="font-heading text-lg text-green-800">₹{result.centralSubsidy.toLocaleString()}</p>
          </div>
        </div>

        <div className="bg-red text-white p-6 rounded-sm shadow-sm">
          <p className="text-sm text-white/80 mb-1 uppercase tracking-wider font-accent">Net Cost to You</p>
          <h3 className="text-4xl font-heading">₹{result.netCost.toLocaleString()}</h3>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="bg-white p-4 rounded-sm shadow-sm">
            <p className="text-xs text-gray mb-1 uppercase">Monthly Savings</p>
            <p className="font-heading text-lg text-black">₹{result.monthlySavings.toLocaleString()}</p>
          </div>
          <div className="bg-white p-4 rounded-sm shadow-sm">
            <p className="text-xs text-gray mb-1 uppercase">ROI Period</p>
            <p className="font-heading text-lg text-black">{result.roiYears} Years</p>
          </div>
        </div>
        
        <div className="flex flex-col space-y-3 pt-4 border-t border-gray-light">
          <Button variant="primary" onClick={generatePDF} className="flex items-center justify-center space-x-2">
            <FaDownload /> <span>Download PDF</span>
          </Button>
          <Button variant="outline" onClick={sendWhatsApp} className="flex items-center justify-center space-x-2 border-green-500 text-green-600 hover:bg-green-50 hover:text-green-700 hover:border-green-600">
            <FaWhatsapp size={20} /> <span>Send via WhatsApp</span>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default QuotationResult;
