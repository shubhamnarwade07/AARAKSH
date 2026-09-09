import { Link } from 'react-router-dom';
import { Shield, Map, Bell, Activity, Database, ArrowRight, ChevronRight, CloudRain, Mountain, Layers, AlertTriangle, CheckCircle, TrendingUp, Play, Globe } from 'lucide-react';
import { ROUTES } from '@/lib/constants';
import { useState } from 'react';

// ── Mock live preview data ────────────────────────────────
const PREVIEW_LOCATIONS = [
  { name: 'Rambara', district: 'Rudraprayag', risk: 'CRITICAL', score: 0.88, trend: '↑' },
  { name: 'Gaurikund', district: 'Rudraprayag', risk: 'HIGH', score: 0.71, trend: '↑' },
  { name: 'Sonprayag', district: 'Rudraprayag', risk: 'HIGH', score: 0.63, trend: '→' },
  { name: 'Agastyamuni', district: 'Rudraprayag', risk: 'MODERATE', score: 0.44, trend: '→' },
];

const RISK_COLOR: Record<string, string> = {
  CRITICAL: '#ef4444', HIGH: '#f97316', MODERATE: '#eab308', LOW: '#22c55e'
};
const RISK_BG: Record<string, string> = {
  CRITICAL: 'rgba(239,68,68,0.15)', HIGH: 'rgba(249,115,22,0.12)', MODERATE: 'rgba(234,179,8,0.12)', LOW: 'rgba(34,197,94,0.1)'
};

export function LandingPage() {
  const [activeTab, setActiveTab] = useState<'risk' | 'rainfall' | 'water'>('risk');

  return (
    <div className="min-h-screen" style={{ background: '#f8f9f4', fontFamily: 'Inter, system-ui, sans-serif' }}>

      {/* ── Navigation ─────────────────────────────── */}
      <nav className="fixed top-0 left-0 right-0 z-50" style={{ background: 'rgba(6,15,10,0.92)', backdropFilter: 'blur(12px)', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
        <div className="mx-auto max-w-6xl px-6 flex h-14 items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg" style={{ background: 'linear-gradient(135deg, #276942, #1a6b5c)' }}>
              <Shield className="h-4 w-4 text-white" />
            </div>
            <span className="font-bold text-white tracking-widest text-sm" style={{ letterSpacing: '0.15em' }}>AARAKSH</span>
          </div>
          <div className="hidden md:flex items-center gap-6 text-sm" style={{ color: 'rgba(255,255,255,0.5)' }}>
            <a href="#challenge" className="hover:text-white transition-colors">The Challenge</a>
            <a href="#how" className="hover:text-white transition-colors">How It Works</a>
            <a href="#preview" className="hover:text-white transition-colors">Live Preview</a>
            <a href="#impact" className="hover:text-white transition-colors">Impact</a>
          </div>
          <div className="flex items-center gap-3">
            <Link to={ROUTES.LOGIN} className="text-sm font-medium transition-colors" style={{ color: 'rgba(255,255,255,0.6)' }}>Sign In</Link>
            <Link
              to={ROUTES.LOGIN}
              className="flex items-center gap-1.5 rounded-lg px-4 py-2 text-sm font-semibold text-white transition-all hover:scale-105"
              style={{ background: 'linear-gradient(135deg, #276942, #1a6b5c)' }}
            >
              Access AARAKSH <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
        </div>
      </nav>

      {/* ── Hero ──────────────────────────────────── */}
      <section
        className="relative min-h-screen flex items-end pb-20 pt-32 overflow-hidden"
        style={{
          background: 'linear-gradient(180deg, #020f06 0%, #061a0c 30%, #0a1208 60%, #060f0a 100%)',
        }}
      >
        {/* Himalayan mountain silhouette background */}
        <div className="absolute inset-0 overflow-hidden">
          {/* SVG mountain silhouette */}
          <svg className="absolute bottom-0 left-0 w-full" viewBox="0 0 1440 600" preserveAspectRatio="none">
            <defs>
              <linearGradient id="mtGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#0f2918" />
                <stop offset="100%" stopColor="#060f0a" />
              </linearGradient>
              <linearGradient id="snowGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="rgba(255,255,255,0.15)" />
                <stop offset="100%" stopColor="transparent" />
              </linearGradient>
            </defs>
            {/* Far mountains */}
            <polygon points="0,600 0,320 120,180 260,300 400,150 540,260 700,80 860,200 1000,120 1160,240 1300,160 1440,220 1440,600" fill="#0a1a10" opacity="0.8" />
            {/* Mid mountains */}
            <polygon points="0,600 0,420 100,360 200,400 340,280 500,380 680,300 820,380 960,310 1100,370 1260,290 1440,350 1440,600" fill="#0f2918" />
            {/* Foreground terrain */}
            <polygon points="0,600 0,520 200,480 400,510 600,460 800,500 1000,470 1200,490 1440,460 1440,600" fill="#163d24" />
            {/* Snow caps */}
            <polygon points="380,150 400,80 420,150" fill="rgba(255,255,255,0.12)" />
            <polygon points="680,80 700,20 720,80" fill="rgba(255,255,255,0.15)" />
            <polygon points="980,120 1000,55 1020,120" fill="rgba(255,255,255,0.10)" />
          </svg>

          {/* Stars/ambient particles */}
          <div className="absolute inset-0" style={{ background: 'radial-gradient(ellipse at 30% 20%, rgba(53,169,141,0.08) 0%, transparent 60%), radial-gradient(ellipse at 80% 10%, rgba(6,182,212,0.06) 0%, transparent 50%)' }} />

          {/* Grid overlay */}
          <div className="absolute inset-0" style={{
            backgroundImage: 'linear-gradient(rgba(53,169,141,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(53,169,141,0.04) 1px, transparent 1px)',
            backgroundSize: '60px 60px',
          }} />
        </div>

        {/* Hero content */}
        <div className="relative mx-auto max-w-6xl px-6 z-10">
          <div className="grid lg:grid-cols-2 gap-12 items-end">
            {/* Left: headline */}
            <div>
              <div className="inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs mb-6" style={{ background: 'rgba(53,169,141,0.12)', border: '1px solid rgba(53,169,141,0.25)', color: '#35a98d' }}>
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
                SIH 2026 · Problem SIH26192 · NDRF / MHA
              </div>

              <h1
                className="text-5xl md:text-6xl lg:text-7xl font-bold leading-none mb-6"
                style={{ fontFamily: 'Playfair Display, Georgia, serif', color: 'white', lineHeight: 1.05 }}
              >
                From Data to
                <br />
                <span style={{ background: 'linear-gradient(135deg, #34d399 0%, #06b6d4 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                  Lives Saved
                </span>
              </h1>

              {/* Italic tagline on the side — matching reference */}
              <div className="mb-6" style={{ borderLeft: '2px solid rgba(53,169,141,0.4)', paddingLeft: '16px' }}>
                <p className="text-base text-slate-300 leading-relaxed">
                  AI-powered flash flood intelligence and early warning
                  for India's hilly regions. <span className="text-emerald-400 font-medium">Hyper-local. Real-time. Actionable.</span>
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-3 mb-10">
                <Link
                  to={ROUTES.LOGIN}
                  className="inline-flex items-center justify-center gap-2 rounded-xl px-6 py-3.5 text-sm font-semibold text-white transition-all hover:scale-105 hover:shadow-lg"
                  style={{ background: 'linear-gradient(135deg, #276942, #22866f)', boxShadow: '0 4px 24px rgba(34,134,111,0.3)' }}
                >
                  Explore the Platform <ArrowRight className="h-4 w-4" />
                </Link>
                <a
                  href="#how"
                  className="inline-flex items-center justify-center gap-2 rounded-xl px-6 py-3.5 text-sm font-medium text-white transition-all hover:bg-white/8"
                  style={{ border: '1px solid rgba(255,255,255,0.15)' }}
                >
                  <Play className="h-3.5 w-3.5" /> How It Works
                </a>
              </div>

              {/* Stats row */}
              <div className="flex items-center gap-6">
                {[
                  { value: '1', label: 'Mission' },
                  { value: '1000+', label: 'Villages (Demo)' },
                  { value: 'Safer', label: 'Communities' },
                ].map((s, i) => (
                  <div key={i}>
                    <div className="text-xl font-bold text-white" style={{ fontFamily: 'Playfair Display, serif' }}>{s.value}</div>
                    <div className="text-xs text-slate-500">{s.label}</div>
                  </div>
                ))}
                <div className="ml-auto flex items-center gap-1.5 text-xs text-slate-500">
                  <Mountain className="h-3.5 w-3.5" />
                  Rudraprayag, Uttarakhand
                </div>
              </div>
            </div>

            {/* Right: live risk mini-panel */}
            <div>
              <div
                className="rounded-2xl overflow-hidden"
                style={{ background: 'rgba(6,15,10,0.85)', border: '1px solid rgba(53,169,141,0.2)', backdropFilter: 'blur(16px)', boxShadow: '0 20px 60px rgba(0,0,0,0.5)' }}
              >
                <div className="flex items-center justify-between px-4 py-3" style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
                  <div className="flex items-center gap-2">
                    <span className="h-2 w-2 rounded-full bg-red-500 animate-pulse" />
                    <span className="text-xs font-semibold text-white uppercase tracking-wider">Live Risk Overview</span>
                  </div>
                  <span className="text-[10px] text-slate-500 rounded-full px-2 py-0.5" style={{ background: 'rgba(255,255,255,0.05)' }}>Demo Data</span>
                </div>
                <div className="p-4 space-y-2">
                  {PREVIEW_LOCATIONS.map((loc, i) => (
                    <div
                      key={i}
                      className="flex items-center justify-between rounded-lg px-3 py-2.5 transition-colors hover:bg-white/4"
                      style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.04)' }}
                    >
                      <div>
                        <p className="text-sm font-semibold text-white">{loc.name}</p>
                        <p className="text-xs text-slate-500">{loc.district}, Uttarakhand</p>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="text-right">
                          <p className="text-sm font-bold" style={{ color: RISK_COLOR[loc.risk] }}>{Math.round(loc.score * 100)}%</p>
                          <p className="text-[10px] text-slate-600">{loc.trend}</p>
                        </div>
                        <span
                          className="rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide"
                          style={{ background: RISK_BG[loc.risk], color: RISK_COLOR[loc.risk], border: `1px solid ${RISK_COLOR[loc.risk]}40` }}
                        >
                          {loc.risk}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="px-4 pb-4">
                  <div className="flex items-center gap-3 text-[10px] text-slate-600">
                    {['Critical', 'High', 'Moderate', 'Low'].map((l, i) => (
                      <div key={l} className="flex items-center gap-1">
                        <span className="h-2 w-2 rounded-full" style={{ background: ['#ef4444','#f97316','#eab308','#22c55e'][i] }} />
                        {l}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Challenge ─────────────────────────────── */}
      <section id="challenge" className="py-24" style={{ background: '#ffffff' }}>
        <div className="mx-auto max-w-6xl px-6">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <p className="text-xs font-semibold uppercase tracking-widest mb-3" style={{ color: '#276942' }}>The Challenge</p>
              <h2 className="text-4xl font-bold mb-6 leading-tight" style={{ fontFamily: 'Playfair Display, serif', color: '#0a1a10' }}>
                When Minutes<br />Define Lives
              </h2>
              <p className="text-slate-600 leading-relaxed mb-6">
                Flash floods and landslides in hilly regions develop rapidly, leaving very little time for response.
                Existing early warning systems lack the hyper-local precision needed for timely action.
              </p>
              <a href="#how" className="inline-flex items-center gap-2 text-sm font-semibold transition-colors" style={{ color: '#276942' }}>
                Learn More <ArrowRight className="h-4 w-4" />
              </a>
            </div>
            <div className="grid grid-cols-1 gap-4">
              {[
                { icon: '⏱', title: 'Rapid Onset', desc: 'Flash floods can develop within hours, leaving insufficient time for conventional warning systems to respond.' },
                { icon: '📍', title: 'Limited Local Data', desc: 'Lack of village-level risk assessment in hilly terrain leaves communities without actionable intelligence.' },
                { icon: '🏔', title: 'High Vulnerability', desc: 'Remote communities in complex terrain face disproportionate risk with limited access to emergency response.' },
              ].map((item, i) => (
                <div
                  key={i}
                  className="flex items-start gap-4 rounded-xl p-4"
                  style={{ background: '#f8f9f4', border: '1px solid #e8ede9' }}
                >
                  <span className="text-2xl flex-shrink-0">{item.icon}</span>
                  <div>
                    <h3 className="font-semibold text-slate-800 mb-1">{item.title}</h3>
                    <p className="text-sm text-slate-500 leading-relaxed">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── How It Works ──────────────────────────── */}
      <section id="how" className="py-24" style={{ background: '#f0f4f1' }}>
        <div className="mx-auto max-w-6xl px-6">
          <div className="text-center mb-14">
            <p className="text-xs font-semibold uppercase tracking-widest mb-3" style={{ color: '#276942' }}>How AARAKSH Works</p>
            <h2 className="text-4xl font-bold" style={{ fontFamily: 'Playfair Display, serif', color: '#0a1a10' }}>
              Intelligence Across Every Layer
            </h2>
            <p className="mt-4 text-slate-500 max-w-2xl mx-auto">
              AARAKSH integrates environmental data feeds, GIS layers, and AI models to generate hyper-local
              risk intelligence and actionable early warnings.
            </p>
          </div>

          {/* Process steps */}
          <div className="grid grid-cols-4 gap-4 mb-16">
            {[
              { n: '01', icon: <Database className="h-6 w-6" />, title: 'Collect', desc: 'Multi-source data: satellite, weather, terrain' },
              { n: '02', icon: <Activity className="h-6 w-6" />, title: 'Analyse', desc: 'AI/ML models for risk prediction' },
              { n: '03', icon: <Map className="h-6 w-6" />, title: 'Visualise', desc: 'Interactive maps and risk insights' },
              { n: '04', icon: <Bell className="h-6 w-6" />, title: 'Alert', desc: 'Early warnings and safety guidance' },
            ].map((step, i) => (
              <div key={i} className="relative">
                {i < 3 && (
                  <div className="absolute top-8 left-[calc(100%+0.5rem)] w-4 text-center" style={{ color: '#276942', opacity: 0.4, fontSize: 20 }}>→</div>
                )}
                <div className="rounded-xl p-5" style={{ background: 'white', border: '1px solid #e0ebe2' }}>
                  <span className="text-xs font-bold" style={{ color: '#276942', opacity: 0.6 }}>{step.n}</span>
                  <div className="my-3" style={{ color: '#276942' }}>{step.icon}</div>
                  <h3 className="font-semibold text-slate-800 mb-1">{step.title}</h3>
                  <p className="text-xs text-slate-500">{step.desc}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Data sources */}
          <div className="grid grid-cols-3 md:grid-cols-6 gap-3">
            {[
              'Weather APIs', 'Satellite Data', 'Terrain / DEM', 'Hydrological Feeds', 'Historical Records', 'GIS Layers'
            ].map((src, i) => (
              <div key={i} className="rounded-lg px-3 py-2 text-center text-xs font-medium" style={{ background: 'white', border: '1px solid #dde8df', color: '#276942' }}>
                {src}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Live Preview ──────────────────────────── */}
      <section id="preview" className="py-24" style={{ background: '#060f0a' }}>
        <div className="mx-auto max-w-6xl px-6">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <p className="text-xs font-semibold uppercase tracking-widest mb-3" style={{ color: '#35a98d' }}>Live Preview</p>
              <h2 className="text-4xl font-bold text-white mb-6" style={{ fontFamily: 'Playfair Display, serif' }}>
                See Risk.<br />Understand Impact.<br />Take Action.
              </h2>
              <p className="text-slate-400 mb-8 leading-relaxed">
                Explore real-time risk visualizations, environmental layers and early warnings for vulnerable regions in hilly terrain.
              </p>
              <Link
                to={ROUTES.LOGIN}
                className="inline-flex items-center gap-2 rounded-xl px-6 py-3 text-sm font-semibold text-white transition-all hover:scale-105"
                style={{ background: 'linear-gradient(135deg, #276942, #22866f)', boxShadow: '0 4px 24px rgba(34,134,111,0.3)' }}
              >
                Open Interactive Map <Map className="h-4 w-4" />
              </Link>

              {/* Layer pills */}
              <div className="flex gap-2 mt-6">
                {['Risk', 'Rainfall', 'Water Level'].map((l, i) => (
                  <button
                    key={l}
                    onClick={() => setActiveTab(l.toLowerCase().replace(' ', '_') as any)}
                    className="rounded-full px-3 py-1 text-xs font-medium transition-all"
                    style={{
                      background: activeTab === l.toLowerCase() ? 'rgba(53,169,141,0.2)' : 'rgba(255,255,255,0.05)',
                      color: activeTab === l.toLowerCase() ? '#35a98d' : 'rgba(255,255,255,0.4)',
                      border: `1px solid ${activeTab === l.toLowerCase() ? 'rgba(53,169,141,0.4)' : 'rgba(255,255,255,0.08)'}`,
                    }}
                  >
                    {l}
                  </button>
                ))}
              </div>
            </div>

            {/* Risk panel */}
            <div>
              <div
                className="rounded-2xl overflow-hidden"
                style={{ background: 'rgba(10,26,16,0.9)', border: '1px solid rgba(53,169,141,0.15)', boxShadow: '0 20px 60px rgba(0,0,0,0.4)' }}
              >
                {/* Simulated map */}
                <div
                  className="relative h-48 flex items-center justify-center overflow-hidden"
                  style={{ background: 'linear-gradient(180deg, #0a2015 0%, #0f2918 100%)' }}
                >
                  <svg viewBox="0 0 400 200" className="absolute inset-0 w-full h-full opacity-30">
                    <path d="M0,150 Q100,80 200,120 Q300,60 400,100 L400,200 L0,200 Z" fill="#163d24" />
                    <path d="M0,170 Q80,130 160,150 Q240,110 320,140 Q360,125 400,135 L400,200 L0,200 Z" fill="#0f2918" />
                  </svg>
                  {PREVIEW_LOCATIONS.map((loc, i) => (
                    <div
                      key={i}
                      className="absolute flex items-center gap-1.5 rounded-full px-2 py-1 text-[10px] font-semibold"
                      style={{
                        background: `${RISK_COLOR[loc.risk]}20`,
                        border: `1px solid ${RISK_COLOR[loc.risk]}50`,
                        color: RISK_COLOR[loc.risk],
                        left: `${15 + i * 22}%`,
                        top: `${25 + (i % 2) * 30}%`,
                      }}
                    >
                      <span className="h-1.5 w-1.5 rounded-full animate-pulse" style={{ background: RISK_COLOR[loc.risk] }} />
                      {loc.name}
                    </div>
                  ))}
                  <div className="absolute bottom-2 right-2 text-[10px] text-slate-600 bg-black/40 px-2 py-1 rounded">Demo Map Preview</div>
                </div>
                {/* Selected location */}
                <div className="p-4" style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}>
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <p className="font-semibold text-white">Rambara</p>
                      <p className="text-xs text-slate-500">Rudraprayag, Uttarakhand</p>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-bold" style={{ color: '#ef4444', fontFamily: 'Playfair Display, serif' }}>87%</p>
                      <p className="text-xs" style={{ color: '#ef4444' }}>Critical Risk</p>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-3 text-xs">
                    {[{ l: 'Risk Score', v: '0.87' }, { l: 'Trend', v: 'Increasing ↑' }, { l: 'Rainfall', v: '112 mm/hr' }, { l: 'Last Updated', v: '14:32' }].map(item => (
                      <div key={item.l}>
                        <span className="text-slate-600">{item.l}</span>
                        <p className="text-slate-200 font-medium mt-0.5">{item.v}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Impact ────────────────────────────────── */}
      <section id="impact" className="py-24" style={{ background: '#ffffff' }}>
        <div className="mx-auto max-w-6xl px-6">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <p className="text-xs font-semibold uppercase tracking-widest mb-3" style={{ color: '#276942' }}>Our Impact</p>
              <h2 className="text-4xl font-bold mb-4" style={{ fontFamily: 'Playfair Display, serif', color: '#0a1a10' }}>
                Building<br />Disaster-Resilient<br />Communities
              </h2>
              <p className="text-slate-500 mb-8 leading-relaxed">
                Technology alone doesn't save lives. Timely information and the right action do.
              </p>
            </div>
            <div className="grid grid-cols-2 gap-4">
              {[
                { val: '10', label: 'Monitored Locations', sub: '(Demo Data)' },
                { val: '13', label: 'Data Sources', sub: '(APIs & Databases)' },
                { val: '3', label: 'Active Alerts', sub: '(Demo Data)' },
                { val: '24/7', label: 'Monitoring', sub: '(Prototype)' },
              ].map((s, i) => (
                <div key={i} className="rounded-xl p-6" style={{ background: '#f0f4f1', border: '1px solid #dde8df' }}>
                  <div className="text-3xl font-bold mb-1" style={{ fontFamily: 'Playfair Display, serif', color: '#0f2918' }}>{s.val}</div>
                  <div className="text-sm font-medium text-slate-700">{s.label}</div>
                  <div className="text-xs text-slate-400 mt-0.5">{s.sub}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── Mission Quote ─────────────────────────── */}
      <section className="py-20" style={{ background: '#0a1a10' }}>
        <div className="mx-auto max-w-3xl px-6 text-center">
          <div className="text-5xl mb-6" style={{ color: 'rgba(53,169,141,0.3)', fontFamily: 'Playfair Display, serif' }}>❝</div>
          <p className="text-2xl font-medium text-white mb-4" style={{ fontFamily: 'Playfair Display, serif', lineHeight: 1.4 }}>
            Technology alone doesn't save lives.<br />Timely information and the right action do.
          </p>
          <p className="text-sm font-bold tracking-widest" style={{ color: '#35a98d', letterSpacing: '0.2em' }}>AARAKSH</p>
        </div>
      </section>

      {/* ── CTA ───────────────────────────────────── */}
      <section className="py-20" style={{ background: '#f0f4f1', borderTop: '1px solid #dde8df' }}>
        <div className="mx-auto max-w-6xl px-6">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <p className="text-xs font-semibold uppercase tracking-widest mb-3" style={{ color: '#276942' }}>Be Part of a Safer Tomorrow</p>
              <h2 className="text-4xl font-bold mb-4" style={{ fontFamily: 'Playfair Display, serif', color: '#0a1a10' }}>
                Explore AARAKSH
              </h2>
              <p className="text-slate-500 mb-8">
                Access the platform, explore real-time insights, and see how data can help build safer, stronger communities.
              </p>
              <div className="flex gap-4">
                <Link
                  to={ROUTES.LOGIN}
                  className="inline-flex items-center gap-2 rounded-xl px-6 py-3 text-sm font-semibold text-white transition-all hover:scale-105"
                  style={{ background: 'linear-gradient(135deg, #276942, #22866f)' }}
                >
                  Access AARAKSH <ArrowRight className="h-4 w-4" />
                </Link>
                <a
                  href="#how"
                  className="inline-flex items-center gap-2 rounded-xl px-6 py-3 text-sm font-medium text-slate-700 hover:bg-white transition-all"
                  style={{ border: '1px solid #cbd5e1' }}
                >
                  Learn More
                </a>
              </div>
            </div>
            <div className="flex items-center justify-center">
              <div className="text-center" style={{ fontFamily: 'Playfair Display, serif' }}>
                <p className="text-4xl font-bold" style={{ color: '#0f2918' }}>Safer Hills</p>
                <p className="text-3xl font-bold mt-1" style={{ color: '#276942' }}>Stronger India</p>
                <div className="flex justify-center gap-1 mt-3">
                  <span className="h-2 w-8 rounded-full" style={{ background: '#ff9933' }} />
                  <span className="h-2 w-8 rounded-full bg-white border border-slate-200" />
                  <span className="h-2 w-8 rounded-full" style={{ background: '#138808' }} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Footer ────────────────────────────────── */}
      <footer
        className="py-10"
        style={{ background: '#060f0a', borderTop: '1px solid rgba(255,255,255,0.06)' }}
      >
        <div className="mx-auto max-w-6xl px-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-2.5">
              <div className="flex h-7 w-7 items-center justify-center rounded-lg" style={{ background: 'linear-gradient(135deg, #276942, #1a6b5c)' }}>
                <Shield className="h-3.5 w-3.5 text-white" />
              </div>
              <div>
                <div className="text-sm font-bold text-white tracking-widest">AARAKSH</div>
                <div className="text-[10px] text-slate-600">SIH 2026 · Problem SIH26192</div>
              </div>
            </div>
            <div className="flex gap-6 text-xs text-slate-600">
              <a href="#challenge" className="hover:text-slate-400 transition-colors">Home</a>
              <a href="#how" className="hover:text-slate-400 transition-colors">How It Works</a>
              <a href="#impact" className="hover:text-slate-400 transition-colors">Impact</a>
              <Link to={ROUTES.LOGIN} className="hover:text-slate-400 transition-colors">Access</Link>
            </div>
            <div className="text-xs text-slate-700">
              <p>© 2026 AARAKSH — NeuroNauts Team</p>
              <p className="mt-0.5" style={{ color: '#276942' }}>Built for a Safer, Stronger India</p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
