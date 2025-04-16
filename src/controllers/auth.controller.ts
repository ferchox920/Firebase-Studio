import { NextFunction, Request, Response } from 'express';
import * as authService from '../services/auth.service';
import { logger } from '../utils/logger';

export const login = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const { email, password } = req.body;
        const { user, token } = await authService.login(email, password);
        res.json({ user, token });
        return
    } catch (error) {
        logger.error('Error al actualizar usuario', error);
        next(error);
    }
};
