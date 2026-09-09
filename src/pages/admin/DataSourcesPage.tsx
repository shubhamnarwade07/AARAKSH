import { useQuery } from '@tanstack/react-query';
import { adminService } from '@/services/adminService';
import { DemoModeBanner } from '@/components/ui/DemoModeBanner';
import { Card } from '@/components/ui/Card';
import { Skeleton } from '@/components/ui/Skeleton';
import { DataSourceType } from '@/types';
import { CheckCircle, Clock, XCircle, CloudRain, Satellite, Mountain, Database, Waves, BarChart3 } from 'lucide-react';

const TYPE_META: Record<DataSourceType, { label: string; icon: React.ReactNode; desc: string }> = {
  WEATHER_API:   { label: 'Weather / NWP API',   icon: <CloudRain className="h-5 w-5 text-blue-500" />,    desc: 'Numerical Weather Prediction and observed rainfall APIs' },
  SATELLITE:     { label: 'Satellite Data',      icon: <Satellite className="h-5 w-5 text-violet-500" />,  desc: 'SAR, multispectral and derived soil-moisture/flood products' },
  TERRAIN:       { label: 'Terrain / DEM',       icon: <Mountain className="h-5 w-5 text-teal-500" />,     desc: 'Digital elevation models, slope/aspect, drainage networks' },
  HISTORICAL:    { label: 'Historical Records',  icon: <Database className="h-5 w-5 text-slate-500" />,    desc: 'Past flood/landslide events, return-period analysis' },
  IOT:           { label: 'Environmental Feeds', icon: <BarChart3 className="h-5 w-5 text-orange-500" />,  desc: 'Automated environmental data ingestion streams' },
  HYDROLOGICAL:  { label: 'Hydrological Data',  icon: <Waves className="h-5 w-5 text-cyan-500" />,       desc: 'River gauge networks and water-level feeds' },
};

export function DataSourcesPage() {
  const { data: sources, isLoading } = useQuery({
    queryKey: ['admin', 'dataSources'],
    queryFn: () => adminService.getDataSources(),
  });

  return (
    <div className="p-4 md:p-6 space-y-4">
      <DemoModeBanner />

      <div className="rounded-md bg-blue-50 border border-blue-200 px-4 py-3 text-xs text-blue-800">
        <strong>Software Data Architecture:</strong> AARAKSH ingests environmental data from government APIs,
        satellite platforms, and hydrological services — entirely as software. No physical hardware is part of this platform.
        Planned integrations are listed below. All current data is simulated for prototype demonstration.
      </div>

      {/* Pipeline diagram */}
      <Card>
        <div className="flex flex-wrap items-center gap-2 text-xs text-slate-600">
          <span className="rounded bg-slate-100 px-2 py-1 font-semibold">Environmental Feeds</span>
          <span className="text-slate-400">→</span>
          <span className="rounded bg-slate-100 px-2 py-1 font-semibold">Data Ingestion</span>
          <span className="text-slate-400">→</span>
          <span className="rounded bg-slate-100 px-2 py-1 font-semibold">Validation</span>
          <span className="text-slate-400">→</span>
          <span className="rounded bg-slate-100 px-2 py-1 font-semibold">Data Fusion</span>
          <span className="text-slate-400">→</span>
          <span className="rounded bg-slate-100 px-2 py-1 font-semibold">GIS / Spatial Engine</span>
          <span className="text-slate-400">→</span>
          <span className="rounded bg-blue-100 px-2 py-1 font-semibold text-blue-700">AI Risk Engine</span>
          <span className="text-slate-400">→</span>
          <span className="rounded bg-blue-700 px-2 py-1 font-semibold text-white">AARAKSH Dashboard</span>
        </div>
      </Card>

      <div className="grid md:grid-cols-2 gap-4">
        {isLoading
          ? Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-40 rounded-lg" />)
          : (sources ?? []).map(source => {
              const meta = TYPE_META[source.type];
              return (
                <Card key={source.id}>
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-start gap-3 flex-1 min-w-0">
                      <div className="mt-0.5 flex-shrink-0">{meta.icon}</div>
                      <div className="min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-semibold text-slate-800 text-sm">{source.name}</span>
                          <span className="rounded-full bg-slate-100 px-2 py-0.5 text-xs text-slate-500">{meta.label}</span>
                          {!source.isLive && (
                            <span className="rounded-full bg-amber-100 px-2 py-0.5 text-xs text-amber-700">Planned</span>
                          )}
                        </div>
                        <p className="text-xs text-slate-500 mb-2">{source.description}</p>
                        <div className="flex flex-wrap gap-3 text-xs text-slate-400">
                          <span>Coverage: {source.coverage}</span>
                          <span>Frequency: {source.updateFrequency}</span>
                          {source.provider && <span>Provider: {source.provider}</span>}
                        </div>
                      </div>
                    </div>
                    <div className="flex-shrink-0">
                      {source.status === 'ACTIVE' ? (
                        <span className="flex items-center gap-1 text-xs text-green-600"><CheckCircle className="h-3.5 w-3.5" />Active</span>
                      ) : source.status === 'ERROR' ? (
                        <span className="flex items-center gap-1 text-xs text-red-600"><XCircle className="h-3.5 w-3.5" />Error</span>
                      ) : (
                        <span className="flex items-center gap-1 text-xs text-slate-400"><Clock className="h-3.5 w-3.5" />Pending</span>
                      )}
                    </div>
                  </div>
                  {source.notes && (
                    <p className="mt-3 text-xs text-slate-400 border-t border-slate-50 pt-2">{source.notes}</p>
                  )}
                </Card>
              );
            })
        }
      </div>
    </div>
  );
}
