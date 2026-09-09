import { Shield, Database, Bell, Sliders, Info } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { useDemoMode } from '@/contexts/DemoContext';
import { RISK_THRESHOLDS } from '@/lib/constants';

export function AdminSettingsPage() {
  const { currentScenario, setScenario } = useDemoMode();
  return (
    <div className="p-4 md:p-6 max-w-3xl space-y-4">
      <Card>
        <CardHeader><CardTitle className="flex items-center gap-2"><Sliders className="h-4 w-4" />Risk Threshold Configuration</CardTitle></CardHeader>
        <CardContent>
          <p className="text-xs text-amber-700 bg-amber-50 border border-amber-200 rounded-md px-3 py-2 mb-4">
            These are prototype UI thresholds only. They are NOT scientifically validated. Real thresholds must be calibrated using actual model evaluation data.
          </p>
          <div className="space-y-3">
            {[
              { label: 'LOW Risk Max', value: `≤ ${RISK_THRESHOLDS.LOW_MAX}` },
              { label: 'MODERATE Risk Max', value: `≤ ${RISK_THRESHOLDS.MODERATE_MAX}` },
              { label: 'HIGH Risk Max', value: `≤ ${RISK_THRESHOLDS.HIGH_MAX}` },
              { label: 'CRITICAL Risk Min', value: `≥ ${RISK_THRESHOLDS.CRITICAL_MIN}` },
            ].map(t => (
              <div key={t.label} className="flex justify-between border-b border-slate-50 pb-2">
                <span className="text-sm text-slate-700">{t.label}</span>
                <span className="text-sm font-mono font-semibold text-slate-800">{t.value}</span>
              </div>
            ))}
          </div>
          <p className="text-xs text-slate-400 mt-3">Threshold editing will be available in Phase 3 with backend integration.</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader><CardTitle className="flex items-center gap-2"><Database className="h-4 w-4" />Demo Scenario Control</CardTitle></CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            {(['NORMAL', 'HEAVY_RAIN', 'RISING_RISK', 'CRITICAL'] as const).map(id => (
              <button key={id} onClick={() => setScenario(id)}
                className={`rounded-md px-4 py-2 text-sm font-medium border transition-colors ${
                  currentScenario.id === id ? 'bg-blue-700 text-white border-blue-700' : 'bg-white text-slate-600 border-slate-200'
                }`}>{id.replace('_', ' ')}
              </button>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader><CardTitle className="flex items-center gap-2"><Info className="h-4 w-4" />System Information</CardTitle></CardHeader>
        <CardContent className="space-y-1 text-sm text-slate-600">
          <p><strong>AARAKSH</strong> — Phase 1 Frontend Foundation</p>
          <p>Version: v0.1.0-prototype</p>
          <p>Team: NeuroNauts • SIH 2026 • Problem SIH26192</p>
          <p>Frontend: React 19 + TypeScript + Vite + Tailwind CSS</p>
          <p>Map: MapLibre GL JS</p>
          <p className="text-xs text-slate-400 mt-2">Backend (FastAPI + Supabase) and ML (XGBoost) integration planned for Phase 2–3.</p>
        </CardContent>
      </Card>
    </div>
  );
}
