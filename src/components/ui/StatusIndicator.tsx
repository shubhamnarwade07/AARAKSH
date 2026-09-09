import { cn } from '@/lib/utils';

type Status = 'ONLINE' | 'OFFLINE' | 'DEGRADED' | 'OPERATIONAL' | 'MAINTENANCE';

interface StatusIndicatorProps {
  status: Status;
  showLabel?: boolean;
  size?: 'sm' | 'md';
  className?: string;
}

const CONFIG: Record<Status, { color: string; label: string }> = {
  ONLINE: { color: 'bg-green-500', label: 'Online' },
  OPERATIONAL: { color: 'bg-green-500', label: 'Operational' },
  OFFLINE: { color: 'bg-red-500', label: 'Offline' },
  DEGRADED: { color: 'bg-yellow-500', label: 'Degraded' },
  MAINTENANCE: { color: 'bg-blue-500', label: 'Maintenance' },
};

export function StatusIndicator({ status, showLabel = true, size = 'md', className }: StatusIndicatorProps) {
  const config = CONFIG[status] ?? CONFIG['OFFLINE'];
  return (
    <span className={cn('inline-flex items-center gap-1.5', className)}>
      <span className={cn('rounded-full animate-pulse', config.color, size === 'sm' ? 'h-1.5 w-1.5' : 'h-2 w-2')} />
      {showLabel && <span className={cn('font-medium', size === 'sm' ? 'text-xs' : 'text-sm', 'text-slate-600')}>{config.label}</span>}
    </span>
  );
}
