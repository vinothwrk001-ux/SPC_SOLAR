import React from 'react';
import { motion } from 'framer-motion';

const Loader = ({ size = 'md', fullPage = false, text = '' }) => {
  const sizes = { sm: 32, md: 48, lg: 64 };
  const s = sizes[size] || sizes.md;

  const spinner = (
    <div className="flex flex-col items-center gap-4">
      <svg width={s} height={s} viewBox="0 0 48 48" fill="none" aria-label="Loading">
        {/* Track */}
        <circle cx="24" cy="24" r="20" stroke="rgba(204,34,34,0.15)" strokeWidth="3" />
        {/* Animated arc */}
        <motion.circle
          cx="24"
          cy="24"
          r="20"
          stroke="#CC2222"
          strokeWidth="3"
          strokeLinecap="round"
          strokeDasharray="100 26"
          animate={{ rotate: 360 }}
          transition={{ duration: 0.9, repeat: Infinity, ease: 'linear' }}
          style={{ transformOrigin: '24px 24px' }}
        />
        {/* Center dot */}
        <motion.circle
          cx="24"
          cy="24"
          r="4"
          fill="#CC2222"
          animate={{ scale: [0.8, 1.2, 0.8], opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 1.2, repeat: Infinity, ease: 'easeInOut' }}
        />
      </svg>
      {text && (
        <p className="text-gray-500 font-accent text-xs uppercase tracking-widest animate-pulse">
          {text}
        </p>
      )}
    </div>
  );

  if (fullPage) {
    return (
      <div className="fixed inset-0 bg-white/80 backdrop-blur-sm z-50 flex items-center justify-center">
        {spinner}
      </div>
    );
  }

  return (
    <div className="flex justify-center items-center py-12">
      {spinner}
    </div>
  );
};

export default Loader;
