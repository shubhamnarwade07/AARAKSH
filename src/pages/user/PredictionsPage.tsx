import { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { predictionService } from '@/services/predictionService';
import { useDemoMode } from '@/contexts/DemoContext';
import { RiskBadge } from '@/components/ui/RiskBadge';
import { getRiskColor, formatRelativeTime } from '@/lib/utils';
import { MOCK_LOCATIONS, generateRiskHistory } from '@/data/mockLocations';
import { ROUTES } from '@/lib/constants';
import {
  FlaskConical, TrendingUp, TrendingDown, Minus, MapPin, Shield,
  ArrowLeft, CloudRain, Droplets, Waves, Mountain, Info, ArrowDown
} from 'lucide-react';
import {
  AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid,
  BarChart, Bar, Cell
} from 'recharts';

// ── Helpers ─────────────────────────────────────────────
function TrendIcon({ trend }: { trend: string }) {
  if (trend === 'INCREASING') return <TrendingUp className="h-4 w-4" style={{ color: '#ef4444' }} />;
  if (trend === 'DECREASING') return <TrendingDown className="h-4 w-4" style={{ color: '#22c55e' }} />;
  return <Minus className="h-4 w-4 text-slate-500" />;
}

const CARD = {
  background: 'rgba(15,41,24,0.5)',
  border: '1px solid rgba(255,255,255,0.07)',
  borderRadius: '12px',
  overflow: 'hidden' as const,
};
const CARD_HEADER = {
  display: 'flex' as const,
  alignItems: 'center' as const,
  justifyContent: 'space-between' as const,
  padding: '12px 16px',
  borderBottom: '1px solid rgba(255,255,255,0.06)',
};

// ── SVG Gauge ────────────────────────────────────────────
function RiskGauge({ probability, level }: { probability: number; level: string }) {
  const color = getRiskColor(level as any);
  const pct = Math.round(probability * 100);
  const circumference = 2 * Math.PI * 52;
  const strokeDash = (pct / 100) * circumference;
  return (
    <div className="flex flex-col items-center">
      <svg width="160" height="160" viewBox="0 0 140 140">
        {/* Track */}
        <circle cx="70" cy="70" r="52" fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="12" />
        {/* Risk arc */}
        <circle
          cx="70" cy="70" r="52" fill="none" stroke={color} strokeWidth="12"
          strokeDasharray={`${strokeDash} ${circumference}`}
          strokeLinecap="round"
          transform="rotate(-90 70 70)"
          style={{ transition: 'stroke-dasharray 0.9s cubic-bezier(0.4,0,0.2,1)', filter: `drop-shadow(0 0 8px ${color}60)` }}
        />
        {/* Inner glow ring */}
        <circle cx="70" cy="70" r="40" fill="none" stroke={`${color}12`} strokeWidth="1" />
        {/* Text */}
        <text x="70" y="63" textAnchor="middle" style={{ fontSize: '28px', fill: color, fontWeight: 'bold', fontFamily: 'Playfair Display, serif' }}>{pct}%</text>
        <text x="70" y="80" textAnchor="middle" style={{ fontSize: '8.5px', fill: '#64748b', letterSpacing: '1.5px' }}>FLOOD PROBABILITY</text>
        <text x="70" y="94" textAnchor="middle" style={{ fontSize: '9px', fill: color, fontWeight: '600', letterSpacing: '2px' }}>{level}</text>
      </svg>
    </div>
  );
}

// ── Causal Chain ─────────────────────────────────────────
function CausalChain({ rainfall, soilMoisture, waterLevel, riskLevel }: {
  rainfall: number; soilMoisture: number; waterLevel: number; riskLevel: string;
}) {
  const riskColor = getRiskColor(riskLevel as any);
  const steps = [
    { icon: <CloudRain className="h-5 w-5" />, label: 'Heavy Rainfall', value: `${rainfall} mm/hr`, color: '#06b6d4', pct: Math.min(1, rainfall / 120) },
    { icon: <Droplets className="h-5 w-5" />, label: 'High Soil Saturation', value: `${soilMoisture}%`, color: '#35a98d', pct: soilMoisture / 100 },
    { icon: <Waves className="h-5 w-5" />, label: 'Rising Water Response', value: `${waterLevel} m`, color: '#22866f', pct: Math.min(1, waterLevel / 4) },
    { icon: <Mountain className="h-5 w-5" />, label: 'Terrain Vulnerability', value: 'Complex', color: '#64748b', pct: 0.75 },
  ];
  return (
    <div className="space-y-1">
      {steps.map((step, i) => (
        <div key={i}>
          <div
            className="flex items-center gap-3 rounded-lg px-3 py-2.5"
            style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.05)' }}
          >
            <span style={{ color: step.color }}>{step.icon}</span>
            <div className="flex-1 min-w-0">
              <div className="flex justify-between text-xs mb-1.5">
                <span className="text-slate-300 font-medium">{step.label}</span>
                <span className="font-semibold" style={{ color: step.color }}>{step.value}</span>
              </div>
              <div className="h-1 rounded-full" style={{ background: 'rgba(255,255,255,0.06)' }}>
                <div
                  className="h-1 rounded-full transition-all duration-700"
                  style={{ width: `${step.pct * 100}%`, background: `linear-gradient(90deg, ${step.color}70, ${step.color})` }}
                />
              </div>
            </div>
          </div>
          {i < steps.length - 1 && (
            <div className="flex justify-center py-0.5">
              <ArrowDown className="h-4 w-4" style={{ color: 'rgba(53,169,141,0.35)' }} />
            </div>
          )}
        </div>
      ))}
      {/* Outcome */}
      <div className="flex justify-center py-0.5">
        <ArrowDown className="h-4 w-4" style={{ color: `${riskColor}50` }} />
      </div>
      <div
        className="rounded-lg px-4 py-3 text-center"
        style={{ background: `${riskColor}15`, border: `1px solid ${riskColor}40` }}
      >
        <p className="text-xs text-slate-500 uppercase tracking-wider mb-0.5">Predicted Outcome</p>
        <p className="text-base font-bold" style={{ color: riskColor }}>{riskLevel} FLOOD RISK</p>
      </div>
    </div>
  );
}

// ── Main Page ────────────────────────────────────────────
export function PredictionsPage() {
  const navigate = useNavigate();
  const { scenarioRiskData, currentScenario, selectedLocationId, setSelectedLocationId } = useDemoMode();

  const [localSelectedId, setLocalSelectedId] = useState(selectedLocationId ?? 'VLG_001');

  useEffect(() => {
    if (selectedLocationId) setLocalSelectedId(selectedLocationId);
  }, [selectedLocationId]);

  const handleLocationChange = (id: string) => {
    setLocalSelectedId(id);
    setSelectedLocationId(id);
  };

  const { data: prediction, isLoading, error, refetch } = useQuery({
    queryKey: ['prediction', localSelectedId, currentScenario.id],
    queryFn: async () => {
      const base = await predictionService.getPrediction(localSelectedId);
      if (!base) return null;
      const scenario = scenarioRiskData[localSelectedId];
      if (scenario) {
        return {
          ...base,
          riskScore: scenario.riskScore,
          riskLevel: scenario.riskLevel,
          floodProbability: scenario.floodProbability,
          trend: scenario.trend,
          features: scenario.factors.length > 0 ? scenario.factors : base.features,
        };
      }
      return base;
    },
    staleTime: 20000,
  });

  const selectedLocation = MOCK_LOCATIONS.find(l => l.id === localSelectedId);
  const riskHistory = generateRiskHistory(localSelectedId, prediction?.riskScore ?? 0.5);
  const trendData = riskHistory.slice(-12).map((h, i) => ({
    t: i === 11 ? 'Now' : `-${11 - i}h`,
    score: h.riskScore,
    rainfall: h.rainfall,
  }));

  const factorData = prediction?.features?.map(f => ({
    name: f.label.length > 20 ? f.label.slice(0, 19) + '…' : f.label,
    value: Math.round(f.value * 100),
  })) ?? [];

  const primaryColor = getRiskColor(prediction?.riskLevel ?? 'MODERATE');

  const scenarioData = scenarioRiskData[localSelectedId];

  return (
    <div className="p-4 md:p-6 space-y-4">
      {/* Demo banner */}
      <div
        className="flex items-center gap-2 rounded-lg px-3 py-2 text-xs"
        style={{ background: 'rgba(234,179,8,0.08)', border: '1px solid rgba(234,179,8,0.2)', color: '#ca8a04' }}
      >
        <span className="h-1.5 w-1.5 rounded-full bg-amber-500 flex-shrink-0" />
        <span className="font-semibold text-amber-600">PROTOTYPE / DEMO DATA</span>
        <span className="text-amber-700/70 hidden sm:block"> — Model Status: AWAITING VALIDATION. Not for operational use.</span>
      </div>

      {/* Location selector bar */}
      <div
        className="flex flex-wrap items-center gap-3 rounded-xl px-4 py-3"
        style={{ background: 'rgba(15,41,24,0.4)', border: '1px solid rgba(255,255,255,0.06)' }}
      >
        <MapPin className="h-4 w-4 text-emerald-400 flex-shrink-0" />
        <span className="text-xs text-slate-500 font-medium">Location:</span>
        <select
          value={localSelectedId}
          onChange={e => handleLocationChange(e.target.value)}
          className="flex-1 rounded-lg px-3 py-1.5 text-sm text-white focus:outline-none"
          style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', minWidth: '200px' }}
        >
          {MOCK_LOCATIONS.map(l => (
            <option key={l.id} value={l.id} style={{ background: '#060f0a' }}>
              {l.name} — {l.district}, {l.state}
            </option>
          ))}
        </select>
        <div className="flex items-center gap-1.5 text-xs">
          <span className="h-1.5 w-1.5 rounded-full animate-pulse" style={{ background: primaryColor }} />
          <span style={{ color: primaryColor }}>{currentScenario.label}</span>
        </div>
        <Link
          to={ROUTES.APP_RISK_MAP}
          className="flex items-center gap-1.5 text-xs font-medium transition-colors ml-auto"
          style={{ color: '#35a98d' }}
        >
          <ArrowLeft className="h-3.5 w-3.5" /> Map
        </Link>
      </div>

      {/* Scenario note */}
      <div className="flex items-center gap-2 text-xs text-slate-600">
        <FlaskConical className="h-3.5 w-3.5" />
        Scenario: <strong className="text-slate-400">{currentScenario.label}</strong>
        <span className="ml-auto rounded-full px-2 py-0.5 text-amber-700" style={{ background: 'rgba(234,179,8,0.1)', border: '1px solid rgba(234,179,8,0.2)' }}>
          PROTOTYPE ESTIMATE ONLY
        </span>
      </div>

      {isLoading ? (
        <div className="grid md:grid-cols-2 gap-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="h-64 skeleton rounded-xl" />
          ))}
        </div>
      ) : error ? (
        <div className="rounded-xl p-8 text-center" style={CARD}>
          <p className="text-slate-400 mb-3">Failed to load predictions</p>
          <button onClick={() => refetch()} className="text-sm text-emerald-400 hover:text-emerald-300">Retry</button>
        </div>
      ) : prediction ? (
        <>
          {/* Top row: gauge + causal chain */}
          <div className="grid md:grid-cols-2 gap-4">
            {/* Probability gauge */}
            <div style={CARD}>
              <div style={CARD_HEADER}>
                <div>
                  <p className="text-sm font-semibold text-white">{selectedLocation?.name ?? 'Location'}</p>
                  <p className="text-xs text-slate-500">{selectedLocation?.district}, {selectedLocation?.state}</p>
                </div>
                <RiskBadge level={prediction.riskLevel} size="md" />
              </div>
              <div className="p-5 flex flex-col items-center gap-4">
                <RiskGauge probability={prediction.floodProbability} level={prediction.riskLevel} />

                {/* Key metrics row */}
                <div className="grid grid-cols-3 gap-3 w-full">
                  {[
                    { label: 'Confidence', value: `${Math.round(prediction.confidence * 100)}%` },
                    { label: 'Trend', value: prediction.trend.charAt(0) + prediction.trend.slice(1).toLowerCase(), icon: <TrendIcon trend={prediction.trend} /> },
                    { label: 'Model', value: 'XGBoost' },
                  ].map((m, i) => (
                    <div
                      key={i}
                      className="rounded-lg p-2.5 text-center"
                      style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.06)' }}
                    >
                      <p className="text-[10px] text-slate-500 mb-1">{m.label}</p>
                      {m.icon
                        ? <div className="flex justify-center items-center gap-1 text-xs font-semibold text-slate-300">{m.icon} {m.value}</div>
                        : <p className="text-xs font-semibold text-slate-300">{m.value}</p>
                      }
                    </div>
                  ))}
                </div>

                {/* Model status warning */}
                <div
                  className="w-full rounded-lg px-3 py-2 text-center"
                  style={{ background: 'rgba(234,179,8,0.08)', border: '1px solid rgba(234,179,8,0.2)' }}
                >
                  <p className="text-xs font-semibold text-amber-600">MODEL STATUS: AWAITING VALIDATION</p>
                  <p className="text-[10px] text-amber-800 mt-0.5">Not calibrated against real-world flood events</p>
                </div>
              </div>
            </div>

            {/* Causal chain: Why is risk increasing? */}
            <div style={CARD}>
              <div style={CARD_HEADER}>
                <div>
                  <p className="text-sm font-semibold text-white">Why is Risk {prediction.trend === 'INCREASING' ? 'Increasing' : prediction.trend === 'DECREASING' ? 'Decreasing' : 'Stable'}?</p>
                  <p className="text-xs text-slate-500">Causal factor chain</p>
                </div>
                <Info className="h-4 w-4 text-slate-600" />
              </div>
              <div className="p-4">
                <CausalChain
                  rainfall={scenarioData?.rainfall ?? currentScenario.rainfall}
                  soilMoisture={scenarioData?.soilMoisture ?? currentScenario.soilMoisture}
                  waterLevel={scenarioData?.waterLevel ?? currentScenario.waterLevel}
                  riskLevel={prediction.riskLevel}
                />
              </div>
            </div>
          </div>

          {/* Bottom row: trend chart + factor bars + actions */}
          <div className="grid md:grid-cols-2 gap-4">
            {/* 12h Risk Trend */}
            <div style={CARD}>
              <div style={CARD_HEADER}>
                <span className="text-sm font-semibold text-white">12-Hour Risk Trend</span>
                <span className="text-[10px] text-slate-500">Simulated · {currentScenario.label}</span>
              </div>
              <div className="p-4">
                <div className="h-52">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={trendData}>
                      <defs>
                        <linearGradient id="predAreaGrad" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor={primaryColor} stopOpacity={0.3} />
                          <stop offset="95%" stopColor={primaryColor} stopOpacity={0} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                      <XAxis dataKey="t" tick={{ fontSize: 10, fill: '#64748b' }} tickLine={false} interval={2} />
                      <YAxis domain={[0, 1]} tickFormatter={v => `${(v * 100).toFixed(0)}%`} tick={{ fontSize: 9, fill: '#64748b' }} width={36} />
                      <Tooltip
                        contentStyle={{ background: 'rgba(6,15,10,0.95)', border: '1px solid rgba(53,169,141,0.2)', borderRadius: 8, color: '#e2e8f0', fontSize: 12 }}
                        formatter={(v: unknown) => [`${((v as number) * 100).toFixed(0)}%`, 'Risk Score']}
                      />
                      <Area type="monotone" dataKey="score" stroke={primaryColor} strokeWidth={2.5} fill="url(#predAreaGrad)" dot={false} />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>

            {/* Contributing factors + AI explanation + actions */}
            <div className="flex flex-col gap-4">
              {/* Factor bars */}
              {factorData.length > 0 && (
                <div style={CARD}>
                  <div style={CARD_HEADER}>
                    <span className="text-sm font-semibold text-white">Risk Contribution Analysis</span>
                    <span className="text-[10px] text-slate-600">Prototype model output</span>
                  </div>
                  <div className="p-4">
                    <div className="h-36">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={factorData} layout="vertical">
                          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" horizontal={false} />
                          <XAxis type="number" domain={[0, 100]} tickFormatter={v => `${v}%`} tick={{ fontSize: 9, fill: '#64748b' }} />
                          <YAxis type="category" dataKey="name" tick={{ fontSize: 9, fill: '#94a3b8' }} width={110} />
                          <Tooltip
                            contentStyle={{ background: 'rgba(6,15,10,0.95)', border: '1px solid rgba(53,169,141,0.2)', borderRadius: 8, color: '#e2e8f0', fontSize: 12 }}
                            formatter={(v: unknown) => [`${v as number}%`, 'Contribution']}
                          />
                          <Bar dataKey="value" radius={[0, 4, 4, 0]}>
                            {factorData.map((_, i) => <Cell key={i} fill={primaryColor} fillOpacity={0.75 - i * 0.1} />)}
                          </Bar>
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  </div>
                </div>
              )}

              {/* AI explanation */}
              <div style={CARD}>
                <div style={CARD_HEADER}>
                  <span className="text-sm font-semibold text-white">AI Risk Explanation</span>
                  <span className="text-[10px] text-slate-600">Prototype</span>
                </div>
                <div className="p-4 space-y-3">
                  <p className="text-xs text-slate-400 leading-relaxed">
                    {prediction.aiExplanation ?? 'No explanation available for this location.'}
                  </p>
                  <p className="text-[10px] text-slate-600">Generated: {formatRelativeTime(prediction.generatedAt)}</p>

                  {/* Cross-page navigation */}
                  <div className="flex flex-col gap-2 pt-2" style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}>
                    <button
                      onClick={() => navigate(ROUTES.APP_RISK_MAP)}
                      className="flex items-center justify-center gap-2 w-full rounded-lg px-4 py-2 text-sm font-medium text-slate-300 hover:text-white transition-colors"
                      style={{ border: '1px solid rgba(255,255,255,0.08)', background: 'rgba(255,255,255,0.03)' }}
                    >
                      <MapPin className="h-4 w-4" /> View on Risk Map
                    </button>
                    <button
                      onClick={() => navigate(ROUTES.APP_SAFETY_CENTRE)}
                      className="flex items-center justify-center gap-2 w-full rounded-lg px-4 py-2 text-sm font-semibold text-white transition-all hover:brightness-110"
                      style={{ background: 'linear-gradient(135deg, #276942, #22866f)' }}
                    >
                      <Shield className="h-4 w-4" /> Safety Guidance
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </>
      ) : null}
    </div>
  );
}
