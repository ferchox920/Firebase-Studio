import { Request, Response } from 'express';
import * as authService from '../services/auth.service';
import { loginSchema } from '../validators/auth.schema';
import { logger } from '../utils/logger';

export const login = async (req: Request, res: Response): Promise<Response> => {
  try {
    const { email, password } = loginSchema.parse(req.body); 

    const { user, token } = await authService.login(email, password);

    return res.json({ user, token });
  } catch (error: any) {
    if (error.name === 'ZodError') {
      return res.status(400).json({ error: error.errors });
    }

    logger.error('Error en login', error);
    return res.status(401).json({ error: error.message || 'Credenciales inválidas' });
  }
};
