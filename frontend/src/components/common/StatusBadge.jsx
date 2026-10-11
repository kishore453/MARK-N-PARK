import React from 'react';

export default function StatusBadge({ status, type = 'reservation' }) {
  if (!status) return null;

  const reservationStyles = {
    PENDING: 'bg-amber-950/60 text-amber-300 border-amber-800/60',
    CONFIRMED: 'bg-emerald-950/60 text-emerald-300 border-emerald-800/60',
    CANCELLED: 'bg-red-950/60 text-red-300 border-red-800/60',
    COMPLETED: 'bg-neutral-800 text-neutral-300 border-neutral-700',
  };

  const paymentStyles = {
    PENDING: 'bg-amber-950/60 text-amber-300 border-amber-800/60',
    ADVANCE_CAPTURED: 'bg-signal/20 text-signal border-signal/40',
    BALANCE_PENDING: 'bg-blue-950/60 text-blue-300 border-blue-800/60',
    COMPLETED: 'bg-emerald-950/60 text-emerald-300 border-emerald-800/60',
    FAILED: 'bg-red-950/60 text-red-300 border-red-800/60',
  };

  const formatText = (text) => {
    return text.replace(/_/g, ' ');
  };

  const currentStyles = type === 'payment'
    ? (paymentStyles[status] || 'bg-neutral-800 text-neutral-300 border-neutral-700')
    : (reservationStyles[status] || 'bg-neutral-800 text-neutral-300 border-neutral-700');

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-sm text-xs font-semibold uppercase tracking-wider border ${currentStyles}`}>
      <span className="w-1.5 h-1.5 rounded-full mr-1.5 bg-current opacity-80" />
      {formatText(status)}
    </span>
  );
}
