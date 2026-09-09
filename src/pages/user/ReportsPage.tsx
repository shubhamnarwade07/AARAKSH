import { useDemoMode } from '@/contexts/DemoContext';
import { useQuery } from '@tanstack/react-query';
import { riskService } from '@/services/riskService';
import { alertService } from '@/services/alertService';
import { getRiskColor } from '@/lib/utils';
import { MOCK_LOCATIONS } from '@/data/mockLocations';
import { FileText, TrendingUp, AlertTriangle, MapPin, Download } from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, AreaChart, Area } from 'recharts';
import { RiskLevel } from '@/types';

const RISK_COLORS: Record<RiskLevel, string> = { LOW: '#22c55e', MODERATE: '#eab308', HIGH: '#f97316', CRITICAL: '#ef4444' };

const CARD_STYLE = {
  background: 'rgba(15,41,24,0.5)',
  border: '1px solid rgba(255,255,255,0.07)',
  borderRadius: '12px',
  overflow: 'hidden' as const,
};
const HEADER_STYLE = {
  borderBottom: '1px solid rgba(255,255,255,0.06)',
  padding: '12px 16px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
};

export function ReportsPage() {
  const { scenarioRiskData, currentScenario } = useDemoMode();

  const { data: allRisk } = useQuery({ queryKey: ['risk','all'], queryFn: () => riskService.getAllRisk() });
  const { data: alerts } = useQuery({ queryKey: ['alerts'], queryFn: () => alertService.getAlerts() });

  const riskData = (allRisk ?? []).map(r => scenarioRiskData[r.locationId] ?? r);
  const dist = (['LOW','MODERATE','HIGH','CRITICAL'] as RiskLevel[]).map(level => ({
    name: level, value: riskData.filter(r => r.riskLevel === level).length, color: RISK_COLORS[level]
  }));

  const alertsActive = (alerts ?? []).filter(a => a.status === 'ACTIVE');
  const alertsAck = (alerts ?? []).filter(a => a.status === 'ACKNOWLEDGED');
  const alertsRes = (alerts ?? []).filter(a => a.status === 'RESOLVED');

  const topRisk = [...riskData].sort((a, b) => b.riskScore - a.riskScore).slice(0, 5);

  const trendData = Array.from({ length: 8 }, (_, i) => ({
    h: `${i * 3}h`,
    score: parseFloat((currentScenario.riskScore * (0.6 + i * 0.06 + Math.sin(i) * 0.04)).toFixed(2)),
    rainfall: Math.round(currentScenario.rainfall * (0.5 + i * 0.07)),
  }));

  return (
    <div className="p-4 md:p-6 space-y-4">
      {/* Demo banner */}
      <div className="flex items-center gap-2 rounded-lg px-3 py-2 text-xs" style={{ background: 'rgba(234,179,8,0.08)', border: '1px solid rgba(234,179,8,0.2)', color: '#ca8a04' }}>
        <span className="h-1.5 w-1.5 rounded-full bg-amber-500 flex-shrink-0" />
        <span className="font-semibold text-amber-600">PROTOTYPE / DEMO DATA</span>
        <span className="text-amber-700/70 hidden sm:block">— All analytics shown are simulated.</span>
      </div>

      {/* Report header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold text-white">Reports & Insights</h2>
          <p className="text-xs text-slate-500 mt-0.5">Scenario: {currentScenario.label} · Prototype analytics</p>
        </div>
        <button
          className="flex items-center gap-2 rounded-lg px-4 py-2 text-xs font-medium text-slate-400 hover:text-white transition-colors"
          style={{ border: '1px solid rgba(255,255,255,0.08)', background: 'rgba(255,255,255,0.03)' }}
        >
          <Download className="h-3.5 w-3.5" /> Export (Demo)
        </button>
      </div>

      {/* Top row: pie + bar + alert stats */}
      <div className="grid md:grid-cols-3 gap-4">
        {/* Risk distribution */}
        <div style={CARD_STYLE}>
          <div style={HEADER_STYLE}>
            <span className="text-sm font-semibold text-white">Risk Distribution</span>
            <span className="text-[10px] text-slate-500">{riskData.length} locations</span>
          </div>
          <div className="p-4">
            <div className="h-40">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={dist} cx="50%" cy="50%" innerRadius={40} outerRadius={65} dataKey="value" paddingAngle={3}>
                    {dist.map((entry, i) => <Cell key={i} fill={entry.color} />)}
                  </Pie>
                  <Tooltip formatter={(v, name) => [`${v} locations`, name]} contentStyle={{ background: 'rgba(6,15,10,0.95)', border: '1px solid rgba(53,169,141,0.2)', borderRadius: 8, color: '#e2e8f0', fontSize: 12 }} />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="grid grid-cols-2 gap-1 mt-2">
              {dist.map(d => (
                <div key={d.name} className="flex items-center gap-1.5">
                  <span className="h-2 w-2 rounded-full" style={{ background: d.color }} />
                  <span className="text-xs text-slate-400">{d.name}: {d.value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Alert status breakdown */}
        <div style={CARD_STYLE}>
          <div style={HEADER_STYLE}>
            <span className="text-sm font-semibold text-white">Alert Summary</span>
          </div>
          <div className="p-4 space-y-3">
            {[
              { label: 'Active', count: alertsActive.length, color: '#ef4444' },
              { label: 'Acknowledged', count: alertsAck.length, color: '#eab308' },
              { label: 'Resolved', count: alertsRes.length, color: '#22c55e' },
            ].map(s => (
              <div key={s.label}>
                <div className="flex justify-between text-xs mb-1.5">
                  <span className="text-slate-400">{s.label}</span>
                  <span className="font-semibold" style={{ color: s.color }}>{s.count}</span>
                </div>
                <div className="h-2 rounded-full" style={{ background: 'rgba(255,255,255,0.08)' }}>
                  <div className="h-2 rounded-full transition-all duration-700" style={{ width: `${s.count > 0 ? Math.min(100, s.count * 20) : 0}%`, background: s.color, opacity: 0.8 }} />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Environmental snapshot */}
        <div style={CARD_STYLE}>
          <div style={HEADER_STYLE}>
            <span className="text-sm font-semibold text-white">Environmental Snapshot</span>
          </div>
          <div className="p-4 space-y-3">
            {[
              { label: 'Rainfall', value: `${currentScenario.rainfall} mm/hr`, pct: currentScenario.rainfall / 130, color: '#06b6d4' },
              { label: 'Soil Moisture', value: `${currentScenario.soilMoisture}%`, pct: currentScenario.soilMoisture / 100, color: '#35a98d' },
              { label: 'Water Level', value: `${currentScenario.waterLevel} m`, pct: currentScenario.waterLevel / 4, color: '#f97316' },
              { label: 'Risk Score (avg)', value: `${Math.round(currentScenario.riskScore * 100)}%`, pct: currentScenario.riskScore, color: getRiskColor(currentScenario.riskLevel) },
            ].map(ind => (
              <div key={ind.label}>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-slate-400">{ind.label}</span>
                  <span className="font-medium text-slate-200">{ind.value}</span>
                </div>
                <div className="h-1.5 rounded-full" style={{ background: 'rgba(255,255,255,0.08)' }}>
                  <div className="h-1.5 rounded-full transition-all duration-700" style={{ width: `${Math.min(100, ind.pct * 100)}%`, background: ind.color }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Second row: trend + top risk locations */}
      <div className="grid md:grid-cols-2 gap-4">
        {/* Environmental trend */}
        <div style={CARD_STYLE}>
          <div style={HEADER_STYLE}>
            <span className="text-sm font-semibold text-white">Risk & Rainfall Trend</span>
            <span className="text-[10px] text-slate-500">24-hour simulated</span>
          </div>
          <div className="p-4">
            <div className="h-48">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={trendData}>
                  <defs>
                    <linearGradient id="riskG" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#ef4444" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#ef4444" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="rainG" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.25} />
                      <stop offset="95%" stopColor="#06b6d4" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" />
                  <XAxis dataKey="h" tick={{ fontSize: 10, fill: '#64748b' }} tickLine={false} />
                  <YAxis yAxisId="risk" domain={[0,1]} hide />
                  <YAxis yAxisId="rain" orientation="right" domain={[0,150]} tick={{ fontSize: 10, fill: '#64748b' }} tickLine={false} />
                  <Tooltip contentStyle={{ background: 'rgba(6,15,10,0.95)', border: '1px solid rgba(53,169,141,0.2)', borderRadius: 8, color: '#e2e8f0', fontSize: 12 }} />
                  <Area yAxisId="risk" type="monotone" dataKey="score" name="Risk Score" stroke="#ef4444" strokeWidth={2} fill="url(#riskG)" dot={false} />
                  <Area yAxisId="rain" type="monotone" dataKey="rainfall" name="Rainfall (mm)" stroke="#06b6d4" strokeWidth={1.5} fill="url(#rainG)" dot={false} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* High risk locations table */}
        <div style={CARD_STYLE}>
          <div style={HEADER_STYLE}>
            <span className="text-sm font-semibold text-white">High Risk Locations</span>
            <span className="text-[10px] text-slate-500">Sorted by risk</span>
          </div>
          <div>
            <table className="w-full text-xs">
              <thead>
                <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
                  <th className="px-4 py-2 text-left text-slate-500 font-medium">Location</th>
                  <th className="px-4 py-2 text-left text-slate-500 font-medium">Risk</th>
                  <th className="px-4 py-2 text-left text-slate-500 font-medium">Score</th>
                  <th className="px-4 py-2 text-left text-slate-500 font-medium">Trend</th>
                </tr>
              </thead>
              <tbody>
                {topRisk.map(r => (
                  <tr key={r.locationId} style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }} className="hover:bg-white/3 transition-colors">
                    <td className="px-4 py-3">
                      <p className="font-medium text-slate-200">{r.locationName}</p>
                      <p className="text-slate-500">{MOCK_LOCATIONS.find(l => l.id === r.locationId)?.district}</p>
                    </td>
                    <td className="px-4 py-3">
                      <span className="rounded-full px-2 py-0.5 text-[10px] font-semibold" style={{ background: `${RISK_COLORS[r.riskLevel]}18`, color: RISK_COLORS[r.riskLevel], border: `1px solid ${RISK_COLORS[r.riskLevel]}40` }}>
                        {r.riskLevel}
                      </span>
                    </td>
                    <td className="px-4 py-3 font-semibold" style={{ color: RISK_COLORS[r.riskLevel] }}>{Math.round(r.riskScore * 100)}%</td>
                    <td className="px-4 py-3 text-slate-400">{r.trend === 'INCREASING' ? '↑' : r.trend === 'DECREASING' ? '↓' : '→'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Alert History */}
      <div style={CARD_STYLE}>
        <div style={HEADER_STYLE}>
          <span className="text-sm font-semibold text-white">Alert History</span>
          <span className="text-[10px] text-slate-500">{(alerts ?? []).length} total alerts</span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
                {['Location', 'Severity', 'Risk Level', 'Status', 'Time', 'Last Updated'].map(h => (
                  <th key={h} className="px-4 py-2.5 text-left text-slate-500 font-medium">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {(alerts ?? []).slice(0, 8).map(alert => (
                <tr key={alert.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }} className="hover:bg-white/3 transition-colors">
                  <td className="px-4 py-3">
                    <p className="text-slate-200 font-medium">{alert.locationName}</p>
                    <p className="text-slate-500">{alert.district}</p>
                  </td>
                  <td className="px-4 py-3">
                    <span className="font-semibold" style={{ color: alert.severity === 'CRITICAL' ? '#ef4444' : alert.severity === 'HIGH' ? '#f97316' : alert.severity === 'MODERATE' ? '#eab308' : '#22c55e' }}>
                      {alert.severity}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <span className="rounded-full px-2 py-0.5" style={{ background: `${getRiskColor(alert.riskLevel)}18`, color: getRiskColor(alert.riskLevel), border: `1px solid ${getRiskColor(alert.riskLevel)}35` }}>
                      {alert.riskLevel}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <span className={alert.status === 'ACTIVE' ? 'text-red-400' : alert.status === 'ACKNOWLEDGED' ? 'text-yellow-400' : 'text-emerald-400'}>
                      {alert.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-slate-500">{new Date(alert.createdAt).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', hour12: false })}</td>
                  <td className="px-4 py-3 text-slate-500">{new Date(alert.updatedAt).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', hour12: false })}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
