import React from 'react';
import { motion } from 'framer-motion';
import { cardHover } from '../../animations/variants';

const Card = ({ children, className = '', hover = true, noPad = false, dark = false }) => {
  const base = [
    dark
      ? 'bg-black-soft text-white border border-white/8'
      : 'bg-white text-black border border-gray-200',
    'rounded-card',
    !noPad && 'p-6',
  ]
    .filter(Boolean)
    .join(' ');

  if (!hover) {
    return <div className={`${base} ${className}`}>{children}</div>;
  }

  return (
    <motion.div
      variants={cardHover}
      initial="rest"
      whileHover="hover"
      className={`${base} ${className}`}
    >
      {children}
    </motion.div>
  );
};

export default Card;
