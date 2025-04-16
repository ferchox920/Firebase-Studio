import { User } from '../models/user.entity';
import bcrypt from 'bcryptjs';
import { generateToken } from '../utils/jwt';
import { logger } from '../utils/logger';

export const login = async (email: string, password: string) => {
  const user = await User.findOneBy({ email });
  if (!user) throw new Error('Credenciales inválidas');

  const match = await bcrypt.compare(password, user.password);
  if (!match) throw new Error('Credenciales inválidas');

  if (!user.verified) {
    throw new Error('Tu correo aún no ha sido verificado. Revisa tu bandeja de entrada.');
  }

  const token = generateToken({ id: user.id, email: user.email });

  // 🔥 Evitamos exponer password y otp
  const { password: _pw, otp, ...safeUser } = user;

  return { user: safeUser, token };
};

export const verifyEmail = async (email: string, otp: string): Promise<boolean> => {
  logger.info(`Verificando email ${email} con OTP ${otp}`);

  const user = await User.findOneBy({ email });

  if (!user || user.verified || user.otp !== otp) {
    return false;
  }

  user.verified = true;
  user.otp = '';

  await user.save();
  logger.info(`Usuario ${email} verificado correctamente`);

  return true;
};
