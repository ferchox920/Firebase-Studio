import express from 'express';
import userRoutes from './routes/user.routes';0
import authRoutes from './routes/auth.routes';
import dotenv from 'dotenv';
import { json } from 'body-parser';

import { errorHandler } from './middlewares/error.middleware';
import { rateLimiter } from './middlewares/rate-limit.middleware';
import { corsOptions } from './middlewares/cors.middleware';
import { securityHeaders } from './middlewares/security.middleware';

dotenv.config();

const app = express();

app.use(securityHeaders);
app.use(corsOptions);
app.use(rateLimiter);
app.use(json());

app.use('/api/users', userRoutes);
app.use('/api/auth', authRoutes);

app.get('/', (_, res) => {
  res.send('API funcionando 🚀');
});

app.use(errorHandler);

export default app;
