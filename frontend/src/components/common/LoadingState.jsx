import React from 'react';
import { Loader2 } from 'lucide-react';

export default function LoadingState({ message = 'Loading data...', minHeight = 'h-64' }) {
  return (
    <div className={`w-full ${minHeight} flex flex-col items-center justify-center p-8 bg-graphite-900/50 rounded-lg border border-graphite-800`}>
      <Loader2 className="w-8 h-8 text-signal animate-spin mb-3" />
      <p className="text-sm font-medium text-bone-300">{message}</p>
    </div>
  );
}
