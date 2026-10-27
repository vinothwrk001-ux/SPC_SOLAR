import React from 'react';
import { FiGift, FiCheckCircle } from 'react-icons/fi';

const REWARD_CHIPS = [
  { kw: '3 kW Home', payout: '₹6,000' },
  { kw: '5 kW Villa', payout: '₹10,000' },
  { kw: '10 kW Commercial', payout: '₹20,000' },
  { kw: '50 kW Factory', payout: '₹1,00,000' },
];

const ReferralCard = ({ className = '' }) => {
  return (
    <div 
      id="referral-program"
      className={`relative overflow-hidden rounded-2xl sm:rounded-3xl bg-gradient-to-br from-[#120505] via-[#1E0D07] to-[#0A0707] border-2 border-amber-500/40 p-5 sm:p-8 md:p-10 shadow-2xl shadow-amber-950/20 text-white ${className}`}
    >
      {/* Background Glows & Accent Grid */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-80 h-80 bg-red/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -top-12 -right-12 w-36 h-36 bg-amber-400/5 rounded-full blur-xl pointer-events-none" />

      <div className="relative z-10 max-w-4xl mx-auto text-center space-y-4 sm:space-y-6">
        
        {/* Top Highlight Badge */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-gradient-to-r from-amber-500/20 via-red/20 to-amber-500/20 border border-amber-400/40 text-amber-300 text-xs sm:text-sm font-accent font-extrabold uppercase tracking-widest shadow-sm">
          <FiGift className="text-amber-400 animate-bounce" size={16} />
          <span>High-Reward Partner Program</span>
        </div>

        {/* Main Headline */}
        <div>
          <h3 className="font-heading text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-black text-white tracking-tight leading-tight">
            Refer & Earn <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-amber-400 to-yellow-200">₹2,000 per 1kW</span>
          </h3>
          <p className="mt-2 text-gray-300 font-body text-xs sm:text-sm md:text-base max-w-2xl mx-auto leading-relaxed">
            Turn your connections into real cash rewards. Earn flat <strong>₹2,000 for every 1 kW</strong> installed when you refer friends, family, residential colonies, or commercial enterprises.
          </p>
        </div>

        {/* Reward Chips Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 sm:gap-3 max-w-3xl mx-auto pt-1">
          {REWARD_CHIPS.map((chip, idx) => (
            <div 
              key={idx}
              className="bg-white/5 hover:bg-white/10 border border-amber-400/20 hover:border-amber-400/50 rounded-xl p-3 sm:p-4 text-center transition-all duration-200 group"
            >
              <div className="text-[10px] sm:text-xs font-accent text-gray-400 uppercase tracking-wider group-hover:text-amber-300 transition-colors">
                {chip.kw}
              </div>
              <div className="text-lg sm:text-xl md:text-2xl font-heading font-black text-amber-300 mt-0.5">
                {chip.payout}
              </div>
              <div className="text-[9px] text-gray-400">Cash Payout</div>
            </div>
          ))}
        </div>

        {/* Condition Footer */}
        <div className="pt-2 text-[11px] sm:text-xs text-gray-400 flex flex-wrap items-center justify-center gap-x-3 gap-y-1">
          <span className="flex items-center gap-1 text-emerald-400">
            <FiCheckCircle size={13} /> Direct bank/UPI transfer
          </span>
          <span>&bull;</span>
          <span>Credited after getting full payment from the client</span>
          <span>&bull;</span>
          <span className="text-amber-300/90 font-medium">No maximum earning limit</span>
        </div>

      </div>
    </div>
  );
};

export default ReferralCard;
