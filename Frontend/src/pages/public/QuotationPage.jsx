import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import SEOHead from '../../components/ui/SEOHead';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import Card from '../../components/ui/Card';
import Modal from '../../components/ui/Modal';
import api from '../../services/api';
import toast from 'react-hot-toast';
import { useUserAuth } from '../../context/UserAuthContext';
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
  FiMaximize2, 
  FiAward,
  FiTrendingUp,
  FiGift,
  FiTag
} from 'react-icons/fi';
import { FaWhatsapp } from 'react-icons/fa';

import PageHero from '../../components/ui/PageHero';
import { Reveal } from '../../components/motion';

const QuotationPage = () => {
  const [loadingConfig, setLoadingConfig] = useState(true);
  const [calculating, setCalculating] = useState(false);

  // Admin Configuration Defaults
  const [publicConfig, setPublicConfig] = useState({
    minBillAmount: 500,
    maxBillAmount: 50000,
    defaultBillAmount: 6900,
    baseTariff: 8.5,
    roofAreaSqFtPerKW: 60,
    guaranteeBadgeText: 'We offer 30-year performance warranty with GoodZero™ Solar Protection',
    disclaimerText: 'Figures shown are estimates based on configured parameters.'
  });

  // User Inputs
  const [pincodeInput, setPincodeInput] = useState('641101');
  const [cityLocation, setCityLocation] = useState('Coimbatore');
  const [billValue, setBillValue] = useState(6900);
  const [customBillInput, setCustomBillInput] = useState(6900);

  // Calculated Results
  const [calcResult, setCalcResult] = useState(null);

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
  const { user } = useUserAuth();

  useEffect(() => {
    fetchPublicConfig();
  }, []);

  // Auto-fill consultation form with logged-in user profile
  useEffect(() => {
    if (user) {
      setLeadForm((prev) => ({
        ...prev,
        name: user.name || prev.name,
        email: user.email || prev.email,
        phone: user.phone || prev.phone,
        location: user.address?.city || prev.location,
        state: user.address?.state || prev.state,
      }));
      if (user.address?.city) {
        setCityLocation(user.address.city);
      }
    }
  }, [user]);

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
  }, [billValue, pincodeInput]);

  const runCalculation = async () => {
    setCalculating(true);
    try {
      const res = await api.post('/solar-calculator/calculate', {
        monthlyBill: Number(billValue) || 6900,
        pincode: pincodeInput,
        city: cityLocation
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

  const userCoupon = user?.coupon?.status === 'Active' ? user.coupon : null;
  const couponDiscount = userCoupon ? (userCoupon.discountAmount || 1000) : 0;
  const finalNetCost = calcResult ? Math.max(0, (calcResult.netCost || 0) - couponDiscount) : 0;

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
        calculationResult: calcResult,
        appliedCoupon: userCoupon ? { code: userCoupon.code, discountAmount: couponDiscount } : undefined,
        couponDiscount: couponDiscount,
        netCost: userCoupon ? finalNetCost : calcResult?.netCost,
      });
      setLeadSuccess(true);
      toast.success('Your free consultation request has been submitted with your welcome voucher!');
    } catch (error) {
      toast.error('Failed to submit consultation request');
    } finally {
      setSubmittingLead(false);
    }
  };

  const generatePDF = () => {
    if (!calcResult) return;
    const doc = new jsPDF();
    
    // Header
    doc.setFillColor(37, 99, 235); // Blue Accent
    doc.rect(0, 0, 210, 28, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(20);
    doc.setFont("helvetica", "bold");
    doc.text("SOLAR SAVINGS ESTIMATE", 105, 18, { align: 'center' });
    
    // Info
    doc.setTextColor(10, 10, 10);
    doc.setFontSize(11);
    doc.text(`Customer Name: ${leadForm.name || 'Valued Customer'}`, 15, 38);
    doc.text(`City / Pincode: ${cityLocation} (${pincodeInput})`, 15, 44);
    doc.text(`Monthly Electricity Bill: Rs. ${billValue.toLocaleString()}`, 15, 50);
    doc.text(`Date: ${new Date().toLocaleDateString()}`, 145, 38);

    const pdfTableBody = [
      ['Required System Size', `${calcResult.systemSizeKW} kW`],
      ['Required Roof Area', `${calcResult.requiredRoofArea} sq. ft.`],
      ['Panel Configuration', `${calcResult.panelCount} × ${calcResult.panelWattage}W Tier 1 Panels`],
      ['Estimated Monthly Solar Savings', `Rs. ${calcResult.monthlySavings?.toLocaleString()}`],
      ['Estimated Yearly Solar Savings', `Rs. ${calcResult.yearlySavings?.toLocaleString()}`],
      ['Estimated 25-Year Lifetime Savings', `Rs. ${calcResult.lifetimeSavings?.toLocaleString()}`],
      ['Turnkey Investment Cost', `Rs. ${calcResult.estimatedCost?.toLocaleString()}`],
      ['PM Surya Ghar Subsidy', `- Rs. ${calcResult.centralSubsidy?.toLocaleString()}`],
    ];

    if (userCoupon) {
      pdfTableBody.push([
        'Welcome Installation Voucher',
        `- Rs. ${couponDiscount.toLocaleString()} (Voucher: ${userCoupon.code})`
      ]);
      pdfTableBody.push([
        'Net Cost to Customer',
        `Rs. ${finalNetCost.toLocaleString()} (After Subsidy & Installation Voucher)`
      ]);
    } else {
      pdfTableBody.push([
        'Net Cost to Customer',
        `Rs. ${calcResult.netCost?.toLocaleString()}`
      ]);
    }

    pdfTableBody.push(['Estimated Payback (ROI)', `${calcResult.roiYears} Years`]);

    doc.autoTable({
      startY: 58,
      head: [['System Parameter', 'Specification Output']],
      body: pdfTableBody,
      headStyles: { fillColor: [37, 99, 235] },
      alternateRowStyles: { fillColor: [245, 247, 250] }
    });

    doc.setFontSize(8);
    doc.setTextColor(120, 120, 120);
    doc.text(doc.splitTextToSize(calcResult.disclaimer || publicConfig.disclaimerText, 180), 15, doc.lastAutoTable.finalY + 15);
    
    doc.save(`SPC_Solar_Savings_${(leadForm.name || 'Estimate').replace(/\s+/g, '_')}.pdf`);
  };

  const openWhatsApp = () => {
    if (!calcResult) return;
    const msg = `Hello SPC Solar! I calculated my solar savings on your website:
    
*City/Pincode:* ${cityLocation} (${pincodeInput})
*Monthly Electricity Bill:* ₹${billValue.toLocaleString()}
*Required System Size:* ${calcResult.systemSizeKW} kW
*Required Roof Area:* ${calcResult.requiredRoofArea} sq. ft.
*Estimated Monthly Savings:* ₹${calcResult.monthlySavings?.toLocaleString()}
*Estimated 25-Year Lifetime Savings:* ₹${calcResult.lifetimeSavings?.toLocaleString()}

I want to book a free site consultation!`;

    window.open(`https://wa.me/919025462326?text=${encodeURIComponent(msg)}`, '_blank');
  };

  return (
    <div className="min-h-screen bg-[#F4F6F9] pb-32 text-gray-900 font-sans">
      <SEOHead
        title="Calculate Your Solar Savings | SPC Solar"
        description="Calculate your system size, required roof area, monthly savings, and 25-year lifetime savings."
      />

      {/* Hero Header with Grid & Motion Animations matching About / Services pages */}
      <PageHero
        label="SOLAR CALCULATOR"
        title="CALCULATE YOUR SOLAR "
        highlight="SAVINGS"
        subtitle="Unlock savings, build that dream fund, and start ticking off your checklist."
      />

      {/* Main Container */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 pb-12">
        <Reveal>
          {/* 2-Column SolarSquare Style Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* LEFT COLUMN: Inputs */}
          <div className="lg:col-span-6 space-y-6">
            
            {/* Input Card */}
            <div className="bg-white p-6 sm:p-8 rounded-2xl shadow-sm border border-gray-100 space-y-6">

              {/* Promo Banner */}
              <div className="bg-blue-50 border border-blue-200 text-blue-800 p-4 rounded-xl flex items-center justify-between text-sm">
                {user ? (
                  <>
                    <span><FiAward className="inline mr-2 text-blue-600" /><strong>Logged in as {user.name}</strong> • Estimates will be saved to your account.</span>
                    <Link to="/dashboard" className="text-blue-600 font-bold underline whitespace-nowrap ml-2">My Quotes</Link>
                  </>
                ) : (
                  <>
                    <span><FiAward className="inline mr-2 text-blue-600" /><strong>Sign In to Save Quotation</strong> & get up to ₹1,000 off installation charges!</span>
                    <Link to="/login" className="text-blue-600 font-bold underline whitespace-nowrap ml-2">Sign In</Link>
                  </>
                )}
              </div>
              
              {/* Avg Electricity Bill Slider */}
              <div className="space-y-4 pt-2">
                <div className="flex justify-between items-center">
                  <label className="text-sm font-semibold text-gray-700 flex items-center gap-1.5">
                    Avg electricity bill <FiInfo className="text-gray-400 w-4 h-4 cursor-pointer" />
                  </label>
                  <div className="flex items-center space-x-1 bg-gray-50 border border-gray-200 px-3 py-1 rounded-lg">
                    <span className="text-gray-500 font-medium">₹</span>
                    <input
                      type="number"
                      value={customBillInput}
                      onChange={(e) => handleCustomBillChange(e.target.value)}
                      className="w-20 bg-transparent text-right font-bold text-gray-900 outline-none"
                    />
                  </div>
                </div>

                {/* Range Slider */}
                <div className="relative pt-2 pb-6">
                  <input
                    type="range"
                    min={publicConfig.minBillAmount || 500}
                    max={publicConfig.maxBillAmount || 50000}
                    step="100"
                    value={billValue}
                    onChange={(e) => handleSliderChange(Number(e.target.value))}
                    className="w-full h-3 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
                  />
                  
                  {/* Floating Tooltip Pill */}
                  <div 
                    className="absolute bottom-0 -translate-x-1/2 bg-blue-950 text-white font-bold text-xs px-3 py-1 rounded-md shadow-md"
                    style={{
                      left: `${Math.max(5, Math.min(95, ((billValue - (publicConfig.minBillAmount || 500)) / ((publicConfig.maxBillAmount || 50000) - (publicConfig.minBillAmount || 500))) * 100))}%`
                    }}
                  >
                    ₹{billValue.toLocaleString()}
                  </div>

                  <div className="flex justify-between text-xs text-gray-400 font-medium mt-1">
                    <span>Min. ₹{publicConfig.minBillAmount || 500}</span>
                    <span>Max ₹{(publicConfig.maxBillAmount || 50000).toLocaleString()}</span>
                  </div>
                </div>
              </div>

            </div>

          </div>

          {/* RIGHT COLUMN: Results & Savings Cards */}
          <div className="lg:col-span-6 space-y-6">

            {/* Required System Size Card */}
            <div className="bg-white p-6 sm:p-8 rounded-2xl shadow-sm border border-gray-100 space-y-6">
              <h2 className="text-xl font-bold text-gray-900">Required System Size</h2>

              {calcResult && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-gray-50/70 p-6 rounded-2xl border border-gray-100 text-center">
                  {/* System Size */}
                  <div className="space-y-1 border-r border-gray-200 pr-2">
                    <div className="flex items-center justify-center gap-1.5 text-xs font-semibold text-gray-500 uppercase">
                      <FiZap className="w-4 h-4 text-blue-600" /> System Size
                    </div>
                    <div className="text-2xl sm:text-3xl font-extrabold text-gray-900">
                      {calcResult.systemSizeKW} <span className="text-base font-bold text-gray-600">kw</span>
                    </div>
                  </div>

                  {/* Roof Area */}
                  <div className="space-y-1 pl-2">
                    <div className="flex items-center justify-center gap-1.5 text-xs font-semibold text-gray-500 uppercase">
                      <FiGrid className="w-4 h-4 text-blue-600" /> Roof Area
                    </div>
                    <div className="text-2xl sm:text-3xl font-extrabold text-gray-900">
                      {calcResult.requiredRoofArea} <span className="text-base font-bold text-gray-600">sq. ft.</span>
                    </div>
                  </div>
                </div>
              )}

              <p className="text-xs text-center text-gray-500 font-medium">
                Do not have required roof area? Our consultants will guide you. {' '}
                <button 
                  onClick={() => setIsConsultModalOpen(true)}
                  className="text-blue-600 font-bold underline hover:text-blue-800"
                >
                  Get in touch
                </button>
              </p>
            </div>

            {/* Your Solar Savings Card */}
            <div className="bg-white p-6 sm:p-8 rounded-2xl shadow-sm border border-gray-100 space-y-6">
              <h2 className="text-xl font-bold text-gray-900">Your Solar Savings</h2>

              {calcResult && (
                <div className="space-y-6">
                  <p className="text-center text-sm font-semibold text-gray-600">
                    Your savings with SPC Solar
                  </p>

                  {/* Monthly, Yearly, Lifetime 3-Col Grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 sm:gap-4 text-center sm:divide-x divide-y sm:divide-y-0 divide-gray-200 bg-gray-50/70 p-4 sm:p-6 rounded-2xl border border-gray-100">
                    <div className="px-1">
                      <span className="text-xs font-semibold text-gray-500 block mb-1">Monthly*</span>
                      <span className="text-lg sm:text-xl font-extrabold text-gray-900">
                        ₹{calcResult.monthlySavings?.toLocaleString()}
                      </span>
                    </div>

                    <div className="px-1">
                      <span className="text-xs font-semibold text-gray-500 block mb-1">Yearly*</span>
                      <span className="text-lg sm:text-xl font-extrabold text-gray-900">
                        ₹{calcResult.yearlySavings?.toLocaleString()}
                      </span>
                    </div>

                    <div className="px-1">
                      <span className="text-xs font-semibold text-gray-500 block mb-1">Lifetime*</span>
                      <span className="text-lg sm:text-xl font-extrabold text-blue-600">
                        ₹{calcResult.lifetimeSavings?.toLocaleString()}
                      </span>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Welcome Voucher Promotion or Applied Badge */}
            {calcResult && (
              userCoupon ? (
                <div className="bg-gradient-to-r from-amber-500/10 via-amber-500/5 to-transparent border border-amber-500/30 rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="flex items-start gap-3">
                    <div className="p-2.5 bg-amber-500/20 text-amber-500 rounded-xl flex-shrink-0 mt-0.5">
                      <FiGift className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-accent font-bold uppercase tracking-wider text-amber-600 bg-amber-100 px-2.5 py-0.5 rounded-full">
                          Welcome Voucher Active
                        </span>
                        <span className="font-mono text-xs font-extrabold text-gray-800 bg-white border border-amber-300 px-2 py-0.5 rounded">
                          {userCoupon.code}
                        </span>
                      </div>
                      <p className="text-sm font-bold text-gray-900 mt-1">
                        ₹{couponDiscount.toLocaleString()} Installation Discount Applied
                      </p>
                      <p className="text-xs text-gray-500 mt-0.5">
                        Amount will be directly deducted from your turnkey installation invoice after site setup.
                      </p>
                    </div>
                  </div>
                  <span className="text-sm font-extrabold text-green-600 sm:text-right whitespace-nowrap">
                    - ₹{couponDiscount.toLocaleString()} OFF
                  </span>
                </div>
              ) : !user ? (
                <div className="bg-gradient-to-r from-red/5 via-amber-500/10 to-white border border-amber-400/40 rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="flex items-start gap-3">
                    <div className="p-2.5 bg-red/10 text-red rounded-xl flex-shrink-0 mt-0.5">
                      <FiTag className="w-5 h-5" />
                    </div>
                    <div>
                      <span className="text-xs font-accent font-bold uppercase tracking-wider text-red">
                        New Customer Special Voucher
                      </span>
                      <p className="text-sm font-bold text-gray-900 mt-0.5">
                        Get ₹1,000 OFF on Your Rooftop Solar Installation
                      </p>
                      <p className="text-xs text-gray-600 mt-0.5">
                        Sign up or log in to claim your welcome voucher code.
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <Link
                      to="/register"
                      className="px-4 py-2 bg-red hover:bg-red-dark text-white text-xs font-accent font-bold uppercase tracking-wider rounded-xl transition-all shadow-sm"
                    >
                      Claim Voucher
                    </Link>
                    <Link
                      to="/login"
                      className="px-3 py-2 bg-white hover:bg-gray-100 text-gray-700 text-xs font-accent font-semibold uppercase tracking-wider rounded-xl border border-gray-200 transition-all"
                    >
                      Sign In
                    </Link>
                  </div>
                </div>
              ) : null
            )}

            {/* Environmental & Financial Metrics Accordion / Highlights */}
            {calcResult && (
              <div className="bg-blue-950 text-white p-6 rounded-2xl shadow-md space-y-4">
                <h3 className="text-base font-bold flex items-center gap-2 text-blue-300">
                  <FiAward /> Turnkey Financial Breakdown & Impact
                </h3>
                
                <div className="space-y-2 text-xs font-medium border-t border-blue-900/80 pt-3">
                  <div className="flex items-center justify-between text-blue-200">
                    <span>Turnkey Project Cost:</span>
                    <span className="font-semibold text-white">₹{calcResult.estimatedCost?.toLocaleString()}</span>
                  </div>
                  <div className="flex items-center justify-between text-blue-200">
                    <span>PM Surya Ghar Central Subsidy:</span>
                    <span className="font-semibold text-green-400">- ₹{calcResult.centralSubsidy?.toLocaleString()}</span>
                  </div>
                  {userCoupon && (
                    <div className="flex items-center justify-between text-amber-300 font-semibold">
                      <span>Welcome Voucher Discount ({userCoupon.code}):</span>
                      <span>- ₹{couponDiscount.toLocaleString()}</span>
                    </div>
                  )}
                  <div className="flex items-center justify-between text-sm font-bold border-t border-blue-900/60 pt-2 text-white">
                    <span>Net Customer Investment:</span>
                    <span className="text-lg text-amber-300">₹{(userCoupon ? finalNetCost : calcResult.netCost)?.toLocaleString()}</span>
                  </div>
                  <div className="flex items-center justify-between text-xs text-blue-300 pt-1">
                    <span>Payback Period (ROI):</span>
                    <span className="font-bold text-white">{calcResult.roiYears} Years</span>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-4 text-sm font-medium border-t border-blue-900 pt-3">
                  <div>
                    <span className="text-xs text-blue-300 block">CO₂ Reduced / Year:</span>
                    <span className="text-base font-bold text-green-400">{calcResult.co2ReducedTons} Metric Tons</span>
                  </div>
                  <div>
                    <span className="text-xs text-blue-300 block">Equivalent Trees Planted:</span>
                    <span className="text-base font-bold text-green-400">🌳 {calcResult.treesPlanted} Trees</span>
                  </div>
                </div>
              </div>
            )}

          </div>
        </div>
      </Reveal>
      </div>

      {/* Floating Bottom Sticky Bar matching SolarSquare UI */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4 shadow-2xl z-40">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-sm font-semibold text-gray-800 text-center sm:text-left">
            For further questions and doubts, book a consultation with us for <span className="text-blue-600 font-extrabold uppercase">FREE</span>
          </p>

          <div className="flex items-center space-x-3 w-full sm:w-auto">
            <button
              onClick={generatePDF}
              className="flex-1 sm:flex-initial px-4 py-2.5 border border-gray-300 hover:border-gray-400 text-gray-700 font-semibold rounded-xl text-sm transition-all flex items-center justify-center gap-2"
            >
              <FiDownload /> PDF Estimate
            </button>

            <button
              onClick={() => setIsConsultModalOpen(true)}
              className="flex-1 sm:flex-initial bg-blue-950 hover:bg-blue-900 text-white font-bold px-6 py-2.5 rounded-xl text-sm transition-all flex items-center justify-center gap-2 shadow-md"
            >
              <span>Book a Free Consultation</span> <FiArrowRight />
            </button>
          </div>
        </div>
      </div>

      {/* Consultation Modal */}
      <Modal isOpen={isConsultModalOpen} onClose={() => setIsConsultModalOpen(false)} title="BOOK A FREE SOLAR CONSULTATION">
        {leadSuccess ? (
          <div className="text-center py-6 space-y-4">
            <FiCheckCircle className="w-16 h-16 text-green-600 mx-auto animate-bounce" />
            <h3 className="text-2xl font-bold text-gray-900">CONSULTATION BOOKED!</h3>
            <p className="text-sm text-gray-600">
              Our solar advisor will reach out to you shortly to assist with your site evaluation.
            </p>
            <div className="flex justify-center space-x-3 pt-4">
              <Button variant="primary" onClick={generatePDF} className="flex items-center gap-2">
                <FiDownload /> Download PDF
              </Button>
              <Button variant="outline" onClick={openWhatsApp} className="flex items-center gap-2 text-green-600 border-green-600">
                <FaWhatsapp size={18} /> Chat WhatsApp
              </Button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleLeadSubmit} className="space-y-4">
            <Input
              label="Full Name *"
              placeholder="e.g. John Doe"
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
              label="Email Address"
              type="email"
              placeholder="john@example.com"
              value={leadForm.email}
              onChange={(e) => setLeadForm({ ...leadForm, email: e.target.value })}
            />
            <Input
              label="Location / City"
              value={leadForm.location}
              onChange={(e) => setLeadForm({ ...leadForm, location: e.target.value })}
            />

            {userCoupon && (
              <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-xs flex items-center justify-between text-amber-900">
                <div className="flex items-center gap-2">
                  <FiGift className="text-amber-600 w-4 h-4 flex-shrink-0" />
                  <span>Welcome Voucher: <strong className="font-mono">{userCoupon.code}</strong></span>
                </div>
                <span className="font-bold text-green-700">-₹{couponDiscount.toLocaleString()} (Installation Discount)</span>
              </div>
            )}

            <Button
              type="submit"
              variant="primary"
              disabled={submittingLead}
              className="w-full bg-blue-950 hover:bg-blue-900 text-white py-3 rounded-xl font-bold text-base"
            >
              {submittingLead ? 'Submitting...' : 'Confirm Consultation Booking'}
            </Button>
          </form>
        )}
      </Modal>

    </div>
  );
};

export default QuotationPage;
