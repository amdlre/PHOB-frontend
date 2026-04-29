import type { Metadata } from 'next';
import { generateSiteMetadata } from '@/lib/seo/metadata';
import { RegisterForm } from '@/components/forms/register-form';
import type { PageProps } from '@/types';

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale } = await params;
  return generateSiteMetadata(locale, {
    title: locale === 'ar' ? 'إنشاء حساب' : 'Register',
    pathname: '/register',
    noIndex: true,
  });
}

export default function RegisterPage() {
  return (
    <div className="flex min-h-screen items-center justify-center px-6 py-16">
      <RegisterForm />
    </div>
  );
}
