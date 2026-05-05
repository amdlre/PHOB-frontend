'use client';

import { usePathname } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { Building2, Calendar, Home, Sparkles } from 'lucide-react';
import type { ComponentType, ReactNode } from 'react';
import {
  AppSidebar,
  DashboardHeader,
  DashboardLayout,
  type AppSidebarNavGroup,
} from '@amdlre/design-system';
import { Logo } from '@/components/shared/logo';
import { LanguageSwitcher } from '@/components/shared/language-switcher';
import { NotificationBell } from '@/components/shared/notification-bell';
import { logoutAction } from '@/actions/auth';
import type { User } from '@/types/auth';

const ICON_MAP: Record<string, ComponentType<{ className?: string }>> = {
  home: Home,
  calendar: Calendar,
  sparkles: Sparkles,
  building: Building2,
};

export type NavIcon = keyof typeof ICON_MAP;

export interface NavItem {
  href: string;
  label: string;
  icon: NavIcon;
}

interface Props {
  user: User | null;
  navItems: NavItem[];
  children: ReactNode;
  /** Kept for backward compat; active state is now derived from pathname. */
  basePath?: string;
}

function renderIcon(key: NavIcon): ReactNode {
  const Icon = ICON_MAP[key] ?? Home;
  return <Icon className="h-4 w-4" />;
}

export function DashboardShell({ user, navItems, children }: Props) {
  const pathname = usePathname();
  const t = useTranslations('auth');

  const navGroups: AppSidebarNavGroup[] = [
    {
      items: navItems.map((item) => ({
        title: item.label,
        href: item.href,
        icon: renderIcon(item.icon),
      })),
    },
  ];

  return (
    <DashboardLayout
      sidebar={
        <AppSidebar
          brand={<Logo size="md" className="text-brand-black" />}
          navGroups={navGroups}
          activePath={pathname}
          user={
            user
              ? {
                  name: user.name || user.email || user.role,
                  email: user.email,
                  avatarUrl: user.avatar,
                  onLogout: () => {
                    void logoutAction();
                  },
                  logoutLabel: t('logout'),
                }
              : null
          }
        />
      }
      header={
        <DashboardHeader
          actions={
            <>
              <NotificationBell />
              <LanguageSwitcher />
            </>
          }
        />
      }
    >
      {children}
    </DashboardLayout>
  );
}
