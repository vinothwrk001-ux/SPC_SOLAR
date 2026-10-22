import React, { useState, useId } from 'react';
import { motion } from 'framer-motion';
import { 
  FiX, 
  FiGift, 
  FiCheckCircle, 
  FiShare2, 
  FiPhone, 
  FiUser, 
  FiSend,
  FiZap,
  FiAward,
  FiArrowRight,
  FiCopy,
  FiCheck
} from 'react-icons/fi';
import { FaWhatsapp } from 'react-icons/fa';
import Button from '../ui/Button';
import Input from '../ui/Input';

const PRESETS = [
  { kw: 3, label: '3 kW (Home)' },
  { kw: 5, label: '5 kW (Villa)' },
  { kw: 10, label: '10 kW (Commercial)' },
  { kw: 25, label: '25 kW (Factory)' },
  { kw: 50, label: '50 kW (Industrial)' },
  { kw: 100, label: '100 kW (Enterprise)' },
];

const ReferralModal = ({ isOpen, onClose }) => {
  const capacityRangeId = useId();
  const [activeTab, setActiveTab] = useState('submit'); // 'submit' | 'share' | 'contact'
  const [capacity, setCapacity] = useState(5);
  const [copied, setCopied] = useState(false);
  
  // Referrer & Prospect Form State
  const [formData, setFormData] = useState({
    referrerName: '',
    referrerPhone: '',
    referrerUpi: '',
    clientName: '',
    clientPhone: '',
    clientCity: '',
    notes: ''
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [serverError, setServerError] = useState('');

  if (!isOpen) return null;

  const rewardAmount = capacity * 2000;
  const formattedReward = new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0
  }).format(rewardAmount);

  const validate = () => {
    const errs = {};
    if (!formData.referrerName.trim()) errs.referrerName = 'Your name is required';
    
    const cleanRefPhone = formData.referrerPhone.trim().replace(/\D/g, '');
    if (!cleanRefPhone) {
      errs.referrerPhone = 'Your mobile number is required to receive payout';
    } else if (!/^[6-9]\d{9}$/.test(cleanRefPhone)) {
      errs.referrerPhone = 'Enter a valid 10-digit mobile number';
    }

    if (!formData.clientName.trim()) errs.clientName = "Friend/Client's name is required";
    
    const cleanClientPhone = formData.clientPhone.trim().replace(/\D/g, '');
    if (!cleanClientPhone) {
      errs.clientPhone = "Friend/Client's mobile number is required";
    } else if (!/^[6-9]\d{9}$/.test(cleanClientPhone)) {
      errs.clientPhone = 'Enter a valid 10-digit mobile number';
    }

    if (!formData.clientCity.trim()) errs.clientCity = 'Location/City is required';

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === 'referrerPhone' || name === 'clientPhone') {
      const clean = value.replace(/\D/g, '').slice(0, 10);
      setFormData(prev => ({ ...prev, [name]: clean }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
    if (serverError) setServerError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setIsLoading(true);
    setServerError('');

    try {
      const notesContent = `REFERRAL PROGRAM LEAD:
- Referrer: ${formData.referrerName.trim()} (${formData.referrerPhone.trim()})
${formData.referrerUpi.trim() ? `- Referrer UPI: ${formData.referrerUpi.trim()}\n` : ''}- Est. Capacity: ${capacity} kW
- Expected Referral Payout: ${formattedReward}
- Additional Notes: ${formData.notes.trim() || 'None'}`;

      const res = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/leads`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.clientName.trim(),
          phone: formData.clientPhone.trim(),
          city: formData.clientCity.trim(),
          source: 'Refer & Earn Program (₹2,000/kW)',
          systemSize: `${capacity} kW`,
          notes: notesContent,
          status: 'New'
        })
      });

      const data = await res.json();
      if (data.success) {
        setIsSuccess(true);
      } else {
        setServerError(data.message || 'Something went wrong. Please try again.');
      }
    } catch {
      setServerError('Unable to connect to server. Please try again or WhatsApp us directly.');
    } finally {
      setIsLoading(false);
    }
  };

  const resetAndClose = () => {
    setIsSuccess(false);
    setFormData({
      referrerName: '',
      referrerPhone: '',
      referrerUpi: '',
      clientName: '',
      clientPhone: '',
      clientCity: '',
      notes: ''
    });
    setErrors({});
    setServerError('');
    onClose();
  };

  // WhatsApp share message
  const shareMessage = `☀️ *Recommend SPC Solar & Save on Electricity!*
Hey! I recommend *SPC Solar* for high-efficiency rooftop and commercial solar panel installations with up to ₹78,000 Central Govt Subsidy.

💡 Get up to 90% off your electricity bills!
📞 Contact: +91 80987 44044 (Office) / +91 84896 44044
${formData.referrerName.trim() ? `👤 Recommended by: *${formData.referrerName.trim()}*\n` : ''}🌐 Website: https://spcsolar.in`;

  const handleCopyMessage = () => {
    navigator.clipboard.writeText(shareMessage);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleWhatsAppShare = () => {
    const encoded = encodeURIComponent(shareMessage);
    window.open(`https://api.whatsapp.com/send?text=${encoded}`, '_blank');
  };

  const handleDirectWhatsAppReferralDesk = () => {
    const text = encodeURIComponent(
      `Hello SPC Solar! I want to refer a client for solar installation and learn more about the ₹2,000/kW referral program reward.`
    );
    window.open(`https://wa.me/918098744044?text=${text}`, '_blank');
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-3 sm:p-4 md:p-6 overflow-y-auto">
      {/* Backdrop */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={resetAndClose}
        className="fixed inset-0 bg-black/85 backdrop-blur-md"
      />

      {/* Modal Container */}
      <motion.div 
        initial={{ opacity: 0, scale: 0.95, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 15 }}
        transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
        className="relative w-full max-w-2xl bg-[#0F1115] border border-amber-500/30 rounded-2xl sm:rounded-3xl shadow-2xl shadow-amber-950/20 overflow-hidden my-auto max-h-[92vh] flex flex-col"
      >
        {/* Glow Effects */}
        <div className="absolute top-0 right-0 w-80 h-80 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute top-0 left-0 w-80 h-80 bg-red/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-red via-amber-400 to-red" />

        {/* Modal Header */}
        <div className="relative p-4 sm:p-6 pb-3 border-b border-white/10 flex items-start justify-between gap-3 shrink-0">
          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-gradient-to-r from-amber-500/20 to-red/20 border border-amber-500/40 text-amber-300 text-[11px] sm:text-xs font-accent font-bold tracking-wider uppercase mb-1.5">
              <FiGift className="animate-bounce" />
              <span>SPC Referral & Partner Program</span>
            </div>
            <h3 className="text-xl sm:text-2xl md:text-3xl font-heading font-extrabold text-white tracking-tight">
              Refer & Earn <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-amber-400 to-yellow-200">₹2,000 / kW</span>
            </h3>
            <p className="text-gray-300 font-body text-xs sm:text-sm mt-0.5">
              Know anyone looking for solar? Earn flat ₹2,000 for every 1 kW installed!
            </p>
          </div>

          <button
            onClick={resetAndClose}
            className="text-gray-400 hover:text-white p-2 rounded-xl bg-white/5 hover:bg-white/10 transition-colors shrink-0"
            aria-label="Close modal"
          >
            <FiX size={20} />
          </button>
        </div>

        {/* Scrollable Modal Body */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-5 text-white">
          
          {/* Interactive Live Reward Calculator Card */}
          <div className="relative rounded-2xl bg-gradient-to-br from-[#1A1612] via-[#161311] to-[#120F0D] border border-amber-500/30 p-4 sm:p-5 overflow-hidden shadow-inner">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-3">
              <div>
                <span className="text-[11px] font-accent font-semibold tracking-wider uppercase text-amber-400 flex items-center gap-1">
                  <FiZap className="text-amber-400" /> Live Reward Calculator
                </span>
                <p className="text-xs text-gray-400">Move slider or select kW capacity to see your cash reward</p>
              </div>

              {/* Reward Counter Badge */}
              <div className="bg-gradient-to-r from-amber-500/20 via-amber-400/25 to-yellow-500/20 border border-amber-400/50 rounded-xl px-3.5 py-1.5 text-right w-full sm:w-auto">
                <span className="text-[10px] text-amber-200/80 uppercase font-bold tracking-wider block">Your Cash Payout</span>
                <span className="text-2xl sm:text-3xl font-heading font-extrabold text-amber-300 tracking-tight">
                  {formattedReward}
                </span>
              </div>
            </div>

            {/* Slider */}
            <div className="space-y-2 mt-2">
              <div className="flex justify-between text-xs text-gray-300 font-medium">
                <span>Selected Capacity: <strong className="text-white text-sm">{capacity} kW</strong></span>
                <span className="text-amber-400 font-bold">₹2,000 × {capacity} kW</span>
              </div>
              <input
                id={capacityRangeId}
                type="range"
                min="1"
                max="100"
                step="1"
                value={capacity}
                onChange={(e) => setCapacity(Number(e.target.value))}
                aria-label="Solar Capacity in Kilowatts"
                className="w-full h-2.5 bg-neutral-800 rounded-lg appearance-none cursor-pointer accent-amber-400 focus:outline-none"
              />
            </div>

            {/* Presets */}
            <div className="grid grid-cols-3 sm:grid-cols-6 gap-1.5 mt-3">
              {PRESETS.map((p) => (
                <button
                  key={p.kw}
                  type="button"
                  onClick={() => setCapacity(p.kw)}
                  className={`text-[11px] font-accent py-1.5 px-2 rounded-lg font-bold border transition-all text-center ${
                    capacity === p.kw
                      ? 'bg-amber-400 text-black border-amber-400 shadow-md shadow-amber-400/20 scale-[1.02]'
                      : 'bg-white/5 border-white/10 text-gray-300 hover:bg-white/10 hover:text-white'
                  }`}
                >
                  {p.label}
                </button>
              ))}
            </div>

            <div className="mt-3 pt-2.5 border-t border-white/5 flex items-center justify-between text-[11px] text-gray-400">
              <span className="flex items-center gap-1 text-emerald-400 font-medium">
                <FiCheckCircle size={13} /> Direct UPI / Bank Transfer
              </span>
              <span className="text-gray-400 italic">Credited after full payment settlement</span>
            </div>
          </div>

          {/* 3 Step Workflow */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
            <div className="bg-white/5 border border-white/5 rounded-xl p-3 flex sm:flex-col items-center sm:items-start gap-3">
              <div className="w-8 h-8 rounded-full bg-red/20 text-red border border-red/30 flex items-center justify-center font-bold font-heading text-xs shrink-0">
                01
              </div>
              <div>
                <h5 className="font-heading text-xs font-bold text-white">Share Referral</h5>
                <p className="text-[11px] text-gray-400 mt-0.5">Submit their contact or share your referral link.</p>
              </div>
            </div>

            <div className="bg-white/5 border border-white/5 rounded-xl p-3 flex sm:flex-col items-center sm:items-start gap-3">
              <div className="w-8 h-8 rounded-full bg-amber-500/20 text-amber-400 border border-amber-500/30 flex items-center justify-center font-bold font-heading text-xs shrink-0">
                02
              </div>
              <div>
                <h5 className="font-heading text-xs font-bold text-white">We Install Solar</h5>
                <p className="text-[11px] text-gray-400 mt-0.5">SPC team handles survey, subsidy & installation.</p>
              </div>
            </div>

            <div className="bg-white/5 border border-white/5 rounded-xl p-3 flex sm:flex-col items-center sm:items-start gap-3">
              <div className="w-8 h-8 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center font-bold font-heading text-xs shrink-0">
                03
              </div>
              <div>
                <h5 className="font-heading text-xs font-bold text-white">Get Paid Cash</h5>
                <p className="text-[11px] text-gray-400 mt-0.5">₹2,000 per kW credited directly into your bank.</p>
              </div>
            </div>
          </div>

          {/* Action Tabs */}
          <div className="flex border-b border-white/10 gap-2">
            <button
              type="button"
              onClick={() => setActiveTab('submit')}
              className={`pb-2.5 px-3 font-accent text-xs sm:text-sm font-bold border-b-2 transition-all flex items-center gap-1.5 ${
                activeTab === 'submit'
                  ? 'border-amber-400 text-amber-400'
                  : 'border-transparent text-gray-400 hover:text-white'
              }`}
            >
              <FiSend size={14} /> Submit Lead Directly
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('share')}
              className={`pb-2.5 px-3 font-accent text-xs sm:text-sm font-bold border-b-2 transition-all flex items-center gap-1.5 ${
                activeTab === 'share'
                  ? 'border-emerald-400 text-emerald-400'
                  : 'border-transparent text-gray-400 hover:text-white'
              }`}
            >
              <FaWhatsapp size={14} /> WhatsApp Share
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('contact')}
              className={`pb-2.5 px-3 font-accent text-xs sm:text-sm font-bold border-b-2 transition-all flex items-center gap-1.5 ${
                activeTab === 'contact'
                  ? 'border-red text-red'
                  : 'border-transparent text-gray-400 hover:text-white'
              }`}
            >
              <FiPhone size={14} /> Referral Desk
            </button>
          </div>

          {/* Tab 1: Submit Referral Lead */}
          {activeTab === 'submit' && (
            <div>
              {isSuccess ? (
                <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-2xl p-6 text-center space-y-4">
                  <div className="w-14 h-14 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 flex items-center justify-center mx-auto text-2xl">
                    <FiCheckCircle />
                  </div>
                  <h4 className="text-xl font-heading font-extrabold text-white">
                    Referral Successfully Registered!
                  </h4>
                  <p className="text-sm text-gray-300 max-w-md mx-auto">
                    Thank you! Our technical solar team will contact <strong className="text-white">{formData.clientName}</strong> immediately for a site survey. Once finalized and commissioned, your reward of <strong className="text-amber-300">{formattedReward}</strong> will be processed to <strong className="text-white">{formData.referrerPhone}</strong>.
                  </p>
                  
                  <div className="flex flex-col sm:flex-row gap-3 justify-center pt-2">
                    <Button 
                      variant="primary" 
                      onClick={handleDirectWhatsAppReferralDesk}
                      icon={<FaWhatsapp size={16} />}
                    >
                      Notify Referral Team on WhatsApp
                    </Button>
                    <Button 
                      variant="outline-white" 
                      onClick={() => setIsSuccess(false)}
                    >
                      Submit Another Referral
                    </Button>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  {serverError && (
                    <div className="p-3 bg-red/10 border border-red/30 rounded-xl text-red text-xs">
                      {serverError}
                    </div>
                  )}

                  {/* Section 1: Referrer Details */}
                  <div className="bg-white/5 border border-white/5 rounded-xl p-3.5 space-y-3">
                    <span className="text-[11px] font-accent font-bold uppercase tracking-wider text-amber-400 block">
                      1. Your Details (Referrer — where we send the reward)
                    </span>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <Input
                        label="Your Full Name *"
                        name="referrerName"
                        placeholder="e.g. Rajesh Kumar"
                        value={formData.referrerName}
                        onChange={handleChange}
                        error={errors.referrerName}
                        className="bg-black/40 border-white/10"
                      />
                      <Input
                        label="Your Mobile Number (for Payout) *"
                        name="referrerPhone"
                        placeholder="10-digit mobile number"
                        value={formData.referrerPhone}
                        onChange={handleChange}
                        error={errors.referrerPhone}
                        className="bg-black/40 border-white/10"
                      />
                    </div>
                    <Input
                      label="Your UPI ID or Bank Details (Optional)"
                      name="referrerUpi"
                      placeholder="e.g. rajesh@upi or Google Pay / PhonePe number"
                      value={formData.referrerUpi}
                      onChange={handleChange}
                      className="bg-black/40 border-white/10"
                    />
                  </div>

                  {/* Section 2: Prospect Details */}
                  <div className="bg-white/5 border border-white/5 rounded-xl p-3.5 space-y-3">
                    <span className="text-[11px] font-accent font-bold uppercase tracking-wider text-amber-400 block">
                      2. Person or Business You Are Referring
                    </span>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <Input
                        label="Friend / Client Name *"
                        name="clientName"
                        placeholder="e.g. Suresh Patel"
                        value={formData.clientName}
                        onChange={handleChange}
                        error={errors.clientName}
                        className="bg-black/40 border-white/10"
                      />
                      <Input
                        label="Friend / Client Mobile Number *"
                        name="clientPhone"
                        placeholder="10-digit mobile number"
                        value={formData.clientPhone}
                        onChange={handleChange}
                        error={errors.clientPhone}
                        className="bg-black/40 border-white/10"
                      />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <Input
                        label="Location / City / Town *"
                        name="clientCity"
                        placeholder="e.g. Coimbatore, Pollachi, Tiruppur"
                        value={formData.clientCity}
                        onChange={handleChange}
                        error={errors.clientCity}
                        className="bg-black/40 border-white/10"
                      />
                      <div>
                        <label className="block text-xs font-medium text-gray-300 mb-1">
                          Estimated System Capacity
                        </label>
                        <div className="px-3 py-2 bg-black/40 border border-white/10 rounded-lg text-sm text-amber-300 font-bold">
                          {capacity} kW (Expected Reward: {formattedReward})
                        </div>
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-gray-300 mb-1">
                        Additional Notes (Optional)
                      </label>
                      <textarea
                        name="notes"
                        rows="2"
                        value={formData.notes}
                        onChange={handleChange}
                        placeholder="e.g. Looking for rooftop solar for new home; best time to call is evening."
                        className="w-full bg-black/40 border border-white/10 rounded-lg p-2.5 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-amber-400 transition-colors"
                      />
                    </div>
                  </div>

                  <Button
                    type="submit"
                    variant="primary"
                    size="lg"
                    isLoading={isLoading}
                    className="w-full justify-center !bg-gradient-to-r !from-amber-500 !to-red hover:brightness-110 !border-none !text-black font-extrabold tracking-wide text-sm sm:text-base py-3"
                    icon={<FiArrowRight size={18} />}
                  >
                    Submit Referral & Lock In Reward ({formattedReward})
                  </Button>
                </form>
              )}
            </div>
          )}

          {/* Tab 2: WhatsApp Share */}
          {activeTab === 'share' && (
            <div className="space-y-4">
              <div className="p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-xl space-y-2">
                <span className="text-xs font-accent font-bold text-emerald-400 uppercase tracking-wider block">
                  Quick Share Recommendation
                </span>
                <p className="text-xs text-gray-300">
                  Enter your name so friends know who referred them, then tap WhatsApp to send or copy message.
                </p>
                <Input
                  label="Your Name (Optional - appears in message)"
                  name="referrerName"
                  placeholder="Enter your name"
                  value={formData.referrerName}
                  onChange={handleChange}
                  className="bg-black/40 border-white/10"
                />
              </div>

              {/* Message Preview */}
              <div className="relative p-3.5 bg-black/60 border border-white/10 rounded-xl font-mono text-xs text-gray-300 whitespace-pre-wrap leading-relaxed">
                {shareMessage}
              </div>

              <div className="flex flex-col sm:flex-row gap-3">
                <button
                  type="button"
                  onClick={handleWhatsAppShare}
                  className="flex-1 flex items-center justify-center gap-2 bg-[#25D366] hover:bg-[#20ba59] text-white font-bold py-3 px-4 rounded-xl text-sm transition-all shadow-lg shadow-emerald-950/40"
                >
                  <FaWhatsapp size={18} /> Share on WhatsApp
                </button>
                <button
                  type="button"
                  onClick={handleCopyMessage}
                  className="flex items-center justify-center gap-2 bg-white/10 hover:bg-white/20 text-white font-bold py-3 px-4 rounded-xl text-sm transition-all"
                >
                  {copied ? <FiCheck className="text-emerald-400" /> : <FiCopy />}
                  {copied ? 'Copied to Clipboard!' : 'Copy Message'}
                </button>
              </div>
            </div>
          )}

          {/* Tab 3: Contact Referral Desk */}
          {activeTab === 'contact' && (
            <div className="p-5 bg-white/5 border border-white/10 rounded-2xl space-y-4 text-center">
              <div className="w-12 h-12 rounded-full bg-red/20 text-red border border-red/30 flex items-center justify-center mx-auto text-xl">
                <FiPhone />
              </div>
              <h4 className="text-lg font-heading font-bold text-white">
                Connect Directly with SPC Referral Desk
              </h4>
              <p className="text-xs text-gray-300 max-w-md mx-auto">
                Have a large industrial or commercial project referral? Or want to become an official SPC Solar business channel partner?
              </p>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-w-md mx-auto pt-2">
                <a
                  href="https://wa.me/918098744044?text=Hi%20SPC%20Solar,%20I%20have%20a%20solar%20referral%20lead%20to%20discuss."
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 bg-[#25D366] hover:bg-[#20ba59] text-white font-bold py-2.5 px-4 rounded-xl text-xs sm:text-sm transition-all"
                >
                  <FaWhatsapp size={16} /> WhatsApp: 80987 44044
                </a>
                <a
                  href="tel:+918098744044"
                  className="flex items-center justify-center gap-2 bg-red hover:bg-red-dark text-white font-bold py-2.5 px-4 rounded-xl text-xs sm:text-sm transition-all"
                >
                  <FiPhone size={16} /> Call: 80987 44044
                </a>
              </div>

              <div className="pt-2 text-[11px] text-gray-400">
                Direct Helpline: <a href="tel:+918489644044" className="text-white hover:underline">+91 84896 44044</a>
              </div>
            </div>
          )}

        </div>

        {/* Modal Footer */}
        <div className="p-3 sm:p-4 bg-black/60 border-t border-white/5 text-center text-[11px] text-gray-400 flex flex-wrap items-center justify-center gap-x-4 gap-y-1">
          <span>* ₹2,000/1kW credited after client full payment clearance.</span>
          <span>No ceiling on maximum earnings.</span>
          <span>Open to all customers, partners, and public!</span>
        </div>
      </motion.div>
    </div>
  );
};

export default ReferralModal;
