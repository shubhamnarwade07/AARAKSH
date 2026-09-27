import React from 'react';
import { cn } from '@/lib/utils';

interface AarakshLogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  withText?: boolean;
  textColor?: string;
  subtitle?: string;
}

export function AarakshLogo({
  className,
  size = 'md',
  withText = false,
  textColor,
  subtitle,
}: AarakshLogoProps) {
  const sizeMap = {
    sm: { box: 'h-7 w-7', text: 'text-xs', icon: 18 },
    md: { box: 'h-8 w-8', text: 'text-sm', icon: 22 },
    lg: { box: 'h-10 w-10', text: 'text-base', icon: 26 },
    xl: { box: 'h-12 w-12', text: 'text-xl', icon: 30 },
  };

  const currentSize = sizeMap[size];

  return (
    <div className={cn('inline-flex items-center gap-3 select-none group', className)}>
      {/* Icon Badge: Himalayan Sentinel Peak + Protective Wave Shield 'A' */}
      <div
        className={cn(
          'relative flex items-center justify-center rounded-lg shadow-md transition-all duration-300 group-hover:scale-105',
          currentSize.box
        )}
        style={{
          background: 'linear-gradient(135deg, #0284c7 0%, #0369a1 60%, #075985 100%)',
          boxShadow: '0 3px 12px rgba(2, 132, 199, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.25)',
          border: '1px solid rgba(56, 189, 248, 0.3)',
        }}
      >
        <svg
          viewBox="0 0 32 32"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-full p-1.5"
        >
          {/* Subtle background radar ring */}
          <circle cx="16" cy="16" r="13" stroke="rgba(255,255,255,0.15)" strokeWidth="0.8" strokeDasharray="2 2" />

          {/* Himalayan Twin Peak Shading in lower apex */}
          <path
            d="M16 6.5L8.5 24H12.5L16 15.5L19.5 24H23.5L16 6.5Z"
            fill="white"
          />

          {/* Inner Mountain Valley Cutout */}
          <path
            d="M16 12L13.2 19.5H18.8L16 12Z"
            fill="#0369a1"
          />

          {/* Hydrological Alert Signal / River Wave Crossbar */}
          <path
            d="M9 19.2C11 18.2 13 18.4 16 19.8C18.8 21.2 21 20.8 23 19.2"
            stroke="#38bdf8"
            strokeWidth="1.8"
            strokeLinecap="round"
          />

          {/* Sentinel Summit Beacon Dot */}
          <circle cx="16" cy="6.5" r="1.5" fill="#38bdf8" />
        </svg>
      </div>

      {/* Brand Text */}
      {withText && (
        <div className="flex flex-col leading-tight">
          <span
            className={cn('font-bold tracking-[0.2em] uppercase', currentSize.text)}
            style={{ color: textColor || 'inherit' }}
          >
            AARAKSH
          </span>
          {subtitle && (
            <span className="text-[10px] tracking-wider text-slate-400 uppercase">
              {subtitle}
            </span>
          )}
        </div>
      )}
    </div>
  );
}
