import { useDemoMode } from '@/contexts/DemoContext';
import { DemoModeBanner } from '@/components/ui/DemoModeBanner';
import { Card } from '@/components/ui/Card';
import { CheckCircle, Clock, AlertTriangle, CloudRain, Mountain, Waves, TreePine, TrendingUp } from 'lucide-react';

const FEEDS = [
  {
    id: 'imd_rainfall', name: 'IMD Gridded Rainfall', type: 'Rainfall / Precipitation',
    icon: <CloudRain className="h-5 w-5 text-blue-500" />,
    status: 'SIMULATED', coverage: 'Uttarakhand, Sikkim, Himachal Pradesh',
    frequency: '3-hourly', quality: 'High (prototype: simulated)',
    description: 'India Meteorological Department observed and forecast gridded rainfall at 0.25° resolution.',
    variables: ['Total rainfall (mm)', 'Rainfall intensity (mm/hr)', 'Forecast 24h/48h'],
  },
  {
    id: 'soil_moisture_feed', name: 'Soil Moisture Index', type: 'Soil Conditions',
    icon: <TreePine className="h-5 w-5 text-teal-500" />,
    status: 'SIMULATED', coverage: 'Hilly regions',
    frequency: '6-hourly', quality: 'Medium (prototype: simulated)',
    description: 'Derived soil moisture index from rainfall accumulation and terrain characteristics.',
    variables: ['Soil moisture (%)', 'Saturation index', 'Antecedent conditions'],
  },
  {
    id: 'cwc_hydro', name: 'Hydrological Status Feed', type: 'Water Levels',
    icon: <Waves className="h-5 w-5 text-cyan-500" />,
    status: 'SIMULATED', coverage: 'Mandakini, Teesta, Beas basins',
    frequency: 'Hourly', quality: 'High (prototype: simulated)',
    description: 'River water-level indicators from major monitoring networks. Production integration with CWC planned.',
    variables: ['Water level (m)', 'Flow rate', 'Flood stage status'],
  },
  {
    id: 'dem_terrain', name: 'Terrain & Slope Data', type: 'Static Terrain',
    icon: <Mountain className="h-5 w-5 text-stone-500" />,
    status: 'ACTIVE', coverage: 'All hilly states',
    frequency: 'Static (updated annually)', quality: 'High',
    description: 'Digital Elevation Model (DEM) from ISRO Bhuvan. Used for slope, aspect, drainage and catchment analysis.',
    variables: ['Elevation (m)', 'Slope angle (°)', 'Aspect', 'Catchment area', 'Flow accumulation'],
  },
  {
    id: 'historical_events', name: 'Historical Flood Events', type: 'Historical',
    icon: <TrendingUp className="h-5 w-5 text-orange-500" />,
    status: 'ACTIVE', coverage: 'Uttarakhand, Sikkim, Himachal Pradesh',
    frequency: 'Annual update', quality: 'Medium',
    description: 'Historical flash flood and landslide events compiled from NDMA/NDRF records and academic literature.',
    variables: ['Event date', 'Location', 'Severity', 'Affected area', 'Return period estimate'],
  },
];

const STATUS_CONFIG: Record<string, { icon: React.ReactNode; label: string; cls: string }> = {
  ACTIVE:    { icon: <CheckCircle className="h-4 w-4" />, label: 'Active', cls: 'text-green-600 bg-green-50' },
  SIMULATED: { icon: <AlertTriangle className="h-4 w-4" />, label: 'Simulated (Demo)', cls: 'text-amber-600 bg-amber-50' },
  PENDING:   { icon: <Clock className="h-4 w-4" />, label: 'Pending', cls: 'text-slate-500 bg-slate-50' },
};

export function LiveSensorsPage() {
  const { currentScenario, scenarioRiskData } = useDemoMode();

  // Build a quick stats summary from scenario
  const riskValues = Object.values(scenarioRiskData);
  const avgRainfall = Math.round(riskValues.reduce((s, r) => s + r.rainfall, 0) / riskValues.length);
  const avgMoisture = Math.round(riskValues.reduce((s, r) => s + r.soilMoisture, 0) / riskValues.length);
  const avgWater = (riskValues.reduce((s, r) => s + r.waterLevel, 0) / riskValues.length).toFixed(1);

  return (
    <div className="p-4 md:p-6 space-y-4">
      <DemoModeBanner />

      <div className="rounded-md bg-slate-50 border border-slate-200 px-4 py-3 text-xs text-slate-700">
        <strong>Environmental Data Feeds</strong> — AARAKSH ingests environmental data entirely through software APIs and data services.
        No physical hardware is part of this platform. The feeds below supply the data pipeline.
      </div>

      {/* Current snapshot */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: 'Avg Rainfall', value: `${avgRainfall} mm/hr`, icon: <CloudRain className="h-4 w-4 text-blue-500" />, scenario: currentScenario.label },
          { label: 'Avg Soil Moisture', value: `${avgMoisture}%`, icon: <TreePine className="h-4 w-4 text-teal-500" />, scenario: currentScenario.label },
          { label: 'Avg Water Level', value: `${avgWater} m`, icon: <Waves className="h-4 w-4 text-cyan-500" />, scenario: currentScenario.label },
        ].map(s => (
          <Card key={s.label} className="text-center">
            <div className="flex justify-center mb-1">{s.icon}</div>
            <p className="text-lg font-bold text-slate-800">{s.value}</p>
            <p className="text-xs text-slate-500">{s.label}</p>
            <p className="text-[10px] text-amber-600 mt-1">Simulated — {s.scenario}</p>
          </Card>
        ))}
      </div>

      {/* Feed cards */}
      <div className="space-y-3">
        {FEEDS.map(feed => {
          const statusCfg = STATUS_CONFIG[feed.status] ?? STATUS_CONFIG.PENDING;
          return (
            <Card key={feed.id}>
              <div className="flex items-start gap-4">
                <div className="mt-0.5 flex-shrink-0">{feed.icon}</div>
                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-2 mb-1">
                    <span className="font-semibold text-slate-800 text-sm">{feed.name}</span>
                    <span className="rounded-full bg-slate-100 px-2 py-0.5 text-xs text-slate-500">{feed.type}</span>
                    <span className={`flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium ${statusCfg.cls}`}>
                      {statusCfg.icon} {statusCfg.label}
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 mb-2">{feed.description}</p>
                  <div className="flex flex-wrap gap-4 text-xs text-slate-400 mb-2">
                    <span>Coverage: {feed.coverage}</span>
                    <span>Update: {feed.frequency}</span>
                    <span>Quality: {feed.quality}</span>
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {feed.variables.map((v, i) => (
                      <span key={i} className="rounded-full bg-blue-50 border border-blue-100 px-2 py-0.5 text-xs text-blue-700">{v}</span>
                    ))}
                  </div>
                </div>
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
