import { useQuery } from '@tanstack/react-query';
import { adminService } from '@/services/adminService';
import { DemoModeBanner } from '@/components/ui/DemoModeBanner';
import { Card } from '@/components/ui/Card';
import { Skeleton } from '@/components/ui/Skeleton';
import { formatDateTime } from '@/lib/utils';
import { UserRole } from '@/types';

const ROLE_COLORS: Record<UserRole, string> = {
  USER: 'text-slate-600',
  AUTHORITY: 'text-blue-600',
  ADMIN: 'text-violet-600',
};

export function AuditLogsPage() {
  const { data: logs, isLoading } = useQuery({ queryKey: ['admin', 'auditLogs'], queryFn: () => adminService.getAuditLogs() });
  return (
    <div className="p-4 md:p-6 space-y-4">
      <DemoModeBanner />
      <Card padding="none">
        <div className="px-4 pt-4 pb-3">
          <h3 className="text-sm font-semibold text-slate-800">Audit Logs</h3>
          <p className="text-xs text-slate-400 mt-0.5">Demo audit trail — will connect to backend logging in Phase 2</p>
        </div>
        {isLoading ? (
          <div className="px-4 pb-4 space-y-2">{Array.from({ length: 6 }).map((_, i) => <Skeleton key={i} className="h-12" />)}</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-100 bg-slate-50">
                  <th className="px-4 py-2.5 text-left text-xs font-semibold text-slate-500">Timestamp</th>
                  <th className="px-4 py-2.5 text-left text-xs font-semibold text-slate-500">User</th>
                  <th className="px-4 py-2.5 text-left text-xs font-semibold text-slate-500">Role</th>
                  <th className="px-4 py-2.5 text-left text-xs font-semibold text-slate-500">Action</th>
                  <th className="px-4 py-2.5 text-left text-xs font-semibold text-slate-500">Resource</th>
                  <th className="px-4 py-2.5 text-left text-xs font-semibold text-slate-500">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {(logs ?? []).map(log => (
                  <tr key={log.id} className="hover:bg-slate-50">
                    <td className="px-4 py-3 text-xs text-slate-500">{formatDateTime(log.timestamp)}</td>
                    <td className="px-4 py-3">
                      <p className="text-xs font-medium text-slate-800">{log.userName}</p>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`text-xs font-medium ${ROLE_COLORS[log.userRole]}`}>{log.userRole}</span>
                    </td>
                    <td className="px-4 py-3">
                      <span className="rounded-full bg-slate-100 px-2 py-0.5 text-xs text-slate-700 font-mono">{log.action}</span>
                    </td>
                    <td className="px-4 py-3 text-xs text-slate-600">{log.resource}{log.resourceId ? ` (${log.resourceId})` : ''}</td>
                    <td className="px-4 py-3">
                      <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${log.status === 'SUCCESS' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>{log.status}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>
    </div>
  );
}
