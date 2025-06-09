
import * as z from 'zod';

export const userFormSchema = z.object({
  name: z.string().min(2, 'El nombre debe tener al menos 2 caracteres'),
  email: z.string().email('Correo electrónico inválido'),
  cc: z.string().min(1, 'La cédula es requerida'),
  password: z
    .string()
    .min(6, 'La contraseña debe tener al menos 6 caracteres')
    .optional(),
  role: z.enum(['ADMIN', 'DEV', 'MED']),
  status: z.enum(['active', 'inactive']),
});

export type UserFormValues = z.infer<typeof userFormSchema>;
