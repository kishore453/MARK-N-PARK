import React from 'react';
import { Compass } from 'lucide-react';
import Button from './Button';

export default function EmptyState({
  icon: Icon = Compass,
  title = 'No results found',
  description = 'Nothing matched your search or selection at this moment.',
  actionLabel,
  onAction,
  minHeight = 'h-64'
}) {
  return (
    <div className={`w-full ${minHeight} flex flex-col items-center justify-center p-8 text-center bg-graphite-900/40 rounded-lg border border-graphite-800`}>
      <div className="w-12 h-12 rounded-full bg-graphite-800 flex items-center justify-center text-bone-300 mb-4 border border-graphite-700">
        <Icon className="w-6 h-6 text-signal" />
      </div>
      <h3 className="text-base font-semibold text-bone-50 mb-1">{title}</h3>
      <p className="text-sm text-neutral-400 max-w-md mb-6">{description}</p>
      {actionLabel && onAction && (
        <Button variant="secondary" size="sm" onClick={onAction}>
          {actionLabel}
        </Button>
      )}
    </div>
  );
}
