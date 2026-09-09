import { RiskData, RiskHistoryPoint } from '@/types';
import { MOCK_RISK_DATA, generateRiskHistory } from '@/data/mockLocations';

// Future: replace with ApiRiskProvider that calls GET /risk and GET /risk/{locationId}
export const riskService = {
  async getAllRisk(): Promise<RiskData[]> {
    await delay(300);
    return Object.values(MOCK_RISK_DATA);
  },

  async getRiskByLocation(locationId: string): Promise<RiskData | null> {
    await delay(200);
    return MOCK_RISK_DATA[locationId] ?? null;
  },

  async getRiskHistory(locationId: string): Promise<RiskHistoryPoint[]> {
    await delay(250);
    const baseRisk = MOCK_RISK_DATA[locationId]?.riskScore ?? 0.4;
    return generateRiskHistory(locationId, baseRisk);
  },
};

function delay(ms: number) {
  return new Promise(r => setTimeout(r, ms));
}
