import { Router } from 'express';
import { login, verifyEmail } from '../controllers/auth.controller';

const router = Router();

router.post('/login', login);
router.post('/verify', verifyEmail); // ✅ ruta de verificación OTP

export default router;
