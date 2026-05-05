import { redirect } from 'next/navigation';
import { getTranslations } from 'next-intl/server';
import { getCurrentUser } from '@/lib/auth/session';
import { DashboardShell, type NavItem } from '@/components/layout/dashboard-shell';
import type { PageProps } from '@/types';

export default async function ClientLayout({
  children,
  params,
}: PageProps & { children: React.ReactNode }) {
  const { locale } = await params;
  const user = await getCurrentUser();
  if (!user) {
    redirect(`/${locale}/login?callbackUrl=${encodeURIComponent(`/${locale}/dashboard`)}`);
  }
  if (user.role !== 'client') redirect(`/${locale}/employee/dashboard`);

  const t = await getTranslations('nav');

  const navItems: NavItem[] = [
    { href: `/${locale}/dashboard`, label: t('dashboard'), icon: 'home' },
    { href: `/${locale}/properties`, label: t('properties'), icon: 'building' },
    { href: `/${locale}/subscriptions`, label: t('subscriptions'), icon: 'sparkles' },
    { href: `/${locale}/requests`, label: t('requests'), icon: 'calendar' },
  ];

  return (
    <DashboardShell user={user} navItems={navItems} basePath={`/${locale}/dashboard`}>
      {children}
    </DashboardShell>
  );
}
