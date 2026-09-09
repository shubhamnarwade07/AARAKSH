import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { RiskLevel } from '@/types';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function getRiskColor(level: RiskLevel): string {
  switch (level) {
    case 'LOW': return '#22C55E';
    case 'MODERATE': return '#EAB308';
    case 'HIGH': return '#F97316';
    case 'CRITICAL': return '#EF4444';
    default: return '#94A3B8';
  }
}

export function getRiskBgClass(level: RiskLevel): string {
  switch (level) {
    case 'LOW': return 'bg-green-100 text-green-800';
    case 'MODERATE': return 'bg-yellow-100 text-yellow-800';
    case 'HIGH': return 'bg-orange-100 text-orange-800';
    case 'CRITICAL': return 'bg-red-100 text-red-800';
    default: return 'bg-slate-100 text-slate-700';
  }
}

export function getRiskTextClass(level: RiskLevel): string {
  switch (level) {
    case 'LOW': return 'text-green-700';
    case 'MODERATE': return 'text-yellow-700';
    case 'HIGH': return 'text-orange-600';
    case 'CRITICAL': return 'text-red-600';
    default: return 'text-slate-600';
  }
}

export function getRiskBorderClass(level: RiskLevel): string {
  switch (level) {
    case 'LOW': return 'border-green-300';
    case 'MODERATE': return 'border-yellow-300';
    case 'HIGH': return 'border-orange-300';
    case 'CRITICAL': return 'border-red-300';
    default: return 'border-slate-200';
  }
}

export function getRiskLabel(level: RiskLevel): string {
  switch (level) {
    case 'LOW': return 'Low Risk';
    case 'MODERATE': return 'Moderate Risk';
    case 'HIGH': return 'High Risk';
    case 'CRITICAL': return 'Critical Risk';
    default: return 'Unknown';
  }
}

export function scoreToRiskLevel(score: number): RiskLevel {
  if (score < 0.30) return 'LOW';
  if (score < 0.60) return 'MODERATE';
  if (score < 0.80) return 'HIGH';
  return 'CRITICAL';
}

export function formatDateTime(date: Date | string): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  return d.toLocaleString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  });
}

export function formatTime(date: Date | string): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  return d.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false });
}

export function formatRelativeTime(date: Date | string): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  const now = new Date();
  const diffMs = now.getTime() - d.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  if (diffMins < 1) return 'just now';
  if (diffMins < 60) return `${diffMins}m ago`;
  const diffHours = Math.floor(diffMins / 60);
  if (diffHours < 24) return `${diffHours}h ago`;
  return `${Math.floor(diffHours / 24)}d ago`;
}

export function formatPercent(value: number, decimals = 0): string {
  return `${(value * 100).toFixed(decimals)}%`;
}

export function clampScore(score: number): number {
  return Math.min(1, Math.max(0, score));
}
