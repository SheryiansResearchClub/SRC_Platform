import type { NextFunction, Request, Response } from "@/types";
import { sendError } from "@/utils/response";

export const notFoundHandler = (
  req: Request,
  res: Response,
  _next: NextFunction
): Response => {
  return sendError(res, 'NOT_FOUND', `Route ${req.originalUrl} not found`, 404);
};