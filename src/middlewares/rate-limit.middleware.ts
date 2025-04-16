import rateLimit from 'express-rate-limit';

export const rateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 100, // máx. 100 requests por IP
  standardHeaders: true,
  legacyHeaders: false,
});
