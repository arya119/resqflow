'use client';

import React from 'react';
import { usePathname } from 'next/navigation';
import { useSimulationStore } from '@/store/simulationStore';
import { LocationSelector } from '@/components/ui/LocationSelector';
import { ThemeToggle } from './ThemeToggle';

const PAGE_TITLES: Record<string, { title: string; subtitle: string }> = {
  '/': { title: 'Operational Overview', subtitle: 'Live Multi-Agent Command' },
  '/dashboard': { title: 'Operational Overview', subtitle: 'Live Multi-Agent Command' },
  '/incidents': { title: 'Live Incidents', subtitle: 'Real-time Hazard Tracking' },
  '/delivery-plan': { title: 'Recommended Delivery Plan', subtitle: 'Optimal Route & Vehicle Allocations' },
  '/warehouses': { title: 'Warehouses & Supply Depots', subtitle: 'Regional Stock & Inventory' },
  '/hospitals': { title: 'Hospitals & Relief Centers', subtitle: 'Consumption & Shortage Risk' },
  '/fleet': { title: 'Delivery Vehicles & Trucks', subtitle: 'Real-time Vehicle Status & Drivers' },
  '/roads': { title: 'Roads & Mobility Network', subtitle: 'Segment Blockages & Alternates' },
  '/risk': { title: 'Risk & Hazard Assessment', subtitle: 'Flood & Disaster Vulnerability Analysis' },
  '/activity': { title: 'Multi-Agent Activity Log', subtitle: 'Deterministic Pipeline Trace' },
  '/reports': { title: 'Operational Reports & Analytics', subtitle: 'Response Metrics & Archive' },
  '/settings': { title: 'System Configuration', subtitle: 'Parameters, Theme & Integrations' },
};

export function Header({ onMobileMenuToggle }: { onMobileMenuToggle?: () => void }) {
  const pathname = usePathname();
  const {
    openDisruptionModal,
    openBroadcastModal,
    toggleNotificationCenter,
    openSearchPalette,
    broadcasts,
  } = useSimulationStore();

  const currentMeta = PAGE_TITLES[pathname] || {
    title: 'ResQFlow Console',
    subtitle: 'Emergency Logistics Control',
  };

  const activeBroadcastCount = broadcasts.filter((b) => b.active).length;

  return (
    <header className="bg-surface h-16 fixed top-0 right-0 left-0 lg:left-64 border-b border-outline-variant flex justify-between items-center px-3 sm:px-4 lg:px-6 z-30 transition-colors">
      {/* Left Area: Mobile hamburger + Page Title + Location + Status */}
      <div className="flex items-center gap-2.5 sm:gap-3">
        {onMobileMenuToggle && (
          <button
            onClick={onMobileMenuToggle}
            suppressHydrationWarning
            className="lg:hidden p-1.5 rounded-lg hover:bg-surface-container text-on-surface-variant cursor-pointer"
            aria-label="Toggle navigation"
          >
            <span className="material-symbols-outlined text-[22px]">menu</span>
          </button>
        )}

        <div>
          <h2 className="text-sm sm:text-base font-bold text-on-surface font-sans leading-tight">
            {currentMeta.title}
          </h2>
          <p className="text-[10px] sm:text-[11px] text-on-surface-variant font-mono hidden sm:block">
            {currentMeta.subtitle}
          </p>
        </div>

        <div className="h-5 w-px bg-outline-variant hidden md:block" />

        {/* Location selector */}
        <div className="hidden md:block">
          <LocationSelector />
        </div>
      </div>

      {/* Right Area: Broadcast Alert, Theme Toggle, Search, Disruption, Notifications */}
      <div className="flex items-center gap-1.5 sm:gap-2">
        {/* Scenario Simulation Trigger */}
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            openDisruptionModal();
          }}
          suppressHydrationWarning
          className="bg-primary/15 hover:bg-primary text-primary hover:text-on-primary border border-primary/30 font-mono text-[11px] font-bold px-2.5 sm:px-3 py-1.5 rounded-lg flex items-center gap-1.5 shadow-xs transition-all cursor-pointer"
          title="Simulate disaster disruption & compute autonomous bypass route"
        >
          <span className="material-symbols-outlined text-[16px]">play_circle</span>
          <span className="whitespace-nowrap">Scenario Simulation</span>
        </button>

        {/* High-Visibility Emergency Broadcast Alert Button */}
        <button
          onClick={openBroadcastModal}
          suppressHydrationWarning
          className="bg-error hover:bg-error/90 text-white font-mono text-[11px] font-bold px-2.5 sm:px-3 py-1.5 rounded-lg flex items-center gap-1.5 shadow-xs transition-all cursor-pointer animate-pulse hover:animate-none"
          title="Send Emergency Broadcast Alert to all users"
        >
          <span className="material-symbols-outlined text-[16px]">campaign</span>
          <span className="whitespace-nowrap">Broadcast Alert</span>
        </button>

        {/* Theme Switcher (System / Light / Dark) */}
        <ThemeToggle />

        {/* Interactive Quick Search Palette Trigger */}
        <button
          onClick={openSearchPalette}
          suppressHydrationWarning
          className="bg-surface-container-low border border-outline-variant rounded-lg px-2.5 py-1.5 text-xs text-on-surface-variant hover:text-on-surface hover:bg-surface-container hidden 2xl:flex items-center gap-2 font-mono cursor-pointer transition-colors"
          title="Search assets across state (Cmd + K)"
        >
          <span className="material-symbols-outlined text-[15px] text-outline">search</span>
          <span className="text-outline text-[11px]">Search assets...</span>
          <kbd className="px-1 py-0.2 text-[9px] bg-surface rounded border border-outline-variant text-outline">
            ⌘K
          </kbd>
        </button>

        {/* Notification Bell */}
        <button
          onClick={toggleNotificationCenter}
          suppressHydrationWarning
          aria-label="Open notifications"
          className="relative text-on-surface-variant hover:text-primary transition-colors hover:bg-surface-container p-1.5 rounded-full cursor-pointer"
        >
          <span className="material-symbols-outlined text-[20px]">notifications</span>
          {activeBroadcastCount > 0 && (
            <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-error rounded-full border-2 border-surface animate-ping" />
          )}
          {activeBroadcastCount > 0 && (
            <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-error rounded-full border-2 border-surface" />
          )}
        </button>
      </div>
    </header>
  );
}
