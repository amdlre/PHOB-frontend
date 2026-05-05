'use server';

import { revalidatePath } from 'next/cache';
import { api, ApiException } from '@/lib/api/fetcher';
import { ENDPOINTS } from '@/lib/api/endpoints';
import { subscriptionSchema } from '@/lib/validations/subscription';
import type { Subscription } from '@/types/domain';
import type { ActionResult } from './auth';

export async function createSubscriptionAction(input: {
  property_id: string;
  package_id: 'studio' | 'one_br' | 'two_br' | 'basic' | 'standard' | 'premium';
  start_date: string;
  end_date: string;
  is_renewal?: boolean;
}): Promise<ActionResult & { subscription?: Subscription }> {
  const parsed = subscriptionSchema.safeParse(input);
  if (!parsed.success) {
    return {
      success: false,
      errors: parsed.error.flatten().fieldErrors as Record<string, string[]>,
    };
  }

  // Business rule: new property must have start_date >= today + 3 days
  const start = new Date(parsed.data.start_date);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  if (!parsed.data.is_renewal) {
    const minStart = new Date(today.getTime() + 3 * 24 * 60 * 60 * 1000);
    if (start < minStart) {
      return {
        success: false,
        message: 'للوحدات الجديدة يجب أن يكون تاريخ البدء بعد 3 أيام على الأقل من اليوم',
      };
    }
  } else {
    const tomorrow = new Date(today.getTime() + 24 * 60 * 60 * 1000);
    if (start < tomorrow) {
      return {
        success: false,
        message: 'الاشتراك المجدد يبدأ من اليوم التالي على الأقل',
      };
    }
  }

  try {
    const res = await api.post<Subscription>(ENDPOINTS.subscriptions.create, parsed.data);
    revalidatePath('/subscriptions');
    revalidatePath('/dashboard');
    return { success: true, subscription: res.data, redirect: '/subscriptions' };
  } catch (err) {
    if (err instanceof ApiException) {
      return { success: false, message: err.message, errors: err.errors };
    }
    return { success: false, message: 'حدث خطأ غير متوقع' };
  }
}

export async function updateSubscriptionAction(
  id: string,
  input: {
    package_id?: 'studio' | 'one_br' | 'two_br' | 'basic' | 'standard' | 'premium';
    start_date?: string;
    end_date?: string;
  },
): Promise<ActionResult & { subscription?: Subscription }> {
  try {
    const res = await api.patch<Subscription>(ENDPOINTS.subscriptions.update(id), input);
    revalidatePath('/subscriptions');
    revalidatePath(`/subscriptions/${id}`);
    return { success: true, subscription: res.data };
  } catch (err) {
    if (err instanceof ApiException) return { success: false, message: err.message };
    return { success: false, message: 'حدث خطأ غير متوقع' };
  }
}

export async function deleteSubscriptionAction(id: string): Promise<ActionResult> {
  try {
    await api.delete(ENDPOINTS.subscriptions.delete(id));
    revalidatePath('/subscriptions');
    revalidatePath('/dashboard');
    return { success: true };
  } catch (err) {
    if (err instanceof ApiException) return { success: false, message: err.message };
    return { success: false, message: 'حدث خطأ غير متوقع' };
  }
}
