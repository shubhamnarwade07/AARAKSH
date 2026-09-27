import { Sun, Moon } from 'lucide-react';
import { useTheme } from '@/contexts/ThemeContext';
import { cn } from '@/lib/utils';

interface ThemeToggleProps {
  className?: string;
  variant?: 'icon' | 'pill' | 'button';
  showLabel?: boolean;
}

export function ThemeToggle({ className, variant = 'icon', showLabel = false }: ThemeToggleProps) {
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === 'dark';

  if (variant === 'pill') {
    return (
      <button
        type="button"
        onClick={toggleTheme}
        aria-label={`Switch to ${isDark ? 'light' : 'dark'} mode`}
        title={`Switch to ${isDark ? 'light' : 'dark'} mode`}
        className={cn(
          'relative inline-flex h-8 w-16 items-center rounded-full transition-colors duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-400',
          isDark
            ? 'bg-slate-800/90 border border-sky-500/20'
            : 'bg-slate-200 border border-slate-300',
          className
        )}
      >
        <span
          className={cn(
            'flex h-6 w-6 transform items-center justify-center rounded-full transition-transform duration-300 shadow-sm',
            isDark
              ? 'translate-x-9 bg-slate-900 text-sky-400 border border-sky-400/40'
              : 'translate-x-1 bg-white text-amber-500 border border-amber-300'
          )}
        >
          {isDark ? <Moon className="h-3.5 w-3.5" /> : <Sun className="h-3.5 w-3.5" />}
        </span>
        <span className="sr-only">Toggle theme</span>
      </button>
    );
  }

  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label={`Switch to ${isDark ? 'light' : 'dark'} mode`}
      title={`Switch to ${isDark ? 'light' : 'dark'} mode`}
      className={cn(
        'group relative flex items-center gap-2 rounded-lg px-2.5 py-1.5 text-xs font-medium transition-all duration-200',
        isDark
          ? 'bg-slate-900/60 hover:bg-slate-800/80 text-slate-300 hover:text-white border border-sky-500/20 hover:border-sky-400/40 shadow-sm hover:shadow-[0_0_12px_rgba(56,189,248,0.15)]'
          : 'bg-slate-100 hover:bg-slate-200 text-slate-700 hover:text-slate-900 border border-slate-300/80 shadow-sm',
        className
      )}
    >
      <div className="relative flex h-4 w-4 items-center justify-center">
        {isDark ? (
          <Sun className="h-4 w-4 text-amber-400 transition-transform duration-300 group-hover:rotate-45 group-hover:scale-110" />
        ) : (
          <Moon className="h-4 w-4 text-sky-600 transition-transform duration-300 group-hover:-rotate-12 group-hover:scale-110" />
        )}
      </div>

      {showLabel && (
        <span className="tracking-wide">
          {isDark ? 'Light Mode' : 'Dark Mode'}
        </span>
      )}
    </button>
  );
}
