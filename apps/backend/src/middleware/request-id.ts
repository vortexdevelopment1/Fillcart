import { randomUUID } from "node:crypto";
import type { Request, Response, NextFunction } from "express";

/**
 * UUID validation regex conforming to RFC-4122 and RFC-9562
 * (versions 1 through 8, including v1, v4, v7).
 */
export const UUID_REGEX =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

export function isValidUuid(id: unknown): id is string {
  if (typeof id !== "string") return false;
  return UUID_REGEX.test(id);
}

/**
 * Middleware that inspects incoming x-request-id header.
 * If present and valid UUID, preserves it.
 * If absent, empty, malformed, or oversized, generates a new RFC-4122 v4 UUID.
 * Sets req.id and x-request-id response header.
 */
export function requestIdMiddleware(
  req: Request,
  res: Response,
  next: NextFunction
): void {
  const incoming = req.header("x-request-id");
  const validId = isValidUuid(incoming) ? incoming : randomUUID();

  // Attach to Express request
  (req as Request & { id: string }).id = validId;

  // Set on outgoing response header
  res.setHeader("x-request-id", validId);

  next();
}
