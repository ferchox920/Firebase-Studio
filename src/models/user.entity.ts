// src/models/user.entity.ts
import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    BaseEntity
  } from 'typeorm';
  
  @Entity({ name: 'users' })
  export class User extends BaseEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string;
  
    @Column()
    name: string;
  
    @Column({ unique: true })
    email: string;
  
    @Column()
    password: string;
  
    @Column()
    role: 'user' | 'admin';
  
    @Column({ default: false })
    verified: boolean;
  
    @Column({ nullable: true })
    otp: string;
  }
  