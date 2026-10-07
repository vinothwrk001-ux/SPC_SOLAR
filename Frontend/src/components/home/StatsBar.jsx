import React from 'react';
import { motion } from 'framer-motion';
import { AnimatedCounter } from '../motion';

const STATS = [
  { value: '25', suffix: ' Yrs', label: 'Performance Warranty' },
  { value: '', raw: 'Tier 1', label: 'Solar Panels' },
  { value: '', raw: '24/7', label: 'Maintenance Support' },
  { value: '78', prefix: '₹', suffix: 'K', label: 'Max Gov Subsidy' },
];

const StatsBar = () => {
  return (
    <div className="bg-red relative overflow-hidden">
      {/* Scan line animation */}
      <motion.div
        className="absolute inset-y-0 w-32 bg-gradient-to-r from-transparent via-white/10 to-transparent pointer-events-none"
        animate={{ x: ['-200px', '120vw'] }}
        transition={{ duration: 4, repeat: Infinity, ease: 'linear', repeatDelay: 3 }}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5">
        {/* Mobile View (Grid) */}
        <div className="grid grid-cols-2 gap-8 text-center text-white md:hidden">
          {STATS.map((stat, i) => (
            <motion.div
              key={`mobile-${stat.label}`}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: i * 0.08 }}
            >
              <div className="font-accent text-3xl font-bold leading-none mb-1">
                {stat.raw ? (
                  stat.raw
                ) : (
                  <AnimatedCounter
                    target={stat.value}
                    prefix={stat.prefix || ''}
                    suffix={stat.suffix || ''}
                    duration={1.5}
                  />
                )}
              </div>
              <p className="font-heading uppercase tracking-wider text-xs text-white/80 mt-1">
                {stat.label}
              </p>
            </motion.div>
          ))}
        </div>

        {/* Desktop View (Flex with Dividers) */}
        <div className="hidden md:flex justify-between items-center text-center text-white w-full">
          {STATS.map((stat, i) => (
            <React.Fragment key={`desktop-${stat.label}`}>
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: i * 0.08 }}
                className="flex-1"
              >
                <div className="font-accent text-3xl font-bold leading-none mb-1">
                  {stat.raw ? (
                    stat.raw
                  ) : (
                    <AnimatedCounter
                      target={stat.value}
                      prefix={stat.prefix || ''}
                      suffix={stat.suffix || ''}
                      duration={1.5}
                    />
                  )}
                </div>
                <p className="font-heading uppercase tracking-wider text-xs text-white/80 mt-1">
                  {stat.label}
                </p>
              </motion.div>

              {/* Divider (not after last) */}
              {i < STATS.length - 1 && (
                <div className="w-px h-10 bg-white/20 mx-4" />
              )}
            </React.Fragment>
          ))}
        </div>
      </div>
    </div>
  );
};

export default StatsBar;
