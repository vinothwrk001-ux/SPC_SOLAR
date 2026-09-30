import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import Button from '../ui/Button';
import { Reveal, EnergyGrid } from '../motion';
import { FiArrowRight, FiPhone } from 'react-icons/fi';

const CTABanner = () => {
  return (
    <section className="py-28 bg-black-DEFAULT text-center relative overflow-hidden">
      <EnergyGrid opacity={0.05} color="white" />

      {/* Red glow blobs */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-red/8 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-0 right-0 w-64 h-64 bg-red/6 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-64 h-64 bg-red/4 rounded-full blur-3xl pointer-events-none" />

      {/* Top & bottom accent lines */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-red/40 to-transparent" />
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-red/20 to-transparent" />

      <Reveal>
        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Eyebrow */}
          <div className="flex items-center justify-center gap-3 mb-6">
            <span className="w-8 h-px bg-red block" />
            <span className="text-red font-accent font-bold text-xs uppercase tracking-widest">
              Take Action Now
            </span>
            <span className="w-8 h-px bg-red block" />
          </div>

          {/* Headline */}
          <h2 className="font-heading text-5xl md:text-7xl text-white mb-6 leading-none uppercase">
            READY TO SWITCH<br />
            TO{' '}
            <span className="text-red">SOLAR?</span>
          </h2>

          <p className="text-gray-400 font-body text-lg max-w-2xl mx-auto mb-10 leading-relaxed">
            Get a detailed quotation with ROI analysis and subsidy estimation.
            Take the first step towards energy independence today.
          </p>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/quotation">
              <Button size="lg" icon={<FiArrowRight />}>
                Get Free Quotation
              </Button>
            </Link>
            <a href="tel:+919876543210">
              <Button variant="outline-white" size="lg" icon={<FiPhone size={16} />}>
                Call Us Now
              </Button>
            </a>
          </div>

          {/* Trust indicators */}
          <div className="mt-12 flex flex-wrap justify-center gap-8 text-gray-500 text-xs font-accent uppercase tracking-widest">
            {['No Hidden Charges', 'Free Site Survey', '25-Year Warranty', 'Subsidy Support'].map((t) => (
              <span key={t} className="flex items-center gap-2">
                <span className="w-1 h-1 rounded-full bg-red flex-shrink-0" />
                {t}
              </span>
            ))}
          </div>
        </div>
      </Reveal>
    </section>
  );
};

export default CTABanner;
