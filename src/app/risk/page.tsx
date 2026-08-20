'use client';

import React from 'react';
import { useSimulationStore } from '@/store/simulationStore';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { OperationsMap } from '@/components/map/OperationsMap';

export default function RiskPage() {
  const { activeZones, currentLocation } = useSimulationStore();
  const totalPop = activeZones.reduce((a, b) => a + b.population, 0);

  return (
    <div className="space-y-4 max-w-[1600px] mx-auto">
      {/* Top Risk Warning Strip */}
      <div className="bg-error/10 border border-error/20 rounded-lg p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <span className="material-symbols-outlined text-error text-[28px]">
            crisis_alert
          </span>
          <div>
            <h2 className="text-base font-bold text-error font-sans">
              Active Hazard Warning — {currentLocation.name} ({currentLocation.state})
            </h2>
            <p className="text-xs text-on-surface-variant font-mono mt-0.5">
              {currentLocation.disasterProfile} &middot; Risk Index: {currentLocation.riskIndex}/100
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className="font-mono text-xs font-bold text-error bg-surface px-3 py-1.5 rounded border border-error/30">
            {totalPop.toLocaleString()} Total Vulnerable Population
          </span>
        </div>
      </div>

      {/* Grid: Zones Cards (Left) + Map (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* Left Column: Vulnerable Zones */}
        <div className="lg:col-span-6 space-y-3">
          {activeZones.map((zone) => (
            <div
              key={zone.id}
              className="bg-surface border border-outline-variant rounded-lg p-4 shadow-xs"
            >
              <div className="flex items-start justify-between gap-2 mb-2">
                <div>
                  <span className="font-mono text-[11px] text-outline font-semibold">
                    {zone.id}
                  </span>
                  <h3 className="text-sm font-bold text-on-surface font-sans">
                    {zone.name}
                  </h3>
                </div>
                <StatusBadge status={zone.riskLevel} />
              </div>

              <div className="grid grid-cols-3 gap-2 p-2.5 my-2 bg-surface-container-low rounded border border-outline-variant/60 font-mono text-[11px]">
                <div>
                  <span className="text-outline text-[10px] block">POPULATION</span>
                  <span className="font-bold text-on-surface">
                    {zone.population.toLocaleString()}
                  </span>
                </div>
                <div>
                  <span className="text-outline text-[10px] block">PROBABILITY</span>
                  <span className="font-bold text-error">{zone.floodProbability}%</span>
                </div>
                <div>
                  <span className="text-outline text-[10px] block">CURRENT STATUS</span>
                  <span className="font-bold uppercase text-error">{zone.status}</span>
                </div>
              </div>

              <div className="text-[11px] font-mono text-on-surface-variant">
                <span>Sector Type: </span>
                <span className="font-semibold uppercase">{zone.type.replace('_', ' ')}</span>
              </div>
            </div>
          ))}
        </div>

        {/* Right Column: GIS Map with Risk Layers */}
        <div className="lg:col-span-6 bg-surface border border-outline-variant rounded-lg overflow-hidden h-[480px] shadow-xs flex flex-col">
          <div className="px-3 py-2 bg-surface-container-low border-b border-outline-variant flex items-center justify-between text-xs font-mono">
            <span className="font-bold text-on-surface">
              {currentLocation.name} Vulnerability & Hazard Vector Overlay
            </span>
            <span className="text-error font-bold">● High Risk Sectors Active</span>
          </div>
          <div className="flex-1">
            <OperationsMap />
          </div>
        </div>
      </div>
    </div>
  );
}
