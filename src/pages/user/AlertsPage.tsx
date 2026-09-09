import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Bell, CheckCircle, Eye, Clock, MapPin, Shield, Filter, ArrowRight } from 'lucide-react';
import { useAlerts, useAcknowledgeAlert, useResolveAlert } from '@/hooks/useAlerts';
import { useAuth } from '@/contexts/AuthContext';
import { useDemoMode } from '@/contexts/DemoContext';
import { RiskBadge } from '@/components/ui/RiskBadge';
import { formatRelativeTime, getRiskColor } from '@/lib/utils';
import { AlertSeverity, AlertStatus } from '@/types';
import { ROUTES } from '@/lib/constants';

const SEV_COLOR: Record<AlertSeverity, string> = {
  CRITICAL: '#ef4444', HIGH: '#f97316', MODERATE: '#eab308', INFORMATIONAL: '#06b6d4',
};

const STATUS_CFG: Record<AlertStatus, { bg: string; text: string; label: string }> = {
  ACTIVE:       { bg: 'rgba(239,68,68,0.15)',  text: '#ef4444',  label: 'Active' },
  ACKNOWLEDGED: { bg: 'rgba(234,179,8,0.12)',  text: '#eab308',  label: 'Acknowledged' },
  RESOLVED:     { bg: 'rgba(34,197,94,0.12)',  text: '#22c55e',  label: 'Resolved' },
};

export function AlertsPage() {
  const navigate = useNavigate();
  const { isAuthority } = useAuth();
  const { setSelectedLocationId } = useDemoMode();
  const [statusFilter, setStatusFilter] = useState<AlertStatus | 'ALL'>('ALL');
  const [severityFilter, setSeverityFilter] = useState<AlertSeverity | 'ALL'>('ALL');

  const { data: alerts, isLoading, error, refetch } = useAlerts();
  const ack = useAcknowledgeAlert();
  const resolve = useResolveAlert();

  const filtered = (alerts ?? []).filter(a => {
    if (statusFilter !== 'ALL' && a.status !== statusFilter) return false;
    if (severityFilter !== 'ALL' && a.severity !== severityFilter) return false;
    return true;
  });

  const activeCount = (alerts ?? []).filter(a => a.status === 'ACTIVE').length;

  function handleViewOnMap(locationId: string) {
    setSelectedLocationId(locationId);
    navigate(ROUTES.APP_RISK_MAP);
  }
  function handleViewPrediction(locationId: string) {
    setSelectedLocationId(locationId);
    navigate(ROUTES.APP_PREDICTIONS);
  }

  const CARD = { background: 'rgba(15,41,24,0.5)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: '12px', overflow: 'hidden' as const };

  return (
    <div className="p-4 md:p-6 space-y-4">
      {/* Demo banner */}
      <div className="flex items-center gap-2 rounded-lg px-3 py-2 text-xs" style={{ background: 'rgba(234,179,8,0.08)', border: '1px solid rgba(234,179,8,0.2)', color: '#ca8a04' }}>
        <span className="h-1.5 w-1.5 rounded-full bg-amber-500 flex-shrink-0" />
        <span className="font-semibold text-amber-600">PROTOTYPE / DEMO DATA</span>
      </div>

      {/* Header */}
      <div className="flex items-center gap-3">
        <Bell className="h-5 w-5 text-slate-500" />
        <h2 className="text-lg font-semibold text-white">Active Alerts</h2>
        {activeCount > 0 && (
          <span className="rounded-full px-2.5 py-0.5 text-xs font-bold" style={{ background: 'rgba(239,68,68,0.2)', color: '#ef4444', border: '1px solid rgba(239,68,68,0.3)' }}>
            {activeCount} Active
          </span>
        )}
      </div>

      {/* Filters */}
      <div className="rounded-xl px-4 py-3" style={{ background: 'rgba(15,41,24,0.4)', border: '1px solid rgba(255,255,255,0.06)' }}>
        <div className="flex flex-wrap items-center gap-3">
          <Filter className="h-4 w-4 text-slate-600 flex-shrink-0" />
          <div className="flex flex-wrap gap-1.5">
            <span className="text-[10px] text-slate-600 uppercase tracking-wider self-center mr-1">Status:</span>
            {(['ALL', 'ACTIVE', 'ACKNOWLEDGED', 'RESOLVED'] as const).map(s => (
              <button key={s} onClick={() => setStatusFilter(s)}
                className="rounded-full px-2.5 py-1 text-xs font-medium transition-all"
                style={{
                  background: statusFilter === s ? 'rgba(53,169,141,0.2)' : 'rgba(255,255,255,0.04)',
                  border: `1px solid ${statusFilter === s ? 'rgba(53,169,141,0.4)' : 'rgba(255,255,255,0.08)'}`,
                  color: statusFilter === s ? '#35a98d' : '#64748b',
                }}>
                {s === 'ALL' ? 'All' : s.charAt(0) + s.slice(1).toLowerCase()}
              </button>
            ))}
          </div>
          <div className="flex flex-wrap gap-1.5">
            <span className="text-[10px] text-slate-600 uppercase tracking-wider self-center mr-1">Severity:</span>
            {(['ALL', 'CRITICAL', 'HIGH', 'MODERATE', 'INFORMATIONAL'] as const).map(s => (
              <button key={s} onClick={() => setSeverityFilter(s)}
                className="rounded-full px-2.5 py-1 text-xs font-medium transition-all"
                style={{
                  background: severityFilter === s ? `${SEV_COLOR[s as AlertSeverity] ?? 'rgba(53,169,141,0.2)'}20` : 'rgba(255,255,255,0.04)',
                  border: `1px solid ${severityFilter === s ? `${SEV_COLOR[s as AlertSeverity] ?? '#35a98d'}40` : 'rgba(255,255,255,0.08)'}`,
                  color: severityFilter === s ? (SEV_COLOR[s as AlertSeverity] ?? '#35a98d') : '#64748b',
                }}>
                {s === 'ALL' ? 'All' : s.charAt(0) + s.slice(1).toLowerCase()}
              </button>
            ))}
          </div>
          <span className="ml-auto text-xs text-slate-600">{filtered.length} alert{filtered.length !== 1 ? 's' : ''}</span>
        </div>
      </div>

      {/* Alert list */}
      {isLoading ? (
        <div className="space-y-3">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="h-40 skeleton rounded-xl" />
          ))}
        </div>
      ) : error ? (
        <div className="rounded-xl p-8 text-center" style={CARD}>
          <p className="text-slate-500 mb-3">Failed to load alerts</p>
          <button onClick={() => refetch()} className="text-sm text-emerald-400">Retry</button>
        </div>
      ) : filtered.length === 0 ? (
        <div className="rounded-xl p-12 text-center" style={CARD}>
          <Bell className="h-8 w-8 mx-auto mb-3 text-slate-700" />
          <p className="text-sm text-slate-500">No alerts match your filters.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map(alert => {
            const sevColor = SEV_COLOR[alert.severity];
            const statusCfg = STATUS_CFG[alert.status];
            return (
              <div
                key={alert.id}
                className="rounded-xl overflow-hidden"
                style={{
                  background: 'rgba(15,41,24,0.45)',
                  border: '1px solid rgba(255,255,255,0.06)',
                  borderLeft: `3px solid ${sevColor}`,
                }}
              >
                <div className="p-4">
                  {/* Top row */}
                  <div className="flex flex-wrap items-center gap-2 mb-2">
                    <span className="h-2.5 w-2.5 rounded-full flex-shrink-0" style={{ background: sevColor }} />
                    <span className="font-semibold text-white text-sm">{alert.title}</span>
                    <span
                      className="rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase"
                      style={{ background: statusCfg.bg, color: statusCfg.text }}
                    >{statusCfg.label}</span>
                    <RiskBadge level={alert.riskLevel} size="sm" />
                    <span
                      className="rounded-full px-2 py-0.5 text-[10px] font-bold uppercase ml-auto"
                      style={{ background: `${sevColor}18`, color: sevColor, border: `1px solid ${sevColor}35` }}
                    >{alert.severity}</span>
                  </div>

                  {/* Description */}
                  <p className="text-xs text-slate-400 mb-3">{alert.description}</p>

                  {/* Meta */}
                  <div className="flex flex-wrap items-center gap-4 text-xs text-slate-600 mb-3">
                    <span className="flex items-center gap-1.5"><Clock className="h-3 w-3" />{formatRelativeTime(alert.createdAt)}</span>
                    <span className="flex items-center gap-1.5"><MapPin className="h-3 w-3" />{alert.locationName} — {alert.district}, {alert.state}</span>
                  </div>

                  {/* Trigger factors */}
                  {alert.triggerFactors.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 mb-3">
                      {alert.triggerFactors.map((f, i) => (
                        <span key={i} className="rounded-full px-2 py-0.5 text-[10px] text-slate-400"
                          style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.07)' }}>
                          {f}
                        </span>
                      ))}
                    </div>
                  )}

                  {/* Recommended action */}
                  <div className="rounded-lg px-3 py-2.5 mb-3" style={{ background: 'rgba(6,182,212,0.08)', border: '1px solid rgba(6,182,212,0.18)' }}>
                    <p className="text-xs text-slate-300"><strong className="text-cyan-400">Recommended:</strong> {alert.recommendedAction}</p>
                  </div>

                  {/* Action buttons */}
                  <div className="flex flex-wrap gap-2">
                    <button
                      onClick={() => handleViewOnMap(alert.locationId)}
                      className="flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium text-slate-300 hover:text-white transition-colors"
                      style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}
                    >
                      <MapPin className="h-3.5 w-3.5" /> View on Map
                    </button>
                    <button
                      onClick={() => handleViewPrediction(alert.locationId)}
                      className="flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium text-slate-300 hover:text-white transition-colors"
                      style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}
                    >
                      View Prediction
                    </button>
                    <button
                      onClick={() => navigate(ROUTES.APP_SAFETY_CENTRE)}
                      className="flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold text-white transition-all hover:brightness-110"
                      style={{ background: 'rgba(53,169,141,0.2)', border: '1px solid rgba(53,169,141,0.3)', color: '#35a98d' }}
                    >
                      <Shield className="h-3.5 w-3.5" /> Safety Centre
                    </button>

                    {/* State actions */}
                    {alert.status === 'ACTIVE' && (
                      <>
                        <button
                          onClick={() => ack.mutate(alert.id)}
                          disabled={ack.isPending}
                          className="flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium disabled:opacity-50 transition-colors ml-auto"
                          style={{ background: 'rgba(234,179,8,0.1)', border: '1px solid rgba(234,179,8,0.25)', color: '#eab308' }}
                        >
                          <CheckCircle className="h-3.5 w-3.5" /> Acknowledge
                        </button>
                        {isAuthority && (
                          <button
                            onClick={() => resolve.mutate(alert.id)}
                            disabled={resolve.isPending}
                            className="flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium disabled:opacity-50 transition-colors"
                            style={{ background: 'rgba(34,197,94,0.1)', border: '1px solid rgba(34,197,94,0.25)', color: '#22c55e' }}
                          >
                            <Eye className="h-3.5 w-3.5" /> Resolve
                          </button>
                        )}
                      </>
                    )}
                    {alert.status === 'ACKNOWLEDGED' && isAuthority && (
                      <button
                        onClick={() => resolve.mutate(alert.id)}
                        disabled={resolve.isPending}
                        className="flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium disabled:opacity-50 ml-auto transition-colors"
                        style={{ background: 'rgba(34,197,94,0.1)', border: '1px solid rgba(34,197,94,0.25)', color: '#22c55e' }}
                      >
                        <Eye className="h-3.5 w-3.5" /> Resolve
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
