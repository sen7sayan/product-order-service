// src/types/express.d.ts
import { Request } from 'express';

declare global {
  namespace Express {
    interface User {
      id: string;
      email: string;
    }

    interface Request {
      user?: User;
    }
  }
}
