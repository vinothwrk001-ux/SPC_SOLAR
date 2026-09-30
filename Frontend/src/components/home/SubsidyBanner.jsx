import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import Button from '../ui/Button';
import { Reveal } from '../motion';
import { FiArrowRight, FiSun } from 'react-icons/fi';

const SubsidyBanner = () => {
  return (
    <section className="py-16 bg-red relative overflow-hidden">
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
          <div className="flex flex-col lg:flex-row items-center justify-between gap-8">
            {/* Left */}
            <div className="flex items-start lg:items-center gap-5 text-white">
              <div className="flex-shrink-0 w-14 h-14 bg-white/10 rounded-sm border border-white/20 flex items-center justify-center">
                <FiSun size={26} className="text-white" />
              </div>
              <div>
                <p className="font-accent font-bold text-xs uppercase tracking-widest text-white/70 mb-1">
                  Government Initiative
                </p>
                <h2 className="font-heading text-3xl md:text-4xl text-white leading-tight">
                  Get Up to ₹78,000 Subsidy
                </h2>
                <p className="text-white/80 font-body text-sm mt-2 max-w-lg">
                  Authorized PM Surya Ghar Muft Bijli Yojana installer. We handle all the paperwork and documentation for you.
                </p>
              </div>
            </div>

            {/* Right */}
            <div className="flex-shrink-0">
              <Link to="/subsidy">
                <Button variant="outline-white" size="lg" icon={<FiArrowRight />}>
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
