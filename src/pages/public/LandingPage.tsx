import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowRight, ChevronDown, Activity, Database, Map, Bell,
  CloudRain, Droplets, Layers, Waves, AlertTriangle, ShieldCheck,
  Radio, Compass, Sparkles, Check
} from 'lucide-react';
import { ROUTES } from '@/lib/constants';
import { useTheme } from '@/contexts/ThemeContext';
import { ThemeToggle } from '@/components/ui/ThemeToggle';
import { AarakshLogo } from '@/components/ui/AarakshLogo';
import { RainEffect } from '@/components/ui/RainEffect';

// ── Live simulated sensor feed for hero card ──────────────────────────
const HERO_TELEMETRY = [
  { rain: 12, moisture: 61, water: 'Stable', status: 'Optimal' },
  { rain: 14, moisture: 62, water: 'Stable', status: 'Optimal' },
  { rain: 18, moisture: 65, water: 'Rising +0.3m', status: 'Elevating' },
  { rain: 13, moisture: 61, water: 'Stable', status: 'Optimal' },
];

// ── Preview Locations for Intelligence Section ────────────────────────
const PREVIEW_LOCATIONS = [
  { id: 'rambara', name: 'Rambara', district: 'Rudraprayag', risk: 'CRITICAL', score: 0.88, rain: 112, soil: 91, water: '3.4m (+1.2m)', trend: 'Increasing ↑', elevation: '2,740m' },
  { id: 'gaurikund', name: 'Gaurikund', district: 'Rudraprayag', risk: 'HIGH', score: 0.71, rain: 96, soil: 81, water: '2.8m (+0.7m)', trend: 'Increasing ↑', elevation: '1,982m' },
  { id: 'sonprayag', name: 'Sonprayag', district: 'Rudraprayag', risk: 'HIGH', score: 0.63, rain: 76, soil: 69, water: '2.1m (+0.3m)', trend: 'Stable →', elevation: '1,820m' },
  { id: 'agastyamuni', name: 'Agastyamuni', district: 'Rudraprayag', risk: 'MODERATE', score: 0.44, rain: 42, soil: 54, water: '1.6m (Normal)', trend: 'Stable →', elevation: '1,000m' },
  { id: 'rudraprayag', name: 'Rudraprayag Town', district: 'Rudraprayag', risk: 'LOW', score: 0.22, rain: 24, soil: 42, water: '1.1m (Normal)', trend: 'Decreasing ↓', elevation: '895m' },
];

const RISK_COLOR: Record<string, string> = {
  CRITICAL: '#ef4444',
  HIGH: '#f97316',
  MODERATE: '#eab308',
  LOW: '#22c55e',
};

export function LandingPage() {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  // Hero headline slide state (0: "THE MOUNTAINS SPEAK FIRST.", 1: "THE LAND IS ALWAYS TELLING US SOMETHING.")
  const [activeSlide, setActiveSlide] = useState<0 | 1>(0);
  const [telemetryIndex, setTelemetryIndex] = useState(0);
  const [selectedLocId, setSelectedLocId] = useState('rambara');
  const [intelligenceTab, setIntelligenceTab] = useState<'risk' | 'rainfall' | 'soil' | 'water'>('risk');
  const [rainActive, setRainActive] = useState(true);

  // Cycle telemetry tick
  useEffect(() => {
    const timer = setInterval(() => {
      setTelemetryIndex((prev) => (prev + 1) % HERO_TELEMETRY.length);
    }, 4500);
    return () => clearInterval(timer);
  }, []);

  // Ambient auto-cycle between the two hero statements every 10 seconds
  useEffect(() => {
    const timer = setInterval(() => {
      setActiveSlide((prev) => (prev === 0 ? 1 : 0));
    }, 10000);
    return () => clearInterval(timer);
  }, []);

  const currentTelemetry = HERO_TELEMETRY[telemetryIndex];
  const activeLocation = PREVIEW_LOCATIONS.find((l) => l.id === selectedLocId) ?? PREVIEW_LOCATIONS[0];

  return (
    <div
      className="min-h-screen transition-colors duration-300 selection:bg-sky-500 selection:text-white"
      style={{
        backgroundColor: isDark ? '#070d15' : '#f4f7fb',
        color: isDark ? '#f8fafc' : '#0f172a',
      }}
    >
      {/* ── Fixed Navigation Bar ────────────────────────────────────────── */}
      <header
        className="fixed top-0 left-0 right-0 z-50 transition-colors duration-300 backdrop-blur-md"
        style={{
          background: isDark ? 'rgba(7, 13, 21, 0.85)' : 'rgba(255, 255, 255, 0.88)',
          borderBottom: isDark ? '1px solid rgba(56, 189, 248, 0.12)' : '1px solid rgba(203, 213, 225, 0.7)',
        }}
      >
        <div className="mx-auto max-w-7xl px-6 h-18 flex items-center justify-between">
          {/* Brand Logo with Mountain Peak & Wave Symbol */}
          <Link to={ROUTES.LANDING} className="flex items-center gap-3 group">
            <AarakshLogo size="md" />
            <span
              className="font-bold tracking-[0.2em] text-sm uppercase transition-colors"
              style={{ color: isDark ? '#ffffff' : '#0f172a' }}
            >
              AARAKSH
            </span>
          </Link>

          {/* Navigation Links */}
          <nav className="hidden md:flex items-center gap-9">
            {[
              { label: 'ABOUT', href: '#about' },
              { label: 'HOW IT WORKS', href: '#how-it-works' },
              { label: 'INTELLIGENCE', href: '#intelligence' },
            ].map((link) => (
              <a
                key={link.label}
                href={link.href}
                className="text-xs font-semibold tracking-[0.16em] transition-colors duration-200"
                style={{
                  color: isDark ? 'rgba(241, 245, 249, 0.7)' : 'rgba(51, 65, 85, 0.8)',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.color = isDark ? '#38bdf8' : '#0284c7';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.color = isDark ? 'rgba(241, 245, 249, 0.7)' : 'rgba(51, 65, 85, 0.8)';
                }}
              >
                {link.label}
              </a>
            ))}
          </nav>

          {/* Right Action Buttons */}
          <div className="flex items-center gap-3">
            {/* Theme Toggle Button */}
            <ThemeToggle variant="icon" />

            {/* Access AARAKSH Button */}
            <Link
              to={ROUTES.LOGIN}
              className="rounded-lg px-4 py-2 text-xs font-semibold uppercase tracking-[0.12em] transition-all duration-200 hover:scale-[1.02]"
              style={{
                background: isDark ? 'rgba(14, 28, 46, 0.8)' : 'rgba(255, 255, 255, 0.95)',
                border: isDark ? '1px solid rgba(56, 189, 248, 0.35)' : '1px solid rgba(2, 132, 199, 0.4)',
                color: isDark ? '#f8fafc' : '#0284c7',
                boxShadow: isDark
                  ? '0 0 16px rgba(56, 189, 248, 0.1)'
                  : '0 2px 8px rgba(2, 132, 199, 0.12)',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = isDark ? '#38bdf8' : '#0284c7';
                e.currentTarget.style.background = isDark ? 'rgba(56, 189, 248, 0.12)' : 'rgba(2, 132, 199, 0.08)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = isDark ? 'rgba(56, 189, 248, 0.35)' : 'rgba(2, 132, 199, 0.4)';
                e.currentTarget.style.background = isDark ? 'rgba(14, 28, 46, 0.8)' : 'rgba(255, 255, 255, 0.95)';
              }}
            >
              ACCESS AARAKSH
            </Link>
          </div>
        </div>
      </header>

      {/* ── HERO SECTION ────────────────────────────────────────────────── */}
      <section className="relative min-h-screen flex flex-col justify-between pt-28 pb-8 px-6 lg:px-12 overflow-hidden">
        {/* Consistent Single Mountain Photo with Atmospheric Overlays */}
        <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
          <img
            src="/mountains-dark.jpg"
            alt="Himalayan Mountain Range"
            className="w-full h-full object-cover object-center transform scale-105"
            style={{
              filter: isDark ? 'brightness(0.72) contrast(1.18)' : 'brightness(0.85) contrast(1.08)',
              transition: 'filter 0.5s ease',
            }}
          />

          {/* Unified Atmospheric Gradient Overlay */}
          <div
            className="absolute inset-0 transition-colors duration-500"
            style={{
              background: isDark
                ? 'radial-gradient(ellipse at 50% 35%, rgba(7, 13, 21, 0.3) 0%, rgba(7, 13, 21, 0.85) 75%, rgba(7, 13, 21, 0.98) 100%)'
                : 'radial-gradient(ellipse at 50% 35%, rgba(244, 247, 251, 0.3) 0%, rgba(244, 247, 251, 0.75) 75%, rgba(244, 247, 251, 0.96) 100%)',
            }}
          />

          {/* Realistic Canvas Rain Effect over Mountain Ridge */}
          {rainActive && <RainEffect intensity="moderate" />}
        </div>

        {/* Floating LIVE SIGNAL DEMO Card (Top Right, as in Screenshot) */}
        <div className="relative z-20 mx-auto max-w-7xl w-full flex justify-end">
          <div
            className="rounded-xl p-4 w-64 backdrop-blur-xl transition-all duration-300 shadow-2xl animate-fade-in"
            style={{
              background: isDark ? 'rgba(10, 20, 32, 0.82)' : 'rgba(255, 255, 255, 0.92)',
              border: isDark ? '1px solid rgba(56, 189, 248, 0.25)' : '1px solid rgba(2, 132, 199, 0.3)',
              boxShadow: isDark
                ? '0 16px 36px rgba(0, 0, 0, 0.55), inset 0 1px 0 rgba(255, 255, 255, 0.1)'
                : '0 12px 30px rgba(0, 0, 0, 0.08)',
            }}
          >
            {/* Header row: Green pulse dot + LIVE SIGNAL + DEMO */}
            <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-500/20">
              <div className="flex items-center gap-2">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
                </span>
                <span className="text-[11px] font-bold tracking-[0.14em] uppercase text-sky-400">
                  LIVE SIGNAL
                </span>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setRainActive((r) => !r)}
                  title={rainActive ? 'Pause rain effect' : 'Activate rain effect'}
                  className="text-[10px] text-slate-400 hover:text-sky-400 transition-colors flex items-center gap-1 font-mono"
                >
                  <CloudRain className={`h-3 w-3 ${rainActive ? 'text-sky-400' : 'text-slate-500'}`} />
                </button>
                <span className="text-[10px] font-semibold tracking-wider text-slate-400 uppercase">
                  DEMO
                </span>
              </div>
            </div>

            {/* Signal rows */}
            <div className="space-y-2 text-xs">
              <div className="flex items-center justify-between">
                <span className="text-slate-400 font-medium">Rainfall</span>
                <span className="font-bold tracking-tight text-sky-400 font-mono">
                  {currentTelemetry.rain} mm/hr
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-400 font-medium">Soil moisture</span>
                <span className="font-bold tracking-tight text-sky-400 font-mono">
                  {currentTelemetry.moisture}%
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-400 font-medium">Water level</span>
                <span className="font-bold tracking-tight text-sky-400">
                  {currentTelemetry.water}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Main Hero Headline Area */}
        <div className="relative z-10 mx-auto max-w-7xl w-full my-auto py-8">
          <div className="max-w-4xl">
            {/* Slide Switcher Controls */}
            <div className="flex items-center gap-2 mb-4">
              <button
                type="button"
                onClick={() => setActiveSlide(0)}
                className="text-[11px] font-mono tracking-widest px-2.5 py-1 rounded transition-colors"
                style={{
                  background: activeSlide === 0 ? 'rgba(56, 189, 248, 0.18)' : 'transparent',
                  color: activeSlide === 0 ? '#38bdf8' : (isDark ? '#64748b' : '#94a3b8'),
                }}
              >
                01 · MOUNTAINS
              </button>
              <span className="text-slate-500 text-xs">/</span>
              <button
                type="button"
                onClick={() => setActiveSlide(1)}
                className="text-[11px] font-mono tracking-widest px-2.5 py-1 rounded transition-colors"
                style={{
                  background: activeSlide === 1 ? 'rgba(56, 189, 248, 0.18)' : 'transparent',
                  color: activeSlide === 1 ? '#38bdf8' : (isDark ? '#64748b' : '#94a3b8'),
                }}
              >
                02 · LAND SIGNALS
              </button>
            </div>

            {/* Slide 0: THE MOUNTAINS SPEAK FIRST. */}
            {activeSlide === 0 && (
              <div className="animate-fade-in">
                {/* Eyebrow */}
                <p className="text-xs sm:text-sm font-semibold tracking-[0.24em] uppercase mb-6 text-sky-400">
                  FLASH FLOOD INTELLIGENCE — HIMALAYAS
                </p>

                {/* Massive Editorial Headline */}
                <h1
                  className="font-editorial text-5xl sm:text-7xl md:text-8xl lg:text-[6.5rem] tracking-tight mb-6 uppercase"
                  style={{
                    lineHeight: 0.95,
                    fontFamily: 'Cormorant Garamond, Georgia, serif',
                    color: isDark ? '#ffffff' : '#0f172a',
                    textShadow: isDark ? '0 4px 24px rgba(0, 0, 0, 0.6)' : 'none',
                  }}
                >
                  THE MOUNTAINS
                  <br />
                  <span
                    className="editorial-italic font-normal lowercase tracking-normal"
                    style={{
                      fontStyle: 'italic',
                      fontFamily: 'Cormorant Garamond, Georgia, serif',
                      textTransform: 'none',
                    }}
                  >
                    speak first.
                  </span>
                </h1>

                {/* Subtitle */}
                <p
                  className="text-base sm:text-lg md:text-xl font-normal max-w-xl mb-9 leading-relaxed"
                  style={{ color: isDark ? 'rgba(226, 232, 240, 0.85)' : 'rgba(51, 65, 85, 0.9)' }}
                >
                  We listen to the signals before the danger arrives.
                </p>

                {/* Explore Button */}
                <div className="flex items-center gap-4">
                  <Link
                    to={ROUTES.LOGIN}
                    className="inline-flex items-center gap-2.5 rounded-lg px-6 py-3.5 text-xs sm:text-sm font-bold tracking-[0.14em] uppercase text-white shadow-lg transition-all duration-200 hover:scale-105"
                    style={{
                      background: '#0284c7',
                      boxShadow: '0 6px 24px rgba(2, 132, 199, 0.45)',
                    }}
                  >
                    EXPLORE AARAKSH <ArrowRight className="h-4 w-4" />
                  </Link>

                  <a
                    href="#how-it-works"
                    className="inline-flex items-center gap-2 rounded-lg px-5 py-3.5 text-xs sm:text-sm font-semibold tracking-wider transition-all duration-200 hover:bg-white/10"
                    style={{
                      color: isDark ? '#f8fafc' : '#334155',
                      border: isDark ? '1px solid rgba(255, 255, 255, 0.18)' : '1px solid rgba(203, 213, 225, 0.85)',
                    }}
                  >
                    HOW IT WORKS
                  </a>
                </div>
              </div>
            )}

            {/* Slide 1: THE LAND IS ALWAYS TELLING US SOMETHING. */}
            {activeSlide === 1 && (
              <div className="animate-fade-in">
                {/* Eyebrow */}
                <p className="text-xs sm:text-sm font-semibold tracking-[0.24em] uppercase mb-6 text-sky-400">
                  ENVIRONMENTAL AWARENESS
                </p>

                {/* Massive Editorial Headline */}
                <h1
                  className="font-editorial text-5xl sm:text-7xl md:text-8xl lg:text-[6.2rem] tracking-tight mb-6 uppercase"
                  style={{
                    lineHeight: 0.95,
                    fontFamily: 'Cormorant Garamond, Georgia, serif',
                    color: isDark ? '#ffffff' : '#0f172a',
                    textShadow: isDark ? '0 4px 24px rgba(0, 0, 0, 0.6)' : 'none',
                  }}
                >
                  THE LAND IS
                  <br />
                  ALWAYS
                  <br />
                  <span
                    className="editorial-italic font-normal lowercase tracking-normal"
                    style={{
                      fontStyle: 'italic',
                      fontFamily: 'Cormorant Garamond, Georgia, serif',
                      textTransform: 'none',
                    }}
                  >
                    telling us
                  </span>
                  <br />
                  SOMETHING.
                </h1>

                {/* Explore Button */}
                <div className="flex items-center gap-4 mt-8">
                  <Link
                    to={ROUTES.LOGIN}
                    className="inline-flex items-center gap-2.5 rounded-lg px-6 py-3.5 text-xs sm:text-sm font-bold tracking-[0.14em] uppercase text-white shadow-lg transition-all duration-200 hover:scale-105"
                    style={{
                      background: '#0284c7',
                      boxShadow: '0 6px 24px rgba(2, 132, 199, 0.45)',
                    }}
                  >
                    ACCESS AARAKSH <ArrowRight className="h-4 w-4" />
                  </Link>

                  <a
                    href="#intelligence"
                    className="inline-flex items-center gap-2 rounded-lg px-5 py-3.5 text-xs sm:text-sm font-semibold tracking-wider transition-all duration-200 hover:bg-white/10"
                    style={{
                      color: isDark ? '#f8fafc' : '#334155',
                      border: isDark ? '1px solid rgba(255, 255, 255, 0.18)' : '1px solid rgba(203, 213, 225, 0.85)',
                    }}
                  >
                    VIEW SENSORS
                  </a>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Bottom Hero Metrics Bar & Scroll Indicator */}
        <div className="relative z-10 mx-auto max-w-7xl w-full pt-8">
          <div
            className="w-full mb-6"
            style={{
              height: '1px',
              background: 'linear-gradient(90deg, transparent 0%, rgba(56, 189, 248, 0.3) 25%, rgba(56, 189, 248, 0.3) 75%, transparent 100%)',
            }}
          />

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 text-left">
            <div>
              <p className="text-xs text-slate-400 mb-1">Soil saturation signals</p>
              <p className="text-sm sm:text-base font-semibold text-sky-400 tracking-wide">
                Active monitoring
              </p>
            </div>

            <div>
              <p className="text-xs text-slate-400 mb-1">River gauge stations</p>
              <p className="text-sm sm:text-base font-semibold text-sky-400 tracking-wide">
                12 locations
              </p>
            </div>

            <div>
              <p className="text-xs text-slate-400 mb-1">Rain gauges networked</p>
              <p className="text-sm sm:text-base font-semibold text-sky-400 tracking-wide">
                Rudraprayag district
              </p>
            </div>
          </div>

          <div className="flex flex-col items-center justify-center mt-10">
            <a
              href="#about"
              className="group flex flex-col items-center gap-1.5 text-[11px] font-semibold tracking-[0.2em] uppercase transition-colors"
              style={{ color: isDark ? 'rgba(255, 255, 255, 0.5)' : 'rgba(51, 65, 85, 0.65)' }}
            >
              <span>SCROLL TO EXPLORE</span>
              <ChevronDown className="h-4 w-4 animate-bounce group-hover:translate-y-0.5 transition-transform" />
            </a>
          </div>
        </div>
      </section>

      {/* ── SECTION: THE CHALLENGE / ABOUT (Enhanced) ───────────────────── */}
      <section
        id="about"
        className="py-28 px-6 lg:px-12 transition-colors duration-300 relative overflow-hidden"
        style={{
          backgroundColor: isDark ? '#09111b' : '#ffffff',
          borderTop: isDark ? '1px solid rgba(56, 189, 248, 0.12)' : '1px solid rgba(226, 232, 240, 0.8)',
        }}
      >
        {/* Subtle Background Topographic Grid Accent */}
        <div
          className="absolute inset-0 pointer-events-none opacity-5"
          style={{
            backgroundImage: 'radial-gradient(#38bdf8 1px, transparent 1px)',
            backgroundSize: '28px 28px',
          }}
        />

        <div className="mx-auto max-w-7xl relative z-10">
          <div className="grid lg:grid-cols-12 gap-16 items-center">
            <div className="lg:col-span-6">
              <div
                className="inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs mb-5"
                style={{
                  background: 'rgba(56, 189, 248, 0.12)',
                  border: '1px solid rgba(56, 189, 248, 0.28)',
                  color: isDark ? '#38bdf8' : '#0284c7',
                }}
              >
                <Radio className="h-3.5 w-3.5 animate-pulse text-sky-400" />
                SIH 2026 · Problem SIH26192 · NDRF / MHA
              </div>

              <h2
                className="font-editorial text-4xl sm:text-6xl font-normal leading-[1.05] mb-6"
                style={{
                  fontFamily: 'Cormorant Garamond, Georgia, serif',
                  color: isDark ? '#f8fafc' : '#0f172a',
                }}
              >
                When Minutes
                <br />
                <span className="italic" style={{ color: '#38bdf8' }}>Define Lives.</span>
              </h2>

              <p
                className="text-base sm:text-lg leading-relaxed mb-6"
                style={{ color: isDark ? '#94a3b8' : '#475569' }}
              >
                In the high-altitude river corridors of the Himalayas, cloudbursts unleash sudden surges within 30 to 45 minutes.
                Conventional regional meteorological advisories operate at district grid scales—blind to isolated micro-catchments.
              </p>

              <p
                className="text-sm leading-relaxed mb-8"
                style={{ color: isDark ? '#64748b' : '#64748b' }}
              >
                AARAKSH delivers hyper-local predictive surveillance by coupling satellite precipitation radar, IoT hydrometric river telemetry, high-resolution Digital Elevation Models (DEM), and predictive machine-learning runoff models.
              </p>

              {/* Performance Key Specs */}
              <div className="grid grid-cols-2 gap-4 pt-2 border-t border-slate-500/15">
                <div>
                  <div className="text-2xl font-bold font-mono text-sky-400">15 min</div>
                  <p className="text-xs text-slate-400">Lead-time detection window</p>
                </div>
                <div>
                  <div className="text-2xl font-bold font-mono text-sky-400">100%</div>
                  <p className="text-xs text-slate-400">Autonomous catchment surveillance</p>
                </div>
              </div>
            </div>

            {/* 3 Enhanced Challenge Cards */}
            <div className="lg:col-span-6 grid grid-cols-1 gap-4.5">
              {[
                {
                  icon: <CloudRain className="h-5 w-5 text-sky-400" />,
                  title: 'Cloudburst & Rapid Inflow',
                  tag: 'SURGE DYNAMICS',
                  desc: 'High-intensity convective cloudburst events deliver up to 100mm/hr of rainfall in isolated micro-basins, causing immediate downstream flash inundation.',
                },
                {
                  icon: <Layers className="h-5 w-5 text-sky-400" />,
                  title: 'Steep Topography & Debris Blocking',
                  tag: 'GEOMORPHOLOGY',
                  desc: 'V-shaped mountain gorges concentrate runoff exponentially. Debris blockages create unstable natural dams that fail catastrophically without warning.',
                },
                {
                  icon: <Bell className="h-5 w-5 text-sky-400" />,
                  title: 'Last-Mile Warning Bottlenecks',
                  tag: 'COMMUNICATION',
                  desc: 'Remote pilgrim tracks and vulnerable riverside hamlets require automated fail-safe alert escalation across SMS, IVR, sirens, and field stations.',
                },
              ].map((item, i) => (
                <div
                  key={i}
                  className="rounded-2xl p-6 transition-all duration-300 shadow-sm hover:shadow-lg hover:-translate-y-0.5"
                  style={{
                    background: isDark ? 'rgba(13, 24, 38, 0.72)' : '#ffffff',
                    border: isDark ? '1px solid rgba(56, 189, 248, 0.16)' : '1px solid #e2e8f0',
                  }}
                >
                  <div className="flex items-start gap-4">
                    <div
                      className="p-3 rounded-xl shrink-0"
                      style={{
                        background: 'rgba(56, 189, 248, 0.12)',
                        border: '1px solid rgba(56, 189, 248, 0.25)',
                      }}
                    >
                      {item.icon}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-1.5">
                        <h3
                          className="font-semibold text-base"
                          style={{ color: isDark ? '#f8fafc' : '#0f172a' }}
                        >
                          {item.title}
                        </h3>
                        <span className="text-[10px] font-mono tracking-widest text-sky-400 px-2 py-0.5 rounded bg-sky-500/10">
                          {item.tag}
                        </span>
                      </div>
                      <p
                        className="text-xs sm:text-sm leading-relaxed"
                        style={{ color: isDark ? '#94a3b8' : '#64748b' }}
                      >
                        {item.desc}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── SECTION: HOW IT WORKS (Enhanced Connected Pipeline) ─────────── */}
      <section
        id="how-it-works"
        className="py-28 px-6 lg:px-12 transition-colors duration-300 relative overflow-hidden"
        style={{
          backgroundColor: isDark ? '#070d15' : '#f1f5f9',
          borderTop: isDark ? '1px solid rgba(56, 189, 248, 0.12)' : '1px solid rgba(226, 232, 240, 0.8)',
        }}
      >
        <div className="mx-auto max-w-7xl">
          <div className="text-center max-w-3xl mx-auto mb-18">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] mb-3 text-sky-400">
              END-TO-END PIPELINE
            </p>
            <h2
              className="font-editorial text-4xl sm:text-6xl font-normal leading-tight mb-4"
              style={{
                fontFamily: 'Cormorant Garamond, Georgia, serif',
                color: isDark ? '#f8fafc' : '#0f172a',
              }}
            >
              Intelligence Across <span className="italic" style={{ color: '#38bdf8' }}>Every Layer</span>
            </h2>
            <p className="text-sm sm:text-base leading-relaxed" style={{ color: isDark ? '#94a3b8' : '#64748b' }}>
              Four synchronized operational layers continuously gather, simulate, synthesize, and dispatch real-time hazard intelligence to save lives.
            </p>
          </div>

          {/* 4 Pipeline Steps with Interactive Glow Accents */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16 relative">
            {[
              {
                step: '01',
                title: 'Collect',
                icon: <Database className="h-6 w-6 text-sky-400" />,
                desc: 'Multi-spectral satellite precipitation, automated river level gauges, and soil saturation probes across Uttarakhand.',
                tags: ['Satellite GPM', 'Radar Feeds', 'IoT Mesh'],
              },
              {
                step: '02',
                title: 'Analyse',
                icon: <Activity className="h-6 w-6 text-sky-400" />,
                desc: 'AI hydrological models computing catchment water balance, runoff velocities, and dynamic slope failure probabilities in real-time.',
                tags: ['Runoff Models', 'ML Forecasting', 'Slope Stability'],
              },
              {
                step: '03',
                title: 'Visualise',
                icon: <Map className="h-6 w-6 text-sky-400" />,
                desc: 'High-density GIS digital terrain mapping with live risk contours, catchment boundary overlays, and sensor telemetry.',
                tags: ['30m DEM', 'Risk Contours', 'Live GIS'],
              },
              {
                step: '04',
                title: 'Alert',
                icon: <Bell className="h-6 w-6 text-sky-400" />,
                desc: 'Multi-tiered early warning broadcast: automated SMS dispatch to district magistrates, NDRF battalions, and community sirens.',
                tags: ['NDRF Gateway', 'SMS / IVR', 'Village Sirens'],
              },
            ].map((st, i) => (
              <div
                key={i}
                className="relative rounded-2xl p-6.5 transition-all duration-300 hover:-translate-y-1.5 shadow-md group flex flex-col justify-between"
                style={{
                  background: isDark ? 'rgba(13, 24, 38, 0.82)' : '#ffffff',
                  border: isDark ? '1px solid rgba(56, 189, 248, 0.18)' : '1px solid #e2e8f0',
                }}
              >
                <div>
                  <div className="flex items-center justify-between mb-5">
                    <span
                      className="text-xs font-mono font-bold tracking-widest px-2.5 py-1 rounded"
                      style={{
                        background: 'rgba(56, 189, 248, 0.12)',
                        color: '#38bdf8',
                        border: '1px solid rgba(56, 189, 248, 0.25)',
                      }}
                    >
                      LAYER {st.step}
                    </span>
                    <div
                      className="p-2.5 rounded-xl transition-transform duration-300 group-hover:scale-110"
                      style={{
                        background: 'rgba(56, 189, 248, 0.1)',
                      }}
                    >
                      {st.icon}
                    </div>
                  </div>

                  <h3
                    className="font-semibold text-lg mb-2"
                    style={{ color: isDark ? '#f8fafc' : '#0f172a' }}
                  >
                    {st.title}
                  </h3>
                  <p
                    className="text-xs sm:text-sm leading-relaxed mb-6"
                    style={{ color: isDark ? '#94a3b8' : '#64748b' }}
                  >
                    {st.desc}
                  </p>
                </div>

                <div className="flex flex-wrap gap-1.5 pt-4 border-t border-slate-500/15">
                  {st.tags.map((t) => (
                    <span
                      key={t}
                      className="text-[10px] font-mono px-2 py-0.5 rounded"
                      style={{
                        background: isDark ? 'rgba(255, 255, 255, 0.04)' : '#f1f5f9',
                        color: isDark ? '#cbd5e1' : '#475569',
                      }}
                    >
                      {t}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* Integrated Data Protocols Bar */}
          <div
            className="rounded-2xl p-6 shadow-sm"
            style={{
              background: isDark ? 'rgba(10, 18, 30, 0.75)' : '#ffffff',
              border: isDark ? '1px solid rgba(56, 189, 248, 0.12)' : '1px solid #e2e8f0',
            }}
          >
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <Sparkles className="h-4 w-4 text-sky-400" />
                <span className="text-xs font-semibold uppercase tracking-[0.16em]" style={{ color: isDark ? '#cbd5e1' : '#334155' }}>
                  Integrated Hydrological Feeds & Data Sources
                </span>
              </div>
              <div className="flex flex-wrap items-center justify-center gap-2">
                {[
                  'IMD Doppler Radar',
                  'NASA GPM Satellite',
                  'CWC River Gauges',
                  'Survey of India DEM',
                  'NDRF Early Warning Node',
                ].map((src) => (
                  <span
                    key={src}
                    className="rounded-lg px-3 py-1 text-xs font-medium"
                    style={{
                      background: 'rgba(56, 189, 248, 0.08)',
                      border: '1px solid rgba(56, 189, 248, 0.2)',
                      color: isDark ? '#cbd5e1' : '#334155',
                    }}
                  >
                    {src}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── SECTION: INTELLIGENCE / LIVE PREVIEW (Enhanced GIS Radar) ───── */}
      <section
        id="intelligence"
        className="py-28 px-6 lg:px-12 transition-colors duration-300 relative"
        style={{
          backgroundColor: isDark ? '#09111b' : '#ffffff',
          borderTop: isDark ? '1px solid rgba(56, 189, 248, 0.12)' : '1px solid rgba(226, 232, 240, 0.8)',
        }}
      >
        <div className="mx-auto max-w-7xl">
          <div className="grid lg:grid-cols-12 gap-10 items-center">
            {/* Left Column: Context & Controls */}
            <div className="lg:col-span-5">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] mb-3 text-sky-400">
                LIVE GIS SURVEILLANCE
              </p>
              <h2
                className="font-editorial text-4xl sm:text-6xl font-normal leading-tight mb-4"
                style={{
                  fontFamily: 'Cormorant Garamond, Georgia, serif',
                  color: isDark ? '#f8fafc' : '#0f172a',
                }}
              >
                See Risk.
                <br />
                Understand Impact.
                <br />
                <span className="italic" style={{ color: '#38bdf8' }}>Take Action.</span>
              </h2>
              <p
                className="text-sm leading-relaxed mb-6"
                style={{ color: isDark ? '#94a3b8' : '#64748b' }}
              >
                Interact with real-time risk predictions across the vulnerable Mandakini and Alaknanda river corridors. Select any monitoring station to inspect live soil moisture and rainfall.
              </p>

              {/* Layer Selection Buttons */}
              <div className="mb-6">
                <p className="text-xs text-slate-500 uppercase tracking-wider mb-2.5 font-medium flex items-center gap-2">
                  <Compass className="h-3.5 w-3.5 text-sky-400" /> Active Radar Layer
                </p>
                <div className="flex flex-wrap gap-2">
                  {[
                    { id: 'risk', label: 'Composite Risk' },
                    { id: 'rainfall', label: 'Precipitation' },
                    { id: 'soil', label: 'Soil Saturation' },
                    { id: 'water', label: 'River Discharge' },
                  ].map((tab) => (
                    <button
                      key={tab.id}
                      onClick={() => setIntelligenceTab(tab.id as any)}
                      className="rounded-full px-3.5 py-1.5 text-xs font-semibold tracking-wide transition-all"
                      style={{
                        background:
                          intelligenceTab === tab.id
                            ? 'rgba(56, 189, 248, 0.22)'
                            : isDark
                            ? 'rgba(255, 255, 255, 0.05)'
                            : '#f1f5f9',
                        color:
                          intelligenceTab === tab.id
                            ? '#38bdf8'
                            : isDark
                            ? '#94a3b8'
                            : '#64748b',
                        border:
                          intelligenceTab === tab.id
                            ? '1px solid rgba(56, 189, 248, 0.45)'
                            : isDark
                            ? '1px solid rgba(255, 255, 255, 0.08)'
                            : '1px solid #e2e8f0',
                      }}
                    >
                      {tab.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Station Selection Pills */}
              <div className="space-y-2 mb-8">
                <p className="text-xs text-slate-500 uppercase tracking-wider font-medium">
                  Monitored Catchment Locations
                </p>
                <div className="grid grid-cols-2 gap-2">
                  {PREVIEW_LOCATIONS.map((loc) => {
                    const isSelected = loc.id === selectedLocId;
                    return (
                      <button
                        key={loc.id}
                        type="button"
                        onClick={() => setSelectedLocId(loc.id)}
                        className="flex items-center justify-between rounded-xl p-2.5 text-left text-xs font-medium transition-all"
                        style={{
                          background: isSelected
                            ? 'rgba(56, 189, 248, 0.16)'
                            : isDark
                            ? 'rgba(255, 255, 255, 0.03)'
                            : '#f8fafc',
                          border: isSelected
                            ? '1px solid rgba(56, 189, 248, 0.45)'
                            : isDark
                            ? '1px solid rgba(255, 255, 255, 0.06)'
                            : '1px solid #e2e8f0',
                        }}
                      >
                        <span style={{ color: isSelected ? (isDark ? '#f8fafc' : '#0284c7') : (isDark ? '#cbd5e1' : '#334155') }}>
                          {loc.name}
                        </span>
                        <span
                          className="text-[10px] font-bold px-1.5 py-0.5 rounded"
                          style={{
                            background: `${RISK_COLOR[loc.risk]}18`,
                            color: RISK_COLOR[loc.risk],
                          }}
                        >
                          {loc.risk[0]}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              <Link
                to={ROUTES.LOGIN}
                className="inline-flex items-center gap-2 rounded-xl px-5 py-3 text-xs sm:text-sm font-semibold text-white shadow-md transition-all hover:scale-105"
                style={{
                  background: '#0284c7',
                  boxShadow: '0 4px 18px rgba(2, 132, 199, 0.35)',
                }}
              >
                Open Full GIS Command Center <ArrowRight className="h-4 w-4" />
              </Link>
            </div>

            {/* Right Column: Live Interactive Simulation Card with Radar Scan */}
            <div className="lg:col-span-7">
              <div
                className="rounded-2xl overflow-hidden shadow-2xl backdrop-blur-xl transition-all"
                style={{
                  background: isDark ? 'rgba(13, 24, 38, 0.88)' : '#ffffff',
                  border: isDark ? '1px solid rgba(56, 189, 248, 0.22)' : '1px solid #cbd5e1',
                }}
              >
                {/* Simulated GIS Topographic Map Canvas with Radar Sweep */}
                <div
                  className="relative h-64 sm:h-76 overflow-hidden flex items-center justify-center"
                  style={{
                    background: isDark
                      ? 'linear-gradient(180deg, #091422 0%, #0d1e33 100%)'
                      : 'linear-gradient(180deg, #e2e8f0 0%, #cbd5e1 100%)',
                  }}
                >
                  {/* Contour Lines Graphic */}
                  <svg
                    viewBox="0 0 600 300"
                    className="absolute inset-0 w-full h-full opacity-30"
                    preserveAspectRatio="none"
                  >
                    <path d="M0,180 Q150,110 300,160 T600,130 L600,300 L0,300 Z" fill="#0284c7" />
                    <path d="M0,220 Q200,160 400,210 T600,190 L600,300 L0,300 Z" fill="#0369a1" />
                    <path d="M0,250 Q250,200 450,240 T600,220 L600,300 L0,300 Z" fill="#0c4a6e" />
                  </svg>

                  {/* Topographic Elevation Grid Rings */}
                  <div
                    className="absolute inset-0 opacity-15"
                    style={{
                      backgroundImage: 'radial-gradient(circle at 50% 50%, rgba(56,189,248,0.5) 1px, transparent 1px)',
                      backgroundSize: '36px 36px',
                    }}
                  />

                  {/* Station Radar Pings on Map */}
                  {PREVIEW_LOCATIONS.map((loc, idx) => {
                    const isSelected = loc.id === selectedLocId;
                    const coords = [
                      { left: '22%', top: '28%' },
                      { left: '42%', top: '44%' },
                      { left: '60%', top: '34%' },
                      { left: '78%', top: '56%' },
                      { left: '50%', top: '72%' },
                    ][idx];

                    return (
                      <button
                        key={loc.id}
                        type="button"
                        onClick={() => setSelectedLocId(loc.id)}
                        className="absolute transform -translate-x-1/2 -translate-y-1/2 group cursor-pointer transition-transform hover:scale-125 z-10"
                        style={{ ...coords }}
                      >
                        <span className="relative flex h-5 w-5 items-center justify-center">
                          {isSelected && (
                            <span
                              className="animate-ping absolute inline-flex h-full w-full rounded-full opacity-75"
                              style={{ backgroundColor: RISK_COLOR[loc.risk] }}
                            />
                          )}
                          <span
                            className="relative inline-flex rounded-full h-3.5 w-3.5 border-2"
                            style={{
                              backgroundColor: RISK_COLOR[loc.risk],
                              borderColor: isSelected ? '#ffffff' : 'rgba(255,255,255,0.7)',
                              boxShadow: isSelected ? `0 0 12px ${RISK_COLOR[loc.risk]}` : 'none',
                            }}
                          />
                        </span>
                        <span
                          className="absolute left-6 top-0 text-[10px] font-semibold whitespace-nowrap px-1.5 py-0.5 rounded shadow-sm"
                          style={{
                            background: isDark ? 'rgba(7, 13, 21, 0.9)' : 'rgba(255, 255, 255, 0.95)',
                            color: isDark ? '#ffffff' : '#0f172a',
                            border: isDark ? '1px solid rgba(255, 255, 255, 0.1)' : '1px solid #cbd5e1',
                          }}
                        >
                          {loc.name}
                        </span>
                      </button>
                    );
                  })}

                  {/* Top Bar on Map */}
                  <div className="absolute top-3 left-3 flex items-center gap-2">
                    <span className="flex h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
                    <span className="text-[11px] font-mono uppercase tracking-wider text-slate-300 bg-black/50 px-2 py-0.5 rounded backdrop-blur-sm">
                      GIS RADAR LAYER: {intelligenceTab.toUpperCase()}
                    </span>
                  </div>

                  <div className="absolute bottom-3 right-3 text-[10px] font-mono text-slate-300 bg-black/50 px-2 py-0.5 rounded backdrop-blur-sm">
                    Mandakini Valley Corridor · {activeLocation.elevation}
                  </div>
                </div>

                {/* Selected Station Deep Telemetry Card */}
                <div className="p-6">
                  <div className="flex items-center justify-between pb-4 mb-4 border-b border-slate-500/15">
                    <div>
                      <h4 className="text-xl font-bold font-editorial" style={{ color: isDark ? '#f8fafc' : '#0f172a' }}>
                        {activeLocation.name}
                      </h4>
                      <p className="text-xs text-slate-400">
                        {activeLocation.district} District · Elevation {activeLocation.elevation}
                      </p>
                    </div>

                    <div className="text-right">
                      <div className="flex items-center justify-end gap-2">
                        <span
                          className="text-2xl font-bold font-mono"
                          style={{ color: RISK_COLOR[activeLocation.risk] }}
                        >
                          {Math.round(activeLocation.score * 100)}%
                        </span>
                        <span
                          className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded"
                          style={{
                            background: `${RISK_COLOR[activeLocation.risk]}20`,
                            color: RISK_COLOR[activeLocation.risk],
                            border: `1px solid ${RISK_COLOR[activeLocation.risk]}40`,
                          }}
                        >
                          {activeLocation.risk}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-400 font-mono mt-0.5">
                        Trend: {activeLocation.trend}
                      </p>
                    </div>
                  </div>

                  {/* 4 Sensor Telemetry Readouts */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                    <div
                      className="p-3 rounded-xl"
                      style={{
                        background: isDark ? 'rgba(10, 18, 30, 0.65)' : '#f8fafc',
                        border: isDark ? '1px solid rgba(56, 189, 248, 0.12)' : '1px solid #e2e8f0',
                      }}
                    >
                      <div className="flex items-center gap-1.5 text-xs text-slate-400 mb-1">
                        <CloudRain className="h-3.5 w-3.5 text-sky-400" />
                        <span>Precipitation</span>
                      </div>
                      <p className="text-base font-bold text-sky-400 font-mono">
                        {activeLocation.rain} <span className="text-xs font-normal text-slate-400">mm/hr</span>
                      </p>
                    </div>

                    <div
                      className="p-3 rounded-xl"
                      style={{
                        background: isDark ? 'rgba(10, 18, 30, 0.65)' : '#f8fafc',
                        border: isDark ? '1px solid rgba(56, 189, 248, 0.12)' : '1px solid #e2e8f0',
                      }}
                    >
                      <div className="flex items-center gap-1.5 text-xs text-slate-400 mb-1">
                        <Droplets className="h-3.5 w-3.5 text-sky-400" />
                        <span>Soil Saturation</span>
                      </div>
                      <p className="text-base font-bold text-sky-400 font-mono">
                        {activeLocation.soil}%
                      </p>
                    </div>

                    <div
                      className="p-3 rounded-xl"
                      style={{
                        background: isDark ? 'rgba(10, 18, 30, 0.65)' : '#f8fafc',
                        border: isDark ? '1px solid rgba(56, 189, 248, 0.12)' : '1px solid #e2e8f0',
                      }}
                    >
                      <div className="flex items-center gap-1.5 text-xs text-slate-400 mb-1">
                        <Waves className="h-3.5 w-3.5 text-sky-400" />
                        <span>River Gauge</span>
                      </div>
                      <p className="text-sm font-bold text-sky-400 font-mono truncate">
                        {activeLocation.water}
                      </p>
                    </div>

                    <div
                      className="p-3 rounded-xl"
                      style={{
                        background: isDark ? 'rgba(10, 18, 30, 0.65)' : '#f8fafc',
                        border: isDark ? '1px solid rgba(56, 189, 248, 0.12)' : '1px solid #e2e8f0',
                      }}
                    >
                      <div className="flex items-center gap-1.5 text-xs text-slate-400 mb-1">
                        <ShieldCheck className="h-3.5 w-3.5 text-emerald-400" />
                        <span>Telemetry</span>
                      </div>
                      <p className="text-sm font-bold text-emerald-400 font-mono">
                        HEALTHY
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── SECTION: MISSION QUOTE ──────────────────────────────────────── */}
      <section
        className="py-24 px-6 relative overflow-hidden text-center"
        style={{
          background: isDark ? '#050a10' : '#0a111a',
          color: '#ffffff',
        }}
      >
        <div className="mx-auto max-w-4xl relative z-10">
          <div className="text-6xl font-editorial opacity-35 mb-3 text-sky-400">
            “
          </div>

          <p
            className="font-editorial text-2xl sm:text-4xl md:text-5xl font-normal leading-snug mb-8"
            style={{ fontFamily: 'Cormorant Garamond, Georgia, serif' }}
          >
            Technology alone doesn’t save lives.
            <br />
            <span className="italic" style={{ color: '#38bdf8' }}>
              Timely information and the right action do.
            </span>
          </p>

          <div className="flex items-center justify-center gap-3">
            <AarakshLogo size="sm" />
            <span className="font-bold tracking-[0.25em] text-xs uppercase text-slate-400">
              AARAKSH · SIH 2026 PROTOTYPE
            </span>
          </div>
        </div>
      </section>

      {/* ── SECTION: CALL TO ACTION ─────────────────────────────────────── */}
      <section
        className="py-24 px-6 lg:px-12 transition-colors duration-300 relative"
        style={{
          backgroundColor: isDark ? '#070d15' : '#f4f7fb',
          borderTop: isDark ? '1px solid rgba(56, 189, 248, 0.12)' : '1px solid rgba(226, 232, 240, 0.8)',
        }}
      >
        <div className="mx-auto max-w-7xl">
          <div
            className="rounded-3xl p-8 sm:p-14 text-center sm:text-left grid lg:grid-cols-2 gap-10 items-center overflow-hidden relative shadow-xl"
            style={{
              background: isDark
                ? 'linear-gradient(135deg, rgba(13, 24, 38, 0.95) 0%, rgba(9, 18, 30, 0.95) 100%)'
                : 'linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)',
              border: isDark ? '1px solid rgba(56, 189, 248, 0.22)' : '1px solid #cbd5e1',
            }}
          >
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.2em] mb-3 text-sky-400">
                DISASTER RESILIENCE · HIMALAYAS
              </p>
              <h2
                className="font-editorial text-3xl sm:text-5xl font-normal leading-tight mb-4"
                style={{
                  fontFamily: 'Cormorant Garamond, Georgia, serif',
                  color: isDark ? '#f8fafc' : '#0f172a',
                }}
              >
                Be Part of a <span className="italic" style={{ color: '#38bdf8' }}>Safer Tomorrow</span>
              </h2>
              <p
                className="text-sm sm:text-base leading-relaxed mb-8 max-w-lg"
                style={{ color: isDark ? '#94a3b8' : '#64748b' }}
              >
                Access real-time GIS analytics, test predictive simulation scenarios, and evaluate our AI-powered early warning architecture designed for India's hilly terrains.
              </p>

              <div className="flex flex-wrap gap-4 justify-center sm:justify-start">
                <Link
                  to={ROUTES.LOGIN}
                  className="inline-flex items-center gap-2 rounded-xl px-6 py-3.5 text-xs sm:text-sm font-bold tracking-[0.12em] uppercase text-white shadow-lg transition-all duration-200 hover:scale-105"
                  style={{
                    background: '#0284c7',
                    boxShadow: '0 4px 20px rgba(2, 132, 199, 0.45)',
                  }}
                >
                  ACCESS PLATFORM <ArrowRight className="h-4 w-4" />
                </Link>

                <Link
                  to={ROUTES.REGISTER}
                  className="inline-flex items-center gap-2 rounded-xl px-5 py-3.5 text-xs sm:text-sm font-semibold tracking-wider transition-all duration-200 hover:bg-white/10"
                  style={{
                    color: isDark ? '#f8fafc' : '#334155',
                    border: isDark ? '1px solid rgba(255, 255, 255, 0.2)' : '1px solid #cbd5e1',
                  }}
                >
                  CREATE ACCOUNT
                </Link>
              </div>
            </div>

            <div className="flex flex-col items-center justify-center text-center p-6">
              <div
                className="font-editorial text-4xl sm:text-5xl font-bold mb-2 tracking-tight"
                style={{ color: isDark ? '#f8fafc' : '#0f172a' }}
              >
                Safer Hills
              </div>
              <div
                className="font-editorial text-3xl sm:text-4xl italic font-normal mb-5 text-sky-400"
              >
                Stronger India
              </div>
              <div className="flex justify-center gap-1.5">
                <span className="h-1.5 w-10 rounded-full" style={{ background: '#ff9933' }} />
                <span className="h-1.5 w-10 rounded-full bg-white border border-slate-300" />
                <span className="h-1.5 w-10 rounded-full" style={{ background: '#138808' }} />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── FOOTER ──────────────────────────────────────────────────────── */}
      <footer
        className="py-12 px-6 lg:px-12 transition-colors duration-300 relative"
        style={{
          backgroundColor: isDark ? '#05090f' : '#ffffff',
          borderTop: isDark ? '1px solid rgba(56, 189, 248, 0.12)' : '1px solid #e2e8f0',
        }}
      >
        <div className="mx-auto max-w-7xl flex flex-col md:flex-row items-center justify-between gap-8">
          {/* Logo & Info */}
          <div className="flex items-center gap-3">
            <AarakshLogo size="md" />
            <div>
              <p className="text-sm font-bold tracking-[0.2em] uppercase" style={{ color: isDark ? '#f8fafc' : '#0f172a' }}>
                AARAKSH
              </p>
              <p className="text-[11px] text-slate-500">
                Flash Flood Intelligence Platform · SIH 2026
              </p>
            </div>
          </div>

          {/* Nav Links */}
          <div className="flex flex-wrap gap-8 text-xs font-semibold tracking-wider text-slate-400">
            <a href="#about" className="hover:text-sky-400 transition-colors">ABOUT</a>
            <a href="#how-it-works" className="hover:text-sky-400 transition-colors">HOW IT WORKS</a>
            <a href="#intelligence" className="hover:text-sky-400 transition-colors">INTELLIGENCE</a>
            <Link to={ROUTES.LOGIN} className="hover:text-sky-400 transition-colors">ACCESS</Link>
          </div>

          {/* Theme switch in footer + copyright */}
          <div className="flex items-center gap-4 text-xs text-slate-500">
            <ThemeToggle variant="pill" />
            <span>© 2026 Team NeuroNauts</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
