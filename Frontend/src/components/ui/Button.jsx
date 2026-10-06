import React from 'react';
import { motion } from 'framer-motion';
import { buttonHover } from '../../animations/variants';

const Button = ({ children, variant = 'primary', size = 'md', className = '', icon, ...props }) => {
  const base =
    'relative inline-flex items-center justify-center font-accent font-bold uppercase tracking-widest outline-none select-none overflow-hidden transition-colors duration-250 rounded-btn';

  const sizes = {
    sm: 'px-4 py-2 text-xs gap-1.5',
    md: 'px-6 py-3 text-sm gap-2',
    lg: 'px-8 py-4 text-base gap-2.5',
  };

  const variants = {
    primary: [
      'bg-red text-white border-2 border-red',
      'hover:bg-red-dark hover:border-red-dark',
      'focus-visible:ring-2 focus-visible:ring-red focus-visible:ring-offset-2',
    ].join(' '),
    secondary: [
      'bg-black text-white border-2 border-black',
      'hover:bg-black-muted',
    ].join(' '),
    outline: [
      'bg-transparent text-black border-2 border-black',
      'hover:bg-black hover:text-white',
    ].join(' '),
    'outline-white': [
      'bg-transparent text-white border-2 border-white',
      'hover:bg-white hover:text-black',
    ].join(' '),
    'outline-red': [
      'bg-transparent text-red border-2 border-red',
      'hover:bg-red hover:text-white',
    ].join(' '),
    ghost: 'bg-transparent text-red hover:bg-red-muted border-2 border-transparent',
    white: [
      'bg-white text-black border-2 border-white',
      'hover:bg-gray-100 hover:border-gray-100',
    ].join(' '),
  };

  return (
    <motion.button
      variants={buttonHover}
      initial="rest"
      whileHover="hover"
      whileTap="tap"
      className={`${base} ${sizes[size] || sizes.md} ${variants[variant] || variants.primary} ${className}`}
      {...props}
    >
      {/* Shimmer overlay on hover */}
      <span
        className="absolute inset-0 pointer-events-none overflow-hidden rounded-btn"
        aria-hidden="true"
      >
        <span className="absolute -translate-x-full top-0 h-full w-1/2 bg-white/10 skew-x-12 transition-transform duration-700 group-hover:translate-x-[200%]" />
      </span>

      {icon && <span className="flex-shrink-0">{icon}</span>}
      {children}
    </motion.button>
  );
};

export default Button;
