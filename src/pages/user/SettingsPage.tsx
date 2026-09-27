import { Bell, Map, Shield, Info, Monitor, Sun, Moon } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { useDemoMode } from '@/contexts/DemoContext';
import { useTheme } from '@/contexts/ThemeContext';
import { ThemeToggle } from '@/components/ui/ThemeToggle';

export function SettingsPage() {
  const { currentScenario, setScenario } = useDemoMode();
  const { theme, setTheme } = useTheme();

  return (
    <div className="p-4 md:p-6 max-w-2xl space-y-4">
      {/* Appearance & Theme Card */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            {theme === 'dark' ? <Moon className="h-4 w-4 text-sky-400" /> : <Sun className="h-4 w-4 text-amber-500" />}
            Interface Theme & Appearance
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-slate-500 dark:text-slate-400 mb-4">
            Customize the platform visual mode. Himalayan twilight dark mode provides high-contrast nighttime monitoring, while alpine mist provides crisp daylight readability.
          </p>

          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => setTheme('dark')}
              className={`flex items-center gap-3 p-3.5 rounded-xl border text-left transition-all ${
                theme === 'dark'
                  ? 'border-sky-500 bg-sky-500/10 text-white shadow-[0_0_12px_rgba(56,189,248,0.2)]'
                  : 'border-slate-300 dark:border-slate-800 hover:border-slate-400 text-slate-600 dark:text-slate-400'
              }`}
            >
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-900 text-sky-400 border border-sky-500/20">
                <Moon className="h-4 w-4" />
              </div>
              <div>
                <p className="text-xs font-semibold">Dark Mode</p>
                <p className="text-[10px] text-slate-400">Himalayan Twilight</p>
              </div>
            </button>

            <button
              type="button"
              onClick={() => setTheme('light')}
              className={`flex items-center gap-3 p-3.5 rounded-xl border text-left transition-all ${
                theme === 'light'
                  ? 'border-sky-600 bg-sky-50 text-slate-900 shadow-sm'
                  : 'border-slate-300 dark:border-slate-800 hover:border-slate-400 text-slate-600 dark:text-slate-400'
              }`}
            >
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-amber-100 text-amber-600 border border-amber-300">
                <Sun className="h-4 w-4" />
              </div>
              <div>
                <p className="text-xs font-semibold">Light Mode</p>
                <p className="text-[10px] text-slate-400">Alpine Mist</p>
              </div>
            </button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader><CardTitle className="flex items-center gap-2"><Monitor className="h-4 w-4" /> Demo Mode</CardTitle></CardHeader>
        <CardContent>
          <p className="text-sm text-slate-500 dark:text-slate-400 mb-3">Control the demo scenario to see how the platform responds to different risk conditions.</p>
          <div className="flex flex-wrap gap-2">
            {(['NORMAL', 'HEAVY_RAIN', 'RISING_RISK', 'CRITICAL'] as const).map(id => (
              <button key={id} onClick={() => setScenario(id)}
                className={`rounded-md px-4 py-2 text-sm font-medium border transition-colors ${
                  currentScenario.id === id ? 'bg-sky-600 text-white border-sky-600' : 'bg-transparent text-slate-400 border-slate-300 dark:border-slate-700 hover:bg-slate-500/10'
                }`}>{id.replace('_', ' ')}
              </button>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader><CardTitle className="flex items-center gap-2"><Bell className="h-4 w-4" /> Notification Preferences</CardTitle></CardHeader>
        <CardContent>
          <p className="text-sm text-slate-500">Notification configuration will be available in Phase 2 with backend integration.</p>
          <div className="mt-3 space-y-2 opacity-50">
            {['Critical alerts', 'High risk alerts', 'Sensor offline', 'Risk trend changes'].map(item => (
              <div key={item} className="flex items-center justify-between">
                <span className="text-sm text-slate-400">{item}</span>
                <span className="text-xs text-slate-500">Planned</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader><CardTitle className="flex items-center gap-2"><Info className="h-4 w-4" /> About</CardTitle></CardHeader>
        <CardContent className="space-y-1 text-sm text-slate-400">
          <p><strong>AARAKSH</strong> — Flash Flood Intelligence Platform</p>
          <p>Version: v0.1.0-prototype</p>
          <p>Team: NeuroNauts</p>
          <p>SIH 2026 • Problem SIH26192</p>
          <p className="text-xs text-slate-500 mt-2">This is a prototype. Not for operational use.</p>
        </CardContent>
      </Card>
    </div>
  );
}
