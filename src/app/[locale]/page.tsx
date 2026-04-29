import { redirect } from 'next/navigation';
import { getCurrentUser, dashboardPathFor } from '@/lib/auth/session';
import type { PageProps } from '@/types';

export default async function HomePage({ params }: PageProps) {
  const { locale } = await params;
  const user = await getCurrentUser();
  if (user) {
    redirect(`/${locale}${dashboardPathFor(user.role)}`);
  }
  redirect(`/${locale}/login`);
}
