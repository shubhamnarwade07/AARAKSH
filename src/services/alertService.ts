import { Alert, AlertFilters } from '@/types';
import { MOCK_ALERTS } from '@/data/mockAlerts';

let alerts = [...MOCK_ALERTS];

// Future: replace with ApiAlertProvider calling GET /alerts, POST /alerts/{id}/acknowledge
export const alertService = {
  async getAlerts(filters?: AlertFilters): Promise<Alert[]> {
    await delay(300);
    let result = [...alerts];
    if (filters?.severity?.length) result = result.filter(a => filters.severity!.includes(a.severity));
    if (filters?.status?.length) result = result.filter(a => filters.status!.includes(a.status));
    if (filters?.state) result = result.filter(a => a.state === filters.state);
    return result.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  },

  async acknowledgeAlert(id: string, byUser: string): Promise<boolean> {
    await delay(400);
    const idx = alerts.findIndex(a => a.id === id);
    if (idx === -1) return false;
    alerts[idx] = { ...alerts[idx], status: 'ACKNOWLEDGED', acknowledgedBy: byUser, acknowledgedAt: new Date().toISOString(), updatedAt: new Date().toISOString() };
    return true;
  },

  async resolveAlert(id: string, byUser: string): Promise<boolean> {
    await delay(400);
    const idx = alerts.findIndex(a => a.id === id);
    if (idx === -1) return false;
    alerts[idx] = { ...alerts[idx], status: 'RESOLVED', resolvedBy: byUser, resolvedAt: new Date().toISOString(), updatedAt: new Date().toISOString() };
    return true;
  },

  resetAlerts() {
    alerts = [...MOCK_ALERTS];
  },
};

function delay(ms: number) {
  return new Promise(r => setTimeout(r, ms));
}
