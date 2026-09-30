import React from 'react';

const Button = ({ children, variant = 'primary', className = '', ...props }) => {
  const baseStyles = 'inline-flex items-center justify-center px-6 py-3 font-accent font-bold uppercase tracking-wider transition-colors duration-200 rounded-btn outline-none';
  
  const variants = {
    primary: 'bg-red text-white hover:bg-red-dark border-2 border-transparent',
    secondary: 'bg-black text-white hover:bg-gray border-2 border-transparent',
    outline: 'bg-white text-black border-2 border-black hover:bg-black hover:text-white',
  };

  return (
    <button className={`${baseStyles} ${variants[variant]} ${className}`} {...props}>
      {children}
    </button>
  );
};

export default Button;
