'use client';

import React from 'react';
import { useSimulationStore } from '@/store/simulationStore';
import clsx from 'clsx';

export function DeliveryPlanCard() {
  const {
    activePlanItem,
    deliveryPlan,
    isPlanApproved,
    approvePlan,
    recalculatePlan,
    triggerRouteFocus,
  } = useSimulationStore();

  const item = activePlanItem || deliveryPlan.items[0];

  return (
    <div className="bg-primary/5 border border-primary/20 rounded-lg p-3 flex flex-col shadow-xs">
      {/* Card Header */}
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-1.5">
          <span
            className="material-symbols-outlined text-primary text-[20px]"
            style={{ fontVariationSettings: "'FILL' 1" }}
          >
            assignment_turned_in
          </span>
          <h3 className="text-xs font-bold text-primary font-mono uppercase tracking-wider">
            Recommended Delivery Plan
          </h3>
        </div>

        <span
          className={clsx(
            'text-[10px] font-mono font-bold px-2 py-0.5 rounded-full border',
            isPlanApproved
              ? 'bg-primary text-on-primary border-primary'
              : 'bg-surface text-primary border-primary/30'
          )}
        >
          {isPlanApproved ? '✓ APPROVED & DISPATCHED' : 'PENDING APPROVAL'}
        </span>
      </div>

      {/* Plan Details Body */}
      <div className="bg-surface border border-outline-variant rounded p-3 mb-2 space-y-2">
        <div className="flex items-start justify-between">
          <div>
            <span className="font-mono text-[11px] font-bold text-error uppercase">
              Priority 0{item.rank} — Critical
            </span>
            <h4 className="text-[13px] font-bold text-on-surface font-sans">
              {item.destinationName}
            </h4>
          </div>
          <div className="text-right">
            <span className="text-[10px] font-mono text-outline block">ETA</span>
            <span className="font-mono text-xs font-bold text-primary">
              {item.etaMinutes} mins
            </span>
          </div>
        </div>

        {/* Allocation row */}
        <div className="grid grid-cols-2 gap-2 text-[11px] font-mono py-1.5 border-y border-outline-variant/60">
          <div>
            <span className="text-on-surface-variant block">Supply:</span>
            <span className="font-semibold text-on-surface">
              {item.supply} ({item.quantity} {item.unit})
            </span>
          </div>
          <div>
            <span className="text-on-surface-variant block">Source & Vehicle:</span>
            <span className="font-semibold text-on-surface">
              {item.sourceWarehouseId} → {item.vehicleId}
            </span>
          </div>
        </div>

        {/* Route info */}
        <div className="text-[11px] font-mono">
          <span className="text-on-surface-variant">Optimal Route: </span>
          <span className="text-primary font-medium">{item.routeDescription}</span>
        </div>

        {/* Reasoning Quote */}
        <div className="bg-surface-container-low p-2 rounded border border-outline-variant/50 text-[11px] italic text-on-surface-variant leading-relaxed">
          &ldquo;{item.reasoning.urgency}&rdquo;
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-1.5 mt-auto">
        <button
          onClick={triggerRouteFocus}
          className="flex-1 bg-surface border border-outline-variant text-on-surface font-mono text-[11px] font-semibold py-1.5 px-2 rounded hover:bg-surface-container transition-colors text-center cursor-pointer flex items-center justify-center gap-1"
        >
          <span className="material-symbols-outlined text-[14px]">alt_route</span>
          <span>View Route</span>
        </button>

        <button
          onClick={recalculatePlan}
          className="flex-1 bg-surface border border-outline-variant text-on-surface font-mono text-[11px] font-semibold py-1.5 px-2 rounded hover:bg-surface-container transition-colors text-center cursor-pointer"
        >
          Recalculate
        </button>

        <button
          onClick={approvePlan}
          disabled={isPlanApproved}
          className={clsx(
            'flex-1 font-mono text-[11px] font-bold py-1.5 px-2 rounded transition-all text-center shadow-xs cursor-pointer',
            isPlanApproved
              ? 'bg-secondary text-on-secondary cursor-default'
              : 'bg-primary-container hover:bg-primary text-on-primary'
          )}
        >
          {isPlanApproved ? 'Dispatched' : 'Approve Plan'}
        </button>
      </div>
    </div>
  );
}
