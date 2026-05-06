'use client';

import Link from 'next/link';
import { useLocale } from 'next-intl';
import { cn } from '@/lib/utils';

interface LogoProps {
  className?: string;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  /** Override the destination. Defaults to the current locale's home. */
  href?: string;
  onClick?: React.MouseEventHandler<HTMLAnchorElement>;
}

const sizeClasses: Record<NonNullable<LogoProps['size']>, string> = {
  xs: 'h-4',
  sm: 'h-5',
  md: 'h-7',
  lg: 'h-10',
  xl: 'h-14',
};

export function Logo({ className, size = 'md', href, onClick }: LogoProps) {
  const locale = useLocale();

  return (
    <Link
      href={href ?? `/${locale}`}
      onClick={onClick}
      aria-label="PHOB"
      className={cn('inline-flex items-center text-brand-black', className)}
    >
      <svg
        viewBox="0 0 132 36"
        xmlns="http://www.w3.org/2000/svg"
        className={cn('w-auto', sizeClasses[size])}
        aria-hidden="true"
      >
        <text
          x="0"
          y="28"
          fontFamily="inherit"
          fontWeight="900"
          fontSize="32"
          letterSpacing="-1.5"
          fill="currentColor"
        >
          PHOB
        </text>
        <circle cx="95" cy="29" r="3.5" className="fill-brand-accent" />
      </svg>
    </Link>
  );
}
