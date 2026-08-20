'use client';

import React from 'react';
import { useSimulationStore } from '@/store/simulationStore';
import clsx from 'clsx';

export function AgentActivity() {
  const { agentStates, isSimulating } = useSimulationStore();

  return (
    <div className="bg-surface border border-outline-variant rounded-lg flex flex-col flex-1 overflow-hidden shadow-xs">
      {/* Header */}
      <div className="px-3 py-2 border-b border-outline-variant bg-surface-container-low flex justify-between items-center">
        <div className="flex items-center gap-1.5">
          <span className="material-symbols-outlined text-primary text-[18px]">
            memory
          </span>
          <h3 className="text-xs font-bold text-on-surface font-mono uppercase tracking-wider">
            System Assessment Feed
          </h3>
        </div>
        <div className="flex items-center gap-1">
          {isSimulating && (
            <span className="flex h-2 w-2 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-primary" />
            </span>
          )}
          <span className="text-[10px] font-mono text-outline">
            {isSimulating ? 'Processing' : '6 Agents Sync'}
          </span>
        </div>
      </div>

      {/* Feed content */}
      <div className="p-3 overflow-y-auto space-y-2 flex-1 font-mono text-[12px]">
        {agentStates.map((agent, index) => {
          let iconColor = 'text-primary';
          let borderHighlight = '';

          if (agent.icon === '!') {
            iconColor = 'text-error font-bold';
            borderHighlight = 'bg-error/5';
          } else if (agent.icon === '⚠') {
            iconColor = 'text-tertiary font-bold';
            borderHighlight = 'bg-tertiary/5';
          } else if (agent.icon === '⚡') {
            iconColor = 'text-primary font-bold';
            borderHighlight = 'bg-primary/5';
          }

          const isLast = index === agentStates.length - 1;

          return (
            <div
              key={agent.name}
              className={clsx(
                'flex items-start gap-2 p-1 rounded transition-colors',
                borderHighlight,
                isLast && 'pt-1.5 border-t border-outline-variant/60'
              )}
            >
              <span
                className={clsx(
                  'w-5 text-center shrink-0 text-sm font-mono',
                  iconColor,
                  agent.status === 'running' && 'animate-spin'
                )}
              >
                {agent.status === 'running' ? '⟳' : agent.icon}
              </span>
              <div className="flex-1 min-w-0">
                <span className="text-on-surface-variant font-semibold mr-1.5">
                  {agent.name}:
                </span>
                <span className="text-on-surface leading-tight">
                  {agent.message}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
