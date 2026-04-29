'use server';

import { revalidatePath } from 'next/cache';
import { api, ApiException } from '@/lib/api/fetcher';
import { ENDPOINTS } from '@/lib/api/endpoints';
import { visitReportSchema } from '@/lib/validations/request';
import type { VisitReport } from '@/types/domain';
import type { ActionResult } from './auth';

export async function uploadVisitReportAction(
  requestId: string,
  input: {
    rooms_done?: boolean;
    kitchen_done?: boolean;
    bathrooms_done?: boolean;
    linens_done?: boolean;
    before_images?: string[];
    after_images?: string[];
    general_notes?: string;
    damage_notes?: string;
    maintenance_notes?: string;
    items_missing?: boolean;
    missing_description?: string;
    missing_images?: string[];
  },
): Promise<ActionResult & { report?: VisitReport }> {
  const parsed = visitReportSchema.safeParse({
    rooms_done: !!input.rooms_done,
    kitchen_done: !!input.kitchen_done,
    bathrooms_done: !!input.bathrooms_done,
    linens_done: !!input.linens_done,
    before_images: input.before_images ?? [],
    after_images: input.after_images ?? [],
    general_notes: input.general_notes,
    damage_notes: input.damage_notes,
    maintenance_notes: input.maintenance_notes,
    items_missing: !!input.items_missing,
    missing_description: input.missing_description,
    missing_images: input.missing_images,
  });
  if (!parsed.success) {
    return {
      success: false,
      errors: parsed.error.flatten().fieldErrors as Record<string, string[]>,
    };
  }

  try {
    const res = await api.post<VisitReport>(ENDPOINTS.reports.upload(requestId), parsed.data);
    revalidatePath(`/requests/${requestId}`);
    return { success: true, report: res.data };
  } catch (err) {
    if (err instanceof ApiException) {
      return { success: false, message: err.message, errors: err.errors };
    }
    return { success: false, message: 'حدث خطأ غير متوقع' };
  }
}
