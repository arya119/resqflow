'use client';

import React from 'react';
import { useSimulationStore } from '@/store/simulationStore';

export function MonitoringBanner() {
  const {
    simulationActive,
    monitoringAlert,
    dismissMonitoringAlert,
    recalculatePlan,
  } = useSimulationStore();

  if (!monitoringAlert && !simulationActive) return null;

  return (
    <div className="w-full">
      {/* 1. Continuous Monitoring active badge strip */}
      <div className="bg-surface-container-high border-b border-outline-variant px-4 py-1.5 flex items-center justify-between text-xs font-mono">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
          <span className="font-semibold text-primary">
            CONTINUOUS MONITORING ACTIVE
          </span>
          <span className="text-outline hidden sm:inline">|</span>
          <span className="text-on-surface-variant hidden sm:inline">
            Hydrological & Road Segment Telemetry (12s refresh interval)
          </span>
        </div>
        <span className="text-outline text-[11px]">
          Deterministic Solver: Active
        </span>
      </div>

      {/* 2. Urgent Condition Change Alert (recalculated plan notification) */}
      {monitoringAlert && (
        <div className="bg-tertiary-container/30 border-b border-tertiary/40 px-4 py-2 flex items-center justify-between gap-3 text-xs font-mono animate-in slide-in-from-top-1 duration-200">
          <div className="flex items-center gap-2 text-on-tertiary-container">
            <span className="material-symbols-outlined text-tertiary text-[18px]">
              notification_important
            </span>
            <span className="font-semibold">{monitoringAlert}</span>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={recalculatePlan}
              className="bg-primary-container text-on-primary px-3 py-1 rounded text-[11px] font-bold hover:bg-primary transition-colors cursor-pointer"
            >
              Review Updated Plan
            </button>
            <button
              onClick={dismissMonitoringAlert}
              className="text-on-surface-variant hover:text-on-surface p-1 rounded"
              title="Dismiss notification"
            >
              <span className="material-symbols-outlined text-[16px]">close</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
