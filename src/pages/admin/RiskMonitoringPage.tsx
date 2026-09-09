import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { riskService } from '@/services/riskService';
import { useDemoMode } from '@/contexts/DemoContext';
import { DemoModeBanner } from '@/components/ui/DemoModeBanner';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { RiskBadge } from '@/components/ui/RiskBadge';
import { Skeleton } from '@/components/ui/Skeleton';
import { MOCK_LOCATIONS } from '@/data/mockLocations';
import { formatRelativeTime, getRiskColor } from '@/lib/utils';
import { RiskLevel } from '@/types';
import { TrendingUp, TrendingDown, Minus, Filter } from 'lucide-react';

function TrendIcon({ trend }: { trend: string }) {
  if (trend === 'INCREASING') return <TrendingUp className="h-3.5 w-3.5 text-red-500" />;
  if (trend === 'DECREASING') return <TrendingDown className="h-3.5 w-3.5 text-green-500" />;
  return <Minus className="h-3.5 w-3.5 text-slate-400" />;
}

export function RiskMonitoringPage() {
  const { scenarioRiskData } = useDemoMode();
  const [stateFilter, setStateFilter] = useState('ALL');
  const [riskFilter, setRiskFilter] = useState<RiskLevel | 'ALL'>('ALL');

  const { data: allRisk, isLoading } = useQuery({
    queryKey: ['risk', 'all'],
    queryFn: () => riskService.getAllRisk(),
    staleTime: 30000,
  });

  const riskData = (allRisk ?? []).map(r => scenarioRiskData[r.locationId] ?? r);
  const states = ['ALL', ...Array.from(new Set(MOCK_LOCATIONS.map(l => l.state)))];

  const filtered = riskData.filter(r => {
    const loc = MOCK_LOCATIONS.find(l => l.id === r.locationId);
    if (stateFilter !== 'ALL' && loc?.state !== stateFilter) return false;
    if (riskFilter !== 'ALL' && r.riskLevel !== riskFilter) return false;
    return true;
  }).sort((a, b) => b.riskScore - a.riskScore);

  return (
    <div className="p-4 md:p-6 space-y-4">
      <DemoModeBanner />

      {/* Filters */}
      <Card>
        <div className="flex flex-wrap items-center gap-3">
          <Filter className="h-4 w-4 text-slate-400" />
          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-500">State:</span>
            <select value={stateFilter} onChange={e => setStateFilter(e.target.value)}
              className="rounded-md border border-slate-300 px-2 py-1 text-xs focus:border-blue-500 focus:outline-none">
              {states.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-500">Risk:</span>
            {(['ALL', 'CRITICAL', 'HIGH', 'MODERATE', 'LOW'] as const).map(level => (
              <button key={level} onClick={() => setRiskFilter(level)}
                className={`rounded-full px-3 py-1 text-xs font-medium border transition-colors ${
                  riskFilter === level ? 'bg-blue-700 text-white border-blue-700' : 'bg-white text-slate-600 border-slate-200'
                }`}>{level === 'ALL' ? 'All' : level.charAt(0) + level.slice(1).toLowerCase()}
              </button>
            ))}
          </div>
        </div>
      </Card>

      <Card padding="none">
        <CardHeader className="px-4 pt-4 pb-3">
          <CardTitle>Risk Monitoring — {filtered.length} Locations</CardTitle>
        </CardHeader>
        {isLoading ? (
          <div className="px-4 pb-4 space-y-2">{Array.from({ length: 5 }).map((_, i) => <Skeleton key={i} className="h-14" />)}</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-100 bg-slate-50">
                  <th className="px-4 py-2.5 text-left text-xs font-semibold text-slate-500">Location</th>
                  <th className="px-4 py-2.5 text-left text-xs font-semibold text-slate-500">State</th>
                  <th className="px-4 py-2.5 text-left text-xs font-semibold text-slate-500">Risk Level</th>
                  <th className="px-4 py-2.5 text-left text-xs font-semibold text-slate-500">Score</th>
                  <th className="px-4 py-2.5 text-left text-xs font-semibold text-slate-500">Confidence</th>
                  <th className="px-4 py-2.5 text-left text-xs font-semibold text-slate-500">Trend</th>
                  <th className="px-4 py-2.5 text-left text-xs font-semibold text-slate-500">Rainfall</th>
                  <th className="px-4 py-2.5 text-left text-xs font-semibold text-slate-500">Updated</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {filtered.map(r => {
                  const loc = MOCK_LOCATIONS.find(l => l.id === r.locationId);
                  return (
                    <tr key={r.locationId} className="hover:bg-slate-50">
                      <td className="px-4 py-3">
                        <div className="font-medium text-slate-800">{r.locationName}</div>
                        <div className="text-xs text-slate-400">{loc?.district}</div>
                      </td>
                      <td className="px-4 py-3 text-xs text-slate-600">{loc?.state}</td>
                      <td className="px-4 py-3"><RiskBadge level={r.riskLevel} /></td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <div className="h-1.5 w-12 rounded-full bg-slate-100">
                            <div className="h-1.5 rounded-full" style={{ width: `${r.riskScore * 100}%`, backgroundColor: getRiskColor(r.riskLevel) }} />
                          </div>
                          <span className="text-xs text-slate-600">{(r.riskScore * 100).toFixed(0)}%</span>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-xs text-slate-600">{(r.confidence * 100).toFixed(0)}%</td>
                      <td className="px-4 py-3"><div className="flex items-center gap-1"><TrendIcon trend={r.trend} /><span className="text-xs text-slate-500">{r.trend.charAt(0) + r.trend.slice(1).toLowerCase()}</span></div></td>
                      <td className="px-4 py-3 text-xs text-slate-600">{r.rainfall} mm</td>
                      <td className="px-4 py-3 text-xs text-slate-400">{formatRelativeTime(r.updatedAt)}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </Card>
    </div>
  );
}
