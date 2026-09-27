import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff, ArrowLeft } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useTheme } from '@/contexts/ThemeContext';
import { ThemeToggle } from '@/components/ui/ThemeToggle';
import { ROUTES } from '@/lib/constants';

import { AarakshLogo } from '@/components/ui/AarakshLogo';

const REGIONS = ['Uttarakhand', 'Himachal Pradesh', 'Sikkim', 'Jammu & Kashmir', 'Arunachal Pradesh', 'Meghalaya', 'Manipur', 'Other'];

export function RegisterPage() {
  const navigate = useNavigate();
  const { register } = useAuth();
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  const [form, setForm] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
    phone: '',
    preferredRegion: '',
    preferredLocation: '',
  });
  const [showPwd, setShowPwd] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const set = (field: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
    setForm((f) => ({ ...f, [field]: e.target.value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (form.password !== form.confirmPassword) {
      setError('Passwords do not match.');
      return;
    }
    setIsLoading(true);
    const result = await register(form);
    setIsLoading(false);
    if (result.success) navigate(ROUTES.APP_DASHBOARD, { replace: true });
    else setError(result.error ?? 'Registration failed.');
  };

  return (
    <div
      className="min-h-screen flex flex-col justify-between p-4 sm:p-6 transition-colors duration-300 relative overflow-hidden"
      style={{
        background: isDark
          ? 'radial-gradient(ellipse at 50% 30%, #0d1a29 0%, #070d15 100%)'
          : 'radial-gradient(ellipse at 50% 30%, #e2e8f0 0%, #f1f5f9 100%)',
      }}
    >
      {/* Top Header with Back to Landing & Theme Toggle */}
      <div className="flex items-center justify-between w-full max-w-5xl mx-auto z-10">
        <Link
          to={ROUTES.LANDING}
          className="inline-flex items-center gap-2 text-xs font-semibold tracking-wider uppercase transition-colors"
          style={{ color: isDark ? '#94a3b8' : '#475569' }}
        >
          <ArrowLeft className="h-4 w-4" /> Back to Home
        </Link>
        <ThemeToggle variant="icon" />
      </div>

      <div className="w-full max-w-lg mx-auto my-auto z-10 animate-fade-in py-8">
        {/* Brand */}
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <AarakshLogo size="xl" />
          </div>
          <h1
            className="text-2xl font-bold uppercase tracking-[0.2em]"
            style={{ color: isDark ? '#f8fafc' : '#0f172a' }}
          >
            AARAKSH
          </h1>
          <p className="text-xs text-slate-400 mt-1">Create your citizen or responder account</p>
        </div>

        {/* Card */}
        <div
          className="rounded-2xl shadow-2xl p-7 sm:p-8 backdrop-blur-xl transition-all"
          style={{
            background: isDark ? 'rgba(13, 24, 38, 0.85)' : '#ffffff',
            border: isDark ? '1px solid rgba(56, 189, 248, 0.2)' : '1px solid #cbd5e1',
          }}
        >
          <h2
            className="text-lg font-semibold mb-2"
            style={{ color: isDark ? '#f8fafc' : '#0f172a' }}
          >
            Create Account
          </h2>
          <p className="text-xs text-slate-400 mb-6">
            Citizen and emergency volunteer registration. Authority and Admin access is provisioned by MHA / NDRF.
          </p>

          {error && (
            <div className="mb-4 rounded-lg bg-red-500/10 border border-red-500/30 px-4 py-3 text-xs text-red-500">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="sm:col-span-2">
                <label
                  htmlFor="fullName"
                  className="block text-xs font-medium uppercase tracking-wider mb-1"
                  style={{ color: isDark ? '#cbd5e1' : '#334155' }}
                >
                  Full Name <span className="text-red-500">*</span>
                </label>
                <input
                  id="fullName"
                  type="text"
                  value={form.fullName}
                  onChange={set('fullName')}
                  required
                  placeholder="Shubham Sharma"
                  className="w-full rounded-lg px-3 py-2 text-sm transition-all focus:outline-none focus:ring-2 focus:ring-sky-500"
                  style={{
                    background: isDark ? 'rgba(9, 17, 28, 0.8)' : '#f8fafc',
                    border: isDark ? '1px solid rgba(56, 189, 248, 0.2)' : '1px solid #cbd5e1',
                    color: isDark ? '#ffffff' : '#0f172a',
                  }}
                />
              </div>

              <div className="sm:col-span-2">
                <label
                  htmlFor="reg-email"
                  className="block text-xs font-medium uppercase tracking-wider mb-1"
                  style={{ color: isDark ? '#cbd5e1' : '#334155' }}
                >
                  Email <span className="text-red-500">*</span>
                </label>
                <input
                  id="reg-email"
                  type="email"
                  value={form.email}
                  onChange={set('email')}
                  required
                  placeholder="your.email@example.com"
                  className="w-full rounded-lg px-3 py-2 text-sm transition-all focus:outline-none focus:ring-2 focus:ring-sky-500"
                  style={{
                    background: isDark ? 'rgba(9, 17, 28, 0.8)' : '#f8fafc',
                    border: isDark ? '1px solid rgba(56, 189, 248, 0.2)' : '1px solid #cbd5e1',
                    color: isDark ? '#ffffff' : '#0f172a',
                  }}
                />
              </div>

              <div>
                <label
                  htmlFor="reg-password"
                  className="block text-xs font-medium uppercase tracking-wider mb-1"
                  style={{ color: isDark ? '#cbd5e1' : '#334155' }}
                >
                  Password <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <input
                    id="reg-password"
                    type={showPwd ? 'text' : 'password'}
                    value={form.password}
                    onChange={set('password')}
                    required
                    placeholder="Min. 8 chars"
                    className="w-full rounded-lg px-3 pr-10 py-2 text-sm transition-all focus:outline-none focus:ring-2 focus:ring-sky-500"
                    style={{
                      background: isDark ? 'rgba(9, 17, 28, 0.8)' : '#f8fafc',
                      border: isDark ? '1px solid rgba(56, 189, 248, 0.2)' : '1px solid #cbd5e1',
                      color: isDark ? '#ffffff' : '#0f172a',
                    }}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPwd((o) => !o)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400"
                    aria-label="Toggle password"
                  >
                    {showPwd ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              <div>
                <label
                  htmlFor="confirmPassword"
                  className="block text-xs font-medium uppercase tracking-wider mb-1"
                  style={{ color: isDark ? '#cbd5e1' : '#334155' }}
                >
                  Confirm Password <span className="text-red-500">*</span>
                </label>
                <input
                  id="confirmPassword"
                  type="password"
                  value={form.confirmPassword}
                  onChange={set('confirmPassword')}
                  required
                  placeholder="Repeat password"
                  className="w-full rounded-lg px-3 py-2 text-sm transition-all focus:outline-none focus:ring-2 focus:ring-sky-500"
                  style={{
                    background: isDark ? 'rgba(9, 17, 28, 0.8)' : '#f8fafc',
                    border: isDark ? '1px solid rgba(56, 189, 248, 0.2)' : '1px solid #cbd5e1',
                    color: isDark ? '#ffffff' : '#0f172a',
                  }}
                />
              </div>

              <div>
                <label
                  htmlFor="phone"
                  className="block text-xs font-medium uppercase tracking-wider mb-1"
                  style={{ color: isDark ? '#cbd5e1' : '#334155' }}
                >
                  Phone (Optional)
                </label>
                <input
                  id="phone"
                  type="tel"
                  value={form.phone}
                  onChange={set('phone')}
                  placeholder="+91 98765 43210"
                  className="w-full rounded-lg px-3 py-2 text-sm transition-all focus:outline-none focus:ring-2 focus:ring-sky-500"
                  style={{
                    background: isDark ? 'rgba(9, 17, 28, 0.8)' : '#f8fafc',
                    border: isDark ? '1px solid rgba(56, 189, 248, 0.2)' : '1px solid #cbd5e1',
                    color: isDark ? '#ffffff' : '#0f172a',
                  }}
                />
              </div>

              <div>
                <label
                  htmlFor="preferredRegion"
                  className="block text-xs font-medium uppercase tracking-wider mb-1"
                  style={{ color: isDark ? '#cbd5e1' : '#334155' }}
                >
                  Region
                </label>
                <select
                  id="preferredRegion"
                  value={form.preferredRegion}
                  onChange={set('preferredRegion')}
                  className="w-full rounded-lg px-3 py-2 text-sm transition-all focus:outline-none focus:ring-2 focus:ring-sky-500"
                  style={{
                    background: isDark ? 'rgba(9, 17, 28, 0.8)' : '#f8fafc',
                    border: isDark ? '1px solid rgba(56, 189, 248, 0.2)' : '1px solid #cbd5e1',
                    color: isDark ? '#ffffff' : '#0f172a',
                  }}
                >
                  <option value="" style={{ background: isDark ? '#09111c' : '#ffffff' }}>Select region</option>
                  {REGIONS.map((r) => (
                    <option key={r} value={r} style={{ background: isDark ? '#09111c' : '#ffffff' }}>{r}</option>
                  ))}
                </select>
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full rounded-lg px-4 py-3 text-xs sm:text-sm font-bold uppercase tracking-[0.14em] text-white transition-all shadow-md hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 mt-4"
              style={{
                background: '#0284c7',
                boxShadow: '0 4px 18px rgba(2, 132, 199, 0.35)',
              }}
            >
              {isLoading ? 'Creating account...' : 'Create Account'}
            </button>
          </form>

          <p className="mt-6 text-center text-xs text-slate-400">
            Already have an account?{' '}
            <Link to={ROUTES.LOGIN} className="text-sky-400 font-semibold hover:underline">
              Sign In
            </Link>
          </p>
        </div>
      </div>

      <div className="text-center text-xs text-slate-500 z-10">
        © 2026 AARAKSH · Himalayan Disaster Intelligence
      </div>
    </div>
  );
}
