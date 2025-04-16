import { Request, Response, NextFunction } from 'express';
import * as userService from '../services/user.service';
import { logger } from '../utils/logger';
import { createUserSchema, idParamSchema, updateUserSchema } from '../validators/user.schema';

export const getAllUsers = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const users = await userService.getAllUsers();
    res.json(users);
  } catch (error) {
    logger.error('Error al obtener usuarios', error);
    next(error); // Propagamos el error
  }
};

export const getUserById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { id } = idParamSchema.parse(req.params); // ✅ validamos UUID

    const user = await userService.getUserById(id);
    if (!user) {
      res.status(404).json({ error: 'Usuario no encontrado' });
      return;
    }
    res.json(user);
  } catch (error: any) {
    if (error.name === 'ZodError') {
      res.status(400).json({ error: error.errors });
    }

    logger.error('Error al obtener usuario por ID', error);
    next(error);
  }
};

export const createUser = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const validatedData = createUserSchema.parse(req.body); // 👈 validación estricta

    const newUser = await userService.createUser(validatedData);
    res.status(201).json(newUser);
  } catch (error: any) {
    if (error.name === 'ZodError') {
      res.status(400).json({ error: error.errors });
    }

    logger.error('Error al crear usuario', error);
    next(error);
  }
};

export const updateUser = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { id } = idParamSchema.parse(req.params); // ✅ validamos UUID
    const data = updateUserSchema.parse(req.body);  // ✅ validamos los campos opcionales

    const updatedUser = await userService.updateUser(id, data);
    if (!updatedUser) {
      res.status(404).json({ error: 'Usuario no encontrado' });
      return;
    }
    res.json(updatedUser);
  } catch (error: any) {
    if (error.name === 'ZodError') {
      res.status(400).json({ error: error.errors });
    }

    logger.error('Error al actualizar usuario', error);
    next(error);
  }
};
export const deleteUser = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { id } = idParamSchema.parse(req.params); // ✅ validamos UUID

    const deleted = await userService.deleteUser(id);
    if (!deleted) {
      res.status(404).json({ error: 'Usuario no encontrado' });
      return;
    }
    res.json({ message: 'Usuario eliminado correctamente' });
  } catch (error: any) {
    if (error.name === 'ZodError') {
      res.status(400).json({ error: error.errors });
    }

    logger.error('Error al eliminar usuario', error);
    next(error);
  }
};