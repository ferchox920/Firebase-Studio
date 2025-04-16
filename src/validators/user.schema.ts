import { z } from 'zod';

export const createUserSchema = z.object({
  name: z.string().min(1, 'El nombre es obligatorio'),
  email: z.string().email('Email inválido'),
  password: z.string().min(6, 'La contraseña debe tener al menos 6 caracteres'),
  role: z.enum(['user', 'admin']),
});

export const updateUserSchema = z.object({
  name: z.string().min(1).optional(),
  email: z.string().email().optional(),
  password: z.string().min(6).optional(),
  role: z.enum(['user', 'admin']).optional(),
});

export const idParamSchema = z.object({
  id: z.string().uuid('ID inválido'),
});
