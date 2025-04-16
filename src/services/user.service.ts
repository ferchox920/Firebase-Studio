import { User } from '../models/user.entity';
import { logger } from '../utils/logger';
import bcrypt from 'bcrypt';

export const getAllUsers = async (): Promise<User[]> => {
  logger.info('Obteniendo todos los usuarios');
  return await User.find();
};

export const getUserById = async (id: string): Promise<User | null> => {
  logger.info(`Buscando usuario con ID ${id}`);
  return await User.findOneBy({ id });
};


export const createUser = async (data: {
  name: string;
  email: string;
  password: string;
  role: 'user' | 'admin';
}): Promise<User> => {
  logger.info(`Verificando si el email ya existe: ${data.email}`);

  const existingUser = await User.findOneBy({ email: data.email });
  if (existingUser) {
    const error = new Error('El correo electrónico ya está en uso');
    (error as any).status = 409;
    throw error;
  }

  logger.info(`Creando usuario con email ${data.email}`);

  const hashedPassword = await bcrypt.hash(data.password, 10);

  const user = User.create({
    name: data.name,
    email: data.email,
    password: hashedPassword,
    role: data.role,
    verified: false,
    otp: undefined,
  });

  return await user.save();
};


export const updateUser = async (id: string, data: Partial<User>): Promise<User | null> => {
  logger.info(`Actualizando usuario con ID ${id}`);
  const user = await User.findOneBy({ id });
  if (!user) return null;
  Object.assign(user, data);
  return await user.save();
};

export const deleteUser = async (id: string): Promise<boolean> => {
  logger.info(`Eliminando usuario con ID ${id}`);
  const result = await User.delete({ id });
  return result.affected !== 0;
};
