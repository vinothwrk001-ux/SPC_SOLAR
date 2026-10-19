import React, { useState, useEffect } from 'react';
import Modal from '../ui/Modal';
import { useUserAuth } from '../../context/UserAuthContext';
import { FiMail, FiLock, FiUser, FiPhone, FiEye, FiEyeOff, FiCheckCircle, FiZap } from 'react-icons/fi';

const UserAuthModal = ({ isOpen, onClose, initialTab = 'login', onAuthSuccess }) => {
  const { login, register } = useUserAuth();
  const [activeTab, setActiveTab] = useState(initialTab); // 'login' | 'register'
  const [showPassword, setShowPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  // Form states
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');

  const [registerName, setRegisterName] = useState('');
  const [registerPhone, setRegisterPhone] = useState('');
  const [registerEmail, setRegisterEmail] = useState('');
  const [registerPassword, setRegisterPassword] = useState('');

  useEffect(() => {
    if (isOpen) {
      setActiveTab(initialTab);
      setErrorMsg('');
      setShowPassword(false);
    }
  }, [isOpen, initialTab]);

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');

    if (!loginEmail || !loginPassword) {
      setErrorMsg('Please enter both email and password.');
      return;
    }

    setSubmitting(true);
    const result = await login(loginEmail, loginPassword);
    setSubmitting(false);

    if (result.success) {
      if (onAuthSuccess) onAuthSuccess(result.data);
      onClose();
    } else {
      setErrorMsg(result.error);
    }
  };

  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');

    if (!registerName.trim()) {
      setErrorMsg('Please enter your full name.');
      return;
    }
    if (!registerEmail.trim()) {
      setErrorMsg('Please enter a valid email address.');
      return;
    }
    if (!registerPassword || registerPassword.length < 6) {
      setErrorMsg('Password must be at least 6 characters long.');
      return;
    }

    setSubmitting(true);
    const result = await register({
      name: registerName,
      email: registerEmail,
      password: registerPassword,
      phone: registerPhone,
    });
    setSubmitting(false);

    if (result.success) {
      if (onAuthSuccess) onAuthSuccess(result.data);
      onClose();
    } else {
      setErrorMsg(result.error);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title=""
      size="sm"
    >
      <div className="-mt-3">
        {/* Header Branding */}
        <div className="text-center mb-5">
          <div className="w-12 h-12 rounded-2xl bg-red/10 text-red flex items-center justify-center mx-auto mb-2 shadow-xs">
            <FiZap className="w-6 h-6" />
          </div>
          <h3 className="font-heading font-extrabold text-xl text-gray-900 tracking-tight">
            {activeTab === 'login' ? 'Customer Sign In' : 'Create Free Account'}
          </h3>
          <p className="text-xs text-gray-500 mt-1 max-w-xs mx-auto">
            Log in to view complete turnkey investment figures, PM Surya Ghar subsidy, and exact returns.
          </p>
        </div>

        {/* Tab Toggle */}
        <div className="grid grid-cols-2 p-1 bg-gray-100 rounded-xl mb-4 border border-gray-200/80">
          <button
            type="button"
            onClick={() => { setActiveTab('login'); setErrorMsg(''); }}
            className={`py-2 text-xs font-heading font-bold rounded-lg transition-all ${
              activeTab === 'login'
                ? 'bg-white text-gray-900 shadow-xs'
                : 'text-gray-500 hover:text-gray-900'
            }`}
          >
            Log In
          </button>
          <button
            type="button"
            onClick={() => { setActiveTab('register'); setErrorMsg(''); }}
            className={`py-2 text-xs font-heading font-bold rounded-lg transition-all ${
              activeTab === 'register'
                ? 'bg-white text-gray-900 shadow-xs'
                : 'text-gray-500 hover:text-gray-900'
            }`}
          >
            Create Account
          </button>
        </div>

        {/* Error message */}
        {errorMsg && (
          <div className="mb-4 p-2.5 rounded-lg bg-red/10 border border-red/30 text-red text-xs font-medium">
            {errorMsg}
          </div>
        )}

        {/* ================= LOGIN FORM ================= */}
        {activeTab === 'login' ? (
          <form onSubmit={handleLoginSubmit} className="space-y-3.5">
            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-gray-600 mb-1">
                Email Address
              </label>
              <div className="relative">
                <FiMail className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="email"
                  value={loginEmail}
                  onChange={(e) => setLoginEmail(e.target.value)}
                  placeholder="yourname@gmail.com"
                  className="w-full pl-10 pr-3 py-2.5 text-xs sm:text-sm border border-gray-200 rounded-xl focus:outline-none focus:border-red focus:ring-1 focus:ring-red bg-gray-50/50"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-gray-600 mb-1">
                Password
              </label>
              <div className="relative">
                <FiLock className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={loginPassword}
                  onChange={(e) => setLoginPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-10 py-2.5 text-xs sm:text-sm border border-gray-200 rounded-xl focus:outline-none focus:border-red focus:ring-1 focus:ring-red bg-gray-50/50"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? <FiEyeOff size={15} /> : <FiEye size={15} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="w-full py-3 bg-red hover:bg-red-700 text-white font-heading font-bold text-xs sm:text-sm rounded-xl shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 mt-4 active:scale-98 disabled:opacity-60"
            >
              {submitting ? (
                <span className="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  <FiLock className="w-4 h-4" />
                  <span>Log In & Reveal Price</span>
                </>
              )}
            </button>

            <div className="text-center pt-2">
              <span className="text-xs text-gray-500">
                Don't have an account?{' '}
                <button
                  type="button"
                  onClick={() => { setActiveTab('register'); setErrorMsg(''); }}
                  className="text-red font-bold hover:underline"
                >
                  Sign up free
                </button>
              </span>
            </div>
          </form>
        ) : (
          /* ================= REGISTER FORM ================= */
          <form onSubmit={handleRegisterSubmit} className="space-y-3">
            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-gray-600 mb-1">
                Full Name
              </label>
              <div className="relative">
                <FiUser className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  value={registerName}
                  onChange={(e) => setRegisterName(e.target.value)}
                  placeholder="e.g. Ramesh Kumar"
                  className="w-full pl-10 pr-3 py-2.5 text-xs sm:text-sm border border-gray-200 rounded-xl focus:outline-none focus:border-red focus:ring-1 focus:ring-red bg-gray-50/50"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-gray-600 mb-1">
                Phone Number (Optional)
              </label>
              <div className="relative">
                <FiPhone className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="tel"
                  value={registerPhone}
                  onChange={(e) => setRegisterPhone(e.target.value.replace(/\D/g, '').slice(0, 10))}
                  placeholder="98765 43210"
                  className="w-full pl-10 pr-3 py-2.5 text-xs sm:text-sm border border-gray-200 rounded-xl focus:outline-none focus:border-red focus:ring-1 focus:ring-red bg-gray-50/50"
                />
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-gray-600 mb-1">
                Email Address
              </label>
              <div className="relative">
                <FiMail className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="email"
                  value={registerEmail}
                  onChange={(e) => setRegisterEmail(e.target.value)}
                  placeholder="yourname@gmail.com"
                  className="w-full pl-10 pr-3 py-2.5 text-xs sm:text-sm border border-gray-200 rounded-xl focus:outline-none focus:border-red focus:ring-1 focus:ring-red bg-gray-50/50"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-gray-600 mb-1">
                Create Password
              </label>
              <div className="relative">
                <FiLock className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={registerPassword}
                  onChange={(e) => setRegisterPassword(e.target.value)}
                  placeholder="At least 6 characters"
                  className="w-full pl-10 pr-10 py-2.5 text-xs sm:text-sm border border-gray-200 rounded-xl focus:outline-none focus:border-red focus:ring-1 focus:ring-red bg-gray-50/50"
                  required
                  minLength={6}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? <FiEyeOff size={15} /> : <FiEye size={15} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="w-full py-3 bg-red hover:bg-red-700 text-white font-heading font-bold text-xs sm:text-sm rounded-xl shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 mt-4 active:scale-98 disabled:opacity-60"
            >
              {submitting ? (
                <span className="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  <FiCheckCircle className="w-4 h-4" />
                  <span>Create Account & Reveal Price</span>
                </>
              )}
            </button>

            <div className="text-center pt-2">
              <span className="text-xs text-gray-500">
                Already registered?{' '}
                <button
                  type="button"
                  onClick={() => { setActiveTab('login'); setErrorMsg(''); }}
                  className="text-red font-bold hover:underline"
                >
                  Log in
                </button>
              </span>
            </div>
          </form>
        )}
      </div>
    </Modal>
  );
};

export default UserAuthModal;
