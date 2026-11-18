import type { Request, Response, NextFunction } from "express";
import { AppError } from "../errors/app-error.js";
import { ERROR_CODES } from "../constants/error-codes.js";
import { getLogger } from "../utils/logger.js";

/**
 * Central Express error-handling middleware.
 * Maps operational AppErrors (like 400 ValidationError, 404 NotFoundError)
 * and classifies internal Zod/unexpected runtime errors to HTTP 500 INTERNAL_SERVER_ERROR.
 */
export function errorHandler(
  err: unknown,
  req: Request,
  res: Response,
  _next: NextFunction
): void {
  const logger = getLogger();
  const requestId =
    (req as Request & { id?: string }).id ||
    (res.getHeader("x-request-id") as string) ||
    "unknown";

  // Check if it's an operational AppError
  if (err instanceof AppError) {
    if (err.statusCode >= 500) {
      logger.error({ err, requestId }, `Operational error: ${err.message}`);
    } else {
      logger.warn({ err, requestId }, `Client error: ${err.message}`);
    }

    res.status(err.statusCode).json({
      error: {
        code: err.code,
        message: err.message,
        requestId,
        ...(err.details && err.details.length > 0 ? { details: err.details } : {}),
      },
    });
    return;
  }

  // Any non-AppError (including internal unexpected Zod errors or runtime exceptions)
  // is treated as an unexpected internal error (HTTP 500). Stack traces are never leaked.
  logger.error({ err, requestId }, "Unhandled internal server error");

  res.status(500).json({
    error: {
      code: ERROR_CODES.INTERNAL_SERVER_ERROR,
      message: "An internal server error occurred",
      requestId,
    },
  });
}
