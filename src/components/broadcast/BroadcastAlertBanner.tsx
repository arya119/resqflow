'use client';

import React, { useState } from 'react';
import { useSimulationStore } from '@/store/simulationStore';
import { audioAlert } from '@/lib/audioAlert';
import clsx from 'clsx';

export function BroadcastAlertBanner() {
  const { broadcasts, acknowledgeBroadcast, dismissBroadcast, openBroadcastModal } = useSimulationStore();
  const [isExpanded, setIsExpanded] = useState<boolean>(true);

  const activeAlerts = broadcasts.filter((b) => b.active);

  if (activeAlerts.length === 0) return null;

  const currentAlert = activeAlerts[0];
  const isCritical = currentAlert.severity === 'critical';
  const isWarning = currentAlert.severity === 'warning';

  return (
    <div
      className={clsx(
        'w-full border-b transition-all duration-300 shadow-md relative z-20',
        isCritical
          ? 'bg-error text-white border-error/40'
          : isWarning
          ? 'bg-tertiary text-white border-tertiary/40'
          : 'bg-primary text-white border-primary/40'
      )}
    >
      <div className="max-w-[1600px] mx-auto px-4 py-2.5 flex flex-col md:flex-row items-start md:items-center justify-between gap-2.5">
        {/* Left Side: Pulsing Radar Badge + Title & Message */}
        <div className="flex items-start md:items-center gap-3 flex-1">
          <div className="flex items-center gap-1.5 shrink-0 mt-0.5 md:mt-0">
            <span className="relative flex h-3.5 w-3.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-80" />
              <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-white" />
            </span>
            <span className="font-mono text-[11px] font-black uppercase tracking-wider px-2 py-0.5 rounded bg-black/25 border border-white/20">
              {currentAlert.severity} BROADCAST
            </span>
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <h4 className="text-xs sm:text-sm font-bold font-sans tracking-tight leading-tight">
                {currentAlert.title}
              </h4>
              <span className="text-[10px] font-mono opacity-85 hidden sm:inline">
                &bull; {currentAlert.region} ({currentAlert.radiusKm}km radius)
              </span>
            </div>
            {isExpanded && (
              <p className="text-xs opacity-95 mt-0.5 leading-relaxed line-clamp-2 sm:line-clamp-none font-sans">
                {currentAlert.message}
              </p>
            )}
          </div>
        </div>

        {/* Right Side: Telemetry, Siren, Acknowledge & Dismiss CTA */}
        <div className="flex items-center gap-2 self-end md:self-center shrink-0">
          <div className="hidden lg:flex items-center gap-1.5 text-[11px] font-mono bg-black/20 px-2.5 py-1 rounded border border-white/20">
            <span className="material-symbols-outlined text-[14px]">cell_tower</span>
            <span>{currentAlert.recipientCount.toLocaleString()} devices alerted</span>
          </div>

          {/* Audio Siren Replay */}
          {currentAlert.soundAlert && (
            <button
              onClick={() => {
                if (isCritical) audioAlert.playEmergencySiren(2);
                else audioAlert.playWarningChime();
              }}
              title="Play Emergency Audio Siren"
              className="p-1.5 rounded bg-black/20 hover:bg-black/40 text-white transition-colors cursor-pointer border border-white/20"
            >
              <span className="material-symbols-outlined text-[16px]">volume_up</span>
            </button>
          )}

          {/* Toggle Details */}
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="p-1.5 rounded bg-black/20 hover:bg-black/40 text-white transition-colors cursor-pointer border border-white/20 hidden sm:block"
            title={isExpanded ? 'Collapse Alert' : 'Expand Details'}
          >
            <span className="material-symbols-outlined text-[16px]">
              {isExpanded ? 'expand_less' : 'expand_more'}
            </span>
          </button>

          {/* Acknowledge CTA */}
          <button
            onClick={() => acknowledgeBroadcast(currentAlert.id)}
            className={clsx(
              'px-3 py-1 rounded text-xs font-mono font-bold transition-all shadow-xs flex items-center gap-1 cursor-pointer',
              currentAlert.acknowledged
                ? 'bg-white/20 text-white cursor-default'
                : 'bg-white text-gray-900 hover:bg-white/90'
            )}
          >
            <span className="material-symbols-outlined text-[14px]">
              {currentAlert.acknowledged ? 'check_circle' : 'task_alt'}
            </span>
            <span>{currentAlert.acknowledged ? 'Acknowledged' : 'Acknowledge'}</span>
          </button>

          {/* Dismiss CTA */}
          <button
            onClick={() => dismissBroadcast(currentAlert.id)}
            title="Dismiss from current view"
            className="p-1 rounded hover:bg-black/25 text-white/80 hover:text-white transition-colors cursor-pointer"
          >
            <span className="material-symbols-outlined text-[18px]">close</span>
          </button>
        </div>
      </div>

      {/* Multiple Alerts Indicator */}
      {activeAlerts.length > 1 && (
        <div className="bg-black/30 px-4 py-1 text-[10px] font-mono text-center flex items-center justify-center gap-2">
          <span>+ {activeAlerts.length - 1} more active emergency broadcast(s)</span>
          <button
            onClick={openBroadcastModal}
            className="underline hover:text-white font-bold cursor-pointer"
          >
            View Broadcast Center
          </button>
        </div>
      )}
    </div>
  );
}
