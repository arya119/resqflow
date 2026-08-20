'use client';

import React from 'react';
import dynamic from 'next/dynamic';

const OperationsMapInner = dynamic(
  () => import('./OperationsMapInner'),
  {
    ssr: false,
    loading: () => (
      <div className="w-full h-full min-h-[420px] bg-surface-container flex flex-col items-center justify-center rounded-lg border border-outline-variant text-on-surface-variant">
        <span className="material-symbols-outlined text-[36px] text-primary animate-spin mb-2">
          progress_activity
        </span>
        <span className="font-mono text-xs">Loading Live Satellite & Vector Map...</span>
      </div>
    ),
  }
);

export function OperationsMap() {
  return <OperationsMapInner />;
}
