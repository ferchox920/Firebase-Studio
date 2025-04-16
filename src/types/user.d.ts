// src/types/user.d.ts
export interface User {
    id: string;            // UUID
    name: string;
    email: string;
    password: string;
    role: 'user' | 'admin'; // o string si preferís libre
    verified: boolean;
    otp: string | null;     // código de verificación o null
  }
  