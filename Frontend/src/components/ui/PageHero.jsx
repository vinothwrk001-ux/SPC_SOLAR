import React from 'react';
import { motion } from 'framer-motion';
import { EnergyGrid } from '../motion';

/**
 * PageHero — Shared hero for inner pages (About, Services, etc.)
 * Handles the fixed navbar offset and renders a consistent header.
 */
const PageHero = ({ label, title, highlight, subtitle, children }) => {
  // Split title at the highlight word for color treatment
  const titleParts = highlight ? title.split(highlight) : [title];

  return (
    <section className="relative bg-black-DEFAULT text-white pt-32 pb-20 overflow-hidden">
      <EnergyGrid opacity={0.05} color="white" />

      {/* Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-48 bg-red/8 rounded-full blur-3xl pointer-events-none" />

      {/* Bottom accent */}
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-red/40 to-transparent" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        {label && (
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="flex items-center justify-center gap-3 mb-5"
          >
            <span className="w-8 h-px bg-red" />
            <span className="text-red font-accent font-bold text-xs uppercase tracking-widest">{label}</span>
            <span className="w-8 h-px bg-red" />
          </motion.div>
        )}

        <div className="overflow-hidden mb-3">
          <motion.h1
            initial={{ y: '110%', opacity: 0 }}
            animate={{ y: '0%', opacity: 1 }}
            transition={{ duration: 0.85, ease: [0.16, 1, 0.3, 1], delay: 0.1 }}
            className="font-heading text-5xl md:text-7xl text-white uppercase leading-none"
          >
            {highlight ? (
              <>
                {titleParts[0]}
                <span className="text-red">{highlight}</span>
                {titleParts[1]}
              </>
            ) : (
              title
            )}
          </motion.h1>
        </div>

        {subtitle && (
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1], delay: 0.3 }}
            className="text-gray-400 font-body text-lg max-w-2xl mx-auto mt-4"
          >
            {subtitle}
          </motion.p>
        )}

        {children && (
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.45 }}
            className="mt-6"
          >
            {children}
          </motion.div>
        )}
      </div>
    </section>
  );
};

export default PageHero;
