// ============================================================
// AARAKSH — Domain Type Definitions
// ============================================================

// ============================================================
// USER & AUTH
// ============================================================

export type UserRole = 'USER' | 'AUTHORITY' | 'ADMIN';

export interface User {
  id: string;
  fullName: string;
  email: string;
  phone?: string;
  role: UserRole;
  preferredRegion?: string;
  preferredLocation?: string;
  isActive: boolean;
  lastActive: string; // ISO datetime
  createdAt: string;
  avatarInitials?: string;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

export interface LoginCredentials {
  email: string;
  password: string;
  rememberMe?: boolean;
}

export interface RegisterData {
  fullName: string;
  email: string;
  password: string;
  confirmPassword: string;
  phone?: string;
  preferredRegion?: string;
  preferredLocation?: string;
}

export interface AuthToken {
  accessToken: string;
  expiresAt: string;
  userId: string;
  role: UserRole;
}

// ============================================================
// GEOGRAPHY
// ============================================================

export interface Coordinates {
  lat: number;
  lng: number;
}

export interface Region {
  id: string;
  name: string;
  state: string;
  center: Coordinates;
}

export interface District {
  id: string;
  name: string;
  state: string;
  regionId: string;
  center: Coordinates;
}

export interface Location {
  id: string;
  name: string;
  type: 'VILLAGE' | 'WARD' | 'TOWN' | 'BLOCK';
  district: string;
  state: string;
  coordinates: Coordinates;
  elevation?: number; // meters
  population?: number;
  sensorCount: number;
  activeSensors: number;
  riverBasin?: string;
  isMonitored?: boolean;
  lastUpdated?: string;
}

export interface SavedLocation {
  id: string;
  userId: string;
  locationId: string;
  label: string; // e.g. "Home", "Village"
  notes?: string;
  createdAt: string;
}

// ============================================================
// RISK
// ============================================================

export type RiskLevel = 'LOW' | 'MODERATE' | 'HIGH' | 'CRITICAL';
export type RiskTrend = 'INCREASING' | 'STABLE' | 'DECREASING';

export interface RiskFactor {
  label: string;
  value: number; // 0–1 normalized contribution
  contribution: 'LOW' | 'MODERATE' | 'HIGH';
  // Optional extended fields
  id?: string;
  name?: string;
  rawValue?: number;
  rawUnit?: string;
  level?: RiskLevel;
  description?: string;
}

export interface RiskData {
  locationId: string;
  locationName: string;
  riskScore: number; // 0–1
  riskLevel: RiskLevel;
  floodProbability: number; // 0–1
  confidence: number; // 0–1
  trend: RiskTrend;
  rainfall: number; // mm
  soilMoisture: number; // %
  waterLevel: number; // meters
  slopeRisk: string; // 'LOW' | 'MODERATE' | 'HIGH' | 'CRITICAL'
  factors: RiskFactor[];
  aiExplanation?: string;
  updatedAt: string;
  dataQuality?: DataQuality;
}

export interface RiskHistoryPoint {
  timestamp: string;
  riskScore: number;
  riskLevel: RiskLevel;
  rainfall: number;
  soilMoisture: number;
  waterLevel: number;
}

// ============================================================
// PREDICTIONS
// ============================================================

export interface Prediction {
  id: string;
  locationId: string;
  locationName: string;
  riskScore: number;
  riskLevel: RiskLevel;
  floodProbability: number;
  confidence: number;
  trend: RiskTrend;
  predictionHorizon: string; // e.g., "Next monitoring window"
  modelVersion: string;
  features: RiskFactor[];
  timeline: PredictionTimelinePoint[];
  aiExplanation?: string;
  generatedAt: string;
  isPrototype: boolean; // Always true until validated
}

export interface PredictionTimelinePoint {
  label: string; // e.g., "Now", "+1h", "+3h"
  riskScore: number;
  riskLevel: RiskLevel;
}

// ============================================================
// ALERTS
// ============================================================

export type AlertSeverity = 'CRITICAL' | 'HIGH' | 'MODERATE' | 'INFORMATIONAL';
export type AlertStatus = 'ACTIVE' | 'ACKNOWLEDGED' | 'RESOLVED';

export interface Alert {
  id: string;
  severity: AlertSeverity;
  status: AlertStatus;
  locationId: string;
  locationName: string;
  district: string;
  state: string;
  title: string;
  description: string;
  riskScore: number;
  riskLevel: RiskLevel;
  recommendedAction: string;
  triggerFactors: string[];
  createdAt: string;
  updatedAt: string;
  acknowledgedBy?: string;
  acknowledgedAt?: string;
  resolvedBy?: string;
  resolvedAt?: string;
  notificationsSent?: string[];
  isSimulated?: boolean;
}

export interface AlertFilters {
  severity?: AlertSeverity[];
  status?: AlertStatus[];
  locationId?: string;
  state?: string;
  district?: string;
  dateFrom?: string;
  dateTo?: string;
}

// ============================================================
// SENSORS
// ============================================================

export type SensorType = 'RAIN_GAUGE' | 'SOIL_MOISTURE' | 'WATER_LEVEL' | 'SLOPE';
export type SensorStatus = 'ONLINE' | 'OFFLINE' | 'DEGRADED' | 'MAINTENANCE';

export interface Sensor {
  id: string;
  name: string;
  type: SensorType;
  locationId: string;
  locationName: string;
  district: string;
  state: string;
  coordinates: Coordinates;
  status: SensorStatus;
  lastReading: SensorReading;
  battery: number; // %
  connectivity: string;
  manufacturer?: string;
  installDate?: string;
  installedAt?: string;
  firmware?: string;
  lastMaintenance?: string;
  notes?: string;
}

export interface SensorReading {
  sensorId: string;
  value: number;
  unit: string;
  timestamp: string;
  isSimulated: boolean;
}

export interface SensorHistory {
  sensorId: string;
  readings: SensorReading[];
}

// ============================================================
// DATA SOURCES
// ============================================================

export type DataSourceType = 'WEATHER_API' | 'SATELLITE' | 'TERRAIN' | 'HISTORICAL' | 'IOT' | 'HYDROLOGICAL';
export type DataSourceStatus = 'ACTIVE' | 'INACTIVE' | 'ERROR' | 'PENDING';

export interface DataSource {
  id: string;
  name: string;
  type: DataSourceType;
  status: DataSourceStatus;
  description: string;
  coverage: string;
  updateFrequency: string;
  dataQuality: string;
  lastSync?: string | null;
  lastUpdate?: string;
  provider?: string;
  isLive: boolean; // false = planned/simulated
  notes?: string;
}

// ============================================================
// ML MODELS
// ============================================================

export type ModelStatus = 'ACTIVE' | 'TRAINING' | 'DEPRECATED' | 'PLANNED';

export interface MLModel {
  id: string;
  name: string;
  version: string;
  type: string;
  status: ModelStatus;
  lastTrained?: string | null;
  nextTraining?: string | null;
  features: string[];
  metrics: ModelMetrics;
  description: string;
  isPrototype?: boolean;
  isValidated?: boolean;
  targetVariable?: string;
  trainingDataStatus?: string;
  notes?: string;
}

export interface ModelMetrics {
  accuracy?: number | null;
  precision?: number | null;
  recall?: number | null;
  f1Score?: number | null;
  auc?: number | null;
  f1?: number;
  rocAuc?: number;
  falseAlarmRate?: number;
  leadTime?: string;
  validationStatus: 'AWAITING_VALIDATION' | 'VALIDATED' | 'IN_PROGRESS';
}

// ============================================================
// SYSTEM HEALTH
// ============================================================

export type ServiceStatus = 'OPERATIONAL' | 'DEGRADED' | 'OFFLINE' | 'MAINTENANCE';

export interface SystemService {
  id: string;
  name: string;
  status: ServiceStatus;
  latency?: number; // ms
  lastCheck: string;
  notes?: string;
}

export interface SystemHealth {
  overall: ServiceStatus;
  services: SystemService[];
  lastUpdated: string;
  isDemo: boolean;
}

// ============================================================
// DATA QUALITY
// ============================================================

export type DataQuality = 'GOOD' | 'FAIR' | 'POOR' | 'UNAVAILABLE' | 'High' | 'Medium' | 'Simulated';

// ============================================================
// REPORTS
// ============================================================

export type ReportType = 'RISK_SUMMARY' | 'LOCATION_REPORT' | 'ALERT_HISTORY' | 'SENSOR_REPORT' | 'PREDICTION_REPORT';
export type ReportStatus = 'READY' | 'GENERATING' | 'FAILED';

export interface Report {
  id: string;
  title: string;
  type: ReportType;
  status: ReportStatus;
  generatedAt: string;
  generatedBy: string;
  locationIds?: string[];
  parameters?: Record<string, string>;
  fileSize?: string;
  summary?: string;
  isDemo: boolean;
}

// ============================================================
// NOTIFICATIONS
// ============================================================

export type NotificationType = 'ALERT' | 'SENSOR' | 'RISK' | 'PREDICTION' | 'SYSTEM';

export interface Notification {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  isRead: boolean;
  createdAt: string;
  linkTo?: string;
  severity?: AlertSeverity;
}

// ============================================================
// AUDIT LOGS
// ============================================================

export interface AuditLog {
  id: string;
  timestamp: string;
  userId: string;
  userName: string;
  userRole: UserRole;
  action: string;
  resource: string;
  resourceId?: string;
  status: 'SUCCESS' | 'FAILURE';
  ipAddress?: string;
  details?: string;
}

// ============================================================
// DEMO
// ============================================================

export type DemoScenarioId = 'NORMAL' | 'HEAVY_RAIN' | 'RISING_RISK' | 'CRITICAL';

export interface DemoScenario {
  id: DemoScenarioId;
  label: string;
  rainfall: number;
  soilMoisture: number;
  waterLevel: number;
  riskScore: number;
  riskLevel: RiskLevel;
}

// ============================================================
// API CONTRACTS (for future FastAPI integration)
// ============================================================

export interface ApiResponse<T> {
  data: T;
  message?: string;
  timestamp: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
}

export interface ApiError {
  code: string;
  message: string;
  details?: Record<string, string>;
}
