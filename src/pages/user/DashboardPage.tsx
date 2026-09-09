import { useNavigate, Link } from 'react-router-dom';
import { CloudRain, Droplets, Waves, Mountain, AlertTriangle, TrendingUp, TrendingDown, Minus, ArrowRight, Map, Activity } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { riskService } from '@/services/riskService';
import { alertService } from '@/services/alertService';
import { useDemoMode } from '@/contexts/DemoContext';
import { RiskBadge } from '@/components/ui/RiskBadge';
import { Skeleton } from '@/components/ui/Skeleton';
import { getRiskColor, formatRelativeTime } from '@/lib/utils';
import { RiskData, RiskLevel } from '@/types';
import {
  ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid,
  PieChart, Pie, Cell
} from 'recharts';
import { MOCK_LOCATIONS, generateRiskHistory } from '@/data/mockLocations';
import { ROUTES } from '@/lib/constants';

// ── Helpers ─────────────────────────────────────────────
function TrendIcon({ trend }: { trend: 'INCREASING' | 'STABLE' | 'DECREASING' }) {
  if (trend === 'INCREASING') return <TrendingUp className="h-3.5 w-3.5" style={{ color: '#ef4444' }} />;
  if (trend === 'DECREASING') return <TrendingDown className="h-3.5 w-3.5" style={{ color: '#22c55e' }} />;
  return <Minus className="h-3.5 w-3.5 text-slate-500" />;
}

const RISK_COLORS: Record<RiskLevel, string> = {
  LOW: '#22c55e', MODERATE: '#eab308', HIGH: '#f97316', CRITICAL: '#ef4444'
};

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

// ── Environmental Signal Card ────────────────────────────
function EnvSignal({
  icon, label, value, unit, pct, color, arrow,
}: {
  icon: React.ReactNode; label: string; value: number; unit: string; pct: number; color: string; arrow?: 'up' | 'stable';
}) {
  return (
    <div
      className="rounded-xl p-4 flex flex-col gap-2"
      style={{ background: 'rgba(15,41,24,0.4)', border: '1px solid rgba(255,255,255,0.06)' }}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span style={{ color }}>{icon}</span>
          <span className="text-xs text-slate-400">{label}</span>
        </div>
        {arrow && (
          <span className="text-[10px] font-semibold" style={{ color: arrow === 'up' ? '#f97316' : '#94a3b8' }}>
            {arrow === 'up' ? '↑' : '→'}
          </span>
        )}
      </div>
      <div className="flex items-baseline gap-1">
        <span className="text-2xl font-bold text-white" style={{ fontFamily: 'Playfair Display, serif' }}>{value}</span>
        <span className="text-xs text-slate-500">{unit}</span>
      </div>
      <div className="h-1.5 rounded-full" style={{ background: 'rgba(255,255,255,0.08)' }}>
        <div
          className="h-1.5 rounded-full transition-all duration-700"
          style={{ width: `${Math.min(100, pct * 100)}%`, background: `linear-gradient(90deg, ${color}88, ${color})` }}
        />
      </div>
    </div>
  );
}

// ── Causal Flow Arrow ────────────────────────────────────
function FlowArrow() {
  return (
    <div className="flex items-center justify-center py-0.5">
      <svg width="16" height="20" viewBox="0 0 16 20">
        <line x1="8" y1="0" x2="8" y2="14" stroke="rgba(53,169,141,0.4)" strokeWidth="1.5" strokeDasharray="3 2" />
        <polygon points="4,12 8,20 12,12" fill="rgba(53,169,141,0.3)" />
      </svg>
    </div>
  );
}

// ── Main Component ───────────────────────────────────────
export function DashboardPage() {
  const navigate = useNavigate();
  const { scenarioRiskData, currentScenario, setScenario, isSimulating, toggleSimulation, setSelectedLocationId } = useDemoMode();

  const { data: allRisk, isLoading: riskLoading } = useQuery({
    queryKey: ['risk', 'all'],
    queryFn: () => riskService.getAllRisk(),
    staleTime: 30000,
  });

  const { data: alerts, isLoading: alertsLoading } = useQuery({
    queryKey: ['alerts'],
    queryFn: () => alertService.getAlerts(),
    staleTime: 15000,
  });

  const riskData: RiskData[] = allRisk
    ? allRisk.map(r => scenarioRiskData[r.locationId] ?? r)
    : [];

  const activeAlerts = alerts?.filter(a => a.status === 'ACTIVE') ?? [];
  const highRisk = riskData.filter(r => r.riskLevel === 'HIGH' || r.riskLevel === 'CRITICAL');

  const riskDist = (['LOW', 'MODERATE', 'HIGH', 'CRITICAL'] as RiskLevel[]).map(level => ({
    name: level,
    value: riskData.filter(r => r.riskLevel === level).length,
    color: RISK_COLORS[level],
  })).filter(d => d.value > 0);

  // Risk evolution chart
  const trendHistory = generateRiskHistory('VLG_001', currentScenario.riskScore);
  const trendData = trendHistory.slice(-12).map((h, i) => ({
    t: i === 11 ? 'Now' : `-${11 - i}h`,
    score: h.riskScore,
    rainfall: h.rainfall,
  }));

  const primaryRiskColor = getRiskColor(currentScenario.riskLevel);

  function handleLocationClick(locationId: string) {
    setSelectedLocationId(locationId);
    navigate(ROUTES.APP_PREDICTIONS);
  }
  function handleAlertClick() {
    navigate(ROUTES.APP_ALERTS);
  }

  return (
    <div className="flex flex-col gap-4 p-4 md:p-6">
      {/* Demo banner */}
      <div
        className="flex items-center gap-2 rounded-lg px-3 py-2 text-xs"
        style={{ background: 'rgba(234,179,8,0.08)', border: '1px solid rgba(234,179,8,0.2)', color: '#ca8a04' }}
      >
        <span className="h-1.5 w-1.5 rounded-full bg-amber-500 flex-shrink-0" />
        <span className="font-semibold text-amber-600">PROTOTYPE / DEMO DATA</span>
        <span className="text-amber-700/70 hidden sm:block"> — All values are simulated. Not for operational use.</span>
      </div>

      {/* Scenario selector */}
      <div
        className="flex flex-wrap items-center gap-2 rounded-xl px-4 py-3"
        style={{ background: 'rgba(15,41,24,0.4)', border: '1px solid rgba(255,255,255,0.06)' }}
      >
        <span className="text-xs text-slate-500 font-semibold uppercase tracking-wider">Demo Scenario:</span>
        {([
          { id: 'NORMAL', label: 'Normal', color: '#22c55e' },
          { id: 'HEAVY_RAIN', label: 'Heavy Rain', color: '#eab308' },
          { id: 'RISING_RISK', label: 'Rising Risk', color: '#f97316' },
          { id: 'CRITICAL', label: 'Critical', color: '#ef4444' },
        ] as const).map(s => (
          <button
            key={s.id}
            onClick={() => setScenario(s.id)}
            className="flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-medium transition-all"
            style={{
              background: currentScenario.id === s.id ? `${s.color}20` : 'rgba(255,255,255,0.04)',
              border: `1px solid ${currentScenario.id === s.id ? `${s.color}50` : 'rgba(255,255,255,0.08)'}`,
              color: currentScenario.id === s.id ? s.color : '#64748b',
            }}
          >
            {currentScenario.id === s.id && (
              <span className="h-1.5 w-1.5 rounded-full animate-pulse" style={{ background: s.color }} />
            )}
            {s.label}
          </button>
        ))}
        <button
          onClick={toggleSimulation}
          className="ml-auto flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-medium transition-all"
          style={{
            background: isSimulating ? 'rgba(249,115,22,0.15)' : 'rgba(255,255,255,0.04)',
            border: `1px solid ${isSimulating ? 'rgba(249,115,22,0.4)' : 'rgba(255,255,255,0.08)'}`,
            color: isSimulating ? '#f97316' : '#64748b',
          }}
        >
          <span className={`h-1.5 w-1.5 rounded-full ${isSimulating ? 'animate-pulse' : ''}`}
            style={{ background: isSimulating ? '#f97316' : '#64748b' }} />
          {isSimulating ? 'Stop SIH Demo' : 'Run SIH Demo'}
        </button>
      </div>

      {/* Top row: summary stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[
          { label: 'Monitored Locations', value: MOCK_LOCATIONS.length.toString(), sub: 'Demo dataset', color: '#35a98d', icon: <Map className="h-4 w-4" /> },
          { label: 'High / Critical', value: highRisk.length.toString(), sub: 'Active threat', color: '#ef4444', icon: <AlertTriangle className="h-4 w-4" /> },
          { label: 'Active Alerts', value: activeAlerts.length.toString(), sub: 'Require action', color: '#f97316', icon: <Activity className="h-4 w-4" /> },
          { label: 'Risk Level', value: currentScenario.riskLevel, sub: currentScenario.label, color: primaryRiskColor, icon: <TrendingUp className="h-4 w-4" /> },
        ].map((stat, i) => (
          <div
            key={i}
            className="rounded-xl px-4 py-4"
            style={{ background: 'rgba(15,41,24,0.5)', border: '1px solid rgba(255,255,255,0.07)' }}
          >
            <div className="flex items-start justify-between mb-2">
              <span style={{ color: stat.color }}>{stat.icon}</span>
              <span className="text-[10px] text-slate-600 uppercase tracking-wider">{stat.sub}</span>
            </div>
            <div className="text-2xl font-bold text-white" style={{ fontFamily: 'Playfair Display, serif', color: stat.color }}>{stat.value}</div>
            <div className="text-xs text-slate-500 mt-1">{stat.label}</div>
          </div>
        ))}
      </div>

      {/* Middle row: env signals + risk map preview + risk evolution */}
      <div className="grid lg:grid-cols-3 gap-4">

        {/* Environmental Signal Chain */}
        <div style={CARD}>
          <div style={CARD_HEADER}>
            <span className="text-sm font-semibold text-white">Environmental Signals</span>
            <span className="text-[10px] text-slate-500 rounded-full px-2 py-0.5" style={{ background: 'rgba(255,255,255,0.05)' }}>
              {currentScenario.label}
            </span>
          </div>
          <div className="p-4 space-y-1">
            <EnvSignal
              icon={<CloudRain className="h-4 w-4" />}
              label="Rainfall"
              value={currentScenario.rainfall}
              unit="mm/hr"
              pct={currentScenario.rainfall / 130}
              color="#06b6d4"
              arrow={currentScenario.rainfall > 40 ? 'up' : 'stable'}
            />
            <FlowArrow />
            <EnvSignal
              icon={<Droplets className="h-4 w-4" />}
              label="Soil Moisture"
              value={currentScenario.soilMoisture}
              unit="%"
              pct={currentScenario.soilMoisture / 100}
              color="#35a98d"
              arrow={currentScenario.soilMoisture > 60 ? 'up' : 'stable'}
            />
            <FlowArrow />
            <EnvSignal
              icon={<Waves className="h-4 w-4" />}
              label="Water Level"
              value={currentScenario.waterLevel}
              unit="m"
              pct={currentScenario.waterLevel / 4}
              color="#22866f"
              arrow={currentScenario.waterLevel > 2 ? 'up' : 'stable'}
            />
            <FlowArrow />
            <div
              className="rounded-xl p-3 flex items-center justify-between"
              style={{ background: `${primaryRiskColor}12`, border: `1px solid ${primaryRiskColor}35` }}
            >
              <div className="flex items-center gap-2">
                <Mountain className="h-4 w-4" style={{ color: primaryRiskColor }} />
                <span className="text-xs text-slate-400">Terrain Vulnerability</span>
              </div>
              <span className="text-sm font-bold" style={{ color: primaryRiskColor }}>
                {currentScenario.riskLevel === 'CRITICAL' ? 'High' : currentScenario.riskLevel === 'HIGH' ? 'High' : currentScenario.riskLevel === 'MODERATE' ? 'Moderate' : 'Low'}
              </span>
            </div>
            <FlowArrow />
            {/* Risk result */}
            <div
              className="rounded-xl p-3 text-center"
              style={{ background: `${primaryRiskColor}18`, border: `1px solid ${primaryRiskColor}45` }}
            >
              <p className="text-[10px] text-slate-500 uppercase tracking-wider mb-1">Flood Risk</p>
              <p className="text-xl font-bold" style={{ color: primaryRiskColor, fontFamily: 'Playfair Display, serif' }}>
                {Math.round(currentScenario.riskScore * 100)}%
              </p>
              <p className="text-xs font-semibold mt-0.5" style={{ color: primaryRiskColor }}>{currentScenario.riskLevel}</p>
            </div>
          </div>
        </div>

        {/* Risk Evolution Chart */}
        <div style={CARD}>
          <div style={CARD_HEADER}>
            <span className="text-sm font-semibold text-white">Risk Evolution</span>
            <span className="text-[10px] text-slate-500">12-hour trend · Rambara</span>
          </div>
          <div className="p-4">
            <div className="h-56">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={trendData}>
                  <defs>
                    <linearGradient id="riskGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor={primaryRiskColor} stopOpacity={0.35} />
                      <stop offset="95%" stopColor={primaryRiskColor} stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="rainGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.25} />
                      <stop offset="95%" stopColor="#06b6d4" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                  <XAxis dataKey="t" tick={{ fontSize: 10, fill: '#64748b' }} tickLine={false} interval={2} />
                  <YAxis yAxisId="score" domain={[0, 1]} hide />
                  <YAxis yAxisId="rain" orientation="right" domain={[0, 150]} tick={{ fontSize: 9, fill: '#64748b' }} tickLine={false} width={32} />
                  <Tooltip
                    contentStyle={{ background: 'rgba(6,15,10,0.95)', border: '1px solid rgba(53,169,141,0.2)', borderRadius: 8, color: '#e2e8f0', fontSize: 12 }}
                    formatter={(v: unknown, name: unknown) => [
                      name === 'score' ? `${((v as number) * 100).toFixed(0)}%` : `${v as number} mm/hr`,
                      name === 'score' ? 'Risk Score' : 'Rainfall'
                    ]}
                  />
                  <Area yAxisId="score" type="monotone" dataKey="score" stroke={primaryRiskColor} strokeWidth={2.5} fill="url(#riskGrad)" dot={false} />
                  <Area yAxisId="rain" type="monotone" dataKey="rainfall" stroke="#06b6d4" strokeWidth={1.5} fill="url(#rainGrad)" dot={false} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
            {/* Legend */}
            <div className="flex items-center gap-4 mt-3">
              <div className="flex items-center gap-1.5"><span className="h-2 w-4 rounded" style={{ background: primaryRiskColor }} /><span className="text-[10px] text-slate-500">Risk Score</span></div>
              <div className="flex items-center gap-1.5"><span className="h-2 w-4 rounded bg-cyan-500" /><span className="text-[10px] text-slate-500">Rainfall</span></div>
              <span className="ml-auto text-[10px] text-slate-600">Simulated</span>
            </div>
          </div>
        </div>

        {/* Risk Distribution + High Risk Locations */}
        <div className="flex flex-col gap-4">
          {/* Pie */}
          <div style={{ ...CARD, flex: '0 0 auto' }}>
            <div style={CARD_HEADER}>
              <span className="text-sm font-semibold text-white">Risk Distribution</span>
              <span className="text-[10px] text-slate-500">{riskData.length} locations</span>
            </div>
            <div className="p-4">
              <div className="flex items-center gap-4">
                <div className="h-24 w-24 flex-shrink-0">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie data={riskDist} cx="50%" cy="50%" innerRadius={24} outerRadius={40} dataKey="value" paddingAngle={2}>
                        {riskDist.map((entry, i) => <Cell key={i} fill={entry.color} />)}
                      </Pie>
                      <Tooltip contentStyle={{ background: 'rgba(6,15,10,0.95)', border: '1px solid rgba(53,169,141,0.2)', borderRadius: 8, color: '#e2e8f0', fontSize: 11 }} />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                <div className="space-y-1.5 flex-1">
                  {(['CRITICAL', 'HIGH', 'MODERATE', 'LOW'] as RiskLevel[]).map(level => {
                    const cnt = riskData.filter(r => r.riskLevel === level).length;
                    return (
                      <div key={level} className="flex items-center justify-between text-xs">
                        <div className="flex items-center gap-1.5">
                          <span className="h-2 w-2 rounded-full" style={{ background: RISK_COLORS[level] }} />
                          <span className="text-slate-400">{level}</span>
                        </div>
                        <span className="font-semibold" style={{ color: RISK_COLORS[level] }}>{cnt}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>

          {/* Quick nav */}
          <div style={{ ...CARD, flex: '1 1 auto' }}>
            <div style={CARD_HEADER}>
              <span className="text-sm font-semibold text-white">Quick Actions</span>
            </div>
            <div className="p-3 space-y-2">
              {[
                { to: ROUTES.APP_RISK_MAP, label: 'Open Risk Map', color: '#35a98d' },
                { to: ROUTES.APP_ALERTS, label: `View ${activeAlerts.length} Active Alerts`, color: '#ef4444' },
                { to: ROUTES.APP_PREDICTIONS, label: 'AI Predictions', color: '#f97316' },
                { to: ROUTES.APP_SAFETY_CENTRE, label: 'Safety Centre', color: '#06b6d4' },
              ].map(link => (
                <Link
                  key={link.to}
                  to={link.to}
                  className="flex items-center justify-between rounded-lg px-3 py-2.5 text-sm font-medium text-white hover:bg-white/6 transition-colors"
                  style={{ border: `1px solid ${link.color}25` }}
                >
                  {link.label}
                  <ArrowRight className="h-3.5 w-3.5" style={{ color: link.color }} />
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Bottom row: locations table + alerts */}
      <div className="grid lg:grid-cols-2 gap-4">
        {/* Location Risk Overview */}
        <div style={CARD}>
          <div style={CARD_HEADER}>
            <span className="text-sm font-semibold text-white">Regional Risk Overview</span>
            <Link to={ROUTES.APP_LOCATIONS} className="text-xs text-emerald-400 hover:text-emerald-300 font-medium transition-colors">View All →</Link>
          </div>
          <div>
            {riskLoading ? (
              <div className="p-4 space-y-2">{Array.from({ length: 5 }).map((_, i) => <div key={i} className="h-10 skeleton rounded-lg" />)}</div>
            ) : (
              <table className="w-full text-xs">
                <thead>
                  <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
                    {['Location', 'Risk', 'Score', 'Trend'].map(h => (
                      <th key={h} className="px-4 py-2.5 text-left font-medium" style={{ color: '#64748b' }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {riskData.sort((a, b) => b.riskScore - a.riskScore).slice(0, 8).map(r => (
                    <tr
                      key={r.locationId}
                      className="hover:bg-white/4 cursor-pointer transition-colors group"
                      onClick={() => handleLocationClick(r.locationId)}
                      style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}
                    >
                      <td className="px-4 py-3">
                        <p className="font-medium text-slate-200 group-hover:text-emerald-400 transition-colors">{r.locationName}</p>
                        <p className="text-slate-600">{MOCK_LOCATIONS.find(l => l.id === r.locationId)?.district}</p>
                      </td>
                      <td className="px-4 py-3">
                        <span
                          className="rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase"
                          style={{ background: `${RISK_COLORS[r.riskLevel]}18`, color: RISK_COLORS[r.riskLevel], border: `1px solid ${RISK_COLORS[r.riskLevel]}40` }}
                        >{r.riskLevel}</span>
                      </td>
                      <td className="px-4 py-3 font-semibold" style={{ color: RISK_COLORS[r.riskLevel] }}>
                        {Math.round(r.riskScore * 100)}%
                      </td>
                      <td className="px-4 py-3">
                        <TrendIcon trend={r.trend} />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>

        {/* Recent Alerts */}
        <div style={CARD}>
          <div style={CARD_HEADER}>
            <span className="text-sm font-semibold text-white">Recent Alerts</span>
            <Link to={ROUTES.APP_ALERTS} className="text-xs text-emerald-400 hover:text-emerald-300 font-medium transition-colors">View All →</Link>
          </div>
          <div>
            {alertsLoading ? (
              <div className="p-4 space-y-2">{Array.from({ length: 4 }).map((_, i) => <div key={i} className="h-16 skeleton rounded-lg" />)}</div>
            ) : activeAlerts.length === 0 ? (
              <div className="p-8 text-center text-slate-600 text-sm">No active alerts</div>
            ) : (
              <div className="divide-y" style={{ borderColor: 'rgba(255,255,255,0.04)' }}>
                {activeAlerts.slice(0, 6).map(alert => {
                  const sevColor = alert.severity === 'CRITICAL' ? '#ef4444' : alert.severity === 'HIGH' ? '#f97316' : alert.severity === 'MODERATE' ? '#eab308' : '#06b6d4';
                  return (
                    <div
                      key={alert.id}
                      className="flex items-start gap-3 px-4 py-3.5 hover:bg-white/4 cursor-pointer transition-colors"
                      onClick={handleAlertClick}
                    >
                      <div className="mt-1 flex-shrink-0">
                        <span className="h-2.5 w-2.5 rounded-full block" style={{ background: sevColor }} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-0.5">
                          <span className="text-xs font-semibold text-slate-200">{alert.locationName}</span>
                          <span
                            className="rounded-full px-1.5 py-0.5 text-[10px] font-bold uppercase"
                            style={{ background: `${sevColor}18`, color: sevColor }}
                          >{alert.severity}</span>
                        </div>
                        <p className="text-xs text-slate-500 truncate">{alert.title}</p>
                        <p className="text-[10px] text-slate-700 mt-0.5">{formatRelativeTime(alert.createdAt)}</p>
                      </div>
                      <ArrowRight className="h-3.5 w-3.5 text-slate-700 mt-1 flex-shrink-0" />
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
