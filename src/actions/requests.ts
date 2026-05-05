'use server';

import { revalidatePath } from 'next/cache';
import { api, ApiException } from '@/lib/api/fetcher';
import { ENDPOINTS } from '@/lib/api/endpoints';
import { cleaningRequestSchema } from '@/lib/validations/request';
import type { CleaningRequest, RequestStatus } from '@/types/domain';
import type { ActionResult } from './auth';

export async function createCleaningRequestAction(input: {
  property_id: string;
  scheduled_at: string;
  cleaning_type?: 'regular' | 'deep' | 'checkout';
  notes?: string;
}): Promise<ActionResult & { request?: CleaningRequest }> {
  const parsed = cleaningRequestSchema.safeParse(input);
  if (!parsed.success) {
    return {
      success: false,
      errors: parsed.error.flatten().fieldErrors as Record<string, string[]>,
    };
  }

  // Business rule: at least 12 hours in advance
  const scheduledAt = new Date(parsed.data.scheduled_at);
  const minTime = new Date(Date.now() + 12 * 60 * 60 * 1000);
  if (scheduledAt < minTime) {
    return { success: false, message: 'لا يمكن الطلب قبل 12 ساعة من الموعد' };
  }

  try {
    const res = await api.post<CleaningRequest>(ENDPOINTS.requests.create, parsed.data);
    revalidatePath('/requests');
    revalidatePath('/dashboard');
    return { success: true, request: res.data, redirect: '/requests' };
  } catch (err) {
    if (err instanceof ApiException) {
      // Backend may return localized errors for "already exists" / "no active sub"
      return { success: false, message: err.message, errors: err.errors };
    }
    return { success: false, message: 'حدث خطأ غير متوقع' };
  }
}

export async function updateRequestStatusAction(
  id: string,
  status: RequestStatus,
): Promise<ActionResult> {
  try {
    await api.patch(ENDPOINTS.requests.updateStatus(id), { status });
    revalidatePath(`/requests/${id}`);
    revalidatePath('/requests');
    return { success: true };
  } catch (err) {
    if (err instanceof ApiException) return { success: false, message: err.message };
    return { success: false, message: 'حدث خطأ غير متوقع' };
  }
}

export async function confirmGuestCheckoutAction(id: string): Promise<ActionResult> {
  try {
    await api.post(ENDPOINTS.requests.confirmGuest(id));
    revalidatePath(`/requests/${id}`);
    return { success: true };
  } catch (err) {
    if (err instanceof ApiException) return { success: false, message: err.message };
    return { success: false, message: 'حدث خطأ غير متوقع' };
  }
}

export async function updateCleaningRequestAction(
  id: string,
  input: {
    scheduled_at?: string;
    cleaning_type?: 'regular' | 'deep' | 'checkout';
    notes?: string;
  },
): Promise<ActionResult & { request?: CleaningRequest }> {
  try {
    const res = await api.patch<CleaningRequest>(ENDPOINTS.requests.update(id), input);
    revalidatePath('/requests');
    revalidatePath(`/requests/${id}`);
    return { success: true, request: res.data };
  } catch (err) {
    if (err instanceof ApiException) return { success: false, message: err.message };
    return { success: false, message: 'حدث خطأ غير متوقع' };
  }
}

export async function deleteCleaningRequestAction(id: string): Promise<ActionResult> {
  try {
    await api.delete(ENDPOINTS.requests.delete(id));
    revalidatePath('/requests');
    revalidatePath('/dashboard');
    return { success: true };
  } catch (err) {
    if (err instanceof ApiException) return { success: false, message: err.message };
    return { success: false, message: 'حدث خطأ غير متوقع' };
  }
}
