'use client';

import React from 'react';
import { useSimulationStore } from '@/store/simulationStore';

interface TimelineEvent {
  id: string;
  time: string;
  agent: string;
  action: string;
  details: string;
  status: 'completed' | 'warning' | 'critical' | 'info';
  icon: string;
}

const TIMELINE_EVENTS: TimelineEvent[] = [
  {
    id: 'EVT-001',
    time: '17:48:12 UTC',
    agent: 'Orchestrator Agent',
    action: 'Synthesized Optimal Multi-Facility Delivery Schedule',
    details: 'OR-Tools completed branch-and-bound linear allocation in 42ms. 5 critical facilities queued.',
    status: 'completed',
    icon: '⚡',
  },
  {
    id: 'EVT-002',
    time: '17:48:08 UTC',
    agent: 'Fleet Agent',
    action: 'Allocated Vehicle V-14 (Rapid Response Medical Van)',
    details: 'Verified cold-chain capability and 94% fuel level at Milan Nagar sector.',
    status: 'completed',
    icon: 'local_shipping',
  },
  {
    id: 'EVT-003',
    time: '17:48:02 UTC',
    agent: 'Inventory Agent',
    action: 'Locked 120 Units of Trauma Medicine at W-02',
    details: 'Depot W-02 stock reserved without impacting secondary district thresholds.',
    status: 'completed',
    icon: 'inventory_2',
  },
  {
    id: 'EVT-004',
    time: '17:47:55 UTC',
    agent: 'Mobility Agent',
    action: 'Computed Alternate Route B (High Elevation Inner Ring)',
    details: 'Primary riverbank road R-SEC-02 flagged impassable; rerouted via 4.1km paved bypass.',
    status: 'warning',
    icon: 'alt_route',
  },
  {
    id: 'EVT-005',
    time: '17:47:48 UTC',
    agent: 'Risk Agent',
    action: 'Classified Zone 1 & 2 Flood Inundation Vectors',
    details: 'Upper catchment runoff elevated Brahmaputra gauge by +1.4m. Hazard warning active.',
    status: 'critical',
    icon: 'crisis_alert',
  },
  {
    id: 'EVT-006',
    time: '17:47:30 UTC',
    agent: 'Demand Agent',
    action: 'Predicted Severe Stockout at District Hospital H-07',
    details: 'Consumption surge detected. Estimated remaining medicine buffer under 7 hours.',
    status: 'critical',
    icon: 'emergency',
  },
];

export default function ActivityPage() {
  const { recalculatePlan } = useSimulationStore();

  return (
    <div className="space-y-4 max-w-[1200px] mx-auto">
      {/* Top Banner */}
      <div className="bg-surface border border-outline-variant rounded-lg p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-primary text-[22px]">
              history
            </span>
            <h2 className="text-base font-bold text-on-surface font-sans">
              Autonomous Multi-Agent Activity Timeline
            </h2>
          </div>
          <p className="text-xs text-on-surface-variant font-mono mt-0.5">
            Deterministic Decision Pipeline Trace (6 Collaborative Specialized Agents)
          </p>
        </div>

        <button
          onClick={recalculatePlan}
          className="px-3.5 py-1.5 bg-primary-container text-on-primary font-mono text-xs font-bold rounded-lg shadow-xs hover:bg-primary transition-colors cursor-pointer"
        >
          Trigger Fresh Pipeline Run
        </button>
      </div>

      {/* Timeline List */}
      <div className="bg-surface border border-outline-variant rounded-lg p-4 sm:p-6 shadow-xs">
        <div className="relative border-l-2 border-outline-variant ml-3 space-y-6">
          {TIMELINE_EVENTS.map((event) => (
            <div key={event.id} className="relative pl-6">
              {/* Dot */}
              <div
                className={`absolute -left-[9px] top-1 w-4 h-4 rounded-full border-2 border-surface flex items-center justify-center text-[9px] font-bold ${
                  event.status === 'critical'
                    ? 'bg-error text-white'
                    : event.status === 'warning'
                    ? 'bg-tertiary text-white'
                    : 'bg-primary text-white'
                }`}
              >
                {event.icon}
              </div>

              {/* Event card */}
              <div className="bg-surface-container-low border border-outline-variant/60 rounded-lg p-3">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 mb-1">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-bold text-primary">
                      {event.agent}
                    </span>
                    <span className="text-[10px] font-mono text-outline">
                      ({event.id})
                    </span>
                  </div>
                  <span className="font-mono text-[11px] text-outline">
                    {event.time}
                  </span>
                </div>

                <h4 className="text-[13px] font-bold text-on-surface font-sans">
                  {event.action}
                </h4>
                <p className="text-xs text-on-surface-variant mt-1 leading-relaxed">
                  {event.details}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
