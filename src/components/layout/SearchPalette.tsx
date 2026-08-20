'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useSimulationStore } from '@/store/simulationStore';
import { useRouter } from 'next/navigation';

export function SearchPalette() {
  const router = useRouter();
  const {
    isSearchPaletteOpen,
    closeSearchPalette,
    activeHospitals,
    activeWarehouses,
    activeVehicles,
    activeRoads,
    activeIncidents,
    setSelectedEntity,
    currentLocation,
  } = useSimulationStore();

  const [query, setQuery] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isSearchPaletteOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
    } else {
      setQuery('');
    }
  }, [isSearchPaletteOpen]);

  // Global Cmd+K keyboard shortcut
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        useSimulationStore.getState().openSearchPalette();
      }
      if (e.key === 'Escape' && isSearchPaletteOpen) {
        closeSearchPalette();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isSearchPaletteOpen, closeSearchPalette]);

  if (!isSearchPaletteOpen) return null;

  const q = query.toLowerCase().trim();

  const hospitals = activeHospitals.filter(
    (h) => h.name.toLowerCase().includes(q) || h.id.toLowerCase().includes(q)
  );
  const warehouses = activeWarehouses.filter(
    (w) => w.name.toLowerCase().includes(q) || w.id.toLowerCase().includes(q)
  );
  const vehicles = activeVehicles.filter(
    (v) => v.name.toLowerCase().includes(q) || v.id.toLowerCase().includes(q) || v.driver.toLowerCase().includes(q)
  );
  const roads = activeRoads.filter(
    (r) => r.name.toLowerCase().includes(q) || r.id.toLowerCase().includes(q)
  );
  const incidents = activeIncidents.filter(
    (i) => i.title.toLowerCase().includes(q) || i.id.toLowerCase().includes(q)
  );

  const totalResults =
    hospitals.length + warehouses.length + vehicles.length + roads.length + incidents.length;

  return (
    <div
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          closeSearchPalette();
        }
      }}
      className="fixed inset-0 z-[70] flex items-start justify-center pt-20 p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-150"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-xl bg-surface border border-outline-variant rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150 flex flex-col max-h-[75vh]"
        role="dialog"
        aria-modal="true"
      >
        {/* Search Input Bar */}
        <div className="p-3.5 border-b border-outline-variant bg-surface flex items-center gap-3">
          <span className="material-symbols-outlined text-primary text-[22px]">
            search
          </span>
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={`Search hospitals, depots, vehicles, roads in ${currentLocation.name}...`}
            className="flex-1 bg-transparent text-sm text-on-surface placeholder:text-outline font-sans focus:outline-none"
          />
          <kbd className="hidden sm:inline-block px-1.5 py-0.5 text-[10px] font-mono bg-surface-container rounded border border-outline-variant text-outline">
            ESC
          </kbd>
        </div>

        {/* Results List */}
        <div className="p-3 overflow-y-auto space-y-4 font-sans text-xs flex-1">
          {totalResults === 0 && (
            <div className="py-8 text-center text-on-surface-variant font-mono text-xs">
              No assets matching &ldquo;{query}&rdquo;
            </div>
          )}

          {/* Hospitals */}
          {hospitals.length > 0 && (
            <div className="space-y-1">
              <span className="font-mono text-[10px] uppercase font-bold text-outline px-2">
                Hospitals & Relief Centers
              </span>
              {hospitals.slice(0, 4).map((h) => (
                <button
                  key={h.id}
                  onClick={() => {
                    setSelectedEntity({ type: 'hospital', id: h.id, name: h.name });
                    closeSearchPalette();
                    router.push('/hospitals');
                  }}
                  className="w-full p-2 rounded-lg hover:bg-surface-container-low flex items-center justify-between text-left transition-colors cursor-pointer"
                >
                  <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-[18px] text-primary">
                      {h.type === 'relief_center' ? 'night_shelter' : 'local_hospital'}
                    </span>
                    <div>
                      <span className="font-bold text-on-surface text-xs block">{h.name}</span>
                      <span className="text-[10px] font-mono text-outline">{h.address}</span>
                    </div>
                  </div>
                  <span className="font-mono text-[10px] font-bold text-error uppercase">
                    Risk: {h.priorityScore.toFixed(0)}
                  </span>
                </button>
              ))}
            </div>
          )}

          {/* Warehouses */}
          {warehouses.length > 0 && (
            <div className="space-y-1">
              <span className="font-mono text-[10px] uppercase font-bold text-outline px-2">
                Warehouses & Depots
              </span>
              {warehouses.slice(0, 3).map((w) => (
                <button
                  key={w.id}
                  onClick={() => {
                    setSelectedEntity({ type: 'warehouse', id: w.id, name: w.name });
                    closeSearchPalette();
                    router.push('/warehouses');
                  }}
                  className="w-full p-2 rounded-lg hover:bg-surface-container-low flex items-center justify-between text-left transition-colors cursor-pointer"
                >
                  <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-[18px] text-primary">
                      warehouse
                    </span>
                    <div>
                      <span className="font-bold text-on-surface text-xs block">{w.name}</span>
                      <span className="text-[10px] font-mono text-outline">{w.address}</span>
                    </div>
                  </div>
                  <span className="font-mono text-[10px] font-bold text-primary">
                    {w.currentStock}% Stock
                  </span>
                </button>
              ))}
            </div>
          )}

          {/* Vehicles */}
          {vehicles.length > 0 && (
            <div className="space-y-1">
              <span className="font-mono text-[10px] uppercase font-bold text-outline px-2">
                Vehicles & Trucks
              </span>
              {vehicles.slice(0, 4).map((v) => (
                <button
                  key={v.id}
                  onClick={() => {
                    setSelectedEntity({ type: 'vehicle', id: v.id, name: v.name });
                    closeSearchPalette();
                    router.push('/fleet');
                  }}
                  className="w-full p-2 rounded-lg hover:bg-surface-container-low flex items-center justify-between text-left transition-colors cursor-pointer"
                >
                  <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-[18px] text-secondary">
                      local_shipping
                    </span>
                    <div>
                      <span className="font-bold text-on-surface text-xs block">{v.name}</span>
                      <span className="text-[10px] font-mono text-outline">
                        Driver: {v.driver} &bull; Fuel: {v.fuelLevel}%
                      </span>
                    </div>
                  </div>
                  <span className="font-mono text-[10px] uppercase text-primary font-semibold">
                    {v.status}
                  </span>
                </button>
              ))}
            </div>
          )}

          {/* Roads */}
          {roads.length > 0 && (
            <div className="space-y-1">
              <span className="font-mono text-[10px] uppercase font-bold text-outline px-2">
                Roads & Corridors
              </span>
              {roads.slice(0, 3).map((r) => (
                <button
                  key={r.id}
                  onClick={() => {
                    setSelectedEntity({ type: 'road', id: r.id, name: r.name });
                    closeSearchPalette();
                    router.push('/roads');
                  }}
                  className="w-full p-2 rounded-lg hover:bg-surface-container-low flex items-center justify-between text-left transition-colors cursor-pointer"
                >
                  <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-[18px] text-outline">
                      edit_road
                    </span>
                    <div>
                      <span className="font-bold text-on-surface text-xs block">{r.name}</span>
                      <span className="text-[10px] font-mono text-outline">
                        {r.from} → {r.to}
                      </span>
                    </div>
                  </div>
                  <span className="font-mono text-[10px] uppercase font-bold text-on-surface">
                    {r.status}
                  </span>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-2.5 bg-surface-container-low border-t border-outline-variant flex items-center justify-between text-[11px] font-mono text-outline">
          <span>{totalResults} items available</span>
          <span>Tip: Press ESC or click outside to dismiss</span>
        </div>
      </div>
    </div>
  );
}
