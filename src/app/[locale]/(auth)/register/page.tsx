import type { Metadata } from 'next';
import { Flex } from '@amdlre/design-system';
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
    <Flex align="center" justify="center" className="min-h-screen px-6 py-16">
      <RegisterForm />
    </Flex>
  );
}
