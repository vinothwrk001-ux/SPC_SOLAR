import React, { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiMail, FiLock, FiEye, FiEyeOff, FiArrowRight, FiShield, FiSun, FiCheckCircle } from 'react-icons/fi';
import { useUserAuth } from '../../context/UserAuthContext';
import Button from '../../components/ui/Button';
import SEOHead from '../../components/ui/SEOHead';
import Logo from '../../assets/Logo.png';

const UserLoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [formError, setFormError] = useState('');

  const { login } = useUserAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state?.from?.pathname || '/dashboard';

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError('');

    if (!email || !password) {
      setFormError('Please fill in all fields');
      return;
    }

    setIsLoading(true);
    const res = await login(email, password);
    setIsLoading(false);

    if (res.success) {
      navigate(from, { replace: true });
    } else {
      setFormError(res.message || 'Login failed. Please check your credentials.');
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      <SEOHead
        title="Customer Login | SPC Solar"
        description="Sign in to your SPC Solar account to view quotation history, solar savings, and project updates."
      />

      {/* Decorative Solar Glow Elements */}
      <div className="absolute top-1/4 -left-32 w-96 h-96 bg-red/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 -right-32 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute inset-0 grid-overlay opacity-30 pointer-events-none" />

      <div className="sm:mx-auto sm:w-full sm:max-w-md relative z-10">
        {/* Brand Header */}
        <div className="text-center">
          <Link to="/" className="inline-block transform transition hover:scale-105">
            <img src={Logo} alt="SPC Solar" className="h-14 mx-auto object-contain" />
          </Link>
          <div className="mt-4 inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs font-accent text-white/80">
            <FiSun className="text-red" /> Customer Account Portal
          </div>
          <h2 className="mt-3 text-3xl font-heading tracking-wide uppercase font-bold text-white">
            Welcome <span className="text-red">Back</span>
          </h2>
          <p className="mt-2 text-sm text-white/60">
            Access your saved solar quotes, estimates, and consultations
          </p>
        </div>

        {/* Login Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="mt-8 bg-[#141414] border border-white/10 rounded-2xl p-8 shadow-2xl backdrop-blur-md"
        >
          {formError && (
            <div className="mb-6 p-3.5 rounded-xl bg-red/10 border border-red/30 text-red text-sm flex items-start gap-2.5">
              <span className="text-base leading-none font-bold">!</span>
              <span>{formError}</span>
            </div>
          )}

          <form className="space-y-5" onSubmit={handleSubmit}>
            {/* Email Field */}
            <div>
              <label className="block text-xs font-accent font-semibold text-white/80 uppercase tracking-wider mb-2">
                Email Address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-white/40">
                  <FiMail className="w-5 h-5" />
                </div>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@example.com"
                  className="w-full pl-11 pr-4 py-3 bg-white/5 border border-white/15 rounded-xl text-white placeholder-white/30 text-sm focus:outline-none focus:border-red focus:ring-1 focus:ring-red transition-all"
                />
              </div>
            </div>

            {/* Password Field */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="block text-xs font-accent font-semibold text-white/80 uppercase tracking-wider">
                  Password
                </label>
              </div>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-white/40">
                  <FiLock className="w-5 h-5" />
                </div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-11 pr-11 py-3 bg-white/5 border border-white/15 rounded-xl text-white placeholder-white/30 text-sm focus:outline-none focus:border-red focus:ring-1 focus:ring-red transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-white/40 hover:text-white transition-colors"
                >
                  {showPassword ? <FiEyeOff className="w-5 h-5" /> : <FiEye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <div className="pt-2">
              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3.5 px-4 bg-red hover:bg-red-dark text-white font-accent font-bold uppercase tracking-wider text-sm rounded-xl shadow-lg shadow-red/20 transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed group"
              >
                {isLoading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    <span>Signing In...</span>
                  </>
                ) : (
                  <>
                    <span>Sign In to Account</span>
                    <FiArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </>
                )}
              </button>
            </div>
          </form>

          {/* Quick Features List */}
          <div className="mt-6 pt-6 border-t border-white/10 space-y-2 text-xs text-white/60">
            <div className="flex items-center gap-2">
              <FiCheckCircle className="text-green-500 w-3.5 h-3.5 flex-shrink-0" />
              <span>Track your custom rooftop solar quotes in real time</span>
            </div>
            <div className="flex items-center gap-2">
              <FiCheckCircle className="text-green-500 w-3.5 h-3.5 flex-shrink-0" />
              <span>Direct access to download formal PDF estimates</span>
            </div>
          </div>

          {/* Registration Link */}
          <div className="mt-6 text-center text-sm text-white/70">
            Don't have a customer account?{' '}
            <Link
              to="/register"
              className="text-red font-semibold hover:underline transition-colors ml-1"
            >
              Sign Up Now
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

export default UserLoginPage;
