import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  FiUser, 
  FiMail, 
  FiPhone, 
  FiMapPin, 
  FiLock, 
  FiEye, 
  FiEyeOff, 
  FiArrowRight, 
  FiShield, 
  FiSun, 
  FiCheckCircle, 
  FiZap,
  FiGift
} from 'react-icons/fi';
import { useUserAuth } from '../../context/UserAuthContext';
import api from '../../services/api';
import SEOHead from '../../components/ui/SEOHead';
import Logo from '../../assets/Logo.png';

const UserRegisterPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    city: 'Coimbatore',
    state: 'Tamil Nadu',
    password: '',
    confirmPassword: '',
  });

  const [couponConfig, setCouponConfig] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [formError, setFormError] = useState('');

  const { register } = useUserAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCouponConfig = async () => {
      try {
        const res = await api.get('/coupon/config');
        if (res.data?.isActive) {
          setCouponConfig(res.data);
        }
      } catch (err) {
        console.warn('Could not load coupon config');
      }
    };
    fetchCouponConfig();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (formError) setFormError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError('');

    if (!formData.name.trim() || !formData.email.trim() || !formData.password) {
      setFormError('Please fill in all required fields');
      return;
    }

    if (formData.password.length < 6) {
      setFormError('Password must be at least 6 characters long');
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setFormError('Passwords do not match');
      return;
    }

    setIsLoading(true);
    const res = await register({
      name: formData.name.trim(),
      email: formData.email.trim(),
      phone: formData.phone.trim(),
      password: formData.password,
      address: {
        city: formData.city.trim(),
        state: formData.state.trim(),
      },
    });
    setIsLoading(false);

    if (res.success) {
      navigate('/dashboard', { replace: true });
    } else {
      setFormError(res.message || 'Registration failed. Please try again.');
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      <SEOHead
        title="Create Customer Account | SPC Solar"
        description="Register for an SPC Solar account to save rooftop solar estimates, track quotes, and get subsidized solar installation updates."
      />

      {/* Decorative Glow Background */}
      <div className="absolute top-1/6 -left-36 w-96 h-96 bg-red/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/6 -right-36 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute inset-0 grid-overlay opacity-30 pointer-events-none" />

      <div className="sm:mx-auto sm:w-full sm:max-w-xl relative z-10">
        {/* Brand Header */}
        <div className="text-center">
          <Link to="/" className="inline-block transform transition hover:scale-105">
            <img src={Logo} alt="SPC Solar" className="h-14 mx-auto object-contain" />
          </Link>
          <div className="mt-4 inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-white/5 border border-white/10 text-xs font-accent text-white/80">
            <FiSun className="text-red" /> PM Surya Ghar Partner Network
          </div>
          <h2 className="mt-3 text-3xl font-heading tracking-wide uppercase font-bold text-white">
            Create Your <span className="text-red">Solar Account</span>
          </h2>
          <p className="mt-2 text-sm text-white/60">
            Save custom solar quotes, calculate ROI, and schedule free site surveys
          </p>
        </div>

        {/* Register Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="mt-8 bg-[#141414] border border-white/10 rounded-2xl p-6 sm:p-8 shadow-2xl backdrop-blur-md"
        >
          {formError && (
            <div className="mb-6 p-3.5 rounded-xl bg-red/10 border border-red/30 text-red text-sm flex items-start gap-2.5">
              <span className="text-base leading-none font-bold">!</span>
              <span>{formError}</span>
            </div>
          )}

          {couponConfig && (
            <div className="mb-6 p-4 rounded-2xl bg-gradient-to-r from-amber-500/15 via-red/10 to-amber-500/10 border border-amber-500/30 flex items-start gap-3.5">
              <div className="p-2.5 bg-amber-500/20 text-amber-300 rounded-xl flex-shrink-0 mt-0.5">
                <FiGift className="w-5 h-5" />
              </div>
              <div className="text-xs">
                <span className="font-accent font-bold uppercase text-amber-400 tracking-wider flex items-center gap-1.5">
                  New Customer Bonus Included!
                </span>
                <p className="text-white/80 mt-0.5 leading-relaxed">
                  Register today and automatically get a <strong className="text-white font-bold">₹{couponConfig.discountAmount?.toLocaleString()}</strong> Welcome Voucher (<span className="font-mono text-amber-300 font-bold">{couponConfig.couponCode}</span>) deducted from your final turnkey solar installation invoice after setup!
                </p>
              </div>
            </div>
          )}

          <form className="space-y-4" onSubmit={handleSubmit}>
            {/* Full Name */}
            <div>
              <label className="block text-xs font-accent font-semibold text-white/80 uppercase tracking-wider mb-1.5">
                Full Name *
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-white/40">
                  <FiUser className="w-5 h-5" />
                </div>
                <input
                  type="text"
                  name="name"
                  required
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="e.g. Ramesh Kumar"
                  className="w-full pl-11 pr-4 py-3 bg-white/5 border border-white/15 rounded-xl text-white placeholder-white/30 text-sm focus:outline-none focus:border-red focus:ring-1 focus:ring-red transition-all"
                />
              </div>
            </div>

            {/* Email & Phone Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-accent font-semibold text-white/80 uppercase tracking-wider mb-1.5">
                  Email Address *
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-white/40">
                    <FiMail className="w-5 h-5" />
                  </div>
                  <input
                    type="email"
                    name="email"
                    required
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="ramesh@example.com"
                    className="w-full pl-11 pr-4 py-3 bg-white/5 border border-white/15 rounded-xl text-white placeholder-white/30 text-sm focus:outline-none focus:border-red focus:ring-1 focus:ring-red transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-accent font-semibold text-white/80 uppercase tracking-wider mb-1.5">
                  Mobile Number
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-white/40">
                    <FiPhone className="w-5 h-5" />
                  </div>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="+91 98765 43210"
                    className="w-full pl-11 pr-4 py-3 bg-white/5 border border-white/15 rounded-xl text-white placeholder-white/30 text-sm focus:outline-none focus:border-red focus:ring-1 focus:ring-red transition-all"
                  />
                </div>
              </div>
            </div>

            {/* City & State Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-accent font-semibold text-white/80 uppercase tracking-wider mb-1.5">
                  City / Location
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-white/40">
                    <FiMapPin className="w-5 h-5" />
                  </div>
                  <input
                    type="text"
                    name="city"
                    value={formData.city}
                    onChange={handleChange}
                    placeholder="e.g. Coimbatore"
                    className="w-full pl-11 pr-4 py-3 bg-white/5 border border-white/15 rounded-xl text-white placeholder-white/30 text-sm focus:outline-none focus:border-red focus:ring-1 focus:ring-red transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-accent font-semibold text-white/80 uppercase tracking-wider mb-1.5">
                  State
                </label>
                <input
                  type="text"
                  name="state"
                  value={formData.state}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-white/5 border border-white/15 rounded-xl text-white text-sm focus:outline-none focus:border-red focus:ring-1 focus:ring-red transition-all"
                />
              </div>
            </div>

            {/* Password & Confirm Password */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-accent font-semibold text-white/80 uppercase tracking-wider mb-1.5">
                  Password * (min 6 chars)
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-white/40">
                    <FiLock className="w-5 h-5" />
                  </div>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    name="password"
                    required
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="••••••••"
                    className="w-full pl-11 pr-11 py-3 bg-white/5 border border-white/15 rounded-xl text-white placeholder-white/30 text-sm focus:outline-none focus:border-red focus:ring-1 focus:ring-red transition-all"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-white/40 hover:text-white transition-colors"
                  >
                    {showPassword ? <FiEyeOff className="w-4 h-4" /> : <FiEye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-xs font-accent font-semibold text-white/80 uppercase tracking-wider mb-1.5">
                  Confirm Password *
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-white/40">
                    <FiLock className="w-5 h-5" />
                  </div>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    name="confirmPassword"
                    required
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    placeholder="••••••••"
                    className="w-full pl-11 pr-4 py-3 bg-white/5 border border-white/15 rounded-xl text-white placeholder-white/30 text-sm focus:outline-none focus:border-red focus:ring-1 focus:ring-red transition-all"
                  />
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <div className="pt-3">
              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3.5 px-4 bg-red hover:bg-red-dark text-white font-accent font-bold uppercase tracking-wider text-sm rounded-xl shadow-lg shadow-red/20 transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed group"
              >
                {isLoading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    <span>Creating Your Account...</span>
                  </>
                ) : (
                  <>
                    <span>Create Customer Account</span>
                    <FiArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </>
                )}
              </button>
            </div>
          </form>

          {/* Value Props */}
          <div className="mt-6 pt-6 border-t border-white/10 grid grid-cols-2 gap-3 text-xs text-white/60">
            <div className="flex items-center gap-2">
              <FiCheckCircle className="text-green-500 w-3.5 h-3.5 flex-shrink-0" />
              <span>₹78,000 Direct Subsidy Assistance</span>
            </div>
            <div className="flex items-center gap-2">
              <FiCheckCircle className="text-green-500 w-3.5 h-3.5 flex-shrink-0" />
              <span>30-Year Performance Warranty</span>
            </div>
          </div>

          {/* Login Link */}
          <div className="mt-6 text-center text-sm text-white/70">
            Already have a customer account?{' '}
            <Link
              to="/login"
              className="text-red font-semibold hover:underline transition-colors ml-1"
            >
              Sign In
            </Link>
          </div>
        </motion.div>

        {/* Footer Navigation */}
        <div className="mt-8 flex items-center justify-between text-xs text-white/40 px-2">
          <Link to="/" className="hover:text-white transition-colors flex items-center gap-1">
            ← Back to Home
          </Link>
          <Link to="/admin/login" className="hover:text-red transition-colors flex items-center gap-1">
            <FiShield className="w-3.5 h-3.5" /> Admin Portal
          </Link>
        </div>
      </div>
    </div>
  );
};

export default UserRegisterPage;
