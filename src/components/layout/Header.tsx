import { Menu, Bell, ChevronDown, Search, RefreshCw } from 'lucide-react';
import { useLocation, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useDemoMode } from '@/contexts/DemoContext';
import { cn, formatTime, getRiskColor } from '@/lib/utils';
import { ROUTES } from '@/lib/constants';
import { useState, useEffect } from 'react';
import { useAlerts } from '@/hooks/useAlerts';

function getPageTitle(pathname: string): { title: string; sub: string } {
  const map: Record<string, { title: string; sub: string }> = {
    '/app/dashboard':    { title: 'Dashboard',       sub: 'Live intelligence for safer hills' },
    '/app/risk-map':     { title: 'Risk Map',         sub: 'Interactive GIS for real-time risk intelligence' },
    '/app/predictions':  { title: 'AI Risk Predictions', sub: 'Forecasting risk to enable early action' },
    '/app/alerts':       { title: 'Active Alerts',    sub: 'Real-time alerts for at-risk locations' },
    '/app/locations':    { title: 'Locations',        sub: 'Monitor your saved regions' },
    '/app/safety-centre':{ title: 'Safety Centre',    sub: 'Emergency guidance and contacts' },
    '/app/reports':      { title: 'Reports & Insights', sub: 'Analytical summaries and trends' },
    '/app/profile':      { title: 'Profile',          sub: 'Account settings' },
    '/app/settings':     { title: 'Settings',         sub: 'Application preferences' },
    '/admin/dashboard':  { title: 'Command Centre',   sub: 'System overview and operations' },
    '/admin/risk-monitoring': { title: 'Risk Monitoring', sub: 'Comprehensive risk surveillance' },
    '/admin/live-sensors': { title: 'Data Feeds',     sub: 'Environmental data ingestion status' },
    '/admin/locations':  { title: 'Location Management', sub: 'Configure monitored regions' },
    '/admin/alerts':     { title: 'Alert Management', sub: 'Manage and dispatch alerts' },
    '/admin/predictions':{ title: 'Prediction Engine', sub: 'AI risk forecasting operations' },
    '/admin/users':      { title: 'User Management',  sub: 'Access control and user accounts' },
    '/admin/data-sources':{ title: 'Data Sources',    sub: 'External data feed configuration' },
    '/admin/models':     { title: 'ML Models',        sub: 'Model management and validation' },
    '/admin/reports':    { title: 'Reports',          sub: 'Operational intelligence reports' },
    '/admin/audit-logs': { title: 'Audit Logs',       sub: 'System activity trail' },
    '/admin/settings':   { title: 'Settings',         sub: 'System configuration' },
  };
  return map[pathname] ?? { title: 'AARAKSH', sub: 'Flash Flood Intelligence Platform' };
}

interface HeaderProps {
  onMenuToggle: () => void;
}

export function Header({ onMenuToggle }: HeaderProps) {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const { isDemoMode, currentScenario } = useDemoMode();
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const [time, setTime] = useState(new Date());
  const { data: alerts } = useAlerts({ status: ['ACTIVE'] });
  const activeCount = alerts?.length ?? 0;

  const page = getPageTitle(location.pathname);
  const riskColor = getRiskColor(currentScenario.riskLevel);

  useEffect(() => {
    const t = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(t);
  }, []);

  const day = time.toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' });
  const clock = time.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false });

  const notifList = [
    { title: 'Critical risk detected', desc: 'Rambara — risk escalated to CRITICAL', time: '2m ago', color: '#ef4444' },
    { title: 'Risk increased', desc: 'Gaurikund risk level now HIGH', time: '18m ago', color: '#f97316' },
    { title: 'Rainfall surge', desc: 'Sonprayag — 96mm/hr recorded', time: '1h ago', color: '#eab308' },
  ];

  return (
    <header
      className="flex h-14 flex-shrink-0 items-center px-4 gap-3 flex-shrink-0"
      style={{
        background: 'rgba(6,15,10,0.95)',
        backdropFilter: 'blur(12px)',
        borderBottom: '1px solid rgba(255,255,255,0.06)',
      }}
    >
      {/* Hamburger */}
      <button
        onClick={onMenuToggle}
        className="text-slate-500 hover:text-white rounded-md p-1.5 transition-colors hover:bg-white/8"
        aria-label="Toggle sidebar"
      >
        <Menu className="h-5 w-5" />
      </button>

      {/* Page title */}
      <div className="flex-1 min-w-0">
        <div className="flex items-baseline gap-2">
          <h1 className="text-sm font-semibold text-white truncate">{page.title}</h1>
          <span className="hidden md:block text-xs text-slate-500 truncate">{page.sub}</span>
        </div>
      </div>

      {/* Scenario chip */}
      {isDemoMode && (
        <div
          className="hidden sm:flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium"
          style={{
            background: `${riskColor}18`,
            border: `1px solid ${riskColor}40`,
            color: riskColor,
          }}
        >
          <span className="h-1.5 w-1.5 rounded-full animate-pulse" style={{ background: riskColor }} />
          {currentScenario.label}
        </div>
      )}

      {/* Clock */}
      <div className="hidden lg:flex flex-col items-end leading-tight">
        <span className="text-xs font-mono text-slate-300">{clock}</span>
        <span className="text-[10px] text-slate-600">{day}</span>
      </div>

      {/* System status dot */}
      <div className="hidden sm:flex items-center gap-1.5">
        <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
        <span className="text-xs font-medium text-emerald-400">LIVE</span>
      </div>

      {/* Notifications */}
      <div className="relative">
        <button
          onClick={() => { setNotifOpen(o => !o); setUserMenuOpen(false); }}
          className="relative text-slate-500 hover:text-white rounded-md p-1.5 hover:bg-white/8 transition-colors"
          aria-label="Notifications"
        >
          <Bell className="h-4 w-4" />
          {activeCount > 0 && (
            <span
              className="absolute top-0.5 right-0.5 h-4 w-4 rounded-full text-[9px] font-bold text-white flex items-center justify-center"
              style={{ background: '#ef4444' }}
            >
              {activeCount > 9 ? '9+' : activeCount}
            </span>
          )}
        </button>
        {notifOpen && (
          <div
            className="absolute right-0 top-full mt-2 w-80 rounded-xl z-50 animate-fade-in overflow-hidden"
            style={{ background: 'rgba(6,15,10,0.98)', border: '1px solid rgba(255,255,255,0.08)', backdropFilter: 'blur(20px)', boxShadow: '0 20px 60px rgba(0,0,0,0.6)' }}
          >
            <div className="flex items-center justify-between px-4 py-3" style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
              <span className="text-sm font-semibold text-white">Notifications</span>
              <span className="rounded-full px-1.5 py-0.5 text-xs font-bold" style={{ background: 'rgba(239,68,68,0.2)', color: '#ef4444' }}>{notifList.length} new</span>
            </div>
            <div className="divide-y" style={{ borderColor: 'rgba(255,255,255,0.05)' }}>
              {notifList.map((n, i) => (
                <div key={i} className="flex gap-3 px-4 py-3 hover:bg-white/4 cursor-pointer transition-colors">
                  <span className="mt-1 h-2 w-2 flex-shrink-0 rounded-full" style={{ backgroundColor: n.color }} />
                  <div className="min-w-0">
                    <p className="text-xs font-medium text-slate-200">{n.title}</p>
                    <p className="text-xs text-slate-500 truncate">{n.desc}</p>
                    <p className="text-[10px] text-slate-600 mt-0.5">{n.time}</p>
                  </div>
                </div>
              ))}
            </div>
            <div className="px-4 py-2" style={{ borderTop: '1px solid rgba(255,255,255,0.05)' }}>
              <button onClick={() => { navigate(ROUTES.APP_ALERTS); setNotifOpen(false); }}
                className="text-xs text-emerald-400 hover:text-emerald-300 font-medium">
                View all alerts →
              </button>
            </div>
          </div>
        )}
      </div>

      {/* User menu */}
      <div className="relative">
        <button
          onClick={() => { setUserMenuOpen(o => !o); setNotifOpen(false); }}
          className="flex items-center gap-2 rounded-lg px-2 py-1.5 hover:bg-white/8 transition-colors"
        >
          <div
            className="flex h-7 w-7 items-center justify-center rounded-full text-xs font-bold text-white"
            style={{ background: 'linear-gradient(135deg, #276942, #1a6b5c)' }}
          >
            {user?.avatarInitials ?? 'U'}
          </div>
          <span className="hidden sm:block text-xs font-medium text-slate-300">{user?.fullName.split(' ')[0]}</span>
          <ChevronDown className="h-3 w-3 text-slate-500" />
        </button>
        {userMenuOpen && (
          <div
            className="absolute right-0 top-full mt-2 w-52 rounded-xl z-50 animate-fade-in overflow-hidden"
            style={{ background: 'rgba(6,15,10,0.98)', border: '1px solid rgba(255,255,255,0.08)', backdropFilter: 'blur(20px)', boxShadow: '0 20px 60px rgba(0,0,0,0.6)' }}
          >
            <div className="px-4 py-3" style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
              <p className="text-xs font-semibold text-white">{user?.fullName}</p>
              <p className="text-xs text-slate-500 truncate mt-0.5">{user?.email}</p>
              <span
                className="mt-1.5 inline-flex items-center rounded-full px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider"
                style={{ background: 'rgba(53,169,141,0.15)', color: '#35a98d', border: '1px solid rgba(53,169,141,0.25)' }}
              >
                {user?.role}
              </span>
            </div>
            <div className="p-1.5">
              <Link to={ROUTES.APP_PROFILE} onClick={() => setUserMenuOpen(false)}
                className="flex items-center gap-2 rounded-lg px-3 py-2 text-xs text-slate-400 hover:text-white hover:bg-white/6 transition-colors">
                Profile
              </Link>
              <Link to={ROUTES.APP_SETTINGS} onClick={() => setUserMenuOpen(false)}
                className="flex items-center gap-2 rounded-lg px-3 py-2 text-xs text-slate-400 hover:text-white hover:bg-white/6 transition-colors">
                Settings
              </Link>
              <div className="my-1" style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }} />
              <button
                onClick={() => { logout(); navigate(ROUTES.LOGIN); }}
                className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-xs text-red-400 hover:bg-red-500/10 transition-colors">
                Logout
              </button>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
