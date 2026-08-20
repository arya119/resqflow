'use client';

import React, { useState } from 'react';
import { useSimulationStore } from '@/store/simulationStore';

export function ReasoningPanel() {
  const { activePlanItem } = useSimulationStore();
  const [isExpanded, setIsExpanded] = useState(true);

  if (!activePlanItem) return null;

  const reasoning = activePlanItem.reasoning;

  return (
    <div className="bg-surface border border-outline-variant rounded-lg overflow-hidden">
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full px-3 py-2 bg-surface-container-low border-b border-outline-variant/60 flex items-center justify-between text-left hover:bg-surface-container transition-colors"
      >
        <div className="flex items-center gap-1.5">
          <span className="material-symbols-outlined text-primary text-[18px]">
            psychology
          </span>
          <span className="font-mono text-xs font-bold uppercase tracking-wider text-on-surface">
            Why This Plan? (Deterministic Reasoning)
          </span>
        </div>
        <span className="material-symbols-outlined text-outline text-[18px]">
          {isExpanded ? 'expand_less' : 'expand_more'}
        </span>
      </button>

      {isExpanded && (
        <div className="p-3 space-y-2.5 font-sans text-xs bg-surface">
          {/* 1. Urgency */}
          <div className="flex items-start gap-2">
            <span className="material-symbols-outlined text-error text-[16px] mt-0.5 shrink-0">
              timer
            </span>
            <div>
              <span className="font-mono font-bold uppercase text-[11px] text-error block">
                1. Demand & Urgency
              </span>
              <p className="text-on-surface-variant mt-0.5">{reasoning.urgency}</p>
            </div>
          </div>

          {/* 2. Inventory */}
          <div className="flex items-start gap-2">
            <span className="material-symbols-outlined text-primary text-[16px] mt-0.5 shrink-0">
              inventory_2
            </span>
            <div>
              <span className="font-mono font-bold uppercase text-[11px] text-primary block">
                2. Inventory Allocation
              </span>
              <p className="text-on-surface-variant mt-0.5">{reasoning.inventory}</p>
            </div>
          </div>

          {/* 3. Mobility */}
          <div className="flex items-start gap-2">
            <span className="material-symbols-outlined text-tertiary text-[16px] mt-0.5 shrink-0">
              alt_route
            </span>
            <div>
              <span className="font-mono font-bold uppercase text-[11px] text-tertiary block">
                3. Mobility & Route Optimization
              </span>
              <p className="text-on-surface-variant mt-0.5">{reasoning.mobility}</p>
            </div>
          </div>

          {/* 4. Risk */}
          <div className="flex items-start gap-2">
            <span className="material-symbols-outlined text-secondary text-[16px] mt-0.5 shrink-0">
              shield
            </span>
            <div>
              <span className="font-mono font-bold uppercase text-[11px] text-secondary block">
                4. Risk Mitigation
              </span>
              <p className="text-on-surface-variant mt-0.5">{reasoning.risk}</p>
            </div>
          </div>

          {/* 5. Vehicle & Transport */}
          <div className="flex items-start gap-2">
            <span className="material-symbols-outlined text-primary text-[16px] mt-0.5 shrink-0">
              local_shipping
            </span>
            <div>
              <span className="font-mono font-bold uppercase text-[11px] text-primary block">
                5. Vehicle & Driver Selection
              </span>
              <p className="text-on-surface-variant mt-0.5">{reasoning.fleet}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

