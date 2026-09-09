import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MapPin, Star, TrendingUp, TrendingDown, Minus, Map, Brain } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { locationService } from '@/services/locationService';
import { useDemoMode } from '@/contexts/DemoContext';
import { useAuth } from '@/contexts/AuthContext';
import { RiskBadge } from '@/components/ui/RiskBadge';
import { getRiskColor, formatRelativeTime } from '@/lib/utils';
import { ROUTES } from '@/lib/constants';

function TrendIcon({ trend }: { trend: string }) {
  if (trend === 'INCREASING') return <TrendingUp className="h-3.5 w-3.5" style={{ color: '#ef4444' }} />;
  if (trend === 'DECREASING') return <TrendingDown className="h-3.5 w-3.5" style={{ color: '#22c55e' }} />;
  return <Minus className="h-3.5 w-3.5 text-slate-600" />;
}

export function LocationsPage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { scenarioRiskData, setSelectedLocationId } = useDemoMode();
  const [tab, setTab] = useState<'saved' | 'all'>('all');

  const { data: locations, isLoading } = useQuery({
    queryKey: ['locations'],
    queryFn: () => locationService.getAll(),
  });

  const { data: saved, isLoading: savedLoading } = useQuery({
    queryKey: ['savedLocations', user?.id],
    queryFn: () => locationService.getSavedLocations(user!.id),
    enabled: !!user,
  });

  const savedLocationIds = saved?.map(s => s.locationId) ?? [];
  const displayLocations = tab === 'saved'
    ? (locations ?? []).filter(l => savedLocationIds.includes(l.id))
    : (locations ?? []);

  function handleViewOnMap(locationId: string) {
    setSelectedLocationId(locationId);
    navigate(ROUTES.APP_RISK_MAP);
  }

  function handleViewPrediction(locationId: string) {
    setSelectedLocationId(locationId);
    navigate(ROUTES.APP_PREDICTIONS);
  }

  return (
    <div className="p-4 md:p-6 space-y-4">
      {/* Demo banner */}
      <div className="flex items-center gap-2 rounded-lg px-3 py-2 text-xs" style={{ background: 'rgba(234,179,8,0.08)', border: '1px solid rgba(234,179,8,0.2)', color: '#ca8a04' }}>
        <span className="h-1.5 w-1.5 rounded-full bg-amber-500 flex-shrink-0" />
        <span className="font-semibold text-amber-600">PROTOTYPE / DEMO DATA</span>
      </div>

      {/* Tab + count */}
      <div className="flex items-center gap-3">
        <div className="flex gap-2">
          {(['all', 'saved'] as const).map(t => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className="rounded-full px-4 py-1.5 text-sm font-medium transition-all"
              style={{
                background: tab === t ? 'rgba(53,169,141,0.2)' : 'rgba(255,255,255,0.04)',
                border: `1px solid ${tab === t ? 'rgba(53,169,141,0.4)' : 'rgba(255,255,255,0.08)'}`,
                color: tab === t ? '#35a98d' : '#64748b',
              }}
            >
              {t === 'saved' ? '★ Saved' : 'All Locations'}
            </button>
          ))}
        </div>
        <span className="ml-auto text-xs text-slate-600">{displayLocations.length} location{displayLocations.length !== 1 ? 's' : ''}</span>
      </div>

      {(isLoading || savedLoading) ? (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array.from({ length: 6 }).map((_, i) => <div key={i} className="h-56 skeleton rounded-xl" />)}
        </div>
      ) : displayLocations.length === 0 ? (
        <div
          className="rounded-xl py-16 text-center"
          style={{ background: 'rgba(15,41,24,0.3)', border: '1px dashed rgba(255,255,255,0.1)' }}
        >
          <MapPin className="h-8 w-8 mx-auto mb-3 text-slate-700" />
          <p className="text-sm text-slate-500">No saved locations yet.</p>
          <button onClick={() => setTab('all')} className="mt-2 text-sm font-medium" style={{ color: '#35a98d' }}>
            Browse all locations
          </button>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {displayLocations.map(loc => {
            const risk = scenarioRiskData[loc.id];
            const savedEntry = saved?.find(s => s.locationId === loc.id);
            const riskColor = risk ? getRiskColor(risk.riskLevel) : '#64748b';

            return (
              <div
                key={loc.id}
                className="rounded-xl flex flex-col hover:brightness-110 transition-all"
                style={{ background: 'rgba(15,41,24,0.5)', border: '1px solid rgba(255,255,255,0.07)', overflow: 'hidden' }}
              >
                {/* Header strip */}
                <div className="px-4 py-3" style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="flex items-center gap-2">
                        <MapPin className="h-3.5 w-3.5 flex-shrink-0" style={{ color: '#35a98d' }} />
                        <span className="font-semibold text-white text-sm">{loc.name}</span>
                        {savedEntry && <Star className="h-3.5 w-3.5 flex-shrink-0" style={{ color: '#eab308', fill: '#eab308' }} />}
                      </div>
                      <p className="text-xs text-slate-500 ml-5.5 mt-0.5">{loc.district}, {loc.state}</p>
                      {loc.riverBasin && <p className="text-[10px] text-slate-700 mt-0.5">{loc.riverBasin} Basin · {loc.elevation}m</p>}
                    </div>
                    {risk && <RiskBadge level={risk.riskLevel} size="sm" />}
                  </div>
                </div>

                {/* Risk data */}
                <div className="p-4 flex-1 space-y-3">
                  {risk ? (
                    <>
                      {/* Risk score bar */}
                      <div>
                        <div className="flex justify-between text-xs mb-1.5">
                          <span className="text-slate-500">Risk Score</span>
                          <div className="flex items-center gap-1.5">
                            <TrendIcon trend={risk.trend} />
                            <span className="font-bold" style={{ color: riskColor }}>
                              {Math.round(risk.riskScore * 100)}%
                            </span>
                          </div>
                        </div>
                        <div className="h-1.5 rounded-full" style={{ background: 'rgba(255,255,255,0.08)' }}>
                          <div
                            className="h-1.5 rounded-full transition-all duration-700"
                            style={{ width: `${risk.riskScore * 100}%`, background: `linear-gradient(90deg, ${riskColor}80, ${riskColor})` }}
                          />
                        </div>
                      </div>

                      {/* Environmental snapshot */}
                      <div className="grid grid-cols-2 gap-2">
                        {[
                          { label: 'Rainfall', value: `${risk.rainfall} mm/hr` },
                          { label: 'Soil Moisture', value: `${risk.soilMoisture}%` },
                          { label: 'Flood Prob.', value: `${Math.round(risk.floodProbability * 100)}%` },
                          { label: 'Confidence', value: `${Math.round(risk.confidence * 100)}%` },
                        ].map(item => (
                          <div key={item.label} className="rounded-lg p-2" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.05)' }}>
                            <p className="text-[10px] text-slate-600">{item.label}</p>
                            <p className="text-xs font-semibold text-slate-300 mt-0.5">{item.value}</p>
                          </div>
                        ))}
                      </div>

                      <p className="text-[10px] text-slate-700">Updated: {formatRelativeTime(risk.updatedAt)} · Simulated</p>
                    </>
                  ) : (
                    <p className="text-xs text-slate-600">Risk data unavailable</p>
                  )}
                </div>

                {/* Action buttons */}
                <div className="flex gap-2 px-4 pb-4" style={{ borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: '12px', marginTop: 'auto' }}>
                  <button
                    onClick={() => handleViewOnMap(loc.id)}
                    className="flex-1 flex items-center justify-center gap-1.5 rounded-lg py-2 text-xs font-medium text-slate-400 hover:text-white transition-colors"
                    style={{ border: '1px solid rgba(255,255,255,0.08)', background: 'rgba(255,255,255,0.03)' }}
                  >
                    <Map className="h-3.5 w-3.5" /> Map
                  </button>
                  <button
                    onClick={() => handleViewPrediction(loc.id)}
                    className="flex-1 flex items-center justify-center gap-1.5 rounded-lg py-2 text-xs font-semibold text-white hover:brightness-110 transition-all"
                    style={{ background: 'linear-gradient(135deg, #276942, #22866f)' }}
                  >
                    <Brain className="h-3.5 w-3.5" /> Prediction
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
