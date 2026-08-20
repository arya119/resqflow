'use client';

import React, { useState } from 'react';
import { useSimulationStore } from '@/store/simulationStore';
import { audioAlert } from '@/lib/audioAlert';
import type { BroadcastSeverity, BroadcastAudience, BroadcastAlert } from '@/types';
import clsx from 'clsx';

const TEMPLATES: {
  category: BroadcastAlert['category'];
  title: string;
  message: string;
  severity: BroadcastSeverity;
  audience: BroadcastAudience;
}[] = [
  {
    category: 'flash_flood',
    title: 'RED ALERT: Flash Flood Inundation & River Surge',
    message: 'River gauge level elevated by +1.4m. Immediate evacuation ordered for low basin sectors. Move to designated elevated high-school relief camp immediately.',
    severity: 'critical',
    audience: 'all_users',
  },
  {
    category: 'road_closure',
    title: 'ROAD SEVERED: National Highway Bridge Submerged',
    message: 'NH-27 direct arterial road closed due to water inundation. All logistics freight and emergency ambulances must divert to Route B (Elevated Inner Ring).',
    severity: 'critical',
    audience: 'field_teams',
  },
  {
    category: 'medical_supply',
    title: 'URGENT: Emergency Blood & Trauma Medicine Dispatch',
    message: 'Priority 01 cold-chain delivery vehicle en route to District Hospital. Field response units keep hospital access corridor clear.',
    severity: 'warning',
    audience: 'hospitals',
  },
  {
    category: 'evacuation',
    title: 'EVACUATION ADVISORY: Cyclone Storm Surge Corridor',
    message: 'Coastal and riverine settlements within 20km radius prepare for mandatory shelter relocation. Relief boats deployed at checkpoints.',
    severity: 'critical',
    audience: 'public_pa',
  },
  {
    category: 'general',
    title: 'DISASTER GRID UPDATE: Relief Operations Underway',
    message: 'Multi-agent delivery schedule approved. Regional depot stock transfers initiated across all active response sectors.',
    severity: 'info',
    audience: 'all_users',
  },
];

export function BroadcastAlertModal() {
  const {
    isBroadcastModalOpen,
    closeBroadcastModal,
    sendBroadcast,
    currentLocation,
  } = useSimulationStore();

  const [category, setCategory] = useState<BroadcastAlert['category']>('flash_flood');
  const [title, setTitle] = useState(TEMPLATES[0].title);
  const [message, setMessage] = useState(TEMPLATES[0].message);
  const [severity, setSeverity] = useState<BroadcastSeverity>('critical');
  const [audience, setAudience] = useState<BroadcastAudience>('all_users');
  const [radiusKm, setRadiusKm] = useState<number>(25);
  const [soundAlert, setSoundAlert] = useState<boolean>(true);
  const [isSending, setIsSending] = useState<boolean>(false);

  if (!isBroadcastModalOpen) return null;

  const estimatedRecipients = Math.round(radiusKm * 180 + 350);

  const applyTemplate = (tpl: typeof TEMPLATES[0]) => {
    setCategory(tpl.category);
    setTitle(tpl.title);
    setMessage(tpl.message);
    setSeverity(tpl.severity);
    setAudience(tpl.audience);
  };

  const handleDispatch = () => {
    setIsSending(true);
    setTimeout(() => {
      sendBroadcast({
        title,
        message,
        severity,
        audience,
        region: `${currentLocation.name}, ${currentLocation.state}`,
        radiusKm,
        soundAlert,
        category,
      });
      setIsSending(false);
    }, 400);
  };

  return (
    <div
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          closeBroadcastModal();
        }
      }}
      className="fixed inset-0 z-[70] flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-150"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-2xl bg-surface border border-outline-variant rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150 max-h-[92vh] flex flex-col"
        role="dialog"
        aria-modal="true"
      >
        {/* Modal Header */}
        <div className="px-5 py-3.5 border-b border-outline-variant bg-surface-container-low flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-error text-white flex items-center justify-center shadow-xs animate-pulse">
              <span className="material-symbols-outlined text-[20px]" style={{ fontVariationSettings: "'FILL' 1" }}>
                campaign
              </span>
            </div>
            <div>
              <h3 className="text-base font-bold text-on-surface font-sans leading-tight">
                Emergency Broadcast Dispatcher
              </h3>
              <p className="text-[11px] text-on-surface-variant font-mono">
                Real-time multi-channel public & field team emergency warning system
              </p>
            </div>
          </div>

          <button
            onClick={closeBroadcastModal}
            className="p-1 rounded hover:bg-surface-container text-on-surface-variant transition-colors cursor-pointer"
          >
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-4 sm:p-5 space-y-4 overflow-y-auto font-sans text-xs">
          {/* Quick Preset Templates */}
          <div>
            <span className="block font-mono uppercase font-bold text-[10px] text-outline mb-1.5">
              Quick Emergency Templates
            </span>
            <div className="flex flex-wrap gap-1.5">
              {TEMPLATES.map((tpl) => (
                <button
                  key={tpl.title}
                  type="button"
                  onClick={() => applyTemplate(tpl)}
                  className={clsx(
                    'px-2.5 py-1 rounded-md border text-[11px] font-mono transition-all cursor-pointer flex items-center gap-1',
                    category === tpl.category
                      ? 'bg-secondary-container text-on-secondary-container border-primary font-bold shadow-2xs'
                      : 'bg-surface border-outline-variant text-on-surface hover:bg-surface-container-low'
                  )}
                >
                  <span className="material-symbols-outlined text-[13px] text-primary">
                    {tpl.category === 'flash_flood'
                      ? 'water'
                      : tpl.category === 'road_closure'
                      ? 'block'
                      : tpl.category === 'medical_supply'
                      ? 'local_hospital'
                      : tpl.category === 'evacuation'
                      ? 'crisis_alert'
                      : 'info'}
                  </span>
                  <span>{tpl.title.split(':')[0]}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Severity & Audience Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {/* Severity */}
            <div>
              <label className="block font-mono uppercase font-bold text-[10px] text-outline mb-1">
                Alert Severity Level
              </label>
              <div className="grid grid-cols-3 gap-1.5 font-mono">
                {[
                  { id: 'critical', label: 'CRITICAL', color: 'border-error text-error bg-error/10' },
                  { id: 'warning', label: 'WARNING', color: 'border-tertiary text-tertiary bg-tertiary/10' },
                  { id: 'info', label: 'INFO', color: 'border-primary text-primary bg-primary/10' },
                ].map((s) => (
                  <button
                    key={s.id}
                    type="button"
                    onClick={() => setSeverity(s.id as BroadcastSeverity)}
                    className={clsx(
                      'py-1.5 px-1 rounded-lg border text-center text-[11px] font-bold transition-all cursor-pointer',
                      severity === s.id
                        ? `${s.color} ring-1`
                        : 'bg-surface border-outline-variant text-on-surface-variant hover:bg-surface-container-low'
                    )}
                  >
                    {s.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Target Audience */}
            <div>
              <label className="block font-mono uppercase font-bold text-[10px] text-outline mb-1">
                Target Broadcast Channels
              </label>
              <select
                value={audience}
                onChange={(e) => setAudience(e.target.value as BroadcastAudience)}
                className="w-full p-2 rounded-lg bg-surface border border-outline-variant text-on-surface font-mono text-xs focus:outline-none focus:border-primary"
              >
                <option value="all_users">All Web App Users & Command Hubs</option>
                <option value="field_teams">Field Drivers & Response Teams (SMS)</option>
                <option value="hospitals">Hospitals & Relief Camp Staff</option>
                <option value="public_pa">Public PA Sirens & Civil Defense</option>
              </select>
            </div>
          </div>

          {/* Title & Message inputs */}
          <div className="space-y-2.5">
            <div>
              <label className="block font-mono uppercase font-bold text-[10px] text-outline mb-1">
                Broadcast Headline / Title
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full p-2.5 rounded-lg bg-surface-container-low border border-outline-variant text-on-surface font-sans text-xs font-semibold focus:outline-none focus:border-primary"
                placeholder="Enter alert title..."
              />
            </div>

            <div>
              <label className="block font-mono uppercase font-bold text-[10px] text-outline mb-1">
                Emergency Message Body
              </label>
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                rows={3}
                className="w-full p-2.5 rounded-lg bg-surface-container-low border border-outline-variant text-on-surface font-sans text-xs focus:outline-none focus:border-primary resize-none leading-relaxed"
                placeholder="Enter detailed action instructions..."
              />
            </div>
          </div>

          {/* Geo-radius & Sound Siren Controls */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-3 bg-surface-container-low rounded-xl border border-outline-variant/60">
            {/* Radius */}
            <div className="space-y-1">
              <div className="flex justify-between font-mono text-[11px]">
                <span className="text-on-surface-variant font-semibold">Broadcast Radius:</span>
                <span className="font-bold text-primary">{radiusKm} km</span>
              </div>
              <input
                type="range"
                min="5"
                max="100"
                step="5"
                value={radiusKm}
                onChange={(e) => setRadiusKm(Number(e.target.value))}
                className="w-full accent-primary cursor-pointer"
              />
              <span className="text-[10px] font-mono text-outline block">
                Targeting ~{estimatedRecipients.toLocaleString()} recipients in {currentLocation.name}
              </span>
            </div>

            {/* Siren Toggle */}
            <div className="flex flex-col justify-between">
              <label className="flex items-center gap-2 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={soundAlert}
                  onChange={(e) => setSoundAlert(e.target.checked)}
                  className="w-4 h-4 rounded accent-error"
                />
                <span className="font-mono text-xs font-bold text-on-surface">
                  Trigger Audible Alarm Siren
                </span>
              </label>
              <div className="flex items-center gap-2 mt-2">
                <button
                  type="button"
                  onClick={() => audioAlert.playEmergencySiren(1.5)}
                  className="px-2.5 py-1 bg-surface border border-outline-variant rounded text-[10px] font-mono font-semibold text-on-surface hover:bg-surface-container transition-colors flex items-center gap-1 cursor-pointer"
                >
                  <span className="material-symbols-outlined text-[13px] text-error">volume_up</span>
                  <span>Test Siren Audio</span>
                </button>
                <button
                  type="button"
                  onClick={() => audioAlert.playWarningChime()}
                  className="px-2.5 py-1 bg-surface border border-outline-variant rounded text-[10px] font-mono font-semibold text-on-surface hover:bg-surface-container transition-colors flex items-center gap-1 cursor-pointer"
                >
                  <span className="material-symbols-outlined text-[13px] text-primary">notifications_active</span>
                  <span>Test Chime</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="px-5 py-3 border-t border-outline-variant bg-surface-container-low flex items-center justify-between">
          <div className="font-mono text-[11px] text-outline flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-error animate-ping" />
            <span>Live Web Broadcast Active</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={closeBroadcastModal}
              disabled={isSending}
              className="px-4 py-2 bg-surface border border-outline-variant rounded-lg text-xs font-mono font-semibold text-on-surface hover:bg-surface-container transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleDispatch}
              disabled={isSending || !title.trim()}
              className="px-5 py-2 bg-error hover:bg-error/90 text-white rounded-lg text-xs font-mono font-bold transition-all shadow-md flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
            >
              <span className="material-symbols-outlined text-[16px]">
                send
              </span>
              <span>{isSending ? 'Transmitting Alert...' : 'Dispatch Broadcast Now'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
