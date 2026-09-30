import React from 'react';

const Badge = ({ children, color = 'red', className = '' }) => {
  const colors = {
    red: 'bg-red-light text-red-dark',
    green: 'bg-green-100 text-green-800',
    blue: 'bg-blue-100 text-blue-800',
    orange: 'bg-orange-100 text-orange-800',
    gray: 'bg-gray-light text-gray',
  };

  return (
    <span className={`inline-block px-2 py-1 text-xs font-bold rounded-sm uppercase tracking-wider ${colors[color] || colors.red} ${className}`}>
      {children}
    </span>
  );
};

export default Badge;
