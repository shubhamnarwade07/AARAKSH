import { Shield, AlertTriangle, CheckSquare, Phone, MapPin, Info, ArrowRight, Navigation } from 'lucide-react';
import { useDemoMode } from '@/contexts/DemoContext';
import { getRiskColor } from '@/lib/utils';
import { Link } from 'react-router-dom';
import { ROUTES } from '@/lib/constants';

const ACTIONS_BY_LEVEL = {
  LOW: [
    { icon: '📻', action: 'Stay informed about weather forecasts for your area.' },
    { icon: '📋', action: 'Ensure emergency contacts are saved and up to date.' },
    { icon: '🎒', action: 'Check your emergency supplies periodically.' },
  ],
  MODERATE: [
    { icon: '📱', action: 'Monitor AARAKSH alerts and local weather closely.' },
    { icon: '🎒', action: 'Prepare emergency supplies: water, food, medications, documents.' },
    { icon: '🗺', action: 'Know your nearest evacuation route and safe zone.' },
    { icon: '👥', action: 'Stay in contact with family and neighbors.' },
  ],
  HIGH: [
    { icon: '⚡', action: 'Be ready to evacuate on short notice — pack now.' },
    { icon: '📁', action: 'Move important documents and valuables to safety.' },
    { icon: '🔔', action: 'Alert elderly and vulnerable neighbors immediately.' },
    { icon: '⛔', action: 'Avoid low-lying areas, riverbanks and steep slopes.' },
    { icon: '📡', action: 'Monitor official announcements continuously.' },
  ],
  CRITICAL: [
    { icon: '🚨', action: 'Evacuate immediately if instructed by authorities.' },
    { icon: '🚫', action: 'Do not attempt to cross flooded roads or streams.' },
    { icon: '⛰', action: 'Move to higher ground without delay.' },
    { icon: '📞', action: 'Contact emergency services if assistance is needed.' },
    { icon: '👮', action: 'Follow directions of local disaster response teams.' },
  ],
};

const BEFORE = [
  'Keep emergency bag ready with documents, medications, cash.',
  'Know your nearest safe zone or shelter.',
  'Store clean water (at least 3 days supply).',
  'Keep mobile phones charged.',
  'Register emergency contacts in your phone.',
];
const DURING = [
  'Stay away from rivers, streams and drains.',
  'Do not drive through floodwater.',
  'Move to higher ground immediately.',
  'Follow directions of authorities.',
  'Do not return until declared safe.',
];
const AFTER = [
  'Do not enter flood-damaged structures without inspection.',
  'Avoid contact with floodwater — it may be contaminated.',
  'Report damage to local authorities.',
  'Check on neighbors and assist where possible.',
  'Document losses for insurance/aid purposes.',
];
const CONTACTS = [
  { name: 'NDRF Helpline', number: '011-24363260', icon: '🚁' },
  { name: 'National Disaster Helpline', number: '1078', icon: '🆘' },
  { name: 'SDMA Uttarakhand', number: '1070', icon: '🏔' },
  { name: 'Ambulance', number: '108', icon: '🚑' },
  { name: 'Police', number: '100', icon: '👮' },
  { name: 'Fire', number: '101', icon: '🔥' },
];

const AVOIDANCE = [
  'River banks and stream channels',
  'Steep slopes and unstable ground',
  'Flooded roads and water crossings',
  'Landslide-prone hillsides',
  'Structures with visible damage',
  'Underground spaces during heavy rain',
];

export function SafetyCentrePage() {
  const { currentScenario } = useDemoMode();
  const level = currentScenario.riskLevel;
  const actions = ACTIONS_BY_LEVEL[level];
  const riskColor = getRiskColor(level);

  const levelConfig = {
    CRITICAL: { msg: 'Evacuate now. Immediate threat to life.', bg: 'rgba(239,68,68,0.12)', border: 'rgba(239,68,68,0.3)' },
    HIGH:     { msg: 'Prepare to evacuate. Stay alert and ready.', bg: 'rgba(249,115,22,0.1)', border: 'rgba(249,115,22,0.3)' },
    MODERATE: { msg: 'Stay alert. Monitor conditions and be prepared.', bg: 'rgba(234,179,8,0.08)', border: 'rgba(234,179,8,0.25)' },
    LOW:      { msg: 'Normal conditions. Stay informed.', bg: 'rgba(34,197,94,0.08)', border: 'rgba(34,197,94,0.2)' },
  }[level];

  return (
    <div className="p-4 md:p-6 space-y-4">
      {/* Demo banner */}
      <div className="flex items-center gap-2 rounded-lg px-3 py-2 text-xs" style={{ background: 'rgba(234,179,8,0.08)', border: '1px solid rgba(234,179,8,0.2)', color: '#ca8a04' }}>
        <span className="h-1.5 w-1.5 rounded-full bg-amber-500 flex-shrink-0" />
        <span className="font-semibold text-amber-600">PROTOTYPE / DEMO DATA</span>
        <span className="text-amber-700/70 hidden sm:block">— Emergency guidance is general. Contact local authorities in a real emergency.</span>
      </div>

      {/* Risk status banner */}
      <div
        className="rounded-xl px-5 py-4"
        style={{ background: levelConfig.bg, border: `1px solid ${levelConfig.border}` }}
      >
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs text-slate-400 mb-1 uppercase tracking-wider">Current Area Risk Level (Demo)</p>
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2">
                <span className="h-3 w-3 rounded-full" style={{ background: riskColor }} />
                <span className="text-lg font-bold uppercase tracking-wide" style={{ color: riskColor }}>{level} RISK</span>
              </div>
              <span className="text-sm text-slate-300">{levelConfig.msg}</span>
            </div>
          </div>
          <Shield className="h-10 w-10 opacity-20" style={{ color: riskColor }} />
        </div>
      </div>

      {/* Two column layout */}
      <div className="grid lg:grid-cols-3 gap-4">
        {/* What to do now — 2 cols */}
        <div className="lg:col-span-2 space-y-4">
          <div className="rounded-xl overflow-hidden" style={{ background: 'rgba(15,41,24,0.5)', border: '1px solid rgba(255,255,255,0.06)' }}>
            <div className="px-5 py-3 flex items-center gap-2" style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
              <AlertTriangle className="h-4 w-4" style={{ color: riskColor }} />
              <h3 className="text-sm font-semibold text-white">What To Do Right Now</h3>
              <span className="ml-auto text-[10px] rounded-full px-2 py-0.5" style={{ background: 'rgba(255,255,255,0.06)', color: '#94a3b8' }}>{level} scenario</span>
            </div>
            <div className="p-5 space-y-3">
              {actions.map((item, i) => (
                <div key={i} className="flex items-start gap-3 rounded-lg px-3 py-2.5" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.04)' }}>
                  <span className="text-lg flex-shrink-0">{item.icon}</span>
                  <p className="text-sm text-slate-300 leading-relaxed">{item.action}</p>
                  <span className="ml-auto flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full text-xs font-bold" style={{ background: `${riskColor}20`, color: riskColor }}>{i + 1}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Avoid section */}
          <div className="rounded-xl overflow-hidden" style={{ background: 'rgba(239,68,68,0.05)', border: '1px solid rgba(239,68,68,0.15)' }}>
            <div className="px-5 py-3" style={{ borderBottom: '1px solid rgba(239,68,68,0.1)' }}>
              <h3 className="text-sm font-semibold" style={{ color: '#fca5a5' }}>⛔ Areas to Avoid</h3>
            </div>
            <div className="p-4 grid grid-cols-2 gap-2">
              {AVOIDANCE.map((item, i) => (
                <div key={i} className="flex items-center gap-2 text-xs text-slate-400">
                  <span className="h-1.5 w-1.5 rounded-full bg-red-500 flex-shrink-0" />
                  {item}
                </div>
              ))}
            </div>
          </div>

          {/* Before / During / After tabs */}
          <div className="grid grid-cols-3 gap-3">
            {[{ title: 'Before', icon: '🕐', items: BEFORE, color: '#35a98d' }, { title: 'During', icon: '⚡', items: DURING, color: '#f97316' }, { title: 'After', icon: '✓', items: AFTER, color: '#22c55e' }].map(sec => (
              <div key={sec.title} className="rounded-xl overflow-hidden" style={{ background: 'rgba(15,41,24,0.4)', border: '1px solid rgba(255,255,255,0.06)' }}>
                <div className="px-4 py-3" style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
                  <h3 className="text-xs font-semibold text-white">{sec.icon} {sec.title} a Flood</h3>
                </div>
                <div className="p-3 space-y-2">
                  {sec.items.map((item, i) => (
                    <div key={i} className="flex items-start gap-2">
                      <span className="mt-0.5 h-1.5 w-1.5 rounded-full flex-shrink-0" style={{ background: sec.color }} />
                      <p className="text-xs text-slate-400 leading-relaxed">{item}</p>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right: contacts + nav */}
        <div className="space-y-4">
          {/* Emergency contacts */}
          <div className="rounded-xl overflow-hidden" style={{ background: 'rgba(15,41,24,0.5)', border: '1px solid rgba(255,255,255,0.06)' }}>
            <div className="px-4 py-3 flex items-center gap-2" style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
              <Phone className="h-4 w-4 text-emerald-400" />
              <h3 className="text-sm font-semibold text-white">Emergency Contacts</h3>
            </div>
            <div className="p-3 space-y-1">
              {CONTACTS.map((c, i) => (
                <div key={i} className="flex items-center justify-between rounded-lg px-3 py-2.5 hover:bg-white/4 transition-colors">
                  <div className="flex items-center gap-2">
                    <span>{c.icon}</span>
                    <span className="text-xs text-slate-300">{c.name}</span>
                  </div>
                  <a href={`tel:${c.number}`} className="font-mono font-bold text-sm hover:text-emerald-300 transition-colors" style={{ color: '#35a98d' }}>
                    {c.number}
                  </a>
                </div>
              ))}
            </div>
            <div className="px-4 py-2" style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}>
              <p className="text-[10px] text-slate-600">Numbers are illustrative. Verify with local authorities.</p>
            </div>
          </div>

          {/* Quick links */}
          <div className="rounded-xl overflow-hidden" style={{ background: 'rgba(15,41,24,0.4)', border: '1px solid rgba(255,255,255,0.06)' }}>
            <div className="px-4 py-3" style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
              <h3 className="text-sm font-semibold text-white">Quick Navigation</h3>
            </div>
            <div className="p-3 space-y-2">
              {[
                { to: ROUTES.APP_ALERTS, label: 'View Active Alerts', color: '#ef4444' },
                { to: ROUTES.APP_RISK_MAP, label: 'Open Risk Map', color: '#35a98d' },
                { to: ROUTES.APP_PREDICTIONS, label: 'Check Predictions', color: '#f97316' },
              ].map(link => (
                <Link
                  key={link.to}
                  to={link.to}
                  className="flex items-center justify-between rounded-lg px-3 py-2.5 text-sm font-medium text-white hover:bg-white/6 transition-colors"
                  style={{ border: `1px solid ${link.color}30` }}
                >
                  {link.label}
                  <ArrowRight className="h-3.5 w-3.5" style={{ color: link.color }} />
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
