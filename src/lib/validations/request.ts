import { z } from 'zod';

export const cleaningRequestSchema = z.object({
  property_id: z.string().min(1, { message: 'يجب اختيار وحدة' }),
  scheduled_at: z.string().min(1, { message: 'يجب تحديد موعد الزيارة' }),
  cleaning_type: z.enum(['regular', 'deep', 'checkout']).default('checkout'),
  notes: z.string().optional(),
});

export type CleaningRequestFormData = z.infer<typeof cleaningRequestSchema>;

export const visitReportSchema = z.object({
  rooms_done: z.boolean().default(false),
  kitchen_done: z.boolean().default(false),
  bathrooms_done: z.boolean().default(false),
  linens_done: z.boolean().default(false),
  before_images: z.array(z.string()).default([]),
  after_images: z.array(z.string()).default([]),
  general_notes: z.string().optional(),
  damage_notes: z.string().optional(),
  maintenance_notes: z.string().optional(),
  items_missing: z.boolean().default(false),
  missing_description: z.string().optional(),
  missing_images: z.array(z.string()).optional(),
});

export type VisitReportFormData = z.infer<typeof visitReportSchema>;
