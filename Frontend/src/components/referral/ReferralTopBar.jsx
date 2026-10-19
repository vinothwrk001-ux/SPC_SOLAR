import React, { useState } from 'react';
import { FiGift, FiArrowRight, FiX } from 'react-icons/fi';

const ReferralTopBar = ({ onOpenModal, scrolled = false }) => {
  const [isVisible, setIsVisible] = useState(() => {
    return sessionStorage.getItem('spc_referral_topbar_dismissed') !== 'true';
  });

  const handleDismiss = (e) => {
    e.stopPropagation();
    setIsVisible(false);
    sessionStorage.setItem('spc_referral_topbar_dismissed', 'true');
  };

  const handleOpen = () => {
    if (onOpenModal) {
      onOpenModal();
    } else {
      window.dispatchEvent(new CustomEvent('open-referral-modal'));
    }
  };

  if (!isVisible) return null;

  return (
    <div 
      onClick={handleOpen}
      className={`relative z-[55] w-full bg-gradient-to-r from-[#170505] via-[#241306] via-[#1F0808] to-[#170505] text-white px-3 sm:px-6 cursor-pointer border-b border-amber-500/30 shadow-md shadow-black/40 overflow-hidden group select-none transition-all duration-300 hover:brightness-110 ${
        scrolled 
          ? 'hidden md:block py-1 text-[11px]' 
          : 'block py-1.5 sm:py-2 text-xs'
      }`}
    >
      {/* Background Animated Sheen */}
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-amber-400/10 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000 ease-in-out pointer-events-none" />

      <div className="max-w-7xl mx-auto flex items-center justify-between gap-2 sm:gap-4">
        
        {/* Left / Center Content */}
        <div className="flex items-center gap-2 sm:gap-3.5 mx-auto sm:mx-0 overflow-hidden">
          {/* Badge */}
          <span className="inline-flex items-center gap-1 bg-gradient-to-r from-amber-500 to-amber-600 text-black font-accent font-extrabold text-[10px] sm:text-[11px] px-2 py-0.5 rounded-full uppercase tracking-wider shrink-0 shadow-sm shadow-amber-500/30 animate-pulse">
            <FiGift className="shrink-0" />
            <span className="hidden xs:inline">Refer & Earn</span>
            <span className="xs:hidden">Earn</span>
          </span>

          {/* Main Headline */}
          <p className="font-body text-[11px] sm:text-xs md:text-sm font-medium tracking-tight truncate text-gray-200">
            Earn <strong className="text-amber-300 font-extrabold">₹2,000 per 1kW</strong> on every solar referral!
            <span className="hidden md:inline text-gray-300/80 ml-2">
              (5 kW = <strong className="text-white font-bold">₹10,000</strong> &bull; 50 kW = <strong className="text-white font-bold">₹1,00,000</strong>)
            </span>
          </p>

          {/* Quick CTA Pill */}
          <span className="hidden sm:inline-flex items-center gap-1 text-[11px] font-accent font-bold text-amber-300 bg-amber-500/15 border border-amber-400/30 px-2.5 py-0.5 rounded-md group-hover:bg-amber-400 group-hover:text-black transition-colors shrink-0">
            <span>Refer Now</span>
            <FiArrowRight className="group-hover:translate-x-0.5 transition-transform" />
          </span>
        </div>

        {/* Right Buttons: Mobile action + Dismiss */}
        <div className="flex items-center gap-2 shrink-0">
          <span className="sm:hidden inline-flex items-center gap-1 text-[10px] font-accent font-bold text-amber-300 underline underline-offset-2">
            Refer <FiArrowRight size={10} />
          </span>

          <button
            type="button"
            onClick={handleDismiss}
            aria-label="Dismiss referral announcement"
            className="text-gray-400 hover:text-white p-1 rounded hover:bg-white/10 transition-colors"
          >
            <FiX size={14} />
          </button>
        </div>

      </div>
    </div>
  );
};

export default ReferralTopBar;
