import React from 'react';
import { Loader2 } from 'lucide-react';

export default function Button({
  children,
  variant = 'primary',
  size = 'md',
  type = 'button',
  disabled = false,
  loading = false,
  className = '',
  onClick,
  icon: Icon,
  ...props
}) {
  const baseStyles = 'inline-flex items-center justify-center font-medium transition-all duration-150 select-none focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-graphite-900 disabled:opacity-50 disabled:cursor-not-allowed';

  const sizeStyles = {
    sm: 'text-xs px-3 py-1.5 rounded-sm gap-1.5',
    md: 'text-sm px-4 py-2.5 rounded-md gap-2',
    lg: 'text-base px-6 py-3 rounded-md gap-2.5 font-semibold',
  };

  const variantStyles = {
    primary: 'bg-signal hover:bg-signal-hover text-white shadow-sm focus:ring-signal',
    secondary: 'bg-graphite-800 hover:bg-graphite-700 text-bone-100 border border-graphite-700 focus:ring-graphite-600',
    outline: 'bg-transparent hover:bg-graphite-800 text-bone-100 border border-graphite-700 focus:ring-graphite-600',
    ghost: 'bg-transparent hover:bg-graphite-800 text-bone-200 hover:text-bone-50 focus:ring-graphite-700',
    danger: 'bg-red-600 hover:bg-red-700 text-white focus:ring-red-500',
    dark: 'bg-graphite-950 hover:bg-graphite-900 text-white border border-graphite-800 focus:ring-graphite-700',
  };

  return (
    <button
      type={type}
      disabled={disabled || loading}
      onClick={onClick}
      className={`${baseStyles} ${sizeStyles[size] || sizeStyles.md} ${variantStyles[variant] || variantStyles.primary} ${className}`}
      {...props}
    >
      {loading ? (
        <Loader2 className="w-4 h-4 animate-spin text-current" />
      ) : Icon ? (
        <Icon className="w-4 h-4 text-current" />
      ) : null}
      <span>{children}</span>
    </button>
  );
}
