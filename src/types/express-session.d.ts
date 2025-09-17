import { SessionData } from 'express-session';

declare module 'express' {
  interface Request {
    session: SessionData & {
      cart?: { id: number; quantity: number }[];
    };
  }
}