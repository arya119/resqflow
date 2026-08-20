'use client';

import React from 'react';
import { useSimulationStore } from '@/store/simulationStore';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { OperationsMap } from '@/components/map/OperationsMap';
import { ReasoningPanel } from '@/components/dashboard/ReasoningPanel';
import clsx from 'clsx';

import { SectionRefreshHeader } from '@/components/ui/SectionRefreshHeader';

export default function DeliveryPlanPage() {
  const {
    deliveryPlan,
    activePlanItem,
    setActivePlanItem,
    isPlanApproved,
    approvePlan,
    recalculatePlan,
    triggerRouteFocus,
    currentLocation,
  } = useSimulationStore();

  return (
    <div className="space-y-4 max-w-[1600px] mx-auto">
      <SectionRefreshHeader
        title="Delivery Plan & Route Optimizer Stream"
        subtitle="Multi-agent OR-Tools allocation pipeline"
        onRefresh={() => recalculatePlan()}
        autoRefreshSeconds={12}
      />
      {/* Top Banner */}
      <div className="bg-surface border border-outline-variant rounded-lg p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-primary text-[22px]">
              alt_route
            </span>
            <h2 className="text-base font-bold text-on-surface font-sans">
              Google OR-Tools Delivery Schedule — {currentLocation.name} ({currentLocation.state})
            </h2>
          </div>
          <p className="text-xs text-on-surface-variant font-mono mt-0.5">
            Plan ID: {deliveryPlan.id} | Confidence: {deliveryPlan.confidence}% | Generated: {deliveryPlan.generatedAt}
          </p>
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <button
            onClick={recalculatePlan}
            className="flex-1 sm:flex-none px-3.5 py-1.5 bg-surface border border-outline-variant text-on-surface rounded-lg font-mono text-xs font-semibold hover:bg-surface-container transition-colors cursor-pointer"
          >
            Recalculate
          </button>
          <button
            onClick={approvePlan}
            disabled={isPlanApproved}
            className={clsx(
              'flex-1 sm:flex-none px-4 py-1.5 rounded-lg font-mono text-xs font-bold transition-all shadow-xs cursor-pointer',
              isPlanApproved
                ? 'bg-secondary text-on-secondary cursor-not-allowed opacity-80'
                : 'bg-primary-container hover:bg-primary text-on-primary'
            )}
          >
            {isPlanApproved ? '✓ Dispatched to Drivers' : 'Approve Full Schedule'}
          </button>
        </div>
      </div>

      {/* Main Grid: Plan List (Left) + Map & Reasoning (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* Left Column: Ranked Delivery Items */}
        <div className="lg:col-span-6 space-y-3">
          {deliveryPlan.items.map((item) => {
            const isSelected = activePlanItem?.destinationId === item.destinationId;

            return (
              <div
                key={item.destinationId}
                onClick={() => setActivePlanItem(item)}
                className={clsx(
                  'bg-surface border rounded-lg p-4 transition-all cursor-pointer shadow-xs',
                  isSelected
                    ? 'border-primary ring-1 ring-primary/30 bg-primary/5'
                    : 'border-outline-variant hover:border-outline'
                )}
              >
                <div className="flex items-start justify-between gap-2 mb-2">
                  <div className="flex items-center gap-2">
                    <span className="w-6 h-6 rounded-full bg-primary text-on-primary font-mono text-xs font-bold flex items-center justify-center">
                      0{item.rank}
                    </span>
                    <h3 className="text-sm font-bold text-on-surface font-sans">
                      {item.destinationName}
                    </h3>
                  </div>
                  <StatusBadge status={item.severity} />
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs font-mono py-2 my-1 border-y border-outline-variant/60">
                  <div>
                    <span className="text-outline text-[10px] block">SUPPLY LOAD</span>
                    <span className="font-semibold text-on-surface">
                      {item.supply} ({item.quantity} {item.unit})
                    </span>
                  </div>
                  <div>
                    <span className="text-outline text-[10px] block">SOURCE DEPOT & VEHICLE</span>
                    <span className="font-semibold text-on-surface">
                      {item.sourceWarehouseName.split('(')[0]} → {item.vehicleId}
                    </span>
                  </div>
                </div>

                <div className="flex items-center justify-between text-xs font-mono mt-2 pt-1">
                  <div className="text-on-surface-variant">
                    <span>Route: </span>
                    <span className="text-primary font-medium">{item.routeDescription}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-primary font-bold">{item.etaMinutes} min ETA</span>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setActivePlanItem(item);
                        triggerRouteFocus();
                      }}
                      className="px-2.5 py-1 bg-surface-container hover:bg-primary hover:text-on-primary border border-outline-variant rounded text-[11px] font-bold text-primary transition-colors cursor-pointer flex items-center gap-1"
                    >
                      <span className="material-symbols-outlined text-[13px]">alt_route</span>
                      <span>Inspect Route</span>
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Right Column: Dynamic Map Focus + Reasoning Detail */}
        <div className="lg:col-span-6 flex flex-col gap-4">
          <div className="bg-surface border border-outline-variant rounded-lg overflow-hidden h-[360px] shadow-xs">
            <div className="p-2.5 bg-surface-container-low border-b border-outline-variant flex items-center justify-between text-xs font-mono">
              <span className="font-bold text-on-surface uppercase">
                Active Corridor Focus: {activePlanItem?.destinationName}
              </span>
              <button
                onClick={triggerRouteFocus}
                className="text-primary font-bold hover:underline flex items-center gap-1"
              >
                <span className="material-symbols-outlined text-[14px]">center_focus_strong</span>
                <span>Zoom & Inspect</span>
              </button>
            </div>
            <div className="h-[calc(100%-37px)]">
              <OperationsMap />
            </div>
          </div>

          {/* Full reasoning block */}
          <ReasoningPanel />
        </div>
      </div>
    </div>
  );
}
