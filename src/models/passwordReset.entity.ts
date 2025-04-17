// src/models/passwordReset.entity.ts
import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { User } from './user.entity';

@Entity('password_resets')
export class PasswordReset extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => User, (user) => user.passwordResets, { onDelete: 'CASCADE' })
  user: User;

  @Column()
  otp: string;

  @CreateDateColumn()
  createdAt: Date;

  @Column({ type: 'timestamp', default: () => "NOW() + INTERVAL '10 minutes'" })
  expires_at: Date;
}
