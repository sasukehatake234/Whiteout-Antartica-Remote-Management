export type StationId = 'maitri' | 'bharati';

export type SeverityLevel = 'CRITICAL' | 'HIGH' | 'MONITOR' | 'NORMAL';

export type EquipmentCategory = 
  | 'Power Systems'
  | 'Generators'
  | 'Heating & HVAC'
  | 'Communication'
  | 'Vehicles'
  | 'Scientific Equipment'
  | 'Safety Equipment';

export type EquipmentStatus = 'Operational' | 'Maintenance Due' | 'Warning' | 'Offline';

export interface StationScoreBreakdown {
  power: { status: 'Good' | 'Monitor' | 'Warning'; score: number; detail: string };
  equipment: { status: 'Good' | 'Monitor' | 'Warning'; score: number; detail: string };
  supplies: { status: 'Good' | 'Monitor' | 'Warning'; score: number; detail: string };
  weather: { status: 'Good' | 'Monitor' | 'Warning'; score: number; detail: string };
  communication: { status: 'Good' | 'Monitor' | 'Warning'; score: number; detail: string };
  alerts: { status: 'Good' | 'Monitor' | 'Warning'; score: number; detail: string };
}

export interface SupplyItem {
  id: string;
  stationId?: StationId;
  name: string;
  category: 'fuel' | 'food' | 'medical' | 'spares' | 'emergency';
  currentPercentage: number;
  totalCapacity: string;
  dailyConsumption: string;
  estimatedRemainingDays: number;
  minimumReserveDays: number;
  status: 'NORMAL' | 'MONITOR' | 'ACTION_REQUIRED';
  lastDelivered: string;
  history: { day: string; level: number }[];
}

export interface EquipmentItem {
  id: string;
  stationId: StationId;
  name: string;
  category: EquipmentCategory;
  status: EquipmentStatus;
  health: number; // 0-100
  operatingHours: number;
  lastMaintenanceDaysAgo: number;
  nextMaintenanceDueDays: number;
  recommendedAction?: string;
  predictiveWhy?: string[];
  metrics?: { label: string; value: string }[];
}

export interface AlertItem {
  id: string;
  stationId: StationId;
  system: string;
  severity: SeverityLevel;
  title: string;
  description: string;
  recommendedAction: string;
  detectedAt: string;
  acknowledged: boolean;
  active: boolean;
}

export interface PriorityIssue {
  id: string;
  stationId: StationId;
  problem: string;
  severity: SeverityLevel;
  whyItMatters: string;
  recommendedAction: string;
  detectedAt: string;
  category: 'power' | 'supplies' | 'equipment' | 'weather' | 'comms';
}

export interface PersonnelMember {
  id: string;
  name: string;
  stationId: StationId;
  role: string;
  department: 'Operations' | 'Science' | 'Engineering' | 'Logistics' | 'Medical';
  status: 'Active' | 'Off-duty' | 'Safety check pending';
  shift: 'Alpha (06:00-14:00)' | 'Bravo (14:00-22:00)' | 'Night Watch';
  safetyCheckCompleted: boolean;
  bloodGroup: string;
}

export interface WeatherCondition {
  temperatureC: number;
  apparentTempC: number;
  windSpeedKmh: number;
  windDirection: string;
  visibilityKm: number;
  condition: string;
  barometerHpa: number;
  blizzardRisk: 'Low' | 'Moderate' | 'Severe';
  solarRadiationWm2: number;
  sunlightHours: string;
  operationalImpact: string;
}

export interface StationData {
  id: StationId;
  name: string;
  code: string;
  fullTitle: string;
  commissionedYear: number;
  location: {
    lat: number;
    lng: number;
    region: string;
    coordinatesText: string;
    elevationMeters: number;
  };
  operationalStatus: 'OPERATIONAL' | 'WARNING' | 'CRITICAL';
  statusText: string;
  personnelCount: number;
  whiteoutScore: number;
  scoreBreakdown: StationScoreBreakdown;
  powerPercentage: number;
  fuelPercentage: number;
  suppliesPercentage: number;
  communicationStatus: 'Stable' | 'Degraded' | 'Offline';
  latencyMs: number;
  activeAlertsCount: number;
  weather: WeatherCondition;
  image: string;
}

export interface OperationalEvent {
  id: string;
  time: string;
  stationId: StationId;
  type: 'alert' | 'maintenance' | 'weather' | 'supply' | 'comms';
  message: string;
}

export type ActiveTab = 
  | 'command-center'
  | 'stations'
  | 'personnel'
  | 'equipment'
  | 'logistics'
  | 'environment'
  | 'alerts'
  | 'maintenance'
  | 'reports'
  | 'ai-assistant'
  | 'strategic-dossier';
