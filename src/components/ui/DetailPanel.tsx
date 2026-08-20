'use client';

import React from 'react';
import clsx from 'clsx';

interface DetailPanelProps {
  title: string;
  subtitle?: string;
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
  actions?: React.ReactNode;
  className?: string;
}

export function DetailPanel({
  title,
  subtitle,
  isOpen,
  onClose,
  children,
  actions,
  className,
}: DetailPanelProps) {
  if (!isOpen) return null;

  return (
    <div
      className={clsx(
        'fixed inset-y-0 right-0 w-full max-w-md bg-surface border-l border-outline-variant shadow-2xl z-50 flex flex-col',
        className
      )}
    >
      {/* Header */}
      <div className="p-4 border-b border-outline-variant bg-surface-container-low flex items-start justify-between">
        <div>
          <h3 className="text-base font-bold text-on-surface font-sans">{title}</h3>
          {subtitle && (
            <p className="text-xs text-on-surface-variant font-mono mt-0.5">{subtitle}</p>
          )}
        </div>
        <button
          onClick={onClose}
          className="p-1 rounded hover:bg-surface-container text-on-surface-variant transition-colors"
          title="Close panel"
        >
          <span className="material-symbols-outlined text-[20px]">close</span>
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 p-4 overflow-y-auto space-y-4">{children}</div>

      {/* Actions */}
      {actions && (
        <div className="p-3 border-t border-outline-variant bg-surface-container-low flex items-center justify-end gap-2">
          {actions}
        </div>
      )}
    </div>
  );
}
