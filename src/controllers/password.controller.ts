import { NextFunction, Request, Response } from 'express';
import { requestPasswordResetService, resetPassword } from '../services/password.service';
import { requestResetSchema, resetPasswordSchema } from '../validators/password.schema';
import { logger } from '../utils/logger';

export const requestResetController = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email } = requestResetSchema.parse(req.body);
    await requestPasswordResetService(email);
    res.status(200).json({ message: 'Si existe una cuenta con ese email, se ha enviado un código' });
  } catch (error) {
    logger.error('Error solicitando recuperación de contraseña', error);
    next(error);
  }
};

export const resetPasswordController = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email, otp, newPassword } = resetPasswordSchema.parse(req.body);
    await resetPassword(email, otp, newPassword);
    res.status(200).json({ message: 'Contraseña actualizada correctamente' });
  } catch (error) {
    logger.error('Error restableciendo contraseña', error);
    next(error);
  }
};