'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import clsx from 'clsx';
import { useSimulationStore } from '@/store/simulationStore';

interface NavItem {
  name: string;
  href: string;
  icon: string;
  badge?: number;
}

const NAV_ITEMS: NavItem[] = [
  { name: 'Overview', href: '/dashboard', icon: 'dashboard' },
  { name: 'Live Incidents', href: '/incidents', icon: 'warning', badge: 4 },
  { name: 'Delivery Plan', href: '/delivery-plan', icon: 'route' },
  { name: 'Warehouses', href: '/warehouses', icon: 'warehouse' },
  { name: 'Hospitals & Relief Centers', href: '/hospitals', icon: 'local_hospital', badge: 10 },
  { name: 'Vehicles & Trucks', href: '/fleet', icon: 'local_shipping' },
  { name: 'Roads & Mobility', href: '/roads', icon: 'edit_road', badge: 6 },
  { name: 'Risk & Hazard', href: '/risk', icon: 'crisis_alert' },
  { name: 'Activity Log', href: '/activity', icon: 'history' },
  { name: 'Reports & Export', href: '/reports', icon: 'assessment' },
];

export function Sidebar({ mobileOpen, onClose }: { mobileOpen?: boolean; onClose?: () => void }) {
  const pathname = usePathname();
  const {
    simulationActive,
    isPlanApproved,
    openBroadcastModal,
    broadcasts,
  } = useSimulationStore();

  const activeBroadcastCount = broadcasts.filter((b) => b.active).length;

  return (
    <>
      {/* Mobile backdrop */}
      {mobileOpen && (
        <div
          onClick={onClose}
          className="fixed inset-0 bg-black/40 backdrop-blur-xs z-40 lg:hidden"
        />
      )}

      <aside
        className={clsx(
          'bg-surface h-screen w-64 fixed left-0 top-0 border-r border-outline-variant flex flex-col py-4 overflow-y-auto z-50 transition-all duration-200 ease-in-out',
          mobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        )}
      >
        {/* Brand Header */}
        <div className="px-4 mb-3 flex items-center justify-between">
          <Link href="/dashboard" className="flex items-center gap-2.5 group">
            <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center text-on-primary shadow-xs">
              <span className="material-symbols-outlined text-[20px]" style={{ fontVariationSettings: "'FILL' 1" }}>
                security
              </span>
            </div>
            <div>
              <div className="text-[17px] font-bold text-on-surface leading-tight tracking-tight">
                ResQFlow
              </div>
              <div className="text-[10px] text-on-surface-variant font-mono leading-none">
                Disaster Relief Logistics
              </div>
            </div>
          </Link>
          {onClose && (
            <button
              onClick={onClose}
              className="lg:hidden p-1 rounded hover:bg-surface-container text-on-surface-variant cursor-pointer"
            >
              <span className="material-symbols-outlined text-[20px]">close</span>
            </button>
          )}
        </div>

        {/* Emergency Broadcast Quick Trigger Button */}
        <div className="px-3 mb-2 space-y-1.5">
          <button
            type="button"
            onClick={() => {
              if (onClose) onClose();
              openBroadcastModal();
            }}
            className="w-full flex items-center justify-between px-3 py-2 bg-error/10 hover:bg-error/20 border border-error/30 rounded-lg text-error font-mono text-xs font-bold transition-all cursor-pointer shadow-2xs group"
          >
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-[18px] group-hover:scale-110 transition-transform">
                campaign
              </span>
              <span>Broadcast Alert</span>
            </div>
            {activeBroadcastCount > 0 && (
              <span className="w-2 h-2 rounded-full bg-error animate-ping" />
            )}
          </button>
        </div>

        {/* Navigation list */}
        <nav className="flex-1 px-2 space-y-0.5">
          {NAV_ITEMS.map((item) => {
            const isActive =
              pathname === item.href ||
              (item.href === '/dashboard' && (pathname === '/' || pathname === '/dashboard'));

            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={onClose}
                className={clsx(
                  'flex items-center justify-between px-3 py-2 rounded-lg text-[13px] font-medium transition-colors',
                  isActive
                    ? 'bg-secondary-container text-on-secondary-container font-semibold border-l-4 border-primary'
                    : 'text-on-surface-variant hover:bg-surface-container-low hover:text-on-surface'
                )}
              >
                <div className="flex items-center gap-2.5">
                  <span
                    className="material-symbols-outlined text-[18px]"
                    style={{
                      fontVariationSettings: isActive ? "'FILL' 1" : "'FILL' 0",
                    }}
                  >
                    {item.icon}
                  </span>
                  <span>{item.name}</span>
                </div>

                {item.badge !== undefined && (
                  <span
                    className={clsx(
                      'text-[10px] font-mono font-bold px-1.5 py-0.2 rounded-full',
                      item.name === 'Live Incidents' && 'bg-error/15 text-error',
                      item.name === 'Roads & Mobility' && 'bg-tertiary/15 text-tertiary',
                      item.name === 'Hospitals & Relief Centers' && 'bg-primary/15 text-primary'
                    )}
                  >
                    {item.badge}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>

        {/* Bottom Section */}
        <div className="mt-auto px-2 pt-3 border-t border-outline-variant space-y-1">
          <Link
            href="/settings"
            onClick={onClose}
            className={clsx(
              'flex items-center gap-2.5 px-3 py-2 rounded-lg text-[13px] font-medium transition-colors',
              pathname === '/settings'
                ? 'bg-secondary-container text-on-secondary-container font-semibold border-l-4 border-primary'
                : 'text-on-surface-variant hover:bg-surface-container-low hover:text-on-surface'
            )}
          >
            <span className="material-symbols-outlined text-[18px]">settings</span>
            <span>Settings</span>
          </Link>

          {/* System Status Indicators */}
          <div className="px-3 py-2 flex flex-col gap-1 mt-1 bg-surface-container-low rounded-lg border border-outline-variant/60">
            <div className="flex items-center gap-1.5 text-primary font-mono text-[11px] font-semibold">
              <span
                className="material-symbols-outlined text-[14px] text-primary animate-pulse"
                style={{ fontVariationSettings: "'FILL' 1" }}
              >
                check_circle
              </span>
              <span>{simulationActive ? 'National grid active' : 'Standby mode'}</span>
            </div>
            <div className="flex items-center gap-1.5 text-on-surface-variant font-mono text-[10px]">
              <span className="material-symbols-outlined text-[13px]">schedule</span>
              <span>
                {isPlanApproved ? 'Delivery in progress' : 'Telemetry sync: 12s'}
              </span>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}
