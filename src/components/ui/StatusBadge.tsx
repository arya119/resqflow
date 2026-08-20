'use client';

import React from 'react';
import clsx from 'clsx';
import type { SeverityLevel, StatusType, RoadStatus } from '@/types';

interface StatusBadgeProps {
  status: SeverityLevel | StatusType | RoadStatus | string;
  size?: 'sm' | 'md';
  className?: string;
  dot?: boolean;
}

export function StatusBadge({ status, size = 'sm', className, dot = true }: StatusBadgeProps) {
  const normalized = status.toLowerCase();

  let colorClasses = 'bg-surface-container text-on-surface-variant border-outline-variant';
  let dotColor = 'bg-outline';

  if (
    normalized === 'critical' ||
    normalized === 'danger' ||
    normalized === 'flooded' ||
    normalized === 'blocked'
  ) {
    colorClasses = 'bg-error/10 text-error border-error/20';
    dotColor = 'bg-error';
  } else if (
    normalized === 'high' ||
    normalized === 'warning' ||
    normalized === 'damaged'
  ) {
    colorClasses = 'bg-tertiary-container/20 text-tertiary border-tertiary/20';
    dotColor = 'bg-tertiary';
  } else if (
    normalized === 'moderate' ||
    normalized === 'watch' ||
    normalized === 'assigned' ||
    normalized === 'en_route'
  ) {
    colorClasses = 'bg-secondary-container text-on-secondary-container border-secondary/20';
    dotColor = 'bg-secondary';
  } else if (
    normalized === 'normal' ||
    normalized === 'operational' ||
    normalized === 'available' ||
    normalized === 'safe' ||
    normalized === 'open'
  ) {
    colorClasses = 'bg-primary/10 text-primary border-primary/20';
    dotColor = 'bg-primary';
  }

  return (
    <span
      className={clsx(
        'inline-flex items-center gap-1.5 font-mono text-[11px] font-semibold uppercase tracking-wider rounded-full border px-2 py-0.5 whitespace-nowrap',
        size === 'sm' ? 'text-[10px] px-1.5 py-0.5' : 'text-[12px] px-2.5 py-1',
        colorClasses,
        className
      )}
    >
      {dot && <span className={clsx('w-1.5 h-1.5 rounded-full inline-block shrink-0', dotColor)} />}
      {status.replace('_', ' ')}
    </span>
  );
}
