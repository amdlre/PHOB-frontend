'use client';

import { useState, useTransition } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter, useParams } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { ArrowLeft, Lock, Mail } from 'lucide-react';
import Link from 'next/link';
import {
  Box,
  Button,
  Card,
  Flex,
  Input,
  Label,
  Stack,
  Typography,
} from '@amdlre/design-system';
import { loginSchema, type LoginFormData } from '@/lib/validations/auth';
import { loginAction } from '@/actions/auth';
import { Logo } from '@/components/shared/logo';

export function LoginForm() {
  const t = useTranslations('auth.login');
  const router = useRouter();
  const params = useParams<{ locale: string }>();
  const [pending, startTransition] = useTransition();
  const [serverError, setServerError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: { identifier: '', password: '' },
  });

  const onSubmit = (data: LoginFormData) => {
    setServerError(null);
    startTransition(async () => {
      const fd = new FormData();
      fd.append('identifier', data.identifier);
      fd.append('password', data.password);
      const result = await loginAction(fd);
      if (!result.success) {
        setServerError(result.message || t('error'));
        return;
      }
      const target = result.redirect || '/dashboard';
      router.push(`/${params.locale}${target}`);
      router.refresh();
    });
  };

  return (
    <Card className="card-premium w-full max-w-md p-12">
      <Stack gap={3} align="center" className="mb-10 text-center">
        <Logo size="lg" className="justify-center text-brand-black" />
        <Typography as="h1" variant="h1" className="text-3xl font-black tracking-tight text-brand-black">
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
        <Stack gap={5}>
          <Stack gap={2} className="text-right">
            <Label className="flex items-center justify-end gap-2 pr-2 text-[10px] font-black uppercase tracking-widest text-brand-slate">
              <Box as="span">{t('identifier')}</Box>
              <Mail size={12} />
            </Label>
            <Input
              type="text"
              placeholder={t('identifierPlaceholder')}
              className="input-base text-right"
              {...register('identifier')}
            />
            {errors.identifier ? (
              <Typography as="p" variant="small" className="text-xs font-bold text-red-500">
                {errors.identifier.message}
              </Typography>
            ) : null}
          </Stack>

          <Stack gap={2} className="text-right">
            <Label className="flex items-center justify-end gap-2 pr-2 text-[10px] font-black uppercase tracking-widest text-brand-slate">
              <Box as="span">{t('password')}</Box>
              <Lock size={12} />
            </Label>
            <Input
              type="password"
              placeholder={t('passwordPlaceholder')}
              className="input-base text-right"
              {...register('password')}
            />
            {errors.password ? (
              <Typography as="p" variant="small" className="text-xs font-bold text-red-500">
                {errors.password.message}
              </Typography>
            ) : null}
          </Stack>

          <Button
            type="submit"
            disabled={pending}
            rightIcon={<ArrowLeft size={18} />}
            className="mt-2 w-full rounded-2xl bg-brand-black py-5 text-sm font-black text-white shadow-xl hover:bg-brand-accent disabled:opacity-60"
          >
            {pending ? t('loading') : t('submit')}
          </Button>
        </Stack>
      </form>

      <Flex align="center" justify="center" gap={1} className="mt-8 text-center">
        <Typography as="span" variant="small" className="text-xs font-bold text-brand-slate">
          {t('noAccount')}
        </Typography>
        <Link
          href={`/${params.locale}/register`}
          className="text-xs font-black text-brand-accent hover:underline"
        >
          {t('register')}
        </Link>
      </Flex>
    </Card>
  );
}
