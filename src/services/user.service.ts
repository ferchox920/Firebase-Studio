import { User } from '../models/user.entity';
import { logger } from '../utils/logger';

export const getAllUsers = async (): Promise<User[]> => {
  logger.info('Obteniendo todos los usuarios');
  return await User.find();
};

export const getUserById = async (id: string): Promise<User | null> => {
  logger.info(`Buscando usuario con ID ${id}`);
  return await User.findOneBy({ id });
};

export const createUser = async (data: Partial<User>): Promise<User> => {
  logger.info(`Creando usuario con email ${data.email}`);
  const user = User.create(data as User);
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
