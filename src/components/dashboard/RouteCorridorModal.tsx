'use client';

import React from 'react';
import { useSimulationStore } from '@/store/simulationStore';

export function RouteCorridorModal() {
  const {
    isRouteModalOpen,
    closeRouteModal,
    activePlanItem,
    deliveryPlan,
    currentLocation,
    isPlanApproved,
    approvePlan,
  } = useSimulationStore();

  if (!isRouteModalOpen) return null;

  const item = activePlanItem || deliveryPlan.items[0];

  return (
    <div
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          closeRouteModal();
        }
      }}
      className="fixed inset-0 z-[70] flex items-center justify-center p-3 sm:p-6 bg-black/60 backdrop-blur-xs animate-in fade-in duration-150"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-3xl bg-surface border border-outline-variant rounded-xl shadow-2xl flex flex-col overflow-hidden"
        role="dialog"
        aria-modal="true"
      >
        {/* Modal Header */}
        <div className="px-5 py-4 border-b border-outline-variant bg-surface-container-low flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded bg-primary/10 flex items-center justify-center text-primary border border-primary/20">
              <span className="material-symbols-outlined text-[20px]">alt_route</span>
            </div>
            <div>
              <h2 className="text-base font-bold text-on-surface font-sans">
                Active Route Corridor Inspector — {currentLocation.name} ({currentLocation.state})
              </h2>
              <p className="text-xs text-on-surface-variant font-mono">
                OR-Tools Optimized Safe Transit Corridor | Priority {item.rank}
              </p>
            </div>
          </div>

          <button
            onClick={closeRouteModal}
            className="p-1.5 rounded-lg hover:bg-surface-container text-on-surface-variant transition-colors cursor-pointer"
          >
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-5 space-y-4 overflow-y-auto max-h-[75vh]">
          {/* Top Corridor Strip */}
          <div className="p-3 bg-primary/5 border border-primary/20 rounded-lg flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 font-mono">
            <div>
              <span className="text-[10px] text-primary uppercase font-bold block">
                Designated Safe Route
              </span>
              <span className="text-sm font-bold text-primary">
                {item.routeDescription}
              </span>
            </div>
            <div className="flex items-center gap-4 text-xs shrink-0">
              <div>
                <span className="text-outline text-[10px] block">ESTIMATED TRANSIT</span>
                <span className="font-bold text-on-surface text-sm">{item.etaMinutes} mins</span>
              </div>
              <div className="border-l border-outline-variant pl-4">
                <span className="text-outline text-[10px] block">ASSIGNED VEHICLE</span>
                <span className="font-bold text-primary text-sm">{item.vehicleId}</span>
              </div>
            </div>
          </div>

          {/* Waypoints & Corridor Trace */}
          <div>
            <h4 className="text-xs font-bold text-on-surface font-mono uppercase tracking-wider mb-2.5">
              Route Checkpoints & Navigation Path
            </h4>
            <div className="space-y-2 font-mono text-xs">
              {/* Origin */}
              <div className="flex items-start gap-3 p-3 bg-surface border border-outline-variant rounded-lg">
                <div className="w-6 h-6 rounded-full bg-primary flex items-center justify-center text-on-primary font-bold text-[11px] shrink-0 mt-0.5">
                  A
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-on-surface text-[13px]">
                      {item.sourceWarehouseName} ({item.sourceWarehouseId})
                    </span>
                    <span className="text-primary font-bold text-[11px]">ORIGIN DEPOT</span>
                  </div>
                  <p className="text-on-surface-variant text-[11px] mt-0.5">
                    Payload: {item.supply} ({item.quantity} {item.unit}) &middot; Temperature Controlled
                  </p>
                </div>
              </div>

              {/* Waypoint 1: Bypass */}
              <div className="flex items-start gap-3 p-3 bg-surface-container-low border border-outline-variant/60 rounded-lg">
                <div className="w-6 h-6 rounded-full bg-secondary-container text-on-secondary-container flex items-center justify-center font-bold text-[11px] shrink-0 mt-0.5">
                  1
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-on-surface">
                      Elevated Ring Bypass (Route B Sector)
                    </span>
                    <span className="text-primary font-bold text-[11px]">HAZARD CLEARED</span>
                  </div>
                  <p className="text-on-surface-variant text-[11px] mt-0.5">
                    Avoids low-lying inundation zones; clearance verified above water level.
                  </p>
                </div>
              </div>

              {/* Destination */}
              <div className="flex items-start gap-3 p-3 bg-surface border border-error/30 rounded-lg bg-error/5">
                <div className="w-6 h-6 rounded-full bg-error flex items-center justify-center text-on-error font-bold text-[11px] shrink-0 mt-0.5">
                  B
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-error text-[13px]">
                      {item.destinationName}
                    </span>
                    <span className="text-error font-bold text-[11px]">CRITICAL DESTINATION</span>
                  </div>
                  <p className="text-on-surface-variant text-[11px] mt-0.5">
                    Estimated Shortage Window: &lt; 7 hours &middot; Direct ER Bay Delivery
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Agent Rationale Summary */}
          <div className="p-3.5 bg-surface-container rounded-lg border border-outline-variant font-mono text-xs space-y-2">
            <span className="text-[10px] text-outline uppercase font-bold block">
              Multi-Agent Route Synthesis Rationale
            </span>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-[11px]">
              <div className="p-2 bg-surface rounded border border-outline-variant/60">
                <strong className="text-primary block">Mobility Agent:</strong>
                <span>{item.reasoning.mobility}</span>
              </div>
              <div className="p-2 bg-surface rounded border border-outline-variant/60">
                <strong className="text-error block">Risk Agent:</strong>
                <span>{item.reasoning.risk}</span>
              </div>
              <div className="p-2 bg-surface rounded border border-outline-variant/60">
                <strong className="text-primary block">Inventory Agent:</strong>
                <span>{item.reasoning.inventory}</span>
              </div>
              <div className="p-2 bg-surface rounded border border-outline-variant/60">
                <strong className="text-secondary block">Vehicle Agent:</strong>
                <span>{item.reasoning.fleet}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="px-5 py-3 border-t border-outline-variant bg-surface-container-low flex items-center justify-between font-mono text-xs">
          <button
            onClick={closeRouteModal}
            className="px-4 py-1.5 bg-surface border border-outline-variant rounded-lg font-semibold text-on-surface hover:bg-surface-container transition-colors cursor-pointer"
          >
            Close Inspector
          </button>

          <button
            onClick={() => {
              if (!isPlanApproved) {
                approvePlan();
              }
              closeRouteModal();
            }}
            className="px-4 py-1.5 bg-primary-container hover:bg-primary text-on-primary font-bold rounded-lg shadow-xs transition-colors flex items-center gap-1.5 cursor-pointer"
          >
            <span className="material-symbols-outlined text-[16px]">check</span>
            <span>{isPlanApproved ? 'Plan Dispatched' : 'Approve & Dispatch Route'}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
