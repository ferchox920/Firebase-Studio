import 'reflect-metadata';
import { DataSource } from 'typeorm';
import { User } from '../models/user.entity';
import { PasswordReset } from '../models/passwordReset.entity'; 
import dotenv from 'dotenv';

dotenv.config();

const AppDataSource = new DataSource({
  type: 'postgres',
  url: process.env.DATABASE_URL,
  synchronize: false,
  logging: false,
  entities: [User, PasswordReset],
  migrations: ['dist/migrations/*.js'],
});

export default AppDataSource;

