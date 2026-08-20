'use client';

import React from 'react';
import { useSimulationStore } from '@/store/simulationStore';

export function MapLegend() {
  const { mapLayers, toggleMapLayer } = useSimulationStore();

  return (
    <div className="absolute bottom-3 left-3 bg-surface/95 border border-outline-variant rounded-lg p-2.5 backdrop-blur-md shadow-md z-[1000] max-w-[210px]">
      <div className="flex items-center justify-between mb-1.5 pb-1 border-b border-outline-variant/60">
        <h4 className="font-mono text-[10px] font-bold text-on-surface-variant uppercase tracking-wider">
          Legend & Layers
        </h4>
        <span className="text-[9px] text-outline font-mono">Toggle</span>
      </div>

      <ul className="space-y-1 font-mono text-[11px]">
        <li>
          <button
            onClick={() => toggleMapLayer('hospitals')}
            className={`flex items-center gap-2 w-full text-left transition-opacity ${
              mapLayers.hospitals ? 'opacity-100' : 'opacity-40'
            }`}
          >
            <span className="w-2.5 h-2.5 rounded-full bg-error border border-white shrink-0 shadow-xs" />
            <span className="text-on-surface truncate">Hospital (Critical)</span>
          </button>
        </li>
        <li>
          <button
            onClick={() => toggleMapLayer('hospitals')}
            className={`flex items-center gap-2 w-full text-left transition-opacity ${
              mapLayers.hospitals ? 'opacity-100' : 'opacity-40'
            }`}
          >
            <span className="w-2.5 h-2.5 rounded-full bg-tertiary border border-white shrink-0 shadow-xs" />
            <span className="text-on-surface truncate">Relief Center</span>
          </button>
        </li>
        <li>
          <button
            onClick={() => toggleMapLayer('warehouses')}
            className={`flex items-center gap-2 w-full text-left transition-opacity ${
              mapLayers.warehouses ? 'opacity-100' : 'opacity-40'
            }`}
          >
            <span className="w-2.5 h-2.5 rounded-full bg-primary border border-white shrink-0 shadow-xs" />
            <span className="text-on-surface truncate">Warehouse Depot</span>
          </button>
        </li>
        <li>
          <button
            onClick={() => toggleMapLayer('vehicles')}
            className={`flex items-center gap-2 w-full text-left transition-opacity ${
              mapLayers.vehicles ? 'opacity-100' : 'opacity-40'
            }`}
          >
            <span className="w-2.5 h-2.5 rounded-full bg-secondary border border-white shrink-0 shadow-xs" />
            <span className="text-on-surface truncate">Vehicle Unit</span>
          </button>
        </li>
        <li>
          <button
            onClick={() => toggleMapLayer('routes')}
            className={`flex items-center gap-2 w-full text-left transition-opacity ${
              mapLayers.routes ? 'opacity-100' : 'opacity-40'
            }`}
          >
            <span className="w-4 h-0.5 bg-primary-container inline-block shrink-0" />
            <span className="text-primary font-bold truncate">Optimal Route</span>
          </button>
        </li>
        <li>
          <button
            onClick={() => toggleMapLayer('floodZones')}
            className={`flex items-center gap-2 w-full text-left transition-opacity ${
              mapLayers.floodZones ? 'opacity-100' : 'opacity-40'
            }`}
          >
            <span className="w-3 h-2 bg-error/30 border border-error inline-block shrink-0 rounded-xs" />
            <span className="text-error font-medium truncate">Flood Inundation</span>
          </button>
        </li>
      </ul>
    </div>
  );
}
