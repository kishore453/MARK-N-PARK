import React from 'react';
import { AlertCircle, RefreshCw } from 'lucide-react';
import Button from './Button';

export default function ErrorState({
  title = 'Something went wrong',
  message = 'An unexpected error occurred while fetching information.',
  onRetry,
  minHeight = 'h-64'
}) {
  return (
    <div className={`w-full ${minHeight} flex flex-col items-center justify-center p-8 text-center bg-red-950/20 rounded-lg border border-red-900/40`}>
      <div className="w-12 h-12 rounded-full bg-red-950/40 flex items-center justify-center text-red-400 mb-4 border border-red-850">
        <AlertCircle className="w-6 h-6" />
      </div>
      <h3 className="text-base font-semibold text-red-200 mb-1">{title}</h3>
      <p className="text-sm text-red-300/80 max-w-md mb-6">{message}</p>
      {onRetry && (
        <Button variant="secondary" size="sm" icon={RefreshCw} onClick={onRetry}>
          Try Again
        </Button>
      )}
    </div>
  );
}
