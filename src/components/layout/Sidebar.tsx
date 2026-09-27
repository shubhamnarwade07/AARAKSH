import { NavLink, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard, Map, TrendingUp, Bell, MapPin, Shield, FileText,
  User, Settings, LogOut, Activity,
  Users, Brain, ScrollText, X, Gauge, CloudRain, ChevronRight
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAuth } from '@/contexts/AuthContext';
import { ROUTES } from '@/lib/constants';
import { useDemoMode } from '@/contexts/DemoContext';
import { useTheme } from '@/contexts/ThemeContext';
import { getRiskColor } from '@/lib/utils';
import { AarakshLogo } from '@/components/ui/AarakshLogo';

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
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  return (
    <NavLink
      to={item.to}
      title={isCollapsed ? item.label : undefined}
      className={({ isActive }) =>
        cn(
          'relative flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-150',
          isActive
            ? isDark
              ? 'bg-sky-500/15 text-white nav-active-glow border-l-2 border-sky-400'
              : 'bg-sky-50 text-sky-900 border-l-2 border-sky-600'
            : isDark
            ? 'text-slate-400 hover:text-white hover:bg-white/6'
            : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100',
          isCollapsed && 'justify-center px-2'
        )
      }
    >
      {({ isActive }) => (
        <>
          <span className={cn('flex-shrink-0', isActive ? (isDark ? 'text-sky-400' : 'text-sky-600') : '')}>
            {item.icon}
          </span>
          {!isCollapsed && <span>{item.label}</span>}
          {isActive && !isCollapsed && (
            <ChevronRight className={cn('ml-auto h-3 w-3 opacity-60', isDark ? 'text-sky-400' : 'text-sky-600')} />
          )}
        </>
      )}
    </NavLink>
  );
}

export function Sidebar({ isOpen, isMobileOpen, onMobileClose }: SidebarProps) {
  const navigate = useNavigate();
  const { logout, user } = useAuth();
  const { currentScenario } = useDemoMode();
  const { theme } = useTheme();
  const isDark = theme === 'dark';
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
        background: 'var(--bg-sidebar)',
        borderRight: '1px solid var(--border-subtle)',
      }}
    >
      {/* Brand */}
      <div
        className={cn(
          'flex items-center gap-3 py-4 px-4 flex-shrink-0',
          isCollapsed && 'justify-center px-2'
        )}
        style={{ borderBottom: '1px solid var(--border-subtle)' }}
      >
        {/* Brand Logo */}
        <AarakshLogo size="sm" />
        {!isCollapsed && (
          <div className="min-w-0">
            <div
              className="text-sm font-bold tracking-widest uppercase"
              style={{ letterSpacing: '0.15em', color: 'var(--text-primary)' }}
            >
              AARAKSH
            </div>
            <div className="text-[10px] text-slate-400">Flash Flood Intelligence</div>
          </div>
        )}
        <button
          onClick={onMobileClose}
          className="ml-auto text-slate-400 hover:text-slate-200 lg:hidden"
        >
          <X className="h-4 w-4" />
        </button>
      </div>

      {/* Scenario status chip */}
      {!isCollapsed && (
        <div
          className="mx-3 mt-3 mb-1 rounded-lg px-3 py-2"
          style={{
            background: isDark ? 'rgba(255,255,255,0.04)' : '#f8fafc',
            border: '1px solid var(--border-subtle)',
          }}
        >
          <div className="flex items-center justify-between">
            <span className="text-[10px] text-slate-400 uppercase tracking-wider">Scenario</span>
            <span className="text-[10px] font-semibold" style={{ color: riskColor }}>{currentScenario.riskLevel}</span>
          </div>
          <div className="flex items-center gap-1.5 mt-1">
            <span className="h-1.5 w-1.5 rounded-full animate-pulse" style={{ backgroundColor: riskColor }} />
            <span className="text-xs truncate font-medium" style={{ color: 'var(--text-secondary)' }}>
              {currentScenario.label}
            </span>
          </div>
        </div>
      )}

      {/* Role badge */}
      {!isCollapsed && user && (
        <div className="mx-3 mt-2 mb-1">
          <span
            className="inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider"
            style={{
              background: 'rgba(56,189,248,0.15)',
              color: isDark ? '#38bdf8' : '#0284c7',
              border: '1px solid rgba(56,189,248,0.25)',
            }}
          >
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
                <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">Management</span>
              </div>
            )}
            {isCollapsed && <div className="my-2 mx-1" style={{ borderTop: '1px solid var(--border-subtle)' }} />}
            {navItems.management.map(item => (
              <NavItemComp key={item.to} item={item} isCollapsed={isCollapsed} />
            ))}
          </>
        )}
      </nav>

      {/* Bottom */}
      <div className="px-2 py-3 space-y-0.5 flex-shrink-0" style={{ borderTop: '1px solid var(--border-subtle)' }}>
        {navItems.system.map(item => (
          <NavItemComp key={item.to} item={item} isCollapsed={isCollapsed} />
        ))}
        <button
          onClick={handleLogout}
          className={cn(
            'flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-slate-400 hover:text-red-400 transition-all hover:bg-red-500/10',
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
