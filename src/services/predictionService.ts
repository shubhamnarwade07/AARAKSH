import { Prediction } from '@/types';
import { MOCK_RISK_DATA } from '@/data/mockLocations';
import { scoreToRiskLevel } from '@/lib/utils';

// Future: replace with ML model API endpoint GET /predictions/{locationId}
export const predictionService = {
  async getPrediction(locationId: string): Promise<Prediction | null> {
    await delay(400);
    const risk = MOCK_RISK_DATA[locationId];
    if (!risk) return null;

    // Build a deterministic timeline from current risk
    const score = risk.riskScore;
    const timeline = [
      { label: 'Now', riskScore: score, riskLevel: scoreToRiskLevel(score) },
      { label: '+1h', riskScore: Math.min(1, score + 0.04), riskLevel: scoreToRiskLevel(Math.min(1, score + 0.04)) },
      { label: '+3h', riskScore: Math.min(1, score + 0.07), riskLevel: scoreToRiskLevel(Math.min(1, score + 0.07)) },
      { label: '+6h', riskScore: Math.min(1, score + 0.03), riskLevel: scoreToRiskLevel(Math.min(1, score + 0.03)) },
      { label: '+12h', riskScore: Math.max(0, score - 0.05), riskLevel: scoreToRiskLevel(Math.max(0, score - 0.05)) },
    ];

    return {
      id: `PRED_${locationId}_${Date.now()}`,
      locationId,
      locationName: risk.locationName,
      riskScore: risk.riskScore,
      riskLevel: risk.riskLevel,
      floodProbability: risk.floodProbability,
      confidence: risk.confidence,
      trend: risk.trend,
      predictionHorizon: 'Next monitoring window (Prototype estimate)',
      modelVersion: 'XGBoost v0.1.0-prototype',
      features: risk.factors,
      timeline,
      aiExplanation: risk.aiExplanation,
      generatedAt: new Date().toISOString(),
      isPrototype: true,
    };
  },
};

function delay(ms: number) {
  return new Promise(r => setTimeout(r, ms));
}
