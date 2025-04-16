import { NextFunction, Request, Response } from 'express';
import * as authService from '../services/auth.service';
import { loginSchema, verifySchema } from '../validators/auth.schema';
import { logger } from '../utils/logger';

export const login = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { email, password } = loginSchema.parse(req.body);
    const { user, token } = await authService.login(email, password);
    res.json({ user, token });
  } catch (error: any) {
    if (error.name === 'ZodError') {
      res.status(400).json({ error: error.errors });
    } else {
      res.status(401).json({ error: error.message || 'Credenciales inválidas' });
    }
    logger.error('Error en login', error);
    next(error);
  }
};

export const verifyEmail = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { email, otp } = verifySchema.parse(req.body);
    const result = await authService.verifyEmail(email, otp);

    if (!result) {
      res.status(400).json({ error: 'OTP inválido o usuario no encontrado' });
      return;
    }

    res.json({ message: 'Correo verificado con éxito' });
  } catch (error: any) {
    if (error.name === 'ZodError') {
      res.status(400).json({ error: error.errors });
    } else {
      res.status(500).json({ error: 'Error interno del servidor' });
    }
    logger.error('Error verificando correo', error);
    next(error);
  }
};
