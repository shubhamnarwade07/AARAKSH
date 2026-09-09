import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { adminService } from '@/services/adminService';
import { DemoModeBanner } from '@/components/ui/DemoModeBanner';
import { Card } from '@/components/ui/Card';
import { Skeleton } from '@/components/ui/Skeleton';
import { formatRelativeTime } from '@/lib/utils';
import { UserRole } from '@/types';
import { UserCheck, UserX, Shield } from 'lucide-react';

const ROLE_COLORS: Record<UserRole, string> = {
  USER: 'bg-slate-100 text-slate-700',
  AUTHORITY: 'bg-blue-100 text-blue-700',
  ADMIN: 'bg-violet-100 text-violet-700',
};

export function UsersPage() {
  const queryClient = useQueryClient();
  const { data: users, isLoading } = useQuery({ queryKey: ['admin', 'users'], queryFn: () => adminService.getUsers() });
  const deactivate = useMutation({
    mutationFn: (id: string) => adminService.deactivateUser(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['admin', 'users'] }),
  });

  return (
    <div className="p-4 md:p-6 space-y-4">
      <DemoModeBanner />
      <Card padding="none">
        <div className="px-4 pt-4 pb-3 flex items-center justify-between">
          <h3 className="text-sm font-semibold text-slate-800">User Management</h3>
          <span className="text-xs text-slate-500">{users?.length ?? 0} users</span>
        </div>
        {isLoading ? (
          <div className="px-4 pb-4 space-y-2">{Array.from({ length: 5 }).map((_, i) => <Skeleton key={i} className="h-14" />)}</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-100 bg-slate-50">
                  <th className="px-4 py-2.5 text-left text-xs font-semibold text-slate-500">User</th>
                  <th className="px-4 py-2.5 text-left text-xs font-semibold text-slate-500">Role</th>
                  <th className="px-4 py-2.5 text-left text-xs font-semibold text-slate-500">Status</th>
                  <th className="px-4 py-2.5 text-left text-xs font-semibold text-slate-500">Region</th>
                  <th className="px-4 py-2.5 text-left text-xs font-semibold text-slate-500">Last Active</th>
                  <th className="px-4 py-2.5 text-left text-xs font-semibold text-slate-500">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {(users ?? []).map(user => (
                  <tr key={user.id} className="hover:bg-slate-50">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <div className="flex h-7 w-7 items-center justify-center rounded-full bg-blue-700 text-xs font-bold text-white">{user.avatarInitials}</div>
                        <div>
                          <p className="font-medium text-slate-800">{user.fullName}</p>
                          <p className="text-xs text-slate-400">{user.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3"><span className={`rounded-full px-2 py-0.5 text-xs font-medium ${ROLE_COLORS[user.role]}`}>{user.role}</span></td>
                    <td className="px-4 py-3"><span className={`rounded-full px-2 py-0.5 text-xs font-medium ${user.isActive ? 'bg-green-100 text-green-700' : 'bg-slate-100 text-slate-500'}`}>{user.isActive ? 'Active' : 'Inactive'}</span></td>
                    <td className="px-4 py-3 text-xs text-slate-600">{user.preferredRegion ?? '—'}</td>
                    <td className="px-4 py-3 text-xs text-slate-400">{formatRelativeTime(user.lastActive)}</td>
                    <td className="px-4 py-3">
                      <div className="flex gap-2">
                        <button className="text-slate-400 hover:text-blue-600" title="View" aria-label="View user"><Shield className="h-4 w-4" /></button>
                        {user.isActive && user.role !== 'ADMIN' && (
                          <button
                            onClick={() => deactivate.mutate(user.id)}
                            disabled={deactivate.isPending}
                            className="text-slate-400 hover:text-red-600 disabled:opacity-50"
                            title="Deactivate"
                            aria-label="Deactivate user"
                          >
                            <UserX className="h-4 w-4" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>
      <p className="text-xs text-slate-400">Role changes are provisioned by system administrators. Frontend role checks are UX-only — backend enforcement required for production.</p>
    </div>
  );
}
