import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Reveal } from '../motion';
import { FiArrowRight, FiSun, FiCheckCircle } from 'react-icons/fi';

const SubsidyBanner = () => {
  return (
    <section className="py-7 sm:py-9 lg:py-12 bg-gradient-to-r from-[#061224] via-[#0B2244] to-[#07152B] relative overflow-hidden border-t border-amber-400/20 border-b border-blue-900/40">
      {/* Top radiant separator line */}
      <div className="absolute top-0 left-0 right-0 h-[1.5px] bg-gradient-to-r from-transparent via-amber-400/60 to-transparent" />

      {/* Dynamic scan line sheen */}
      <motion.div
        className="absolute inset-y-0 w-64 bg-gradient-to-r from-transparent via-cyan-400/10 to-transparent pointer-events-none"
        animate={{ x: ['-300px', '110vw'] }}
        transition={{ duration: 5.5, repeat: Infinity, ease: 'linear', repeatDelay: 3.5 }}
      />

      {/* Modern technical grid pattern */}
      <div 
        className="absolute inset-0 opacity-[0.08] pointer-events-none"
        style={{
          backgroundImage: "url(\"data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' stroke='%2338bdf8' stroke-width='0.8'%3E%3Cpath d='M0 0h40v40H0z'/%3E%3C/g%3E%3C/svg%3E\")"
        }}
      />

      {/* Atmospheric ambient glows */}
      <div className="absolute -top-12 -right-12 w-80 h-80 bg-blue-500/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-16 -left-12 w-72 h-72 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-1/2 left-1/3 -translate-y-1/2 w-96 h-32 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Reveal>
          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-5 sm:gap-6 lg:gap-8">
            {/* Left Content Area */}
            <div className="flex items-start sm:items-center gap-3.5 sm:gap-5 text-white">
              {/* Glowing Solar Icon */}
              <div className="flex-shrink-0 w-12 h-12 sm:w-14 sm:h-14 lg:w-16 lg:h-16 bg-gradient-to-br from-amber-400/25 via-amber-500/15 to-transparent rounded-xl border border-amber-400/35 flex items-center justify-center shadow-[0_0_25px_rgba(251,191,36,0.25)] relative group">
                <div className="absolute inset-0 rounded-xl bg-amber-400/20 blur-md opacity-40 group-hover:opacity-75 transition-opacity" />
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 24, repeat: Infinity, ease: 'linear' }}
                  className="relative z-10 flex items-center justify-center"
                >
                  <FiSun className="w-6 h-6 sm:w-7 sm:h-7 lg:w-8 lg:h-8 text-amber-400" />
                </motion.div>
              </div>

              <div>
                {/* Status / Initiative Pill Badge */}
                <div className="inline-flex items-center gap-2 px-2.5 py-0.5 sm:py-1 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 font-accent font-semibold text-[10px] sm:text-xs tracking-wider uppercase mb-1.5 shadow-sm">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-400" />
                  </span>
                  <span>Government Initiative • PM Surya Ghar</span>
                </div>

                {/* Main Headline */}
                <h2 className="font-heading text-xl sm:text-2xl md:text-3xl lg:text-4xl text-white font-bold leading-tight">
                  Get Up to{' '}
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-amber-200 to-yellow-400 font-extrabold drop-shadow-[0_2px_12px_rgba(251,191,36,0.3)]">
                    ₹78,000 Subsidy
                  </span>
                </h2>

                {/* Subtitle Description */}
                <p className="text-slate-300 font-body text-xs sm:text-sm mt-1 sm:mt-1.5 max-w-xl leading-relaxed">
                  Authorized PM Surya Ghar Muft Bijli Yojana installer. We handle 100% of the paperwork, DISCOM approval & documentation for you.
                </p>

                {/* Quick Trust Highlights */}
                <div className="flex flex-wrap items-center gap-2 sm:gap-3 mt-2 sm:mt-2.5 text-[10px] sm:text-xs text-slate-300 font-accent">
                  <span className="inline-flex items-center gap-1 bg-white/5 border border-white/10 px-2 py-0.5 rounded text-amber-200">
                    <FiCheckCircle className="text-emerald-400 w-3 h-3 sm:w-3.5 sm:h-3.5" /> Direct Bank Transfer (DBT)
                  </span>
                  <span className="inline-flex items-center gap-1 bg-white/5 border border-white/10 px-2 py-0.5 rounded text-slate-200">
                    <FiCheckCircle className="text-emerald-400 w-3 h-3 sm:w-3.5 sm:h-3.5" /> End-to-End Approval
                  </span>
                </div>
              </div>
            </div>

            {/* Right Action CTA */}
            <div className="flex-shrink-0 w-full sm:w-auto lg:w-auto mt-2 lg:mt-0">
              <Link to="/subsidy" className="block w-full group">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-6 sm:px-8 py-3 sm:py-3.5 lg:py-4 rounded-md bg-gradient-to-r from-amber-400 via-yellow-400 to-amber-500 hover:from-amber-300 hover:via-yellow-300 hover:to-amber-400 text-slate-950 font-accent font-extrabold text-xs sm:text-sm uppercase tracking-wider shadow-[0_4px_20px_rgba(245,158,11,0.3)] hover:shadow-[0_6px_25px_rgba(245,158,11,0.5)] transition-all duration-300 border border-amber-300/60 cursor-pointer"
                >
                  <span>Know More</span>
                  <FiArrowRight className="w-4 h-4 text-slate-950 transition-transform duration-300 group-hover:translate-x-1" />
                </motion.button>
              </Link>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
};

export default SubsidyBanner;
