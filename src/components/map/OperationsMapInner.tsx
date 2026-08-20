'use client';

import React, { useEffect } from 'react';
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  Polyline,
  Polygon,
  useMap,
} from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { useSimulationStore } from '@/store/simulationStore';
import { MapLegend } from './MapLegend';
import { MapControls } from './MapControls';
import { audioAlert } from '@/lib/audioAlert';

// Component to handle location updates dynamically
function MapViewController({ center, zoom }: { center: [number, number]; zoom: number }) {
  const map = useMap();
  useEffect(() => {
    map.setView(center, zoom, { animate: true });
  }, [center, zoom, map]);
  return null;
}

// Component to automatically fit bounds and zoom smoothly when a route is focused
function RouteFocusMapController() {
  const map = useMap();
  const { activePlanItem, routeFocusTimestamp } = useSimulationStore();

  useEffect(() => {
    if (routeFocusTimestamp > 0 && activePlanItem && activePlanItem.routePath.length > 0) {
      const latLngs = activePlanItem.routePath.map((p) => [p.lat, p.lng] as [number, number]);
      const bounds = L.latLngBounds(latLngs);
      map.fitBounds(bounds, { padding: [50, 50], maxZoom: 15, animate: true });
    }
  }, [routeFocusTimestamp, activePlanItem, map]);

  return null;
}

// Controller for Auto-Scan Radar Sector Orbit
function MapAutoScanController() {
  const map = useMap();
  const {
    isAutoScanActive,
    activeHospitals,
    activeWarehouses,
    activeVehicles,
    activeZones,
    setScanTarget,
    currentLocation,
  } = useSimulationStore();

  useEffect(() => {
    if (!isAutoScanActive) {
      setScanTarget(null);
      return;
    }

    // Compile list of high priority targets for sector sweep
    const scanTargets: { label: string; lat: number; lng: number; type: string }[] = [];

    // 1. Critical hospitals first
    activeHospitals.forEach((h) => {
      scanTargets.push({
        label: `${h.name} (${h.status.toUpperCase()} NEED)`,
        lat: h.position.lat,
        lng: h.position.lng,
        type: 'Hospital',
      });
    });

    // 2. Supply Warehouses
    activeWarehouses.forEach((w) => {
      scanTargets.push({
        label: `${w.name} (${w.currentStock}% Stock)`,
        lat: w.position.lat,
        lng: w.position.lng,
        type: 'Depot',
      });
    });

    // 3. Flood hazard sectors
    activeZones.forEach((z) => {
      if (z.polygon.length > 0) {
        scanTargets.push({
          label: `${z.name} (Risk ${z.floodProbability}%)`,
          lat: z.polygon[0].lat,
          lng: z.polygon[0].lng,
          type: 'Flood Zone',
        });
      }
    });

    // 4. Vehicles
    activeVehicles.slice(0, 3).forEach((v) => {
      scanTargets.push({
        label: `Vehicle ${v.name} (${v.status.toUpperCase()})`,
        lat: v.position.lat,
        lng: v.position.lng,
        type: 'Vehicle',
      });
    });

    if (scanTargets.length === 0) return;

    let currentIndex = 0;

    const performScanStep = () => {
      const target = scanTargets[currentIndex];
      setScanTarget(`${target.type}: ${target.label}`);

      map.flyTo([target.lat, target.lng], 14, {
        animate: true,
        duration: 2.2,
      });

      audioAlert.playWarningChime();
      currentIndex = (currentIndex + 1) % scanTargets.length;
    };

    // Execute first scan step immediately
    performScanStep();

    // Repeat every 4 seconds
    const interval = setInterval(performScanStep, 4000);

    return () => {
      clearInterval(interval);
      setScanTarget(null);
    };
  }, [
    isAutoScanActive,
    activeHospitals,
    activeWarehouses,
    activeVehicles,
    activeZones,
    map,
    setScanTarget,
    currentLocation,
  ]);

  return null;
}

// Custom DivIcons matching Stitch visual design with glowing pulse for critical locations
function createCustomIcon(
  iconName: string,
  bgColor: string,
  label: string,
  isCritical?: boolean
) {
  return L.divIcon({
    className: 'custom-map-marker',
    html: `
      <div class="flex flex-col items-center relative" style="transform: translate(-50%, -100%);">
        ${
          isCritical
            ? `<span class="absolute -top-1 -left-1 w-8 h-8 rounded-full bg-red-500 opacity-75 animate-ping"></span>`
            : ''
        }
        <div style="background-color: ${bgColor}; width: 26px; height: 26px; border-radius: 9999px; border: 2px solid white; display: flex; align-items: center; justify-content: center; box-shadow: 0 2px 6px rgba(0,0,0,0.35); z-index: 10; position: relative;">
          <span class="material-symbols-outlined" style="font-size: 14px; color: white;">${iconName}</span>
        </div>
        <span style="background: rgba(26, 27, 35, 0.9); padding: 1px 5px; border-radius: 4px; font-size: 10px; font-family: 'JetBrains Mono', monospace; font-weight: 600; border: 1px solid rgba(255,255,255,0.2); margin-top: 2px; white-space: nowrap; color: #ffffff; box-shadow: 0 1px 3px rgba(0,0,0,0.3); z-index: 10;">
          ${label}
        </span>
      </div>
    `,
    iconSize: [30, 42],
    iconAnchor: [15, 42],
    popupAnchor: [0, -40],
  });
}

export default function OperationsMapInner() {
  const {
    currentLocation,
    mapLayers,
    setSelectedEntity,
    activePlanItem,
    activeWarehouses,
    activeHospitals,
    activeVehicles,
    activeRoads,
    activeIncidents,
    activeZones,
    resolvedTheme,
    isAutoScanActive,
    scanTargetName,
    toggleAutoScan,
  } = useSimulationStore();

  const center: [number, number] = [currentLocation.center.lat, currentLocation.center.lng];

  // Dynamic Tile URL based on dark/light mode
  const tileUrl =
    resolvedTheme === 'dark'
      ? 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png'
      : 'https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png';

  return (
    <div className="w-full h-full relative overflow-hidden rounded-lg">
      {/* Auto Scan Radar HUD Overlay */}
      {isAutoScanActive && (
        <div className="absolute top-3 left-3 z-[1000] bg-surface/90 border border-primary/40 rounded-xl p-3 shadow-2xl backdrop-blur-md font-mono text-xs max-w-xs animate-in fade-in slide-in-from-top-2 duration-200">
          <div className="flex items-center justify-between gap-2 mb-1.5 border-b border-outline-variant/60 pb-1.5">
            <div className="flex items-center gap-1.5 text-primary font-bold">
              <span className="relative flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-80" />
                <span className="relative inline-flex rounded-full h-3 w-3 bg-primary" />
              </span>
              <span className="text-[11px] uppercase tracking-wider">RADAR AUTO-SCAN</span>
            </div>
            <button
              onClick={toggleAutoScan}
              className="text-outline hover:text-on-surface p-0.5 rounded cursor-pointer"
              title="Stop Auto-Scan"
            >
              <span className="material-symbols-outlined text-[16px]">close</span>
            </button>
          </div>

          <div className="space-y-1">
            <span className="text-[10px] text-outline uppercase block">Active Sector Sweep Target</span>
            <p className="font-bold text-on-surface text-xs leading-tight line-clamp-2">
              {scanTargetName || `Scanning ${currentLocation.name}...`}
            </p>
          </div>

          <div className="mt-2 pt-1.5 border-t border-outline-variant/50 flex items-center justify-between text-[10px] text-outline">
            <span>Sweep Rate: 3.5s</span>
            <span className="text-primary font-semibold">Continuous Orbit</span>
          </div>
        </div>
      )}

      {/* Radar Rotating Beam Graphic Overlay */}
      {isAutoScanActive && (
        <div className="absolute inset-0 z-[500] pointer-events-none overflow-hidden opacity-25">
          <div
            className="w-[150%] h-[150%] absolute -top-1/4 -left-1/4 rounded-full animate-spin"
            style={{
              background:
                'conic-gradient(from 0deg at 50% 50%, rgba(0, 180, 255, 0.25) 0deg, rgba(0, 180, 255, 0) 60deg, transparent 360deg)',
              animationDuration: '6s',
            }}
          />
        </div>
      )}

      <MapContainer
        center={center}
        zoom={currentLocation.zoom}
        scrollWheelZoom={true}
        className="w-full h-full z-10"
        zoomControl={false}
      >
        <MapViewController center={center} zoom={currentLocation.zoom} />
        <RouteFocusMapController />
        <MapAutoScanController />

        {/* Dynamic Dark / Light CartoDB Map Tiles */}
        <TileLayer
          key={resolvedTheme}
          attribution='&copy; <a href="https://carto.com/">CARTO</a> &copy; OpenStreetMap'
          url={tileUrl}
        />

        {/* 1. Hazard / Flood Inundation Zones */}
        {mapLayers.floodZones &&
          activeZones.map((zone) => (
            <Polygon
              key={zone.id}
              positions={zone.polygon.map((p) => [p.lat, p.lng])}
              pathOptions={{
                color: zone.status === 'danger' ? '#ba1a1a' : '#7f2500',
                fillColor: zone.status === 'danger' ? '#ba1a1a' : '#a73400',
                fillOpacity: resolvedTheme === 'dark' ? 0.35 : 0.22,
                weight: 2,
                dashArray: '4, 4',
              }}
            >
              <Popup>
                <div className="p-1 font-sans text-gray-900">
                  <div className="font-bold text-xs text-error">{zone.name}</div>
                  <div className="text-[11px] text-gray-700 mt-1">
                    Population: {zone.population.toLocaleString()} | Risk: {zone.floodProbability}%
                  </div>
                </div>
              </Popup>
            </Polygon>
          ))}

        {/* 2. Road Network Segments */}
        {activeRoads.map((road) => {
          const isBlocked = road.status === 'blocked' || road.status === 'flooded';
          const roadColor = isBlocked
            ? '#ff4444'
            : resolvedTheme === 'dark'
            ? '#818ba8'
            : '#565e74';
          return (
            <Polyline
              key={road.id}
              positions={road.path.map((p) => [p.lat, p.lng])}
              pathOptions={{
                color: roadColor,
                weight: isBlocked ? 4 : 2.5,
                dashArray: isBlocked ? '6, 6' : undefined,
                opacity: isBlocked ? 0.95 : resolvedTheme === 'dark' ? 0.65 : 0.45,
              }}
            >
              <Popup>
                <div className="p-1 font-sans text-gray-900">
                  <div className="font-bold text-xs">{road.name}</div>
                  <div className="text-[11px] text-gray-700">
                    Status: <strong className={isBlocked ? 'text-red-700 uppercase' : 'text-blue-700'}>{road.status}</strong>
                  </div>
                  <div className="text-[11px] text-gray-600">Distance: {road.distanceKm} km</div>
                </div>
              </Popup>
            </Polyline>
          );
        })}

        {/* 3. Recommended Optimal Delivery Route (Aligned to road geometry) */}
        {mapLayers.routes && activePlanItem && (
          <>
            {/* Route Outer Glow */}
            <Polyline
              positions={activePlanItem.routePath.map((p) => [p.lat, p.lng])}
              pathOptions={{
                color: resolvedTheme === 'dark' ? '#1e40af' : '#93c5fd',
                weight: 9,
                opacity: 0.6,
              }}
            />
            {/* Route Main Core Line */}
            <Polyline
              positions={activePlanItem.routePath.map((p) => [p.lat, p.lng])}
              pathOptions={{
                color: resolvedTheme === 'dark' ? '#38bdf8' : '#1d4ed8',
                weight: 5,
                opacity: 0.98,
              }}
            >
              <Popup>
                <div className="p-1 font-sans text-gray-900">
                  <div className="font-bold text-xs text-blue-700">
                    Active Delivery Corridor ({currentLocation.name})
                  </div>
                  <div className="text-[11px] font-medium">{activePlanItem.routeDescription}</div>
                  <div className="text-[11px] text-gray-700 font-mono mt-1">
                    ETA: {activePlanItem.etaMinutes} mins | Vehicle: {activePlanItem.vehicleId}
                  </div>
                </div>
              </Popup>
            </Polyline>
          </>
        )}

        {/* 4. Warehouses */}
        {mapLayers.warehouses &&
          activeWarehouses.map((wh) => (
            <Marker
              key={wh.id}
              position={[wh.position.lat, wh.position.lng]}
              icon={createCustomIcon('warehouse', '#0037b0', wh.id)}
              eventHandlers={{
                click: () => setSelectedEntity({ type: 'warehouse', id: wh.id, name: wh.name }),
              }}
            >
              <Popup>
                <div className="p-1 font-sans text-gray-900">
                  <div className="font-bold text-xs text-blue-800">{wh.name}</div>
                  <div className="text-[11px] text-gray-600">{wh.address}</div>
                  <div className="text-[11px] text-gray-800 font-mono mt-1">
                    Stock Capacity: <strong>{wh.currentStock}%</strong>
                  </div>
                </div>
              </Popup>
            </Marker>
          ))}

        {/* 5. Hospitals & Relief Centers (with glowing pulse for critical locations) */}
        {mapLayers.hospitals &&
          activeHospitals.map((hosp) => {
            const isCritical = hosp.status === 'critical';
            const isWarning = hosp.status === 'warning';
            const color = isCritical ? '#ba1a1a' : isWarning ? '#a73400' : '#0037b0';
            const icon = hosp.type === 'relief_center' ? 'night_shelter' : 'local_hospital';

            return (
              <Marker
                key={hosp.id}
                position={[hosp.position.lat, hosp.position.lng]}
                icon={createCustomIcon(icon, color, hosp.id, isCritical)}
                eventHandlers={{
                  click: () => setSelectedEntity({ type: 'hospital', id: hosp.id, name: hosp.name }),
                }}
              >
                <Popup>
                  <div className="p-1 font-sans text-gray-900">
                    <div className="font-bold text-xs" style={{ color }}>
                      {hosp.name}
                    </div>
                    <div className="text-[11px] text-gray-600">{hosp.address}</div>
                    <div className="text-[11px] text-gray-800 mt-1">
                      Medicine: <strong>{hosp.supplies.medicine}h remaining</strong>
                    </div>
                    <div className="text-[11px] text-gray-800">
                      Priority Score: <strong className="font-mono">{hosp.priorityScore}</strong>
                    </div>
                  </div>
                </Popup>
              </Marker>
            );
          })}

        {/* 6. Vehicles */}
        {mapLayers.vehicles &&
          activeVehicles.slice(0, 15).map((veh) => {
            const icon =
              veh.type === 'boat'
                ? 'directions_boat'
                : veh.type === 'helicopter'
                ? 'helicopter'
                : 'local_shipping';

            return (
              <Marker
                key={veh.id}
                position={[veh.position.lat, veh.position.lng]}
                icon={createCustomIcon(icon, '#565e74', veh.id)}
                eventHandlers={{
                  click: () => setSelectedEntity({ type: 'vehicle', id: veh.id, name: veh.name }),
                }}
              >
                <Popup>
                  <div className="p-1 font-sans text-gray-900">
                    <div className="font-bold text-xs text-gray-800">{veh.name}</div>
                    <div className="text-[11px] text-gray-600">Driver: {veh.driver}</div>
                    <div className="text-[11px] text-gray-800 font-mono mt-1">
                      Status: <strong>{veh.status}</strong> | Fuel: {veh.fuelLevel}%
                    </div>
                  </div>
                </Popup>
              </Marker>
            );
          })}

        {/* 7. Incident Points */}
        {mapLayers.incidents &&
          activeIncidents.map((inc) => (
            <Marker
              key={inc.id}
              position={[inc.position.lat, inc.position.lng]}
              icon={createCustomIcon('warning', '#ba1a1a', inc.type.toUpperCase(), true)}
            >
              <Popup>
                <div className="p-1 font-sans text-gray-900">
                  <div className="font-bold text-xs text-red-700">{inc.title}</div>
                  <div className="text-[11px] text-gray-600 mt-1">{inc.description}</div>
                  <div className="text-[10px] text-gray-500 font-mono mt-1">Reported: {inc.reportedAt}</div>
                </div>
              </Popup>
            </Marker>
          ))}

        <MapControls />
        <MapLegend />
      </MapContainer>
    </div>
  );
}
