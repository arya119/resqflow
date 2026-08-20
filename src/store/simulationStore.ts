import { create } from 'zustand';
import type {
  Location,
  DisruptionType,
  AgentState,
  DeliveryPlan,
  DeliveryPlanItem,
  ImpactMetrics,
  DashboardMetrics,
  Warehouse,
  Hospital,
  Vehicle,
  Road,
  Incident,
  Zone,
  BroadcastAlert,
  ThemeMode,
} from '@/types';
import {
  DEFAULT_LOCATION,
  generateStateData,
} from '@/data/mock';
import { audioAlert } from '@/lib/audioAlert';

interface MapLayers {
  warehouses: boolean;
  hospitals: boolean;
  vehicles: boolean;
  routes: boolean;
  floodZones: boolean;
  incidents: boolean;
}

interface SimulationStore {
  // Theme Mode
  theme: ThemeMode;
  resolvedTheme: 'light' | 'dark';
  setTheme: (theme: ThemeMode) => void;
  setResolvedTheme: (resolved: 'light' | 'dark') => void;

  // Emergency Broadcast System
  broadcasts: BroadcastAlert[];
  isBroadcastModalOpen: boolean;
  openBroadcastModal: () => void;
  closeBroadcastModal: () => void;
  sendBroadcast: (alertData: Omit<BroadcastAlert, 'id' | 'timestamp' | 'active' | 'acknowledged' | 'recipientCount'>) => void;
  acknowledgeBroadcast: (id: string) => void;
  dismissBroadcast: (id: string) => void;

  // Notification Center & Search Palette
  isNotificationCenterOpen: boolean;
  toggleNotificationCenter: () => void;
  closeNotificationCenter: () => void;
  isSearchPaletteOpen: boolean;
  openSearchPalette: () => void;
  closeSearchPalette: () => void;

  // Location & All-States Preview
  currentLocation: Location;
  setLocation: (loc: Location) => void;
  isStatesPreviewOpen: boolean;
  openStatesPreview: () => void;
  closeStatesPreview: () => void;

  // Active State's Local Data (Hospitals, Warehouses, Roads, etc.)
  activeWarehouses: Warehouse[];
  activeHospitals: Hospital[];
  activeVehicles: Vehicle[];
  activeRoads: Road[];
  activeIncidents: Incident[];
  activeZones: Zone[];
  lastIncidentSync: Date;
  refreshIncidents: () => Promise<void>;
  isRefreshingIncidents: boolean;

  // Interactive Mutators
  updateVehicleStatus: (vehicleId: string, status: Vehicle['status'], driver?: string, fuel?: number) => void;
  updateWarehouseStock: (warehouseId: string, item: keyof Warehouse['supplies'], amount: number) => void;
  updateHospitalStatus: (hospitalId: string, status: Hospital['status'], shortageHours?: number | null) => void;
  toggleRoadStatus: (roadId: string, newStatus: Road['status']) => void;

  // Simulation State
  isDisruptionModalOpen: boolean;
  openDisruptionModal: () => void;
  closeDisruptionModal: () => void;

  // Incident Reporting & Actions
  isReportIncidentModalOpen: boolean;
  openReportIncidentModal: () => void;
  closeReportIncidentModal: () => void;
  addIncident: (incident: Omit<Incident, 'id' | 'reportedAt'>) => void;
  resolveIncident: (id: string) => void;
  dispatchRoadCrew: (roadId: string, crewName: string, estimatedMin: number) => void;

  // Auto-Scan Map Feature
  isAutoScanActive: boolean;
  scanTargetName: string | null;
  toggleAutoScan: () => void;
  setScanTarget: (targetName: string | null) => void;

  // Route Inspector Modal & Map Focus
  isRouteModalOpen: boolean;
  openRouteModal: () => void;
  closeRouteModal: () => void;
  routeFocusTimestamp: number;
  triggerRouteFocus: () => void;

  isSimulating: boolean;
  simulationActive: boolean;
  disruptionType: DisruptionType | null;
  disruptionSeverity: 'high' | 'medium' | 'low';
  affectedRoadsCount: number;
  affectedZonesCount: number;

  // Continuous monitoring notification
  monitoringAlert: string | null;
  dismissMonitoringAlert: () => void;

  // Agents
  agentStates: AgentState[];

  // Delivery Plan
  deliveryPlan: DeliveryPlan;
  activePlanItem: DeliveryPlanItem | null;
  setActivePlanItem: (item: DeliveryPlanItem | null) => void;
  isPlanApproved: boolean;
  approvePlan: () => void;
  recalculatePlan: () => void;

  // Metrics
  metrics: DashboardMetrics;
  impactMetrics: ImpactMetrics;

  // Map state
  selectedEntity: { type: string; id: string; name: string } | null;
  setSelectedEntity: (entity: { type: string; id: string; name: string } | null) => void;
  mapLayers: MapLayers;
  toggleMapLayer: (layer: keyof MapLayers) => void;
  highlightedRouteId: string | null;
  setHighlightedRouteId: (id: string | null) => void;

  // Actions
  triggerSimulation: (type: DisruptionType, severity: 'high' | 'medium' | 'low') => Promise<void>;
  resetSimulation: () => void;
}

const initialDataset = generateStateData(DEFAULT_LOCATION);

// Initial broadcast alert
const initialBroadcasts: BroadcastAlert[] = [
  {
    id: 'BC-2026-0820-01',
    title: 'RED ALERT: Flash Flood Inundation in Low Basin Sector',
    message: 'Upper catchment runoff has raised river levels by +1.4m. Residents in Zone 1 & 2 ordered to move to designated elevated relief posts immediately. NH-27 bypass active.',
    severity: 'critical',
    audience: 'all_users',
    region: `${DEFAULT_LOCATION.name}, ${DEFAULT_LOCATION.state}`,
    radiusKm: 25,
    soundAlert: true,
    timestamp: 'Just now',
    active: true,
    acknowledged: false,
    recipientCount: 4850,
    category: 'flash_flood',
  },
];

export const useSimulationStore = create<SimulationStore>((set, get) => ({
  // Theme State
  theme: 'system',
  resolvedTheme: 'light',
  setTheme: (theme) => {
    set({ theme });
    if (typeof window !== 'undefined') {
      localStorage.setItem('resqflow_theme', theme);
    }
  },
  setResolvedTheme: (resolved) => set({ resolvedTheme: resolved }),

  // Broadcast System
  broadcasts: initialBroadcasts,
  isBroadcastModalOpen: false,
  openBroadcastModal: () => set({ isBroadcastModalOpen: true }),
  closeBroadcastModal: () => set({ isBroadcastModalOpen: false }),

  sendBroadcast: (alertData) => {
    const loc = get().currentLocation;
    const newBroadcast: BroadcastAlert = {
      ...alertData,
      id: `BC-${Date.now().toString().slice(-6)}`,
      timestamp: 'Just now (Live Broadcast)',
      active: true,
      acknowledged: false,
      recipientCount: Math.round(alertData.radiusKm * 180 + Math.random() * 500),
    };

    if (alertData.soundAlert) {
      if (alertData.severity === 'critical') {
        audioAlert.playEmergencySiren(2.5);
      } else {
        audioAlert.playWarningChime();
      }
    } else {
      audioAlert.playSuccessTone();
    }

    set((state) => ({
      broadcasts: [newBroadcast, ...state.broadcasts],
      isBroadcastModalOpen: false,
      metrics: {
        ...state.metrics,
        shortageRisk: Math.min(100, state.metrics.shortageRisk + (alertData.severity === 'critical' ? 5 : 0)),
      },
    }));
  },

  acknowledgeBroadcast: (id) => {
    set((state) => ({
      broadcasts: state.broadcasts.map((bc) =>
        bc.id === id ? { ...bc, acknowledged: true } : bc
      ),
    }));
    audioAlert.playSuccessTone();
  },

  dismissBroadcast: (id) => {
    set((state) => ({
      broadcasts: state.broadcasts.map((bc) =>
        bc.id === id ? { ...bc, active: false } : bc
      ),
    }));
  },

  // Notification Center & Search Palette
  isNotificationCenterOpen: false,
  toggleNotificationCenter: () =>
    set((state) => ({ isNotificationCenterOpen: !state.isNotificationCenterOpen })),
  closeNotificationCenter: () => set({ isNotificationCenterOpen: false }),

  isSearchPaletteOpen: false,
  openSearchPalette: () => set({ isSearchPaletteOpen: true }),
  closeSearchPalette: () => set({ isSearchPaletteOpen: false }),

  // Location & All-States Preview
  currentLocation: DEFAULT_LOCATION,
  isStatesPreviewOpen: false,
  openStatesPreview: () => set({ isStatesPreviewOpen: true }),
  closeStatesPreview: () => set({ isStatesPreviewOpen: false }),

  // Dynamic active dataset
  activeWarehouses: initialDataset.warehouses,
  activeHospitals: initialDataset.hospitals,
  activeVehicles: initialDataset.vehicles,
  activeRoads: initialDataset.roads,
  activeIncidents: initialDataset.incidents,
  activeZones: initialDataset.zones,
  lastIncidentSync: new Date(),
  isRefreshingIncidents: false,

  // Interactive Mutators
  updateVehicleStatus: (vehicleId, status, driver, fuel) => {
    set((state) => ({
      activeVehicles: state.activeVehicles.map((v) =>
        v.id === vehicleId
          ? {
              ...v,
              status,
              driver: driver || v.driver,
              fuelLevel: fuel !== undefined ? fuel : v.fuelLevel,
              lastUpdated: 'Just now (Manual Update)',
            }
          : v
      ),
      metrics: {
        ...state.metrics,
        availableVehicles: state.activeVehicles.filter(
          (v) => (v.id === vehicleId ? status === 'available' : v.status === 'available')
        ).length,
      },
    }));
    audioAlert.playSuccessTone();
  },

  updateWarehouseStock: (warehouseId, item, amount) => {
    set((state) => ({
      activeWarehouses: state.activeWarehouses.map((wh) => {
        if (wh.id === warehouseId) {
          const updatedSupplies = {
            ...wh.supplies,
            [item]: Math.max(0, wh.supplies[item] + amount),
          };
          return {
            ...wh,
            supplies: updatedSupplies,
            lastUpdated: 'Just now',
          };
        }
        return wh;
      }),
    }));
    audioAlert.playSuccessTone();
  },

  updateHospitalStatus: (hospitalId, status, estimatedShortageHours) => {
    set((state) => ({
      activeHospitals: state.activeHospitals.map((h) =>
        h.id === hospitalId
          ? {
              ...h,
              status,
              estimatedShortageHours:
                estimatedShortageHours !== undefined ? estimatedShortageHours : h.estimatedShortageHours,
            }
          : h
      ),
    }));
    audioAlert.playSuccessTone();
  },

  toggleRoadStatus: (roadId, newStatus) => {
    set((state) => ({
      activeRoads: state.activeRoads.map((r) =>
        r.id === roadId ? { ...r, status: newStatus } : r
      ),
      metrics: {
        ...state.metrics,
        blockedRoads: state.activeRoads.filter((r) =>
          r.id === roadId
            ? newStatus === 'blocked' || newStatus === 'flooded'
            : r.status === 'blocked' || r.status === 'flooded'
        ).length,
      },
    }));
    audioAlert.playSuccessTone();
  },

  refreshIncidents: async () => {
    set({ isRefreshingIncidents: true });
    await new Promise((resolve) => setTimeout(resolve, 600));
    const loc = get().currentLocation;
    const data = generateStateData(loc);

    // Update reported timestamps to simulated real-time
    const updatedIncidents = data.incidents.map((inc, i) => ({
      ...inc,
      reportedAt: i === 0 ? 'Just now (Radar Sync)' : `${(i + 1) * 3} min ago`,
    }));

    set({
      activeIncidents: updatedIncidents,
      lastIncidentSync: new Date(),
      isRefreshingIncidents: false,
    });
  },

  // Route Inspector Modal & Map Focus
  isRouteModalOpen: false,
  openRouteModal: () => set({ isRouteModalOpen: true }),
  closeRouteModal: () => set({ isRouteModalOpen: false }),
  routeFocusTimestamp: 0,
  triggerRouteFocus: () => {
    set({ routeFocusTimestamp: Date.now(), isRouteModalOpen: true });
  },

  setLocation: (loc: Location) => {
    const data = generateStateData(loc);
    set({
      currentLocation: loc,
      activeWarehouses: data.warehouses,
      activeHospitals: data.hospitals,
      activeVehicles: data.vehicles,
      activeRoads: data.roads,
      activeIncidents: data.incidents,
      activeZones: data.zones,
      deliveryPlan: data.deliveryPlan,
      activePlanItem: data.deliveryPlan.items[0],
      agentStates: data.agentStates,
      metrics: data.metrics,
      impactMetrics: data.impactMetrics,
      isPlanApproved: false,
      monitoringAlert: null,
      highlightedRouteId: 'H-07',
      lastIncidentSync: new Date(),
      routeFocusTimestamp: Date.now(),
    });
  },

  isDisruptionModalOpen: false,
  openDisruptionModal: () => set({ isDisruptionModalOpen: true }),
  closeDisruptionModal: () => set({ isDisruptionModalOpen: false }),

  isReportIncidentModalOpen: false,
  openReportIncidentModal: () => set({ isReportIncidentModalOpen: true }),
  closeReportIncidentModal: () => set({ isReportIncidentModalOpen: false }),

  addIncident: (inc) => {
    const newId = `INC-${Date.now().toString().slice(-4)}`;
    const newIncident: Incident = {
      ...inc,
      id: newId,
      reportedAt: 'Just now',
    };
    set((state) => ({
      activeIncidents: [newIncident, ...state.activeIncidents],
      isReportIncidentModalOpen: false,
      lastIncidentSync: new Date(),
      agentStates: [
        {
          name: 'Risk Agent',
          status: 'warning',
          message: `New SOS / Hazard logged: ${inc.title} (${inc.severity.toUpperCase()})`,
          icon: '!',
        },
        ...state.agentStates.slice(0, 5),
      ],
    }));
  },

  resolveIncident: (id) => {
    set((state) => ({
      activeIncidents: state.activeIncidents.map((i) =>
        i.id === id ? { ...i, status: 'resolved' } : i
      ),
    }));
  },

  dispatchRoadCrew: (roadId, crewName, estimatedMin) => {
    set((state) => ({
      activeRoads: state.activeRoads.map((r) =>
        r.id === roadId
          ? {
              ...r,
              status: 'open',
              estimatedTimeMin: Math.max(5, r.estimatedTimeMin - Math.round(estimatedMin / 2)),
              riskLevel: 'low',
            }
          : r
      ),
      agentStates: [
        {
          name: 'Mobility Agent',
          status: 'completed',
          message: `Clearance crew ${crewName} deployed to ${roadId}. Segment reopened for delivery transit.`,
          icon: '✓',
        },
        ...state.agentStates.slice(0, 5),
      ],
    }));
  },

  isAutoScanActive: false,
  scanTargetName: null,
  toggleAutoScan: () => set((state) => ({ isAutoScanActive: !state.isAutoScanActive })),
  setScanTarget: (targetName) => set({ scanTargetName: targetName }),

  isSimulating: false,
  simulationActive: true,
  disruptionType: 'flood',
  disruptionSeverity: 'high',
  affectedRoadsCount: 4,
  affectedZonesCount: 2,

  monitoringAlert: null,
  dismissMonitoringAlert: () => set({ monitoringAlert: null }),

  agentStates: initialDataset.agentStates,
  deliveryPlan: initialDataset.deliveryPlan,
  activePlanItem: initialDataset.deliveryPlan.items[0],
  setActivePlanItem: (item) => set({ activePlanItem: item, routeFocusTimestamp: Date.now() }),
  isPlanApproved: false,

  approvePlan: () => {
    set((state) => ({
      isPlanApproved: true,
      deliveryPlan: { ...state.deliveryPlan, status: 'approved' },
      metrics: {
        ...state.metrics,
        activeDeliveries: state.metrics.activeDeliveries + 1,
        availableVehicles: Math.max(0, state.metrics.availableVehicles - 1),
      },
    }));
    audioAlert.playSuccessTone();

    setTimeout(() => {
      set({
        monitoringAlert:
          'Continuous Monitoring Active: Sensor telemetry synchronised with national disaster grid.',
      });
    }, 4000);
  },

  recalculatePlan: () => {
    const loc = get().currentLocation;
    const data = generateStateData(loc);

    set({
      agentStates: [
        { name: 'Demand Agent', status: 'running', message: `Re-evaluating ${loc.name} hospital consumption rates...`, icon: '…' },
        { name: 'Risk Agent', status: 'running', message: `Checking ${loc.state} radar and hydro gauge feeds...`, icon: '…' },
        { name: 'Mobility Agent', status: 'running', message: 'Scanning alternate road corridors...', icon: '…' },
        { name: 'Inventory Agent', status: 'running', message: 'Verifying depot allocations...', icon: '…' },
        { name: 'Fleet Agent', status: 'running', message: 'Recalculating vehicle turnaround times...', icon: '…' },
        { name: 'Orchestrator', status: 'running', message: 'Solving linear optimization model...', icon: '⚡' },
      ],
    });

    setTimeout(() => {
      set({
        agentStates: data.agentStates,
        isPlanApproved: false,
        deliveryPlan: {
          ...data.deliveryPlan,
          generatedAt: `Recalculated just now for ${loc.name}, ${loc.state} via Google OR-Tools`,
        },
      });
      audioAlert.playSuccessTone();
    }, 1200);
  },

  metrics: initialDataset.metrics,
  impactMetrics: initialDataset.impactMetrics,

  selectedEntity: null,
  setSelectedEntity: (entity) => set({ selectedEntity: entity }),

  mapLayers: {
    warehouses: true,
    hospitals: true,
    vehicles: true,
    routes: true,
    floodZones: true,
    incidents: true,
  },
  toggleMapLayer: (layer) =>
    set((state) => ({
      mapLayers: { ...state.mapLayers, [layer]: !state.mapLayers[layer] },
    })),

  highlightedRouteId: 'H-07',
  setHighlightedRouteId: (id) => set({ highlightedRouteId: id, routeFocusTimestamp: Date.now() }),

  triggerSimulation: async (type: DisruptionType, severity: 'high' | 'medium' | 'low') => {
    const loc = get().currentLocation;

    set({
      isSimulating: true,
      isDisruptionModalOpen: false,
      isPlanApproved: false,
      monitoringAlert: null,
      disruptionType: type,
      disruptionSeverity: severity,
    });

    const steps: { name: AgentState['name']; msg: string; icon: AgentState['icon'] }[] = [
      {
        name: 'Demand Agent',
        msg: `${type.toUpperCase()} in ${loc.name}: Critical shortfall projected across ${severity === 'high' ? '4' : '2'} facilities.`,
        icon: '!',
      },
      {
        name: 'Risk Agent',
        msg: `${loc.state} Hazard Zones classified: 3 active inundation sectors.`,
        icon: '⚠',
      },
      {
        name: 'Mobility Agent',
        msg: `Direct ${loc.name} arterial road blocked. Route B verified for heavy freight.`,
        icon: '⚠',
      },
      {
        name: 'Inventory Agent',
        msg: `${loc.state} Regional Depot (W-02) designated with required stock.`,
        icon: '✓',
      },
      {
        name: 'Fleet Agent',
        msg: `Rapid response vehicle V-14 designated with cold-chain priority.`,
        icon: '✓',
      },
      {
        name: 'Orchestrator',
        msg: `OR-Tools synthesized updated deterministic route for ${loc.name}.`,
        icon: '⚡',
      },
    ];

    set({
      agentStates: steps.map((s) => ({
        name: s.name,
        status: 'running',
        message: 'Processing incident telemetry...',
        icon: '…',
      })),
    });

    for (let i = 0; i < steps.length; i++) {
      await new Promise((resolve) => setTimeout(resolve, 350));
      const currentStep = steps[i];
      set((state) => {
        const nextStates = [...state.agentStates];
        nextStates[i] = {
          name: currentStep.name,
          status: 'completed',
          message: currentStep.msg,
          icon: currentStep.icon,
        };
        return { agentStates: nextStates };
      });
    }

    set({
      isSimulating: false,
      simulationActive: true,
      affectedRoadsCount: severity === 'high' ? 6 : 3,
      affectedZonesCount: severity === 'high' ? 3 : 1,
      metrics: {
        criticalLocations: loc.criticalFacilities,
        urgentLocations: severity === 'high' ? 4 : 2,
        shortageRisk: severity === 'high' ? Math.min(98, loc.riskIndex + 10) : loc.riskIndex,
        shortageRiskDelta: 12,
        availableVehicles: 30,
        totalVehicles: 45,
        activeDeliveries: 16,
        blockedRoads: severity === 'high' ? 6 : 3,
        warehouses: loc.warehousesCount,
      },
      impactMetrics: {
        before: {
          criticalServed: `${Math.round(loc.criticalFacilities * 0.4)}/${loc.criticalFacilities}`,
          shortageRisk: loc.riskIndex,
          avgDeliveryMin: 78,
        },
        after: {
          criticalServed: `${Math.round(loc.criticalFacilities * 0.9)}/${loc.criticalFacilities}`,
          shortageRisk: 12,
          avgDeliveryMin: 43,
        },
        confidence: 94,
      },
      highlightedRouteId: 'H-07',
      routeFocusTimestamp: Date.now(),
    });
    audioAlert.playWarningChime();
  },

  resetSimulation: () => {
    const loc = get().currentLocation;
    const data = generateStateData(loc);
    set({
      simulationActive: false,
      disruptionType: null,
      isPlanApproved: false,
      monitoringAlert: null,
      agentStates: data.agentStates,
      metrics: data.metrics,
      impactMetrics: data.impactMetrics,
      routeFocusTimestamp: Date.now(),
    });
    audioAlert.playSuccessTone();
  },
}));
