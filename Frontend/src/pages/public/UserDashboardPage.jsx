import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FiZap,
  FiGrid,
  FiAward,
  FiDownload,
  FiCalendar,
  FiClock,
  FiCheckCircle,
  FiUser,
  FiMail,
  FiPhone,
  FiMapPin,
  FiLock,
  FiLogOut,
  FiArrowRight,
  FiDollarSign,
  FiShield,
  FiRefreshCw,
  FiFileText,
  FiSun,
  FiTrendingUp,
  FiTag,
  FiCopy,
  FiGift,
} from 'react-icons/fi';
import { FaWhatsapp } from 'react-icons/fa';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import { useUserAuth } from '../../context/UserAuthContext';
import api from '../../services/api';
import toast from 'react-hot-toast';
import SEOHead from '../../components/ui/SEOHead';
import Button from '../../components/ui/Button';

const UserDashboardPage = () => {
  const { user, logout, updateProfile, changePassword } = useUserAuth();
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState('quotations'); // 'quotations' | 'profile' | 'security'
  const [quotations, setQuotations] = useState([]);
  const [loadingQuotes, setLoadingQuotes] = useState(true);

  // Profile Form State
  const [profileForm, setProfileForm] = useState({
    name: user?.name || '',
    phone: user?.phone || '',
    street: user?.address?.street || '',
    city: user?.address?.city || '',
    state: user?.address?.state || 'Tamil Nadu',
    pincode: user?.address?.pincode || '',
  });
  const [savingProfile, setSavingProfile] = useState(false);

  // Password Form State
  const [passForm, setPassForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [changingPass, setChangingPass] = useState(false);
  const [copiedCoupon, setCopiedCoupon] = useState(false);

  const handleCopyCoupon = (code) => {
    navigator.clipboard.writeText(code);
    setCopiedCoupon(true);
    toast.success('Coupon code copied to clipboard!');
    setTimeout(() => setCopiedCoupon(false), 2500);
  };

  // Sync profileForm when user loads/changes
  useEffect(() => {
    if (user) {
      setProfileForm({
        name: user.name || '',
        phone: user.phone || '',
        street: user.address?.street || '',
        city: user.address?.city || '',
        state: user.address?.state || 'Tamil Nadu',
        pincode: user.address?.pincode || '',
      });
    }
  }, [user]);

  // Fetch User's Quotations
  const fetchQuotations = async () => {
    setLoadingQuotes(true);
    try {
      const res = await api.get('/user/quotations');
      setQuotations(res.data || []);
    } catch (error) {
      console.error('Error fetching quotations:', error);
      toast.error('Could not load quotation history');
    } finally {
      setLoadingQuotes(false);
    }
  };

  useEffect(() => {
    fetchQuotations();
  }, []);

  // Handle Profile Update
  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    setSavingProfile(true);
    await updateProfile({
      name: profileForm.name,
      phone: profileForm.phone,
      address: {
        street: profileForm.street,
        city: profileForm.city,
        state: profileForm.state,
        pincode: profileForm.pincode,
      },
    });
    setSavingProfile(false);
  };

  // Handle Password Change
  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    if (passForm.newPassword !== passForm.confirmPassword) {
      toast.error('New passwords do not match');
      return;
    }
    if (passForm.newPassword.length < 6) {
      toast.error('Password must be at least 6 characters long');
      return;
    }

    setChangingPass(true);
    const res = await changePassword(passForm.currentPassword, passForm.newPassword);
    setChangingPass(false);

    if (res.success) {
      setPassForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
    }
  };

  // Generate PDF for a Specific Quotation
  const downloadQuotePDF = (quote) => {
    const doc = new jsPDF();

    // Header
    doc.setFillColor(220, 38, 38); // Red
    doc.rect(0, 0, 210, 28, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(18);
    doc.setFont('helvetica', 'bold');
    doc.text('SPC SOLAR - QUOTATION ESTIMATE', 105, 18, { align: 'center' });

    // Customer & System Info
    doc.setTextColor(10, 10, 10);
    doc.setFontSize(11);
    doc.text(`Customer Name: ${quote.name || user?.name || 'Customer'}`, 15, 38);
    doc.text(`Contact: ${quote.phone || user?.phone || 'N/A'} | ${quote.email || user?.email || ''}`, 15, 44);
    doc.text(`Location: ${quote.location || quote.city || user?.address?.city || 'Tamil Nadu'}`, 15, 50);
    doc.text(`Date: ${new Date(quote.createdAt).toLocaleDateString()}`, 145, 38);
    doc.text(`Quote Ref: #${quote._id.slice(-6).toUpperCase()}`, 145, 44);

    const tableBody = [
      ['System Capacity', `${quote.recommendedKW || '-'} kW`],
      ['Required Roof Area', `${quote.roofArea ? `${quote.roofArea} sq. ft.` : 'Standard'}`],
      ['Panel Configuration', quote.panelModel || `${quote.panelCount || ''} Tier-1 Mono PERC Panels`],
      ['Inverter Specification', quote.inverterModel || 'Grid-Tied On-Grid Inverter'],
      ['Estimated Monthly Solar Savings', `Rs. ${(quote.monthlySavings || 0).toLocaleString()}`],
      ['Estimated Annual Solar Savings', `Rs. ${(quote.annualSavings || 0).toLocaleString()}`],
      ['Turnkey Project Cost', `Rs. ${(quote.estimatedCost || 0).toLocaleString()}`],
      ['PM Surya Ghar Direct Subsidy', `- Rs. ${(quote.centralSubsidy || 0).toLocaleString()}`],
    ];

    if (quote.couponDiscount > 0 || quote.appliedCoupon?.discountAmount > 0) {
      const discount = quote.couponDiscount || quote.appliedCoupon?.discountAmount;
      const code = quote.appliedCoupon?.code || 'WELCOME';
      tableBody.push(['Welcome Installation Voucher', `- Rs. ${discount.toLocaleString()} (Voucher: ${code})`]);
    }

    tableBody.push(['Net Customer Investment', `Rs. ${(quote.netCost || 0).toLocaleString()}`]);
    tableBody.push(['Payback Period (ROI)', `${quote.roiYears || '3-4'} Years`]);
    tableBody.push(['Quote Status', quote.status || 'New']);

    doc.autoTable({
      startY: 58,
      head: [['System Parameter', 'Specification Details']],
      body: tableBody,
      headStyles: { fillColor: [220, 38, 38] },
      alternateRowStyles: { fillColor: [248, 249, 250] },
    });

    doc.setFontSize(8);
    doc.setTextColor(120, 120, 120);
    doc.text(
      'Note: This estimate is based on preliminary inputs. Final structural & electrical parameters will be confirmed during the free on-site engineering survey.',
      15,
      doc.lastAutoTable.finalY + 15,
      { maxWidth: 180 }
    );

    doc.save(`SPC_Solar_Quotation_${quote._id.slice(-6).toUpperCase()}.pdf`);
  };

  // WhatsApp Action for Quotation
  const chatOnWhatsApp = (quote) => {
    const text = `Hello SPC Solar! I am checking my quote #${quote._id.slice(-6).toUpperCase()} for a ${quote.recommendedKW || ''} kW system on your portal. I would like to schedule a site evaluation.`;
    window.open(`https://wa.me/919025462326?text=${encodeURIComponent(text)}`, '_blank');
  };

  // Summary Metrics
  const totalQuotes = quotations.length;
  const totalKW = quotations.reduce((acc, q) => acc + (q.recommendedKW || 0), 0);
  const totalSavings = quotations.reduce((acc, q) => acc + (q.annualSavings || 0), 0);
  const totalSubsidy = quotations.reduce((acc, q) => acc + (q.centralSubsidy || 0), 0);

  return (
    <div className="min-h-screen bg-[#F8F9FA] text-gray-900 font-sans pb-24 pt-24 md:pt-28">
      <SEOHead
        title="My Solar Dashboard | SPC Solar"
        description="View your saved solar estimates, track quotation requests, and manage your account."
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Top Header Card */}
        <div className="bg-gradient-to-r from-[#0a0a0a] via-[#141414] to-[#1f1f1f] text-white rounded-3xl p-6 sm:p-10 shadow-xl border border-white/10 relative overflow-hidden">
          {/* Subtle Red & Blue Ambient Glow */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-red/15 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-1/3 w-64 h-64 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="flex items-center gap-4 sm:gap-6">
              <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-gradient-to-br from-red to-red-dark flex items-center justify-center text-white text-2xl sm:text-3xl font-heading font-bold shadow-lg shadow-red/30">
                {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="bg-white/10 text-white/80 text-[11px] font-accent uppercase px-2.5 py-0.5 rounded-full border border-white/15">
                    Customer Account
                  </span>
                  {user?.address?.city && (
                    <span className="text-white/50 text-xs flex items-center gap-1">
                      <FiMapPin className="text-red" /> {user.address.city}, {user.address.state || 'TN'}
                    </span>
                  )}
                </div>
                <h1 className="text-2xl sm:text-3xl font-heading font-bold uppercase tracking-wide mt-1 text-white">
                  Welcome back, <span className="text-red">{user?.name}</span>
                </h1>
                <p className="text-sm text-white/60 mt-0.5 flex flex-wrap items-center gap-3">
                  <span>{user?.email}</span>
                  {user?.phone && <span>• {user.phone}</span>}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Link to="/quotation">
                <Button size="sm" icon={<FiZap size={14} />} className="whitespace-nowrap">
                  New Solar Quote
                </Button>
              </Link>
              <button
                onClick={() => {
                  logout();
                  navigate('/');
                }}
                className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white text-sm font-semibold rounded-xl transition-colors flex items-center gap-2 border border-white/15"
              >
                <FiLogOut /> Sign Out
              </button>
            </div>
          </div>

          {/* Quick Metrics Bar */}
          <div className="mt-8 pt-8 border-t border-white/10 grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            <div className="bg-white/5 rounded-2xl p-4 border border-white/10">
              <span className="text-xs font-accent text-white/60 uppercase tracking-wider block">
                Saved Quotes
              </span>
              <span className="text-2xl sm:text-3xl font-extrabold text-white mt-1 block">
                {totalQuotes}
              </span>
            </div>

            <div className="bg-white/5 rounded-2xl p-4 border border-white/10">
              <span className="text-xs font-accent text-white/60 uppercase tracking-wider block">
                Recommended Capacity
              </span>
              <span className="text-2xl sm:text-3xl font-extrabold text-white mt-1 block">
                {totalKW > 0 ? `${totalKW.toFixed(1)} kW` : '—'}
              </span>
            </div>

            <div className="bg-white/5 rounded-2xl p-4 border border-white/10">
              <span className="text-xs font-accent text-white/60 uppercase tracking-wider block">
                Est. Annual Savings
              </span>
              <span className="text-2xl sm:text-3xl font-extrabold text-green-400 mt-1 block">
                {totalSavings > 0 ? `₹${Math.round(totalSavings).toLocaleString()}` : '—'}
              </span>
            </div>

            <div className="bg-white/5 rounded-2xl p-4 border border-white/10">
              <span className="text-xs font-accent text-white/60 uppercase tracking-wider block">
                Govt Subsidy Eligibility
              </span>
              <span className="text-2xl sm:text-3xl font-extrabold text-blue-400 mt-1 block">
                {totalSubsidy > 0 ? `₹${Math.round(totalSubsidy).toLocaleString()}` : 'Up to ₹78k'}
              </span>
            </div>
          </div>
        </div>

        {/* Welcome Coupon Card */}
        {user?.coupon && user.coupon.code && user.coupon.status !== 'None' && (
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            className="relative bg-gradient-to-r from-[#0f172a] via-[#1e1b4b] to-[#1e1b4b] rounded-3xl p-6 sm:p-8 text-white border border-amber-500/30 shadow-xl overflow-hidden"
          >
            {/* Ambient amber glow */}
            <div className="absolute top-0 right-0 w-80 h-80 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

            <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
              <div className="space-y-3">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="bg-amber-400/20 text-amber-300 border border-amber-400/30 text-xs uppercase font-accent font-bold px-3 py-1 rounded-full flex items-center gap-1.5">
                    <FiGift className="text-amber-400" /> New Customer Welcome Voucher
                  </span>
                  <span
                    className={`px-3 py-0.5 text-xs font-bold rounded-full ${
                      user.coupon.status === 'Claimed'
                        ? 'bg-blue-500/20 text-blue-300 border border-blue-500/30'
                        : 'bg-green-500/20 text-green-300 border border-green-500/30'
                    }`}
                  >
                    {user.coupon.status === 'Claimed' ? 'Claimed (Deducted from Invoice)' : 'Active Voucher'}
                  </span>
                </div>

                <div>
                  <h2 className="text-2xl sm:text-3xl font-extrabold text-amber-400 font-heading">
                    ₹{Number(user.coupon.discountAmount || 1000).toLocaleString()} OFF on Installation
                  </h2>
                  <p className="text-sm text-white/70 max-w-2xl mt-1">
                    {user.coupon.description ||
                      'This discount amount is directly deducted from your final rooftop solar turnkey installation invoice after site setup.'}
                  </p>
                </div>

                <div className="flex flex-wrap items-center gap-4 text-xs text-white/50 pt-1">
                  <span>• Valid on 1 kW and above rooftop solar systems</span>
                  {user.coupon.expiresAt && (
                    <span>• Valid until {new Date(user.coupon.expiresAt).toLocaleDateString()}</span>
                  )}
                </div>
              </div>

              {/* Code Box & Actions */}
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                <div className="bg-white/10 border border-dashed border-amber-400/40 rounded-2xl px-5 py-3 text-center sm:text-left flex items-center justify-between sm:justify-start gap-4">
                  <div>
                    <span className="text-[10px] text-white/50 uppercase font-accent block">Coupon Code</span>
                    <span className="text-xl font-mono font-extrabold tracking-widest text-white">
                      {user.coupon.code}
                    </span>
                  </div>
                  <button
                    onClick={() => handleCopyCoupon(user.coupon.code)}
                    className="p-2.5 bg-amber-400/20 hover:bg-amber-400/30 text-amber-300 rounded-xl transition-colors"
                    title="Copy Code"
                  >
                    {copiedCoupon ? <FiCheckCircle className="text-green-400" /> : <FiCopy />}
                  </button>
                </div>

                <Link to="/quotation">
                  <button className="w-full sm:w-auto px-5 py-3.5 bg-amber-400 hover:bg-amber-300 text-gray-900 font-accent font-bold uppercase tracking-wider text-xs rounded-2xl transition-all shadow-lg shadow-amber-400/20 flex items-center justify-center gap-2">
                    <span>Apply in Calculator</span>
                    <FiArrowRight />
                  </button>
                </Link>
              </div>
            </div>
          </motion.div>
        )}

        {/* Navigation Tabs */}
        <div className="flex items-center gap-2 border-b border-gray-200 pb-2 overflow-x-auto">
          <button
            onClick={() => setActiveTab('quotations')}
            className={`px-5 py-2.5 rounded-xl font-accent font-bold text-sm uppercase tracking-wider transition-all flex items-center gap-2 ${
              activeTab === 'quotations'
                ? 'bg-red text-white shadow-md shadow-red/20'
                : 'bg-white text-gray-600 hover:text-gray-900 border border-gray-200'
            }`}
          >
            <FiFileText /> My Solar Estimates ({totalQuotes})
          </button>

          <button
            onClick={() => setActiveTab('profile')}
            className={`px-5 py-2.5 rounded-xl font-accent font-bold text-sm uppercase tracking-wider transition-all flex items-center gap-2 ${
              activeTab === 'profile'
                ? 'bg-red text-white shadow-md shadow-red/20'
                : 'bg-white text-gray-600 hover:text-gray-900 border border-gray-200'
            }`}
          >
            <FiUser /> Profile & Address
          </button>

          <button
            onClick={() => setActiveTab('security')}
            className={`px-5 py-2.5 rounded-xl font-accent font-bold text-sm uppercase tracking-wider transition-all flex items-center gap-2 ${
              activeTab === 'security'
                ? 'bg-red text-white shadow-md shadow-red/20'
                : 'bg-white text-gray-600 hover:text-gray-900 border border-gray-200'
            }`}
          >
            <FiLock /> Password & Security
          </button>
        </div>

        {/* TAB 1: MY QUOTATIONS */}
        {activeTab === 'quotations' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold text-gray-900">Your Solar Estimates & Requests</h2>
                <p className="text-sm text-gray-500">
                  Track system designs, subsidy calculations, and turnkey costs
                </p>
              </div>
              <button
                onClick={fetchQuotations}
                disabled={loadingQuotes}
                className="p-2.5 bg-white border border-gray-200 text-gray-600 hover:text-red rounded-xl transition-colors shadow-sm"
                title="Refresh Quotes"
              >
                <FiRefreshCw className={`w-4 h-4 ${loadingQuotes ? 'animate-spin text-red' : ''}`} />
              </button>
            </div>

            {loadingQuotes ? (
              <div className="py-16 text-center space-y-3">
                <div className="w-10 h-10 border-4 border-red/30 border-t-red rounded-full animate-spin mx-auto" />
                <p className="text-sm text-gray-500 font-medium">Fetching your solar estimates...</p>
              </div>
            ) : quotations.length === 0 ? (
              /* Empty State */
              <div className="bg-white rounded-3xl p-12 text-center border border-gray-200 shadow-sm space-y-5 max-w-xl mx-auto">
                <div className="w-16 h-16 bg-red/10 rounded-2xl flex items-center justify-center mx-auto text-red text-3xl">
                  <FiSun />
                </div>
                <h3 className="text-2xl font-bold text-gray-900">No Solar Quotes Yet</h3>
                <p className="text-gray-600 text-sm leading-relaxed">
                  Use our live Solar Savings Calculator to calculate your recommended rooftop system size,
                  monthly electricity bill reduction, and PM Surya Ghar subsidy!
                </p>
                <div className="pt-2">
                  <Link to="/quotation">
                    <Button variant="primary" icon={<FiArrowRight />}>
                      Calculate Solar Savings Now
                    </Button>
                  </Link>
                </div>
              </div>
            ) : (
              /* Quotation Cards Grid */
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {quotations.map((quote) => {
                  const statusColors = {
                    New: 'bg-blue-100 text-blue-800 border-blue-200',
                    'In Review': 'bg-amber-100 text-amber-800 border-amber-200',
                    Approved: 'bg-green-100 text-green-800 border-green-200',
                    Scheduled: 'bg-purple-100 text-purple-800 border-purple-200',
                    Completed: 'bg-emerald-100 text-emerald-800 border-emerald-200',
                  };
                  const badgeClass = statusColors[quote.status] || 'bg-gray-100 text-gray-700 border-gray-200';

                  return (
                    <motion.div
                      key={quote._id}
                      initial={{ opacity: 0, y: 15 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="bg-white rounded-3xl p-6 sm:p-7 border border-gray-200/80 shadow-sm hover:shadow-md transition-shadow space-y-6 flex flex-col justify-between"
                    >
                      <div className="space-y-4">
                        {/* Header: System Size & Status */}
                        <div className="flex items-start justify-between gap-4">
                          <div>
                            <span className="text-xs font-accent text-gray-400 uppercase tracking-wider block">
                              Quote #{quote._id.slice(-6).toUpperCase()} • {new Date(quote.createdAt).toLocaleDateString()}
                            </span>
                            <h3 className="text-2xl font-extrabold text-gray-900 flex items-center gap-2 mt-1">
                              <FiZap className="text-red w-6 h-6" />
                              {quote.recommendedKW ? `${quote.recommendedKW} kW System` : 'Custom Solar System'}
                            </h3>
                          </div>
                          <span className={`px-3 py-1 text-xs font-bold rounded-full border ${badgeClass}`}>
                            {quote.status || 'New'}
                          </span>
                        </div>

                        {/* Specs Grid */}
                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 bg-gray-50/80 p-4 rounded-2xl border border-gray-100 text-xs">
                          <div>
                            <span className="text-gray-500 block mb-0.5">Est. Monthly Bill:</span>
                            <span className="font-bold text-gray-900 text-sm">
                              {quote.monthlyBill ? `₹${quote.monthlyBill.toLocaleString()}` : '—'}
                            </span>
                          </div>
                          <div>
                            <span className="text-gray-500 block mb-0.5">Yearly Savings:</span>
                            <span className="font-bold text-green-600 text-sm">
                              {quote.annualSavings ? `₹${quote.annualSavings.toLocaleString()}` : '—'}
                            </span>
                          </div>
                          <div>
                            <span className="text-gray-500 block mb-0.5">Payback Period:</span>
                            <span className="font-bold text-gray-900 text-sm">
                              {quote.roiYears ? `${quote.roiYears} Years` : '3-4 Years'}
                            </span>
                          </div>
                        </div>

                        {/* Financial Breakdown */}
                        <div className="space-y-2 pt-1 text-sm border-t border-gray-100">
                          <div className="flex justify-between text-gray-600">
                            <span>Turnkey Investment:</span>
                            <span className="font-medium text-gray-900">
                              {quote.estimatedCost ? `₹${quote.estimatedCost.toLocaleString()}` : '—'}
                            </span>
                          </div>
                          {quote.centralSubsidy > 0 && (
                            <div className="flex justify-between text-blue-600">
                              <span>PM Surya Ghar Subsidy:</span>
                              <span className="font-semibold">- ₹{quote.centralSubsidy.toLocaleString()}</span>
                            </div>
                          )}
                          {(quote.couponDiscount > 0 || quote.appliedCoupon?.discountAmount > 0) && (
                            <div className="flex justify-between text-amber-600 font-semibold text-xs bg-amber-50 px-2 py-1 rounded-lg">
                              <span>Welcome Voucher ({quote.appliedCoupon?.code || 'WELCOME'}):</span>
                              <span>- ₹{(quote.couponDiscount || quote.appliedCoupon?.discountAmount).toLocaleString()}</span>
                            </div>
                          )}
                          <div className="flex justify-between font-bold text-gray-900 border-t border-gray-100 pt-2 text-base">
                            <span>Net Customer Cost:</span>
                            <span className="text-red">
                              {quote.netCost ? `₹${quote.netCost.toLocaleString()}` : '—'}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Action Buttons */}
                      <div className="pt-4 border-t border-gray-100 flex flex-wrap items-center gap-3">
                        <button
                          onClick={() => downloadQuotePDF(quote)}
                          className="flex-1 py-2.5 px-4 bg-gray-900 hover:bg-black text-white text-xs font-accent font-bold uppercase tracking-wider rounded-xl transition-colors flex items-center justify-center gap-2 shadow-sm"
                        >
                          <FiDownload /> PDF Estimate
                        </button>
                        <button
                          onClick={() => chatOnWhatsApp(quote)}
                          className="flex-1 py-2.5 px-4 bg-green-600 hover:bg-green-700 text-white text-xs font-accent font-bold uppercase tracking-wider rounded-xl transition-colors flex items-center justify-center gap-2 shadow-sm"
                        >
                          <FaWhatsapp size={15} /> Chat on WhatsApp
                        </button>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* TAB 2: PROFILE & ADDRESS */}
        {activeTab === 'profile' && (
          <div className="max-w-2xl bg-white rounded-3xl p-6 sm:p-10 border border-gray-200 shadow-sm space-y-6">
            <div>
              <h2 className="text-xl font-bold text-gray-900">Customer Profile & Site Address</h2>
              <p className="text-sm text-gray-500">
                Keep your contact details up to date for solar site evaluations and subsidies
              </p>
            </div>

            <form onSubmit={handleProfileSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                  Full Name
                </label>
                <input
                  type="text"
                  required
                  value={profileForm.name}
                  onChange={(e) => setProfileForm({ ...profileForm, name: e.target.value })}
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-red focus:bg-white transition-all"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                    Email Address
                  </label>
                  <input
                    type="email"
                    disabled
                    value={user?.email || ''}
                    className="w-full px-4 py-3 bg-gray-100 border border-gray-200 rounded-xl text-sm text-gray-500 cursor-not-allowed"
                  />
                  <span className="text-[11px] text-gray-400 mt-1 block">Email cannot be changed</span>
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                    Mobile Number
                  </label>
                  <input
                    type="tel"
                    value={profileForm.phone}
                    onChange={(e) => setProfileForm({ ...profileForm, phone: e.target.value })}
                    placeholder="+91 98765 43210"
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-red focus:bg-white transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                  Street Address / Premise
                </label>
                <input
                  type="text"
                  value={profileForm.street}
                  onChange={(e) => setProfileForm({ ...profileForm, street: e.target.value })}
                  placeholder="e.g. 42 Solar Villa, Avinashi Road"
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-red focus:bg-white transition-all"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                    City
                  </label>
                  <input
                    type="text"
                    value={profileForm.city}
                    onChange={(e) => setProfileForm({ ...profileForm, city: e.target.value })}
                    placeholder="Coimbatore"
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-red focus:bg-white transition-all"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                    State
                  </label>
                  <input
                    type="text"
                    value={profileForm.state}
                    onChange={(e) => setProfileForm({ ...profileForm, state: e.target.value })}
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-red focus:bg-white transition-all"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                    Pincode
                  </label>
                  <input
                    type="text"
                    value={profileForm.pincode}
                    onChange={(e) => setProfileForm({ ...profileForm, pincode: e.target.value })}
                    placeholder="641001"
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-red focus:bg-white transition-all"
                  />
                </div>
              </div>

              <div className="pt-4">
                <button
                  type="submit"
                  disabled={savingProfile}
                  className="px-6 py-3 bg-red hover:bg-red-dark text-white font-accent font-bold uppercase tracking-wider text-xs rounded-xl shadow-md shadow-red/20 transition-all disabled:opacity-50"
                >
                  {savingProfile ? 'Saving Changes...' : 'Save Profile Details'}
                </button>
              </div>
            </form>
          </div>
        )}

        {/* TAB 3: PASSWORD & SECURITY */}
        {activeTab === 'security' && (
          <div className="max-w-xl bg-white rounded-3xl p-6 sm:p-10 border border-gray-200 shadow-sm space-y-6">
            <div>
              <h2 className="text-xl font-bold text-gray-900">Change Account Password</h2>
              <p className="text-sm text-gray-500">
                Ensure your account is protected with a strong, memorable password
              </p>
            </div>

            <form onSubmit={handlePasswordSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                  Current Password
                </label>
                <input
                  type="password"
                  required
                  value={passForm.currentPassword}
                  onChange={(e) => setPassForm({ ...passForm, currentPassword: e.target.value })}
                  placeholder="••••••••"
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-red focus:bg-white transition-all"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                  New Password (min 6 characters)
                </label>
                <input
                  type="password"
                  required
                  value={passForm.newPassword}
                  onChange={(e) => setPassForm({ ...passForm, newPassword: e.target.value })}
                  placeholder="••••••••"
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-red focus:bg-white transition-all"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                  Confirm New Password
                </label>
                <input
                  type="password"
                  required
                  value={passForm.confirmPassword}
                  onChange={(e) => setPassForm({ ...passForm, confirmPassword: e.target.value })}
                  placeholder="••••••••"
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-red focus:bg-white transition-all"
                />
              </div>

              <div className="pt-4">
                <button
                  type="submit"
                  disabled={changingPass}
                  className="px-6 py-3 bg-red hover:bg-red-dark text-white font-accent font-bold uppercase tracking-wider text-xs rounded-xl shadow-md shadow-red/20 transition-all disabled:opacity-50"
                >
                  {changingPass ? 'Updating Password...' : 'Update Password'}
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};

export default UserDashboardPage;
