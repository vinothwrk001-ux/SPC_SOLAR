import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import api from '../../services/api';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import Modal from '../../components/ui/Modal';
import Logo from '../../assets/Logo.png';
import toast from 'react-hot-toast';
import { 
  FiPrinter, 
  FiSave, 
  FiUser, 
  FiArrowLeft, 
  FiPlus, 
  FiFileText, 
  FiLayers,
  FiCreditCard,
  FiSmartphone,
  FiUploadCloud,
  FiTrash2,
  FiCheck,
  FiGlobe,
  FiPhone,
  FiDownload,
  FiCopy,
  FiExternalLink,
  FiCheckCircle,
  FiLoader
} from 'react-icons/fi';
import { FaWhatsapp } from 'react-icons/fa';
import { generateQuotationPdf, uploadQuotationPdfToServer } from '../../utils/quotationPdfGenerator';

const AdminQuotationMaker = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const [leads, setLeads] = useState([]);
  const [selectedLeadId, setSelectedLeadId] = useState(searchParams.get('leadId') || '');
  const [savingQuote, setSavingQuote] = useState(false);
  const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);
  const [whatsAppModalOpen, setWhatsAppModalOpen] = useState(false);
  const [lastPdfInfo, setLastPdfInfo] = useState(null);

  const initialRefNo = `QSP${Math.floor(1000 + Math.random() * 9000)}`;

  const [formData, setFormData] = useState({
    refNo: initialRefNo,
    date: new Date().toLocaleDateString('en-GB').replace(/\//g, '.'),
    toName: searchParams.get('name') || 'CUSTOMER NAME',
    phone: searchParams.get('phone') || '',
    toAddressLine1: searchParams.get('phone') ? `Phone: ${searchParams.get('phone')}` : 'STREET ADDRESS',
    toAddressLine2: searchParams.get('city') 
      ? `${searchParams.get('city')}${searchParams.get('state') ? ', ' + searchParams.get('state') : ''}` 
      : 'COIMBATORE, TAMIL NADU',
    kwSize: Number(searchParams.get('kw')) || 100,
    systemType: 'ON GRID',
    panelQty: 182,
    panelMake: 'EASTMAN/ADDO WAAREE/EMMVEE/LUMINOUS/KIRLOSHKAR',
    inverterCapacity: 100,
    inverterMake: 'TATA/EASTMAN/ADDO',
    pricePerKw: 48000,
    gstPercent: 5,
    subsidyAmount: 0,
    advPercent: 10,
    secPercent: 70,
    thirdPercent: 20,

    // Banker Section controls & details
    showBankDetails: true,
    bankCompanyName: 'SPC SOLAR TECHNOLOGY',
    bankName: 'HDFC BANK',
    bankAccountNo: '50200020555742',
    bankBranch: 'RS PURAM BRANCH, COIMBATORE',
    bankIfsc: 'HDFC0000000',

    // Scanner (UPI) Section controls & details
    showScannerDetails: true,
    gpayNumber: '8489644044',
    upiTitle: 'G.PAY / PHONEPE / ALL UPI',
    upiSubtitle: 'Accepts GPay, PhonePe, Paytm, BHIM & All UPI Apps',
    upiQrImage: '',

    // Company Header Profile (Page 1)
    companyPhone: '80987 44044 (Office), 84896 44044',
    companyGstNo: '33AAHCS8496F1ZT',
    companyWebsite: 'https://spcsolarcbe.com',
  });

  // Load saved Banker and Scanner payment settings from localStorage on mount
  useEffect(() => {
    try {
      const savedConfig = localStorage.getItem('spc_quotation_payment_config');
      if (savedConfig) {
        const parsed = JSON.parse(savedConfig);
        setFormData(prev => ({
          ...prev,
          showBankDetails: parsed.showBankDetails !== undefined ? parsed.showBankDetails : prev.showBankDetails,
          bankCompanyName: parsed.bankCompanyName || prev.bankCompanyName,
          bankName: parsed.bankName || prev.bankName,
          bankAccountNo: parsed.bankAccountNo || prev.bankAccountNo,
          bankBranch: parsed.bankBranch || prev.bankBranch,
          bankIfsc: parsed.bankIfsc || prev.bankIfsc,
          showScannerDetails: parsed.showScannerDetails !== undefined ? parsed.showScannerDetails : prev.showScannerDetails,
          gpayNumber: parsed.gpayNumber || prev.gpayNumber,
          upiTitle: parsed.upiTitle || prev.upiTitle,
          upiSubtitle: parsed.upiSubtitle || prev.upiSubtitle,
          upiQrImage: parsed.upiQrImage || prev.upiQrImage,
          companyPhone: parsed.companyPhone !== undefined ? parsed.companyPhone : prev.companyPhone,
          companyGstNo: parsed.companyGstNo !== undefined ? parsed.companyGstNo : prev.companyGstNo,
          companyWebsite: parsed.companyWebsite !== undefined ? parsed.companyWebsite : prev.companyWebsite,
        }));
      }
    } catch (e) {
      console.warn('Could not load saved payment config', e);
    }
  }, []);

  const ON_GRID_DATA = {
    1: { panelQty: 2, panelMake: 'EASTMAN/EMMVEE\nADDO/VIKRAM SOLAR\nKIRLOSKAR/LUMINOUS', inverterCapacity: 1, inverterMake: 'ADDO\nTATA/EASTMAN', pricePerKw: 102000, subsidy: 30000, gst: 0, adv: 100, sec: 0, third: 0 },
    2: { panelQty: 4, panelMake: 'EMMVEE/EASTMAN\nADDO/VIKRAM SOLAR\nKIRLOSKAR/LUMINOUS', inverterCapacity: 3, inverterMake: 'ADDO\nTATA/EASTMAN', pricePerKw: 90000, subsidy: 60000, gst: 0, adv: 80, sec: 20, third: 0 },
    3: { panelQty: 6, panelMake: 'ADDO/EMMVEE\nEASTMAN/VIKRAM SOLAR\nUTL/KIRLOSKAR\nLUMINOUS', inverterCapacity: 3, inverterMake: 'ADDO\nEASTMAN/TATA', pricePerKw: 76000, subsidy: 78000, gst: 0, adv: 80, sec: 20, third: 0 },
    4: { panelQty: 7, panelMake: 'EMMVEE/ADDO/EASTMAN/\nVIKRAM SOLAR\nKIRLOSKAR/LUMINOUS/UTL', inverterCapacity: 5, inverterMake: 'EASTMAN/ADDO', pricePerKw: 68750, subsidy: 78000, gst: 0, adv: 80, sec: 20, third: 0 },
    5: { panelQty: 9, panelMake: 'ADDO/EASTMAN/\nKIRLOSKAR/PANASONIC/\nLUMINOUS/UTL', inverterCapacity: 5, inverterMake: 'EASTMAN/TATA', pricePerKw: 66900, subsidy: 78000, gst: 0, adv: 80, sec: 20, third: 0 },
    6: { panelQty: 11, panelMake: 'ADDO/EASTMAN/KIRLOSKAR/\nEMMVEE\nVIKRAM SOLAR/LUMINOUS/UTL', inverterCapacity: 7, inverterMake: 'EASTMAN/ADDO\nTATA', pricePerKw: 65916.67, subsidy: 78000, gst: 0, adv: 80, sec: 20, third: 0 },
    7: { panelQty: 13, panelMake: 'EASTMAN/ADDO\nEMMVEE/WAAREE/\nLUMINOUS/KIRLOSKAR', inverterCapacity: 7, inverterMake: 'EASTMAN/ADDO', pricePerKw: 64857.14, subsidy: 78000, gst: 0, adv: 80, sec: 20, third: 0 },
    8: { panelQty: 15, panelMake: 'EASTMAN/ADDO\nEMMVEE/LUMINOUS/\nKIRLOSHKAR/UTL', inverterCapacity: 8, inverterMake: 'EASTMAN/ADDO', pricePerKw: 64275, subsidy: 78000, gst: 0, adv: 20, sec: 70, third: 10 },
    9: { panelQty: 16, panelMake: 'EASTMAN/ADDO\nWAAREE/EMMVEE/LUMINOUS/\nKIRLOSHKAR', inverterCapacity: 10, inverterMake: 'EASTMAN/ADDO', pricePerKw: 62544.44, subsidy: 78000, gst: 0, adv: 80, sec: 20, third: 0 },
    10: { panelQty: 18, panelMake: 'EASTMAN/ADDO\nWAAREE/EMMVEE/LUMINOUS/\nKIRLOSHKAR', inverterCapacity: 10, inverterMake: 'EASTMAN/ADDO', pricePerKw: 62000, subsidy: 78000, gst: 0, adv: 80, sec: 20, third: 0 },
    11: { panelQty: 20, panelMake: 'EASTMAN/ADDO\nWAAREE/EMMVEE/LUMINOUS/\nKIRLOSHKAR', inverterCapacity: 11, inverterMake: 'TATA\nEASTMAN/ADDO', pricePerKw: 55000, subsidy: 0, gst: 5, adv: 10, sec: 70, third: 20 },
    12: { panelQty: 22, panelMake: 'EASTMAN/ADDO\nWAAREE/EMMVEE/LUMINOUS/\nKIRLOSHKAR', inverterCapacity: 12, inverterMake: 'TATA\nEASTMAN/ADDO', pricePerKw: 55000, subsidy: 0, gst: 5, adv: 10, sec: 70, third: 20 },
    13: { panelQty: 24, panelMake: 'EASTMAN/ADDO\nWAAREE/EMMVEE/LUMINOUS/\nKIRLOSHKAR', inverterCapacity: 13, inverterMake: 'TATA\nEASTMAN/ADDO', pricePerKw: 55000, subsidy: 0, gst: 5, adv: 10, sec: 70, third: 20 },
    14: { panelQty: 25, panelMake: 'EASTMAN/ADDO\nWAAREE/EMMVEE/LUMINOUS/\nKIRLOSHKAR', inverterCapacity: 14, inverterMake: 'TATA\nEASTMAN/ADDO', pricePerKw: 55000, subsidy: 0, gst: 5, adv: 10, sec: 70, third: 20 },
    15: { panelQty: 27, panelMake: 'EASTMAN/ADDO\nWAAREE/EMMVEE\nLUMINOUS/\nKIRLOSHKAR', inverterCapacity: 15, inverterMake: 'TATA\nEASTMAN/ADDO', pricePerKw: 55000, subsidy: 0, gst: 5, adv: 10, sec: 70, third: 20 },
    20: { panelQty: 36, panelMake: 'EASTMAN/ADDO\nWAAREE/EMMVEE/LUMINOUS/\nKIRLOSHKAR', inverterCapacity: 20, inverterMake: 'TATA\nEASTMAN/ADDO', pricePerKw: 55000, subsidy: 0, gst: 5, adv: 10, sec: 70, third: 20 },
    25: { panelQty: 46, panelMake: 'EASTMAN/ADDO\nWAAREE/EMMVEE/LUMINOUS/\nKIRLOSHKAR', inverterCapacity: 25, inverterMake: 'TATA\nEASTMAN/ADDO', pricePerKw: 55000, subsidy: 0, gst: 5, adv: 10, sec: 70, third: 20 },
    30: { panelQty: 55, panelMake: 'EASTMAN/ADDO\nWAAREE/EMMVEE/LUMINOUS/\nKIRLOSHKAR', inverterCapacity: 30, inverterMake: 'TATA\nEASTMAN/ADDO', pricePerKw: 54000, subsidy: 0, gst: 5, adv: 10, sec: 70, third: 20 },
    35: { panelQty: 64, panelMake: 'EASTMAN/ADDO\nWAAREE/EMMVEE/LUMINOUS/\nKIRLOSHKAR', inverterCapacity: 40, inverterMake: 'TATA\nEASTMAN/ADDO', pricePerKw: 53000, subsidy: 0, gst: 5, adv: 10, sec: 70, third: 20 },
    40: { panelQty: 73, panelMake: 'EASTMAN/ADDO\nWAAREE/EMMVEE/LUMINOUS/\nKIRLOSHKAR', inverterCapacity: 40, inverterMake: 'TATA\nEASTMAN/ADDO', pricePerKw: 53000, subsidy: 0, gst: 5, adv: 10, sec: 70, third: 20 },
    50: { panelQty: 91, panelMake: 'EASTMAN/ADDO\nWAAREE/EMMVEE/LUMINOUS/\nKIRLOSHKAR', inverterCapacity: 50, inverterMake: 'TATA\nEASTMAN/ADDO', pricePerKw: 53000, subsidy: 0, gst: 5, adv: 10, sec: 70, third: 20 },
    60: { panelQty: 109, panelMake: 'EASTMAN/ADDO\nWAAREE/EMMVEE/LUMINOUS/\nKIRLOSHKAR', inverterCapacity: 60, inverterMake: 'TATA\nEASTMAN/ADDO', pricePerKw: 48000, subsidy: 0, gst: 5, adv: 10, sec: 70, third: 20 },
    70: { panelQty: 127, panelMake: 'EASTMAN/ADDO\nWAAREE/EMMVEE/LUMINOUS/\nKIRLOSHKAR', inverterCapacity: 70, inverterMake: 'TATA\nEASTMAN/ADDO', pricePerKw: 48000, subsidy: 0, gst: 5, adv: 10, sec: 70, third: 20 },
    80: { panelQty: 146, panelMake: 'EASTMAN/ADDO\nWAAREE/EMMVEE/LUMINOUS/\nKIRLOSHKAR', inverterCapacity: 80, inverterMake: 'TATA\nEASTMAN/ADDO', pricePerKw: 48000, subsidy: 0, gst: 5, adv: 10, sec: 70, third: 20 },
    90: { panelQty: 164, panelMake: 'EASTMAN/ADDO\nWAAREE/EMMVEE/LUMINOUS/\nKIRLOSHKAR', inverterCapacity: 90, inverterMake: 'TATA\nEASTMAN/ADDO', pricePerKw: 48000, subsidy: 0, gst: 5, adv: 10, sec: 70, third: 20 },
    100: { panelQty: 182, panelMake: 'EASTMAN/ADDO\nWAAREE/EMMVEE/LUMINOUS/\nKIRLOSHKAR', inverterCapacity: 100, inverterMake: 'TATA\nEASTMAN/ADDO', pricePerKw: 48000, subsidy: 0, gst: 5, adv: 10, sec: 70, third: 20 }
  };

  const OFF_GRID_DATA = {
    1: { panelQty: 2, panelMake: 'ADDO/EASTMAN\nEMMVEE/UTL\nVIKRAM SOLAR\nWAAREE\nKIRLOASKAR', inverterCapacity: 1, inverterMake: 'SPC SOLAR\nLITHIYAM\nBATTERY/\nNEXION ENERGY', pricePerKw: 90000, subsidy: 0, gst: 5, adv: 100, sec: 0, third: 0 },
    2: { panelQty: 4, panelMake: 'ADDO/EASTMAN\nEMMVEE/UTL\nVIKRAM SOLAR\nWAAREE\nKIRLOASKAR', inverterCapacity: 3, inverterMake: 'SPC SOLAR\nLITHIYAM\nBATTERY/\nNEXION ENERGY', pricePerKw: 80000, subsidy: 0, gst: 5, adv: 10, sec: 70, third: 20 },
    3: { panelQty: 5, panelMake: 'ADDO/EASTMAN\nEMMVEE/UTL\nVIKRAM SOLAR\nWAAREE\nKIRLOASKAR', inverterCapacity: 3, inverterMake: 'SPC SOLAR\nLITHIYAM\nBATTERY/\nNEXION ENERGY', pricePerKw: 80000, subsidy: 0, gst: 5, adv: 10, sec: 70, third: 20 },
    4: { panelQty: 7, panelMake: 'ADDO/EASTMAN\nEMMVEE/UTL\nVIKRAM SOLAR\nWAAREE\nKIRLOASKAR', inverterCapacity: 5, inverterMake: 'SPC SOLAR\nLITHIYAM\nBATTERY/\nNEXION ENERGY', pricePerKw: 80000, subsidy: 0, gst: 5, adv: 10, sec: 70, third: 20 },
    5: { panelQty: 9, panelMake: 'ADDO/EASTMAN\nEMMVEE/UTL\nVIKRAM SOLAR\nWAAREE\nKIRLOASKAR', inverterCapacity: 5, inverterMake: 'SPC SOLAR\nLITHIYAM\nBATTERY/\nNEXION ENERGY', pricePerKw: 80000, subsidy: 0, gst: 5, adv: 10, sec: 70, third: 20 },
    6: { panelQty: 10, panelMake: 'ADDO/EASTMAN\nEMMVEE/UTL\nVIKRAM SOLAR\nWAAREE\nKIRLOASKAR', inverterCapacity: 6, inverterMake: 'SPC SOLAR\nLITHIYAM\nBATTERY/\nNEXION ENERGY', pricePerKw: 80000, subsidy: 0, gst: 5, adv: 10, sec: 70, third: 20 },
    7: { panelQty: 12, panelMake: 'ADDO/EASTMAN\nEMMVEE/UTL\nVIKRAM SOLAR\nWAAREE\nKIRLOASKAR', inverterCapacity: 7, inverterMake: 'SPC SOLAR\nLITHIYAM\nBATTERY/\nNEXION ENERGY', pricePerKw: 80000, subsidy: 0, gst: 5, adv: 10, sec: 70, third: 20 },
    8: { panelQty: 14, panelMake: 'ADDO/EASTMAN\nEMMVEE/UTL\nVIKRAM SOLAR\nWAAREE\nKIRLOASKAR', inverterCapacity: 8, inverterMake: 'SPC SOLAR\nLITHIYAM\nBATTERY/\nNEXION ENERGY', pricePerKw: 80000, subsidy: 0, gst: 5, adv: 10, sec: 70, third: 20 },
    9: { panelQty: 16, panelMake: 'ADDO/EASTMAN\nEMMVEE/UTL\nVIKRAM SOLAR\nWAAREE\nKIRLOASKAR', inverterCapacity: 9, inverterMake: 'SPC SOLAR\nLITHIYAM\nBATTERY/\nNEXION ENERGY', pricePerKw: 80000, subsidy: 0, gst: 5, adv: 10, sec: 70, third: 20 },
    10: { panelQty: 17, panelMake: 'ADDO/EASTMAN\nEMMVEE/UTL\nVIKRAM SOLAR\nWAAREE\nKIRLOASKAR', inverterCapacity: 10, inverterMake: 'SPC SOLAR\nLITHIYAM\nBATTERY/\nNEXION ENERGY', pricePerKw: 80000, subsidy: 0, gst: 5, adv: 10, sec: 70, third: 20 },
    11: { panelQty: 19, panelMake: 'ADDO/EASTMAN\nEMMVEE/UTL\nVIKRAM SOLAR\nWAAREE\nKIRLOASKAR', inverterCapacity: 11, inverterMake: 'SPC SOLAR\nLITHIYAM\nBATTERY/\nNEXION ENERGY', pricePerKw: 80000, subsidy: 0, gst: 5, adv: 10, sec: 70, third: 20 },
    12: { panelQty: 21, panelMake: 'ADDO/EASTMAN\nEMMVEE/UTL\nVIKRAM SOLAR\nWAAREE\nKIRLOASKAR', inverterCapacity: 12, inverterMake: 'SPC SOLAR\nLITHIYAM\nBATTERY/\nNEXION ENERGY', pricePerKw: 80000, subsidy: 0, gst: 5, adv: 10, sec: 70, third: 20 },
    13: { panelQty: 22, panelMake: 'ADDO/EASTMAN\nEMMVEE/UTL\nVIKRAM SOLAR\nWAAREE\nKIRLOASKAR', inverterCapacity: 13, inverterMake: 'SPC SOLAR\nLITHIYAM\nBATTERY/\nNEXION ENERGY', pricePerKw: 80000, subsidy: 0, gst: 5, adv: 10, sec: 70, third: 20 },
    14: { panelQty: 24, panelMake: 'ADDO/EASTMAN\nEMMVEE/UTL\nVIKRAM SOLAR\nWAAREE\nKIRLOASKAR', inverterCapacity: 14, inverterMake: 'SPC SOLAR\nLITHIYAM\nBATTERY/\nNEXION ENERGY', pricePerKw: 80000, subsidy: 0, gst: 5, adv: 10, sec: 70, third: 20 },
    15: { panelQty: 26, panelMake: 'ADDO/EASTMAN\nEMMVEE/UTL\nVIKRAM SOLAR\nWAAREE\nKIRLOASKAR', inverterCapacity: 15, inverterMake: 'SPC SOLAR\nLITHIYAM\nBATTERY/\nNEXION ENERGY', pricePerKw: 80000, subsidy: 0, gst: 5, adv: 10, sec: 70, third: 20 }
  };

  useEffect(() => {
    const fetchLeads = async () => {
      try {
        const res = await api.get('/leads');
        const list = res.data?.leads || (Array.isArray(res.data) ? res.data : []);
        setLeads(list);
      } catch (e) {
        console.error('Failed to load leads list', e);
      }
    };
    fetchLeads();
  }, []);

  useEffect(() => {
    const kwNum = Number(formData.kwSize);
    if (!kwNum || kwNum <= 0) return;

    const isOnGrid = formData.systemType === 'ON GRID';
    const isOffGrid = formData.systemType === 'OFF GRID';
    const panelWatts = isOffGrid ? 580 : 550;

    const preset = isOnGrid ? ON_GRID_DATA[kwNum] : (isOffGrid ? OFF_GRID_DATA[kwNum] : null);

    // Solar Engineering Formula for Panel Qty: Math.round((KW * 1000) / panelWatts)
    const formulaPanelQty = Math.max(1, Math.round((kwNum * 1000) / panelWatts));
    const panelQty = preset ? preset.panelQty : formulaPanelQty;

    // Inverter Capacity: preset or defaults to kwNum
    const inverterCapacity = preset ? preset.inverterCapacity : kwNum;

    // Price Per KW:
    // If preset exists, use preset price; otherwise fallback based on standard commercial / residential slabs:
    let defaultPricePerKw = 55000;
    if (isOnGrid) {
      if (kwNum <= 10) defaultPricePerKw = 65000;
      else if (kwNum <= 25) defaultPricePerKw = 55000;
      else if (kwNum <= 50) defaultPricePerKw = 53000;
      else defaultPricePerKw = 48000;
    } else {
      defaultPricePerKw = kwNum <= 1 ? 90000 : 80000;
    }
    const pricePerKw = preset ? preset.pricePerKw : defaultPricePerKw;

    // Govt Subsidy:
    // Only ON GRID Residential (1 to 10 kW) gets PM Surya Ghar subsidy
    // >10 kW is Commercial (0 subsidy). OFF GRID has 0 subsidy.
    let defaultSubsidy = 0;
    if (isOnGrid) {
      if (kwNum === 1) defaultSubsidy = 30000;
      else if (kwNum === 2) defaultSubsidy = 60000;
      else if (kwNum >= 3 && kwNum <= 10) defaultSubsidy = 78000;
      else defaultSubsidy = 0;
    }
    const subsidyAmount = preset ? preset.subsidy : defaultSubsidy;

    // GST Percent:
    // Residential ON GRID <= 10 kW has 0% GST (inclusive in package)
    // Commercial ON GRID (>10 kW) has 5% GST
    // OFF GRID has 5% GST
    let defaultGst = 5;
    if (isOnGrid && kwNum <= 10) {
      defaultGst = 0;
    }
    const gstPercent = preset ? preset.gst : defaultGst;

    // Payment Milestones:
    // For small residential (<= 10 kW): 80% Adv, 20% Second, 0% Third (or 100% for 1kW)
    // For commercial / custom (> 10 kW): 10% Adv, 70% Second, 20% Third
    let defaultAdv = kwNum <= 1 ? 100 : (kwNum <= 10 ? 80 : 10);
    let defaultSec = kwNum <= 1 ? 0 : (kwNum <= 10 ? 20 : 70);
    let defaultThird = kwNum <= 10 ? 0 : 20;

    const advPercent = preset ? preset.adv : defaultAdv;
    const secPercent = preset ? preset.sec : defaultSec;
    const thirdPercent = preset ? preset.third : defaultThird;

    // Panel Make & Inverter Make defaults
    const defaultPanelMake = isOnGrid
      ? 'EASTMAN/ADDO\nWAAREE/EMMVEE/LUMINOUS/\nKIRLOSHKAR'
      : 'ADDO/EASTMAN\nEMMVEE/UTL\nVIKRAM SOLAR\nWAAREE\nKIRLOASKAR';

    const defaultInverterMake = isOnGrid
      ? (kwNum <= 10 ? 'EASTMAN/ADDO\nTATA' : 'TATA\nEASTMAN/ADDO')
      : 'SPC SOLAR\nLITHIYAM\nBATTERY/\nNEXION ENERGY';

    const panelMake = preset ? preset.panelMake : defaultPanelMake;
    const inverterMake = preset ? preset.inverterMake : defaultInverterMake;

    setFormData(prev => ({
      ...prev,
      panelQty,
      panelMake,
      inverterCapacity,
      inverterMake,
      pricePerKw,
      gstPercent,
      subsidyAmount,
      advPercent,
      secPercent,
      thirdPercent,
    }));
  }, [formData.kwSize, formData.systemType]);

  const handleLeadSelect = (leadId) => {
    setSelectedLeadId(leadId);
    if (!leadId) {
      setFormData(prev => ({
        ...prev,
        toName: 'OFFLINE CUSTOMER',
        phone: '',
        toAddressLine1: 'STREET ADDRESS',
        toAddressLine2: 'COIMBATORE, TAMIL NADU',
      }));
      return;
    }

    const lead = leads.find(l => l._id === leadId);
    if (lead) {
      setFormData(prev => ({
        ...prev,
        toName: lead.name || 'CUSTOMER NAME',
        phone: lead.phone || '',
        toAddressLine1: lead.phone ? `Phone: ${lead.phone}` : 'Site Address',
        toAddressLine2: `${lead.city || 'Coimbatore'}${lead.state ? ', ' + lead.state : ', Tamil Nadu'}`,
      }));
      toast.success(`Loaded details for ${lead.name || lead.phone}`);
    }
  };

  const savePaymentConfigToStorage = (updatedFields) => {
    try {
      const current = {
        showBankDetails: formData.showBankDetails,
        bankCompanyName: formData.bankCompanyName,
        bankName: formData.bankName,
        bankAccountNo: formData.bankAccountNo,
        bankBranch: formData.bankBranch,
        bankIfsc: formData.bankIfsc,
        showScannerDetails: formData.showScannerDetails,
        gpayNumber: formData.gpayNumber,
        upiTitle: formData.upiTitle,
        upiSubtitle: formData.upiSubtitle,
        upiQrImage: formData.upiQrImage,
        companyPhone: formData.companyPhone,
        companyGstNo: formData.companyGstNo,
        companyWebsite: formData.companyWebsite,
        ...updatedFields
      };
      localStorage.setItem('spc_quotation_payment_config', JSON.stringify(current));
    } catch (e) {}
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    const val = type === 'checkbox' ? checked : value;
    setFormData(prev => ({ ...prev, [name]: val }));

    if ([
      'showBankDetails', 'bankCompanyName', 'bankName', 'bankAccountNo', 'bankBranch', 'bankIfsc', 
      'showScannerDetails', 'gpayNumber', 'upiTitle', 'upiSubtitle',
      'companyPhone', 'companyGstNo', 'companyWebsite'
    ].includes(name)) {
      savePaymentConfigToStorage({ [name]: val });
    }
  };

  const toggleBankDetails = () => {
    const nextState = !formData.showBankDetails;
    setFormData(prev => ({ ...prev, showBankDetails: nextState }));
    savePaymentConfigToStorage({ showBankDetails: nextState });
    toast.success(nextState ? 'Banker Section Enabled' : 'Banker Section Disabled & Removed from Proposal');
  };

  const toggleScannerDetails = () => {
    const nextState = !formData.showScannerDetails;
    setFormData(prev => ({ ...prev, showScannerDetails: nextState }));
    savePaymentConfigToStorage({ showScannerDetails: nextState });
    toast.success(nextState ? 'Scanner Section Enabled' : 'Scanner Section Disabled & Removed from Proposal');
  };

  const handleQrUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 3 * 1024 * 1024) {
      toast.error('QR image must be under 3MB');
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      const imgData = reader.result;
      setFormData(prev => ({ ...prev, upiQrImage: imgData }));
      savePaymentConfigToStorage({ upiQrImage: imgData });
      toast.success('Scanner QR image loaded successfully!');
    };
    reader.readAsDataURL(file);
  };

  const handleRemoveQr = () => {
    setFormData(prev => ({ ...prev, upiQrImage: '' }));
    savePaymentConfigToStorage({ upiQrImage: '' });
    toast.success('Custom QR image removed');
  };

  const handlePrint = () => {
    window.print();
  };

  const handleResetOffline = () => {
    setSelectedLeadId('');
    setFormData(prev => ({
      ...prev,
      refNo: `QSP${Math.floor(1000 + Math.random() * 9000)}`,
      date: new Date().toLocaleDateString('en-GB').replace(/\//g, '.'),
      toName: 'OFFLINE CUSTOMER',
      phone: '',
      toAddressLine1: 'STREET ADDRESS',
      toAddressLine2: 'COIMBATORE, TAMIL NADU',
      kwSize: 5,
      systemType: 'ON GRID',
      panelQty: 9,
      panelMake: 'EASTMAN/ADDO WAAREE/EMMVEE/LUMINOUS/KIRLOSHKAR',
      inverterCapacity: 5,
      inverterMake: 'EASTMAN/TATA',
      pricePerKw: 66900,
      gstPercent: 0,
      subsidyAmount: 78000,
      advPercent: 80,
      secPercent: 20,
      thirdPercent: 0,
    }));
    toast.success('Ready for Offline Client Quotation');
  };

  const kw = Number(formData.kwSize) || 0;
  const price = Number(formData.pricePerKw) || 0;
  const total = Math.round(kw * price);
  const subsidy = Number(formData.subsidyAmount) || 0;
  const gst = Math.round(total * ((Number(formData.gstPercent) || 0) / 100));
  const grandTotal = total - subsidy + gst;

  const term1 = Math.round(grandTotal * (Number(formData.advPercent) || 0) / 100);
  const term2 = Math.round(grandTotal * (Number(formData.secPercent) || 0) / 100);
  const term3 = Math.round(grandTotal * (Number(formData.thirdPercent) || 0) / 100);
  
  const displayedPerKw = kw > 0 ? Math.round((total - subsidy) / kw) : 0;
  const formatINR = (val) => Math.round(Number(val) || 0).toLocaleString('en-IN');

  const handleSaveQuotation = async () => {
    setSavingQuote(true);
    try {
      const payload = {
        name: formData.toName,
        phone: formData.phone || '9876543210',
        location: formData.toAddressLine2,
        recommendedKW: formData.kwSize,
        connectionType: formData.systemType,
        panelModel: formData.panelMake,
        panelCount: formData.panelQty,
        inverterModel: formData.inverterMake,
        estimatedCost: total,
        centralSubsidy: subsidy,
        netCost: grandTotal,
        status: 'Sent',
        adminNotes: `Quotation Ref: ${formData.refNo} generated via Admin Quotation Maker. Advance: Rs. ${term1}, Second: Rs. ${term2}, Final: Rs. ${term3}.`,
      };

      await api.post('/quotations', payload);
      toast.success('Quotation successfully saved to database!');
      
      if (selectedLeadId) {
        await api.put(`/leads/${selectedLeadId}`, { status: 'Quoted' }).catch(() => {});
      }
    } catch (e) {
      toast.error('Failed to save quotation');
    } finally {
      setSavingQuote(false);
    }
  };

  const handleDownloadPdf = async () => {
    setIsGeneratingPdf(true);
    const toastId = toast.loading('Generating official 2-page quotation PDF...');
    try {
      const { pdf, fileName } = await generateQuotationPdf(formData.refNo, formData.toName);
      pdf.save(fileName);
      toast.success(`PDF downloaded: ${fileName}`, { id: toastId });
    } catch (err) {
      console.error('PDF generation failed:', err);
      toast.error('Failed to generate PDF. You can also use the Print Dialog button.', { id: toastId });
    } finally {
      setIsGeneratingPdf(false);
    }
  };

  const handleSendWhatsApp = async () => {
    const rawPhone = formData.phone || '';
    const cleanPhone = rawPhone.replace(/\D/g, '');
    const phoneWithCode = cleanPhone.startsWith('91') ? cleanPhone : `91${cleanPhone}`;

    const contactStr = formData.companyPhone || '80987 44044 (Office) / 84896 44044';
    const webStr = formData.companyWebsite || 'https://spcsolarcbe.com';

    setIsGeneratingPdf(true);
    const toastId = toast.loading('Preparing 2-page PDF & WhatsApp message...');

    try {
      // 1. Generate high-resolution official 2-page PDF
      const { pdf, pdfBlob, pdfFile, fileName } = await generateQuotationPdf(formData.refNo, formData.toName);

      // 2. Trigger automatic local download so user has the file immediately
      pdf.save(fileName);

      // 3. Upload to server to get permanent public link
      let publicUrl = '';
      try {
        const uploadRes = await uploadQuotationPdfToServer({
          pdfBlob,
          fileName,
          refNo: formData.refNo,
          customerName: formData.toName,
          phone: cleanPhone
        });
        if (uploadRes && uploadRes.publicUrl) {
          publicUrl = uploadRes.publicUrl;
        }
      } catch (uploadErr) {
        console.warn('Backend PDF upload warning:', uploadErr);
      }

      if (!publicUrl) {
        const base = typeof window !== 'undefined' ? window.location.origin : 'https://spcsolarcbe.com';
        publicUrl = `${base}/uploads/quotations/${fileName}`;
      }

      // 4. Construct message matching the Intro from User's Picture 3 + PDF link (NO Net Investment or System Size)
      const hasRealName = formData.toName && !['CUSTOMER NAME', 'OFFLINE CUSTOMER', 'CUSTOMER'].includes(formData.toName.toUpperCase().trim());
      const greetingLine = hasRealName ? `Hello *${formData.toName}*!\n\n` : '';
      const intro = `${greetingLine}Greetings from *SPC Solar Technology*!\nHere is your customized quotation (*Ref: ${formData.refNo}*):`;
      const pdfLinkMsg = `\n\n*Official Quotation PDF:*\n${publicUrl}`;
      const closingMsg = `\n\nPlease find your official 2-page quotation PDF attached below. Let us know if you have any questions!\n\nContact: ${contactStr}\n${webStr}`;

      const fullMessage = `${intro}${pdfLinkMsg}${closingMsg}`;

      setLastPdfInfo({
        fileName,
        publicUrl,
        message: fullMessage,
        phoneWithCode,
        customerName: formData.toName,
        pdfBlob,
        pdf
      });

      // 5. Try Native Web Share API if supported (e.g. mobile devices that can share files directly into WhatsApp)
      let sharedViaWebShare = false;
      if (typeof navigator !== 'undefined' && navigator.canShare && navigator.canShare({ files: [pdfFile] })) {
        try {
          await navigator.share({
            title: `SPC Solar Quotation - ${formData.refNo}`,
            text: fullMessage,
            files: [pdfFile]
          });
          sharedViaWebShare = true;
          toast.success('Shared successfully via WhatsApp / Apps!', { id: toastId });
        } catch (shareErr) {
          console.log('Native share cancelled or dismissed:', shareErr);
        }
      }

      // 6. Direct WhatsApp Click-to-Chat if not already sent via native share
      if (!sharedViaWebShare) {
        const targetUrl = cleanPhone 
          ? `https://wa.me/${phoneWithCode}?text=${encodeURIComponent(fullMessage)}`
          : `https://wa.me/?text=${encodeURIComponent(fullMessage)}`;
        
        window.open(targetUrl, '_blank');
        toast.success('PDF downloaded & WhatsApp chat opened!', { id: toastId });
      }

      // 7. Open guide modal for quick drag-and-drop into WhatsApp Web
      setWhatsAppModalOpen(true);

    } catch (err) {
      console.error('Failed to generate PDF for WhatsApp:', err);
      toast.error('Could not auto-generate PDF. Opening WhatsApp with quotation details.', { id: toastId });

      // Fallback message with Intro (NO Net Investment)
      const hasRealName = formData.toName && !['CUSTOMER NAME', 'OFFLINE CUSTOMER', 'CUSTOMER'].includes(formData.toName.toUpperCase().trim());
      const greetingLine = hasRealName ? `Hello *${formData.toName}*!\n\n` : '';
      const fallbackMsg = `${greetingLine}Greetings from *SPC Solar Technology*!\nHere is your customized quotation (*Ref: ${formData.refNo}*):\n\nPlease find your official 2-page quotation PDF attached below. Let us know if you have any questions!\n\nContact: ${contactStr}\n${webStr}`;
      const targetUrl = cleanPhone 
        ? `https://wa.me/${phoneWithCode}?text=${encodeURIComponent(fallbackMsg)}`
        : `https://wa.me/?text=${encodeURIComponent(fallbackMsg)}`;
      window.open(targetUrl, '_blank');
    } finally {
      setIsGeneratingPdf(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Header & Actions Bar */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 bg-white p-6 rounded-2xl border border-gray-200 shadow-sm print:hidden">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <button 
              onClick={() => navigate('/admin/leads')}
              className="text-xs font-bold text-gray-500 hover:text-black flex items-center gap-1 mr-2 px-2.5 py-1 bg-gray-100 hover:bg-gray-200 rounded-md transition-colors"
            >
              <FiArrowLeft /> Back to Customer Leads
            </button>
            <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-red-100 text-red-700 uppercase">
              {selectedLeadId ? 'Online Lead Mode' : 'Offline / Custom Client'}
            </span>
          </div>
          <h2 className="text-2xl md:text-3xl font-heading font-bold text-gray-900 flex items-center gap-2">
            <FiLayers className="text-red-600" /> Pro Quotation Maker (2-Sided View)
          </h2>
          <p className="text-xs text-gray-500 font-body">
            Front and Back sides displayed side-by-side on screen. Edit parameters, save, or download as official 2-page PDF.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center gap-2.5 w-full lg:w-auto">
          <Button 
            variant="outline" 
            onClick={handleResetOffline}
            className="text-xs flex items-center gap-1.5"
            title="Start blank quotation for a walk-in / offline client"
          >
            <FiPlus /> New Offline Client
          </Button>

          <Button 
            variant="outline" 
            onClick={handleSaveQuotation}
            disabled={savingQuote || isGeneratingPdf}
            className="text-xs flex items-center gap-1.5 border-blue-300 text-blue-700 hover:bg-blue-50"
          >
            <FiSave /> {savingQuote ? 'Saving...' : 'Save to System'}
          </Button>

          <button
            type="button"
            onClick={handleSendWhatsApp}
            disabled={isGeneratingPdf}
            className="inline-flex items-center gap-1.5 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-btn text-xs font-bold font-accent shadow-sm transition-colors disabled:opacity-60 cursor-pointer"
            title="Generate official PDF & send via WhatsApp with Introduction"
          >
            {isGeneratingPdf ? (
              <>
                <FiLoader className="animate-spin" size={15} />
                <span>Preparing PDF...</span>
              </>
            ) : (
              <>
                <FaWhatsapp size={15} />
                <span>Send WhatsApp</span>
              </>
            )}
          </button>

          <button
            type="button"
            onClick={handleDownloadPdf}
            disabled={isGeneratingPdf}
            className="inline-flex items-center gap-1.5 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-btn text-xs font-bold font-accent shadow-sm transition-colors disabled:opacity-60 cursor-pointer"
            title="Download crisp 2-page PDF quotation directly"
          >
            {isGeneratingPdf ? (
              <>
                <FiLoader className="animate-spin" size={15} />
                <span>Generating...</span>
              </>
            ) : (
              <>
                <FiDownload size={15} />
                <span>Download PDF</span>
              </>
            )}
          </button>

          <Button 
            variant="outline" 
            onClick={handlePrint} 
            className="text-xs flex items-center gap-1.5 text-gray-700 hover:bg-gray-100"
            title="Open browser print dialog"
          >
            <FiPrinter /> Print Dialog
          </Button>
        </div>
      </div>

      {/* Client Selector & Quick Auto-Fill Bar */}
      <div className="bg-gradient-to-r from-gray-900 to-black text-white p-5 rounded-2xl shadow-md border border-gray-800 print:hidden flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-red-600/20 border border-red-500/40 flex items-center justify-center text-red-400 flex-shrink-0">
            <FiUser size={20} />
          </div>
          <div>
            <h4 className="text-sm font-bold text-white uppercase tracking-wider">
              {formData.toName || 'Select Client'}
            </h4>
            <p className="text-xs text-gray-300 font-body">
              {formData.phone ? `Phone: ${formData.phone}` : 'Walk-in / Offline Client'} • {formData.toAddressLine2}
            </p>
          </div>
        </div>

        {/* Lead Dropdown Picker */}
        <div className="flex items-center gap-2 w-full md:w-auto">
          <span className="text-xs text-gray-400 font-semibold whitespace-nowrap">Load Customer Lead:</span>
          <select
            value={selectedLeadId}
            onChange={(e) => handleLeadSelect(e.target.value)}
            className="bg-gray-800 text-white border border-gray-700 text-xs rounded-xl px-3 py-2 outline-none focus:border-red-500 cursor-pointer w-full md:w-64"
          >
            <option value="">👤 Manual / Offline Client</option>
            {leads.map((l) => (
              <option key={l._id} value={l._id}>
                {l.name ? `${l.name} (${l.phone || l.city})` : `Lead: ${l.phone}`}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Admin Form Controls (Hidden on Print) */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200 print:hidden grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
        <Input label="Reference No" name="refNo" value={formData.refNo} onChange={handleChange} />
        <Input label="Date" name="date" value={formData.date} onChange={handleChange} />
        <Input label="Customer Name" name="toName" value={formData.toName} onChange={handleChange} />
        <Input label="Customer Phone No" name="phone" value={formData.phone} onChange={handleChange} placeholder="e.g. 9876543210" />
        <Input label="Address Line 1" name="toAddressLine1" value={formData.toAddressLine1} onChange={handleChange} />
        <Input label="Address Line 2 (City, State)" name="toAddressLine2" value={formData.toAddressLine2} onChange={handleChange} />
        
        <Input label="System KW Size" name="kwSize" type="number" value={formData.kwSize} onChange={handleChange} />
        
        <div className="flex flex-col w-full mb-4">
          <label className="mb-1.5 font-sans font-semibold text-xs uppercase tracking-wider text-gray-700">
            System Type
          </label>
          <select
            name="systemType"
            value={formData.systemType}
            onChange={handleChange}
            className="w-full px-4 py-3 text-sm font-sans outline-none transition-all duration-200 rounded-md bg-white text-black border border-gray-200 hover:border-gray-400 focus:border-black cursor-pointer appearance-none"
            style={{ backgroundImage: `url("data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22292.4%22%20height%3D%22292.4%22%3E%3Cpath%20fill%3D%22%23131313%22%20d%3D%22M287%2069.4a17.6%2017.6%200%200%200-13-5.4H18.4c-5%200-9.3%201.8-12.9%205.4A17.6%2017.6%200%200%200%200%2082.2c0%205%201.8%209.3%205.4%2012.9l128%20127.9c3.6%203.6%207.8%205.4%2012.8%205.4s9.2-1.8%2012.8-5.4L287%2095c3.5-3.5%205.4-7.8%205.4-12.8%200-5-1.9-9.2-5.5-12.8z%22%2F%3E%3C%2Fsvg%3E")`, backgroundRepeat: 'no-repeat', backgroundPosition: 'right 1rem top 50%', backgroundSize: '0.65rem auto' }}
          >
            <option value="ON GRID">ON GRID</option>
            <option value="OFF GRID">OFF GRID</option>
            <option value="HYBRID">HYBRID</option>
          </select>
        </div>

        <Input label="Price Per KW (Rs)" name="pricePerKw" type="number" value={formData.pricePerKw} onChange={handleChange} />
        <Input label="Govt Subsidy Amount (Rs)" name="subsidyAmount" type="number" value={formData.subsidyAmount} onChange={handleChange} />
        <Input label="GST %" name="gstPercent" type="number" value={formData.gstPercent} onChange={handleChange} />
        <Input label="Panel Qty (NOS)" name="panelQty" type="number" value={formData.panelQty} onChange={handleChange} />
        <Input label="Panel Make" name="panelMake" value={formData.panelMake} onChange={handleChange} />
        <Input label="Inverter Capacity (KVA)" name="inverterCapacity" type="number" value={formData.inverterCapacity} onChange={handleChange} />
        <Input label="Inverter Make" name="inverterMake" value={formData.inverterMake} onChange={handleChange} />
        <Input label="Advance Payment %" name="advPercent" type="number" value={formData.advPercent} onChange={handleChange} />
        <Input label="Second Payment %" name="secPercent" type="number" value={formData.secPercent} onChange={handleChange} />
        <Input label="Final Payment %" name="thirdPercent" type="number" value={formData.thirdPercent} onChange={handleChange} />
      </div>

      {/* --- COMPANY HEADER PROFILE CONTROLS (PAGE 1) --- */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200 print:hidden space-y-4">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 border-b border-gray-100 pb-3">
          <div>
            <h3 className="text-base font-bold text-gray-900 flex items-center gap-2">
              <span className="p-1.5 rounded-lg bg-red-50 text-red-600"><FiGlobe size={18} /></span>
              Company Header Profile (Page 1)
            </h3>
            <p className="text-xs text-gray-500 mt-0.5">
              Edit the Company Phone Number, GST Number, and Website Link displayed at the top-left of Page 1.
            </p>
          </div>
          <span className="text-xs text-gray-400">Auto-saved for future quotes</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <Input 
            label="Company Phone Number" 
            name="companyPhone" 
            value={formData.companyPhone} 
            onChange={handleChange} 
            placeholder="e.g. 80987 44044 (Office), 84896 44044" 
          />
          <Input 
            label="GST No" 
            name="companyGstNo" 
            value={formData.companyGstNo} 
            onChange={handleChange} 
            placeholder="e.g. 33AAHCS8496F1ZT" 
          />
          <Input 
            label="Website Link (Clickable)" 
            name="companyWebsite" 
            value={formData.companyWebsite} 
            onChange={handleChange} 
            placeholder="e.g. https://spcsolarcbe.com" 
          />
        </div>
      </div>

      {/* --- PAYMENT & BANKING SECTION CONTROLS (OUR BANKER & SCAN TO PAY) --- */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200 print:hidden space-y-5">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 border-b border-gray-100 pb-4">
          <div>
            <h3 className="text-base font-bold text-gray-900 flex items-center gap-2">
              <span className="p-1.5 rounded-lg bg-blue-50 text-blue-600"><FiCreditCard size={18} /></span>
              Quotation Payment & Banking Controls (Page 2)
            </h3>
            <p className="text-xs text-gray-500 mt-0.5">
              Turn ON/OFF the Banker details or QR Scanner sections, edit account information, or upload custom payment QR codes.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs text-gray-400">Settings auto-saved for future quotes</span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Card 1: Our Banker Section */}
          <div className={`p-5 rounded-2xl border transition-all ${formData.showBankDetails ? 'bg-blue-50/30 border-blue-200' : 'bg-gray-50/60 border-gray-200 opacity-90'}`}>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2.5">
                <div className={`w-9 h-9 rounded-xl flex items-center justify-center font-bold text-sm ${formData.showBankDetails ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-500'}`}>
                  <FiCreditCard size={18} />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-gray-900">OUR BANKER SECTION</h4>
                  <p className="text-[11px] text-gray-500">Bank name, Account number, Branch & IFSC</p>
                </div>
              </div>

              {/* On / Off Toggle Button */}
              <button
                type="button"
                onClick={toggleBankDetails}
                className={`flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-bold transition-all shadow-xs cursor-pointer ${
                  formData.showBankDetails
                    ? 'bg-blue-600 text-white hover:bg-blue-700'
                    : 'bg-gray-200 text-gray-600 hover:bg-gray-300'
                }`}
              >
                <span className={`w-2 h-2 rounded-full ${formData.showBankDetails ? 'bg-emerald-300' : 'bg-gray-400'}`}></span>
                {formData.showBankDetails ? 'ON (Shown)' : 'OFF (Removed)'}
              </button>
            </div>

            {formData.showBankDetails ? (
              <div className="space-y-3 pt-1">
                <Input 
                  label="Company Name (Account Holder)" 
                  name="bankCompanyName" 
                  value={formData.bankCompanyName} 
                  onChange={handleChange} 
                  placeholder="e.g. SPC SOLAR TECHNOLOGY" 
                />
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <Input 
                    label="Bank Name" 
                    name="bankName" 
                    value={formData.bankName} 
                    onChange={handleChange} 
                    placeholder="e.g. HDFC BANK" 
                  />
                  <Input 
                    label="Account Number" 
                    name="bankAccountNo" 
                    value={formData.bankAccountNo} 
                    onChange={handleChange} 
                    placeholder="e.g. 50200020555742" 
                  />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <Input 
                    label="Branch Location" 
                    name="bankBranch" 
                    value={formData.bankBranch} 
                    onChange={handleChange} 
                    placeholder="e.g. RS PURAM BRANCH, COIMBATORE" 
                  />
                  <Input 
                    label="IFSC Code" 
                    name="bankIfsc" 
                    value={formData.bankIfsc} 
                    onChange={handleChange} 
                    placeholder="e.g. HDFC0000000" 
                  />
                </div>
                <p className="text-[11px] text-blue-700 flex items-center gap-1 mt-1 font-medium">
                  <FiCheck size={14} /> Visible on Page 2 under Terms & Conditions
                </p>
              </div>
            ) : (
              <div className="py-6 text-center border-2 border-dashed border-gray-200 rounded-xl bg-white/60">
                <p className="text-xs text-gray-500 font-medium mb-1">
                  🚫 Our Banker section is turned <span className="font-bold text-red-600">OFF</span>
                </p>
                <p className="text-[11px] text-gray-400 mb-3">
                  It will be completely removed from the Page 2 quotation preview and printed PDF.
                </p>
                <button
                  type="button"
                  onClick={toggleBankDetails}
                  className="px-3 py-1.5 bg-blue-100 hover:bg-blue-200 text-blue-700 rounded-lg text-xs font-bold transition-colors cursor-pointer"
                >
                  Turn ON Banker Section
                </button>
              </div>
            )}
          </div>

          {/* Card 2: Scan To Pay (Scanner) Section */}
          <div className={`p-5 rounded-2xl border transition-all ${formData.showScannerDetails ? 'bg-emerald-50/30 border-emerald-200' : 'bg-gray-50/60 border-gray-200 opacity-90'}`}>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2.5">
                <div className={`w-9 h-9 rounded-xl flex items-center justify-center font-bold text-sm ${formData.showScannerDetails ? 'bg-emerald-600 text-white' : 'bg-gray-200 text-gray-500'}`}>
                  <FiSmartphone size={18} />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-gray-900">SCAN TO PAY (UPI) SECTION</h4>
                  <p className="text-[11px] text-gray-500">Scanner QR Code, UPI Number & Apps</p>
                </div>
              </div>

              {/* On / Off Toggle Button */}
              <button
                type="button"
                onClick={toggleScannerDetails}
                className={`flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-bold transition-all shadow-xs cursor-pointer ${
                  formData.showScannerDetails
                    ? 'bg-emerald-600 text-white hover:bg-emerald-700'
                    : 'bg-gray-200 text-gray-600 hover:bg-gray-300'
                }`}
              >
                <span className={`w-2 h-2 rounded-full ${formData.showScannerDetails ? 'bg-emerald-300' : 'bg-gray-400'}`}></span>
                {formData.showScannerDetails ? 'ON (Shown)' : 'OFF (Removed)'}
              </button>
            </div>

            {formData.showScannerDetails ? (
              <div className="space-y-3 pt-1">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <Input 
                    label="GPay / PhonePe / UPI Number" 
                    name="gpayNumber" 
                    value={formData.gpayNumber} 
                    onChange={handleChange} 
                    placeholder="e.g. 8489644044" 
                  />
                  <Input 
                    label="Payment Title" 
                    name="upiTitle" 
                    value={formData.upiTitle} 
                    onChange={handleChange} 
                    placeholder="e.g. G.PAY / PHONEPE / ALL UPI" 
                  />
                </div>

                <Input 
                  label="Accepted Apps Subtitle" 
                  name="upiSubtitle" 
                  value={formData.upiSubtitle} 
                  onChange={handleChange} 
                  placeholder="e.g. Accepts GPay, PhonePe, Paytm, BHIM & All UPI Apps" 
                />

                {/* Scanner QR Code Upload Field */}
                <div className="flex flex-col w-full">
                  <label className="mb-1.5 font-sans font-semibold text-xs uppercase tracking-wider text-gray-700">
                    Payment Scanner QR Code (Image Upload)
                  </label>
                  <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 p-3 bg-white border border-gray-200 rounded-xl">
                    <div className="w-16 h-16 rounded-lg border border-gray-300 bg-gray-50 flex items-center justify-center overflow-hidden flex-shrink-0">
                      {formData.upiQrImage ? (
                        <img src={formData.upiQrImage} alt="QR Preview" className="w-full h-full object-contain" />
                      ) : (
                        <div className="text-center text-[9px] text-gray-400 font-bold leading-tight">
                          <span>UPI</span><br /><span>QR</span>
                        </div>
                      )}
                    </div>

                    <div className="flex-1 space-y-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <label className="cursor-pointer inline-flex items-center gap-1.5 px-3 py-1.5 bg-gray-100 hover:bg-gray-200 text-gray-800 rounded-lg text-xs font-semibold transition-colors">
                          <FiUploadCloud size={14} className="text-emerald-600" />
                          <span>{formData.upiQrImage ? 'Change QR Image' : 'Upload Scanner QR'}</span>
                          <input type="file" accept="image/*" onChange={handleQrUpload} className="hidden" />
                        </label>
                        {formData.upiQrImage && (
                          <button
                            type="button"
                            onClick={handleRemoveQr}
                            className="inline-flex items-center gap-1 px-2.5 py-1.5 bg-red-50 hover:bg-red-100 text-red-600 rounded-lg text-xs font-semibold transition-colors cursor-pointer"
                          >
                            <FiTrash2 size={13} /> Remove
                          </button>
                        )}
                      </div>
                      <p className="text-[10.5px] text-gray-500">
                        {formData.upiQrImage 
                          ? '✓ Custom QR code is loaded and will appear on the proposal' 
                          : 'Optional: Upload your UPI QR code image (PNG/JPG) to show real scanner, or leave empty for default badge.'}
                      </p>
                    </div>
                  </div>
                </div>

                <p className="text-[11px] text-emerald-700 flex items-center gap-1 mt-1 font-medium">
                  <FiCheck size={14} /> Visible on Page 2 next to payment instructions
                </p>
              </div>
            ) : (
              <div className="py-6 text-center border-2 border-dashed border-gray-200 rounded-xl bg-white/60">
                <p className="text-xs text-gray-500 font-medium mb-1">
                  🚫 Scan to Pay section is turned <span className="font-bold text-red-600">OFF</span>
                </p>
                <p className="text-[11px] text-gray-400 mb-3">
                  It will be completely removed from the Page 2 quotation preview and printed PDF.
                </p>
                <button
                  type="button"
                  onClick={toggleScannerDetails}
                  className="px-3 py-1.5 bg-emerald-100 hover:bg-emerald-200 text-emerald-700 rounded-lg text-xs font-bold transition-colors cursor-pointer"
                >
                  Turn ON Scanner Section
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* --- 2-SIDED QUOTATION PREVIEW: FRONT SIDE & BACK SIDE SIDE-BY-SIDE --- */}
      <div className="print-quotation-wrapper grid grid-cols-1 xl:grid-cols-2 gap-8 w-full max-w-[1700px] mx-auto print:block print:w-[210mm] print:max-w-none print:gap-0 print:m-0 print:p-0">
        
        {/* ========================================================= */}
        {/* FRONT SIDE (PAGE 1)                                       */}
        {/* ========================================================= */}
        <div className="flex flex-col print:block print:m-0 print:p-0 print:w-[210mm]">
          {/* Badge Header for Screen Preview */}
          <div className="print:hidden mb-3 flex items-center justify-between px-2">
            <span className="text-xs font-bold font-accent tracking-wider uppercase bg-red-600 text-white px-3.5 py-1.5 rounded-lg flex items-center gap-2 shadow-sm">
              <FiFileText /> <span>FRONT SIDE</span> <span className="opacity-80 font-normal">(PAGE 1 - SPECS & PRICING)</span>
            </span>
            <span className="text-xs text-gray-500 font-mono font-bold">Ref: {formData.refNo}</span>
          </div>

          <div className="print-page print-page-1 bg-white text-gray-900 p-5 sm:p-6 print:p-[10mm_12mm] w-full h-[297mm] min-h-[297mm] max-h-[297mm] shadow-2xl print:shadow-none font-sans text-[11px] leading-normal relative rounded-2xl print:rounded-none border border-gray-200 flex flex-col justify-between overflow-hidden">
            
            <div className="relative z-10 flex-1 flex flex-col justify-between h-full">
              <div>
                {/* Header */}
                <div className="flex justify-between items-start mb-2 sm:mb-2.5">
                  <div className="font-medium text-[10.5px] uppercase leading-relaxed text-gray-700 tracking-wider">
                    <p className="font-black text-base tracking-wide mb-0.5 text-red-600">SPC SOLAR TECHNOLOGY</p>
                    <p className="text-gray-700 leading-snug">No-115-117, Easwari Towers,</p>
                    <p className="text-gray-700 leading-snug">Devanga High School Road, RS Puram,</p>
                    <p className="text-gray-700 leading-snug">Coimbatore - 641002.</p>
                    <p className="mt-0.5 text-red-600 font-bold tracking-wide">
                      MOBILE: {formData.companyPhone || '80987 44044 (Office), 84896 44044'}
                    </p>
                    <p className="text-red-600 font-medium">spctechnologycoimbatore@gmail.com</p>
                    {formData.companyGstNo && (
                      <p className="text-gray-900 font-bold tracking-wide">
                        GST NO: {formData.companyGstNo}
                      </p>
                    )}
                    {formData.companyWebsite && (
                      <p className="text-blue-600 font-semibold tracking-normal lowercase">
                        <a 
                          href={formData.companyWebsite.startsWith('http') ? formData.companyWebsite : `https://${formData.companyWebsite}`}
                          target="_blank" 
                          rel="noopener noreferrer" 
                          className="hover:underline text-blue-600 inline-flex items-center gap-1 font-medium"
                        >
                          🌐 {formData.companyWebsite.replace(/^https?:\/\//, '')}
                        </a>
                      </p>
                    )}
                  </div>
                  <div className="text-right flex flex-col items-end">
                    <img src={Logo} alt="SPC Solar Logo" className="w-24 sm:w-28 object-contain" />
                  </div>
                </div>

                {/* Title */}
                <div className="text-center my-1.5 sm:my-2">
                  <h1 className="text-lg sm:text-xl font-black tracking-widest uppercase text-red-600 drop-shadow-xs">
                    {formData.systemType} QUOTATION
                  </h1>
                  <div className="h-0.5 w-24 bg-gradient-to-r from-transparent via-red-600 to-transparent mx-auto mt-0.5"></div>
                </div>

                {/* Ref & Date & To */}
                <div className="grid grid-cols-2 gap-3 mb-2 sm:mb-2.5 bg-gray-50/80 p-2.5 sm:p-3 rounded-xl border border-gray-200 text-[10.5px] shadow-xs">
                  <div className="uppercase">
                    <p className="text-red-600 text-[9px] font-bold tracking-widest mb-0.5">BILL TO</p>
                    <p className="font-bold text-black text-xs sm:text-sm tracking-wide">{formData.toName}</p>
                    {formData.phone && (
                      <p className="text-red-600 font-bold text-[10.5px] mt-0.5 tracking-wide">
                        PH: {formData.phone}
                      </p>
                    )}
                    <p className="text-gray-700 text-[10px] mt-0.5 leading-snug">{formData.toAddressLine1}</p>
                    <p className="text-gray-700 text-[10px] leading-snug">{formData.toAddressLine2}</p>
                  </div>
                  <div className="text-right uppercase">
                    <p className="text-red-600 text-[9px] font-bold tracking-widest mb-0.5">PROPOSAL DETAILS</p>
                    <p><span className="text-gray-500 mr-2">REF:</span> <span className="font-mono font-bold text-black">{formData.refNo}</span></p>
                    <p><span className="text-gray-500 mr-2">DATE:</span> <span className="font-bold text-black">{formData.date}</span></p>
                    <p className="mt-0.5"><span className="text-gray-500 mr-2">SYSTEM:</span> <span className="font-black text-red-600 text-xs sm:text-sm">{formData.kwSize} KW ({formData.systemType})</span></p>
                  </div>
                </div>

                {/* Table - Generous & balanced fit */}
                <div className="rounded-xl overflow-hidden border border-gray-300 bg-white shadow-sm mb-2">
                  <table className="w-full text-center border-collapse">
                    <thead>
                      <tr className="bg-gray-100 text-gray-900 font-bold tracking-wider text-[9.5px] uppercase border-b border-gray-300">
                        <th className="py-1 px-2 border-b border-r border-gray-300 w-8">#</th>
                        <th className="py-1 px-3 border-b border-r border-gray-300 text-left">Capital Expenditure (per MWp)</th>
                        <th className="py-1 px-2 border-b border-r border-gray-300 w-20">Qty</th>
                        <th className="py-1 px-3 border-b border-r border-gray-300 w-44">Make</th>
                        <th className="py-1 px-3 border-b border-gray-300 w-28">INR</th>
                      </tr>
                    </thead>
                    <tbody className="text-gray-800 text-[9.5px]">
                      <tr className="hover:bg-gray-50 transition-colors border-b border-gray-200">
                        <td className="py-1 px-2 border-r border-gray-200 font-bold text-black">1</td>
                        <td className="py-1 px-3 border-r border-gray-200 text-left leading-snug text-gray-900">
                          PV Modules – {formData.systemType === 'OFF GRID' ? '580' : '550'} Watts-Mono Perc Ofcut Bifacial - MNRE Approved - 25 Years warranty "A" Class Cells
                        </td>
                        <td className="py-1 px-2 border-r border-gray-200 font-bold text-black">{formData.panelQty} NOS</td>
                        <td className="py-1 px-3 border-r border-gray-200 font-semibold text-black leading-snug">{formData.panelMake}</td>
                        <td className="py-1 px-3"></td>
                      </tr>
                      <tr className="hover:bg-gray-50 transition-colors border-b border-gray-200">
                        <td className="py-1 px-2 border-r border-gray-200 font-bold text-black">2</td>
                        <td className="py-1 px-3 border-r border-gray-200 text-left leading-snug text-gray-900">
                          {formData.systemType === 'OFF GRID'
                            ? `MNRE APPROVED - ${formData.inverterCapacity} KW OFFGRID INVERTER WITH LITHIYAM IRON BATTERY SINGLE PHASE 8 + 2 Years Replacement warranty`
                            : `MNRE APPROVED ON GRID - ${formData.inverterCapacity} KVA THREE PHASE Inverter 10 Years Warranty WITH DONGLE`}
                        </td>
                        <td className="py-1 px-2 border-r border-gray-200 font-bold text-black">1 NO</td>
                        <td className="py-1 px-3 border-r border-gray-200 font-semibold text-black leading-snug">{formData.inverterMake}</td>
                        <td className="py-1 px-3"></td>
                      </tr>
                      <tr className="hover:bg-gray-50 transition-colors border-b border-gray-200">
                        <td className="py-1 px-2 border-r border-gray-200 font-bold text-black">3</td>
                        <td className="py-1 px-3 border-r border-gray-200 text-left text-gray-900">GI STRUCTURE 4 X 3 1/2</td>
                        <td className="py-1 px-2 border-r border-gray-200 font-bold text-black">1 LOT</td>
                        <td className="py-1 px-3 border-r border-gray-200"></td>
                        <td className="py-1 px-3"></td>
                      </tr>
                      <tr className="hover:bg-gray-50 transition-colors bg-gray-50/50 border-b border-gray-200">
                        <td className="py-1 px-2 border-r border-gray-200 font-bold text-black">4</td>
                        <td className="py-1 px-3 border-r border-gray-200 text-left text-gray-900">DCDB BOX WITH SURGE PROTECTION DEVICE</td>
                        <td className="py-1 px-2 border-r border-gray-200 font-bold text-black">1 NO</td>
                        <td className="py-1 px-3 border-r border-gray-200"></td>
                        <td className="py-1 px-3"></td>
                      </tr>
                      <tr className="hover:bg-gray-50 transition-colors border-b border-gray-200">
                        <td className="py-1 px-2 border-r border-gray-200 font-bold text-black">5</td>
                        <td className="py-1 px-3 border-r border-gray-200 text-left text-gray-900">DC CABLE 4 SQURE MM</td>
                        <td className="py-1 px-2 border-r border-gray-200 font-bold text-black">As req.</td>
                        <td className="py-1 px-3 border-r border-gray-200"></td>
                        <td className="py-1 px-3"></td>
                      </tr>
                      <tr className="hover:bg-gray-50 transition-colors bg-gray-50/50 border-b border-gray-200">
                        <td className="py-1 px-2 border-r border-gray-200 font-bold text-black">6</td>
                        <td className="py-1 px-3 border-r border-gray-200 text-left text-gray-900">ACDB BOX WITH SURGE PROTECTION DEVICE</td>
                        <td className="py-1 px-2 border-r border-gray-200 font-bold text-black">1 NO</td>
                        <td className="py-1 px-3 border-r border-gray-200"></td>
                        <td className="py-1 px-3"></td>
                      </tr>
                      <tr className="hover:bg-gray-50 transition-colors border-b border-gray-200">
                        <td className="py-1 px-2 border-r border-gray-200 font-bold text-black">7</td>
                        <td className="py-1 px-3 border-r border-gray-200 text-left text-gray-900">AC CABLE</td>
                        <td className="py-1 px-2 border-r border-gray-200 font-bold text-black">As req.</td>
                        <td className="py-1 px-3 border-r border-gray-200"></td>
                        <td className="py-1 px-3"></td>
                      </tr>
                      <tr className="hover:bg-gray-50 transition-colors bg-gray-50/50 border-b border-gray-200">
                        <td className="py-1 px-2 border-r border-gray-200 font-bold text-black">8</td>
                        <td className="py-1 px-3 border-r border-gray-200 text-left text-gray-900">EARTHING 3 FEET COPPER COATED IRON ROD</td>
                        <td className="py-1 px-2 border-r border-gray-200 font-bold text-black">2</td>
                        <td className="py-1 px-3 border-r border-gray-200"></td>
                        <td className="py-1 px-3"></td>
                      </tr>
                      <tr className="hover:bg-gray-50 transition-colors border-b border-gray-200">
                        <td className="py-1 px-2 border-r border-gray-200 font-bold text-black">9</td>
                        <td className="py-1 px-3 border-r border-gray-200 text-left text-gray-900">LIGHTNING ARRESTOR C/W GI PIPE</td>
                        <td className="py-1 px-2 border-r border-gray-200 font-bold text-black">1</td>
                        <td className="py-1 px-3 border-r border-gray-200"></td>
                        <td className="py-1 px-3"></td>
                      </tr>

                      {/* Financial Totals */}
                      <tr className="bg-gray-50 text-gray-900 font-bold border-b border-gray-300">
                        <td className="py-1 px-3 border-r border-gray-300 text-right uppercase tracking-wider text-[9.5px]" colSpan="4">TOTAL SYSTEM COST</td>
                        <td className="py-1 px-3 text-right font-bold text-black text-[10.5px]">₹ {formatINR(total)}</td>
                      </tr>
                      {subsidy > 0 && (
                        <tr className="bg-emerald-50 text-emerald-800 font-bold border-b border-gray-300">
                          <td className="py-0.5 px-3 border-r border-gray-300 text-right uppercase tracking-wider text-[9.5px] text-emerald-700" colSpan="4">CENTRAL GOVT. SUBSIDY</td>
                          <td className="py-0.5 px-3 text-right text-emerald-700 font-bold text-[10.5px]">- ₹ {formatINR(subsidy)}</td>
                        </tr>
                      )}
                      {gst > 0 && (
                        <tr className="bg-gray-50 text-gray-900 font-semibold border-b border-gray-300">
                          <td className="py-0.5 px-3 border-r border-gray-300 text-right uppercase tracking-wider text-[9.5px]" colSpan="4">GST {formData.gstPercent}%</td>
                          <td className="py-0.5 px-3 text-right text-gray-900 text-[10.5px]">₹ {formatINR(gst)}</td>
                        </tr>
                      )}
                      <tr className="bg-red-50 text-red-600 font-black text-xs border-b border-t-2 border-red-500">
                        <td className="py-1.5 px-3 border-r border-gray-300 text-right uppercase tracking-widest text-red-600 text-xs sm:text-[12.5px]" colSpan="4">GRAND TOTAL (NET INVESTMENT)</td>
                        <td className="py-1.5 px-3 text-right text-red-600 font-black text-sm sm:text-base">₹ {formatINR(grandTotal)}</td>
                      </tr>

                      {/* Payment Terms */}
                      <tr className="text-gray-700 text-[9px] border-b border-gray-200 bg-white">
                        <td className="py-0.5 px-3 border-r border-gray-200 text-left uppercase tracking-wider font-semibold" colSpan="4">RATE PER KW: ₹ {formatINR(displayedPerKw)} / KW</td>
                        <td className="py-0.5 px-3"></td>
                      </tr>
                      {formData.advPercent > 0 && (
                        <tr className="bg-gray-50/80 text-gray-800 text-[9px] border-b border-gray-200">
                          <td className="py-0.5 px-3 border-r border-gray-200 text-left uppercase tracking-wider font-medium" colSpan="4">ADVANCE PAYMENT ({formData.advPercent}%)</td>
                          <td className="py-0.5 px-3 text-right text-black font-bold">₹ {formatINR(term1)}</td>
                        </tr>
                      )}
                      {formData.secPercent > 0 && (
                        <tr className="bg-gray-50/80 text-gray-800 text-[9px] border-b border-gray-200">
                          <td className="py-0.5 px-3 border-r border-gray-200 text-left uppercase tracking-wider font-medium" colSpan="4">SECOND STAGE PAYMENT ({formData.secPercent}%)</td>
                          <td className="py-0.5 px-3 text-right text-black font-bold">₹ {formatINR(term2)}</td>
                        </tr>
                      )}
                      {formData.thirdPercent > 0 && (
                        <tr className="bg-gray-50/80 text-gray-800 text-[9px]">
                          <td className="py-0.5 px-3 border-r border-gray-200 text-left uppercase tracking-wider font-medium" colSpan="4">WORK COMPLETION PAYMENT ({formData.thirdPercent}%)</td>
                          <td className="py-0.5 px-3 text-right text-black font-bold">₹ {formatINR(term3)}</td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Bottom Area: Authorized Channel Partners & Footer (Anchored to Bottom of First Page) */}
              <div className="mt-auto pt-2">
                {/* Authorized Channel Partners */}
                <div className="mb-2">
                  <div className="text-center mb-1">
                    <span className="font-bold text-gray-700 tracking-widest uppercase text-[9.5px]">
                      AUTHORIZED CHANNEL PARTNERS
                    </span>
                  </div>
                  <div className="flex flex-wrap justify-center gap-2 font-bold text-gray-900 italic text-[10px]">
                    <span className="px-3 py-0.5 bg-gray-100 border border-gray-300 rounded-md">KIRLOSKAR</span>
                    <span className="px-3 py-0.5 bg-gray-100 border border-gray-300 rounded-md">LUMINOUS</span>
                    <span className="px-3 py-0.5 bg-gray-100 border border-gray-300 rounded-md">ADANI</span>
                    <span className="px-3 py-0.5 bg-gray-100 border border-gray-300 rounded-md">WAAREE</span>
                    <span className="px-3 py-0.5 bg-gray-100 border border-gray-300 rounded-md">EASTMAN</span>
                    <span className="px-3 py-0.5 bg-gray-100 border border-gray-300 rounded-md">TATA</span>
                  </div>
                </div>

                {/* Page 1 Footer */}
                <div className="text-center text-[10px] text-gray-500 border-t border-gray-200 pt-1.5 flex justify-between items-center">
                  <span>SPC Solar Technology • Official Proposal</span>
                  <span className="font-mono">Page 1 of 2 (Front Side)</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ========================================================= */}
        {/* BACK SIDE (PAGE 2)                                        */}
        {/* ========================================================= */}
        <div className="flex flex-col mt-8 xl:mt-0 print:block print:m-0 print:p-0 print:w-[210mm]">
          {/* Badge Header for Screen Preview */}
          <div className="print:hidden mb-3 flex items-center justify-between px-2">
            <span className="text-xs font-bold font-accent tracking-wider uppercase bg-blue-600 text-white px-3.5 py-1.5 rounded-lg flex items-center gap-2 shadow-sm">
              <FiFileText /> <span>BACK SIDE</span> <span className="opacity-80 font-normal">(PAGE 2 - TERMS & BANKING)</span>
            </span>
            <span className="text-xs text-gray-500 font-mono font-bold">SPC Solar Guarantee</span>
          </div>

          <div className="print-page print-page-2 bg-white text-gray-900 p-5 sm:p-6 print:p-[10mm_12mm] w-full h-[297mm] min-h-[297mm] max-h-[297mm] shadow-2xl print:shadow-none font-sans text-[11px] leading-normal relative rounded-2xl print:rounded-none border border-gray-200 flex flex-col justify-between overflow-hidden">
            
            <div className="relative z-10 flex-1 flex flex-col justify-between h-full">
              <div>
                {/* Terms & Conditions */}
                <div className="mb-4">
                  <div className="bg-red-50 border-l-4 border-red-600 px-3 py-1 inline-block mb-2 shadow-xs rounded-r-md">
                    <span className="font-bold text-red-600 tracking-widest uppercase text-xs">Terms & Conditions</span>
                  </div>
                  <ul className="list-none pl-2 space-y-1.5 text-gray-800 font-medium text-[10.5px] leading-relaxed">
                    <li className="flex items-start"><span className="text-red-600 mr-2.5 font-bold">▪</span> Quotation valid up to 30 days only from the date of issue.</li>
                    <li className="flex items-start"><span className="text-red-600 mr-2.5 font-bold">▪</span> Installation work will take 1 TO 21 days & subject to change based on fitting constraint.</li>
                    <li className="flex items-start"><span className="text-red-600 mr-2.5 font-bold">▪</span> The risk of loss attaching to the goods shall pass to customer with effect from the moment of delivery.</li>
                    <li className="flex items-start"><span className="text-red-600 mr-2.5 font-bold">▪</span> 1 Year Free Service Support from SPC on date of installation completed.</li>
                    <li className="flex items-start"><span className="text-red-600 mr-2.5 font-bold">▪</span> All our materials delivery directly to Client Site.</li>
                  </ul>
                </div>

                {/* Client Scope */}
                <div className="mb-4">
                  <div className="bg-red-50 border-l-4 border-red-600 px-3 py-1 inline-block mb-2 shadow-xs rounded-r-md">
                    <span className="font-bold text-red-600 tracking-widest uppercase text-xs">CLIENT SCOPE</span>
                  </div>
                  <ul className="list-none pl-2 space-y-1 text-gray-800 font-medium uppercase text-[10px] leading-relaxed">
                    <li className="flex items-start"><span className="text-red-600 mr-2.5 font-bold">▪</span> Power and water should be provided by client during installation.</li>
                    <li className="flex items-start"><span className="text-red-600 mr-2.5 font-bold">▪</span> Preparing the roof surface and cleaning is client scope.</li>
                    <li className="flex items-start"><span className="text-red-600 mr-2.5 font-bold">▪</span> Net meter Procurement and EB department follow up by client.</li>
                    <li className="flex items-start"><span className="text-red-600 mr-2.5 font-bold">▪</span> GST {formData.gstPercent}% will extra as actual invoicing.</li>
                    <li className="flex items-start"><span className="text-red-600 mr-2.5 font-bold">▪</span> Material transportation charges shall be paid by client.</li>
                    <li className="flex items-start"><span className="text-red-600 mr-2.5 font-bold">▪</span> Civil Works and Excavation by Client Scope.</li>
                    <li className="flex items-start"><span className="text-red-600 mr-2.5 font-bold">▪</span> NETMETER CHARGES IS CLIENT SCOPE. SINGLE PHASE 2575, THREE PHASE 4770.</li>
                    <li className="flex items-start"><span className="text-red-600 mr-2.5 font-bold">▪</span> DOCUMENT CHARGES 2500 WILL BE CLIENT SCOPE.</li>
                  </ul>
                </div>

                {/* Our Banker (Conditional On / Off) */}
                {formData.showBankDetails && (
                  <div className="mb-4 bg-gray-50/80 p-3.5 sm:p-4 rounded-xl border border-gray-300 shadow-xs">
                    <div className="bg-blue-50 border-l-4 border-blue-600 px-3 py-1 inline-block mb-2.5 shadow-xs rounded-r-md">
                      <span className="font-bold text-blue-900 tracking-widest uppercase text-xs">OUR BANKER</span>
                    </div>
                    <div className="pl-2 font-medium space-y-1 text-gray-800 text-[10.5px]">
                      <div className="grid grid-cols-[140px_auto]">
                        <p className="text-gray-600 font-semibold">COMPANY NAME</p>
                        <p className="text-black font-bold">: {formData.bankCompanyName || 'SPC SOLAR TECHNOLOGY'}</p>
                      </div>
                      <div className="grid grid-cols-[140px_auto]">
                        <p className="text-gray-600 font-semibold">BANK NAME</p>
                        <p className="text-black font-bold">: {formData.bankName || 'HDFC BANK'}</p>
                      </div>
                      <div className="grid grid-cols-[140px_auto]">
                        <p className="text-gray-600 font-semibold">ACCOUNT NO</p>
                        <p className="text-black font-mono font-bold">: {formData.bankAccountNo || '50200020555742'}</p>
                      </div>
                      <div className="grid grid-cols-[140px_auto]">
                        <p className="text-gray-600 font-semibold">BRANCH</p>
                        <p className="text-black font-medium">: {formData.bankBranch || 'RS PURAM BRANCH, COIMBATORE'}</p>
                      </div>
                      <div className="grid grid-cols-[140px_auto]">
                        <p className="text-gray-600 font-semibold">IFSC CODE</p>
                        <p className="text-black font-mono font-bold">: {formData.bankIfsc || 'HDFC0000000'}</p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Scan to Pay (Conditional On / Off & Custom Scanner QR Code) */}
                {formData.showScannerDetails && (
                  <div className="mb-4 bg-emerald-50/40 p-3.5 rounded-xl border border-emerald-300 shadow-xs flex items-center justify-between">
                    <div className="flex items-center gap-4 pl-1">
                      <div className="w-18 h-18 bg-white rounded-xl p-1.5 flex items-center justify-center font-bold text-gray-900 border border-gray-300 shadow-sm overflow-hidden flex-shrink-0">
                        {formData.upiQrImage ? (
                          <img 
                            src={formData.upiQrImage} 
                            alt="Payment Scanner QR" 
                            className="w-full h-full object-contain" 
                          />
                        ) : (
                          <div className="text-center leading-tight">
                            <div className="text-xs font-black text-black tracking-wider">UPI</div>
                            <div className="text-[8px] font-bold text-red-600">PAY</div>
                            <div className="text-[7px] text-gray-600 font-mono">SCAN QR</div>
                          </div>
                        )}
                      </div>
                      <div>
                        <div className="bg-emerald-100/70 border-l-3 border-emerald-600 px-2 py-0.5 inline-block mb-1 rounded-r-md">
                          <span className="font-bold text-emerald-900 tracking-widest uppercase text-[10px]">SCAN TO PAY (UPI)</span>
                        </div>
                        <p className="text-xs text-gray-600 font-semibold">{formData.upiTitle || 'G.PAY / PHONEPE / ALL UPI'}</p>
                        <p className="text-lg text-black font-mono font-black tracking-widest">{formData.gpayNumber}</p>
                        <p className="text-[9.5px] text-emerald-700 font-semibold">{formData.upiSubtitle || 'Accepts GPay, PhonePe, Paytm, BHIM & All UPI Apps'}</p>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Signatures */}
              <div>
                <div className="flex justify-between items-end font-medium px-4 pt-3 border-t border-gray-200">
                  <div className="bg-gray-50 rounded-xl border border-gray-200 p-3 pt-10 w-44 text-center text-gray-800 uppercase tracking-wider">
                    <div className="w-full border-b border-gray-400 mb-1.5"></div>
                    <p className="text-[8.5px] font-bold text-gray-800">CUSTOMER SIGNATURE</p>
                  </div>
                  <div className="bg-gray-50 rounded-xl border border-gray-200 p-3 pt-10 w-52 text-center text-gray-800 uppercase tracking-wider">
                    <div className="w-full border-b border-gray-400 mb-1.5"></div>
                    <p className="text-[8.5px] font-bold text-gray-800">SPC SOLAR OFFICE SIGNATURE</p>
                  </div>
                </div>

                <div className="text-center text-[10px] text-gray-500 pt-2.5 mt-2 flex justify-between items-center border-t border-gray-200">
                  <span>SPC Solar Technology • Official Proposal</span>
                  <span className="font-mono">Page 2 of 2 (Back Side)</span>
                </div>
              </div>

            </div>
          </div>
        </div>

      </div>

      {/* Strict 2-Page Print Stylesheet */}
      <style>{`
        @media print {
          @page {
            size: A4 portrait;
            margin: 0mm !important;
          }
          *, *::before, *::after {
            box-sizing: border-box !important;
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
          }
          html, body {
            margin: 0 !important;
            padding: 0 !important;
            width: 210mm !important;
            height: 100% !important;
            background-color: #ffffff !important;
            color: #000000 !important;
            overflow: visible !important;
          }
          nav, header, aside, .print\\:hidden {
            display: none !important;
            height: 0 !important;
            margin: 0 !important;
            padding: 0 !important;
            border: none !important;
          }
          main {
            padding: 0 !important;
            margin: 0 !important;
            overflow: visible !important;
            background: transparent !important;
          }
          .space-y-6 > :not([hidden]) ~ :not([hidden]) {
            margin-top: 0 !important;
            margin-bottom: 0 !important;
          }
          .print-quotation-wrapper {
            display: block !important;
            width: 210mm !important;
            max-width: 210mm !important;
            margin: 0 !important;
            padding: 0 !important;
            transform: none !important;
          }
          .print-page {
            box-sizing: border-box !important;
            overflow: hidden !important;
            border: none !important;
            border-radius: 0 !important;
            background: #ffffff !important;
            color: #000000 !important;
          }
          .print-page-1 {
            display: flex !important;
            flex-direction: column !important;
            justify-content: space-between !important;
            width: 210mm !important;
            height: 297mm !important;
            max-height: 297mm !important;
            min-height: 297mm !important;
            padding: 10mm 12mm !important;
            margin: 0 !important;
            page-break-before: auto !important;
            break-before: auto !important;
            page-break-after: always !important;
            break-after: page !important;
            page-break-inside: avoid !important;
            break-inside: avoid !important;
          }
          .print-page-2 {
            display: flex !important;
            flex-direction: column !important;
            justify-content: space-between !important;
            width: 210mm !important;
            height: 297mm !important;
            max-height: 297mm !important;
            min-height: 297mm !important;
            padding: 10mm 12mm !important;
            margin: 0 !important;
            box-sizing: border-box !important;
            page-break-before: auto !important;
            break-before: auto !important;
            page-break-after: avoid !important;
            break-after: avoid !important;
            page-break-inside: avoid !important;
            break-inside: avoid !important;
          }
        }
      `}</style>

      {/* WhatsApp PDF Delivery Assistant Modal */}
      <Modal
        isOpen={whatsAppModalOpen}
        onClose={() => setWhatsAppModalOpen(false)}
        title="Quotation PDF & WhatsApp Delivery"
        size="md"
      >
        <div className="p-5 space-y-4 font-body">
          <div className="flex items-center gap-3 p-3.5 bg-emerald-50 border border-emerald-200 rounded-xl">
            <div className="w-10 h-10 rounded-full bg-emerald-600 text-white flex items-center justify-center flex-shrink-0">
              <FaWhatsapp size={22} />
            </div>
            <div>
              <h4 className="text-sm font-bold text-emerald-950">WhatsApp Chat Ready!</h4>
              <p className="text-xs text-emerald-700">
                Recipient: <strong className="text-emerald-900">{lastPdfInfo?.customerName || formData.toName}</strong> ({lastPdfInfo?.phoneWithCode ? `+${lastPdfInfo.phoneWithCode}` : 'No phone'})
              </p>
            </div>
          </div>

          <div className="space-y-3 text-xs text-gray-700 bg-gray-50 p-4 rounded-xl border border-gray-200">
            <div className="flex items-start gap-2">
              <span className="font-bold text-emerald-600 mt-0.5">✓</span>
              <span><strong>Official PDF Downloaded:</strong> <code className="bg-white px-1.5 py-0.5 rounded border border-gray-300 text-gray-800 font-mono text-[11px] font-bold">{lastPdfInfo?.fileName}</code> is saved on your device.</span>
            </div>
            <div className="flex items-start gap-2">
              <span className="font-bold text-emerald-600 mt-0.5">✓</span>
              <span><strong>WhatsApp Message Prefilled:</strong> Official SPC Solar greeting and direct document link (pricing details hidden).</span>
            </div>
            <div className="p-3 bg-blue-50 border border-blue-200 rounded-xl space-y-1.5 text-blue-950">
              <div className="font-bold flex items-center gap-1.5 text-blue-900 text-xs">
                <span>📎</span> How to send the PDF document below your message:
              </div>
              <p className="text-[11.5px] leading-relaxed text-blue-800">
                In WhatsApp Web, simply <strong>drag and drop</strong> the downloaded PDF file from your browser's download bar directly onto the WhatsApp chat, or click the <strong>📎 (Attach &gt; Document)</strong> icon to send it right below your message!
              </p>
            </div>
          </div>

          {lastPdfInfo?.publicUrl && (
            <div className="text-xs space-y-1">
              <span className="text-gray-500 font-medium">Direct PDF Link:</span>
              <div className="flex items-center gap-2 bg-gray-100 p-2 rounded-lg border border-gray-200 font-mono text-[11px] text-blue-700 truncate">
                <span className="truncate flex-1">{lastPdfInfo.publicUrl}</span>
                <button
                  type="button"
                  onClick={() => {
                    navigator.clipboard.writeText(lastPdfInfo.publicUrl);
                    toast.success('PDF link copied!');
                  }}
                  className="text-gray-600 hover:text-black font-sans text-xs px-2 py-0.5 bg-white border border-gray-300 rounded shadow-xs"
                >
                  Copy
                </button>
              </div>
            </div>
          )}

          <div className="flex flex-wrap items-center justify-end gap-2 pt-3 border-t border-gray-200">
            <button
              type="button"
              onClick={() => {
                if (lastPdfInfo?.message) {
                  navigator.clipboard.writeText(lastPdfInfo.message);
                  toast.success('Message text copied!');
                }
              }}
              className="px-3 py-2 text-xs font-bold text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg flex items-center gap-1.5 transition-colors"
            >
              <FiCopy size={13} /> Copy Message
            </button>

            <button
              type="button"
              onClick={() => {
                if (lastPdfInfo?.pdf) {
                  lastPdfInfo.pdf.save(lastPdfInfo.fileName);
                  toast.success('PDF downloaded again!');
                }
              }}
              className="px-3 py-2 text-xs font-bold text-blue-700 bg-blue-50 hover:bg-blue-100 rounded-lg flex items-center gap-1.5 transition-colors"
            >
              <FiDownload size={13} /> Download PDF Again
            </button>

            <button
              type="button"
              onClick={() => {
                if (lastPdfInfo?.phoneWithCode) {
                  window.open(`https://wa.me/${lastPdfInfo.phoneWithCode}?text=${encodeURIComponent(lastPdfInfo.message)}`, '_blank');
                }
              }}
              className="px-4 py-2 text-xs font-bold text-white bg-green-600 hover:bg-green-700 rounded-lg flex items-center gap-1.5 transition-colors shadow-xs"
            >
              <FaWhatsapp size={14} /> Open WhatsApp
            </button>

            <button
              type="button"
              onClick={() => setWhatsAppModalOpen(false)}
              className="px-3 py-2 text-xs font-bold text-gray-600 hover:text-gray-900 rounded-lg"
            >
              Close
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default AdminQuotationMaker;
