'use client';

import React, { useState, useEffect } from 'react';
import { useSimulationStore } from '@/store/simulationStore';
import type { DisruptionType } from '@/types';

export function DisruptionModal() {
  const {
    isDisruptionModalOpen,
    closeDisruptionModal,
    triggerSimulation,
    isSimulating,
    currentLocation,
  } = useSimulationStore();

  const [type, setType] = useState<DisruptionType>('flood');
  const [severity, setSeverity] = useState<'high' | 'medium' | 'low'>('high');

  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isDisruptionModalOpen) {
        closeDisruptionModal();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isDisruptionModalOpen, closeDisruptionModal]);

  if (!isDisruptionModalOpen) return null;

  const affectedRoadsEstimate = severity === 'high' ? 6 : severity === 'medium' ? 3 : 1;
  const affectedZonesEstimate = severity === 'high' ? 3 : severity === 'medium' ? 2 : 1;

  const handleSimulate = async () => {
    await triggerSimulation(type, severity);
  };

  return (
    <div
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          closeDisruptionModal();
        }
      }}
      className="fixed inset-0 z-[70] flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-150"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-md bg-surface border border-outline-variant rounded-2xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-150"
        role="dialog"
        aria-modal="true"
      >
        {/* Modal Header */}
        <div className="px-5 py-4 border-b border-outline-variant bg-surface-container-low flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-error/10 text-error flex items-center justify-center border border-error/20">
              <span className="material-symbols-outlined text-[20px]" style={{ fontVariationSettings: "'FILL' 1" }}>
                warning_amber
              </span>
            </div>
            <div>
              <h3 className="text-sm sm:text-base font-bold text-on-surface font-sans leading-tight">
                Simulate Hazard / Disruption
              </h3>
              <p className="text-[11px] text-on-surface-variant font-mono leading-tight">
                Inject real-time hazard into multi-agent solver
              </p>
            </div>
          </div>
          <button
            onClick={closeDisruptionModal}
            className="p-1 rounded-lg hover:bg-surface-container text-on-surface-variant transition-colors cursor-pointer"
          >
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-5 space-y-4 font-sans text-xs">
          {/* Field 1: Disruption Type */}
          <div>
            <label className="block font-mono uppercase font-bold text-[10px] text-outline mb-1.5">
              1. Disruption Hazard Type
            </label>
            <div className="grid grid-cols-3 gap-2">
              {[
                { id: 'flood', label: 'Riverine Flood', icon: 'water' },
                { id: 'road_closure', label: 'Road Blockage', icon: 'block' },
                { id: 'accident', label: 'Bridge / Traffic', icon: 'car_crash' },
              ].map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setType(item.id as DisruptionType)}
                  className={`flex flex-col items-center justify-center p-2.5 rounded-xl border text-center transition-all cursor-pointer ${
                    type === item.id
                      ? 'bg-secondary-container text-on-secondary-container border-primary font-bold shadow-xs'
                      : 'bg-surface border-outline-variant text-on-surface hover:bg-surface-container-low'
                  }`}
                >
                  <span className="material-symbols-outlined text-[22px] mb-1">
                    {item.icon}
                  </span>
                  <span className="text-[11px] font-mono leading-tight">{item.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Field 2: Location Sector */}
          <div>
            <label className="block font-mono uppercase font-bold text-[10px] text-outline mb-1">
              2. Target Region & Sector
            </label>
            <div className="p-2.5 rounded-xl bg-surface-container-low border border-outline-variant font-mono text-xs flex items-center justify-between text-on-surface">
              <span className="font-semibold">
                {currentLocation.name}, {currentLocation.state}
              </span>
              <span className="text-[10px] text-outline">Active Jurisdiction</span>
            </div>
          </div>

          {/* Field 3: Severity */}
          <div>
            <label className="block font-mono uppercase font-bold text-[10px] text-outline mb-1.5">
              3. Hazard Severity Level
            </label>
            <div className="grid grid-cols-3 gap-2 font-mono">
              {[
                { id: 'high', label: 'Critical / High', color: 'text-error' },
                { id: 'medium', label: 'Moderate', color: 'text-tertiary' },
                { id: 'low', label: 'Low / Advisory', color: 'text-primary' },
              ].map((lvl) => (
                <button
                  key={lvl.id}
                  type="button"
                  onClick={() => setSeverity(lvl.id as 'high' | 'medium' | 'low')}
                  className={`py-2 px-1 rounded-xl border text-center text-[11px] font-semibold transition-all cursor-pointer ${
                    severity === lvl.id
                      ? 'bg-secondary-container border-primary text-on-secondary-container font-bold ring-1 ring-primary/40'
                      : 'bg-surface border-outline-variant text-on-surface-variant hover:bg-surface-container-low'
                  }`}
                >
                  {lvl.label}
                </button>
              ))}
            </div>
          </div>

          {/* Impact preview summary */}
          <div className="p-3 bg-surface-container-low rounded-xl border border-outline-variant/60 grid grid-cols-2 gap-2 text-center font-mono">
            <div>
              <span className="text-[10px] text-outline uppercase block">Estimated Blocked Roads</span>
              <span className="text-sm font-bold text-error">~{affectedRoadsEstimate} segments</span>
            </div>
            <div>
              <span className="text-[10px] text-outline uppercase block">Affected Risk Zones</span>
              <span className="text-sm font-bold text-tertiary">~{affectedZonesEstimate} sectors</span>
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="px-5 py-3.5 border-t border-outline-variant bg-surface-container-low flex items-center justify-end gap-2.5">
          <button
            type="button"
            onClick={closeDisruptionModal}
            disabled={isSimulating}
            className="px-4 py-2 bg-surface border border-outline-variant rounded-xl text-xs font-mono font-semibold text-on-surface hover:bg-surface-container transition-colors cursor-pointer"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSimulate}
            disabled={isSimulating}
            className="px-4 py-2 bg-primary-container hover:bg-primary text-on-primary rounded-xl text-xs font-mono font-bold transition-all shadow-xs flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
          >
            {isSimulating ? (
              <>
                <span className="material-symbols-outlined text-[16px] animate-spin">
                  progress_activity
                </span>
                <span>Optimizing Delivery Flow...</span>
              </>
            ) : (
              <>
                <span className="material-symbols-outlined text-[16px]" style={{ fontVariationSettings: "'FILL' 1" }}>
                  play_arrow
                </span>
                <span>Simulate Event</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
