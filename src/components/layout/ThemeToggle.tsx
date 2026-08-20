'use client';

import React, { useState, useRef, useEffect } from 'react';
import { useSimulationStore } from '@/store/simulationStore';
import type { ThemeMode } from '@/types';
import clsx from 'clsx';

export function ThemeToggle() {
  const { theme, setTheme, resolvedTheme } = useSimulationStore();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const options: { mode: ThemeMode; label: string; icon: string }[] = [
    { mode: 'system', label: 'System Auto', icon: 'settings_brightness' },
    { mode: 'light', label: 'Light Mode', icon: 'light_mode' },
    { mode: 'dark', label: 'Dark Mode', icon: 'dark_mode' },
  ];

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Toggle Theme"
        title={`Theme: ${theme.toUpperCase()} (Active: ${resolvedTheme})`}
        className="p-1.5 rounded-lg border border-outline-variant hover:bg-surface-container text-on-surface-variant transition-colors flex items-center gap-1 cursor-pointer font-mono text-xs"
      >
        <span className="material-symbols-outlined text-[18px] text-primary">
          {resolvedTheme === 'dark' ? 'dark_mode' : 'light_mode'}
        </span>
        <span className="text-[10px] font-bold uppercase hidden sm:inline text-on-surface">
          {theme}
        </span>
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-1.5 w-40 bg-surface border border-outline-variant rounded-xl shadow-xl py-1 z-50 animate-in fade-in zoom-in-95 duration-150">
          <div className="px-3 py-1 text-[10px] font-mono text-outline uppercase border-b border-outline-variant/60 font-semibold">
            Appearance
          </div>
          {options.map((opt) => {
            const isSelected = theme === opt.mode;
            return (
              <button
                key={opt.mode}
                onClick={() => {
                  setTheme(opt.mode);
                  setIsOpen(false);
                }}
                className={clsx(
                  'w-full flex items-center justify-between px-3 py-2 text-xs font-sans transition-colors cursor-pointer text-left',
                  isSelected
                    ? 'bg-secondary-container text-on-secondary-container font-bold'
                    : 'text-on-surface hover:bg-surface-container-low'
                )}
              >
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-[16px] text-primary">
                    {opt.icon}
                  </span>
                  <span>{opt.label}</span>
                </div>
                {isSelected && (
                  <span className="material-symbols-outlined text-[16px] text-primary">
                    check
                  </span>
                )}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
