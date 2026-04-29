import { z } from 'zod';

export const subscriptionSchema = z
  .object({
    property_id: z.string().min(1, { message: 'يجب اختيار وحدة' }),
    package_id: z.enum(['studio', 'one_br', 'two_br', 'basic', 'standard', 'premium']),
    start_date: z.string().min(1, { message: 'تاريخ البداية مطلوب' }),
    end_date: z.string().min(1, { message: 'تاريخ الانتهاء مطلوب' }),
    is_renewal: z.boolean().default(false),
  })
  .refine((d) => new Date(d.end_date) > new Date(d.start_date), {
    message: 'تاريخ الانتهاء يجب أن يكون بعد تاريخ البداية',
    path: ['end_date'],
  });

export type SubscriptionFormData = z.infer<typeof subscriptionSchema>;
