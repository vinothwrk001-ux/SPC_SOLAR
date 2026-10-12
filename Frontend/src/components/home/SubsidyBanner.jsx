import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import Button from '../ui/Button';
import { Reveal } from '../motion';
import { FiArrowRight, FiSun } from 'react-icons/fi';

const SubsidyBanner = () => {
  return (
    <section className="py-6 sm:py-8 lg:py-16 bg-red relative overflow-hidden">
      {/* Scan line */}
      <motion.div
        className="absolute inset-y-0 w-48 bg-gradient-to-r from-transparent via-white/10 to-transparent pointer-events-none"
        animate={{ x: ['-300px', '110vw'] }}
        transition={{ duration: 5, repeat: Infinity, ease: 'linear', repeatDelay: 4 }}
      />

      {/* Grid pattern */}
      <div className="absolute inset-0 opacity-10"
        style={{
          backgroundImage: "url(\"data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' stroke='white' stroke-width='0.8'%3E%3Cpath d='M0 0h40v40H0z'/%3E%3C/g%3E%3C/svg%3E\")"
        }}
      />

      {/* Blobs */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-3xl" />
      <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/5 rounded-full blur-3xl" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Reveal>
          <div className="flex flex-col lg:flex-row items-center justify-between gap-4 sm:gap-6 lg:gap-8">
            {/* Left */}
            <div className="flex items-start lg:items-center gap-3.5 sm:gap-4 lg:gap-5 text-white">
              <div className="flex-shrink-0 w-10 h-10 sm:w-12 sm:h-12 lg:w-14 lg:h-14 bg-white/10 rounded-sm border border-white/20 flex items-center justify-center">
                <FiSun className="w-5 h-5 sm:w-6 sm:h-6 lg:w-[26px] lg:h-[26px] text-white" />
              </div>
              <div>
                <p className="font-accent font-bold text-[10px] sm:text-xs uppercase tracking-widest text-white/70 mb-0.5 lg:mb-1">
                  Government Initiative
                </p>
                <h2 className="font-heading text-xl sm:text-2xl md:text-4xl text-white leading-tight">
                  Get Up to ₹78,000 Subsidy
                </h2>
                <p className="text-white/80 font-body text-xs sm:text-sm mt-1 sm:mt-1.5 lg:mt-2 max-w-lg">
                  Authorized PM Surya Ghar Muft Bijli Yojana installer. We handle all the paperwork and documentation for you.
                </p>
              </div>
            </div>

            {/* Right */}
            <div className="flex-shrink-0 w-full lg:w-auto mt-1 lg:mt-0">
              <Link to="/subsidy" className="block w-full">
                <Button
                  variant="outline-white"
                  size="lg"
                  className="w-full justify-center !py-2.5 sm:!py-3 lg:!py-4 !px-5 lg:!px-8 !text-xs sm:!text-sm lg:!text-base"
                  icon={<FiArrowRight className="w-4 h-4 lg:w-5 lg:h-5" />}
                >
                  Know More
                </Button>
              </Link>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
};

export default SubsidyBanner;
