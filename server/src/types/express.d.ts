import type { UserDocument } from '@/types';
export type { Application, NextFunction, Request, Response, CookieOptions } from "express"

declare global {
  namespace Express {
    interface User extends UserDocument { }

    interface Request {
      user?: UserDocument;
    }
  }
}