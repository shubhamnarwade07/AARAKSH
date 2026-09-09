import { Location, RiskData, RiskHistoryPoint, RiskLevel } from '@/types';
import { scoreToRiskLevel } from '@/lib/utils';

export const MOCK_LOCATIONS: Location[] = [
  {
    id: 'VLG_001', name: 'Rambara', district: 'Rudraprayag', state: 'Uttarakhand',
    type: 'VILLAGE', coordinates: { lat: 30.5428, lng: 79.0672 },
    population: 1200, elevation: 2012, sensorCount: 4, activeSensors: 4,
    riverBasin: 'Mandakini', isMonitored: true,
  },
  {
    id: 'VLG_002', name: 'Gaurikund', district: 'Rudraprayag', state: 'Uttarakhand',
    type: 'VILLAGE', coordinates: { lat: 30.5284, lng: 79.0512 },
    population: 890, elevation: 1982, sensorCount: 3, activeSensors: 3,
    riverBasin: 'Mandakini', isMonitored: true,
  },
  {
    id: 'VLG_003', name: 'Sonprayag', district: 'Rudraprayag', state: 'Uttarakhand',
    type: 'VILLAGE', coordinates: { lat: 30.5068, lng: 79.0182 },
    population: 2100, elevation: 1829, sensorCount: 3, activeSensors: 2,
    riverBasin: 'Mandakini', isMonitored: true,
  },
  {
    id: 'VLG_004', name: 'Tilwara', district: 'Rudraprayag', state: 'Uttarakhand',
    type: 'VILLAGE', coordinates: { lat: 30.4839, lng: 78.9734 },
    population: 3200, elevation: 1341, sensorCount: 2, activeSensors: 2,
    riverBasin: 'Mandakini', isMonitored: true,
  },
  {
    id: 'VLG_005', name: 'Agastyamuni', district: 'Rudraprayag', state: 'Uttarakhand',
    type: 'TOWN', coordinates: { lat: 30.5263, lng: 78.9861 },
    population: 5800, elevation: 1079, sensorCount: 4, activeSensors: 4,
    riverBasin: 'Mandakini', isMonitored: true,
  },
  {
    id: 'VLG_006', name: 'Lata Village', district: 'Chamoli', state: 'Uttarakhand',
    type: 'VILLAGE', coordinates: { lat: 30.5791, lng: 79.5431 },
    population: 600, elevation: 2420, sensorCount: 2, activeSensors: 1,
    riverBasin: 'Niti River', isMonitored: true,
  },
  {
    id: 'VLG_007', name: 'Mayali', district: 'Chamoli', state: 'Uttarakhand',
    type: 'VILLAGE', coordinates: { lat: 30.4127, lng: 79.4382 },
    population: 480, elevation: 1840, sensorCount: 2, activeSensors: 2,
    riverBasin: 'Birahi Ganga', isMonitored: true,
  },
  {
    id: 'VLG_008', name: 'Chungthang', district: 'North Sikkim', state: 'Sikkim',
    type: 'TOWN', coordinates: { lat: 27.6174, lng: 88.6477 },
    population: 4200, elevation: 1780, sensorCount: 3, activeSensors: 3,
    riverBasin: 'Teesta', isMonitored: true,
  },
  {
    id: 'VLG_009', name: 'Mangan', district: 'North Sikkim', state: 'Sikkim',
    type: 'TOWN', coordinates: { lat: 27.5134, lng: 88.5318 },
    population: 6100, elevation: 1240, sensorCount: 3, activeSensors: 3,
    riverBasin: 'Teesta', isMonitored: true,
  },
  {
    id: 'VLG_010', name: 'Phaplu', district: 'Solukhumbu', state: 'Himachal Pradesh',
    type: 'VILLAGE', coordinates: { lat: 31.9284, lng: 77.1938 },
    population: 720, elevation: 2480, sensorCount: 2, activeSensors: 1,
    riverBasin: 'Beas', isMonitored: true,
  },
];

export const MOCK_RISK_DATA: Record<string, RiskData> = {
  VLG_001: {
    locationId: 'VLG_001', locationName: 'Rambara',
    riskScore: 0.87, riskLevel: 'CRITICAL',
    floodProbability: 0.87, confidence: 0.79,
    trend: 'INCREASING',
    rainfall: 112, soilMoisture: 91, waterLevel: 3.4, slopeRisk: 'HIGH',
    factors: [
      { label: 'Soil Moisture', value: 0.91, contribution: 'HIGH' },
      { label: 'Rainfall Intensity', value: 0.86, contribution: 'HIGH' },
      { label: 'Water Level', value: 0.85, contribution: 'HIGH' },
      { label: 'Slope Angle', value: 0.72, contribution: 'MODERATE' },
      { label: 'Historical Frequency', value: 0.65, contribution: 'MODERATE' },
    ],
    aiExplanation: 'PROTOTYPE ESTIMATE ONLY: Very high soil moisture (91%) combined with sustained high-intensity rainfall (112 mm/hr) and rapidly rising river level (3.4m) indicate conditions consistent with flash flood initiation. Steep slope angles in this terrain amplify surface runoff. Historical data shows this catchment has experienced 4 major flood events in the last decade. Risk score is 0.87 — CRITICAL threshold exceeded.',
    updatedAt: new Date(Date.now() - 60000).toISOString(),
  },
  VLG_002: {
    locationId: 'VLG_002', locationName: 'Gaurikund',
    riskScore: 0.74, riskLevel: 'HIGH',
    floodProbability: 0.74, confidence: 0.72,
    trend: 'INCREASING',
    rainfall: 94, soilMoisture: 83, waterLevel: 2.8, slopeRisk: 'HIGH',
    factors: [
      { label: 'Rainfall Intensity', value: 0.94, contribution: 'HIGH' },
      { label: 'Soil Moisture', value: 0.83, contribution: 'HIGH' },
      { label: 'Water Level', value: 0.70, contribution: 'MODERATE' },
    ],
    aiExplanation: 'PROTOTYPE ESTIMATE ONLY: Rising rainfall trend and saturated soil conditions indicate HIGH risk at Gaurikund. Downstream from critical zone.',
    updatedAt: new Date(Date.now() - 120000).toISOString(),
  },
  VLG_003: {
    locationId: 'VLG_003', locationName: 'Sonprayag',
    riskScore: 0.62, riskLevel: 'MODERATE',
    floodProbability: 0.62, confidence: 0.75,
    trend: 'INCREASING',
    rainfall: 72, soilMoisture: 68, waterLevel: 2.1, slopeRisk: 'MODERATE',
    factors: [
      { label: 'Rainfall Intensity', value: 0.72, contribution: 'MODERATE' },
      { label: 'Soil Moisture', value: 0.68, contribution: 'MODERATE' },
    ],
    aiExplanation: 'PROTOTYPE ESTIMATE ONLY: Moderate risk conditions developing. Monitoring recommended.',
    updatedAt: new Date(Date.now() - 180000).toISOString(),
  },
  VLG_004: {
    locationId: 'VLG_004', locationName: 'Tilwara',
    riskScore: 0.34, riskLevel: 'MODERATE',
    floodProbability: 0.34, confidence: 0.81,
    trend: 'STABLE',
    rainfall: 42, soilMoisture: 54, waterLevel: 1.4, slopeRisk: 'LOW',
    factors: [
      { label: 'Rainfall Intensity', value: 0.42, contribution: 'LOW' },
      { label: 'Soil Moisture', value: 0.54, contribution: 'MODERATE' },
    ],
    aiExplanation: 'PROTOTYPE ESTIMATE ONLY: Low to moderate risk. Soil moisture elevated from upstream runoff.',
    updatedAt: new Date(Date.now() - 240000).toISOString(),
  },
  VLG_005: {
    locationId: 'VLG_005', locationName: 'Agastyamuni',
    riskScore: 0.21, riskLevel: 'LOW',
    floodProbability: 0.21, confidence: 0.88,
    trend: 'STABLE',
    rainfall: 28, soilMoisture: 42, waterLevel: 1.1, slopeRisk: 'LOW',
    factors: [
      { label: 'Rainfall Intensity', value: 0.28, contribution: 'LOW' },
    ],
    aiExplanation: 'PROTOTYPE ESTIMATE ONLY: Low risk conditions. Standard monitoring protocol.',
    updatedAt: new Date(Date.now() - 300000).toISOString(),
  },
  VLG_006: {
    locationId: 'VLG_006', locationName: 'Lata Village',
    riskScore: 0.44, riskLevel: 'MODERATE',
    floodProbability: 0.44, confidence: 0.68,
    trend: 'INCREASING',
    rainfall: 55, soilMoisture: 61, waterLevel: 1.6, slopeRisk: 'MODERATE',
    factors: [],
    aiExplanation: 'PROTOTYPE ESTIMATE ONLY: Moderate risk. One sensor offline — data incomplete.',
    updatedAt: new Date(Date.now() - 360000).toISOString(),
  },
  VLG_007: {
    locationId: 'VLG_007', locationName: 'Mayali',
    riskScore: 0.28, riskLevel: 'LOW',
    floodProbability: 0.28, confidence: 0.82,
    trend: 'STABLE',
    rainfall: 32, soilMoisture: 48, waterLevel: 0.9, slopeRisk: 'LOW',
    factors: [],
    aiExplanation: 'PROTOTYPE ESTIMATE ONLY: Low risk. Stable conditions.',
    updatedAt: new Date(Date.now() - 420000).toISOString(),
  },
  VLG_008: {
    locationId: 'VLG_008', locationName: 'Chungthang',
    riskScore: 0.56, riskLevel: 'MODERATE',
    floodProbability: 0.56, confidence: 0.71,
    trend: 'INCREASING',
    rainfall: 68, soilMoisture: 71, waterLevel: 2.2, slopeRisk: 'MODERATE',
    factors: [],
    aiExplanation: 'PROTOTYPE ESTIMATE ONLY: Moderate risk in Teesta basin. Monsoon strengthening.',
    updatedAt: new Date(Date.now() - 480000).toISOString(),
  },
  VLG_009: {
    locationId: 'VLG_009', locationName: 'Mangan',
    riskScore: 0.38, riskLevel: 'MODERATE',
    floodProbability: 0.38, confidence: 0.76,
    trend: 'STABLE',
    rainfall: 44, soilMoisture: 56, waterLevel: 1.5, slopeRisk: 'LOW',
    factors: [],
    aiExplanation: 'PROTOTYPE ESTIMATE ONLY: Moderate risk. Standard monitoring.',
    updatedAt: new Date(Date.now() - 540000).toISOString(),
  },
  VLG_010: {
    locationId: 'VLG_010', locationName: 'Phaplu',
    riskScore: 0.18, riskLevel: 'LOW',
    floodProbability: 0.18, confidence: 0.85,
    trend: 'DECREASING',
    rainfall: 18, soilMoisture: 38, waterLevel: 0.7, slopeRisk: 'LOW',
    factors: [],
    aiExplanation: 'PROTOTYPE ESTIMATE ONLY: Low risk. Improving conditions.',
    updatedAt: new Date(Date.now() - 600000).toISOString(),
  },
};

export function generateRiskHistory(locationId: string, baseRisk: number): RiskHistoryPoint[] {
  const history: RiskHistoryPoint[] = [];
  const now = Date.now();
  for (let i = 23; i >= 0; i--) {
    const t = now - i * 3600000;
    const wave = Math.sin((23 - i) * 0.3) * 0.12;
    const score = Math.min(1, Math.max(0, baseRisk - (i * 0.005) + wave));
    history.push({
      timestamp: new Date(t).toISOString(),
      riskScore: parseFloat(score.toFixed(3)),
      riskLevel: scoreToRiskLevel(score),
      rainfall: Math.max(0, Math.round((baseRisk * 120) + wave * 20)),
      soilMoisture: Math.max(0, Math.round((baseRisk * 90) + wave * 5)),
      waterLevel: parseFloat(Math.max(0, ((baseRisk * 3.5) + wave)).toFixed(2)),
    });
  }
  return history;
}
