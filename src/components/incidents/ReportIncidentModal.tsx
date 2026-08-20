'use client';

import React, { useState, useEffect } from 'react';
import { useSimulationStore } from '@/store/simulationStore';
import { audioAlert } from '@/lib/audioAlert';
import type { DisruptionType, SeverityLevel } from '@/types';

export function ReportIncidentModal() {
  const {
    isReportIncidentModalOpen,
    closeReportIncidentModal,
    addIncident,
    currentLocation,
  } = useSimulationStore();

  const [title, setTitle] = useState('');
  const [type, setType] = useState<DisruptionType>('flood');
  const [severity, setSeverity] = useState<SeverityLevel>('critical');
  const [description, setDescription] = useState('');

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isReportIncidentModalOpen) {
        closeReportIncidentModal();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isReportIncidentModalOpen, closeReportIncidentModal]);

  if (!isReportIncidentModalOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    addIncident({
      title,
      type,
      location: `${currentLocation.name}, ${currentLocation.state}`,
      position: {
        lat: currentLocation.center.lat + (Math.random() * 0.04 - 0.02),
        lng: currentLocation.center.lng + (Math.random() * 0.04 - 0.02),
      },
      severity,
      status: 'active',
      affectedRoads: ['R-01', 'R-03'],
      affectedZones: ['Zone 01'],
      description: description || `Reported active ${type} hazard in ${currentLocation.name}.`,
    });

    audioAlert.playWarningChime();
    setTitle('');
    setDescription('');
  };

  return (
    <div
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          closeReportIncidentModal();
        }
      }}
      className="fixed inset-0 z-[70] flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-150"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-lg bg-surface border border-outline-variant rounded-2xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-150"
        role="dialog"
        aria-modal="true"
      >
        {/* Header */}
        <div className="px-5 py-4 border-b border-outline-variant bg-surface-container-low flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-error text-white flex items-center justify-center shadow-xs animate-pulse">
              <span className="material-symbols-outlined text-[20px]" style={{ fontVariationSettings: "'FILL' 1" }}>
                add_alert
              </span>
            </div>
            <div>
              <h3 className="text-base font-bold text-on-surface font-sans">
                Report New Incident / SOS Hazard
              </h3>
              <p className="text-xs text-on-surface-variant font-mono">
                Log real-time hazard into national command pipeline
              </p>
            </div>
          </div>
          <button
            onClick={closeReportIncidentModal}
            className="p-1 rounded-lg hover:bg-surface-container text-on-surface-variant transition-colors cursor-pointer"
          >
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-5 space-y-4 font-sans text-xs">
          {/* Title */}
          <div>
            <label className="block font-mono uppercase font-bold text-[10px] text-outline mb-1">
              Incident Headline / Title *
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Flash Flood Inundation at Sector 4 Bypass"
              className="w-full p-2.5 rounded-xl bg-surface border border-outline-variant text-on-surface placeholder:text-outline font-sans text-xs focus:outline-none focus:border-primary"
            />
          </div>

          {/* Type Selector */}
          <div>
            <label className="block font-mono uppercase font-bold text-[10px] text-outline mb-1.5">
              Hazard Category
            </label>
            <div className="grid grid-cols-3 gap-2">
              {[
                { id: 'flood', label: 'Flood / River Overflow', icon: 'water' },
                { id: 'road_closure', label: 'Landslide / Blockage', icon: 'block' },
                { id: 'accident', label: 'Medical / Bridge Emergency', icon: 'car_crash' },
              ].map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setType(item.id as DisruptionType)}
                  className={`p-2.5 rounded-xl border text-center transition-all cursor-pointer flex flex-col items-center justify-center ${
                    type === item.id
                      ? 'bg-secondary-container text-on-secondary-container border-primary font-bold shadow-xs'
                      : 'bg-surface border-outline-variant text-on-surface hover:bg-surface-container-low'
                  }`}
                >
                  <span className="material-symbols-outlined text-[20px] mb-1">
                    {item.icon}
                  </span>
                  <span className="text-[10px] font-mono leading-tight">{item.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Severity */}
          <div>
            <label className="block font-mono uppercase font-bold text-[10px] text-outline mb-1.5">
              Severity Level
            </label>
            <div className="grid grid-cols-3 gap-2 font-mono">
              {[
                { id: 'critical', label: 'CRITICAL (Red)', color: 'text-error' },
                { id: 'warning', label: 'WARNING (Amber)', color: 'text-tertiary' },
                { id: 'info', label: 'ADVISORY (Blue)', color: 'text-primary' },
              ].map((lvl) => (
                <button
                  key={lvl.id}
                  type="button"
                  onClick={() => setSeverity(lvl.id as SeverityLevel)}
                  className={`py-2 px-1 rounded-xl border text-center text-[10px] font-bold transition-all cursor-pointer ${
                    severity === lvl.id
                      ? 'bg-secondary-container border-primary text-on-secondary-container ring-1 ring-primary/40'
                      : 'bg-surface border-outline-variant text-on-surface-variant hover:bg-surface-container-low'
                  }`}
                >
                  {lvl.label}
                </button>
              ))}
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block font-mono uppercase font-bold text-[10px] text-outline mb-1">
              Field Description & Immediate Needs
            </label>
            <textarea
              rows={2}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="e.g. Water levels rising rapidly; 25 families stranded near elevated embankment. PWD crew requested."
              className="w-full p-2.5 rounded-xl bg-surface border border-outline-variant text-on-surface placeholder:text-outline font-sans text-xs focus:outline-none focus:border-primary"
            />
          </div>

          {/* Modal Footer */}
          <div className="pt-2 border-t border-outline-variant flex items-center justify-end gap-2 font-mono">
            <button
              type="button"
              onClick={closeReportIncidentModal}
              className="px-4 py-2 bg-surface border border-outline-variant rounded-xl text-xs font-semibold text-on-surface hover:bg-surface-container transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 bg-error text-white font-bold rounded-xl text-xs transition-all shadow-xs flex items-center gap-1.5 cursor-pointer hover:bg-error/90"
            >
              <span className="material-symbols-outlined text-[16px]">send</span>
              <span>Submit Emergency SOS</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
