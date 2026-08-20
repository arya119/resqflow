'use client';

import React, { useState, useEffect, useCallback } from 'react';
import clsx from 'clsx';
import { audioAlert } from '@/lib/audioAlert';

interface SectionRefreshHeaderProps {
  title: string;
  subtitle?: string;
  onRefresh: () => void | Promise<void>;
  autoRefreshSeconds?: number;
}

export function SectionRefreshHeader({
  title,
  subtitle = 'Telemetry & Sensor Network Active',
  onRefresh,
  autoRefreshSeconds = 15,
}: SectionRefreshHeaderProps) {
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [autoRefresh, setAutoRefresh] = useState(true);
  const [lastSynced, setLastSynced] = useState<Date>(new Date());
  const [secondsAgo, setSecondsAgo] = useState(0);

  // Ticker for seconds ago
  useEffect(() => {
    const interval = setInterval(() => {
      const diff = Math.floor((Date.now() - lastSynced.getTime()) / 1000);
      setSecondsAgo(Math.max(0, diff));
    }, 1000);
    return () => clearInterval(interval);
  }, [lastSynced]);

  const handleManualRefresh = useCallback(async (isSilent = false) => {
    if (isRefreshing) return;
    setIsRefreshing(true);
    if (!isSilent) {
      audioAlert.playWarningChime();
    }
    try {
      await onRefresh();
      setLastSynced(new Date());
    } finally {
      setTimeout(() => {
        setIsRefreshing(false);
      }, 500);
    }
  }, [isRefreshing, onRefresh]);

  // Auto-refresh interval
  useEffect(() => {
    if (!autoRefresh) return;
    const interval = setInterval(async () => {
      handleManualRefresh(true);
    }, autoRefreshSeconds * 1000);
    return () => clearInterval(interval);
  }, [autoRefresh, autoRefreshSeconds, handleManualRefresh]);

  return (
    <div className="bg-surface border border-outline-variant rounded-xl p-3 sm:p-3.5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-2xs font-mono text-xs mb-4">
      {/* Telemetry Status Indicator */}
      <div className="flex items-center gap-2.5">
        <span className="relative flex h-3 w-3 shrink-0">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75" />
          <span className="relative inline-flex rounded-full h-3 w-3 bg-primary" />
        </span>
        <div>
          <div className="flex items-center gap-2">
            <span className="font-bold text-on-surface text-xs uppercase tracking-wide">
              {title}
            </span>
            <span className="text-[10px] text-outline px-1.5 py-0.5 rounded bg-surface-container border border-outline-variant">
              LIVE
            </span>
          </div>
          <span className="text-[11px] text-on-surface-variant font-sans block sm:inline">
            {subtitle} • <span className="text-outline">Sync: {secondsAgo === 0 ? 'Just now' : `${secondsAgo}s ago`}</span>
          </span>
        </div>
      </div>

      {/* Action Controls */}
      <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
        {/* Auto Refresh Toggle */}
        <button
          type="button"
          onClick={() => setAutoRefresh(!autoRefresh)}
          className={clsx(
            'px-2.5 py-1.5 rounded-lg border text-[11px] font-semibold transition-all flex items-center gap-1.5 cursor-pointer',
            autoRefresh
              ? 'bg-primary/10 text-primary border-primary/30'
              : 'bg-surface border-outline-variant text-on-surface-variant hover:bg-surface-container'
          )}
          title="Toggle automatic sensor refresh"
        >
          <span
            className={clsx(
              'w-2 h-2 rounded-full',
              autoRefresh ? 'bg-primary animate-pulse' : 'bg-outline'
            )}
          />
          <span>Auto-Sync: {autoRefresh ? `${autoRefreshSeconds}s ON` : 'OFF'}</span>
        </button>

        {/* Manual Refresh Button */}
        <button
          type="button"
          onClick={() => handleManualRefresh(false)}
          disabled={isRefreshing}
          className="px-3.5 py-1.5 bg-primary-container hover:bg-primary text-on-primary font-bold rounded-lg text-[11px] transition-all shadow-2xs flex items-center gap-1.5 cursor-pointer disabled:opacity-50 active:scale-95"
          title="Refresh telemetry feed now"
        >
          <span
            className={clsx(
              'material-symbols-outlined text-[16px]',
              isRefreshing && 'animate-spin'
            )}
          >
            refresh
          </span>
          <span>{isRefreshing ? 'Refreshing...' : 'Refresh Section'}</span>
        </button>
      </div>
    </div>
  );
}
