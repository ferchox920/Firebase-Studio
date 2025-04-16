import { User } from '../models/user.entity';
import bcrypt from 'bcryptjs';
import { generateToken } from '../utils/jwt';

export const login = async (email: string, password: string) => {
  const user = await User.findOneBy({ email });
  if (!user) throw new Error('Credenciales inválidas');

  const match = await bcrypt.compare(password, user.password);
  if (!match) throw new Error('Credenciales inválidas');

  if (!user.verified) throw new Error('Usuario no verificado');

  const token = generateToken({ id: user.id, email: user.email });
  return { user, token };
};
