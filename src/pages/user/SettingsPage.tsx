import { Bell, Map, Shield, Info, Monitor } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { useDemoMode } from '@/contexts/DemoContext';

export function SettingsPage() {
  const { currentScenario, setScenario } = useDemoMode();
  return (
    <div className="p-4 md:p-6 max-w-2xl space-y-4">
      <Card>
        <CardHeader><CardTitle className="flex items-center gap-2"><Monitor className="h-4 w-4" /> Demo Mode</CardTitle></CardHeader>
        <CardContent>
          <p className="text-sm text-slate-600 mb-3">Control the demo scenario to see how the platform responds to different risk conditions.</p>
          <div className="flex flex-wrap gap-2">
            {(['NORMAL', 'HEAVY_RAIN', 'RISING_RISK', 'CRITICAL'] as const).map(id => (
              <button key={id} onClick={() => setScenario(id)}
                className={`rounded-md px-4 py-2 text-sm font-medium border transition-colors ${
                  currentScenario.id === id ? 'bg-blue-700 text-white border-blue-700' : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
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
                <span className="text-sm text-slate-700">{item}</span>
                <span className="text-xs text-slate-400">Planned</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader><CardTitle className="flex items-center gap-2"><Info className="h-4 w-4" /> About</CardTitle></CardHeader>
        <CardContent className="space-y-1 text-sm text-slate-600">
          <p><strong>AARAKSH</strong> — Flash Flood Intelligence Platform</p>
          <p>Version: v0.1.0-prototype</p>
          <p>Team: NeuroNauts</p>
          <p>SIH 2026 • Problem SIH26192</p>
          <p className="text-xs text-slate-400 mt-2">This is a prototype. Not for operational use.</p>
        </CardContent>
      </Card>
    </div>
  );
}
