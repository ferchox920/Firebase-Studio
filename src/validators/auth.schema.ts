import { z } from 'zod';

export const loginSchema = z.object({
  email: z.string().email('Email inválido'),
  password: z.string().min(6, 'La contraseña debe tener al menos 6 caracteres'),
});

export const verifySchema = z.object({
  email: z.string().email('Email inválido'),
  otp: z.string().length(6, 'El código debe tener exactamente 6 dígitos'),
});
