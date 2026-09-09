import { User, Mail, Phone, MapPin, Calendar, Shield } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { formatDateTime } from '@/lib/utils';

export function ProfilePage() {
  const { user } = useAuth();
  if (!user) return null;
  return (
    <div className="p-4 md:p-6 max-w-2xl">
      <Card>
        <div className="flex items-center gap-4 mb-6">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-blue-700 text-xl font-bold text-white">
            {user.avatarInitials ?? 'U'}
          </div>
          <div>
            <h2 className="text-lg font-bold text-slate-900">{user.fullName}</h2>
            <span className="inline-flex items-center rounded-full bg-blue-100 px-2 py-0.5 text-xs font-semibold text-blue-700 uppercase">{user.role}</span>
          </div>
        </div>
        <div className="space-y-4">
          {[
            { icon: <Mail className="h-4 w-4" />, label: 'Email', value: user.email },
            { icon: <Phone className="h-4 w-4" />, label: 'Phone', value: user.phone ?? 'Not set' },
            { icon: <MapPin className="h-4 w-4" />, label: 'Preferred Region', value: user.preferredRegion ?? 'Not set' },
            { icon: <Calendar className="h-4 w-4" />, label: 'Account Created', value: formatDateTime(user.createdAt) },
            { icon: <Shield className="h-4 w-4" />, label: 'Account Status', value: user.isActive ? 'Active' : 'Inactive' },
          ].map(item => (
            <div key={item.label} className="flex items-center gap-3 border-b border-slate-50 pb-3 last:border-0">
              <span className="text-slate-400">{item.icon}</span>
              <span className="text-sm text-slate-500 w-32">{item.label}</span>
              <span className="text-sm font-medium text-slate-800">{item.value}</span>
            </div>
          ))}
        </div>
        <div className="mt-6 rounded-md bg-amber-50 border border-amber-200 px-4 py-3">
          <p className="text-xs text-amber-800">Profile editing will be available in Phase 2 with Supabase authentication integration.</p>
        </div>
      </Card>
    </div>
  );
}
