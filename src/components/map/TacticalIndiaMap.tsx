import { useState, useMemo } from 'react';
import { useTheme } from '@/contexts/ThemeContext';
import { MOCK_LOCATIONS } from '@/data/mockLocations';
import { RiskData, RiskLevel } from '@/types';
import { getRiskColor } from '@/lib/utils';
import { CloudRain, Droplets, Waves, MapPin, ZoomIn, Compass } from 'lucide-react';

interface TacticalIndiaMapProps {
  selectedLocationId?: string | null;
  onSelectLocation?: (locationId: string) => void;
  scenarioRiskData?: Record<string, RiskData>;
  height?: string | number;
  className?: string;
  isCompact?: boolean;
}

// ── Geographic bounds for accurate projection ──────────────────────────
const MIN_LNG = 68.0;
const MAX_LNG = 97.5;
const MIN_LAT = 8.0;
const MAX_LAT = 37.2;

const SVG_WIDTH = 800;
const SVG_HEIGHT = 720;
const MARGIN_X = 40;
const MARGIN_Y = 30;
const USABLE_WIDTH = 720;
const USABLE_HEIGHT = 660;

function projectCoords(lng: number, lat: number) {
  const x = MARGIN_X + ((lng - MIN_LNG) / (MAX_LNG - MIN_LNG)) * USABLE_WIDTH;
  const y = MARGIN_Y + ((MAX_LAT - lat) / (MAX_LAT - MIN_LAT)) * USABLE_HEIGHT;
  return { x: Math.round(x * 10) / 10, y: Math.round(y * 10) / 10 };
}

// ── Precise Sovereign India Outline Path (viewBox 0 0 800 720) ─────────
const INDIA_COAST_PATH = `
  M 254 37
  L 230 48
  L 186 61
  L 191 106
  L 211 143
  L 198 156
  L 181 195
  L 155 220
  L 113 260
  L 108 310
  L 54 332
  L 59 355
  L 66 366
  L 93 398
  L 140 382
  L 157 393
  L 157 443
  L 174 518
  L 205 576
  L 230 617
  L 242 646
  L 259 678
  L 273 687
  L 286 671
  L 315 660
  L 327 637
  L 340 574
  L 342 513
  L 386 488
  L 413 470
  L 457 423
  L 501 385
  L 533 382
  L 552 351
  L 540 310
  L 535 272
  L 530 253
  L 543 235
  L 550 253
  L 572 265
  L 620 256
  L 637 240
  L 686 220
  L 752 231
  L 735 256
  L 699 283
  L 682 317
  L 657 355
  L 633 351
  L 608 333
  L 623 301
  L 572 295
  L 572 279
  L 535 272
  L 530 265
  L 455 260
  L 406 251
  L 364 226
  L 338 215
  L 352 188
  L 320 170
  L 296 163
  L 279 136
  L 303 113
  L 308 79
  L 271 68
  Z
`;

// ── Himalayan Flash Flood Vulnerability Arc (High Risk Zone) ───────────
const HIMALAYAN_ARC_PATH = `
  M 186 61
  Q 250 110 320 170
  Q 430 215 543 235
  Q 637 240 752 231
  L 735 256
  Q 630 265 540 260
  Q 420 240 315 200
  Q 220 145 191 106
  Z
`;

export function TacticalIndiaMap({
  selectedLocationId,
  onSelectLocation,
  scenarioRiskData = {},
  height = '100%',
  className = '',
  isCompact = false,
}: TacticalIndiaMapProps) {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  // Zoom view state: 'national' (All India) or 'himalayan' (Uttarakhand/Himalayan Corridor Zoom)
  const [zoomMode, setZoomMode] = useState<'national' | 'himalayan'>(isCompact ? 'himalayan' : 'national');
  const [hoveredLocId, setHoveredLocId] = useState<string | null>(null);

  // Plotted locations with projected coordinates
  const plottedLocations = useMemo(() => {
    return MOCK_LOCATIONS.map((loc) => {
      const { x, y } = projectCoords(loc.coordinates.lng, loc.coordinates.lat);
      const risk = scenarioRiskData[loc.id];
      const riskLevel: RiskLevel = risk?.riskLevel ?? 'LOW';
      const riskScore = risk?.riskScore ?? 0.2;
      const color = getRiskColor(riskLevel);

      return {
        ...loc,
        x,
        y,
        riskLevel,
        riskScore,
        color,
        rainfall: risk?.rainfall ?? 24,
        soilMoisture: risk?.soilMoisture ?? 42,
        waterLevel: risk?.waterLevel ?? 1.1,
      };
    });
  }, [scenarioRiskData]);

  const activeLocation = useMemo(() => {
    const targetId = hoveredLocId || selectedLocationId;
    if (!targetId) return plottedLocations[0];
    const targetLower = String(targetId).toLowerCase();
    return plottedLocations.find((l) =>
      l.id === targetId ||
      l.name.toLowerCase().includes(targetLower) ||
      targetLower.includes(l.name.toLowerCase())
    ) ?? plottedLocations[0];
  }, [hoveredLocId, selectedLocationId, plottedLocations]);

  // ViewBox calculation based on zoom mode
  const currentViewBox = zoomMode === 'himalayan'
    ? '200 90 240 180' // Zoom directly into the Himalayan Flash Flood Corridor (Uttarakhand & HP)
    : '0 0 800 720';   // Full Republic of India Overview

  return (
    <div
      className={`relative w-full h-full overflow-hidden select-none flex flex-col justify-between ${className}`}
      style={{
        background: isDark
          ? 'radial-gradient(ellipse at 50% 40%, #0d1a29 0%, #070d15 100%)'
          : 'radial-gradient(ellipse at 50% 40%, #f1f5f9 0%, #e2e8f0 100%)',
        minHeight: typeof height === 'number' ? `${height}px` : height,
      }}
    >
      {/* ── Top Tactical HUD Header ───────────────────────────────────── */}
      <div className="relative z-20 flex items-center justify-between p-3 sm:p-4 backdrop-blur-md border-b border-slate-500/15">
        <div className="flex items-center gap-2.5">
          <span className="relative flex h-2.5 w-2.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-sky-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-sky-500" />
          </span>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-govt font-bold text-xs tracking-wider uppercase text-sky-400">
                INDIA NATIONAL DISASTER TELEMETRY
              </span>
              <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-sky-500/10 text-sky-400 border border-sky-500/25">
                ISRO / IMD / CWC
              </span>
            </div>
            <p className="text-[10px] text-slate-400 font-mono">
              Himalayan Flash Flood Vulnerability Corridor · 10 Active Telemetry Nodes
            </p>
          </div>
        </div>

        {/* View Mode Zoom Controls */}
        <div className="flex items-center gap-1.5 bg-black/30 p-1 rounded-lg border border-slate-500/20 backdrop-blur-md">
          <button
            type="button"
            onClick={() => setZoomMode('national')}
            className={`px-2.5 py-1 rounded text-[11px] font-mono font-semibold transition-all flex items-center gap-1 ${
              zoomMode === 'national'
                ? 'bg-sky-500 text-white shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
            title="All India Overview"
          >
            <Compass className="h-3 w-3" /> All India
          </button>
          <button
            type="button"
            onClick={() => setZoomMode('himalayan')}
            className={`px-2.5 py-1 rounded text-[11px] font-mono font-semibold transition-all flex items-center gap-1 ${
              zoomMode === 'himalayan'
                ? 'bg-sky-500 text-white shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
            title="Zoom into Himalayan Flash Flood Corridor"
          >
            <ZoomIn className="h-3 w-3" /> Himalayan Corridor
          </button>
        </div>
      </div>

      {/* ── Main Map Canvas with SVG Projection ────────────────────────── */}
      <div className="relative flex-1 w-full h-full min-h-0 flex items-center justify-center p-2">
        {/* Subtle Background Coordinates Grid */}
        <div
          className="absolute inset-0 pointer-events-none opacity-20"
          style={{
            backgroundImage: 'linear-gradient(rgba(56, 189, 248, 0.2) 1px, transparent 1px), linear-gradient(90deg, rgba(56, 189, 248, 0.2) 1px, transparent 1px)',
            backgroundSize: '40px 40px',
          }}
        />

        {/* Simulated Radar Circular Range Rings */}
        <div className="absolute inset-0 pointer-events-none flex items-center justify-center opacity-25">
          <div className="w-[500px] h-[500px] rounded-full border border-sky-400/30 animate-pulse" />
          <div className="absolute w-[340px] h-[340px] rounded-full border border-sky-400/20" />
          <div className="absolute w-[180px] h-[180px] rounded-full border border-sky-400/20" />
        </div>

        {/* Interactive SVG India Silhouette & Alert Beacons */}
        <svg
          viewBox={currentViewBox}
          className="w-full h-full transition-all duration-700 ease-in-out"
          preserveAspectRatio="xMidYMid meet"
          style={{ filter: isDark ? 'drop-shadow(0 0 20px rgba(14, 165, 233, 0.15))' : 'none' }}
        >
          <defs>
            {/* Glow Filter for High-Risk Flash Flood Beacons */}
            <filter id="alertGlow" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur stdDeviation="3" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>

            {/* Himalayan Vulnerability Arc Gradient */}
            <linearGradient id="himalayanGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#38bdf8" stopOpacity="0.45" />
              <stop offset="50%" stopColor="#0284c7" stopOpacity="0.35" />
              <stop offset="100%" stopColor="#ef4444" stopOpacity="0.4" />
            </linearGradient>

            {/* India Territory Gradient */}
            <linearGradient id="indiaBodyGradient" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor={isDark ? '#0f2438' : '#e2e8f0'} stopOpacity="0.85" />
              <stop offset="100%" stopColor={isDark ? '#091522' : '#cbd5e1'} stopOpacity="0.95" />
            </linearGradient>
          </defs>

          {/* India Sovereign Territory Path */}
          <path
            d={INDIA_COAST_PATH}
            fill="url(#indiaBodyGradient)"
            stroke={isDark ? '#38bdf8' : '#0284c7'}
            strokeWidth={zoomMode === 'himalayan' ? '0.8' : '1.8'}
            strokeLinejoin="round"
            strokeLinecap="round"
            className="transition-colors duration-500"
          />

          {/* Himalayan Flash Flood Vulnerability Arc Highlight */}
          <path
            d={HIMALAYAN_ARC_PATH}
            fill="url(#himalayanGradient)"
            stroke="#38bdf8"
            strokeWidth={zoomMode === 'himalayan' ? '0.6' : '1.2'}
            strokeDasharray="4 2"
            className="animate-pulse"
          />

          {/* Major River Inundation Arteries */}
          <g stroke={isDark ? 'rgba(56, 189, 248, 0.45)' : 'rgba(2, 132, 199, 0.5)'} fill="none" strokeWidth={zoomMode === 'himalayan' ? '0.7' : '1.2'}>
            {/* Ganga & Mandakini Corridor */}
            <path d="M 310 180 Q 360 230 450 250 T 533 382" />
            {/* Indus & Sutlej / Beas System */}
            <path d="M 264 149 Q 220 180 180 230" />
            {/* Brahmaputra Surge Corridor */}
            <path d="M 686 220 Q 640 240 619 280 T 552 351" />
          </g>

          {/* Region Annotations */}
          {zoomMode === 'national' && (
            <g className="font-mono text-[9px] font-semibold" fill={isDark ? '#94a3b8' : '#475569'}>
              <text x="210" y="80" textAnchor="middle">LADAKH / J&K</text>
              <text x="330" y="160" textAnchor="middle" fill="#38bdf8">UTTARAKHAND</text>
              <text x="235" y="150" textAnchor="middle">HIMACHAL</text>
              <text x="560" y="225" textAnchor="middle" fill="#38bdf8">SIKKIM</text>
              <text x="645" y="270" textAnchor="middle">ASSAM</text>
              <text x="270" y="650" textAnchor="middle">PENINSULAR INDIA</text>
            </g>
          )}

          {/* Alert Beacons Plotted at Real Coordinates */}
          {plottedLocations.map((loc) => {
            const isSelected = loc.id === selectedLocationId || (selectedLocationId ? loc.name.toLowerCase().includes(String(selectedLocationId).toLowerCase()) : false);
            const isHovered = loc.id === hoveredLocId;
            const isCritical = loc.riskLevel === 'CRITICAL';
            const isHigh = loc.riskLevel === 'HIGH';

            // Marker radius adjusted based on zoom mode
            const r = zoomMode === 'himalayan' ? 3.5 : 5.5;

            return (
              <g
                key={loc.id}
                className="cursor-pointer transition-transform duration-200"
                onClick={() => onSelectLocation?.(loc.id)}
                onMouseEnter={() => setHoveredLocId(loc.id)}
                onMouseLeave={() => setHoveredLocId(null)}
              >
                {/* Expanding Pulse Ring for Critical / High Alerts */}
                {(isCritical || isHigh || isSelected) && (
                  <circle
                    cx={loc.x}
                    cy={loc.y}
                    r={r * 2.8}
                    fill="none"
                    stroke={loc.color}
                    strokeWidth={zoomMode === 'himalayan' ? '0.6' : '1.2'}
                    opacity="0.75"
                    className="animate-ping"
                  />
                )}

                {/* Outer Glow Halo */}
                <circle
                  cx={loc.x}
                  cy={loc.y}
                  r={r * 1.8}
                  fill={loc.color}
                  opacity={isSelected ? 0.35 : 0.2}
                />

                {/* Core Beacon Dot */}
                <circle
                  cx={loc.x}
                  cy={loc.y}
                  r={r}
                  fill={loc.color}
                  stroke={isSelected ? '#ffffff' : 'rgba(255,255,255,0.7)'}
                  strokeWidth={zoomMode === 'himalayan' ? '0.8' : '1.5'}
                  filter="url(#alertGlow)"
                />

                {/* Station Name Label */}
                {(zoomMode === 'himalayan' || isSelected || isHovered || isCritical) && (
                  <g transform={`translate(${loc.x + (zoomMode === 'himalayan' ? 5 : 8)}, ${loc.y + 3})`}>
                    <rect
                      x="-2"
                      y="-8"
                      width={loc.name.length * (zoomMode === 'himalayan' ? 4.5 : 6) + 12}
                      height={zoomMode === 'himalayan' ? '10' : '13'}
                      rx="3"
                      fill={isDark ? 'rgba(7, 13, 21, 0.88)' : 'rgba(255, 255, 255, 0.95)'}
                      stroke={isSelected ? '#38bdf8' : (isDark ? 'rgba(255,255,255,0.15)' : '#cbd5e1')}
                      strokeWidth="0.6"
                    />
                    <text
                      x="3"
                      y={zoomMode === 'himalayan' ? '-0.5' : '1.5'}
                      fill={isDark ? '#f8fafc' : '#0f172a'}
                      fontSize={zoomMode === 'himalayan' ? '5.5' : '7.5'}
                      fontFamily="monospace"
                      fontWeight="bold"
                    >
                      {loc.name}
                    </text>
                  </g>
                )}
              </g>
            );
          })}
        </svg>
      </div>

      {/* ── Bottom Presentation Status HUD ───────────────────────────── */}
      <div className="relative z-20 p-3 sm:p-4 backdrop-blur-md border-t border-slate-500/15">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-center">
          {/* Active Station Overview */}
          <div className="md:col-span-6 flex items-center gap-3">
            <div
              className="p-2 rounded-xl shrink-0"
              style={{
                background: `${activeLocation.color}18`,
                border: `1px solid ${activeLocation.color}40`,
              }}
            >
              <MapPin className="h-4 w-4" style={{ color: activeLocation.color }} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-govt font-bold text-sm" style={{ color: isDark ? '#f8fafc' : '#0f172a' }}>
                  {activeLocation.name}
                </span>
                <span
                  className="text-[10px] font-mono font-bold px-2 py-0.5 rounded"
                  style={{
                    background: `${activeLocation.color}20`,
                    color: activeLocation.color,
                    border: `1px solid ${activeLocation.color}45`,
                  }}
                >
                  {activeLocation.riskLevel} · {Math.round(activeLocation.riskScore * 100)}%
                </span>
              </div>
              <p className="text-xs text-slate-400">
                {activeLocation.district}, {activeLocation.state} · {activeLocation.riverBasin} Basin (Elev. {activeLocation.elevation}m)
              </p>
            </div>
          </div>

          {/* Real-time Telemetry Metrics for Presentation */}
          <div className="md:col-span-6 flex items-center justify-end gap-4 text-xs font-mono">
            <div className="flex items-center gap-1.5 bg-black/20 px-2.5 py-1 rounded-lg border border-slate-500/15">
              <CloudRain className="h-3.5 w-3.5 text-sky-400" />
              <span className="text-slate-400">Rain:</span>
              <span className="font-bold text-sky-400">{activeLocation.rainfall} mm/h</span>
            </div>

            <div className="flex items-center gap-1.5 bg-black/20 px-2.5 py-1 rounded-lg border border-slate-500/15">
              <Droplets className="h-3.5 w-3.5 text-sky-400" />
              <span className="text-slate-400">Soil:</span>
              <span className="font-bold text-sky-400">{activeLocation.soilMoisture}%</span>
            </div>

            <div className="flex items-center gap-1.5 bg-black/20 px-2.5 py-1 rounded-lg border border-slate-500/15">
              <Waves className="h-3.5 w-3.5 text-sky-400" />
              <span className="text-slate-400">Water:</span>
              <span className="font-bold text-sky-400">+{activeLocation.waterLevel}m</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
