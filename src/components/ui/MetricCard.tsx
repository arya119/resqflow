'use client';

import React from 'react';
import clsx from 'clsx';

interface MetricCardProps {
  label: string;
  value: string | number;
  subValue?: string;
  badge?: string;
  badgeType?: 'error' | 'primary' | 'warning' | 'neutral';
  trend?: {
    direction: 'up' | 'down';
    value: string;
  };
  icon?: string;
  className?: string;
}

export function MetricCard({
  label,
  value,
  subValue,
  badge,
  badgeType = 'neutral',
  trend,
  icon,
  className,
}: MetricCardProps) {
  return (
    <div
      className={clsx(
        'bg-surface border border-outline-variant rounded-lg p-3 flex flex-col justify-between transition-shadow hover:shadow-sm',
        className
      )}
    >
      <div className="flex items-center justify-between">
        <span className="text-on-surface-variant font-mono text-[11px] font-semibold uppercase tracking-wider">
          {label}
        </span>
        {icon && (
          <span className="material-symbols-outlined text-outline text-[18px]">
            {icon}
          </span>
        )}
      </div>

      <div className="flex items-end justify-between mt-2">
        <div className="flex items-baseline gap-1">
          <span className="text-2xl font-bold text-on-surface font-sans">
            {value}
          </span>
          {subValue && (
            <span className="text-sm text-outline font-sans">
              {subValue}
            </span>
          )}
        </div>

        {badge && (
          <span
            className={clsx(
              'font-mono text-[11px] font-semibold px-1.5 py-0.5 rounded',
              badgeType === 'error' && 'text-error bg-error/10 border border-error/20',
              badgeType === 'primary' && 'text-primary bg-primary/10 border border-primary/20',
              badgeType === 'warning' && 'text-tertiary bg-tertiary/10 border border-tertiary/20',
              badgeType === 'neutral' && 'text-on-surface-variant bg-surface-container'
            )}
          >
            {badge}
          </span>
        )}

        {trend && (
          <span
            className={clsx(
              'font-mono text-[11px] font-semibold flex items-center gap-0.5',
              trend.direction === 'up' ? 'text-error' : 'text-primary'
            )}
          >
            <span className="material-symbols-outlined text-[14px]">
              {trend.direction === 'up' ? 'arrow_upward' : 'arrow_downward'}
            </span>
            {trend.value}
          </span>
        )}
      </div>
    </div>
  );
}
