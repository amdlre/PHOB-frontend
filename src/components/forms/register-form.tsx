'use client';

import { useState, useTransition } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter, useParams } from 'next/navigation';
import { useTranslations } from 'next-intl';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
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
    <div className="card-premium w-full max-w-md p-10">
      <div className="mb-8 space-y-3 text-center">
        <Logo size="lg" className="justify-center text-brand-black" />
        <h1 className="text-2xl font-black tracking-tight text-brand-black">{t('title')}</h1>
        <p className="text-[10px] font-black uppercase tracking-[0.2em] text-brand-slate">
          {t('subtitle')}
        </p>
      </div>

      {serverError && (
        <div className="mb-6 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-bold text-red-600">
          {serverError}
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
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
            const err = errors[field]?.message;
            return (
              <div key={field} className="space-y-2 text-right">
                <label className="block pr-2 text-[10px] font-black uppercase tracking-widest text-brand-slate">
                  {label}
                </label>
                <input
                  type={type}
                  placeholder={placeholder}
                  className="input-base text-right"
                  {...register(field)}
                />
                {err && <p className="text-xs font-bold text-red-500">{err}</p>}
              </div>
            );
          },
        )}

        <button
          type="submit"
          disabled={pending}
          className="mt-2 flex w-full items-center justify-center gap-2 rounded-2xl bg-brand-black py-5 text-sm font-black text-white shadow-xl transition-all hover:bg-brand-accent active:scale-95 disabled:opacity-60"
        >
          <span>{pending ? t('loading') : t('submit')}</span>
          <ArrowLeft size={18} />
        </button>
      </form>

      <p className="mt-6 text-center text-xs font-bold text-brand-slate">
        {t('hasAccount')}{' '}
        <Link href={`/${params.locale}/login`} className="font-black text-brand-accent hover:underline">
          {t('login')}
        </Link>
      </p>
    </div>
  );
}
