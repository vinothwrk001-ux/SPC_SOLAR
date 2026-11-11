import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';
import api from '../services/api';

/**
 * Renders a single DOM element inside an exact A4 page staging environment (794x1123 px at 96 DPI)
 * and returns a sharp 2x resolution canvas.
 */
async function renderPageToA4Canvas(element) {
  if (!element) {
    throw new Error('Element to render was not provided');
  }

  // Create staging container behind the screen (top:0, left:0, zIndex: -99999)
  const staging = document.createElement('div');
  staging.setAttribute('id', 'pdf-render-staging-' + Date.now());
  staging.style.position = 'fixed';
  staging.style.top = '0';
  staging.style.left = '0';
  staging.style.width = '794px';
  staging.style.minWidth = '794px';
  staging.style.maxWidth = '794px';
  staging.style.height = '1123px';
  staging.style.minHeight = '1123px';
  staging.style.maxHeight = '1123px';
  staging.style.backgroundColor = '#ffffff';
  staging.style.zIndex = '-99999';
  staging.style.overflow = 'hidden';
  staging.style.pointerEvents = 'none';

  // Clone node so we can strip screen styles (borders, card rounding, shadows)
  const clone = element.cloneNode(true);
  clone.style.width = '794px';
  clone.style.minWidth = '794px';
  clone.style.maxWidth = '794px';
  clone.style.height = '1123px';
  clone.style.minHeight = '1123px';
  clone.style.maxHeight = '1123px';
  clone.style.padding = '38px 45px'; // Exact 10mm top/bottom, 12mm left/right
  clone.style.borderRadius = '0px';
  clone.style.border = 'none';
  clone.style.boxShadow = 'none';
  clone.style.backgroundColor = '#ffffff';
  clone.style.boxSizing = 'border-box';
  clone.style.margin = '0';
  clone.style.transform = 'none';

  staging.appendChild(clone);
  document.body.appendChild(staging);

  try {
    // Wait for any images inside clone to be ready
    const images = Array.from(clone.querySelectorAll('img'));
    await Promise.all(
      images.map((img) => {
        if (img.complete) return Promise.resolve();
        return new Promise((resolve) => {
          img.onload = resolve;
          img.onerror = resolve;
        });
      })
    );

    const canvas = await html2canvas(clone, {
      scale: 2, // 2x gives retina clarity (~1588 x 2246 px)
      useCORS: true,
      allowTaint: true,
      logging: false,
      backgroundColor: '#ffffff',
      width: 794,
      height: 1123,
      x: 0,
      y: 0,
      scrollX: 0,
      scrollY: 0,
    });

    return canvas;
  } finally {
    if (document.body.contains(staging)) {
      document.body.removeChild(staging);
    }
  }
}

/**
 * Generates an official 2-page A4 PDF from the 2-sided quotation view.
 * @param {string} refNo - Reference number, e.g. "QSP9685"
 * @param {string} customerName - Customer name, e.g. "Vinoth Kumar"
 * @returns {Promise<{ pdf: jsPDF, pdfBlob: Blob, pdfFile: File, fileName: string }>}
 */
export async function generateQuotationPdf(refNo = 'QUOTE', customerName = 'CUSTOMER') {
  const page1 = document.querySelector('.print-page-1');
  const page2 = document.querySelector('.print-page-2');

  if (!page1 || !page2) {
    throw new Error('Quotation elements (.print-page-1 and .print-page-2) could not be located on the screen.');
  }

  // Render both pages sequentially or in parallel
  const canvas1 = await renderPageToA4Canvas(page1);
  const canvas2 = await renderPageToA4Canvas(page2);

  const pdf = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
    compress: true,
  });

  const pdfWidth = 210;
  const pdfHeight = 297;

  // Page 1: Specs, Pricing, & Partners
  const img1 = canvas1.toDataURL('image/jpeg', 0.95);
  pdf.addImage(img1, 'JPEG', 0, 0, pdfWidth, pdfHeight, undefined, 'FAST');

  // Page 2: Terms, Banker, Scan-to-pay, & Signature
  pdf.addPage();
  const img2 = canvas2.toDataURL('image/jpeg', 0.95);
  pdf.addImage(img2, 'JPEG', 0, 0, pdfWidth, pdfHeight, undefined, 'FAST');

  const cleanRef = (refNo || 'QUOTE').replace(/[^a-zA-Z0-9_-]/g, '');
  const isDefaultName = !customerName || ['CUSTOMER NAME', 'OFFLINE CUSTOMER', 'CUSTOMER'].includes(customerName.toUpperCase().trim());
  const cleanName = isDefaultName ? '' : customerName.trim().replace(/[^a-zA-Z0-9_-]/g, '_');
  const fileName = `SPC_Solar_Quotation_${cleanRef}${cleanName ? '_' + cleanName : ''}.pdf`;

  const pdfBlob = pdf.output('blob');
  const pdfFile = new File([pdfBlob], fileName, { type: 'application/pdf' });

  return {
    pdf,
    pdfBlob,
    pdfFile,
    fileName,
  };
}

/**
 * Uploads the generated PDF blob to the backend server to get a permanent public link.
 */
export async function uploadQuotationPdfToServer({ pdfBlob, fileName, refNo, customerName, phone }) {
  try {
    const formData = new FormData();
    // Put metadata fields before file so multipart parsers receive body params first
    if (refNo) formData.append('refNo', refNo);
    if (customerName) formData.append('customerName', customerName);
    if (phone) formData.append('phone', phone);
    formData.append('pdf', pdfBlob, fileName);

    const response = await api.post('/quotations/upload-pdf', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    return response.data;
  } catch (error) {
    console.warn('PDF server upload failed, falling back to local client link:', error);
    return null;
  }
}

