import type { Request, Response, NextFunction } from "express";
import { NotFoundError } from "../errors/app-error.js";

/**
 * Handles all unmatched routes, returning a standard 404 AppError.
 */
export function notFoundHandler(
  req: Request,
  _res: Response,
  next: NextFunction
): void {
  next(new NotFoundError(`Route ${req.method} ${req.originalUrl} not found`));
}
