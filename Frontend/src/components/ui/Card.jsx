import React from 'react';

const Card = ({ children, className = '' }) => {
  return (
    <div className={`bg-white rounded-card shadow-card p-6 border border-gray-light hover:border-red transition-colors duration-300 ${className}`}>
      {children}
    </div>
  );
};

export default Card;
