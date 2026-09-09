import { useEffect, useRef, useState, useCallback } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import * as maplibregl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';
import workerUrl from 'maplibre-gl/dist/maplibre-gl-worker.mjs?worker&url';
import { useDemoMode } from '@/contexts/DemoContext';
import { DemoModeBanner } from '@/components/ui/DemoModeBanner';
import { RiskBadge } from '@/components/ui/RiskBadge';
import { getRiskColor } from '@/lib/utils';
import { MOCK_LOCATIONS } from '@/data/mockLocations';
import { RiskData, RiskLevel } from '@/types';
import { MAP_CONFIG, ROUTES } from '@/lib/constants';
import {
  X, Layers, MapPin, TrendingUp, TrendingDown, Minus,
  AlertTriangle, Brain, Shield, ArrowRight
} from 'lucide-react';

// Fix MapLibre blank screen in Vite production build
maplibregl.setWorkerUrl(workerUrl);


// Software data layers — no physical sensor layer
const LAYER_OPTIONS = [
  { id: 'risk_zones',     label: 'Risk Index',               enabled: true,  available: true  },
  { id: 'rainfall',       label: 'Rainfall',                 enabled: false, available: false },
  { id: 'soil_moisture',  label: 'Soil Moisture',            enabled: false, available: false },
  { id: 'water_level',    label: 'Hydrological Status',      enabled: false, available: false },
  { id: 'terrain',        label: 'Terrain / Slope',          enabled: false, available: false },
  { id: 'historical',     label: 'Historical Events',        enabled: false, available: false },
];

function TrendIcon({ trend }: { trend: 'INCREASING' | 'STABLE' | 'DECREASING' }) {
  if (trend === 'INCREASING') return <TrendingUp className="h-3.5 w-3.5 text-red-500" />;
  if (trend === 'DECREASING') return <TrendingDown className="h-3.5 w-3.5 text-green-500" />;
  return <Minus className="h-3.5 w-3.5 text-slate-400" />;
}

export function RiskMapPage() {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<maplibregl.Map | null>(null);
  const markersRef = useRef<maplibregl.Marker[]>([]);
  const navigate = useNavigate();

  const {
    scenarioRiskData, currentScenario,
    selectedLocationId, setSelectedLocationId,
    setScenario, isSimulating, toggleSimulation,
  } = useDemoMode();

  const [layers, setLayers] = useState(LAYER_OPTIONS);
  const [showLayers, setShowLayers] = useState(false);
  const [mapLoaded, setMapLoaded] = useState(false);

  const selectedLocation = selectedLocationId ? MOCK_LOCATIONS.find(l => l.id === selectedLocationId) : null;
  const selectedRisk: RiskData | undefined = selectedLocationId ? scenarioRiskData[selectedLocationId] : undefined;

  const updateMarkers = useCallback(() => {
    if (!mapRef.current || !mapLoaded) return;
    markersRef.current.forEach(m => m.remove());
    markersRef.current = [];

    MOCK_LOCATIONS.forEach(loc => {
      const risk = scenarioRiskData[loc.id];
      if (!risk) return;
      const color = getRiskColor(risk.riskLevel);
      const isSelected = loc.id === selectedLocationId;

      const el = document.createElement('div');
      el.className = 'cursor-pointer';
      el.innerHTML = `
        <div style="
          width: ${isSelected ? '26px' : '20px'};
          height: ${isSelected ? '26px' : '20px'};
          border-radius: 50%;
          background-color: ${color};
          border: ${isSelected ? '3px solid #1D4ED8' : '2.5px solid white'};
          box-shadow: ${isSelected ? '0 0 0 3px rgba(29,78,216,0.3), 0 3px 8px rgba(0,0,0,0.25)' : '0 2px 6px rgba(0,0,0,0.25)'};
          transition: transform 0.15s, width 0.15s, height 0.15s;
        " title="${loc.name}: ${risk.riskLevel} (${Math.round(risk.riskScore * 100)}%)"></div>
      `;
      el.addEventListener('mouseenter', () => {
        (el.firstElementChild as HTMLElement).style.transform = 'scale(1.3)';
      });
      el.addEventListener('mouseleave', () => {
        (el.firstElementChild as HTMLElement).style.transform = 'scale(1)';
      });
      el.addEventListener('click', (e) => {
        e.stopPropagation();
        setSelectedLocationId(loc.id === selectedLocationId ? null : loc.id);
      });

      const marker = new maplibregl.Marker({ element: el })
        .setLngLat([loc.coordinates.lng, loc.coordinates.lat])
        .addTo(mapRef.current!);
      markersRef.current.push(marker);
    });
  }, [scenarioRiskData, mapLoaded, selectedLocationId, setSelectedLocationId]);

  useEffect(() => {
    if (!mapContainerRef.current || mapRef.current) return;
    const map = new maplibregl.Map({
      container: mapContainerRef.current,
      style: MAP_CONFIG.STYLE_URL,
      center: MAP_CONFIG.DEFAULT_CENTER,
      zoom: MAP_CONFIG.DEFAULT_ZOOM,
    });
    map.addControl(new maplibregl.NavigationControl(), 'top-right');
    map.addControl(new maplibregl.ScaleControl(), 'bottom-left');
    map.on('load', () => setMapLoaded(true));
    mapRef.current = map;
    return () => {
      markersRef.current.forEach(m => m.remove());
      map.remove();
      mapRef.current = null;
    };
  }, []);

  useEffect(() => { updateMarkers(); }, [updateMarkers]);

  // Fly to selected location
  useEffect(() => {
    if (selectedLocationId && mapRef.current && mapLoaded) {
      const loc = MOCK_LOCATIONS.find(l => l.id === selectedLocationId);
      if (loc) {
        mapRef.current.flyTo({
          center: [loc.coordinates.lng, loc.coordinates.lat],
          zoom: 10,
          duration: 1200,
        });
      }
    }
  }, [selectedLocationId, mapLoaded]);

  const riskLevels: { level: RiskLevel; label: string }[] = [
    { level: 'LOW', label: 'Low' },
    { level: 'MODERATE', label: 'Moderate' },
    { level: 'HIGH', label: 'High' },
    { level: 'CRITICAL', label: 'Critical' },
  ];

  function handleViewPrediction() {
    navigate(ROUTES.APP_PREDICTIONS);
  }

  function handleViewSafety() {
    navigate(ROUTES.APP_SAFETY_CENTRE);
  }

  return (
    <div className="flex flex-col h-[calc(100vh-56px)]">
      <div className="px-4 pt-4 pb-2 flex-shrink-0">
        <DemoModeBanner />
      </div>

      <div className="relative flex-1 min-h-0">
        {/* Map */}
        <div ref={mapContainerRef} className="absolute inset-0" />

        {/* Scenario control — top center */}
        <div className="absolute top-3 left-1/2 -translate-x-1/2 z-10">
          <div className="flex items-center gap-1 rounded-full bg-white/95 border border-slate-200 shadow px-3 py-1.5 text-xs backdrop-blur">
            {(['NORMAL', 'HEAVY_RAIN', 'RISING_RISK', 'CRITICAL'] as const).map(id => (
              <button
                key={id}
                onClick={() => setScenario(id)}
                className={`rounded-full px-2.5 py-0.5 font-medium transition-all ${
                  currentScenario.id === id
                    ? id === 'CRITICAL' ? 'bg-red-600 text-white'
                      : id === 'RISING_RISK' ? 'bg-orange-500 text-white'
                      : id === 'HEAVY_RAIN' ? 'bg-yellow-500 text-white'
                      : 'bg-green-600 text-white'
                    : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                {id.replace(/_/g, ' ')}
              </button>
            ))}
            <button
              onClick={toggleSimulation}
              className={`rounded-full px-2.5 py-0.5 font-medium transition-all flex items-center gap-1 ml-1 ${
                isSimulating ? 'bg-blue-700 text-white' : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              <span className={`h-1.5 w-1.5 rounded-full ${isSimulating ? 'bg-white animate-pulse' : 'bg-slate-400'}`} />
              {isSimulating ? 'Stop' : 'Auto'}
            </button>
          </div>
        </div>

        {/* Layer control */}
        <div className="absolute top-3 left-3 z-10 flex flex-col gap-2">
          <button
            onClick={() => setShowLayers(o => !o)}
            className="flex items-center gap-2 rounded-md bg-white border border-slate-200 px-3 py-2 text-xs font-medium text-slate-700 shadow hover:bg-slate-50"
          >
            <Layers className="h-3.5 w-3.5" /> Layers
          </button>

          {showLayers && (
            <div className="rounded-lg bg-white border border-slate-200 shadow-lg p-3 min-w-[180px] animate-fade-in">
              <p className="text-xs font-semibold text-slate-700 mb-2">Data Layers</p>
              {layers.map(layer => (
                <label key={layer.id} className={`flex items-center gap-2 py-1 ${!layer.available ? 'opacity-40 cursor-not-allowed' : 'cursor-pointer'}`}>
                  <input
                    type="checkbox"
                    checked={layer.enabled}
                    onChange={() => setLayers(ls => ls.map(l => l.id === layer.id && l.available ? { ...l, enabled: !l.enabled } : l))}
                    disabled={!layer.available}
                    className="rounded border-slate-300 text-blue-600"
                  />
                  <span className="text-xs text-slate-700 flex-1">{layer.label}</span>
                  {!layer.available && <span className="text-[9px] text-slate-400">Planned</span>}
                </label>
              ))}
              <p className="text-[9px] text-slate-400 mt-2 border-t border-slate-100 pt-1.5">Additional layers available when real data feeds are integrated</p>
            </div>
          )}
        </div>

        {/* Legend */}
        <div className="absolute bottom-8 left-3 z-10 rounded-lg bg-white border border-slate-200 shadow p-3">
          <p className="text-xs font-semibold text-slate-700 mb-2">Risk Level</p>
          {riskLevels.map(({ level, label }) => (
            <div key={level} className="flex items-center gap-2 mb-1">
              <span className="h-3 w-3 rounded-full" style={{ backgroundColor: getRiskColor(level) }} />
              <span className="text-xs text-slate-600">{label}</span>
            </div>
          ))}
          <p className="text-[10px] text-slate-400 mt-1 border-t border-slate-100 pt-1">Demo Data — Click marker to select</p>
        </div>

        {/* Selected location intelligence panel */}
        {selectedLocation && selectedRisk && (
          <div className="absolute top-14 right-3 z-10 w-80 rounded-xl bg-white border border-slate-200 shadow-xl animate-fade-in overflow-hidden">
            {/* Header */}
            <div
              className="flex items-start justify-between px-4 py-3 border-b border-slate-100"
              style={{ borderLeftColor: getRiskColor(selectedRisk.riskLevel), borderLeftWidth: '4px' }}
            >
              <div>
                <div className="flex items-center gap-2">
                  <MapPin className="h-3.5 w-3.5 text-slate-400" />
                  <span className="font-bold text-slate-800">{selectedLocation.name}</span>
                </div>
                <p className="text-xs text-slate-500 mt-0.5">{selectedLocation.district}, {selectedLocation.state}</p>
                <p className="text-[10px] text-slate-400">{selectedLocation.riverBasin} Basin · Elev. {selectedLocation.elevation}m</p>
              </div>
              <button onClick={() => setSelectedLocationId(null)} className="text-slate-400 hover:text-slate-600 mt-0.5">
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="p-4 space-y-3 max-h-[calc(100vh-200px)] overflow-y-auto">
              {/* Risk score + level */}
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-3xl font-bold" style={{ color: getRiskColor(selectedRisk.riskLevel) }}>
                    {Math.round(selectedRisk.riskScore * 100)}%
                  </p>
                  <div className="flex items-center gap-1 mt-0.5">
                    <TrendIcon trend={selectedRisk.trend} />
                    <span className="text-xs text-slate-500">{selectedRisk.trend}</span>
                  </div>
                </div>
                <div className="text-right">
                  <RiskBadge level={selectedRisk.riskLevel} size="lg" />
                  <p className="text-[10px] text-slate-400 mt-1">Confidence: {Math.round(selectedRisk.confidence * 100)}%</p>
                </div>
              </div>

              {/* Environmental conditions */}
              <div className="rounded-lg bg-slate-50 p-3 space-y-2">
                <p className="text-[10px] font-semibold text-slate-500 uppercase tracking-wide">Environmental Conditions</p>
                {[
                  { label: 'Rainfall', value: `${selectedRisk.rainfall} mm/hr`, pct: selectedRisk.rainfall / 130 },
                  { label: 'Soil Moisture', value: `${selectedRisk.soilMoisture}%`, pct: selectedRisk.soilMoisture / 100 },
                  { label: 'Water Level', value: `${selectedRisk.waterLevel} m`, pct: selectedRisk.waterLevel / 4 },
                ].map(item => (
                  <div key={item.label}>
                    <div className="flex justify-between text-xs mb-0.5">
                      <span className="text-slate-500">{item.label}</span>
                      <span className="font-medium text-slate-700">{item.value}</span>
                    </div>
                    <div className="h-1 rounded-full bg-slate-200">
                      <div
                        className="h-1 rounded-full transition-all duration-500"
                        style={{ width: `${Math.min(100, item.pct * 100)}%`, backgroundColor: getRiskColor(selectedRisk.riskLevel) }}
                      />
                    </div>
                  </div>
                ))}
                <div className="flex justify-between text-xs pt-1">
                  <span className="text-slate-500">Terrain Vulnerability</span>
                  <span className="font-medium text-slate-700">{selectedRisk.slopeRisk}</span>
                </div>
              </div>

              {/* Model status */}
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-500">Model Status</span>
                <span className="rounded-full bg-amber-50 border border-amber-200 px-2 py-0.5 text-amber-700 font-medium">
                  AWAITING VALIDATION
                </span>
              </div>

              {/* AI Explanation */}
              {selectedRisk.aiExplanation && (
                <div className="rounded-md border border-blue-100 bg-blue-50 p-2.5">
                  <p className="text-[10px] font-semibold text-blue-600 uppercase tracking-wide mb-1">AI Explanation — Prototype</p>
                  <p className="text-xs text-slate-700 leading-relaxed">{selectedRisk.aiExplanation}</p>
                </div>
              )}

              <p className="text-[10px] text-slate-400">Simulated demo data — not for operational use</p>

              {/* Action buttons */}
              <div className="flex flex-col gap-2 pt-1 border-t border-slate-100">
                <button
                  onClick={handleViewPrediction}
                  className="flex items-center justify-center gap-2 w-full rounded-lg bg-blue-700 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-800 transition-colors"
                >
                  <Brain className="h-4 w-4" /> View Full Prediction
                </button>
                <button
                  onClick={handleViewSafety}
                  className="flex items-center justify-center gap-2 w-full rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors"
                >
                  <Shield className="h-4 w-4" /> Safety Guidance
                </button>
              </div>
            </div>
          </div>
        )}

        {/* No selection hint */}
        {!selectedLocation && (
          <div className="absolute bottom-16 left-1/2 -translate-x-1/2 z-10 pointer-events-none">
            <div className="rounded-full bg-white/90 border border-slate-200 shadow px-4 py-2 text-xs text-slate-500 backdrop-blur flex items-center gap-2">
              <MapPin className="h-3.5 w-3.5" />
              Click a location marker to view intelligence
            </div>
          </div>
        )}

        {/* Alert indicator for high/critical */}
        {Object.values(scenarioRiskData).some(r => r.riskLevel === 'CRITICAL') && (
          <div className="absolute top-3 right-16 z-10">
            <div className="flex items-center gap-1.5 rounded-full bg-red-600 text-white px-3 py-1 text-xs font-semibold shadow">
              <AlertTriangle className="h-3.5 w-3.5" />
              <span className="animate-pulse">CRITICAL RISK ACTIVE</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
