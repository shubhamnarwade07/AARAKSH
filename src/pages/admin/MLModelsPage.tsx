import { useQuery } from '@tanstack/react-query';
import { adminService } from '@/services/adminService';
import { DemoModeBanner } from '@/components/ui/DemoModeBanner';
import { Card } from '@/components/ui/Card';
import { Skeleton } from '@/components/ui/Skeleton';
import { Brain, FlaskConical, CheckCircle, Clock } from 'lucide-react';
import { ModelStatus } from '@/types';

const STATUS_CONFIG: Record<ModelStatus, { icon: React.ReactNode; label: string; color: string }> = {
  ACTIVE: { icon: <CheckCircle className="h-4 w-4" />, label: 'Active', color: 'text-green-600' },
  TRAINING: { icon: <Clock className="h-4 w-4" />, label: 'Training', color: 'text-blue-600' },
  DEPRECATED: { icon: <Clock className="h-4 w-4" />, label: 'Deprecated', color: 'text-slate-400' },
  PLANNED: { icon: <FlaskConical className="h-4 w-4" />, label: 'Planned', color: 'text-amber-600' },
};

export function MLModelsPage() {
  const { data: models, isLoading } = useQuery({ queryKey: ['admin', 'models'], queryFn: () => adminService.getMLModels() });
  return (
    <div className="p-4 md:p-6 space-y-4">
      <DemoModeBanner />
      <div className="rounded-md bg-blue-50 border border-blue-200 px-4 py-3 text-xs text-blue-800">
        <strong>Note:</strong> No ML models are trained yet. The model registry below shows planned models. Metrics will populate after training data collection and validation.
      </div>
      <div className="space-y-4">
        {isLoading ? (
          Array.from({ length: 2 }).map((_, i) => <Skeleton key={i} className="h-48 rounded-lg" />)
        ) : (models ?? []).map(model => {
          const statusCfg = STATUS_CONFIG[model.status];
          return (
            <Card key={model.id}>
              <div className="flex items-start justify-between gap-4 mb-4">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <Brain className="h-4 w-4 text-violet-600" />
                    <h3 className="font-semibold text-slate-800">{model.name}</h3>
                    <span className="rounded-full bg-slate-100 px-2 py-0.5 text-xs text-slate-600">{model.version}</span>
                  </div>
                  <p className="text-xs text-slate-500">{model.type}</p>
                </div>
                <span className={`flex items-center gap-1 text-sm font-medium ${statusCfg.color}`}>
                  {statusCfg.icon} {statusCfg.label}
                </span>
              </div>
              <p className="text-xs text-slate-600 mb-4">{model.description}</p>
              <div className="mb-4">
                <p className="text-xs font-semibold text-slate-700 mb-2">Input Features</p>
                <div className="flex flex-wrap gap-1.5">
                  {model.features.map((f, i) => (
                    <span key={i} className="rounded-full bg-blue-50 border border-blue-100 px-2 py-0.5 text-xs text-blue-700">{f}</span>
                  ))}
                </div>
              </div>
              <div className="rounded-md bg-amber-50 border border-amber-200 px-3 py-2">
                <p className="text-xs text-amber-800">
                  <strong>Evaluation Status:</strong> {model.metrics.validationStatus === 'AWAITING_VALIDATION' ? 'Awaiting Validation — No accuracy metrics available yet. Metrics will be populated after training and evaluation on real data.' : model.metrics.validationStatus}
                </p>
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
