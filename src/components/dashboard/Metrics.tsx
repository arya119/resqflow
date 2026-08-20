'use client';

import React from 'react';
import { useSimulationStore } from '@/store/simulationStore';
import { MetricCard } from '@/components/ui/MetricCard';

export function Metrics() {
  const { metrics } = useSimulationStore();

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5 sm:gap-3">
      {/* 1. Critical Locations */}
      <MetricCard
        label="Critical Locations"
        value={metrics.criticalLocations}
        badge={`${metrics.urgentLocations} Urgent`}
        badgeType="error"
        icon="emergency"
      />

      {/* 2. Shortage Risk */}
      <MetricCard
        label="Shortage Risk"
        value={`${metrics.shortageRisk}%`}
        trend={{
          direction: 'up',
          value: `${metrics.shortageRiskDelta}%`,
        }}
        icon="trending_up"
      />

      {/* 3. Available Vehicles */}
      <MetricCard
        label="Available Vehicles"
        value={metrics.availableVehicles}
        subValue={`/${metrics.totalVehicles}`}
        badge={`${Math.round((metrics.availableVehicles / metrics.totalVehicles) * 100)}%`}
        badgeType="primary"
        icon="local_shipping"
      />

      {/* 4. Active Deliveries */}
      <MetricCard
        label="Active Deliveries"
        value={metrics.activeDeliveries}
        badge="En Route"
        badgeType="neutral"
        icon="navigation"
      />

      {/* 5. Blocked Roads */}
      <MetricCard
        label="Blocked Roads"
        value={metrics.blockedRoads}
        badge="Rerouted"
        badgeType="warning"
        icon="traffic"
      />

      {/* 6. Warehouses */}
      <MetricCard
        label="Warehouses"
        value={metrics.warehouses}
        badge="Active"
        badgeType="primary"
        icon="warehouse"
      />
    </div>
  );
}
