import { Router } from 'express';
import asyncHandler from 'express-async-handler';
import * as userController from '../controllers/user.controller';

const router = Router();

// Rutas CRUD organizadas
router.get('/', asyncHandler(userController.getAllUsers));
router.get('/:id', asyncHandler(userController.getUserById));
router.post('/', asyncHandler(userController.createUser));
router.put('/:id', asyncHandler(userController.updateUser));
router.delete('/:id', asyncHandler(userController.deleteUser));

export default router;
