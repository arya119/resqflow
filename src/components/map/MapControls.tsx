'use client';

import React from 'react';
import { useMap } from 'react-leaflet';
import { useSimulationStore } from '@/store/simulationStore';
import clsx from 'clsx';

export function MapControls() {
  const map = useMap();
  const { currentLocation, isAutoScanActive, toggleAutoScan } = useSimulationStore();

  const handleRecenter = () => {
    map.setView([currentLocation.center.lat, currentLocation.center.lng], currentLocation.zoom, {
      animate: true,
    });
  };

  const handleZoomIn = () => {
    map.zoomIn();
  };

  const handleZoomOut = () => {
    map.zoomOut();
  };

  return (
    <div className="absolute top-3 right-3 flex flex-col gap-1.5 z-[1000]">
      {/* Auto Scan Toggle Button */}
      <button
        type="button"
        onClick={toggleAutoScan}
        className={clsx(
          'p-1.5 border rounded-md shadow-sm transition-all backdrop-blur-sm cursor-pointer flex items-center justify-center relative group',
          isAutoScanActive
            ? 'bg-primary text-on-primary border-primary ring-2 ring-primary/40 shadow-md'
            : 'bg-surface/90 hover:bg-surface text-on-surface-variant hover:text-primary border-outline-variant'
        )}
        title={isAutoScanActive ? 'Stop Map Auto Scan' : 'Start Map Auto Scan (Sector Orbit)'}
      >
        <span
          className={clsx(
            'material-symbols-outlined text-[18px]',
            isAutoScanActive && 'animate-spin'
          )}
          style={{ animationDuration: '4s' }}
        >
          radar
        </span>
        {isAutoScanActive && (
          <span className="absolute -top-1 -right-1 flex h-2.5 w-2.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75" />
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-primary" />
          </span>
        )}
      </button>

      <div className="h-px bg-outline-variant my-0.5" />

      {/* Recenter */}
      <button
        type="button"
        onClick={handleRecenter}
        className="p-1.5 bg-surface/90 hover:bg-surface border border-outline-variant rounded-md shadow-sm text-on-surface-variant hover:text-primary transition-colors backdrop-blur-sm cursor-pointer"
        title="Recenter Map to Base Location"
      >
        <span className="material-symbols-outlined text-[18px]">my_location</span>
      </button>

      {/* Zoom Controls */}
      <button
        type="button"
        onClick={handleZoomIn}
        className="p-1.5 bg-surface/90 hover:bg-surface border border-outline-variant rounded-md shadow-sm text-on-surface-variant hover:text-primary transition-colors backdrop-blur-sm cursor-pointer"
        title="Zoom In"
      >
        <span className="material-symbols-outlined text-[18px]">add</span>
      </button>
      <button
        type="button"
        onClick={handleZoomOut}
        className="p-1.5 bg-surface/90 hover:bg-surface border border-outline-variant rounded-md shadow-sm text-on-surface-variant hover:text-primary transition-colors backdrop-blur-sm cursor-pointer"
        title="Zoom Out"
      >
        <span className="material-symbols-outlined text-[18px]">remove</span>
      </button>
    </div>
  );
}
