import { RiskLevel } from '@/types';

// ============================================================
// DEMO MODE CONFIGURATION
// ============================================================
export const DEMO_MODE = true;

export const DEMO_ACCOUNTS = {
  USER: { email: 'user@demo.aaraksh.in', password: 'demo1234', role: 'USER' as const },
  AUTHORITY: { email: 'authority@demo.aaraksh.in', password: 'demo1234', role: 'AUTHORITY' as const },
  ADMIN: { email: 'admin@demo.aaraksh.in', password: 'demo1234', role: 'ADMIN' as const },
};

// ============================================================
// RISK THRESHOLDS
// IMPORTANT: These are PROTOTYPE UI thresholds only.
// They are NOT scientifically validated thresholds.
// Real thresholds must be calibrated using actual data.
// ============================================================
export const RISK_THRESHOLDS = {
  LOW_MAX: 0.29,
  MODERATE_MAX: 0.59,
  HIGH_MAX: 0.79,
  CRITICAL_MIN: 0.80,
} as const;

export const RISK_LEVEL_LABELS: Record<RiskLevel, string> = {
  LOW: 'Low',
  MODERATE: 'Moderate',
  HIGH: 'High',
  CRITICAL: 'Critical',
};

// ============================================================
// DEMO SCENARIOS
// ============================================================
export const DEMO_SCENARIOS = {
  NORMAL: {
    id: 'NORMAL',
    label: 'Normal Conditions',
    rainfall: 24,
    soilMoisture: 42,
    waterLevel: 1.1,
    riskScore: 0.18,
    riskLevel: 'LOW' as RiskLevel,
  },
  HEAVY_RAIN: {
    id: 'HEAVY_RAIN',
    label: 'Heavy Rainfall',
    rainfall: 76,
    soilMoisture: 69,
    waterLevel: 2.1,
    riskScore: 0.52,
    riskLevel: 'MODERATE' as RiskLevel,
  },
  RISING_RISK: {
    id: 'RISING_RISK',
    label: 'Rising Risk',
    rainfall: 96,
    soilMoisture: 81,
    waterLevel: 2.8,
    riskScore: 0.71,
    riskLevel: 'HIGH' as RiskLevel,
  },
  CRITICAL: {
    id: 'CRITICAL',
    label: 'Critical Conditions',
    rainfall: 112,
    soilMoisture: 91,
    waterLevel: 3.4,
    riskScore: 0.88,
    riskLevel: 'CRITICAL' as RiskLevel,
  },
} as const;

// ============================================================
// ROUTES
// ============================================================
export const ROUTES = {
  // Public
  LANDING: '/',
  ABOUT: '/about',
  HOW_IT_WORKS: '/how-it-works',
  LOGIN: '/login',
  REGISTER: '/register',
  // User
  APP_DASHBOARD: '/app/dashboard',
  APP_RISK_MAP: '/app/risk-map',
  APP_PREDICTIONS: '/app/predictions',
  APP_ALERTS: '/app/alerts',
  APP_LOCATIONS: '/app/locations',
  APP_SAFETY_CENTRE: '/app/safety-centre',
  APP_REPORTS: '/app/reports',
  APP_PROFILE: '/app/profile',
  APP_SETTINGS: '/app/settings',
  // Admin
  ADMIN_DASHBOARD: '/admin/dashboard',
  ADMIN_RISK_MONITORING: '/admin/risk-monitoring',
  ADMIN_DATA_FEEDS: '/admin/live-sensors',  // reuses same route, renamed in UI
  ADMIN_LOCATIONS: '/admin/locations',
  ADMIN_ALERTS: '/admin/alerts',
  ADMIN_PREDICTIONS: '/admin/predictions',
  ADMIN_USERS: '/admin/users',
  ADMIN_DATA_SOURCES: '/admin/data-sources',
  ADMIN_MODELS: '/admin/models',
  ADMIN_REPORTS: '/admin/reports',
  ADMIN_AUDIT_LOGS: '/admin/audit-logs',
  ADMIN_SETTINGS: '/admin/settings',
  // System
  NOT_FOUND: '/404',
  UNAUTHORIZED: '/unauthorized',
} as const;

// ============================================================
// MAP CONFIG
// ============================================================
export const MAP_CONFIG = {
  DEFAULT_CENTER: [79.0193, 30.0668] as [number, number], // Uttarakhand center
  DEFAULT_ZOOM: 7,
  STYLE_URL: 'https://tiles.openfreemap.org/styles/liberty',
} as const;

// ============================================================
// SENSOR CONFIG
// ============================================================
export const SENSOR_TYPES = {
  RAIN_GAUGE: 'Rain Gauge',
  SOIL_MOISTURE: 'Soil Moisture',
  WATER_LEVEL: 'Water Level',
  SLOPE: 'Slope Sensor',
} as const;

export const SENSOR_STATUS_COLORS = {
  ONLINE: '#22C55E',
  OFFLINE: '#EF4444',
  DEGRADED: '#EAB308',
} as const;

// ============================================================
// SYSTEM HEALTH
// ============================================================
export const SYSTEM_SERVICES = [
  { id: 'api', name: 'API Service' },
  { id: 'database', name: 'Database' },
  { id: 'ml_engine', name: 'ML Engine' },
  { id: 'gis', name: 'GIS Services' },
  { id: 'iot_gateway', name: 'IoT Gateway' },
  { id: 'alert_engine', name: 'Alert Engine' },
] as const;

// Data refresh interval in ms (for demo simulation)
export const DEMO_REFRESH_INTERVAL = 10000; // 10 seconds
