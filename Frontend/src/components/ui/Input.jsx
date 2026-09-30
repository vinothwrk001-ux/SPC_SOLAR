import React, { forwardRef } from 'react';

const Input = forwardRef(({ label, error, className = '', ...props }, ref) => {
  return (
    <div className={`flex flex-col w-full mb-4 ${className}`}>
      {label && <label className="mb-1 font-accent font-semibold text-black">{label}</label>}
      <input
        ref={ref}
        className={`px-4 py-2 border ${error ? 'border-red bg-red-light' : 'border-gray-light focus:border-black'} outline-none rounded-btn transition-colors duration-200`}
        {...props}
      />
      {error && <span className="text-red text-sm mt-1">{error.message || error}</span>}
    </div>
  );
});

export default Input;
