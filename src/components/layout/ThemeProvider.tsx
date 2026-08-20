'use client';

import React, { useEffect } from 'react';
import { useSimulationStore } from '@/store/simulationStore';
import type { ThemeMode } from '@/types';

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const { theme, setTheme, setResolvedTheme } = useSimulationStore();

  useEffect(() => {
    // Initial load from localStorage
    const saved = localStorage.getItem('resqflow_theme') as ThemeMode | null;
    if (saved && (saved === 'light' || saved === 'dark' || saved === 'system')) {
      setTheme(saved);
    }
  }, [setTheme]);

  useEffect(() => {
    const root = document.documentElement;

    function applyTheme() {
      let isDark = false;

      if (theme === 'system') {
        isDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
      } else {
        isDark = theme === 'dark';
      }

      if (isDark) {
        root.classList.add('dark');
        root.setAttribute('data-theme', 'dark');
        setResolvedTheme('dark');
      } else {
        root.classList.remove('dark');
        root.setAttribute('data-theme', 'light');
        setResolvedTheme('light');
      }
    }

    applyTheme();

    if (theme === 'system') {
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
      const listener = () => applyTheme();
      mediaQuery.addEventListener('change', listener);
      return () => mediaQuery.removeEventListener('change', listener);
    }
  }, [theme, setResolvedTheme]);

  return <>{children}</>;
}
