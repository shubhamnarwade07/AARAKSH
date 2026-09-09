import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';
import { DemoScenarioId, DemoScenario, RiskData } from '@/types';
import { DEMO_SCENARIOS, DEMO_MODE } from '@/lib/constants';
import { MOCK_RISK_DATA } from '@/data/mockLocations';

interface DemoContextValue {
  isDemoMode: boolean;
  currentScenario: DemoScenario;
  setScenario: (id: DemoScenarioId) => void;
  scenarioRiskData: Record<string, RiskData>;
  isSimulating: boolean;
  toggleSimulation: () => void;
  selectedLocationId: string | null;
  setSelectedLocationId: (id: string | null) => void;
}

const DemoContext = createContext<DemoContextValue | null>(null);

// Scale factors per location so scenario changes look realistic across the network
const LOCATION_SCALE: Record<string, number> = {
  VLG_001: 1.00,  // Rambara — primary critical zone
  VLG_002: 0.87,  // Gaurikund
  VLG_003: 0.71,  // Sonprayag
  VLG_004: 0.42,  // Tilwara — lower elevation, less impact
  VLG_005: 0.25,  // Agastyamuni — town, more protected
  VLG_006: 0.55,  // Lata Village
  VLG_007: 0.33,  // Mayali
  VLG_008: 0.65,  // Chungthang — different catchment
  VLG_009: 0.48,  // Mangan
  VLG_010: 0.22,  // Phaplu
};

function scoreToRiskLevel(score: number): RiskData['riskLevel'] {
  if (score < 0.30) return 'LOW';
  if (score < 0.60) return 'MODERATE';
  if (score < 0.80) return 'HIGH';
  return 'CRITICAL';
}

function applyScenarioToRiskData(
  baseData: Record<string, RiskData>,
  scenario: DemoScenario
): Record<string, RiskData> {
  const updated: Record<string, RiskData> = {};
  for (const [id, base] of Object.entries(baseData)) {
    const scale = LOCATION_SCALE[id] ?? 0.5;
    const score = Math.min(1, Math.max(0, scenario.riskScore * scale));
    const level = scoreToRiskLevel(score);
    const rainfall = Math.round(scenario.rainfall * scale);
    const soilMoisture = Math.round(Math.min(99, scenario.soilMoisture * scale + 20));
    const waterLevel = parseFloat((scenario.waterLevel * scale).toFixed(1));
    updated[id] = {
      ...base,
      riskScore: parseFloat(score.toFixed(2)),
      riskLevel: level,
      floodProbability: parseFloat(score.toFixed(2)),
      trend: score > 0.55 ? 'INCREASING' : score < 0.25 ? 'DECREASING' : 'STABLE',
      rainfall,
      soilMoisture,
      waterLevel,
      updatedAt: new Date().toISOString(),
    };
  }
  return updated;
}

export function DemoProvider({ children }: { children: React.ReactNode }) {
  const [currentScenarioId, setCurrentScenarioId] = useState<DemoScenarioId>('CRITICAL');
  const [isSimulating, setIsSimulating] = useState(false);
  const [selectedLocationId, setSelectedLocationId] = useState<string | null>('VLG_001');
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const currentScenario = DEMO_SCENARIOS[currentScenarioId];
  const scenarioRiskData = applyScenarioToRiskData(MOCK_RISK_DATA, currentScenario);

  const setScenario = useCallback((id: DemoScenarioId) => {
    setCurrentScenarioId(id);
  }, []);

  const toggleSimulation = useCallback(() => {
    setIsSimulating(prev => !prev);
  }, []);

  useEffect(() => {
    if (!isSimulating) {
      if (intervalRef.current) clearInterval(intervalRef.current);
      return;
    }
    const scenarios: DemoScenarioId[] = ['NORMAL', 'HEAVY_RAIN', 'RISING_RISK', 'CRITICAL'];
    let idx = 0;
    intervalRef.current = setInterval(() => {
      idx = (idx + 1) % scenarios.length;
      setCurrentScenarioId(scenarios[idx]);
    }, 5000);
    return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
  }, [isSimulating]);

  const value: DemoContextValue = {
    isDemoMode: DEMO_MODE,
    currentScenario,
    setScenario,
    scenarioRiskData,
    isSimulating,
    toggleSimulation,
    selectedLocationId,
    setSelectedLocationId,
  };

  return <DemoContext.Provider value={value}>{children}</DemoContext.Provider>;
}

export function useDemoMode(): DemoContextValue {
  const ctx = useContext(DemoContext);
  if (!ctx) throw new Error('useDemoMode must be used within DemoProvider');
  return ctx;
}
