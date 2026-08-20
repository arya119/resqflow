'use client';

import React, { useState } from 'react';
import { useSimulationStore } from '@/store/simulationStore';
import { audioAlert } from '@/lib/audioAlert';
import clsx from 'clsx';

export function NotificationCenter() {
  const {
    isNotificationCenterOpen,
    closeNotificationCenter,
    broadcasts,
    openBroadcastModal,
    acknowledgeBroadcast,
    agentStates,
  } = useSimulationStore();

  const [activeTab, setActiveTab] = useState<'all' | 'broadcasts' | 'agents'>('all');

  if (!isNotificationCenterOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        onClick={closeNotificationCenter}
        className="fixed inset-0 bg-black/40 backdrop-blur-xs z-[70] animate-in fade-in duration-150"
      />

      {/* Drawer */}
      <div
        className="fixed right-0 top-0 bottom-0 w-full sm:w-96 bg-surface border-l border-outline-variant z-[70] flex flex-col shadow-2xl animate-in slide-in-from-right duration-200"
        role="dialog"
        aria-modal="true"
      >
        {/* Drawer Header */}
        <div className="p-4 border-b border-outline-variant bg-surface-container-low flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-primary text-[22px]">
              notifications_active
            </span>
            <div>
              <h3 className="font-bold text-sm text-on-surface font-sans">
                Emergency Alerts & Notifications
              </h3>
              <p className="text-[10px] font-mono text-outline">
                National Disaster Stream Telemetry
              </p>
            </div>
          </div>

          <button
            onClick={closeNotificationCenter}
            className="p-1 rounded hover:bg-surface-container text-on-surface-variant transition-colors cursor-pointer"
          >
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
        </div>

        {/* Quick Action & Tabs */}
        <div className="p-3 border-b border-outline-variant bg-surface flex items-center justify-between gap-2">
          <div className="flex gap-1 font-mono text-xs">
            {(['all', 'broadcasts', 'agents'] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={clsx(
                  'px-2.5 py-1 rounded text-[11px] font-bold uppercase transition-colors cursor-pointer',
                  activeTab === tab
                    ? 'bg-secondary-container text-on-secondary-container'
                    : 'text-on-surface-variant hover:bg-surface-container-low'
                )}
              >
                {tab}
              </button>
            ))}
          </div>

          <button
            onClick={() => {
              closeNotificationCenter();
              openBroadcastModal();
            }}
            className="px-2.5 py-1 bg-error hover:bg-error/90 text-white rounded font-mono text-[11px] font-bold transition-all shadow-xs flex items-center gap-1 cursor-pointer"
          >
            <span className="material-symbols-outlined text-[13px]">campaign</span>
            <span>Broadcast</span>
          </button>
        </div>

        {/* Notification List */}
        <div className="flex-1 overflow-y-auto p-3 space-y-2.5 font-sans text-xs">
          {/* Broadcast Alerts */}
          {(activeTab === 'all' || activeTab === 'broadcasts') && (
            <div className="space-y-2">
              <span className="font-mono text-[10px] uppercase font-bold text-outline block">
                Broadcast Telemetry ({broadcasts.length})
              </span>
              {broadcasts.map((bc) => (
                <div
                  key={bc.id}
                  className={clsx(
                    'p-3 rounded-lg border transition-all',
                    bc.severity === 'critical'
                      ? 'bg-error/5 border-error/30'
                      : bc.severity === 'warning'
                      ? 'bg-tertiary/5 border-tertiary/30'
                      : 'bg-primary/5 border-primary/30'
                  )}
                >
                  <div className="flex items-start justify-between gap-2 mb-1">
                    <div className="flex items-center gap-1.5">
                      <span
                        className={clsx(
                          'w-2 h-2 rounded-full',
                          bc.active ? 'bg-error animate-ping' : 'bg-outline'
                        )}
                      />
                      <span className="font-mono text-[10px] font-bold uppercase text-on-surface">
                        {bc.severity} ALERT
                      </span>
                    </div>
                    <span className="font-mono text-[10px] text-outline">
                      {bc.timestamp}
                    </span>
                  </div>

                  <h4 className="font-bold text-on-surface text-xs">{bc.title}</h4>
                  <p className="text-[11px] text-on-surface-variant mt-1 leading-relaxed">
                    {bc.message}
                  </p>

                  <div className="mt-2 pt-2 border-t border-outline-variant/50 flex items-center justify-between text-[10px] font-mono">
                    <span className="text-outline">
                      {bc.recipientCount.toLocaleString()} devices reached
                    </span>
                    <button
                      onClick={() => acknowledgeBroadcast(bc.id)}
                      className="text-primary font-bold hover:underline cursor-pointer flex items-center gap-0.5"
                    >
                      <span>{bc.acknowledged ? '✓ Acknowledged' : 'Acknowledge'}</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Multi-Agent Events */}
          {(activeTab === 'all' || activeTab === 'agents') && (
            <div className="space-y-2 pt-2">
              <span className="font-mono text-[10px] uppercase font-bold text-outline block">
                Agent Optimization Feeds
              </span>
              {agentStates.map((agent) => (
                <div
                  key={agent.name}
                  className="p-2.5 rounded-lg bg-surface-container-low border border-outline-variant/60 flex items-start gap-2.5"
                >
                  <span className="w-5 h-5 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">
                    {agent.icon}
                  </span>
                  <div>
                    <div className="flex items-center justify-between">
                      <span className="font-mono font-bold text-primary text-[11px]">
                        {agent.name}
                      </span>
                      <span className="text-[9px] font-mono text-outline uppercase">
                        {agent.status}
                      </span>
                    </div>
                    <p className="text-[11px] text-on-surface-variant mt-0.5 leading-tight">
                      {agent.message}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Drawer Footer */}
        <div className="p-3 border-t border-outline-variant bg-surface-container-low flex items-center justify-between text-xs font-mono">
          <span className="text-outline text-[11px]">Sync: Continuous 12s</span>
          <button
            onClick={() => {
              audioAlert.playSuccessTone();
              closeNotificationCenter();
            }}
            className="text-primary font-bold hover:underline cursor-pointer"
          >
            Mark All Read & Close
          </button>
        </div>
      </div>
    </>
  );
}
