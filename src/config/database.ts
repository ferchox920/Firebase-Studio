import { DataSource } from 'typeorm';
import dotenv from 'dotenv';
import { User } from '../models/user.entity';

dotenv.config();

export const AppDataSource = new DataSource({
  type: 'postgres',
  url: process.env.DATABASE_URL,
  synchronize: true,
  logging: false,
  entities: [User],
  migrations: [],
  subscribers: [],
});

AppDataSource.initialize()
  .then(() => console.log('📦 Conectado con TypeORM a PostgreSQL'))
  .catch((error) => console.error('Error conectando TypeORM:', error));
