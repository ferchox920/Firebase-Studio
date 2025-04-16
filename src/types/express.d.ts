import { Request } from 'express';

declare global {
  namespace Express {
    interface Request {
      user?: any; // Podés tipar esto mejor si sabés la estructura del payload del JWT
    }
  }
}
