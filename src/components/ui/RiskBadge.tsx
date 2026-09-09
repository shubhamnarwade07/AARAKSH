import { cn } from '@/lib/utils';
import { RiskLevel } from '@/types';

const CONFIG: Record<RiskLevel, { label: string; bg: string; text: string; dot: string; border: string }> = {
  LOW:      { label: 'Low Risk',      bg: 'rgba(34,197,94,0.12)',  text: '#22c55e', dot: '#22c55e', border: 'rgba(34,197,94,0.3)' },
  MODERATE: { label: 'Moderate Risk', bg: 'rgba(234,179,8,0.12)',  text: '#eab308', dot: '#eab308', border: 'rgba(234,179,8,0.3)' },
  HIGH:     { label: 'High Risk',     bg: 'rgba(249,115,22,0.12)', text: '#f97316', dot: '#f97316', border: 'rgba(249,115,22,0.3)' },
  CRITICAL: { label: 'Critical Risk', bg: 'rgba(239,68,68,0.15)',  text: '#ef4444', dot: '#ef4444', border: 'rgba(239,68,68,0.4)' },
};

interface RiskBadgeProps {
  level: RiskLevel;
  size?: 'sm' | 'md' | 'lg';
  showDot?: boolean;
  className?: string;
}

export function RiskBadge({ level, size = 'md', showDot = true, className }: RiskBadgeProps) {
  const c = CONFIG[level];
  const sizeClass = size === 'sm' ? 'text-[10px] px-2 py-0.5' : size === 'lg' ? 'text-sm px-3 py-1' : 'text-xs px-2.5 py-0.5';
  return (
    <span
      className={cn('inline-flex items-center gap-1.5 rounded-full font-semibold tracking-wide uppercase', sizeClass, className)}
      style={{ background: c.bg, color: c.text, border: `1px solid ${c.border}` }}
    >
      {showDot && <span className="h-1.5 w-1.5 rounded-full flex-shrink-0" style={{ background: c.dot }} />}
      {c.label.replace(' Risk', '')}
    </span>
  );
}
