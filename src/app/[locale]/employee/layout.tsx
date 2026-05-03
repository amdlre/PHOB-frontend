import { redirect } from 'next/navigation';
import { getTranslations } from 'next-intl/server';
import { getCurrentUser } from '@/lib/auth/session';
import { DashboardShell, type NavItem } from '@/components/layout/dashboard-shell';
import type { PageProps } from '@/types';

export default async function EmployeeLayout({
  children,
  params,
}: PageProps & { children: React.ReactNode }) {
  const { locale } = await params;
  const user = await getCurrentUser();
  if (!user) redirect(`/${locale}/login`);
  if (user.role === 'client') redirect(`/${locale}/dashboard`);

  const t = await getTranslations('nav');

  const navItems: NavItem[] = [
    { href: `/${locale}/employee/dashboard`, label: t('dashboard'), icon: 'home' },
    { href: `/${locale}/employee/requests`, label: t('requests'), icon: 'calendar' },
    { href: `/${locale}/employee/subscriptions`, label: t('subscriptions'), icon: 'sparkles' },
    { href: `/${locale}/employee/properties`, label: t('properties'), icon: 'building' },
  ];

  return (
    <DashboardShell user={user} navItems={navItems} basePath={`/${locale}/employee/dashboard`}>
      {children}
    </DashboardShell>
  );
}
