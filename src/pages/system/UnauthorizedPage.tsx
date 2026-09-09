import { Link } from 'react-router-dom';
import { Lock, ArrowLeft } from 'lucide-react';
import { ROUTES } from '@/lib/constants';

export function UnauthorizedPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 px-4">
      <div className="text-center max-w-md">
        <div className="flex justify-center mb-6">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-red-100">
            <Lock className="h-8 w-8 text-red-500" />
          </div>
        </div>
        <h1 className="text-2xl font-bold text-slate-800 mb-2">Access Restricted</h1>
        <p className="text-slate-500 mb-2">Your account does not have permission to access this section.</p>
        <p className="text-xs text-slate-400 mb-8">Contact your administrator if you believe this is an error.</p>
        <Link
          to={ROUTES.APP_DASHBOARD}
          className="inline-flex items-center gap-2 rounded-md bg-blue-700 px-4 py-2 text-sm font-medium text-white hover:bg-blue-800 transition-colors"
        >
          <ArrowLeft className="h-4 w-4" /> Return to Dashboard
        </Link>
      </div>
    </div>
  );
}
