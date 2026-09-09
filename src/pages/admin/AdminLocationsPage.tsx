import { useQuery } from '@tanstack/react-query';
import { locationService } from '@/services/locationService';
import { useDemoMode } from '@/contexts/DemoContext';
import { DemoModeBanner } from '@/components/ui/DemoModeBanner';
import { Card } from '@/components/ui/Card';
import { RiskBadge } from '@/components/ui/RiskBadge';
import { Skeleton } from '@/components/ui/Skeleton';
import { formatRelativeTime } from '@/lib/utils';

export function AdminLocationsPage() {
  const { scenarioRiskData } = useDemoMode();
  const { data: locations, isLoading } = useQuery({ queryKey: ['locations'], queryFn: () => locationService.getAll() });
  return (
    <div className="p-4 md:p-6 space-y-4">
      <DemoModeBanner />
      <Card padding="none">
        <div className="px-4 pt-4 pb-3 flex items-center justify-between">
          <h3 className="text-sm font-semibold text-slate-800">All Monitored Locations</h3>
          <span className="text-xs text-slate-500">{locations?.length ?? 0} locations</span>
        </div>
        {isLoading ? (
          <div className="px-4 pb-4 space-y-2">{Array.from({ length: 6 }).map((_, i) => <Skeleton key={i} className="h-12" />)}</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-100 bg-slate-50">
                  <th className="px-4 py-2.5 text-left text-xs font-semibold text-slate-500">Location</th>
                  <th className="px-4 py-2.5 text-left text-xs font-semibold text-slate-500">Type</th>
                  <th className="px-4 py-2.5 text-left text-xs font-semibold text-slate-500">District</th>
                  <th className="px-4 py-2.5 text-left text-xs font-semibold text-slate-500">State</th>
                  <th className="px-4 py-2.5 text-left text-xs font-semibold text-slate-500">Risk</th>
                  <th className="px-4 py-2.5 text-left text-xs font-semibold text-slate-500">Sensors</th>
                  <th className="px-4 py-2.5 text-left text-xs font-semibold text-slate-500">Elevation</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {(locations ?? []).map(loc => {
                  const risk = scenarioRiskData[loc.id];
                  return (
                    <tr key={loc.id} className="hover:bg-slate-50">
                      <td className="px-4 py-3 font-medium text-slate-800">{loc.name}</td>
                      <td className="px-4 py-3 text-xs"><span className="rounded-full bg-slate-100 px-2 py-0.5 text-slate-600">{loc.type}</span></td>
                      <td className="px-4 py-3 text-xs text-slate-600">{loc.district}</td>
                      <td className="px-4 py-3 text-xs text-slate-600">{loc.state}</td>
                      <td className="px-4 py-3">{risk ? <RiskBadge level={risk.riskLevel} size="sm" /> : <span className="text-xs text-slate-400">No data</span>}</td>
                      <td className="px-4 py-3 text-xs text-slate-600">{loc.activeSensors}/{loc.sensorCount}</td>
                      <td className="px-4 py-3 text-xs text-slate-600">{loc.elevation ? `${loc.elevation} m` : '—'}</td>
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
