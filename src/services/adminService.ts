import { User, AuditLog, DataSource, MLModel, SystemHealth } from '@/types';
import { DEMO_USERS } from '@/data/mockUsers';
import { MOCK_AUDIT_LOGS } from '@/data/mockAuditLogs';
import { MOCK_DATA_SOURCES } from '@/data/mockDataSources';
import { MOCK_ML_MODELS } from '@/data/mockModels';

let users = [...DEMO_USERS];

export const adminService = {
  async getUsers(): Promise<User[]> {
    await delay(300);
    return users;
  },

  async deactivateUser(id: string): Promise<boolean> {
    await delay(400);
    const idx = users.findIndex(u => u.id === id);
    if (idx === -1) return false;
    users[idx] = { ...users[idx], isActive: false };
    return true;
  },

  async getAuditLogs(): Promise<AuditLog[]> {
    await delay(300);
    return MOCK_AUDIT_LOGS.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
  },

  async getDataSources(): Promise<DataSource[]> {
    await delay(250);
    return MOCK_DATA_SOURCES;
  },

  async getMLModels(): Promise<MLModel[]> {
    await delay(250);
    return MOCK_ML_MODELS;
  },

  async getSystemHealth(): Promise<SystemHealth> {
    await delay(200);
    return {
      overall: 'OPERATIONAL',
      services: [
        { id: 'api', name: 'API Service', status: 'OPERATIONAL', latency: 24, lastCheck: new Date().toISOString(), notes: 'Demo mode — no real API' },
        { id: 'database', name: 'Database', status: 'OFFLINE', lastCheck: new Date().toISOString(), notes: 'Planned: Supabase/PostgreSQL' },
        { id: 'ml_engine', name: 'ML Engine', status: 'OFFLINE', lastCheck: new Date().toISOString(), notes: 'Planned: XGBoost service' },
        { id: 'gis', name: 'GIS Services', status: 'OFFLINE', lastCheck: new Date().toISOString(), notes: 'Planned: PostGIS/GeoPandas' },
        { id: 'iot_gateway', name: 'IoT Gateway', status: 'OFFLINE', lastCheck: new Date().toISOString(), notes: 'Planned: MQTT/Mosquitto' },
        { id: 'alert_engine', name: 'Alert Engine', status: 'OPERATIONAL', latency: 12, lastCheck: new Date().toISOString(), notes: 'Demo alert engine active' },
      ],
      lastUpdated: new Date().toISOString(),
      isDemo: true,
    };
  },
};

function delay(ms: number) {
  return new Promise(r => setTimeout(r, ms));
}
