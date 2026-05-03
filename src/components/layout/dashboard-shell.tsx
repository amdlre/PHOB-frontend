'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { Building2, Calendar, Home, LogOut, Sparkles } from 'lucide-react';
import type { ComponentType } from 'react';
import { Box, Button, Container, Flex, Stack, Typography } from '@amdlre/design-system';
import { Logo } from '@/components/shared/logo';
import { LanguageSwitcher } from '@/components/shared/language-switcher';
import { NotificationBell } from '@/components/shared/notification-bell';
import { logoutAction } from '@/actions/auth';
import { cn } from '@/lib/utils';
import type { User } from '@/types/auth';

// Icon registry — server layouts pass keys (strings serialize across the
// server→client boundary), this file resolves them to real components.
const NAV_ICONS: Record<string, ComponentType<{ size?: number; strokeWidth?: number }>> = {
  home: Home,
  calendar: Calendar,
  sparkles: Sparkles,
  building: Building2,
};

export type NavIcon = keyof typeof NAV_ICONS;

export interface NavItem {
  href: string;
  label: string;
  icon: NavIcon;
}

export function DashboardShell({
  user,
  navItems,
  children,
  basePath,
}: {
  user: User | null;
  navItems: NavItem[];
  children: React.ReactNode | any;
  basePath: string;
}) {
  const pathname = usePathname();
  const t = useTranslations('auth');

  const isActive = (href: string) => {
    if (href === basePath) return pathname.endsWith(basePath);
    return pathname.includes(href);
  };

  return (
    <Box className="min-h-screen bg-brand-offwhite font-sans">
      <Box
        as="header"
        className="sticky top-0 z-40 border-b border-brand-border bg-white/80 backdrop-blur-xl"
      >
        <Container size="xl" className="mx-auto">
          <Flex align="center" justify="between" gap={4} className="h-16 px-6">
            <Flex align="center" gap={6}>
              <Logo size="md" className="text-brand-black" />
            </Flex>
            <Flex align="center" gap={3}>
              <NotificationBell />
              <LanguageSwitcher />
              {user ? (
                <Stack gap={0} className="hidden items-end md:flex">
                  <Typography
                    as="span"
                    variant="small"
                    className="text-[10px] font-black uppercase tracking-widest text-brand-slate"
                  >
                    {user.role}
                  </Typography>
                  <Typography
                    as="span"
                    variant="small"
                    className="text-sm font-black text-brand-black"
                  >
                    {user.name}
                  </Typography>
                </Stack>
              ) : null}
              <form action={logoutAction}>
                <Button
                  type="submit"
                  variant="ghost"
                  leftIcon={<LogOut size={14} />}
                  className="rounded-2xl bg-red-50 px-3 py-2 text-xs font-black text-red-500 hover:bg-red-500 hover:text-white"
                >
                  <Box as="span" className="hidden sm:inline">
                    {t('logout')}
                  </Box>
                </Button>
              </form>
            </Flex>
          </Flex>
        </Container>
      </Box>

      <Container size="xl" className="mx-auto">
        <Flex gap={6} className="px-6 py-6">
          <Box as="aside" className="hidden w-64 shrink-0 lg:block">
            <Stack
              as="nav"
              gap={1}
              className="sticky top-24 rounded-3xl border border-brand-border bg-white p-3 shadow-soft"
            >
              {navItems.map((item) => {
                const Icon = NAV_ICONS[item.icon] ?? Home;
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
                    <Box as="span">{item.label}</Box>
                  </Link>
                );
              })}
            </Stack>
          </Box>

          <Box as="main" className="min-w-0 flex-1">
            {children}
          </Box>
        </Flex>
      </Container>

      <Flex
        as="nav"
        className="fixed bottom-0 inset-x-0 z-40 border-t border-brand-border bg-white/95 px-2 py-2 backdrop-blur-xl lg:hidden"
      >
        {navItems.slice(0, 4).map((item) => {
          const Icon = NAV_ICONS[item.icon] ?? Home;
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
              <Box as="span">{item.label}</Box>
            </Link>
          );
        })}
      </Flex>
    </Box>
  );
}
