'use client';

import React, { useState, useRef, useEffect } from 'react';
import { useSimulationStore } from '@/store/simulationStore';
import { LOCATIONS } from '@/data/mock';
import type { RegionType } from '@/types';

export function LocationSelector() {
  const { currentLocation, setLocation, openStatesPreview } = useSimulationStore();
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState('');
  const [activeRegion, setActiveRegion] = useState<RegionType | 'All'>('All');
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const filteredLocations = LOCATIONS.filter((loc) => {
    if (activeRegion !== 'All' && loc.region !== activeRegion) return false;
    if (search.trim()) {
      const q = search.toLowerCase();
      return (
        loc.name.toLowerCase().includes(q) ||
        loc.state.toLowerCase().includes(q) ||
        loc.region.toLowerCase().includes(q)
      );
    }
    return true;
  });

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Trigger Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        suppressHydrationWarning
        className="flex items-center gap-2 bg-surface-container-low px-3 py-1.5 rounded-lg border border-outline-variant hover:bg-surface-container transition-colors text-left cursor-pointer"
      >
        <span className="material-symbols-outlined text-primary text-[18px]">
          location_on
        </span>
        <div className="flex flex-col">
          <span className="text-[13px] font-semibold text-on-surface leading-tight">
            {currentLocation.name}, {currentLocation.state}
          </span>
          <span className="text-[10px] text-on-surface-variant font-mono">
            {currentLocation.region} India Node ({LOCATIONS.length} States)
          </span>
        </div>
        <span className="material-symbols-outlined text-outline text-[16px] ml-1">
          {isOpen ? 'expand_less' : 'expand_more'}
        </span>
      </button>

      {/* Expanded Dropdown */}
      {isOpen && (
        <div className="absolute left-0 mt-1.5 w-80 bg-surface border border-outline-variant rounded-xl shadow-2xl z-50 overflow-hidden animate-in fade-in zoom-in-95 duration-100 flex flex-col max-h-[460px]">
          {/* Header & Matrix CTA */}
          <div className="p-2.5 border-b border-outline-variant bg-surface-container-low flex flex-col gap-2 shrink-0">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-mono uppercase font-bold text-on-surface">
                Select Indian State Node ({LOCATIONS.length})
              </span>
              <button
                onClick={() => {
                  setIsOpen(false);
                  openStatesPreview();
                }}
                className="text-[10px] font-mono font-bold text-primary hover:underline flex items-center gap-0.5"
              >
                <span className="material-symbols-outlined text-[13px]">grid_view</span>
                <span>Matrix View</span>
              </button>
            </div>

            {/* Quick Search */}
            <div className="relative">
              <span className="material-symbols-outlined absolute left-2 top-1/2 -translate-y-1/2 text-outline text-[15px]">
                search
              </span>
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search locations across India..."
                className="w-full bg-surface border border-outline-variant rounded-lg pl-7 pr-2.5 py-1 text-xs font-mono text-on-surface placeholder:text-outline focus:outline-none focus:border-primary"
              />
            </div>

            {/* Region pills */}
            <div className="flex items-center gap-1 overflow-x-auto pb-0.5 font-mono text-[10px]">
              {(['All', 'North-East', 'North', 'South', 'East', 'West', 'Central'] as const).map(
                (reg) => (
                  <button
                    key={reg}
                    onClick={() => setActiveRegion(reg)}
                    className={`px-2 py-0.5 rounded border whitespace-nowrap cursor-pointer ${
                      activeRegion === reg
                        ? 'bg-secondary-container text-on-secondary-container border-primary font-bold'
                        : 'bg-surface border-outline-variant/60 text-on-surface-variant hover:bg-surface-container'
                    }`}
                  >
                    {reg}
                  </button>
                )
              )}
            </div>
          </div>

          {/* Locations list */}
          <div className="flex-1 overflow-y-auto divide-y divide-outline-variant/50 p-1">
            {filteredLocations.length === 0 ? (
              <div className="py-6 text-center text-on-surface-variant font-mono text-xs">
                No states matching &ldquo;{search}&rdquo;
              </div>
            ) : (
              filteredLocations.map((loc) => {
                const isSelected = loc.id === currentLocation.id;
                const isHighRisk = loc.riskIndex >= 80;

                return (
                  <button
                    key={loc.id}
                    onClick={() => {
                      setLocation(loc);
                      setIsOpen(false);
                    }}
                    suppressHydrationWarning
                    className={`w-full flex items-center justify-between px-3 py-2 text-left rounded-lg transition-colors cursor-pointer ${
                      isSelected
                        ? 'bg-secondary-container text-on-secondary-container font-semibold'
                        : 'hover:bg-surface-container-low text-on-surface'
                    }`}
                  >
                    <div>
                      <div className="text-[13px] font-medium flex items-center gap-1.5">
                        <span>{loc.state}</span>
                        <span className="text-[10px] font-mono text-outline font-normal">
                          ({loc.name})
                        </span>
                      </div>
                      <div className="text-[11px] text-on-surface-variant font-mono truncate max-w-[200px]">
                        {loc.disasterProfile.split('&')[0]}
                      </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <span
                        className={`text-[10px] font-mono font-bold px-1.5 py-0.2 rounded ${
                          isHighRisk
                            ? 'bg-error/10 text-error'
                            : 'bg-primary/10 text-primary'
                        }`}
                      >
                        {loc.riskIndex} Risk
                      </span>
                      {isSelected && (
                        <span className="material-symbols-outlined text-primary text-[16px]">
                          check
                        </span>
                      )}
                    </div>
                  </button>
                );
              })
            )}
          </div>

          {/* Footer CTA: Full 29 States Preview Mode */}
          <div className="p-2 border-t border-outline-variant bg-surface-container shrink-0">
            <button
              onClick={() => {
                setIsOpen(false);
                openStatesPreview();
              }}
              className="w-full py-1.5 px-2.5 bg-primary-container hover:bg-primary text-on-primary font-mono text-xs font-bold rounded-lg flex items-center justify-center gap-1.5 shadow-xs transition-colors cursor-pointer"
            >
              <span className="material-symbols-outlined text-[16px]">public</span>
              <span>Open All 29 States Command Preview</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
