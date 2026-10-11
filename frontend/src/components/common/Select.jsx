import React, { forwardRef } from 'react';

const Select = forwardRef(({
  label,
  error,
  options = [],
  id,
  name,
  className = '',
  required = false,
  children,
  ...props
}, ref) => {
  const selectId = id || name;

  return (
    <div className="w-full space-y-1.5">
      {label && (
        <label htmlFor={selectId} className="block text-xs font-medium text-bone-200 uppercase tracking-wider">
          {label} {required && <span className="text-signal">*</span>}
        </label>
      )}
      <select
        ref={ref}
        id={selectId}
        name={name}
        required={required}
        className={`w-full bg-graphite-850 text-bone-50 border ${
          error ? 'border-red-500' : 'border-graphite-700'
        } rounded-md px-3.5 py-2.5 text-sm transition-all focus:outline-none focus:ring-1 focus:ring-signal focus:border-signal ${className}`}
        {...props}
      >
        {children || options.map((opt) => (
          <option key={opt.value} value={opt.value} className="bg-graphite-900 text-bone-50">
            {opt.label}
          </option>
        ))}
      </select>
      {error && <p className="text-xs text-red-400 mt-1">{error}</p>}
    </div>
  );
});

Select.displayName = 'Select';
export default Select;
