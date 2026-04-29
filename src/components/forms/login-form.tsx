'use client';

import { useState, useTransition } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter, useParams } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { ArrowLeft, Lock, Mail } from 'lucide-react';
import Link from 'next/link';
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
    <div className="card-premium w-full max-w-md p-12">
      <div className="mb-10 space-y-3 text-center">
        <Logo size="lg" className="justify-center text-brand-black" />
        <h1 className="text-3xl font-black tracking-tight text-brand-black">{t('title')}</h1>
        <p className="text-[10px] font-black uppercase tracking-[0.2em] text-brand-slate">
          {t('subtitle')}
        </p>
      </div>

      {serverError && (
        <div className="mb-6 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-bold text-red-600">
          {serverError}
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        <div className="space-y-2 text-right">
          <label className="flex items-center justify-end gap-2 pr-2 text-[10px] font-black uppercase tracking-widest text-brand-slate">
            <span>{t('identifier')}</span>
            <Mail size={12} />
          </label>
          <input
            type="text"
            placeholder={t('identifierPlaceholder')}
            className="input-base text-right"
            {...register('identifier')}
          />
          {errors.identifier && (
            <p className="text-xs font-bold text-red-500">{errors.identifier.message}</p>
          )}
        </div>

        <div className="space-y-2 text-right">
          <label className="flex items-center justify-end gap-2 pr-2 text-[10px] font-black uppercase tracking-widest text-brand-slate">
            <span>{t('password')}</span>
            <Lock size={12} />
          </label>
          <input
            type="password"
            placeholder={t('passwordPlaceholder')}
            className="input-base text-right"
            {...register('password')}
          />
          {errors.password && (
            <p className="text-xs font-bold text-red-500">{errors.password.message}</p>
          )}
        </div>

        <button
          type="submit"
          disabled={pending}
          className="mt-2 flex w-full items-center justify-center gap-2 rounded-2xl bg-brand-black py-5 text-sm font-black text-white shadow-xl transition-all hover:bg-brand-accent active:scale-95 disabled:opacity-60"
        >
          <span>{pending ? t('loading') : t('submit')}</span>
          <ArrowLeft size={18} />
        </button>
      </form>

      <p className="mt-8 text-center text-xs font-bold text-brand-slate">
        {t('noAccount')}{' '}
        <Link href={`/${params.locale}/register`} className="font-black text-brand-accent hover:underline">
          {t('register')}
        </Link>
      </p>
    </div>
  );
}
