'use client';

import React, { useState } from 'react';
import { useSimulationStore } from '@/store/simulationStore';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { DetailPanel } from '@/components/ui/DetailPanel';
import { audioAlert } from '@/lib/audioAlert';
import type { Road } from '@/types';

export default function RoadsPage() {
  const { activeRoads, currentLocation, toggleRoadStatus, dispatchRoadCrew } = useSimulationStore();
  const [selectedRoad, setSelectedRoad] = useState<Road | null>(null);
  const [filterStatus, setFilterStatus] = useState<string>('all');

  const [crewType, setCrewType] = useState<string>('PWD Heavy Debris Excavator Unit');
  const [dispatchETA, setDispatchETA] = useState<number>(30);
  const [dispatchSuccess, setDispatchSuccess] = useState<boolean>(false);

  const filtered = activeRoads.filter((r) => {
    if (filterStatus === 'all') return true;
    return r.status === filterStatus;
  });

  const handleDispatchCrew = () => {
    if (!selectedRoad) return;
    dispatchRoadCrew(selectedRoad.id, crewType, dispatchETA);
    setSelectedRoad({ ...selectedRoad, status: 'open', riskLevel: 'low' });
    audioAlert.playSuccessTone();
    setDispatchSuccess(true);
    setTimeout(() => setDispatchSuccess(false), 3000);
  };

  return (
    <div className="space-y-4 max-w-[1600px] mx-auto">
      {/* Metrics Row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="bg-surface border border-outline-variant rounded-lg p-3">
          <span className="font-mono text-[10px] text-outline uppercase font-semibold">
            {currentLocation.name} Segments
          </span>
          <div className="text-xl font-bold text-on-surface font-sans mt-1">
            {activeRoads.length} Segments
          </div>
        </div>
        <div className="bg-surface border border-outline-variant rounded-lg p-3">
          <span className="font-mono text-[10px] text-outline uppercase font-semibold">
            Passable / Open
          </span>
          <div className="text-xl font-bold text-primary font-sans mt-1">
            {activeRoads.filter((r) => r.status === 'open').length} Open
          </div>
        </div>
        <div className="bg-surface border border-outline-variant rounded-lg p-3">
          <span className="font-mono text-[10px] text-outline uppercase font-semibold">
            Blocked & Flooded
          </span>
          <div className="text-xl font-bold text-error font-sans mt-1">
            {activeRoads.filter((r) => r.status === 'blocked' || r.status === 'flooded').length} Cut Off
          </div>
        </div>
        <div className="bg-surface border border-outline-variant rounded-lg p-3">
          <span className="font-mono text-[10px] text-outline uppercase font-semibold">
            Alternate Routes
          </span>
          <div className="text-xl font-bold text-on-surface font-sans mt-1">100% Routed</div>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="bg-surface border border-outline-variant rounded-lg p-3 flex items-center justify-between shadow-xs font-mono text-xs">
        <div className="flex items-center gap-2">
          <span className="text-on-surface-variant font-semibold">Filter:</span>
          {['all', 'open', 'blocked', 'flooded', 'damaged'].map((s) => (
            <button
              key={s}
              onClick={() => setFilterStatus(s)}
              className={`px-2.5 py-1 rounded border text-[11px] font-semibold transition-colors cursor-pointer ${
                filterStatus === s
                  ? 'bg-secondary-container text-on-secondary-container border-primary font-bold'
                  : 'bg-surface border-outline-variant text-on-surface hover:bg-surface-container'
              }`}
            >
              {s.toUpperCase()}
            </button>
          ))}
        </div>
        <span className="text-outline">
          {filtered.length} segments in {currentLocation.name} ({currentLocation.state})
        </span>
      </div>

      {/* Roads Table */}
      <div className="bg-surface border border-outline-variant rounded-lg overflow-x-auto shadow-xs">
        <table className="w-full text-left text-xs border-collapse">
          <thead className="bg-surface-container-low text-outline font-mono text-[10px] uppercase border-b border-outline-variant">
            <tr>
              <th className="p-3 font-semibold">Road Segment</th>
              <th className="p-3 font-semibold">From → To</th>
              <th className="p-3 font-semibold">Status</th>
              <th className="p-3 font-semibold">Distance</th>
              <th className="p-3 font-semibold">Estimated Travel</th>
              <th className="p-3 font-semibold">Alternate Route</th>
              <th className="p-3 text-right font-semibold">Risk Level</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-outline-variant/60 font-sans">
            {filtered.map((road) => (
              <tr
                key={road.id}
                onClick={() => setSelectedRoad(road)}
                className="hover:bg-surface-container-low transition-colors cursor-pointer text-on-surface"
              >
                <td className="p-3">
                  <span className="font-bold text-on-surface text-[13px] block">
                    {road.name}
                  </span>
                  <span className="text-[11px] font-mono text-outline">{road.id}</span>
                </td>
                <td className="p-3 font-mono text-[11px]">
                  {road.from} → {road.to}
                </td>
                <td className="p-3">
                  <StatusBadge status={road.status} />
                </td>
                <td className="p-3 font-mono text-[11px]">{road.distanceKm} km</td>
                <td className="p-3 font-mono text-[11px]">{road.estimatedTimeMin} min</td>
                <td className="p-3 font-mono text-[11px]">
                  {road.alternateRoute ? (
                    <span className="text-primary font-semibold">{road.alternateRoute}</span>
                  ) : (
                    <span className="text-outline">Primary path</span>
                  )}
                </td>
                <td className="p-3 text-right">
                  <StatusBadge status={road.riskLevel} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Road Segment Detail Drawer */}
      <DetailPanel
        isOpen={Boolean(selectedRoad)}
        onClose={() => setSelectedRoad(null)}
        title={selectedRoad?.name || 'Road Segment'}
        subtitle={`Segment ID: ${selectedRoad?.id} | Mobility Telemetry`}
        actions={
          <button
            onClick={() => setSelectedRoad(null)}
            className="px-4 py-1.5 bg-primary-container text-on-primary rounded font-mono text-xs font-bold cursor-pointer"
          >
            Close Segment Detail
          </button>
        }
      >
        {selectedRoad && (
          <div className="space-y-4 font-sans text-xs">
            <div className="flex gap-2">
              <StatusBadge status={selectedRoad.status} size="md" />
              <StatusBadge status={selectedRoad.riskLevel} size="md" />
            </div>

            {/* Road Clearance Crew Dispatcher Card */}
            <div className="p-3 bg-surface-container rounded-lg border border-outline-variant space-y-2 font-mono">
              <div className="flex items-center justify-between">
                <span className="text-outline text-[10px] uppercase font-bold block">
                  Dispatch Road Clearance & Repair Crew
                </span>
                {dispatchSuccess && (
                  <span className="text-primary text-[10px] font-bold animate-in fade-in">
                    ✓ Crew Dispatched
                  </span>
                )}
              </div>

              <div className="space-y-2 text-[11px]">
                <div>
                  <span className="text-outline text-[10px] block mb-1">Select Clearance Unit</span>
                  <select
                    value={crewType}
                    onChange={(e) => setCrewType(e.target.value)}
                    className="w-full p-1.5 rounded bg-surface border border-outline-variant text-on-surface font-sans text-xs focus:outline-none"
                  >
                    <option value="PWD Heavy Debris Excavator Unit">PWD Heavy Debris Excavator Unit</option>
                    <option value="NDRF High-Volume Flood Pumping Team">NDRF High-Volume Flood Pumping Team</option>
                    <option value="Border Roads Organization (BRO) Taskforce">Border Roads Organization (BRO) Taskforce</option>
                  </select>
                </div>

                <div className="flex items-center justify-between gap-2">
                  <div>
                    <span className="text-outline text-[10px] block">Est. Clearance ETA</span>
                    <select
                      value={dispatchETA}
                      onChange={(e) => setDispatchETA(Number(e.target.value))}
                      className="p-1 rounded bg-surface border border-outline-variant text-on-surface font-mono text-xs"
                    >
                      <option value={15}>15 Minutes</option>
                      <option value={30}>30 Minutes</option>
                      <option value={60}>60 Minutes</option>
                    </select>
                  </div>

                  <button
                    type="button"
                    onClick={handleDispatchCrew}
                    className="px-3 py-1.5 bg-primary-container hover:bg-primary text-on-primary font-bold rounded-lg transition-all shadow-xs flex items-center gap-1 cursor-pointer"
                  >
                    <span className="material-symbols-outlined text-[15px]">construction</span>
                    <span>Dispatch Crew</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Quick Status Toggles */}
            <div className="p-3 bg-surface-container rounded-lg border border-outline-variant space-y-2 font-mono">
              <span className="text-outline text-[10px] uppercase font-bold block">
                Update Live Segment Status
              </span>
              <div className="grid grid-cols-3 gap-1.5 text-[11px]">
                <button
                  type="button"
                  onClick={() => {
                    toggleRoadStatus(selectedRoad.id, 'open');
                    setSelectedRoad({ ...selectedRoad, status: 'open' });
                  }}
                  className="py-1 px-2 bg-primary/10 hover:bg-primary/20 text-primary font-bold rounded border border-primary/30 transition-colors cursor-pointer"
                >
                  Set Open
                </button>
                <button
                  type="button"
                  onClick={() => {
                    toggleRoadStatus(selectedRoad.id, 'blocked');
                    setSelectedRoad({ ...selectedRoad, status: 'blocked' });
                  }}
                  className="py-1 px-2 bg-error/10 hover:bg-error/20 text-error font-bold rounded border border-error/30 transition-colors cursor-pointer"
                >
                  Set Blocked
                </button>
                <button
                  type="button"
                  onClick={() => {
                    toggleRoadStatus(selectedRoad.id, 'flooded');
                    setSelectedRoad({ ...selectedRoad, status: 'flooded' });
                  }}
                  className="py-1 px-2 bg-tertiary/10 hover:bg-tertiary/20 text-tertiary font-bold rounded border border-tertiary/30 transition-colors cursor-pointer"
                >
                  Set Flooded
                </button>
              </div>
            </div>

            <div className="p-3 bg-surface-container-low rounded-lg border border-outline-variant font-mono space-y-2">
              <div>
                <span className="text-outline text-[10px] block uppercase">Origin Node</span>
                <span className="font-semibold text-on-surface">{selectedRoad.from}</span>
              </div>
              <div>
                <span className="text-outline text-[10px] block uppercase">Destination Node</span>
                <span className="font-semibold text-on-surface">{selectedRoad.to}</span>
              </div>
              <div>
                <span className="text-outline text-[10px] block uppercase">Length & Transit Time</span>
                <span className="font-semibold text-on-surface">
                  {selectedRoad.distanceKm} km (~{selectedRoad.estimatedTimeMin} mins)
                </span>
              </div>
            </div>

            {selectedRoad.alternateRoute && (
              <div className="p-3 bg-primary/5 rounded-lg border border-primary/20 font-mono">
                <span className="text-[10px] text-primary uppercase font-bold block">
                  OR-Tools Alternate Route Recommended
                </span>
                <span className="text-sm font-bold text-primary mt-1 block">
                  {selectedRoad.alternateRoute}
                </span>
              </div>
            )}
          </div>
        )}
      </DetailPanel>
    </div>
  );
}
