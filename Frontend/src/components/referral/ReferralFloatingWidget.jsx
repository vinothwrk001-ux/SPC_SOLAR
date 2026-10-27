import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { FiGift, FiArrowRight, FiX } from 'react-icons/fi';

const ReferralFloatingWidget = () => {
  // Closed by default; opens only when the user touches/clicks the icon
  const [isMinimized, setIsMinimized] = useState(true);
  const location = useLocation();
  const navigate = useNavigate();
  const isQuotationPage = location.pathname.startsWith('/quotation');

  const handleClick = () => {
    if (location.pathname === '/services') {
      const el = document.getElementById('referral-program');
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'center' });
        return;
      }
    }
    navigate('/services#referral-program');
  };

  return (
    <div className={`fixed ${isQuotationPage ? 'bottom-16 sm:bottom-5' : 'bottom-3 sm:bottom-5'} right-2.5 sm:right-6 z-40 select-none flex flex-col items-end`}>
      <AnimatePresence mode="wait">
        {!isMinimized ? (
          <motion.div
            key="expanded"
            initial={{ opacity: 0, y: 15, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            className="group relative flex items-center"
          >
            {/* Glowing Pulse Halo */}
            <span className="absolute -inset-1 rounded-full bg-gradient-to-r from-amber-500 via-red to-amber-500 opacity-60 blur-md group-hover:opacity-100 transition duration-500 animate-pulse pointer-events-none" />

            {/* Main Pill Button */}
            <div
              onClick={handleClick}
              className="relative flex items-center gap-2 sm:gap-3 bg-[#0D0F14] hover:bg-[#151921] text-white pl-2 sm:pl-2.5 pr-2.5 sm:pr-3.5 py-1.5 sm:py-2.5 rounded-full border border-amber-400/50 shadow-2xl shadow-black/80 cursor-pointer transition-all duration-300"
            >
              {/* Left Gift Icon with Circular Gradient */}
              <div className="w-7 h-7 sm:w-9 sm:h-9 rounded-full bg-gradient-to-tr from-amber-500 to-amber-300 text-black flex items-center justify-center font-bold shadow-md shadow-amber-500/30 shrink-0">
                <FiGift className="w-3.5 h-3.5 sm:w-4 sm:h-4 animate-bounce" />
              </div>

              {/* Text Information */}
              <div className="flex flex-col text-left">
                <span className="text-[8px] sm:text-[9px] font-accent font-extrabold uppercase tracking-widest text-amber-400 leading-none">
                  Refer & Earn
                </span>
                <span className="text-[11px] sm:text-sm font-heading font-extrabold text-white leading-tight flex items-center gap-1">
                  ₹2,000 <span className="text-[9px] sm:text-xs text-gray-300 font-normal">/ 1kW</span>
                </span>
              </div>

              {/* Arrow */}
              <div className="hidden xs:flex items-center justify-center w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-white/10 group-hover:bg-amber-400 group-hover:text-black transition-colors shrink-0 ml-0.5 sm:ml-1">
                <FiArrowRight size={12} className="group-hover:translate-x-0.5 transition-transform" />
              </div>

              {/* Minimize Trigger */}
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setIsMinimized(true);
                }}
                className="text-gray-400 hover:text-white ml-0.5 p-0.5 sm:p-1 rounded-full hover:bg-white/10 transition-colors"
                title="Minimize referral widget"
                aria-label="Minimize referral widget"
              >
                <FiX className="w-3 h-3 sm:w-3 sm:h-3" />
              </button>
            </div>
          </motion.div>
        ) : (
          <motion.button
            key="minimized"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            onClick={() => setIsMinimized(false)}
            className="group relative w-9 h-9 sm:w-12 sm:h-12 rounded-full bg-gradient-to-tr from-amber-500 to-red p-0.5 shadow-xl shadow-black/70 flex items-center justify-center cursor-pointer transition-transform hover:scale-110 active:scale-95"
            title="Refer & Earn ₹2,000/kW"
            aria-label="Refer & Earn ₹2,000/kW"
          >
            {/* Pulsing ring */}
            <span className="absolute -inset-1 rounded-full bg-amber-400/40 animate-ping pointer-events-none" />
            
            <div className="w-full h-full rounded-full bg-black flex items-center justify-center text-amber-400 group-hover:text-amber-300">
              <FiGift className="w-4 h-4 sm:w-5 sm:h-5" />
            </div>

            {/* Tiny Badge */}
            <span className="absolute -top-1 -right-1 bg-red text-white text-[7px] sm:text-[9px] font-bold px-0.5 sm:px-1 rounded-full border border-black leading-tight">
              ₹2k
            </span>
          </motion.button>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ReferralFloatingWidget;
