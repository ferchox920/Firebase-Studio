import { z } from 'zod';

export const requestResetSchema = z.object({
  email: z.string().email('Email inválido'),
});

export const resetPasswordSchema = z.object({
  email: z.string().email('Email inválido'),
  otp: z.string().length(6, 'El código debe tener 6 dígitos'),
  newPassword: z.string().min(6, 'La nueva contraseña debe tener al menos 6 caracteres'),
});
