import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Shield, Eye, EyeOff, Mail, Lock } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { ROUTES, DEMO_ACCOUNTS } from '@/lib/constants';

export function LoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();
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
      // Route based on role
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
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900 flex items-center justify-center p-4">
      <div className="w-full max-w-md animate-fade-in">
        {/* Brand */}
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-blue-600 shadow-lg">
              <Shield className="h-7 w-7 text-white" />
            </div>
          </div>
          <h1 className="text-2xl font-bold text-white">AARAKSH</h1>
          <p className="text-slate-400 text-sm mt-1">Flash Flood Intelligence Platform</p>
        </div>

        {/* Card */}
        <div className="rounded-xl bg-white border border-slate-200 shadow-xl p-8">
          <h2 className="text-lg font-semibold text-slate-800 mb-6">Sign In</h2>

          {error && (
            <div className="mb-4 rounded-md bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700">{error}</div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-slate-700 mb-1">Email</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  required
                  autoComplete="email"
                  placeholder="Enter your email"
                  className="w-full rounded-md border border-slate-300 pl-10 pr-4 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100"
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-slate-700 mb-1">Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  required
                  autoComplete="current-password"
                  placeholder="Enter your password"
                  className="w-full rounded-md border border-slate-300 pl-10 pr-10 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(o => !o)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={e => setRememberMe(e.target.checked)}
                  className="rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                />
                <span className="text-sm text-slate-600">Remember me</span>
              </label>
              <button type="button" className="text-sm text-blue-700 hover:underline">Forgot password?</button>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full rounded-md bg-blue-700 px-4 py-2.5 text-sm font-semibold text-white hover:bg-blue-800 disabled:opacity-50 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              {isLoading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>

          <div className="mt-6 border-t border-slate-100 pt-5">
            <p className="text-xs text-slate-500 mb-3 font-medium">Demo Credentials</p>
            <div className="grid grid-cols-3 gap-2">
              {(['USER', 'AUTHORITY', 'ADMIN'] as const).map(role => (
                <button
                  key={role}
                  type="button"
                  onClick={() => fillDemo(role)}
                  className="rounded-md border border-slate-200 px-2 py-2 text-xs font-medium text-slate-600 hover:bg-slate-50 hover:border-blue-300 transition-colors"
                >
                  {role}
                </button>
              ))}
            </div>
          </div>

          <p className="mt-5 text-center text-sm text-slate-500">
            No account?{' '}
            <Link to={ROUTES.REGISTER} className="text-blue-700 font-medium hover:underline">Create Account</Link>
          </p>
        </div>

        <p className="text-center text-xs text-slate-500 mt-6">
          SIH 2026 • NeuroNauts • Prototype v0.1.0
        </p>
      </div>
    </div>
  );
}
