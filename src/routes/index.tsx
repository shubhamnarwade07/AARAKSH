import { Routes, Route, Navigate } from 'react-router-dom';
import { lazy, Suspense } from 'react';
import { Spinner } from '@/components/ui/Spinner';
import { AppShell } from '@/components/layout/AppShell';
import { ProtectedRoute } from './ProtectedRoute';
import { ROUTES } from '@/lib/constants';

// Public pages
import { LandingPage } from '@/pages/public/LandingPage';
import { LoginPage } from '@/pages/auth/LoginPage';
import { RegisterPage } from '@/pages/auth/RegisterPage';
import { NotFoundPage } from '@/pages/system/NotFoundPage';
import { UnauthorizedPage } from '@/pages/system/UnauthorizedPage';

// User pages (lazy loaded)
const DashboardPage = lazy(() => import('@/pages/user/DashboardPage').then(m => ({ default: m.DashboardPage })));
const RiskMapPage = lazy(() => import('@/pages/user/RiskMapPage').then(m => ({ default: m.RiskMapPage })));
const PredictionsPage = lazy(() => import('@/pages/user/PredictionsPage').then(m => ({ default: m.PredictionsPage })));
const AlertsPage = lazy(() => import('@/pages/user/AlertsPage').then(m => ({ default: m.AlertsPage })));
const LocationsPage = lazy(() => import('@/pages/user/LocationsPage').then(m => ({ default: m.LocationsPage })));
const SafetyCentrePage = lazy(() => import('@/pages/user/SafetyCentrePage').then(m => ({ default: m.SafetyCentrePage })));
const ReportsPage = lazy(() => import('@/pages/user/ReportsPage').then(m => ({ default: m.ReportsPage })));
const ProfilePage = lazy(() => import('@/pages/user/ProfilePage').then(m => ({ default: m.ProfilePage })));
const SettingsPage = lazy(() => import('@/pages/user/SettingsPage').then(m => ({ default: m.SettingsPage })));

// Admin pages (lazy loaded)
const AdminDashboardPage = lazy(() => import('@/pages/admin/AdminDashboardPage').then(m => ({ default: m.AdminDashboardPage })));
const RiskMonitoringPage = lazy(() => import('@/pages/admin/RiskMonitoringPage').then(m => ({ default: m.RiskMonitoringPage })));
const LiveSensorsPage = lazy(() => import('@/pages/admin/LiveSensorsPage').then(m => ({ default: m.LiveSensorsPage })));
const AdminLocationsPage = lazy(() => import('@/pages/admin/AdminLocationsPage').then(m => ({ default: m.AdminLocationsPage })));
const AdminAlertsPage = lazy(() => import('@/pages/admin/AdminAlertsPage').then(m => ({ default: m.AdminAlertsPage })));
const AdminPredictionsPage = lazy(() => import('@/pages/admin/AdminPredictionsPage').then(m => ({ default: m.AdminPredictionsPage })));
const UsersPage = lazy(() => import('@/pages/admin/UsersPage').then(m => ({ default: m.UsersPage })));
const DataSourcesPage = lazy(() => import('@/pages/admin/DataSourcesPage').then(m => ({ default: m.DataSourcesPage })));
const MLModelsPage = lazy(() => import('@/pages/admin/MLModelsPage').then(m => ({ default: m.MLModelsPage })));
const AdminReportsPage = lazy(() => import('@/pages/admin/AdminReportsPage').then(m => ({ default: m.AdminReportsPage })));
const AuditLogsPage = lazy(() => import('@/pages/admin/AuditLogsPage').then(m => ({ default: m.AuditLogsPage })));
const AdminSettingsPage = lazy(() => import('@/pages/admin/AdminSettingsPage').then(m => ({ default: m.AdminSettingsPage })));

function PageLoader() {
  return (
    <div className="flex h-full items-center justify-center">
      <Spinner size="lg" />
    </div>
  );
}

export function AppRoutes() {
  return (
    <Routes>
      {/* Public */}
      <Route path={ROUTES.LANDING} element={<LandingPage />} />
      <Route path={ROUTES.LOGIN} element={<LoginPage />} />
      <Route path={ROUTES.REGISTER} element={<RegisterPage />} />
      <Route path={ROUTES.NOT_FOUND} element={<NotFoundPage />} />
      <Route path={ROUTES.UNAUTHORIZED} element={<UnauthorizedPage />} />

      {/* Authenticated user app */}
      <Route
        path="/app"
        element={
          <ProtectedRoute>
            <AppShell />
          </ProtectedRoute>
        }
      >
        <Route index element={<Navigate to={ROUTES.APP_DASHBOARD} replace />} />
        <Route path="dashboard" element={<Suspense fallback={<PageLoader />}><DashboardPage /></Suspense>} />
        <Route path="risk-map" element={<Suspense fallback={<PageLoader />}><RiskMapPage /></Suspense>} />
        <Route path="predictions" element={<Suspense fallback={<PageLoader />}><PredictionsPage /></Suspense>} />
        <Route path="alerts" element={<Suspense fallback={<PageLoader />}><AlertsPage /></Suspense>} />
        <Route path="locations" element={<Suspense fallback={<PageLoader />}><LocationsPage /></Suspense>} />
        <Route path="safety-centre" element={<Suspense fallback={<PageLoader />}><SafetyCentrePage /></Suspense>} />
        <Route path="reports" element={<Suspense fallback={<PageLoader />}><ReportsPage /></Suspense>} />
        <Route path="profile" element={<Suspense fallback={<PageLoader />}><ProfilePage /></Suspense>} />
        <Route path="settings" element={<Suspense fallback={<PageLoader />}><SettingsPage /></Suspense>} />
      </Route>

      {/* Admin routes */}
      <Route
        path="/admin"
        element={
          <ProtectedRoute requireAuthority>
            <AppShell />
          </ProtectedRoute>
        }
      >
        <Route index element={<Navigate to={ROUTES.ADMIN_DASHBOARD} replace />} />
        <Route path="dashboard" element={<Suspense fallback={<PageLoader />}><AdminDashboardPage /></Suspense>} />
        <Route path="risk-monitoring" element={<Suspense fallback={<PageLoader />}><RiskMonitoringPage /></Suspense>} />
        <Route path="live-sensors" element={<Suspense fallback={<PageLoader />}><LiveSensorsPage /></Suspense>} />
        <Route path="locations" element={<Suspense fallback={<PageLoader />}><AdminLocationsPage /></Suspense>} />
        <Route path="alerts" element={<Suspense fallback={<PageLoader />}><AdminAlertsPage /></Suspense>} />
        <Route path="predictions" element={<Suspense fallback={<PageLoader />}><AdminPredictionsPage /></Suspense>} />
        <Route path="users" element={<Suspense fallback={<PageLoader />}><ProtectedRoute requireAdmin><UsersPage /></ProtectedRoute></Suspense>} />
        <Route path="data-sources" element={<Suspense fallback={<PageLoader />}><ProtectedRoute requireAdmin><DataSourcesPage /></ProtectedRoute></Suspense>} />
        <Route path="models" element={<Suspense fallback={<PageLoader />}><ProtectedRoute requireAdmin><MLModelsPage /></ProtectedRoute></Suspense>} />
        <Route path="reports" element={<Suspense fallback={<PageLoader />}><AdminReportsPage /></Suspense>} />
        <Route path="audit-logs" element={<Suspense fallback={<PageLoader />}><ProtectedRoute requireAdmin><AuditLogsPage /></ProtectedRoute></Suspense>} />
        <Route path="settings" element={<Suspense fallback={<PageLoader />}><AdminSettingsPage /></Suspense>} />
      </Route>

      {/* Catch all */}
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}
