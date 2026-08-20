// ============================================================
// Core domain types for ResQFlow
// ============================================================

export type SeverityLevel = 'critical' | 'high' | 'moderate' | 'low';
export type StatusType = 'operational' | 'warning' | 'critical' | 'offline' | 'available' | 'assigned' | 'maintenance';
export type RoadStatus = 'open' | 'blocked' | 'flooded' | 'damaged';
export type DisruptionType = 'flood' | 'road_closure' | 'accident';
export type RegionType = 'North' | 'North-East' | 'East' | 'South' | 'West' | 'Central';

export interface LatLng {
  lat: number;
  lng: number;
}

// --- Location / State Command Node ---
export interface Location {
  id: string;
  name: string;
  state: string;
  region: RegionType;
  disasterProfile: string;
  riskIndex: number; // 0 - 100
  criticalFacilities: number;
  warehousesCount: number;
  activeAlerts: number;
  center: LatLng;
  zoom: number;
}

// --- Warehouse ---
export interface Warehouse {
  id: string;
  name: string;
  position: LatLng;
  address: string;
  capacity: number;
  currentStock: number; // percentage 0-100
  supplies: {
    medicine: number;
    food: number;
    water: number;
    equipment: number;
  };
  status: 'operational' | 'warning' | 'critical';
  lastUpdated: string;
}

// --- Hospital / Relief Center ---
export type FacilityType = 'hospital' | 'relief_center' | 'clinic';

export interface Hospital {
  id: string;
  name: string;
  type: FacilityType;
  position: LatLng;
  address: string;
  capacity: number;
  patientsServed: number;
  shortageRisk: SeverityLevel | 'none';
  estimatedShortageHours: number | null; // null = no shortage
  supplies: {
    medicine: number; // hours remaining
    food: number;
    water: number;
    power: boolean;
  };
  priorityScore: number; // 0-100
  status: 'critical' | 'warning' | 'normal';
}

// --- Vehicle ---
export type VehicleType = 'truck' | 'ambulance' | 'helicopter' | 'boat' | 'van';

export interface Vehicle {
  id: string;
  name: string;
  type: VehicleType;
  position: LatLng;
  status: 'available' | 'assigned' | 'maintenance' | 'en_route';
  capacity: number; // kg
  currentLoad: number; // kg
  driver: string;
  assignment?: string; // delivery plan ID
  nearestWarehouse: string;
  fuelLevel: number; // percent
  lastUpdated: string;
}

// --- Road ---
export interface Road {
  id: string;
  name: string;
  from: string;
  to: string;
  path: LatLng[];
  status: RoadStatus;
  affectedByIncident?: string; // incident ID
  alternateRoute?: string; // road ID
  riskLevel: SeverityLevel | 'low';
  distanceKm: number;
  estimatedTimeMin: number;
}

// --- Incident ---
export interface Incident {
  id: string;
  type: DisruptionType;
  title: string;
  location: string;
  position: LatLng;
  severity: SeverityLevel;
  status: 'active' | 'monitoring' | 'resolved';
  affectedRoads: string[];
  affectedZones: string[];
  reportedAt: string;
  description: string;
}

// --- Zone (vulnerable zone) ---
export interface Zone {
  id: string;
  name: string;
  type: 'flood_plain' | 'vulnerable' | 'evacuation';
  polygon: LatLng[];
  population: number;
  riskLevel: SeverityLevel;
  floodProbability: number; // percent
  status: 'safe' | 'watch' | 'warning' | 'danger';
}

// --- Delivery Plan ---
export interface DeliveryPlanItem {
  rank: number;
  destinationId: string; // hospital ID
  destinationName: string;
  destinationType: FacilityType;
  supply: string;
  quantity: number;
  unit: string;
  sourceWarehouseId: string;
  sourceWarehouseName: string;
  vehicleId: string;
  vehicleName: string;
  etaMinutes: number;
  routeDescription: string;
  routePath: LatLng[];
  severity: SeverityLevel;
  reasoning: {
    urgency: string;
    inventory: string;
    mobility: string;
    risk: string;
    fleet: string;
  };
}

export interface DeliveryPlan {
  id: string;
  generatedAt: string;
  status: 'pending' | 'approved' | 'executing' | 'completed';
  items: DeliveryPlanItem[];
  confidence: number; // percent
}

// --- Agent ---
export type AgentName = 'Demand Agent' | 'Risk Agent' | 'Mobility Agent' | 'Inventory Agent' | 'Fleet Agent' | 'Orchestrator';
export type AgentStatus = 'idle' | 'running' | 'completed' | 'warning' | 'error';

export interface AgentState {
  name: AgentName;
  status: AgentStatus;
  message: string;
  icon: '!' | '✓' | '⚠' | '⚡' | '…';
}

// --- Simulation State ---
export interface SimulationState {
  active: boolean;
  disruptionType: DisruptionType | null;
  location: string;
  severity: 'high' | 'medium' | 'low';
  affectedRoads: number;
  affectedZones: number;
  startedAt: string | null;
}

// --- Impact Metrics ---
export interface ImpactMetrics {
  before: {
    criticalServed: string;
    shortageRisk: number;
    avgDeliveryMin: number;
  };
  after: {
    criticalServed: string;
    shortageRisk: number;
    avgDeliveryMin: number;
  };
  confidence: number;
}

// --- Dashboard Metrics ---
export interface DashboardMetrics {
  criticalLocations: number;
  urgentLocations: number;
  shortageRisk: number;
  shortageRiskDelta: number;
  availableVehicles: number;
  totalVehicles: number;
  activeDeliveries: number;
  blockedRoads: number;
  warehouses: number;
}

// --- Emergency Broadcast Alert ---
export type BroadcastSeverity = 'critical' | 'warning' | 'info';
export type BroadcastAudience = 'all_users' | 'field_teams' | 'hospitals' | 'public_pa';

export interface BroadcastAlert {
  id: string;
  title: string;
  message: string;
  severity: BroadcastSeverity;
  audience: BroadcastAudience;
  region: string;
  radiusKm: number;
  soundAlert: boolean;
  timestamp: string;
  active: boolean;
  acknowledged: boolean;
  recipientCount: number;
  category: 'evacuation' | 'flash_flood' | 'road_closure' | 'medical_supply' | 'general';
}

// --- Theme Mode ---
export type ThemeMode = 'system' | 'light' | 'dark';

