import { Router } from 'express';
import asyncHandler from 'express-async-handler';
import { requestResetController, resetPasswordController } from '../controllers/password.controller';

const router = Router();

router.post('/reset-password', asyncHandler(requestResetController));
router.post('/reset-password', asyncHandler(resetPasswordController));

export default router;
