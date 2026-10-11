import React, { forwardRef } from 'react';

const Input = forwardRef(({
  label,
  error,
  helperText,
  type = 'text',
  id,
  name,
  className = '',
  icon: Icon,
  required = false,
  ...props
}, ref) => {
  const inputId = id || name;

  return (
    <div className="w-full space-y-1.5">
      {label && (
        <label htmlFor={inputId} className="block text-xs font-medium text-bone-200 uppercase tracking-wider">
          {label} {required && <span className="text-signal">*</span>}
        </label>
      )}
      <div className="relative">
        {Icon && (
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-neutral-400">
            <Icon className="w-4 h-4" />
          </div>
        )}
        <input
          ref={ref}
          id={inputId}
          name={name}
          type={type}
          required={required}
          className={`w-full bg-graphite-850 text-bone-50 border ${
            error ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : 'border-graphite-700 focus:border-signal focus:ring-signal'
          } rounded-md px-3.5 py-2.5 text-sm transition-all placeholder:text-neutral-500 focus:outline-none focus:ring-1 ${
            Icon ? 'pl-10' : ''
          } ${className}`}
          {...props}
        />
      </div>
      {error && <p className="text-xs text-red-400 mt-1">{error}</p>}
      {helperText && !error && <p className="text-xs text-neutral-400 mt-1">{helperText}</p>}
    </div>
  );
});

Input.displayName = 'Input';
export default Input;
