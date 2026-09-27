import { cn } from '@/lib/utils';
import { HTMLAttributes } from 'react';

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  padding?: 'default' | 'none' | 'sm';
  variant?: 'light' | 'dark';
}

export function Card({ className, children, padding = 'default', variant = 'light', style, ...props }: CardProps) {
  const darkStyle = variant === 'dark' ? {
    background: 'var(--bg-card)',
    border: '1px solid var(--border-card)',
    ...style,
  } : style;

  return (
    <div
      className={cn(
        'rounded-xl transition-colors duration-200',
        variant === 'light'
          ? 'bg-white dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 shadow-sm'
          : 'glass-card',
        padding === 'default' && 'p-4',
        padding === 'sm' && 'p-3',
        className
      )}
      style={darkStyle}
      {...props}
    >
      {children}
    </div>
  );
}

interface CardHeaderProps extends HTMLAttributes<HTMLDivElement> {}
export function CardHeader({ className, children, ...props }: CardHeaderProps) {
  return (
    <div className={cn('flex items-center justify-between mb-3', className)} {...props}>
      {children}
    </div>
  );
}

interface CardTitleProps extends HTMLAttributes<HTMLHeadingElement> {}
export function CardTitle({ className, children, ...props }: CardTitleProps) {
  return (
    <h3
      className={cn('text-sm font-semibold', className)}
      style={{ color: 'var(--text-primary)' }}
      {...props}
    >
      {children}
    </h3>
  );
}

interface CardContentProps extends HTMLAttributes<HTMLDivElement> {}
export function CardContent({ className, children, ...props }: CardContentProps) {
  return (
    <div className={cn(className)} {...props}>
      {children}
    </div>
  );
}
