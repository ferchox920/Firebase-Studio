import { User } from '../models/user.entity';
import { PasswordReset } from '../models/passwordReset.entity';
import { sendVerificationEmail } from '../mails/sendVerificationEmail';
import crypto from 'crypto';
import { logger } from '../utils/logger';
import bcrypt from 'bcrypt';
import AppDataSource from '../config/data-source';

export const requestPasswordResetService = async (email: string): Promise<void> => {
  const user = await User.findOneBy({ email });
  if (!user) return;

  const otp = crypto.randomInt(100000, 999999).toString();

  const record = PasswordReset.create({
    user,
    otp,
  });

  await record.save();
  await sendVerificationEmail(user.email, otp);
};

export const resetPassword = async (
  email: string,
  otp: string,
  newPassword: string
): Promise<void> => {
  logger.info(`Intentando restablecer contraseña para ${email}`);

  const resetRequest = await AppDataSource
    .getRepository(PasswordReset)
    .createQueryBuilder('reset')
    .leftJoinAndSelect('reset.user', 'user')
    .where('user.email = :email', { email })
    .andWhere('reset.otp = :otp', { otp })
    .getOne();

  if (!resetRequest) {
    throw new Error('Código de recuperación inválido');
  }

  const isExpired = resetRequest.expires_at < new Date();
  if (isExpired) {
    await PasswordReset.delete({ id: resetRequest.id });
    throw new Error('El código ha expirado');
  }

  const user = resetRequest.user;
  const hashedPassword = await bcrypt.hash(newPassword, 10);

  user.password = hashedPassword;
  user.verified = true;
  await user.save();

  await PasswordReset.delete({ id: resetRequest.id });

  logger.info(`Contraseña actualizada correctamente para ${email}`);
};
