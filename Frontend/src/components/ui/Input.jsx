import React, { forwardRef } from 'react';

const Input = forwardRef(({ label, error, hint, className = '', dark = false, ...props }, ref) => {
  const inputBase = [
    'w-full px-4 py-3 text-sm font-body outline-none transition-all duration-250 rounded-btn',
    dark
      ? 'bg-black-muted text-white border border-white/10 placeholder-gray-400 focus:border-red'
      : 'bg-white text-black border placeholder-gray-400 focus:border-black',
    error
      ? 'border-red bg-red-light focus:border-red focus:ring-1 focus:ring-red'
      : dark
      ? ''
      : 'border-gray-light hover:border-gray-400',
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <div className={`flex flex-col w-full mb-4 ${className}`}>
      {label && (
        <label className={`mb-1.5 font-accent font-semibold text-xs uppercase tracking-wider ${dark ? 'text-gray-300' : 'text-gray-700'}`}>
          {label}
        </label>
      )}
      <input
        ref={ref}
        className={inputBase}
        {...props}
      />
      {hint && !error && (
        <span className={`text-xs mt-1 ${dark ? 'text-gray-500' : 'text-gray-400'}`}>{hint}</span>
      )}
      {error && (
        <span className="text-red text-xs mt-1 font-accent font-semibold">
          {error.message || error}
        </span>
      )}
    </div>
  );
});

Input.displayName = 'Input';

export default Input;
