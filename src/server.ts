// src/server.ts
import 'reflect-metadata';
import app from './app';
import { logger } from './utils/logger';
import AppDataSource from './config/data-source';

const PORT = process.env.PORT || 3000;

async function bootstrap() {
  try {
    await AppDataSource.initialize();
    logger.info('📦 Conectado a la base de datos');

    app.listen(PORT, () => {
      logger.info(`🚀 Servidor corriendo en http://localhost:${PORT}`);
    });
  } catch (error) {
    logger.error('❌ No se pudo inicializar la base de datos', error);
    process.exit(1);
  }
}

bootstrap();
