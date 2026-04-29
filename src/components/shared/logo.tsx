import { cn } from '@/lib/utils';

interface LogoProps {
  className?: string;
  showDot?: boolean;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
}

const sizeClasses: Record<string, string> = {
  xs: 'text-sm',
  sm: 'text-lg',
  md: 'text-2xl',
  lg: 'text-4xl',
  xl: 'text-6xl',
};

export function Logo({ className, showDot = true, size = 'md' }: LogoProps) {
  return (
    <span
      className={cn('inline-flex items-center font-black leading-none tracking-tighter', sizeClasses[size], className)}
      dir="ltr"
    >
      PHOB
      {showDot && <span className="ml-0.5 text-brand-accent">.</span>}
    </span>
  );
}
