'use client';

import React, { useState } from 'react';
import { useSimulationStore } from '@/store/simulationStore';
import { LOCATIONS } from '@/data/mock';
import type { RegionType, Location } from '@/types';
import clsx from 'clsx';

const REGIONS: (RegionType | 'All')[] = [
  'All',
  'North',
  'North-East',
  'East',
  'South',
  'West',
  'Central',
];

export function AllStatesPreviewModal() {
  const {
    isStatesPreviewOpen,
    closeStatesPreview,
    currentLocation,
    setLocation,
  } = useSimulationStore();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRegion, setSelectedRegion] = useState<RegionType | 'All'>('All');
  const [riskFilter, setRiskFilter] = useState<'All' | 'High' | 'Moderate'>('All');

  if (!isStatesPreviewOpen) return null;

  const filteredLocations = LOCATIONS.filter((loc) => {
    // Region match
    if (selectedRegion !== 'All' && loc.region !== selectedRegion) return false;

    // Risk match
    if (riskFilter === 'High' && loc.riskIndex < 80) return false;
    if (riskFilter === 'Moderate' && (loc.riskIndex < 60 || loc.riskIndex >= 80)) return false;

    // Search match
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        loc.name.toLowerCase().includes(q) ||
        loc.state.toLowerCase().includes(q) ||
        loc.disasterProfile.toLowerCase().includes(q) ||
        loc.region.toLowerCase().includes(q)
      );
    }

    return true;
  });

  const highRiskCount = LOCATIONS.filter((l) => l.riskIndex >= 80).length;
  const totalFacilitiesCount = LOCATIONS.reduce((acc, l) => acc + l.criticalFacilities, 0);
  const totalWarehousesCount = LOCATIONS.reduce((acc, l) => acc + l.warehousesCount, 0);

  const handleSelectState = (loc: Location) => {
    setLocation(loc);
    closeStatesPreview();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/60 backdrop-blur-xs animate-in fade-in duration-150">
      <div
        className="w-full max-w-6xl h-[90vh] bg-surface border border-outline-variant rounded-xl shadow-2xl flex flex-col overflow-hidden"
        role="dialog"
        aria-modal="true"
      >
        {/* Modal Header */}
        <div className="px-5 py-4 border-b border-outline-variant bg-surface-container-low flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shrink-0">
          <div>
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-primary text-[24px]">
                public
              </span>
              <h2 className="text-lg font-bold text-on-surface font-sans">
                National Disaster Command Matrix — 29 Indian States & Territories
              </h2>
              <span className="bg-primary/10 text-primary font-mono text-[11px] font-bold px-2 py-0.5 rounded-full border border-primary/20">
                {LOCATIONS.length} State Nodes
              </span>
            </div>
            <p className="text-xs text-on-surface-variant font-mono mt-0.5">
              Live logistics telemetry, high-risk vulnerability profiles, and regional supply nodes across India
            </p>
          </div>

          <button
            onClick={closeStatesPreview}
            className="p-1.5 rounded-lg hover:bg-surface-container text-on-surface-variant transition-colors self-end sm:self-auto cursor-pointer"
            title="Close Preview Mode"
          >
            <span className="material-symbols-outlined text-[22px]">close</span>
          </button>
        </div>

        {/* National Stats Strip */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 px-5 py-3 bg-surface-container border-b border-outline-variant/60 font-mono text-xs shrink-0">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-primary" />
            <div>
              <span className="text-[10px] text-outline uppercase block">Monitored States/UTs</span>
              <span className="font-bold text-on-surface text-[13px]">{LOCATIONS.length} Jurisdictions</span>
            </div>
          </div>

          <div className="flex items-center gap-2 border-l border-outline-variant/60 pl-3">
            <span className="w-2.5 h-2.5 rounded-full bg-error animate-pulse" />
            <div>
              <span className="text-[10px] text-outline uppercase block">High-Risk Vulnerable Zones</span>
              <span className="font-bold text-error text-[13px]">{highRiskCount} States (&gt;80% Risk)</span>
            </div>
          </div>

          <div className="flex items-center gap-2 border-l border-outline-variant/60 pl-3">
            <span className="w-2.5 h-2.5 rounded-full bg-secondary" />
            <div>
              <span className="text-[10px] text-outline uppercase block">Mapped Critical Facilities</span>
              <span className="font-bold text-on-surface text-[13px]">{totalFacilitiesCount} Hospitals & Camps</span>
            </div>
          </div>

          <div className="flex items-center gap-2 border-l border-outline-variant/60 pl-3">
            <span className="w-2.5 h-2.5 rounded-full bg-primary" />
            <div>
              <span className="text-[10px] text-outline uppercase block">Regional Supply Depots</span>
              <span className="font-bold text-primary text-[13px]">{totalWarehousesCount} Warehouses</span>
            </div>
          </div>
        </div>

        {/* Filter & Search Toolbar */}
        <div className="px-5 py-3 border-b border-outline-variant/60 flex flex-col md:flex-row items-start md:items-center justify-between gap-3 bg-surface shrink-0">
          {/* Region Tabs */}
          <div className="flex items-center gap-1.5 overflow-x-auto w-full md:w-auto pb-1 md:pb-0 font-mono text-xs">
            <span className="text-on-surface-variant font-semibold mr-1">Region:</span>
            {REGIONS.map((region) => {
              const count =
                region === 'All'
                  ? LOCATIONS.length
                  : LOCATIONS.filter((l) => l.region === region).length;
              return (
                <button
                  key={region}
                  onClick={() => setSelectedRegion(region)}
                  className={clsx(
                    'px-2.5 py-1 rounded-md border text-[11px] font-semibold transition-colors cursor-pointer whitespace-nowrap',
                    selectedRegion === region
                      ? 'bg-secondary-container text-on-secondary-container border-primary font-bold'
                      : 'bg-surface border-outline-variant text-on-surface hover:bg-surface-container'
                  )}
                >
                  {region} ({count})
                </button>
              );
            })}
          </div>

          {/* Search Box & Risk Filter */}
          <div className="flex items-center gap-2 w-full md:w-auto">
            <select
              value={riskFilter}
              onChange={(e) => setRiskFilter(e.target.value as 'All' | 'High' | 'Moderate')}
              className="bg-surface border border-outline-variant rounded-lg px-2.5 py-1 text-xs font-mono text-on-surface focus:outline-none focus:border-primary"
            >
              <option value="All">All Risk Levels</option>
              <option value="High">Critical Risk (&ge;80)</option>
              <option value="Moderate">Moderate Risk (60-79)</option>
            </select>

            <div className="relative flex-1 md:w-60">
              <span className="material-symbols-outlined absolute left-2.5 top-1/2 -translate-y-1/2 text-outline text-[16px]">
                search
              </span>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search state, city, hazard..."
                className="w-full bg-surface-container-low border border-outline-variant rounded-lg pl-8 pr-3 py-1 text-xs text-on-surface placeholder:text-outline focus:outline-none focus:border-primary font-mono"
              />
            </div>
          </div>
        </div>

        {/* States Cards Grid */}
        <div className="flex-1 p-5 overflow-y-auto bg-surface-container-lowest">
          {filteredLocations.length === 0 ? (
            <div className="py-16 text-center text-on-surface-variant font-mono text-sm">
              No state jurisdictions matching &ldquo;{searchQuery}&rdquo; in {selectedRegion} Region.
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5">
              {filteredLocations.map((loc) => {
                const isCurrent = loc.id === currentLocation.id;
                const isCriticalRisk = loc.riskIndex >= 80;

                return (
                  <div
                    key={loc.id}
                    className={clsx(
                      'bg-surface border rounded-lg p-4 flex flex-col justify-between transition-all hover:shadow-md group',
                      isCurrent
                        ? 'border-primary ring-2 ring-primary/40 bg-primary/5'
                        : 'border-outline-variant hover:border-outline'
                    )}
                  >
                    <div>
                      {/* Top Header: State, Region, Active Badge */}
                      <div className="flex items-start justify-between gap-2 mb-1.5">
                        <div>
                          <div className="flex items-center gap-1.5">
                            <h3 className="text-sm font-bold text-on-surface font-sans group-hover:text-primary transition-colors">
                              {loc.state}
                            </h3>
                            {isCurrent && (
                              <span className="bg-primary text-on-primary font-mono text-[9px] font-bold px-1.5 py-0.2 rounded">
                                ACTIVE NODE
                              </span>
                            )}
                          </div>
                          <span className="text-xs text-on-surface-variant font-mono font-medium">
                            {loc.name} Hub &middot; {loc.region} India
                          </span>
                        </div>

                        {/* Risk Index Badge */}
                        <div
                          className={clsx(
                            'text-right font-mono px-2 py-0.5 rounded border text-[11px] font-bold shrink-0',
                            isCriticalRisk
                              ? 'bg-error/10 text-error border-error/20'
                              : 'bg-tertiary/10 text-tertiary border-tertiary/20'
                          )}
                        >
                          Risk: {loc.riskIndex}
                        </div>
                      </div>

                      {/* Disaster Profile */}
                      <p className="text-[12px] text-on-surface-variant mt-1.5 line-clamp-2 leading-relaxed">
                        {loc.disasterProfile}
                      </p>

                      {/* Progress Bar for Risk */}
                      <div className="mt-2.5 space-y-1">
                        <div className="w-full bg-surface-container-high h-1.5 rounded-full overflow-hidden">
                          <div
                            className={clsx(
                              'h-full rounded-full transition-all',
                              isCriticalRisk ? 'bg-error' : 'bg-tertiary'
                            )}
                            style={{ width: `${loc.riskIndex}%` }}
                          />
                        </div>
                      </div>

                      {/* Telemetry Chips */}
                      <div className="grid grid-cols-3 gap-1.5 mt-3 p-2 bg-surface-container-low rounded border border-outline-variant/60 font-mono text-[10px] text-center">
                        <div>
                          <span className="text-outline block">FACILITIES</span>
                          <span className="font-bold text-on-surface">{loc.criticalFacilities}</span>
                        </div>
                        <div>
                          <span className="text-outline block">DEPOTS</span>
                          <span className="font-bold text-primary">{loc.warehousesCount}</span>
                        </div>
                        <div>
                          <span className="text-outline block">ALERTS</span>
                          <span className={clsx('font-bold', loc.activeAlerts > 0 ? 'text-error' : 'text-primary')}>
                            {loc.activeAlerts} Active
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Action Button */}
                    <div className="mt-3 pt-2.5 border-t border-outline-variant/60 flex items-center justify-between">
                      <span className="text-[10px] font-mono text-outline">
                        GPS: {loc.center.lat.toFixed(2)}°N, {loc.center.lng.toFixed(2)}°E
                      </span>
                      <button
                        onClick={() => handleSelectState(loc)}
                        className={clsx(
                          'px-3 py-1 rounded font-mono text-[11px] font-bold transition-all cursor-pointer flex items-center gap-1 shadow-xs',
                          isCurrent
                            ? 'bg-secondary text-on-secondary cursor-default'
                            : 'bg-primary-container hover:bg-primary text-on-primary'
                        )}
                      >
                        {isCurrent ? (
                          <>
                            <span className="material-symbols-outlined text-[14px]">check</span>
                            <span>Currently Active</span>
                          </>
                        ) : (
                          <>
                            <span className="material-symbols-outlined text-[14px]">control_camera</span>
                            <span>Deploy Node</span>
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="px-5 py-3 border-t border-outline-variant bg-surface-container-low flex items-center justify-between font-mono text-xs shrink-0">
          <span className="text-outline">
            Showing {filteredLocations.length} of {LOCATIONS.length} State Command Jurisdictions
          </span>
          <button
            onClick={closeStatesPreview}
            className="px-4 py-1.5 bg-surface border border-outline-variant rounded-lg font-semibold text-on-surface hover:bg-surface-container transition-colors cursor-pointer"
          >
            Close Preview
          </button>
        </div>
      </div>
    </div>
  );
}
