'use client';

import React from 'react';
import { useSimulationStore } from '@/store/simulationStore';
import clsx from 'clsx';

export function PriorityList() {
  const {
    activePlanItem,
    setActivePlanItem,
    deliveryPlan,
    activeHospitals,
    currentLocation,
  } = useSimulationStore();

  const rankedHospitals = [...activeHospitals]
    .sort((a, b) => b.priorityScore - a.priorityScore)
    .slice(0, 6);

  return (
    <div className="bg-surface border border-outline-variant rounded-lg overflow-hidden flex flex-col shadow-xs">
      {/* Header */}
      <div className="p-3 border-b border-outline-variant bg-surface-container-low flex items-center justify-between">
        <h3 className="font-mono text-xs font-bold text-on-surface uppercase tracking-wider">
          Critical Locations Queue — {currentLocation.name} ({currentLocation.state})
        </h3>
        <span className="text-[11px] font-mono text-outline">
          Top {rankedHospitals.length} of {activeHospitals.length}
        </span>
      </div>

      {/* Table */}
      <div className="overflow-x-auto flex-1">
        <table className="w-full text-left text-xs border-collapse">
          <thead className="bg-surface-container-lowest text-outline font-mono text-[10px] uppercase border-b border-outline-variant">
            <tr>
              <th className="p-2.5 w-12 text-center font-semibold">Rank</th>
              <th className="p-2.5 font-semibold">Location</th>
              <th className="p-2.5 font-semibold">Critical Need</th>
              <th className="p-2.5 text-right font-semibold">Priority Score</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-outline-variant/60 font-mono">
            {rankedHospitals.map((hosp, idx) => {
              const rankStr = String(idx + 1).padStart(2, '0');
              const isSelected = activePlanItem?.destinationId === hosp.id;
              const isCritical = hosp.status === 'critical';

              return (
                <tr
                  key={hosp.id}
                  onClick={() => {
                    const matchedItem = deliveryPlan.items.find(
                      (item) => item.destinationId === hosp.id
                    );
                    if (matchedItem) {
                      setActivePlanItem(matchedItem);
                    }
                  }}
                  className={clsx(
                    'transition-colors cursor-pointer',
                    isSelected ? 'bg-secondary-container/50' : 'hover:bg-surface-container-low',
                    isCritical && !isSelected && 'bg-error/5'
                  )}
                >
                  <td
                    className={clsx(
                      'p-2.5 text-center font-bold',
                      isCritical ? 'text-error' : 'text-on-surface-variant'
                    )}
                  >
                    {rankStr}
                  </td>
                  <td className="p-2.5">
                    <span className="font-sans font-medium text-on-surface text-[12px] block">
                      {hosp.name}
                    </span>
                    <span className="text-[10px] text-outline">
                      {hosp.address.split(',')[0]}
                    </span>
                  </td>
                  <td className="p-2.5">
                    <span
                      className={clsx(
                        'text-[11px]',
                        isCritical ? 'text-error font-semibold' : 'text-on-surface-variant'
                      )}
                    >
                      {hosp.estimatedShortageHours
                        ? `Medicine shortage < ${hosp.estimatedShortageHours}h`
                        : 'Routine supply requisition'}
                    </span>
                  </td>
                  <td
                    className={clsx(
                      'p-2.5 text-right font-bold text-[12px]',
                      isCritical ? 'text-error' : 'text-primary'
                    )}
                  >
                    {hosp.priorityScore.toFixed(1)}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
