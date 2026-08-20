'use client';

import React, { useState } from 'react';
import { useSimulationStore } from '@/store/simulationStore';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { DetailPanel } from '@/components/ui/DetailPanel';
import type { Warehouse } from '@/types';

import { SectionRefreshHeader } from '@/components/ui/SectionRefreshHeader';

export default function WarehousesPage() {
  const { activeWarehouses, currentLocation, updateWarehouseStock } = useSimulationStore();
  const [selectedWarehouse, setSelectedWarehouse] = useState<Warehouse | null>(null);

  const totalMedicine = activeWarehouses.reduce((a, b) => a + b.supplies.medicine, 0);
  const totalFood = activeWarehouses.reduce((a, b) => a + b.supplies.food, 0);
  const avgStock = Math.round(
    activeWarehouses.reduce((a, b) => a + b.currentStock, 0) / activeWarehouses.length
  );

  return (
    <div className="space-y-4 max-w-[1600px] mx-auto">
      <SectionRefreshHeader
        title="Warehouses & Supply Depots Telemetry"
        subtitle={`Monitoring ${activeWarehouses.length} active distribution hubs in ${currentLocation.name}`}
        onRefresh={() => new Promise((res) => setTimeout(res, 300))}
        autoRefreshSeconds={15}
      />
      {/* Top Summary Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="bg-surface border border-outline-variant rounded-lg p-3">
          <span className="font-mono text-[10px] text-outline uppercase font-semibold">
            {currentLocation.name} Depots
          </span>
          <div className="text-xl font-bold text-on-surface font-sans mt-1">
            {activeWarehouses.length} Facilities
          </div>
        </div>
        <div className="bg-surface border border-outline-variant rounded-lg p-3">
          <span className="font-mono text-[10px] text-outline uppercase font-semibold">
            Medicine Reserves
          </span>
          <div className="text-xl font-bold text-primary font-sans mt-1">
            {totalMedicine.toLocaleString()} units
          </div>
        </div>
        <div className="bg-surface border border-outline-variant rounded-lg p-3">
          <span className="font-mono text-[10px] text-outline uppercase font-semibold">
            Food Rations
          </span>
          <div className="text-xl font-bold text-on-surface font-sans mt-1">
            {totalFood.toLocaleString()} packs
          </div>
        </div>
        <div className="bg-surface border border-outline-variant rounded-lg p-3">
          <span className="font-mono text-[10px] text-outline uppercase font-semibold">
            Average Stock Level
          </span>
          <div className="text-xl font-bold text-on-surface font-sans mt-1">{avgStock}% Capacity</div>
        </div>
      </div>

      {/* Warehouses Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {activeWarehouses.map((wh) => (
          <div
            key={wh.id}
            onClick={() => setSelectedWarehouse(wh)}
            className="bg-surface border border-outline-variant rounded-lg p-4 hover:border-primary/50 transition-all cursor-pointer shadow-xs flex flex-col justify-between group"
          >
            <div>
              <div className="flex items-start justify-between gap-2 mb-2">
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-primary text-[20px]">
                    warehouse
                  </span>
                  <span className="font-mono text-xs font-bold text-on-surface">
                    {wh.id}
                  </span>
                </div>
                <StatusBadge status={wh.status} />
              </div>

              <h3 className="text-sm font-bold text-on-surface group-hover:text-primary transition-colors font-sans">
                {wh.name}
              </h3>
              <p className="text-xs text-on-surface-variant mt-0.5">{wh.address}</p>

              {/* Progress bar for capacity */}
              <div className="mt-3 space-y-1">
                <div className="flex justify-between text-xs font-mono">
                  <span className="text-on-surface-variant">Capacity Fill</span>
                  <span className="font-bold text-primary">{wh.currentStock}%</span>
                </div>
                <div className="w-full bg-surface-container-high h-2 rounded-full overflow-hidden">
                  <div
                    className="bg-primary h-full rounded-full transition-all"
                    style={{ width: `${wh.currentStock}%` }}
                  />
                </div>
              </div>

              {/* Stock numbers breakdown */}
              <div className="grid grid-cols-2 gap-2 mt-3 p-2.5 bg-surface-container-low rounded border border-outline-variant/60 font-mono text-[11px]">
                <div>
                  <span className="text-outline text-[10px] block">MEDICINE</span>
                  <span className="font-semibold text-on-surface">
                    {wh.supplies.medicine.toLocaleString()} units
                  </span>
                </div>
                <div>
                  <span className="text-outline text-[10px] block">POTABLE WATER</span>
                  <span className="font-semibold text-on-surface">
                    {wh.supplies.water.toLocaleString()} L
                  </span>
                </div>
                <div>
                  <span className="text-outline text-[10px] block">FOOD RATIONS</span>
                  <span className="font-semibold text-on-surface">
                    {wh.supplies.food.toLocaleString()} pk
                  </span>
                </div>
                <div>
                  <span className="text-outline text-[10px] block">EQUIPMENT</span>
                  <span className="font-semibold text-on-surface">
                    {wh.supplies.equipment} units
                  </span>
                </div>
              </div>
            </div>

            <div className="mt-3 pt-2 border-t border-outline-variant/60 flex items-center justify-between text-[11px] font-mono text-outline">
              <span>Updated: {wh.lastUpdated}</span>
              <span className="text-primary font-semibold group-hover:translate-x-0.5 transition-transform flex items-center gap-0.5">
                Inspect Stock <span className="material-symbols-outlined text-[14px]">arrow_forward</span>
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Warehouse Detail Drawer */}
      <DetailPanel
        isOpen={Boolean(selectedWarehouse)}
        onClose={() => setSelectedWarehouse(null)}
        title={selectedWarehouse?.name || 'Warehouse Telemetry'}
        subtitle={`Depot Code: ${selectedWarehouse?.id} | Telemetry Live`}
        actions={
          <button
            onClick={() => setSelectedWarehouse(null)}
            className="px-4 py-1.5 bg-primary-container text-on-primary rounded font-mono text-xs font-bold"
          >
            Close Inspector
          </button>
        }
      >
        {selectedWarehouse && (
          <div className="space-y-4 font-sans text-xs">
            <div className="flex gap-2">
              <StatusBadge status={selectedWarehouse.status} size="md" />
              <span className="font-mono text-xs text-outline my-auto">
                Total Capacity: {selectedWarehouse.capacity.toLocaleString()} m³
              </span>
            </div>

            <div className="p-3 bg-surface-container rounded-lg border border-outline-variant font-mono space-y-2">
              <div>
                <span className="text-outline text-[10px] block uppercase">Address</span>
                <span className="font-semibold text-on-surface">{selectedWarehouse.address}</span>
              </div>
              <div>
                <span className="text-outline text-[10px] block uppercase">Coordinates</span>
                <span className="text-on-surface">
                  {selectedWarehouse.position.lat.toFixed(4)}°N, {selectedWarehouse.position.lng.toFixed(4)}°E
                </span>
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <span className="font-mono text-[10px] text-outline uppercase font-semibold">
                  Full Stock Breakdown & Emergency Top-Up
                </span>
                <span className="text-[10px] font-mono text-primary">Interactive Dispatch</span>
              </div>
              <div className="space-y-2 font-mono">
                <div className="flex items-center justify-between p-2 bg-surface-container-low rounded border border-outline-variant">
                  <span>Essential Medicine & IV</span>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-primary">{selectedWarehouse.supplies.medicine} units</span>
                    <button
                      type="button"
                      onClick={() => updateWarehouseStock(selectedWarehouse.id, 'medicine', 500)}
                      className="px-2 py-0.5 bg-primary/10 hover:bg-primary/20 text-primary rounded text-[10px] font-bold cursor-pointer"
                    >
                      +500
                    </button>
                  </div>
                </div>
                <div className="flex items-center justify-between p-2 bg-surface-container-low rounded border border-outline-variant">
                  <span>Dry Food & Ration Packs</span>
                  <div className="flex items-center gap-2">
                    <span className="font-bold">{selectedWarehouse.supplies.food} packs</span>
                    <button
                      type="button"
                      onClick={() => updateWarehouseStock(selectedWarehouse.id, 'food', 500)}
                      className="px-2 py-0.5 bg-primary/10 hover:bg-primary/20 text-primary rounded text-[10px] font-bold cursor-pointer"
                    >
                      +500
                    </button>
                  </div>
                </div>
                <div className="flex items-center justify-between p-2 bg-surface-container-low rounded border border-outline-variant">
                  <span>Potable Water Reserves</span>
                  <div className="flex items-center gap-2">
                    <span className="font-bold">{selectedWarehouse.supplies.water} Litres</span>
                    <button
                      type="button"
                      onClick={() => updateWarehouseStock(selectedWarehouse.id, 'water', 1000)}
                      className="px-2 py-0.5 bg-primary/10 hover:bg-primary/20 text-primary rounded text-[10px] font-bold cursor-pointer"
                    >
                      +1000L
                    </button>
                  </div>
                </div>
                <div className="flex items-center justify-between p-2 bg-surface-container-low rounded border border-outline-variant">
                  <span>Rescue & Hazmat Equipment</span>
                  <div className="flex items-center gap-2">
                    <span className="font-bold">{selectedWarehouse.supplies.equipment} kits</span>
                    <button
                      type="button"
                      onClick={() => updateWarehouseStock(selectedWarehouse.id, 'equipment', 50)}
                      className="px-2 py-0.5 bg-primary/10 hover:bg-primary/20 text-primary rounded text-[10px] font-bold cursor-pointer"
                    >
                      +50
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </DetailPanel>
    </div>
  );
}
