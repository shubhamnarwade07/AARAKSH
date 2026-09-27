import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Eye, EyeOff, Mail, Lock, ArrowLeft } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useTheme } from '@/contexts/ThemeContext';
import { ThemeToggle } from '@/components/ui/ThemeToggle';
import { ROUTES, DEMO_ACCOUNTS } from '@/lib/constants';

export function LoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const from = (location.state as { from?: { pathname: string } })?.from?.pathname ?? ROUTES.APP_DASHBOARD;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);
    const result = await login({ email, password, rememberMe });
    setIsLoading(false);
    if (result.success) {
      const isAdmin = email === DEMO_ACCOUNTS.ADMIN.email || email === DEMO_ACCOUNTS.AUTHORITY.email;
      navigate(isAdmin ? ROUTES.ADMIN_DASHBOARD : (from === '/' ? ROUTES.APP_DASHBOARD : from), { replace: true });
    } else {
      setError(result.error ?? 'Login failed.');
    }
  };

  const fillDemo = (type: 'USER' | 'AUTHORITY' | 'ADMIN') => {
    const acc = DEMO_ACCOUNTS[type];
    setEmail(acc.email);
    setPassword(acc.password);
    setError('');
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

      {/* Main Login Card */}
      <div className="w-full max-w-md mx-auto my-auto z-10 animate-fade-in py-8">
        {/* Brand */}
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <div
              className="flex h-12 w-12 items-center justify-center rounded-xl shadow-lg font-bold text-white text-lg tracking-wider"
              style={{
                background: 'linear-gradient(135deg, #0284c7 0%, #0369a1 100%)',
                boxShadow: '0 4px 16px rgba(2, 132, 199, 0.4)',
              }}
            >
              A
            </div>
          </div>
          <h1
            className="text-2xl font-bold uppercase tracking-[0.2em]"
            style={{ color: isDark ? '#f8fafc' : '#0f172a' }}
          >
            AARAKSH
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Flash Flood Intelligence & Early Warning
          </p>
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
            className="text-lg font-semibold mb-6"
            style={{ color: isDark ? '#f8fafc' : '#0f172a' }}
          >
            Sign In to Platform
          </h2>

          {error && (
            <div className="mb-4 rounded-lg bg-red-500/10 border border-red-500/30 px-4 py-3 text-xs text-red-500">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label
                htmlFor="email"
                className="block text-xs font-medium uppercase tracking-wider mb-1.5"
                style={{ color: isDark ? '#cbd5e1' : '#334155' }}
              >
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  autoComplete="email"
                  placeholder="name@organization.gov.in"
                  className="w-full rounded-lg pl-10 pr-4 py-2.5 text-sm transition-all focus:outline-none focus:ring-2 focus:ring-sky-500"
                  style={{
                    background: isDark ? 'rgba(9, 17, 28, 0.8)' : '#f8fafc',
                    border: isDark ? '1px solid rgba(56, 189, 248, 0.2)' : '1px solid #cbd5e1',
                    color: isDark ? '#ffffff' : '#0f172a',
                  }}
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="password"
                className="block text-xs font-medium uppercase tracking-wider mb-1.5"
                style={{ color: isDark ? '#cbd5e1' : '#334155' }}
              >
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  autoComplete="current-password"
                  placeholder="••••••••"
                  className="w-full rounded-lg pl-10 pr-10 py-2.5 text-sm transition-all focus:outline-none focus:ring-2 focus:ring-sky-500"
                  style={{
                    background: isDark ? 'rgba(9, 17, 28, 0.8)' : '#f8fafc',
                    border: isDark ? '1px solid rgba(56, 189, 248, 0.2)' : '1px solid #cbd5e1',
                    color: isDark ? '#ffffff' : '#0f172a',
                  }}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((o) => !o)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-200"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between text-xs pt-1">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="rounded text-sky-600 focus:ring-sky-500"
                />
                <span style={{ color: isDark ? '#94a3b8' : '#64748b' }}>Remember me</span>
              </label>
              <button
                type="button"
                className="text-sky-500 hover:underline font-medium"
              >
                Forgot password?
              </button>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full rounded-lg px-4 py-3 text-xs sm:text-sm font-bold uppercase tracking-[0.14em] text-white transition-all shadow-md hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 mt-2"
              style={{
                background: '#0284c7',
                boxShadow: '0 4px 18px rgba(2, 132, 199, 0.35)',
              }}
            >
              {isLoading ? 'Authenticating...' : 'Sign In'}
            </button>
          </form>

          {/* Quick Demo Logins */}
          <div
            className="mt-6 pt-5"
            style={{ borderTop: isDark ? '1px solid rgba(255, 255, 255, 0.08)' : '1px solid #e2e8f0' }}
          >
            <p className="text-[11px] text-slate-400 mb-2.5 font-medium uppercase tracking-wider">
              Quick Demo Accounts
            </p>
            <div className="grid grid-cols-3 gap-2">
              {(['USER', 'AUTHORITY', 'ADMIN'] as const).map((role) => (
                <button
                  key={role}
                  type="button"
                  onClick={() => fillDemo(role)}
                  className="rounded-lg p-2 text-xs font-semibold tracking-wide transition-all"
                  style={{
                    background: isDark ? 'rgba(56, 189, 248, 0.08)' : '#f1f5f9',
                    border: isDark ? '1px solid rgba(56, 189, 248, 0.2)' : '1px solid #cbd5e1',
                    color: isDark ? '#38bdf8' : '#0284c7',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = '#0284c7';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = isDark ? 'rgba(56, 189, 248, 0.2)' : '#cbd5e1';
                  }}
                >
                  {role}
                </button>
              ))}
            </div>
          </div>

          <p className="mt-6 text-center text-xs text-slate-400">
            Need emergency access?{' '}
            <Link to={ROUTES.REGISTER} className="text-sky-400 font-semibold hover:underline">
              Create Account
            </Link>
          </p>
        </div>

        <p className="text-center text-[11px] text-slate-500 mt-6 tracking-wider">
          SIH 2026 · Problem SIH26192 · NDRF / MHA
        </p>
      </div>

      <div className="text-center text-xs text-slate-500 z-10">
        © 2026 AARAKSH · Himalayan Disaster Intelligence
      </div>
    </div>
  );
}
