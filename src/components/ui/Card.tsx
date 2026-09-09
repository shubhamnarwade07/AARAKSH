import { cn } from '@/lib/utils';
import { HTMLAttributes } from 'react';

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  padding?: 'default' | 'none' | 'sm';
  variant?: 'light' | 'dark';
}

export function Card({ className, children, padding = 'default', variant = 'light', style, ...props }: CardProps) {
  const darkStyle = variant === 'dark' ? {
    background: 'rgba(15,41,24,0.6)',
    border: '1px solid rgba(255,255,255,0.07)',
    ...style,
  } : style;

  return (
    <div
      className={cn(
        'rounded-xl',
        variant === 'light'
          ? 'bg-white border border-slate-100 shadow-sm'
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
    <h3 className={cn('text-sm font-semibold text-slate-800', className)} {...props}>
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
