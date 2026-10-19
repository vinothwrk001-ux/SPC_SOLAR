import React from 'react';
import { Link } from 'react-router-dom';
import { FiSun, FiZap } from 'react-icons/fi';

const TICKER_ITEMS = [
  {
    icon: <FiSun className="text-yellow-300 shrink-0" size={14} />,
    text: "Get Up To",
    highlight: "₹78,000 Subsidy",
    suffix: "— Enjoy Your Free Solar Electricity with PM Surya Ghar Yojana!"
  },
  {
    icon: <FiZap className="text-yellow-300 shrink-0" size={14} />,
    text: "Save Up To",
    highlight: "90% on Electricity Bills",
    suffix: "with SPC Solar Rooftop Installation"
  },
  {
    icon: <FiSun className="text-yellow-300 shrink-0" size={14} />,
    text: "Rooftop Solar Subsidy:",
    highlight: "₹78k Direct Bank Subsidy",
    suffix: "Available Now — Apply Today!"
  }
];

const SubsidyTopTicker = ({ scrolled = false }) => {
  return (
    <div 
      className={`relative z-[55] w-full bg-gradient-to-r from-[#8E1212] via-[#CC2222] via-[#B81919] to-[#8E1212] text-white border-b border-black/20 shadow-md select-none overflow-hidden group transition-all duration-300 ${
        scrolled ? 'py-1 text-[11px]' : 'py-1.5 sm:py-2 text-xs'
      }`}
    >
      {/* Background Accent Sheen */}
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent pointer-events-none" />

      <div className="w-full flex items-center justify-between">
        
        {/* Left Clean Badge */}
        <Link 
          to="/subsidy"
          className="relative z-10 flex items-center gap-1.5 bg-black/35 hover:bg-black/50 text-white border border-white/25 px-2.5 sm:px-3 py-1 text-[10px] sm:text-[11px] font-accent font-extrabold uppercase tracking-wider shrink-0 shadow-sm transition-all ml-2 rounded"
        >
          <FiSun className="text-yellow-300 animate-pulse shrink-0" size={13} />
          <span>PM Surya Ghar</span>
        </Link>

        {/* Running Marquee Ticker Area — Simple & Punchy */}
        <Link 
          to="/subsidy" 
          className="flex-1 overflow-hidden relative cursor-pointer mx-2 sm:mx-3 py-0.5"
          title="Click to learn all about the PM Surya Ghar ₹78,000 Subsidy Scheme"
        >
          {/* Edge fades matching red gradient */}
          <div className="absolute left-0 top-0 bottom-0 w-8 bg-gradient-to-r from-[#8E1212] to-transparent z-10 pointer-events-none" />
          <div className="absolute right-0 top-0 bottom-0 w-8 bg-gradient-to-l from-[#8E1212] to-transparent z-10 pointer-events-none" />

          {/* Double content for smooth, infinite marquee looping */}
          <div className="animate-marquee flex items-center gap-10 whitespace-nowrap">
            {/* Set 1 */}
            {TICKER_ITEMS.map((item, idx) => (
              <div key={`set1-${idx}`} className="flex items-center gap-1.5 shrink-0 font-body text-white">
                {item.icon}
                <span className="text-white/95">{item.text}</span>
                <strong className="text-yellow-300 font-extrabold tracking-tight drop-shadow-xs">{item.highlight}</strong>
                {item.suffix && <span className="text-white/90">{item.suffix}</span>}
                <span className="text-white/40 font-bold ml-5">&bull;</span>
              </div>
            ))}

            {/* Set 2 (for seamless loop) */}
            {TICKER_ITEMS.map((item, idx) => (
              <div key={`set2-${idx}`} className="flex items-center gap-1.5 shrink-0 font-body text-white">
                {item.icon}
                <span className="text-white/95">{item.text}</span>
                <strong className="text-yellow-300 font-extrabold tracking-tight drop-shadow-xs">{item.highlight}</strong>
                {item.suffix && <span className="text-white/90">{item.suffix}</span>}
                <span className="text-white/40 font-bold ml-5">&bull;</span>
              </div>
            ))}
          </div>
        </Link>

      </div>
    </div>
  );
};

export default SubsidyTopTicker;
