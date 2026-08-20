'use client';

import React, { useState } from 'react';
import { useSimulationStore } from '@/store/simulationStore';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { DetailPanel } from '@/components/ui/DetailPanel';
import type { Hospital } from '@/types';

export default function HospitalsPage() {
  const { activeHospitals, currentLocation, updateHospitalStatus } = useSimulationStore();
  const [selectedFacility, setSelectedFacility] = useState<Hospital | null>(null);
  const [filterType, setFilterType] = useState<string>('all');
  const [filterRisk, setFilterRisk] = useState<string>('all');

  const filtered = activeHospitals.filter((hosp) => {
    if (filterType !== 'all' && hosp.type !== filterType) return false;
    if (filterRisk !== 'all' && hosp.status !== filterRisk) return false;
    return true;
  });

  return (
    <div className="space-y-4 max-w-[1600px] mx-auto">
      {/* Top Filter & Counter Bar */}
      <div className="bg-surface border border-outline-variant rounded-lg p-3 flex flex-col md:flex-row items-start md:items-center justify-between gap-3 shadow-xs">
        {/* Filters */}
        <div className="flex flex-wrap items-center gap-2 font-mono text-xs">
          <span className="text-on-surface-variant font-semibold">Type:</span>
          {['all', 'hospital', 'relief_center', 'clinic'].map((t) => (
            <button
              key={t}
              onClick={() => setFilterType(t)}
              className={`px-2.5 py-1 rounded border text-[11px] font-semibold transition-colors cursor-pointer ${
                filterType === t
                  ? 'bg-secondary-container text-on-secondary-container border-primary font-bold'
                  : 'bg-surface border-outline-variant text-on-surface hover:bg-surface-container'
              }`}
            >
              {t === 'all' ? `All (${activeHospitals.length})` : t.replace('_', ' ').toUpperCase()}
            </button>
          ))}

          <div className="h-4 w-px bg-outline-variant mx-1 hidden sm:block" />

          <span className="text-on-surface-variant font-semibold">Risk:</span>
          {['all', 'critical', 'warning', 'normal'].map((r) => (
            <button
              key={r}
              onClick={() => setFilterRisk(r)}
              className={`px-2.5 py-1 rounded border text-[11px] font-semibold transition-colors cursor-pointer ${
                filterRisk === r
                  ? 'bg-secondary-container text-on-secondary-container border-primary font-bold'
                  : 'bg-surface border-outline-variant text-on-surface hover:bg-surface-container'
              }`}
            >
              {r.toUpperCase()}
            </button>
          ))}
        </div>

        <span className="text-xs font-mono text-outline">
          Showing {filtered.length} of {activeHospitals.length} facilities in {currentLocation.name} ({currentLocation.state})
        </span>
      </div>

      {/* Facilities Table */}
      <div className="bg-surface border border-outline-variant rounded-lg overflow-x-auto shadow-xs">
        <table className="w-full text-left text-xs border-collapse">
          <thead className="bg-surface-container-low text-outline font-mono text-[10px] uppercase border-b border-outline-variant">
            <tr>
              <th className="p-3 font-semibold">Facility Name & ID</th>
              <th className="p-3 font-semibold">Type</th>
              <th className="p-3 font-semibold">Shortage Risk</th>
              <th className="p-3 font-semibold">Medicine Buffer</th>
              <th className="p-3 font-semibold">Patients / Beds</th>
              <th className="p-3 text-right font-semibold">Priority Score</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-outline-variant/60">
            {filtered.map((hosp) => (
              <tr
                key={hosp.id}
                onClick={() => setSelectedFacility(hosp)}
                className="hover:bg-surface-container-low transition-colors cursor-pointer text-on-surface font-sans"
              >
                <td className="p-3">
                  <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-primary text-[18px]">
                      {hosp.type === 'relief_center' ? 'night_shelter' : 'local_hospital'}
                    </span>
                    <div>
                      <span className="font-bold text-on-surface text-[13px] block">
                        {hosp.name}
                      </span>
                      <span className="text-[11px] font-mono text-outline">
                        {hosp.address}
                      </span>
                    </div>
                  </div>
                </td>
                <td className="p-3 font-mono text-[11px] uppercase">
                  {hosp.type.replace('_', ' ')}
                </td>
                <td className="p-3">
                  <StatusBadge status={hosp.status} />
                </td>
                <td className="p-3 font-mono text-[12px]">
                  {hosp.estimatedShortageHours ? (
                    <span className="text-error font-bold">
                      &lt; {hosp.estimatedShortageHours} hours
                    </span>
                  ) : (
                    <span className="text-primary">&gt; 48 hours</span>
                  )}
                </td>
                <td className="p-3 font-mono text-[11px]">
                  {hosp.patientsServed} / {hosp.capacity}
                </td>
                <td className="p-3 text-right font-mono font-bold text-[13px]">
                  <span className={hosp.status === 'critical' ? 'text-error' : 'text-primary'}>
                    {hosp.priorityScore.toFixed(1)}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Facility Detail Drawer */}
      <DetailPanel
        isOpen={Boolean(selectedFacility)}
        onClose={() => setSelectedFacility(null)}
        title={selectedFacility?.name || 'Facility Telemetry'}
        subtitle={`Facility ID: ${selectedFacility?.id} | Telemetry Live`}
        actions={
          <button
            onClick={() => setSelectedFacility(null)}
            className="px-4 py-1.5 bg-primary-container text-on-primary rounded font-mono text-xs font-bold cursor-pointer"
          >
            Close Inspector
          </button>
        }
      >
        {selectedFacility && (
          <div className="space-y-4 font-sans text-xs">
            <div className="flex items-center gap-2">
              <StatusBadge status={selectedFacility.status} size="md" />
              <span className="font-mono text-xs font-bold text-primary">
                Priority Score: {selectedFacility.priorityScore}
              </span>
            </div>

            {/* Quick Actions Panel */}
            <div className="p-3 bg-surface-container rounded-lg border border-outline-variant space-y-2 font-mono">
              <span className="text-outline text-[10px] uppercase font-bold block">
                Emergency Actions
              </span>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => {
                    updateHospitalStatus(selectedFacility.id, 'critical', 4);
                    setSelectedFacility({
                      ...selectedFacility,
                      status: 'critical',
                      estimatedShortageHours: 4,
                    });
                  }}
                  className="py-1.5 px-2 bg-error/10 hover:bg-error/20 text-error font-bold rounded border border-error/30 transition-colors cursor-pointer text-center text-[11px]"
                >
                  Flag Critical Shortage
                </button>
                <button
                  type="button"
                  onClick={() => {
                    updateHospitalStatus(selectedFacility.id, 'normal', null);
                    setSelectedFacility({
                      ...selectedFacility,
                      status: 'normal',
                      estimatedShortageHours: null,
                    });
                  }}
                  className="py-1.5 px-2 bg-primary/10 hover:bg-primary/20 text-primary font-bold rounded border border-primary/30 transition-colors cursor-pointer text-center text-[11px]"
                >
                  Mark Replenished
                </button>
              </div>
            </div>

            <div className="p-3 bg-surface-container-low rounded-lg border border-outline-variant font-mono space-y-2">
              <div>
                <span className="text-outline text-[10px] block uppercase">Address</span>
                <span className="font-semibold text-on-surface">{selectedFacility.address}</span>
              </div>
              <div>
                <span className="text-outline text-[10px] block uppercase">Coordinates</span>
                <span className="text-on-surface">
                  {selectedFacility.position.lat.toFixed(4)}°N, {selectedFacility.position.lng.toFixed(4)}°E
                </span>
              </div>
              <div>
                <span className="text-outline text-[10px] block uppercase">Occupancy</span>
                <span className="font-semibold text-on-surface">
                  {selectedFacility.patientsServed} / {selectedFacility.capacity} beds (
                  {Math.round((selectedFacility.patientsServed / selectedFacility.capacity) * 100)}%)
                </span>
              </div>
            </div>

            <div>
              <span className="font-mono text-[10px] text-outline uppercase font-semibold block mb-1">
                Resource Buffer Reserves
              </span>
              <div className="space-y-2 font-mono">
                <div className="flex justify-between p-2 bg-surface-container-low rounded border border-outline-variant">
                  <span>Essential Medicine</span>
                  <span className="font-bold text-error">
                    {selectedFacility.supplies.medicine}h remaining
                  </span>
                </div>
                <div className="flex justify-between p-2 bg-surface-container-low rounded border border-outline-variant">
                  <span>Food Reserves</span>
                  <span className="font-bold">{selectedFacility.supplies.food}h remaining</span>
                </div>
                <div className="flex justify-between p-2 bg-surface-container-low rounded border border-outline-variant">
                  <span>Potable Water Buffer</span>
                  <span className="font-bold">{selectedFacility.supplies.water}h remaining</span>
                </div>
                <div className="flex justify-between p-2 bg-surface-container-low rounded border border-outline-variant">
                  <span>Emergency Power Backup</span>
                  <span className={selectedFacility.supplies.power ? 'text-primary font-bold' : 'text-error font-bold'}>
                    {selectedFacility.supplies.power ? 'OPERATIONAL' : 'OFFLINE / FAILING'}
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}
      </DetailPanel>
    </div>
  );
}

