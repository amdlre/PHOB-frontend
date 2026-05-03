import type { Metadata } from 'next';
import { Flex } from '@amdlre/design-system';
import { generateSiteMetadata } from '@/lib/seo/metadata';
import { LoginForm } from '@/components/forms/login-form';
import type { PageProps } from '@/types';

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale } = await params;
  return generateSiteMetadata(locale, {
    title: locale === 'ar' ? 'تسجيل الدخول' : 'Sign In',
    pathname: '/login',
    noIndex: true,
  });
}

export default function LoginPage() {
  return (
    <Flex align="center" justify="center" className="min-h-screen px-6 py-16">
      <LoginForm />
    </Flex>
  );
}
