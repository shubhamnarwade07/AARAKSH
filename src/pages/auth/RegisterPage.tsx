import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Shield, Eye, EyeOff } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { ROUTES } from '@/lib/constants';

const REGIONS = ['Uttarakhand', 'Himachal Pradesh', 'Sikkim', 'Jammu & Kashmir', 'Arunachal Pradesh', 'Meghalaya', 'Manipur', 'Other'];

export function RegisterPage() {
  const navigate = useNavigate();
  const { register } = useAuth();
  const [form, setForm] = useState({ fullName: '', email: '', password: '', confirmPassword: '', phone: '', preferredRegion: '', preferredLocation: '' });
  const [showPwd, setShowPwd] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const set = (field: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
    setForm(f => ({ ...f, [field]: e.target.value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (form.password !== form.confirmPassword) { setError('Passwords do not match.'); return; }
    setIsLoading(true);
    const result = await register(form);
    setIsLoading(false);
    if (result.success) navigate(ROUTES.APP_DASHBOARD, { replace: true });
    else setError(result.error ?? 'Registration failed.');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900 flex items-center justify-center p-4">
      <div className="w-full max-w-lg animate-fade-in">
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-blue-600 shadow-lg">
              <Shield className="h-7 w-7 text-white" />
            </div>
          </div>
          <h1 className="text-2xl font-bold text-white">AARAKSH</h1>
          <p className="text-slate-400 text-sm mt-1">Create your account</p>
        </div>

        <div className="rounded-xl bg-white border border-slate-200 shadow-xl p-8">
          <h2 className="text-lg font-semibold text-slate-800 mb-2">Create Account</h2>
          <p className="text-xs text-slate-500 mb-6">Registration creates a standard user account. Authority and Admin access is provisioned separately.</p>

          {error && <div className="mb-4 rounded-md bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700">{error}</div>}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="sm:col-span-2">
                <label htmlFor="fullName" className="block text-sm font-medium text-slate-700 mb-1">Full Name <span className="text-red-500">*</span></label>
                <input id="fullName" type="text" value={form.fullName} onChange={set('fullName')} required placeholder="Your full name"
                  className="w-full rounded-md border border-slate-300 px-3 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100" />
              </div>
              <div className="sm:col-span-2">
                <label htmlFor="reg-email" className="block text-sm font-medium text-slate-700 mb-1">Email <span className="text-red-500">*</span></label>
                <input id="reg-email" type="email" value={form.email} onChange={set('email')} required placeholder="your@email.com"
                  className="w-full rounded-md border border-slate-300 px-3 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100" />
              </div>
              <div>
                <label htmlFor="reg-password" className="block text-sm font-medium text-slate-700 mb-1">Password <span className="text-red-500">*</span></label>
                <div className="relative">
                  <input id="reg-password" type={showPwd ? 'text' : 'password'} value={form.password} onChange={set('password')} required placeholder="Min. 8 characters"
                    className="w-full rounded-md border border-slate-300 px-3 pr-10 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100" />
                  <button type="button" onClick={() => setShowPwd(o => !o)} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400" aria-label="Toggle password">
                    {showPwd ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>
              <div>
                <label htmlFor="confirmPassword" className="block text-sm font-medium text-slate-700 mb-1">Confirm Password <span className="text-red-500">*</span></label>
                <input id="confirmPassword" type="password" value={form.confirmPassword} onChange={set('confirmPassword')} required placeholder="Repeat password"
                  className="w-full rounded-md border border-slate-300 px-3 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100" />
              </div>
              <div>
                <label htmlFor="phone" className="block text-sm font-medium text-slate-700 mb-1">Phone</label>
                <input id="phone" type="tel" value={form.phone} onChange={set('phone')} placeholder="+91 XXXXX XXXXX"
                  className="w-full rounded-md border border-slate-300 px-3 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100" />
              </div>
              <div>
                <label htmlFor="preferredRegion" className="block text-sm font-medium text-slate-700 mb-1">Preferred Region</label>
                <select id="preferredRegion" value={form.preferredRegion} onChange={set('preferredRegion')}
                  className="w-full rounded-md border border-slate-300 px-3 py-2.5 text-sm text-slate-900 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100">
                  <option value="">Select region</option>
                  {REGIONS.map(r => <option key={r} value={r}>{r}</option>)}
                </select>
              </div>
            </div>

            <button type="submit" disabled={isLoading}
              className="w-full rounded-md bg-blue-700 px-4 py-2.5 text-sm font-semibold text-white hover:bg-blue-800 disabled:opacity-50 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2">
              {isLoading ? 'Creating account...' : 'Create Account'}
            </button>
          </form>

          <p className="mt-5 text-center text-sm text-slate-500">
            Already have an account?{' '}
            <Link to={ROUTES.LOGIN} className="text-blue-700 font-medium hover:underline">Sign In</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
