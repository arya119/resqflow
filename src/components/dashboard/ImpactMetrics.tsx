'use client';

import React from 'react';
import { useSimulationStore } from '@/store/simulationStore';

export function ImpactMetrics() {
  const { impactMetrics } = useSimulationStore();

  return (
    <div className="bg-surface border border-outline-variant rounded-lg p-3 flex flex-col justify-between shadow-xs">
      {/* Title */}
      <div className="mb-2">
        <div className="flex items-center gap-1.5">
          <span className="material-symbols-outlined text-primary text-[18px]">
            model_training
          </span>
          <h3 className="font-mono text-xs font-bold text-on-surface uppercase tracking-wider">
            Plan Impact Simulation (Before / After)
          </h3>
        </div>
        <p className="font-mono text-[11px] text-on-surface-variant mt-0.5">
          Projected operational delta if recommended plan is executed.
        </p>
      </div>

      {/* Before / After Columns */}
      <div className="grid grid-cols-3 gap-2 my-auto py-2 border-y border-outline-variant/60">
        {/* Metric 1: Critical Locations Served */}
        <div className="flex flex-col">
          <span className="font-mono text-[10px] text-outline uppercase font-semibold">
            Critical Served
          </span>
          <div className="flex items-center gap-1.5 mt-1">
            <span className="font-mono text-sm text-error line-through opacity-70">
              {impactMetrics.before.criticalServed}
            </span>
            <span className="material-symbols-outlined text-outline text-[14px]">
              arrow_right_alt
            </span>
            <span className="font-mono text-lg text-primary font-bold">
              {impactMetrics.after.criticalServed}
            </span>
          </div>
        </div>

        {/* Metric 2: Shortage Risk Level */}
        <div className="flex flex-col border-l border-outline-variant/60 pl-2">
          <span className="font-mono text-[10px] text-outline uppercase font-semibold">
            Shortage Risk
          </span>
          <div className="flex items-center gap-1.5 mt-1">
            <span className="font-mono text-sm text-error line-through opacity-70">
              {impactMetrics.before.shortageRisk}%
            </span>
            <span className="material-symbols-outlined text-outline text-[14px]">
              arrow_right_alt
            </span>
            <span className="font-mono text-lg text-primary font-bold">
              {impactMetrics.after.shortageRisk}%
            </span>
          </div>
        </div>

        {/* Metric 3: Avg Delivery Time */}
        <div className="flex flex-col border-l border-outline-variant/60 pl-2">
          <span className="font-mono text-[10px] text-outline uppercase font-semibold">
            Avg Delivery ETA
          </span>
          <div className="flex items-center gap-1.5 mt-1">
            <span className="font-mono text-sm text-error line-through opacity-70">
              {impactMetrics.before.avgDeliveryMin}m
            </span>
            <span className="material-symbols-outlined text-outline text-[14px]">
              arrow_right_alt
            </span>
            <span className="font-mono text-lg text-primary font-bold">
              {impactMetrics.after.avgDeliveryMin}m
            </span>
          </div>
        </div>
      </div>

      {/* Footer Confidence label */}
      <div className="mt-2 pt-1.5 flex items-center justify-between">
        <span className="text-[10px] font-mono text-outline">
          * Simulation results based on OR-Tools deterministic solver
        </span>
        <span className="font-mono text-[10px] font-bold text-primary bg-primary/10 px-2 py-0.5 rounded-full border border-primary/20">
          High Confidence ({impactMetrics.confidence}%)
        </span>
      </div>
    </div>
  );
}
