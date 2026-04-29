import { z } from 'zod';

export const propertySchema = z.object({
  building_name: z.string().min(2, { message: 'اسم العمارة مطلوب' }),
  floor_number: z.string().optional(),
  unit_number: z.string().optional(),
  door_code: z.string().optional(),
  address: z.string().optional(),
  lat: z.number().optional(),
  lng: z.number().optional(),
  images: z.array(z.string()).default([]),
});

export type PropertyFormData = z.infer<typeof propertySchema>;
