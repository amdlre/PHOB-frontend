'use client';

import { useState, useTransition } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter, useParams } from 'next/navigation';
import { useTranslations } from 'next-intl';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import {
  Box,
  Button,
  Card,
  CustomInput,
  Flex,
  Stack,
  Typography,
} from '@amdlre/design-system';
import { registerSchema, type RegisterFormData } from '@/lib/validations/auth';
import { registerAction } from '@/actions/auth';
import { Logo } from '@/components/shared/logo';

export function RegisterForm() {
  const t = useTranslations('auth.register');
  const router = useRouter();
  const params = useParams<{ locale: string }>();
  const [pending, startTransition] = useTransition();
  const [serverError, setServerError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: '',
      email: '',
      phone: '',
      password: '',
      password_confirmation: '',
    },
  });

  const onSubmit = (data: RegisterFormData) => {
    setServerError(null);
    startTransition(async () => {
      const fd = new FormData();
      Object.entries(data).forEach(([k, v]) => fd.append(k, String(v)));
      const result = await registerAction(fd);
      if (!result.success) {
        setServerError(result.message || 'حدث خطأ');
        return;
      }
      router.push(`/${params.locale}${result.redirect || '/dashboard'}`);
      router.refresh();
    });
  };

  return (
    <Card className="card-premium w-full max-w-md p-10">
      <Stack gap={3} align="center" className="mb-8 text-center">
        <Logo size="lg" />
        <Typography as="h1" variant="h2" className="text-2xl font-black tracking-tight text-brand-black">
          {t('title')}
        </Typography>
        <Typography
          as="p"
          variant="small"
          className="text-[10px] font-black uppercase tracking-[0.2em] text-brand-slate"
        >
          {t('subtitle')}
        </Typography>
      </Stack>

      {serverError ? (
        <Box className="mb-6 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-bold text-red-600">
          {serverError}
        </Box>
      ) : null}

      <form onSubmit={handleSubmit(onSubmit)}>
        <Stack gap={4}>
          {(['name', 'email', 'phone', 'password', 'password_confirmation'] as const).map(
            (field) => {
              const label =
                field === 'password_confirmation'
                  ? t('confirmPassword')
                  : t(field as 'name' | 'email' | 'phone' | 'password');
              const type =
                field === 'email'
                  ? 'email'
                  : field === 'phone'
                    ? 'tel'
                    : field.startsWith('password')
                      ? 'password'
                      : 'text';
              const placeholder =
                field === 'name'
                  ? t('namePlaceholder')
                  : field === 'phone'
                    ? t('phonePlaceholder')
                    : undefined;
              return (
                <CustomInput
                  key={field}
                  label={label}
                  type={type}
                  placeholder={placeholder}
                  error={errors[field]?.message}
                  {...register(field)}
                />
              );
            },
          )}

          <Button
            type="submit"
            disabled={pending}
            rightIcon={<ArrowLeft size={18} className='ltr:rotate-180' />}
            size={"xl"}
            rounded={"xl"}
            isLoading={pending}
          >
            {t('submit')}
          </Button>
        </Stack>
      </form>

      <Flex align="center" justify="center" gap={1} className="mt-6 text-center">
        <Typography as="span" variant="small" className="text-xs font-bold text-brand-slate">
          {t('hasAccount')}
        </Typography>
        <Link
          href={`/${params.locale}/login`}
          className="text-xs font-black text-brand-accent hover:underline"
        >
          {t('login')}
        </Link>
      </Flex>
    </Card>
  );
}
