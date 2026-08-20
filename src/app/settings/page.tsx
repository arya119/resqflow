'use client';

import React, { useState } from 'react';
import { useSimulationStore } from '@/store/simulationStore';
import { LocationSelector } from '@/components/ui/LocationSelector';
import { audioAlert } from '@/lib/audioAlert';
import type { ThemeMode } from '@/types';
import clsx from 'clsx';

export default function SettingsPage() {
  const {
    resetSimulation,
    theme,
    setTheme,
    resolvedTheme,
    currentLocation,
  } = useSimulationStore();

  const [thresholdHours, setThresholdHours] = useState<number>(8);
  const [replanInterval, setReplanInterval] = useState<number>(12);
  const [saveToast, setSaveToast] = useState<boolean>(false);

  const handleSaveSettings = () => {
    audioAlert.playSuccessTone();
    setSaveToast(true);
    setTimeout(() => setSaveToast(false), 2500);
  };

  const themeOptions: { id: ThemeMode; label: string; icon: string; desc: string }[] = [
    {
      id: 'system',
      label: 'System Preference',
      icon: 'settings_brightness',
      desc: 'Automatically matches your computer OS light/dark appearance',
    },
    {
      id: 'light',
      label: 'Light Mode',
      icon: 'light_mode',
      desc: 'Crisp high-contrast day palette (#faf8ff)',
    },
    {
      id: 'dark',
      label: 'Dark Mode',
      icon: 'dark_mode',
      desc: 'Sleek midnight emergency tactical theme (#0d0f17)',
    },
  ];

  return (
    <div className="space-y-4 max-w-[1000px] mx-auto">
      {/* Top Banner */}
      <div className="bg-surface border border-outline-variant rounded-lg p-4 flex items-center justify-between shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-primary text-[22px]">
              settings
            </span>
            <h2 className="text-base font-bold text-on-surface font-sans">
              ResQFlow System Settings & Parameters
            </h2>
          </div>
          <p className="text-xs text-on-surface-variant font-mono mt-0.5">
            Appearance themes, disaster management thresholds, and solver constraints
          </p>
        </div>

        {saveToast && (
          <span className="px-3 py-1 bg-primary/10 text-primary border border-primary/30 rounded font-mono text-xs font-bold animate-in fade-in">
            ✓ Settings Saved
          </span>
        )}
      </div>

      {/* Settings Sections */}
      <div className="bg-surface border border-outline-variant rounded-lg p-4 sm:p-6 space-y-6 shadow-xs">
        {/* Section 1: Appearance & Theme Mode */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-on-surface font-sans">
                1. System Appearance & Theme Mode
              </h3>
              <p className="text-xs text-on-surface-variant">
                Toggle between system-based automatic theme, light mode, or dark mode. Active mode: <strong>{resolvedTheme.toUpperCase()}</strong>
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
            {themeOptions.map((opt) => {
              const isSelected = theme === opt.id;
              return (
                <button
                  key={opt.id}
                  type="button"
                  onClick={() => setTheme(opt.id)}
                  className={clsx(
                    'p-3.5 rounded-xl border text-left transition-all cursor-pointer flex flex-col justify-between group',
                    isSelected
                      ? 'bg-secondary-container text-on-secondary-container border-primary ring-2 ring-primary/40 shadow-xs'
                      : 'bg-surface border-outline-variant text-on-surface hover:bg-surface-container-low'
                  )}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="material-symbols-outlined text-primary text-[22px]">
                      {opt.icon}
                    </span>
                    {isSelected && (
                      <span className="w-2 h-2 rounded-full bg-primary" />
                    )}
                  </div>
                  <div>
                    <span className="font-bold text-xs block">{opt.label}</span>
                    <span className="text-[11px] text-on-surface-variant leading-snug block mt-0.5">
                      {opt.desc}
                    </span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        <div className="border-t border-outline-variant" />

        {/* Section 2: Response Sector */}
        <div className="space-y-2">
          <h3 className="text-sm font-bold text-on-surface font-sans">
            2. Primary Response Jurisdiction
          </h3>
          <p className="text-xs text-on-surface-variant">
            Set the default center of operations for satellite feeds, hospitals, and road networks across India.
          </p>
          <div className="pt-1 flex items-center gap-3">
            <LocationSelector />
            <span className="font-mono text-xs text-outline">
              Selected: {currentLocation.name}, {currentLocation.state}
            </span>
          </div>
        </div>

        <div className="border-t border-outline-variant" />

        {/* Section 3: Multi-Agent Optimization Parameters */}
        <div className="space-y-3 font-sans">
          <h3 className="text-sm font-bold text-on-surface">
            3. Google OR-Tools Optimization Parameters
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 font-mono text-xs">
            <div className="p-3.5 bg-surface-container-low rounded-lg border border-outline-variant space-y-2">
              <span className="text-on-surface-variant text-[10px] uppercase font-bold block">
                Critical Stockout Threshold
              </span>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  min="2"
                  max="24"
                  value={thresholdHours}
                  onChange={(e) => setThresholdHours(Number(e.target.value))}
                  className="w-20 p-1.5 rounded bg-surface border border-outline-variant text-on-surface font-bold text-sm"
                />
                <span className="font-bold text-error">Hours</span>
              </div>
              <span className="text-[10px] text-outline block">
                Hospitals with buffer under this threshold are placed in Priority 01 emergency queue.
              </span>
            </div>

            <div className="p-3.5 bg-surface-container-low rounded-lg border border-outline-variant space-y-2">
              <span className="text-on-surface-variant text-[10px] uppercase font-bold block">
                Re-planning Trigger Interval
              </span>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  min="5"
                  max="60"
                  value={replanInterval}
                  onChange={(e) => setReplanInterval(Number(e.target.value))}
                  className="w-20 p-1.5 rounded bg-surface border border-outline-variant text-on-surface font-bold text-sm"
                />
                <span className="font-bold text-primary">Seconds</span>
              </div>
              <span className="text-[10px] text-outline block">
                Background sensor synchronization and radar flood route recalculation cycle.
              </span>
            </div>
          </div>
        </div>

        <div className="border-t border-outline-variant" />

        {/* Section 4: Emergency Audio Alarm Sirens */}
        <div className="space-y-2 font-mono text-xs">
          <h3 className="text-sm font-bold text-on-surface font-sans">
            4. Emergency Audio Alarm Synthesizer
          </h3>
          <p className="text-xs text-on-surface-variant font-sans">
            Test the Web Audio API synthesizer for broadcast sirens, warning beeps, and success confirmations.
          </p>
          <div className="flex flex-wrap gap-2 pt-1">
            <button
              type="button"
              onClick={() => audioAlert.playEmergencySiren(2.5)}
              className="px-3 py-1.5 bg-error/10 hover:bg-error/20 text-error border border-error/30 rounded-lg font-bold flex items-center gap-1.5 cursor-pointer"
            >
              <span className="material-symbols-outlined text-[16px]">volume_up</span>
              <span>Test Critical Siren (880Hz / 659Hz)</span>
            </button>
            <button
              type="button"
              onClick={() => audioAlert.playWarningChime()}
              className="px-3 py-1.5 bg-tertiary/10 hover:bg-tertiary/20 text-tertiary border border-tertiary/30 rounded-lg font-bold flex items-center gap-1.5 cursor-pointer"
            >
              <span className="material-symbols-outlined text-[16px]">notifications_active</span>
              <span>Test Warning Chime (C-E-G)</span>
            </button>
            <button
              type="button"
              onClick={() => audioAlert.playSuccessTone()}
              className="px-3 py-1.5 bg-primary/10 hover:bg-primary/20 text-primary border border-primary/30 rounded-lg font-bold flex items-center gap-1.5 cursor-pointer"
            >
              <span className="material-symbols-outlined text-[16px]">check_circle</span>
              <span>Test Confirmation Blip</span>
            </button>
          </div>
        </div>

        <div className="border-t border-outline-variant" />

        {/* Section 5: Save & Reset Controls */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div>
            <h3 className="text-sm font-bold text-on-surface font-sans">
              Save or Restore Configuration
            </h3>
            <p className="text-xs text-on-surface-variant">
              Apply new parameters to live decision pipeline or restore baseline settings.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={resetSimulation}
              className="px-4 py-2 bg-surface border border-error/30 text-error hover:bg-error/10 font-mono text-xs font-bold rounded-lg transition-colors cursor-pointer"
            >
              Reset to Normal State
            </button>
            <button
              type="button"
              onClick={handleSaveSettings}
              className="px-5 py-2 bg-primary-container hover:bg-primary text-on-primary font-mono text-xs font-bold rounded-lg transition-all shadow-xs cursor-pointer"
            >
              Save Configuration
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
