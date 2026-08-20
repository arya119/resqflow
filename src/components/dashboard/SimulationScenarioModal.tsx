'use client';

import React, { useState, useEffect } from 'react';
import { useSimulationStore } from '@/store/simulationStore';
import { audioAlert } from '@/lib/audioAlert';
import type { DisruptionType } from '@/types';

export function SimulationScenarioModal() {
  const {
    isDisruptionModalOpen,
    closeDisruptionModal,
    triggerSimulation,
    isSimulating,
    currentLocation,
    metrics,
    deliveryPlan,
    activeHospitals,
  } = useSimulationStore();

  const [scenarioType, setScenarioType] = useState<DisruptionType>('flood');
  const [severity, setSeverity] = useState<'high' | 'medium' | 'low'>('high');
  const [activeStep, setActiveStep] = useState<number>(0);
  const [simulationCompleted, setSimulationCompleted] = useState<boolean>(false);

  // Close on Escape
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

  const handleRunSimulation = async () => {
    setActiveStep(1);
    audioAlert.playEmergencySiren(1.5);
    
    // Step 1: Inundation detection
    await new Promise((r) => setTimeout(r, 600));
    setActiveStep(2);
    audioAlert.playWarningChime();

    // Step 2: Multi-agent evaluation
    await new Promise((r) => setTimeout(r, 700));
    setActiveStep(3);

    // Step 3: Trigger core store simulation and route recalculation
    await triggerSimulation(scenarioType, severity);
    setActiveStep(4);
    audioAlert.playSuccessTone();

    // Step 4: Finished
    setSimulationCompleted(true);
  };

  const handleResetOrClose = () => {
    setActiveStep(0);
    setSimulationCompleted(false);
    closeDisruptionModal();
  };

  const criticalHospitalCount = activeHospitals.filter((h) => h.status === 'critical').length;

  return (
    <div
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          handleResetOrClose();
        }
      }}
      className="fixed inset-0 z-[80] flex items-center justify-center p-3 sm:p-4 bg-black/70 backdrop-blur-sm animate-in fade-in duration-150"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-xl bg-surface border border-outline-variant rounded-2xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-150"
        role="dialog"
        aria-modal="true"
      >
        {/* Header */}
        <div className="px-5 py-4 border-b border-outline-variant bg-surface-container-low flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-primary/10 text-primary flex items-center justify-center border border-primary/20">
              <span className="material-symbols-outlined text-[22px]">hub</span>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-sm sm:text-base font-bold text-on-surface font-sans">
                  Disaster Scenario & Autonomous Rerouting Engine
                </h3>
                <span className="px-2 py-0.5 rounded-full bg-primary-container text-on-primary text-[10px] font-mono font-bold">
                  AI + OR-Tools
                </span>
              </div>
              <p className="text-[11px] text-on-surface-variant font-mono">
                Command Node: {currentLocation.state} ({currentLocation.name})
              </p>
            </div>
          </div>
          <button
            onClick={handleResetOrClose}
            className="p-1.5 rounded-lg hover:bg-surface-container text-on-surface-variant hover:text-on-surface transition-colors cursor-pointer"
          >
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
        </div>

        {/* Content */}
        <div className="p-5 space-y-4 font-sans text-xs">
          {!simulationCompleted ? (
            <>
              {/* Scenario Selection */}
              <div>
                <label className="block font-mono uppercase font-bold text-[10px] text-outline mb-2">
                  1. Select Disaster Inundation Event
                </label>
                <div className="grid grid-cols-3 gap-2.5">
                  {[
                    { id: 'flood', label: 'River Flash Flood', icon: 'water', desc: 'Breaches NH arterial bridge' },
                    { id: 'road_closure', label: 'Landslide & Severance', icon: 'landslide', desc: 'Blocks high mountain passes' },
                    { id: 'accident', label: 'Bridge Structural Breach', icon: 'car_crash', desc: 'Impasse on primary corridor' },
                  ].map((item) => (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => setScenarioType(item.id as DisruptionType)}
                      disabled={isSimulating}
                      className={`p-3 rounded-xl border text-left transition-all cursor-pointer flex flex-col justify-between ${
                        scenarioType === item.id
                          ? 'bg-secondary-container/40 text-on-surface border-primary font-bold shadow-xs'
                          : 'bg-surface border-outline-variant text-on-surface-variant hover:bg-surface-container-low'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1.5">
                        <span className="material-symbols-outlined text-primary text-[20px]">{item.icon}</span>
                        {scenarioType === item.id && (
                          <span className="w-2 h-2 rounded-full bg-primary" />
                        )}
                      </div>
                      <span className="text-xs font-bold font-sans text-on-surface">{item.label}</span>
                      <span className="text-[10px] font-mono text-outline mt-0.5">{item.desc}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Severity */}
              <div>
                <label className="block font-mono uppercase font-bold text-[10px] text-outline mb-1.5">
                  2. Inundation Severity Level
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {(['high', 'medium', 'low'] as const).map((sev) => (
                    <button
                      key={sev}
                      type="button"
                      onClick={() => setSeverity(sev)}
                      disabled={isSimulating}
                      className={`py-2 px-3 rounded-lg border text-center font-mono font-bold uppercase text-[11px] transition-all cursor-pointer ${
                        severity === sev
                          ? sev === 'high'
                            ? 'bg-error/15 text-error border-error'
                            : sev === 'medium'
                            ? 'bg-amber-500/15 text-amber-400 border-amber-500/40'
                            : 'bg-emerald-500/15 text-emerald-400 border-emerald-500/40'
                          : 'bg-surface border-outline-variant text-outline hover:bg-surface-container-low'
                      }`}
                    >
                      {sev} Impact
                    </button>
                  ))}
                </div>
              </div>

              {/* Execution Timeline Phases */}
              {activeStep > 0 && (
                <div className="p-3.5 bg-surface-container-low border border-outline-variant rounded-xl space-y-2 font-mono text-[11px]">
                  <div className="flex items-center justify-between text-outline text-[10px] uppercase font-bold">
                    <span>Autonomous Solver Pipeline</span>
                    <span className="text-primary animate-pulse">Running Multi-Agent Orchestrator...</span>
                  </div>

                  <div className="space-y-1.5">
                    <div className={`flex items-center gap-2 ${activeStep >= 1 ? 'text-on-surface' : 'text-outline'}`}>
                      <span className="material-symbols-outlined text-[15px] text-error">
                        {activeStep > 1 ? 'check_circle' : 'pending'}
                      </span>
                      <span>Hydro-Gauge Sensor: Water level spikes 1.4m past critical threshold</span>
                    </div>

                    <div className={`flex items-center gap-2 ${activeStep >= 2 ? 'text-on-surface' : 'text-outline'}`}>
                      <span className="material-symbols-outlined text-[15px] text-primary">
                        {activeStep > 2 ? 'check_circle' : 'pending'}
                      </span>
                      <span>Multi-Agent Triage: Flagged {criticalHospitalCount} medical centers with oxygen exhaustion &lt; 3h</span>
                    </div>

                    <div className={`flex items-center gap-2 ${activeStep >= 3 ? 'text-on-surface' : 'text-outline'}`}>
                      <span className="material-symbols-outlined text-[15px] text-tertiary">
                        {activeStep > 3 ? 'check_circle' : 'pending'}
                      </span>
                      <span>OR-Tools Solver: Re-routing fleet via high-elevation bypasses (SH-15)</span>
                    </div>
                  </div>
                </div>
              )}
            </>
          ) : (
            /* Post-Simulation Results */
            <div className="space-y-4 animate-in fade-in duration-200">
              <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-start gap-3">
                <span className="material-symbols-outlined text-emerald-400 text-[26px] mt-0.5">
                  task_alt
                </span>
                <div>
                  <h4 className="text-sm font-bold text-emerald-300 font-sans">
                    Optimal Reroute Generated & Broadcasted
                  </h4>
                  <p className="text-xs text-on-surface-variant mt-0.5">
                    Multi-agent solver synthesized a zero-hazard delivery path in <span className="font-mono text-emerald-400 font-bold">84ms</span>. Fleet and civil defense authorities synchronized.
                  </p>
                </div>
              </div>

              {/* Quantifiable Impact Metrics Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 font-mono">
                <div className="p-2.5 bg-surface-container-low border border-outline-variant rounded-xl text-center">
                  <div className="text-[10px] text-outline uppercase font-bold">Time Saved</div>
                  <div className="text-base font-bold text-primary mt-0.5">38 Mins</div>
                  <div className="text-[9px] text-emerald-400">vs congested detour</div>
                </div>

                <div className="p-2.5 bg-surface-container-low border border-outline-variant rounded-xl text-center">
                  <div className="text-[10px] text-outline uppercase font-bold">Vital Demands</div>
                  <div className="text-base font-bold text-emerald-400 mt-0.5">100%</div>
                  <div className="text-[9px] text-outline">Oxygen + Medicine</div>
                </div>

                <div className="p-2.5 bg-surface-container-low border border-outline-variant rounded-xl text-center">
                  <div className="text-[10px] text-outline uppercase font-bold">Vehicles Rerouted</div>
                  <div className="text-base font-bold text-tertiary mt-0.5">{deliveryPlan.items.length} Units</div>
                  <div className="text-[9px] text-outline">Trucks &amp; Drones</div>
                </div>

                <div className="p-2.5 bg-surface-container-low border border-outline-variant rounded-xl text-center">
                  <div className="text-[10px] text-outline uppercase font-bold">Civilian Alerts</div>
                  <div className="text-base font-bold text-error mt-0.5">1,240</div>
                  <div className="text-[9px] text-outline">SMS &amp; Cell Broadcast</div>
                </div>
              </div>

              {/* Rerouted Details */}
              <div className="p-3 bg-surface-container-low border border-outline-variant rounded-xl font-mono text-[11px] space-y-1.5">
                <div className="text-outline text-[10px] uppercase font-bold">Optimized Route Plan #1</div>
                <div className="text-on-surface font-bold text-xs">
                  {deliveryPlan.items[0]?.destinationName || 'Central Relief Hospital'} &larr; {deliveryPlan.items[0]?.sourceWarehouseName || 'Primary Depot'}
                </div>
                <div className="flex items-center gap-2 text-outline text-[10px]">
                  <span>Vehicle: {deliveryPlan.items[0]?.vehicleName || 'Truck (4x4)'}</span>
                  <span>&bull;</span>
                  <span>ETA: {deliveryPlan.items[0]?.etaMinutes || 35} mins</span>
                  <span>&bull;</span>
                  <span className="text-emerald-400 font-bold">Status: Bypass Active</span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer Buttons */}
        <div className="px-5 py-3.5 bg-surface-container-low border-t border-outline-variant flex items-center justify-between gap-3">
          <button
            type="button"
            onClick={handleResetOrClose}
            className="px-4 py-2 rounded-lg border border-outline-variant text-on-surface hover:bg-surface-container font-mono text-xs cursor-pointer transition-colors"
          >
            {simulationCompleted ? 'Done / Back to Map' : 'Cancel'}
          </button>

          {!simulationCompleted ? (
            <button
              type="button"
              onClick={handleRunSimulation}
              disabled={isSimulating || activeStep > 0}
              className="px-5 py-2 rounded-lg bg-primary hover:bg-primary-container text-on-primary font-mono text-xs font-bold flex items-center gap-2 shadow-xs cursor-pointer disabled:opacity-60 transition-all"
            >
              <span className="material-symbols-outlined text-[16px]">play_arrow</span>
              <span>{activeStep > 0 ? 'Synthesizing...' : 'Execute Scenario Simulation'}</span>
            </button>
          ) : (
            <button
              type="button"
              onClick={handleResetOrClose}
              className="px-5 py-2 rounded-lg bg-primary hover:bg-primary-container text-on-primary font-mono text-xs font-bold flex items-center gap-2 shadow-xs cursor-pointer transition-all"
            >
              <span className="material-symbols-outlined text-[16px]">map</span>
              <span>Inspect Live on GIS Map</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
