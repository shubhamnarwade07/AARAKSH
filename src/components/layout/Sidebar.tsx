import { NavLink, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard, Map, TrendingUp, Bell, MapPin, Shield, FileText,
  User, Settings, LogOut, Activity, Database,
  Users, Brain, ScrollText, X, Gauge, CloudRain, BookOpen, ChevronRight
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAuth } from '@/contexts/AuthContext';
import { ROUTES } from '@/lib/constants';
import { useDemoMode } from '@/contexts/DemoContext';
import { getRiskColor } from '@/lib/utils';

interface SidebarProps {
  isOpen: boolean;
  isMobileOpen: boolean;
  onMobileClose: () => void;
}

interface NavItem {
  label: string;
  icon: React.ReactNode;
  to: string;
}

function useNavItems() {
  const { isAdmin, isAuthority } = useAuth();

  if (isAdmin || isAuthority) {
    return {
      primary: [
        { label: 'Overview', icon: <Gauge className="h-4 w-4" />, to: ROUTES.ADMIN_DASHBOARD },
        { label: 'Risk Monitoring', icon: <Activity className="h-4 w-4" />, to: ROUTES.ADMIN_RISK_MONITORING },
        { label: 'Risk Map', icon: <Map className="h-4 w-4" />, to: ROUTES.APP_RISK_MAP },
        { label: 'Locations', icon: <MapPin className="h-4 w-4" />, to: ROUTES.ADMIN_LOCATIONS },
        { label: 'Alerts', icon: <Bell className="h-4 w-4" />, to: ROUTES.ADMIN_ALERTS },
        { label: 'Predictions', icon: <TrendingUp className="h-4 w-4" />, to: ROUTES.ADMIN_PREDICTIONS },
        { label: 'Data Feeds', icon: <CloudRain className="h-4 w-4" />, to: ROUTES.ADMIN_DATA_FEEDS },
        { label: 'Safety Centre', icon: <Shield className="h-4 w-4" />, to: ROUTES.APP_SAFETY_CENTRE },
      ],
      management: isAdmin ? [
        { label: 'Users', icon: <Users className="h-4 w-4" />, to: ROUTES.ADMIN_USERS },
        { label: 'ML Models', icon: <Brain className="h-4 w-4" />, to: ROUTES.ADMIN_MODELS },
        { label: 'Reports', icon: <FileText className="h-4 w-4" />, to: ROUTES.ADMIN_REPORTS },
        { label: 'Audit Logs', icon: <ScrollText className="h-4 w-4" />, to: ROUTES.ADMIN_AUDIT_LOGS },
      ] : [
        { label: 'Reports', icon: <FileText className="h-4 w-4" />, to: ROUTES.ADMIN_REPORTS },
      ],
      system: [
        { label: 'Settings', icon: <Settings className="h-4 w-4" />, to: ROUTES.ADMIN_SETTINGS },
      ],
    };
  }

  return {
    primary: [
      { label: 'Dashboard', icon: <LayoutDashboard className="h-4 w-4" />, to: ROUTES.APP_DASHBOARD },
      { label: 'Risk Map', icon: <Map className="h-4 w-4" />, to: ROUTES.APP_RISK_MAP },
      { label: 'Predictions', icon: <TrendingUp className="h-4 w-4" />, to: ROUTES.APP_PREDICTIONS },
      { label: 'Alerts', icon: <Bell className="h-4 w-4" />, to: ROUTES.APP_ALERTS },
      { label: 'Locations', icon: <MapPin className="h-4 w-4" />, to: ROUTES.APP_LOCATIONS },
      { label: 'Safety Centre', icon: <Shield className="h-4 w-4" />, to: ROUTES.APP_SAFETY_CENTRE },
      { label: 'Reports', icon: <FileText className="h-4 w-4" />, to: ROUTES.APP_REPORTS },
    ],
    management: [],
    system: [
      { label: 'Profile', icon: <User className="h-4 w-4" />, to: ROUTES.APP_PROFILE },
      { label: 'Settings', icon: <Settings className="h-4 w-4" />, to: ROUTES.APP_SETTINGS },
    ],
  };
}

function NavItemComp({ item, isCollapsed }: { item: NavItem; isCollapsed: boolean }) {
  return (
    <NavLink
      to={item.to}
      title={isCollapsed ? item.label : undefined}
      className={({ isActive }) =>
        cn(
          'relative flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-150',
          'text-slate-400 hover:text-white',
          isActive
            ? 'bg-white/10 text-white nav-active-glow'
            : 'hover:bg-white/6',
          isCollapsed && 'justify-center px-2'
        )
      }
    >
      {({ isActive }) => (
        <>
          <span className={cn('flex-shrink-0', isActive ? 'text-emerald-400' : '')}>{item.icon}</span>
          {!isCollapsed && <span>{item.label}</span>}
          {isActive && !isCollapsed && <ChevronRight className="ml-auto h-3 w-3 text-emerald-400 opacity-60" />}
        </>
      )}
    </NavLink>
  );
}

export function Sidebar({ isOpen, isMobileOpen, onMobileClose }: SidebarProps) {
  const navigate = useNavigate();
  const { logout, user } = useAuth();
  const { currentScenario, scenarioRiskData } = useDemoMode();
  const navItems = useNavItems();
  const isCollapsed = !isOpen;

  const handleLogout = () => {
    logout();
    navigate(ROUTES.LOGIN);
  };

  const roleLabel = user?.role === 'ADMIN' ? 'System Admin' : user?.role === 'AUTHORITY' ? 'Authority' : 'Citizen';
  const riskColor = getRiskColor(currentScenario.riskLevel);

  const content = (
    <div
      className={cn(
        'flex flex-col h-full transition-all duration-300 dark-panel',
        isCollapsed ? 'w-16' : 'w-56'
      )}
      style={{
        background: 'linear-gradient(180deg, #060f0a 0%, #0a1a10 100%)',
        borderRight: '1px solid rgba(255,255,255,0.06)',
      }}
    >
      {/* Brand */}
      <div
        className={cn(
          'flex items-center gap-3 py-4 px-4 flex-shrink-0',
          isCollapsed && 'justify-center px-2'
        )}
        style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}
      >
        <div
          className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg"
          style={{ background: 'linear-gradient(135deg, #276942, #1a6b5c)' }}
        >
          <Shield className="h-4 w-4 text-white" />
        </div>
        {!isCollapsed && (
          <div className="min-w-0">
            <div className="text-sm font-bold tracking-widest text-white" style={{ letterSpacing: '0.15em' }}>AARAKSH</div>
            <div className="text-[10px] text-slate-500">Flash Flood Intelligence</div>
          </div>
        )}
        <button
          onClick={onMobileClose}
          className="ml-auto text-slate-500 hover:text-white lg:hidden"
        >
          <X className="h-4 w-4" />
        </button>
      </div>

      {/* Scenario status chip */}
      {!isCollapsed && (
        <div className="mx-3 mt-3 mb-1 rounded-lg px-3 py-2" style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.06)' }}>
          <div className="flex items-center justify-between">
            <span className="text-[10px] text-slate-500 uppercase tracking-wider">Scenario</span>
            <span className="text-[10px] font-semibold" style={{ color: riskColor }}>{currentScenario.riskLevel}</span>
          </div>
          <div className="flex items-center gap-1.5 mt-1">
            <span className="h-1.5 w-1.5 rounded-full animate-pulse" style={{ backgroundColor: riskColor }} />
            <span className="text-xs text-slate-300 truncate">{currentScenario.label}</span>
          </div>
        </div>
      )}

      {/* Role badge */}
      {!isCollapsed && user && (
        <div className="mx-3 mt-2 mb-1">
          <span className="inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider"
            style={{ background: 'rgba(53,169,141,0.15)', color: '#35a98d', border: '1px solid rgba(53,169,141,0.25)' }}>
            {roleLabel}
          </span>
        </div>
      )}

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto px-2 py-2 space-y-0.5 dark-panel">
        {navItems.primary.map(item => (
          <NavItemComp key={item.to} item={item} isCollapsed={isCollapsed} />
        ))}

        {navItems.management.length > 0 && (
          <>
            {!isCollapsed && (
              <div className="pt-4 pb-1 px-3">
                <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-600">Management</span>
              </div>
            )}
            {isCollapsed && <div className="my-2 mx-1" style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }} />}
            {navItems.management.map(item => (
              <NavItemComp key={item.to} item={item} isCollapsed={isCollapsed} />
            ))}
          </>
        )}
      </nav>

      {/* Bottom */}
      <div className="px-2 py-3 space-y-0.5 flex-shrink-0" style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}>
        {navItems.system.map(item => (
          <NavItemComp key={item.to} item={item} isCollapsed={isCollapsed} />
        ))}
        <button
          onClick={handleLogout}
          className={cn(
            'flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-slate-500 hover:bg-white/6 hover:text-red-400 transition-all',
            isCollapsed && 'justify-center px-2'
          )}
          title={isCollapsed ? 'Logout' : undefined}
        >
          <LogOut className="h-4 w-4 flex-shrink-0" />
          {!isCollapsed && <span>Logout</span>}
        </button>
      </div>
    </div>
  );

  return (
    <>
      <aside className="hidden lg:flex flex-shrink-0">{content}</aside>
      <aside
        className={cn(
          'fixed inset-y-0 left-0 z-30 flex flex-shrink-0 lg:hidden transition-transform duration-300',
          isMobileOpen ? 'translate-x-0' : '-translate-x-full'
        )}
      >
        {content}
      </aside>
    </>
  );
}
