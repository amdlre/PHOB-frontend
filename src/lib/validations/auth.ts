import { z } from 'zod';

export const loginSchema = z.object({
  identifier: z.string().min(1, { message: 'البريد الإلكتروني أو رقم الجوال مطلوب' }),
  password: z.string().min(6, { message: 'كلمة المرور يجب أن تكون 6 أحرف على الأقل' }),
});

export const registerSchema = z
  .object({
    name: z.string().min(2, { message: 'الاسم يجب أن يكون حرفين على الأقل' }),
    email: z.string().email({ message: 'البريد الإلكتروني غير صالح' }),
    phone: z.string().min(8, { message: 'رقم الجوال غير صالح' }),
    password: z.string().min(8, { message: 'كلمة المرور يجب أن تكون 8 أحرف على الأقل' }),
    password_confirmation: z.string().min(1, { message: 'تأكيد كلمة المرور مطلوب' }),
  })
  .refine((d) => d.password === d.password_confirmation, {
    message: 'كلمة المرور غير متطابقة',
    path: ['password_confirmation'],
  });

export type LoginFormData = z.infer<typeof loginSchema>;
export type RegisterFormData = z.infer<typeof registerSchema>;
