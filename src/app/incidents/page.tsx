'use client';

import React, { useState, useEffect } from 'react';
import { useSimulationStore } from '@/store/simulationStore';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { DetailPanel } from '@/components/ui/DetailPanel';
import type { Incident } from '@/types';
import clsx from 'clsx';

export default function IncidentsPage() {
  const {
    activeIncidents,
    currentLocation,
    refreshIncidents,
    isRefreshingIncidents,
    lastIncidentSync,
    openReportIncidentModal,
    resolveIncident,
  } = useSimulationStore();

  const [selectedIncident, setSelectedIncident] = useState<Incident | null>(null);
  const [filterType, setFilterType] = useState<string>('all');
  const [autoRefresh, setAutoRefresh] = useState<boolean>(true);
  const [secondsAgo, setSecondsAgo] = useState<number>(0);

  // Periodic ticker for "seconds ago"
  useEffect(() => {
    const interval = setInterval(() => {
      const diff = Math.floor((Date.now() - new Date(lastIncidentSync).getTime()) / 1000);
      setSecondsAgo(Math.max(0, diff));
    }, 1000);
    return () => clearInterval(interval);
  }, [lastIncidentSync]);

  // Auto-refresh interval (every 12 seconds when autoRefresh is enabled)
  useEffect(() => {
    if (!autoRefresh) return;
    const interval = setInterval(() => {
      refreshIncidents();
    }, 12000);
    return () => clearInterval(interval);
  }, [autoRefresh, refreshIncidents]);

  const filteredIncidents = activeIncidents.filter((inc) => {
    if (filterType === 'all') return true;
    return inc.type === filterType;
  });

  return (
    <div className="space-y-4 max-w-[1600px] mx-auto">
      {/* Real-time Telemetry Status Bar */}
      <div className="bg-surface border border-outline-variant rounded-lg p-3 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-xs font-mono text-xs">
        <div className="flex items-center gap-2.5">
          <span className="relative flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-error opacity-75" />
            <span className="relative inline-flex rounded-full h-3 w-3 bg-error" />
          </span>
          <div>
            <span className="font-bold text-on-surface">
              Live Sensor & Radar Stream — {currentLocation.name} ({currentLocation.state})
            </span>
            <span className="text-[11px] text-outline block sm:inline sm:ml-2">
              (Telemetry sync: {secondsAgo === 0 ? 'Just now' : `${secondsAgo}s ago`})
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          {/* Auto Refresh Toggle */}
          <button
            onClick={() => setAutoRefresh(!autoRefresh)}
            className={clsx(
              'px-2.5 py-1 rounded border text-[11px] font-semibold transition-colors flex items-center gap-1 cursor-pointer',
              autoRefresh
                ? 'bg-primary/10 text-primary border-primary/30'
                : 'bg-surface border-outline-variant text-on-surface-variant'
            )}
          >
            <span
              className={clsx(
                'w-2 h-2 rounded-full',
                autoRefresh ? 'bg-primary animate-pulse' : 'bg-outline'
              )}
            />
            <span>Auto-Sync: {autoRefresh ? '12s ON' : 'OFF'}</span>
          </button>

          {/* Manual Refresh Button */}
          <button
            onClick={() => refreshIncidents()}
            disabled={isRefreshingIncidents}
            className="px-3 py-1 bg-surface-container hover:bg-surface border border-outline-variant rounded text-on-surface font-bold text-[11px] transition-all flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
          >
            <span
              className={clsx(
                'material-symbols-outlined text-[16px] text-primary',
                isRefreshingIncidents && 'animate-spin'
              )}
            >
              refresh
            </span>
            <span>{isRefreshingIncidents ? 'Polling Sensors...' : 'Refresh Feed'}</span>
          </button>
        </div>
      </div>

      {/* Filter & Action Toolbar */}
      <div className="bg-surface border border-outline-variant rounded-lg p-3 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-xs">
        {/* Filters */}
        <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto font-mono text-xs">
          <span className="text-on-surface-variant font-semibold mr-1">Filter:</span>
          {['all', 'flood', 'road_closure', 'accident'].map((tab) => (
            <button
              key={tab}
              onClick={() => setFilterType(tab)}
              className={clsx(
                'px-3 py-1 rounded-md border text-[11px] font-semibold transition-colors cursor-pointer',
                filterType === tab
                  ? 'bg-secondary-container text-on-secondary-container border-primary font-bold'
                  : 'bg-surface border-outline-variant text-on-surface hover:bg-surface-container'
              )}
            >
              {tab === 'all' ? `All Incidents (${activeIncidents.length})` : tab.replace('_', ' ').toUpperCase()}
            </button>
          ))}
        </div>

        {/* Report New SOS Incident Button */}
        <button
          type="button"
          onClick={openReportIncidentModal}
          className="px-3.5 py-1.5 bg-error hover:bg-error/90 text-white font-mono text-xs font-bold rounded-lg transition-all shadow-xs flex items-center gap-1.5 cursor-pointer animate-pulse hover:animate-none"
        >
          <span className="material-symbols-outlined text-[16px]">add_alert</span>
          <span>Report SOS Incident</span>
        </button>
      </div>

      {/* Incidents grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
        {filteredIncidents.map((incident) => {
          return (
            <div
              key={incident.id}
              onClick={() => setSelectedIncident(incident)}
              className="bg-surface border border-outline-variant rounded-lg p-4 hover:border-primary/50 transition-all cursor-pointer shadow-xs flex flex-col justify-between group"
            >
              <div>
                <div className="flex items-start justify-between gap-2 mb-2">
                  <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-error text-[20px]">
                      {incident.type === 'flood'
                        ? 'water'
                        : incident.type === 'accident'
                        ? 'car_crash'
                        : 'block'}
                    </span>
                    <span className="font-mono text-xs text-outline font-semibold">
                      {incident.id}
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <StatusBadge status={incident.severity} />
                    <StatusBadge status={incident.status} />
                  </div>
                </div>

                <h3 className="text-sm font-bold text-on-surface group-hover:text-primary transition-colors font-sans">
                  {incident.title}
                </h3>
                <p className="text-xs text-on-surface-variant mt-1 leading-relaxed">
                  {incident.description}
                </p>

                <div className="mt-3 p-2 bg-surface-container-low rounded border border-outline-variant/60 font-mono text-[11px] space-y-1">
                  <div className="flex items-center gap-1.5 text-on-surface-variant">
                    <span className="material-symbols-outlined text-[14px]">location_on</span>
                    <span className="truncate">{incident.location}</span>
                  </div>
                  <div className="flex items-center gap-3 text-outline">
                    <span>Roads: {incident.affectedRoads.join(', ')}</span>
                    {incident.affectedZones.length > 0 && (
                      <span>Zones: {incident.affectedZones.join(', ')}</span>
                    )}
                  </div>
                </div>
              </div>

              <div className="mt-3 pt-2 border-t border-outline-variant/60 flex items-center justify-between text-[11px] font-mono text-outline">
                <span className="flex items-center gap-1 text-on-surface-variant font-medium">
                  <span className="material-symbols-outlined text-[13px] text-primary">schedule</span>
                  <span>Reported: {incident.reportedAt}</span>
                </span>
                <span className="text-primary font-semibold group-hover:translate-x-0.5 transition-transform flex items-center gap-0.5">
                  Inspect Incident <span className="material-symbols-outlined text-[14px]">arrow_forward</span>
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Incident Detail Drawer */}
      <DetailPanel
        isOpen={Boolean(selectedIncident)}
        onClose={() => setSelectedIncident(null)}
        title={selectedIncident?.title || 'Incident Detail'}
        subtitle={`Incident ID: ${selectedIncident?.id} | Telemetry Live`}
        actions={
          <>
            <button
              onClick={() => {
                if (selectedIncident) {
                  resolveIncident(selectedIncident.id);
                  setSelectedIncident(null);
                }
              }}
              className="px-3 py-1.5 bg-primary/10 hover:bg-primary/20 text-primary border border-primary/30 rounded font-mono text-xs font-bold cursor-pointer"
            >
              Mark Hazard Resolved
            </button>
            <button
              onClick={() => setSelectedIncident(null)}
              className="px-3 py-1.5 bg-primary-container text-on-primary rounded font-mono text-xs font-bold cursor-pointer"
            >
              Close
            </button>
          </>
        }
      >
        {selectedIncident && (
          <div className="space-y-4 font-sans text-xs">
            <div className="flex gap-2">
              <StatusBadge status={selectedIncident.severity} size="md" />
              <StatusBadge status={selectedIncident.status} size="md" />
            </div>

            <div>
              <span className="font-mono text-[10px] text-outline uppercase font-semibold block">
                Detailed Narrative
              </span>
              <p className="text-on-surface text-sm mt-1 leading-relaxed">
                {selectedIncident.description}
              </p>
            </div>

            <div className="p-3 bg-surface-container rounded-lg border border-outline-variant font-mono space-y-2">
              <div>
                <span className="text-outline text-[10px] block uppercase">Sector Location</span>
                <span className="font-semibold text-on-surface">{selectedIncident.location}</span>
              </div>
              <div>
                <span className="text-outline text-[10px] block uppercase">GPS Coordinates</span>
                <span className="text-on-surface">
                  {selectedIncident.position.lat.toFixed(4)}°N, {selectedIncident.position.lng.toFixed(4)}°E
                </span>
              </div>
              <div>
                <span className="text-outline text-[10px] block uppercase">Affected Road Corridors</span>
                <div className="flex flex-wrap gap-1 mt-1">
                  {selectedIncident.affectedRoads.map((r) => (
                    <span key={r} className="bg-error/10 text-error px-1.5 py-0.5 rounded text-[10px] font-bold">
                      {r}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </DetailPanel>
    </div>
  );
}
