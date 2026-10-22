import React, { useState, useEffect } from 'react';
import SEOHead from '../../components/ui/SEOHead';
import { getBreadcrumbSchema } from '../../components/seo/schemas';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import Card from '../../components/ui/Card';
import Modal from '../../components/ui/Modal';
import api from '../../services/api';
import toast from 'react-hot-toast';
import { usePreload } from '../../context/PreloadContext';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import { 
  FiZap, 
  FiGrid, 
  FiShield, 
  FiStar, 
  FiInfo, 
  FiCheckCircle, 
  FiArrowRight, 
  FiDownload, 
  FiAward,
  FiTrendingUp,
  FiMapPin,
  FiHome,
  FiBriefcase,
  FiSliders,
  FiPercent,
  FiDollarSign,
  FiPhoneCall,
  FiCpu,
  FiLock,
  FiGift
} from 'react-icons/fi';
import { FaWhatsapp } from 'react-icons/fa';
import PageHero from '../../components/ui/PageHero';
import { useUserAuth } from '../../context/UserAuthContext';
import LeadCaptureModal from '../../components/layout/LeadCaptureModal';

const BILL_PRESETS = [2500, 5000, 7500, 10000, 15000, 25000];

const TAMIL_NADU_DISTRICTS = [
  'Coimbatore', 'Chennai', 'Madurai', 'Tirupur', 'Salem', 'Erode', 
  'Trichy', 'Dindigul', 'Thanjavur', 'Vellore', 'Tirunelveli', 'Kanchipuram'
];

const QuotationPage = () => {
  const { preloadedData } = usePreload();
  const [loadingConfig, setLoadingConfig] = useState(() => !preloadedData?.calculatorConfig);
  const [calculating, setCalculating] = useState(false);

  // Admin Configuration Defaults
  const [publicConfig, setPublicConfig] = useState(() => preloadedData?.calculatorConfig || {
    minBillAmount: 500,
    maxBillAmount: 50000,
    defaultBillAmount: 6900,
    baseTariff: 8.5,
    roofAreaSqFtPerKW: 60,
    guaranteeBadgeText: '30-Year Performance Warranty with Comprehensive Net Metering & Support',
    disclaimerText: 'Estimates are based on average solar irradiance in Tamil Nadu and PM Surya Ghar Muft Bijli Yojana guidelines.'
  });

  // User Inputs
  const [pincodeInput, setPincodeInput] = useState('641101');
  const [cityLocation, setCityLocation] = useState('Coimbatore');
  const [propertyType, setPropertyType] = useState('Residential');
  const [roofType, setRoofType] = useState('RCC Flat Roof');
  const [billValue, setBillValue] = useState(() => preloadedData?.calculatorConfig?.defaultBillAmount || 6900);
  const [customBillInput, setCustomBillInput] = useState(() => preloadedData?.calculatorConfig?.defaultBillAmount || 6900);

  // Calculated Results
  const [calcResult, setCalcResult] = useState(null);

  // Unlocked state (via LeadCaptureModal or UserAuth)
  const [unlockedLead, setUnlockedLead] = useState(() => {
    try {
      const saved = localStorage.getItem('spc_unlocked_lead');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  const { user, isUserLoggedIn, logout: userLogout } = useUserAuth();
  const [isLeadCaptureOpen, setIsLeadCaptureOpen] = useState(false);
  const isPriceUnlocked = Boolean(isUserLoggedIn || unlockedLead);

  // Lead / Consultation Modal State
  const [isConsultModalOpen, setIsConsultModalOpen] = useState(false);
  const [leadForm, setLeadForm] = useState({
    name: '',
    phone: '',
    email: '',
    location: 'Coimbatore',
    state: 'Tamil Nadu'
  });
  const [submittingLead, setSubmittingLead] = useState(false);
  const [leadSuccess, setLeadSuccess] = useState(false);

  useEffect(() => {
    if (preloadedData?.calculatorConfig) {
      setPublicConfig(preloadedData.calculatorConfig);
      setLoadingConfig(false);
      return;
    }
    fetchPublicConfig();
  }, [preloadedData?.calculatorConfig]);

  const fetchPublicConfig = async () => {
    try {
      const res = await api.get('/solar-calculator/config');
      if (res.data?.config) {
        setPublicConfig(res.data.config);
        if (res.data.config.defaultBillAmount) {
          setBillValue(res.data.config.defaultBillAmount);
          setCustomBillInput(res.data.config.defaultBillAmount);
        }
      }
    } catch (error) {
      console.error('Failed to load public config:', error);
    } finally {
      setLoadingConfig(false);
    }
  };

  // Run Realtime Calculation on Input Change
  useEffect(() => {
    const timer = setTimeout(() => {
      runCalculation();
    }, 250); // debounced live calculation
    return () => clearTimeout(timer);
  }, [billValue, pincodeInput, cityLocation, propertyType, roofType]);

  const runCalculation = async () => {
    setCalculating(true);
    try {
      const res = await api.post('/solar-calculator/calculate', {
        monthlyBill: Number(billValue) || 6900,
        pincode: pincodeInput,
        city: cityLocation,
        propertyType,
        roofType
      });
      setCalcResult(res.data);
    } catch (error) {
      console.error('Calculation error:', error);
    } finally {
      setCalculating(false);
    }
  };

  const handleSliderChange = (val) => {
    setBillValue(val);
    setCustomBillInput(val);
  };

  const handleCustomBillChange = (val) => {
    const num = Number(val) || 0;
    setCustomBillInput(val);
    if (num >= 100) {
      setBillValue(num);
    }
  };

  const handleLeadSubmit = async (e) => {
    e.preventDefault();
    if (!leadForm.name || !leadForm.phone) {
      toast.error('Please provide your name and phone number');
      return;
    }

    setSubmittingLead(true);
    try {
      await api.post('/solar-calculator/leads', {
        ...leadForm,
        monthlyBill: billValue,
        propertyType,
        roofType,
        calculationResult: calcResult,
        netCost: calcResult?.netCost,
      });
      setLeadSuccess(true);
      toast.success('Your free consultation request has been submitted!');
    } catch (error) {
      toast.error('Failed to submit consultation request');
    } finally {
      setSubmittingLead(false);
    }
  };

  const generatePDF = () => {
    if (!calcResult) return;
    if (!isPriceUnlocked) {
      toast('Please request a quote to unlock and download your PDF quotation', { icon: '🎁' });
      setIsLeadCaptureOpen(true);
      return;
    }
    const doc = new jsPDF();
    
    // Header Banner in Signature SPC Solar Red
    doc.setFillColor(220, 38, 38);
    doc.rect(0, 0, 210, 30, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(20);
    doc.setFont("helvetica", "bold");
    doc.text("SPC SOLAR - QUOTATION ESTIMATE", 105, 18, { align: 'center' });
    doc.setFontSize(9);
    doc.setFont("helvetica", "normal");
    doc.text("PM Surya Ghar Muft Bijli Yojana Authorized Channel Partner", 105, 25, { align: 'center' });
    
    // Customer & System Overview
    doc.setTextColor(30, 41, 59);
    doc.setFontSize(10);
    doc.setFont("helvetica", "bold");
    doc.text(`Customer Name: ${leadForm.name || 'Valued Customer'}`, 15, 42);
    doc.text(`City / Pincode: ${cityLocation} (${pincodeInput})`, 15, 48);
    doc.text(`Property & Roof Type: ${propertyType} | ${roofType}`, 15, 54);
    doc.text(`Monthly Electricity Bill: Rs. ${Number(billValue).toLocaleString()}`, 15, 60);

    doc.text(`Date: ${new Date().toLocaleDateString('en-IN')}`, 145, 42);
    doc.text(`Contact: +91 90254 62326`, 145, 48);
    doc.text(`Email: contact@spcsolar.com`, 145, 54);

    const pdfTableBody = [
      ['Recommended Solar System Size', `${calcResult.systemSizeKW} kW`],
      ['Required Shadow-Free Roof Area', `${calcResult.requiredRoofArea} sq. ft.`],
      ['Solar Hardware Configuration', `${calcResult.panelCount} × ${calcResult.panelWattage}W Tier-1 Mono PERC Bi-facial Panels`],
      ['Estimated Monthly Solar Savings', `Rs. ${calcResult.monthlySavings?.toLocaleString()}`],
      ['Estimated Yearly Solar Savings', `Rs. ${calcResult.yearlySavings?.toLocaleString()}`],
      ['Estimated 25-Year Lifetime Savings', `Rs. ${calcResult.lifetimeSavings?.toLocaleString()}`],
      ['Turnkey Project Cost (Gross)', `Rs. ${calcResult.estimatedCost?.toLocaleString()}`],
      ['PM Surya Ghar Central Subsidy (Govt. Rebate)', `- Rs. ${calcResult.centralSubsidy?.toLocaleString()}`],
      ['Net Customer Investment (After Subsidy)', `Rs. ${calcResult.netCost?.toLocaleString()}`],
      ['Estimated Payback Period (ROI)', `${calcResult.roiYears} Years`],
      ['Annual CO2 Offset / Trees Planted', `${calcResult.co2ReducedTons} Metric Tons / ${calcResult.treesPlanted} Trees`],
    ];

    doc.autoTable({
      startY: 68,
      head: [['System Parameter & Specification', 'Estimated Value']],
      body: pdfTableBody,
      headStyles: { 
        fillColor: [220, 38, 38],
        textColor: [255, 255, 255],
        fontStyle: 'bold'
      },
      alternateRowStyles: { fillColor: [248, 250, 252] },
      styles: { fontSize: 9.5, cellPadding: 4 }
    });

    doc.setFontSize(8);
    doc.setTextColor(100, 116, 139);
    const disclaimer = calcResult.disclaimer || publicConfig.disclaimerText;
    doc.text(doc.splitTextToSize(`Disclaimer: ${disclaimer}`, 180), 15, doc.lastAutoTable.finalY + 14);
    
    doc.save(`SPC_Solar_Quotation_${(leadForm.name || cityLocation).replace(/\s+/g, '_')}.pdf`);
  };

  const openWhatsApp = () => {
    if (!calcResult) return;
    const msg = `*Hello SPC Solar!* ☀️
I checked my customized solar quotation on your website:
    
📍 *City / Pincode:* ${cityLocation} (${pincodeInput})
🏠 *Property / Roof:* ${propertyType} (${roofType})
⚡ *Current Monthly Bill:* ₹${Number(billValue).toLocaleString()}
🔆 *Recommended System:* ${calcResult.systemSizeKW} kW (${calcResult.requiredRoofArea} sq. ft.)
💰 *Turnkey Cost:* ₹${calcResult.estimatedCost?.toLocaleString()}
🎁 *PM Surya Ghar Subsidy:* ₹${calcResult.centralSubsidy?.toLocaleString()}
🏷️ *Net Investment:* ₹${calcResult.netCost?.toLocaleString()}
📈 *25-Year Savings:* ₹${calcResult.lifetimeSavings?.toLocaleString()}

Please arrange a *Free Site Survey* for my premises!`;

    window.open(`https://wa.me/919025462326?text=${encodeURIComponent(msg)}`, '_blank');
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] pb-32 text-gray-900 font-sans">
      <SEOHead
        title="Solar Calculator & Instant Quotation Coimbatore | SPC Solar"
        description="Calculate rooftop solar requirements, required roof area, upfront cost, ₹78,000 PM Surya Ghar subsidy, and 25-year return on investment for Tamil Nadu homes & businesses."
        canonical="/quotation"
        keywords={[
          'solar calculator coimbatore',
          'solar quotation tamil nadu',
          'solar rooftop cost estimator',
          'pm surya ghar subsidy calculator',
          'best solar price coimbatore',
          'commercial solar savings calculator'
        ]}
        schema={[
          getBreadcrumbSchema([
            { label: 'Solar Calculator & Quotation', to: '/quotation' }
          ])
        ]}
      />

      {/* Hero Header */}
      <PageHero
        label="SOLAR ESTIMATOR"
        title="CALCULATE YOUR SOLAR "
        highlight="SAVINGS"
        subtitle="Discover your required capacity, government subsidy, and estimated 25-year lifetime return on investment in seconds."
        breadcrumbs={[{ label: 'Solar Calculator' }]}
      />

      {/* Main Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 sm:pt-8 pb-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* ======================================================== */}
          {/* LEFT COLUMN: User Inputs & Customizations (5 Cols) */}
          {/* ======================================================== */}
          <div className="lg:col-span-5 space-y-6">
            
            {/* Card 1: Electricity Consumption Slider & Presets */}
            <div className="bg-white p-4 sm:p-7 rounded-xl sm:rounded-2xl shadow-card border border-gray-200/90 space-y-4 sm:space-y-6">
              <div className="flex items-center justify-between border-b border-gray-100 pb-2.5 sm:pb-3">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-red/10 text-red flex items-center justify-center font-bold">
                    <FiDollarSign className="w-4 h-4 sm:w-4.5 sm:h-4.5" />
                  </div>
                  <h3 className="font-heading font-bold text-gray-900 text-base sm:text-lg">
                    Monthly Electricity Bill
                  </h3>
                </div>
                <div className="flex items-center space-x-1 bg-gray-50 border border-gray-200 px-2.5 py-1 sm:px-3 sm:py-1.5 rounded-lg sm:rounded-xl shadow-xs">
                  <span className="text-red font-bold text-xs sm:text-sm">₹</span>
                  <input
                    type="number"
                    value={customBillInput}
                    onChange={(e) => handleCustomBillChange(e.target.value)}
                    className="w-20 sm:w-24 bg-transparent text-right font-heading font-bold text-gray-900 text-base sm:text-base outline-none"
                    aria-label="Monthly electricity bill"
                  />
                </div>
              </div>

              {/* Range Slider with Red Accent */}
              <div className="space-y-1.5 sm:space-y-2">
                <div className="relative pt-2 pb-1.5 sm:pt-3 sm:pb-2">
                  <input
                    type="range"
                    min={publicConfig.minBillAmount || 500}
                    max={publicConfig.maxBillAmount || 50000}
                    step="100"
                    value={billValue}
                    onChange={(e) => handleSliderChange(Number(e.target.value))}
                    className="w-full h-2.5 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-red hover:accent-red-700 transition-all"
                  />
                </div>
                <div className="flex justify-between text-[11px] sm:text-xs text-gray-400 font-medium">
                  <span>Min ₹{(publicConfig.minBillAmount || 500).toLocaleString()}</span>
                  <span>Max ₹{(publicConfig.maxBillAmount || 50000).toLocaleString()}</span>
                </div>
              </div>

              {/* Quick Select Preset Pills */}
              <div>
                <label className="block text-[10px] sm:text-[11px] font-bold uppercase tracking-wider text-gray-400 mb-1.5 sm:mb-2">
                  Quick Select Amount
                </label>
                <div className="grid grid-cols-3 sm:grid-cols-3 gap-1.5 sm:gap-2">
                  {BILL_PRESETS.map((preset) => (
                    <button
                      key={preset}
                      type="button"
                      onClick={() => handleSliderChange(preset)}
                      className={`py-1.5 px-1 sm:py-2 sm:px-2 text-[11px] sm:text-xs font-bold rounded-lg sm:rounded-xl transition-all border ${
                        billValue === preset
                          ? 'bg-red text-white border-red shadow-sm'
                          : 'bg-gray-50 text-gray-700 border-gray-200 hover:bg-gray-100'
                      }`}
                    >
                      ₹{preset.toLocaleString()}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Card 2: Location, Property Type & Roof Structure */}
            <div className="bg-white p-4 sm:p-7 rounded-xl sm:rounded-2xl shadow-card border border-gray-200/90 space-y-4 sm:space-y-5">
              <div className="flex items-center gap-2 border-b border-gray-100 pb-2.5 sm:pb-3">
                <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-gray-100 text-gray-800 flex items-center justify-center font-bold">
                  <FiMapPin className="w-4 h-4 sm:w-4.5 sm:h-4.5" />
                </div>
                <h3 className="font-heading font-bold text-gray-900 text-base sm:text-lg">
                  Location & Premises
                </h3>
              </div>

              {/* City & Pincode */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 sm:gap-3">
                <div>
                  <label className="block text-[11px] sm:text-xs font-bold uppercase tracking-wider text-gray-600 mb-1 sm:mb-1.5">
                    District / City
                  </label>
                  <select
                    value={cityLocation}
                    onChange={(e) => setCityLocation(e.target.value)}
                    className="w-full border border-gray-300 p-2 sm:p-2.5 rounded-lg sm:rounded-xl text-base sm:text-sm focus:outline-none focus:border-red bg-white cursor-pointer shadow-xs font-medium"
                  >
                    {TAMIL_NADU_DISTRICTS.map(dist => (
                      <option key={dist} value={dist}>{dist}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-[11px] sm:text-xs font-bold uppercase tracking-wider text-gray-600 mb-1 sm:mb-1.5">
                    Pincode
                  </label>
                  <input
                    type="text"
                    value={pincodeInput}
                    onChange={(e) => setPincodeInput(e.target.value)}
                    placeholder="e.g. 641101"
                    className="w-full border border-gray-300 p-2 sm:p-2.5 rounded-lg sm:rounded-xl text-base sm:text-sm focus:outline-none focus:border-red bg-white shadow-xs font-medium"
                  />
                </div>
              </div>

              {/* Property Type Selection */}
              <div>
                <label className="block text-[11px] sm:text-xs font-bold uppercase tracking-wider text-gray-600 mb-1.5 sm:mb-2">
                  Connection / Property Type
                </label>
                <div className="grid grid-cols-3 gap-1.5 sm:gap-2">
                  {[
                    { id: 'Residential', label: 'Residential', tag: 'Subsidy' },
                    { id: 'Commercial', label: 'Commercial', tag: 'Tax Benefit' },
                    { id: 'Industrial', label: 'Industrial', tag: 'High ROI' }
                  ].map(item => (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => setPropertyType(item.id)}
                      className={`p-2 sm:p-2.5 text-center rounded-lg sm:rounded-xl border transition-all relative ${
                        propertyType === item.id
                          ? 'border-red bg-red/5 text-red font-bold shadow-xs'
                          : 'border-gray-200 bg-gray-50/50 hover:bg-gray-100 text-gray-700 font-medium'
                      }`}
                    >
                      <span className="block text-[11px] sm:text-xs truncate">{item.label}</span>
                      <span className={`inline-block text-[8px] sm:text-[9px] font-bold uppercase px-1 sm:px-1.5 py-0.2 rounded mt-0.5 ${
                        propertyType === item.id ? 'bg-red text-white' : 'bg-gray-200 text-gray-600'
                      }`}>
                        {item.tag}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Roof Type Selection */}
              <div>
                <label className="block text-[11px] sm:text-xs font-bold uppercase tracking-wider text-gray-600 mb-1.5 sm:mb-2">
                  Roof Structure
                </label>
                <div className="grid grid-cols-3 gap-1.5 sm:gap-2 text-[11px] sm:text-xs">
                  {['RCC Flat Roof', 'Metal Shed', 'Tiled Sloped'].map(roof => (
                    <button
                      key={roof}
                      type="button"
                      onClick={() => setRoofType(roof)}
                      className={`p-1.5 sm:p-2 rounded-lg sm:rounded-xl border transition-all text-center truncate ${
                        roofType === roof
                          ? 'border-black bg-black text-white font-bold shadow-xs'
                          : 'border-gray-200 bg-gray-50/50 hover:bg-gray-100 text-gray-700 font-medium'
                      }`}
                    >
                      {roof}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Card 3: Trust & Guarantee Highlights */}
            <div className="bg-linear-to-br from-gray-900 to-black text-white p-5 rounded-2xl shadow-card space-y-3">
              <div className="flex items-center gap-2 text-amber-400 font-bold text-sm">
                <FiAward size={18} />
                <span>Authorized Vendor Assurance</span>
              </div>
              <ul className="space-y-2 text-xs text-gray-300">
                <li className="flex items-center gap-2">
                  <FiCheckCircle className="text-emerald-400 shrink-0" />
                  <span>PM Surya Ghar subsidy processed directly to your account</span>
                </li>
                <li className="flex items-center gap-2">
                  <FiCheckCircle className="text-emerald-400 shrink-0" />
                  <span>30-Year Linear Power Warranty on Bifacial Modules</span>
                </li>
                <li className="flex items-center gap-2">
                  <FiCheckCircle className="text-emerald-400 shrink-0" />
                  <span>End-to-end TANGEDCO Net Metering liaisoning support</span>
                </li>
              </ul>
            </div>

          </div>

          {/* ======================================================== */}
          {/* RIGHT COLUMN: Calculated Intelligence & Outputs (7 Cols) */}
          {/* ======================================================== */}
          <div className="lg:col-span-7 space-y-6">

            {/* Top Recommended Capacity & Space Dual Banner */}
            <div className="bg-white rounded-xl sm:rounded-2xl shadow-card border border-gray-200/90 overflow-hidden">
              <div className="bg-black text-white px-4 py-3 sm:px-6 sm:py-4 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 sm:w-2.5 sm:h-2.5 rounded-full bg-red animate-pulse"></span>
                  <h3 className="font-heading font-bold text-xs sm:text-base tracking-wide uppercase">
                    Recommended Solar System
                  </h3>
                </div>
                <span className="text-[10px] sm:text-[11px] font-bold bg-white/15 px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-full text-white font-accent">
                  Customized for ₹{Number(billValue).toLocaleString()}/mo
                </span>
              </div>

              <div className="p-4 sm:p-7 space-y-4 sm:space-y-6">
                {calcResult ? (
                  <div className="grid grid-cols-2 sm:grid-cols-2 gap-2.5 sm:gap-4">
                    
                    {/* Stat 1: System Size */}
                    <div className="bg-red/5 border border-red/20 rounded-xl sm:rounded-2xl p-3 sm:p-5 flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-4 transition-all hover:border-red/40">
                      <div className="w-9 h-9 sm:w-14 sm:h-14 rounded-lg sm:rounded-2xl bg-red text-white flex items-center justify-center shrink-0 shadow-xs sm:shadow-md">
                        <FiZap className="w-4 h-4 sm:w-7 sm:h-7" />
                      </div>
                      <div className="min-w-0 w-full">
                        <span className="text-[10px] sm:text-xs font-bold uppercase tracking-wider text-gray-500 block truncate">
                          Required Capacity
                        </span>
                        <div className="text-lg sm:text-2xl md:text-3xl font-heading font-black text-gray-900 leading-tight">
                          {calcResult.systemSizeKW} <span className="text-sm sm:text-lg font-bold text-red">kW</span>
                        </div>
                        <span className="text-[9px] sm:text-[11px] text-gray-500 font-medium truncate block">
                          {calcResult.panelCount} × {calcResult.panelWattage}W Bifacial
                        </span>
                      </div>
                    </div>

                    {/* Stat 2: Roof Area */}
                    <div className="bg-gray-50 border border-gray-200/80 rounded-xl sm:rounded-2xl p-3 sm:p-5 flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-4 transition-all hover:border-gray-300">
                      <div className="w-9 h-9 sm:w-14 sm:h-14 rounded-lg sm:rounded-2xl bg-black text-white flex items-center justify-center shrink-0 shadow-xs sm:shadow-md">
                        <FiGrid className="w-4 h-4 sm:w-7 sm:h-7" />
                      </div>
                      <div className="min-w-0 w-full">
                        <span className="text-[10px] sm:text-xs font-bold uppercase tracking-wider text-gray-500 block truncate">
                          Roof Area
                        </span>
                        <div className="text-lg sm:text-2xl md:text-3xl font-heading font-black text-gray-900 leading-tight">
                          {calcResult.requiredRoofArea} <span className="text-xs sm:text-lg font-bold text-gray-600">sq.ft.</span>
                        </div>
                        <span className="text-[9px] sm:text-[11px] text-gray-500 font-medium truncate block">
                          For {roofType}
                        </span>
                      </div>
                    </div>

                  </div>
                ) : (
                  <div className="py-8 text-center text-gray-400">
                    <div className="w-8 h-8 border-2 border-red border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
                    <p className="text-xs">Computing optimal solar capacity...</p>
                  </div>
                )}

                {/* Subtext info */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 text-[11px] sm:text-xs text-gray-500 pt-1 border-t border-gray-100">
                  <span>Need help evaluating complex roof profiles?</span>
                  <button
                    onClick={() => setIsConsultModalOpen(true)}
                    className="text-red font-bold hover:underline inline-flex items-center gap-1"
                  >
                    Request Free Roof Inspection <FiArrowRight size={12} />
                  </button>
                </div>
              </div>
            </div>

            {/* Savings Projections (Monthly / Yearly / 25Y Lifetime) */}
            {calcResult && (
              <div className="bg-white rounded-xl sm:rounded-2xl shadow-card border border-gray-200/90 p-4 sm:p-7 space-y-4 sm:space-y-5">
                <div className="flex items-center justify-between border-b border-gray-100 pb-2.5 sm:pb-3">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
                      <FiTrendingUp className="w-4 h-4 sm:w-4.5 sm:h-4.5" />
                    </div>
                    <h3 className="font-heading font-bold text-gray-900 text-base sm:text-lg">
                      Solar Savings Forecast
                    </h3>
                  </div>
                  <span className="text-[10px] sm:text-xs font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-md border border-emerald-200">
                    Up to 90% Bill Cut
                  </span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 sm:gap-3">
                  {/* Monthly */}
                  <div className="bg-gray-50 rounded-lg sm:rounded-xl p-2.5 sm:p-4 text-center border border-gray-200/60">
                    <span className="text-[10px] sm:text-xs font-bold text-gray-500 uppercase tracking-wider block mb-0.5 sm:mb-1">
                      Monthly Savings
                    </span>
                    <span className="text-base sm:text-2xl font-heading font-extrabold text-gray-900">
                      ₹{calcResult.monthlySavings?.toLocaleString()}
                    </span>
                  </div>

                  {/* Yearly */}
                  <div className="bg-gray-50 rounded-lg sm:rounded-xl p-2.5 sm:p-4 text-center border border-gray-200/60">
                    <span className="text-[10px] sm:text-xs font-bold text-gray-500 uppercase tracking-wider block mb-0.5 sm:mb-1">
                      Yearly Savings
                    </span>
                    <span className="text-base sm:text-2xl font-heading font-extrabold text-gray-900">
                      ₹{calcResult.yearlySavings?.toLocaleString()}
                    </span>
                  </div>

                  {/* 25-Year Lifetime */}
                  <div className="col-span-2 sm:col-span-1 bg-linear-to-br from-red/10 to-red/5 rounded-lg sm:rounded-xl p-2.5 sm:p-4 text-center border border-red/30 shadow-xs">
                    <span className="text-[10px] sm:text-xs font-bold text-red uppercase tracking-wider block mb-0.5 sm:mb-1">
                      25-Year Lifetime Savings
                    </span>
                    <span className="text-lg sm:text-2xl font-heading font-black text-red">
                      ₹{calcResult.lifetimeSavings?.toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>
            )}

            {/* Turnkey Financial & Subsidy Breakdown */}
            {calcResult && (
              <div className="bg-white rounded-xl sm:rounded-2xl shadow-card border border-gray-200/90 overflow-hidden relative">
                <div className="p-4 sm:p-7 space-y-4 sm:space-y-5">
                  <div className="flex items-center justify-between border-b border-gray-100 pb-2.5 sm:pb-3">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-red/10 text-red flex items-center justify-center font-bold">
                        <FiPercent className="w-4 h-4 sm:w-4.5 sm:h-4.5" />
                      </div>
                      <h3 className="font-heading font-bold text-gray-900 text-base sm:text-lg">
                        Turnkey Investment & PM Surya Ghar Subsidy
                      </h3>
                    </div>

                    {/* Unlock Status Pill */}
                    {isPriceUnlocked ? (
                      <div className="flex items-center gap-2">
                        <span className="inline-flex items-center gap-1 text-[10px] sm:text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 sm:px-2.5 py-0.5 rounded-full border border-emerald-200">
                          <FiCheckCircle size={12} className="text-emerald-600" />
                          <span className="hidden xs:inline">Unlocked:</span> {unlockedLead?.name?.split(' ')[0] || user?.name?.split(' ')[0] || 'Customer'}
                        </span>
                        <button
                          type="button"
                          onClick={() => {
                            localStorage.removeItem('spc_unlocked_lead');
                            setUnlockedLead(null);
                            if (isUserLoggedIn) userLogout();
                            toast.success('Quotation locked');
                          }}
                          title="Lock quotation"
                          className="text-[10px] font-bold uppercase text-gray-400 hover:text-red transition-colors ml-1 cursor-pointer"
                        >
                          Relock
                        </button>
                      </div>
                    ) : (
                      <button
                        type="button"
                        onClick={() => setIsLeadCaptureOpen(true)}
                        className="inline-flex items-center gap-1 text-[10px] sm:text-[11px] font-bold text-red bg-red/10 hover:bg-red/20 px-2 sm:px-2.5 py-0.5 rounded-full border border-red/20 transition-colors cursor-pointer"
                      >
                        <FiGift size={11} className="text-red" /> Request Quote
                      </button>
                    )}
                  </div>

                  {/* Relative Container for Financial Content + Overlay */}
                  <div className="relative">
                    {/* Numbers blurred when not unlocked */}
                    <div className={`space-y-2.5 sm:space-y-3 text-xs sm:text-sm transition-all duration-300 ${
                      !isPriceUnlocked ? 'filter blur-[7px] select-none pointer-events-none opacity-50' : ''
                    }`}>
                      <div className="flex items-center justify-between text-gray-600">
                        <span>Total Project Cost (Turnkey):</span>
                        <span className="font-bold text-gray-900">₹{calcResult.estimatedCost?.toLocaleString()}</span>
                      </div>

                      <div className="flex items-center justify-between text-emerald-700 bg-emerald-50/70 p-2 sm:p-2.5 rounded-lg sm:rounded-xl border border-emerald-200/80 font-semibold">
                        <span className="flex items-center gap-1 sm:gap-1.5">
                          <FiCheckCircle size={14} /> PM Surya Ghar Subsidy:
                        </span>
                        <span className="font-bold text-emerald-700">- ₹{calcResult.centralSubsidy?.toLocaleString()}</span>
                      </div>

                      <div className="flex items-center justify-between pt-2.5 sm:pt-3 border-t-2 border-dashed border-gray-200">
                        <div>
                          <span className="text-[10px] sm:text-xs font-bold uppercase tracking-wider text-gray-500 block">
                            Net Customer Investment
                          </span>
                          <span className="text-[10px] sm:text-[11px] text-gray-400">After central subsidy deduction</span>
                        </div>
                        <div className="text-right">
                          <span className="text-xl sm:text-3xl font-heading font-black text-red">
                            ₹{calcResult.netCost?.toLocaleString()}
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center justify-between pt-1.5 sm:pt-2 text-[11px] sm:text-xs font-medium text-gray-500">
                        <span>Estimated Return on Investment:</span>
                        <span className="font-bold text-gray-900 bg-gray-100 px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-md border border-gray-200">
                          ⚡ {calcResult.roiYears} Years Payback
                        </span>
                      </div>
                    </div>

                    {/* Frosted Glass Overlay with Request Quotation Button if NOT unlocked */}
                    {!isPriceUnlocked && (
                      <div className="absolute inset-0 z-10 flex flex-col items-center justify-center p-3 sm:p-5 text-center rounded-xl bg-white/40 backdrop-blur-[2px]">
                        <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-red/10 text-red flex items-center justify-center mb-2 shadow-xs">
                          <FiLock className="w-5 h-5 sm:w-5.5 sm:h-5.5" />
                        </div>
                        <h4 className="font-heading font-extrabold text-gray-900 text-sm sm:text-base leading-tight mb-1">
                          Request Quotation to Reveal Price
                        </h4>
                        <p className="text-gray-500 text-[11px] sm:text-xs max-w-xs mb-3.5 leading-snug">
                          Request a quote to get up to <span className="text-amber-600 font-bold">₹1,000 offer</span> and reveal your exact turnkey cost, PM Surya Ghar subsidy, and net investment.
                        </p>
                        <button
                          type="button"
                          onClick={() => setIsLeadCaptureOpen(true)}
                          className="px-6 py-2.5 sm:py-3 bg-red hover:bg-red-700 text-white font-heading font-bold text-xs sm:text-sm rounded-xl shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 active:scale-95 cursor-pointer"
                        >
                          <FiGift size={16} className="text-amber-300 animate-pulse" />
                          <span>Request Quote to View Price</span>
                        </button>
                      </div>
                    )}
                  </div>
                </div>

                {/* Eco Sustainability Footprint Footer */}
                <div className="bg-gray-50/90 px-4 py-3 sm:px-6 sm:py-4 border-t border-gray-200/80 flex flex-wrap items-center justify-between gap-2 sm:gap-3 text-[11px] sm:text-xs">
                  <div className="flex items-center gap-1.5 sm:gap-2 text-gray-700">
                    <span className="font-bold">CO₂ Offset:</span>
                    <span className="bg-emerald-100 text-emerald-800 font-bold px-1.5 py-0.5 sm:px-2 rounded">
                      {calcResult.co2ReducedTons} Tons/Year
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5 sm:gap-2 text-gray-700">
                    <span className="font-bold">Equivalent Trees:</span>
                    <span className="bg-emerald-100 text-emerald-800 font-bold px-1.5 py-0.5 sm:px-2 rounded">
                      🌳 {calcResult.treesPlanted} Trees
                    </span>
                  </div>
                </div>
              </div>
            )}

          </div>

        </div>
      </div>

      {/* ======================================================== */}
      {/* Floating Bottom Action Bar */}
      {/* ======================================================== */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-2 pb-[max(0.75rem,env(safe-area-inset-bottom))] sm:p-4 shadow-2xl z-40 pb-safe">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
          
          <div className="hidden md:flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-red text-white flex items-center justify-center font-bold shadow-xs">
              <FiZap size={20} />
            </div>
            <div>
              <p className="text-sm font-heading font-bold text-gray-900">
                Ready to cut your power bills to zero with SPC Solar?
              </p>
              <p className="text-xs text-gray-500">
                Get free engineering consultation and turnkey subsidy processing.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-1.5 sm:flex sm:items-center sm:space-x-2.5 w-full sm:w-auto">
            {/* Download PDF Button */}
            <button
              type="button"
              onClick={generatePDF}
              className="px-2 py-2 sm:px-4 sm:py-2.5 border border-gray-300 hover:border-gray-400 bg-white hover:bg-gray-50 text-gray-800 font-bold rounded-lg sm:rounded-xl text-[11px] sm:text-sm transition-all flex items-center justify-center gap-1 sm:gap-2 shadow-xs"
            >
              <FiDownload className="text-red w-3.5 h-3.5 sm:w-4 sm:h-4 shrink-0" />
              <span className="truncate">Download PDF</span>
            </button>

            {/* WhatsApp Chat Estimate */}
            <button
              type="button"
              onClick={openWhatsApp}
              className="px-2 py-2 sm:px-4 sm:py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-lg sm:rounded-xl text-[11px] sm:text-sm transition-all flex items-center justify-center gap-1 sm:gap-2 shadow-xs"
            >
              <FaWhatsapp className="w-3.5 h-3.5 sm:w-4 sm:h-4 shrink-0" />
              <span className="truncate">WhatsApp</span>
            </button>

            {/* Book Consultation Modal Trigger */}
            <button
              type="button"
              onClick={() => setIsConsultModalOpen(true)}
              className="bg-red hover:bg-red-700 text-white font-bold px-2 py-2 sm:px-5 sm:py-2.5 rounded-lg sm:rounded-xl text-[11px] sm:text-sm transition-all flex items-center justify-center gap-1 sm:gap-2 shadow-md hover:shadow-lg"
            >
              <span className="truncate">Free Survey</span>
              <FiArrowRight className="w-3.5 h-3.5 sm:w-4 sm:h-4 shrink-0 hidden xs:inline-block" />
            </button>
          </div>

        </div>
      </div>

      {/* ======================================================== */}
      {/* Consultation & Lead Capture Modal */}
      {/* ======================================================== */}
      <Modal 
        isOpen={isConsultModalOpen} 
        onClose={() => setIsConsultModalOpen(false)} 
        title="BOOK A FREE SITE SURVEY & CONSULTATION"
      >
        {leadSuccess ? (
          <div className="text-center py-6 space-y-4">
            <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto shadow-inner">
              <FiCheckCircle size={36} />
            </div>
            <h3 className="text-xl font-heading font-bold text-gray-900">
              CONSULTATION REQUEST RECEIVED!
            </h3>
            <p className="text-sm text-gray-600 max-w-sm mx-auto">
              Thank you, <span className="font-bold text-gray-900">{leadForm.name}</span>. Our solar technical advisor will call you shortly to schedule your free roof assessment.
            </p>
            <div className="flex flex-wrap justify-center gap-3 pt-4 border-t border-gray-100">
              <Button variant="primary" onClick={generatePDF} className="flex items-center gap-2 bg-red hover:bg-red-700 text-white">
                <FiDownload size={16} /> Download PDF Estimate
              </Button>
              <Button variant="outline" onClick={openWhatsApp} className="flex items-center gap-2 text-emerald-600 border-emerald-600 hover:bg-emerald-50">
                <FaWhatsapp size={18} /> Connect on WhatsApp
              </Button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleLeadSubmit} className="space-y-4">
            <div className="bg-red/5 p-3 rounded-xl border border-red/20 text-xs text-gray-700 flex items-center justify-between">
              <div>
                <span className="font-bold text-red block">Selected Configuration:</span>
                <span>{calcResult?.systemSizeKW || 3} kW System in {cityLocation}</span>
              </div>
              <div className="text-right">
                <span className="font-bold text-gray-900 block">Est. Net Cost:</span>
                <span className="font-extrabold text-red">₹{calcResult?.netCost?.toLocaleString()}</span>
              </div>
            </div>

            <Input
              label="Full Name *"
              placeholder="e.g. Ramesh Kumar"
              value={leadForm.name}
              onChange={(e) => setLeadForm({ ...leadForm, name: e.target.value })}
              required
            />
            <Input
              label="Mobile Number *"
              placeholder="+91 9876543210"
              value={leadForm.phone}
              onChange={(e) => setLeadForm({ ...leadForm, phone: e.target.value })}
              required
            />
            <Input
              label="Email Address (Optional)"
              type="email"
              placeholder="ramesh@example.com"
              value={leadForm.email}
              onChange={(e) => setLeadForm({ ...leadForm, email: e.target.value })}
            />
            <Input
              label="Installation City / Area"
              value={leadForm.location}
              onChange={(e) => setLeadForm({ ...leadForm, location: e.target.value })}
            />

            <Button
              type="submit"
              variant="primary"
              disabled={submittingLead}
              className="w-full bg-red hover:bg-red-700 text-white py-3 rounded-xl font-bold text-base shadow-md"
            >
              {submittingLead ? 'Submitting Request...' : 'Confirm Free Site Survey'}
            </Button>
          </form>
        )}
      </Modal>

      {/* Request Quotation Modal to Unlock Pricing */}
      <LeadCaptureModal
        isOpen={isLeadCaptureOpen}
        onClose={() => setIsLeadCaptureOpen(false)}
        onSuccess={(savedLead) => {
          setUnlockedLead(savedLead);
          toast.success('Quotation Unlocked! Special ₹1,000 offer activated.');
        }}
        source="Request Quotation (₹1,000 Offer)"
        calculationData={{
          calcResult,
          billValue,
          propertyType,
          roofType
        }}
      />

    </div>
  );
};

export default QuotationPage;
