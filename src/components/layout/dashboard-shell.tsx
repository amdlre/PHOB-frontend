'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { LogOut } from 'lucide-react';
import type { ComponentType } from 'react';
import { Logo } from '@/components/shared/logo';
import { LanguageSwitcher } from '@/components/shared/language-switcher';
import { NotificationBell } from '@/components/shared/notification-bell';
import { logoutAction } from '@/actions/auth';
import { cn } from '@/lib/utils';
import type { User } from '@/types/auth';

export interface NavItem {
  href: string;
  label: string;
  icon: ComponentType<{ size?: number; strokeWidth?: number }>;
}

export function DashboardShell({
  user,
  navItems,
  children,
  basePath,
}: {
  user: User | null;
  navItems: NavItem[];
  children: React.ReactNode;
  basePath: string;
}) {
  const pathname = usePathname();
  const t = useTranslations('auth');

  const isActive = (href: string) => {
    if (href === basePath) return pathname.endsWith(basePath);
    return pathname.includes(href);
  };

  return (
    <div className="min-h-screen bg-brand-offwhite font-sans">
      <header className="sticky top-0 z-40 border-b border-brand-border bg-white/80 backdrop-blur-xl">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-6">
          <div className="flex items-center gap-6">
            <Logo size="md" className="text-brand-black" />
          </div>
          <div className="flex items-center gap-3">
            <NotificationBell />
            <LanguageSwitcher />
            {user && (
              <div className="hidden flex-col items-end md:flex">
                <span className="text-[10px] font-black uppercase tracking-widest text-brand-slate">
                  {user.role}
                </span>
                <span className="text-sm font-black text-brand-black">{user.name}</span>
              </div>
            )}
            <form action={logoutAction}>
              <button
                type="submit"
                className="flex items-center gap-2 rounded-2xl bg-red-50 px-3 py-2 text-xs font-black text-red-500 transition-all hover:bg-red-500 hover:text-white"
              >
                <LogOut size={14} />
                <span className="hidden sm:inline">{t('logout')}</span>
              </button>
            </form>
          </div>
        </div>
      </header>

      <div className="mx-auto flex max-w-7xl gap-6 px-6 py-6">
        <aside className="hidden w-64 shrink-0 lg:block">
          <nav className="sticky top-24 space-y-1 rounded-3xl border border-brand-border bg-white p-3 shadow-soft">
            {navItems.map((item) => {
              const Icon = item.icon;
              const active = isActive(item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    'flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-bold transition-all',
                    active
                      ? 'bg-brand-black text-white shadow-md'
                      : 'text-brand-slate hover:bg-brand-offwhite hover:text-brand-black',
                  )}
                >
                  <Icon size={18} strokeWidth={1.75} />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>
        </aside>

        <main className="min-w-0 flex-1">{children}</main>
      </div>

      {/* Mobile bottom nav */}
      <nav className="fixed bottom-0 inset-x-0 z-40 flex border-t border-brand-border bg-white/95 px-2 py-2 backdrop-blur-xl lg:hidden">
        {navItems.slice(0, 4).map((item) => {
          const Icon = item.icon;
          const active = isActive(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'flex flex-1 flex-col items-center gap-1 rounded-2xl px-2 py-2 text-[10px] font-black transition-all',
                active ? 'text-brand-accent' : 'text-brand-slate',
              )}
            >
              <Icon size={20} strokeWidth={1.75} />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
