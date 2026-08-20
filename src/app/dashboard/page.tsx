'use client';

import React from 'react';
import { Metrics } from '@/components/dashboard/Metrics';
import { OperationsMap } from '@/components/map/OperationsMap';
import { AgentActivity } from '@/components/dashboard/AgentActivity';
import { DeliveryPlanCard } from '@/components/dashboard/DeliveryPlanCard';
import { PriorityList } from '@/components/dashboard/PriorityList';
import { ImpactMetrics } from '@/components/dashboard/ImpactMetrics';
import { ReasoningPanel } from '@/components/dashboard/ReasoningPanel';
import { useSimulationStore } from '@/store/simulationStore';

export default function DashboardPage() {
  const { currentLocation } = useSimulationStore();

  return (
    <div className="space-y-3 sm:space-y-4 max-w-[1600px] mx-auto">
      {/* 1. Top Metrics Row (6 Columns) */}
      <Metrics />

      {/* 2. Middle Row: Map (8 cols) + Agent Assessment & Recommended Plan (4 cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-3 sm:gap-4">
        {/* Left Column: Interactive Map */}
        <div className="lg:col-span-8 bg-surface border border-outline-variant rounded-lg flex flex-col overflow-hidden shadow-xs h-[480px] lg:h-[540px]">
          {/* Map Header */}
          <div className="px-3 py-2 border-b border-outline-variant bg-surface-container-low flex justify-between items-center">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-primary text-[18px]">
                map
              </span>
              <h3 className="font-mono text-xs font-bold text-on-surface uppercase tracking-wider">
                Live Operational Map — {currentLocation.name}, {currentLocation.state}
              </h3>
            </div>
            <span className="text-[10px] font-mono text-outline">
              Leaflet & Vector GIS
            </span>
          </div>

          {/* Map Canvas */}
          <div className="flex-1 relative">
            <OperationsMap />
          </div>
        </div>

        {/* Right Column: Multi-Agent Assessment & Delivery Plan */}
        <div className="lg:col-span-4 flex flex-col gap-3 h-[540px]">
          {/* System Assessment Feed */}
          <AgentActivity />

          {/* Recommended Delivery Plan */}
          <DeliveryPlanCard />
        </div>
      </div>

      {/* 3. Bottom Row: Critical Locations Queue (6 cols) + Impact Metrics & Reasoning (6 cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-3 sm:gap-4">
        {/* Left: Priority Queue */}
        <div className="lg:col-span-6 flex flex-col">
          <PriorityList />
        </div>

        {/* Right: Before/After Impact & Why this plan? */}
        <div className="lg:col-span-6 flex flex-col gap-3">
          <ImpactMetrics />
          <ReasoningPanel />
        </div>
      </div>
    </div>
  );
}
