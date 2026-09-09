import { useQuery } from '@tanstack/react-query';
import { useNavigate, Link } from 'react-router-dom';
import { Activity, AlertTriangle, CloudRain, Database, Shield, TrendingUp, ArrowRight } from 'lucide-react';
import { adminService } from '@/services/adminService';
import { alertService } from '@/services/alertService';
import { riskService } from '@/services/riskService';
import { useDemoMode } from '@/contexts/DemoContext';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { RiskBadge } from '@/components/ui/RiskBadge';
import { StatusIndicator } from '@/components/ui/StatusIndicator';
import { DemoModeBanner } from '@/components/ui/DemoModeBanner';
import { Skeleton } from '@/components/ui/Skeleton';
import { formatRelativeTime } from '@/lib/utils';
import { ServiceStatus } from '@/types';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { MOCK_LOCATIONS, generateRiskHistory } from '@/data/mockLocations';
import { ROUTES } from '@/lib/constants';

function StatCard({ icon, label, value, sub, status }: { icon: React.ReactNode; label: string; value: string | number; sub?: string; status?: string }) {
  return (
    <Card className="flex items-center gap-4">
      <div className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-lg bg-slate-100 text-slate-600">{icon}</div>
      <div className="min-w-0 flex-1">
        <p className="text-xs text-slate-500">{label}</p>
        <p className="text-xl font-bold text-slate-900">{value}</p>
        {sub && <p className="text-xs text-slate-400 truncate">{sub}</p>}
      </div>
      {status && <StatusIndicator status={status as any} showLabel={false} />}
    </Card>
  );
}

export function AdminDashboardPage() {
  const navigate = useNavigate();
  const { scenarioRiskData, currentScenario, setScenario, isSimulating, toggleSimulation, setSelectedLocationId } = useDemoMode();

  const { data: alerts } = useQuery({ queryKey: ['alerts'], queryFn: () => alertService.getAlerts(), staleTime: 15000 });
  const { data: health } = useQuery({ queryKey: ['systemHealth'], queryFn: () => adminService.getSystemHealth(), staleTime: 30000 });
  const { data: allRisk } = useQuery({ queryKey: ['risk', 'all'], queryFn: () => riskService.getAllRisk(), staleTime: 30000 });

  const activeAlerts = alerts?.filter(a => a.status === 'ACTIVE') ?? [];
  const criticalAlerts = activeAlerts.filter(a => a.severity === 'CRITICAL');
  const riskData = (allRisk ?? []).map(r => scenarioRiskData[r.locationId] ?? r);
  const highRisk = riskData.filter(r => r.riskLevel === 'HIGH' || r.riskLevel === 'CRITICAL').length;
  const activeDataFeeds = 2; // Static (terrain DEM + historical) are always active in prototype

  const trendHistory = generateRiskHistory('VLG_001', currentScenario.riskScore);
  const trendData = trendHistory.slice(-12).map((h, i) => ({
    t: i === 11 ? 'Now' : `-${11-i}h`,
    risk: h.riskScore,
  }));

  function handleRowClick(locationId: string) {
    setSelectedLocationId(locationId);
    navigate(ROUTES.ADMIN_PREDICTIONS);
  }

  return (
    <div className="p-4 md:p-6 space-y-4">
      <DemoModeBanner />

      {/* Demo controls */}
      <div className="flex flex-wrap items-center gap-2">
        <span className="text-xs text-slate-500 font-medium">Scenario:</span>
        {(['NORMAL', 'HEAVY_RAIN', 'RISING_RISK', 'CRITICAL'] as const).map(id => (
          <button key={id} onClick={() => setScenario(id)}
            className={`rounded-full px-3 py-1 text-xs font-medium border transition-colors ${
              currentScenario.id === id ? 'bg-blue-700 text-white border-blue-700' : 'bg-white text-slate-600 border-slate-200 hover:border-blue-300'
            }`}>
            {id.replace('_', ' ')}
          </button>
        ))}
        <button onClick={toggleSimulation}
          className={`flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium border transition-colors ${
            isSimulating ? 'bg-orange-600 text-white border-orange-600' : 'bg-white text-slate-600 border-slate-200'
          }`}>
          <span className={`h-1.5 w-1.5 rounded-full ${isSimulating ? 'bg-white animate-pulse' : 'bg-slate-400'}`} />
          {isSimulating ? 'Stop Simulation' : 'Run SIH Demo'}
        </button>
      </div>

      {/* Top stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard icon={<Activity className="h-5 w-5" />} label="Monitored Locations" value={MOCK_LOCATIONS.length} sub="Demo dataset" />
        <StatCard icon={<AlertTriangle className="h-5 w-5" />} label="High/Critical" value={highRisk} sub="Active risk" />
        <StatCard icon={<AlertTriangle className="h-5 w-5" />} label="Active Alerts" value={activeAlerts.length} sub="Require action" />
        <StatCard icon={<CloudRain className="h-5 w-5" />} label="Data Feeds" value={`${activeDataFeeds}/5`} sub="Active (prototype)" />
      </div>

      <div className="grid lg:grid-cols-3 gap-4">
        {/* Risk table */}
        <div className="lg:col-span-2">
          <Card padding="none">
            <CardHeader className="px-4 pt-4 pb-3">
              <CardTitle>Regional Risk Overview</CardTitle>
              <span className="text-xs text-amber-600 bg-amber-50 rounded-full px-2 py-0.5">Demo Data</span>
            </CardHeader>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-slate-100 bg-slate-50">
                    <th className="px-4 py-2.5 text-left text-xs font-semibold text-slate-500">Location</th>
                    <th className="px-4 py-2.5 text-left text-xs font-semibold text-slate-500">State</th>
                    <th className="px-4 py-2.5 text-left text-xs font-semibold text-slate-500">Risk</th>
                    <th className="px-4 py-2.5 text-left text-xs font-semibold text-slate-500 hidden md:table-cell">Score</th>
                    <th className="px-4 py-2.5 text-left text-xs font-semibold text-slate-500 hidden md:table-cell">Confidence</th>
                    <th className="px-4 py-2.5 text-left text-xs font-semibold text-slate-500 hidden lg:table-cell">Updated</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {riskData.sort((a, b) => b.riskScore - a.riskScore).map(r => (
                    <tr
                      key={r.locationId}
                      className="hover:bg-blue-50 cursor-pointer transition-colors group"
                      onClick={() => handleRowClick(r.locationId)}
                      title="Click to view prediction"
                    >
                      <td className="px-4 py-3">
                        <div className="font-medium text-slate-800 group-hover:text-blue-700">{r.locationName}</div>
                        <div className="text-xs text-slate-400">{MOCK_LOCATIONS.find(l => l.id === r.locationId)?.district}</div>
                      </td>
                      <td className="px-4 py-3 text-xs text-slate-600">{MOCK_LOCATIONS.find(l => l.id === r.locationId)?.state}</td>
                      <td className="px-4 py-3"><RiskBadge level={r.riskLevel} /></td>
                      <td className="px-4 py-3 hidden md:table-cell text-xs text-slate-600">{(r.riskScore * 100).toFixed(0)}%</td>
                      <td className="px-4 py-3 hidden md:table-cell text-xs text-slate-600">{(r.confidence * 100).toFixed(0)}%</td>
                      <td className="px-4 py-3 hidden lg:table-cell text-xs text-slate-400">{formatRelativeTime(r.updatedAt)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        </div>

        {/* Right column */}
        <div className="flex flex-col gap-4">
          {/* System Health */}
          <Card>
            <CardHeader><CardTitle className="flex items-center gap-2"><Shield className="h-4 w-4" />System Health</CardTitle></CardHeader>
            <CardContent className="space-y-2">
              {health?.services.map(svc => (
                <div key={svc.id} className="flex items-center justify-between">
                  <span className="text-xs text-slate-700">{svc.name}</span>
                  <StatusIndicator status={svc.status as any} size="sm" />
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Critical alerts */}
          <Card>
            <CardHeader>
              <CardTitle>Critical Alerts</CardTitle>
              <Link to={ROUTES.ADMIN_ALERTS} className="flex items-center gap-1 text-xs text-blue-600 hover:text-blue-800 font-medium">
                View All <ArrowRight className="h-3 w-3" />
              </Link>
            </CardHeader>
            <CardContent className="space-y-2">
              {criticalAlerts.length === 0 ? (
                <p className="text-xs text-slate-400">No critical alerts</p>
              ) : criticalAlerts.slice(0, 4).map(a => (
                <div key={a.id} className="flex gap-2 border-b border-slate-50 pb-2 last:border-0">
                  <span className="mt-1 h-2 w-2 flex-shrink-0 rounded-full bg-red-500" />
                  <div>
                    <p className="text-xs font-medium text-slate-800">{a.locationName}</p>
                    <p className="text-xs text-slate-500">{a.title}</p>
                    <p className="text-[10px] text-slate-400">{formatRelativeTime(a.createdAt)}</p>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Risk trend chart */}
          <Card>
            <CardHeader><CardTitle className="flex items-center gap-2"><TrendingUp className="h-4 w-4" />12h Risk Trend — Rambara</CardTitle></CardHeader>
            <CardContent>
              <div className="h-32">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={trendData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" />
                    <XAxis dataKey="t" tick={{ fontSize: 9 }} tickLine={false} interval={2} />
                    <YAxis domain={[0, 1]} hide />
                    <Tooltip formatter={(v) => [`${((v as number) * 100).toFixed(0)}%`, 'Risk']} />
                    <Line type="monotone" dataKey="risk" stroke="#EF4444" strokeWidth={2} dot={false} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
              <p className="text-[10px] text-slate-400 mt-1">Simulated — {currentScenario.label}</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
