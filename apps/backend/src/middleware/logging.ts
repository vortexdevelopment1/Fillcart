import { pinoHttp } from "pino-http";
import type { RequestHandler, Request, Response } from "express";
import { getLogger } from "../utils/logger.js";
import type { AppConfig } from "../config/env.schema.js";

/**
 * Creates pino-http middleware that binds the request logger.
 * Configured to use req.id assigned by requestIdMiddleware.
 */
export function createLoggingMiddleware(config: AppConfig): RequestHandler {
  const logger = getLogger(config);

  return pinoHttp({
    logger,
    genReqId: (req: Request) => {
      // Use the UUID already assigned by requestIdMiddleware
      return (req as Request & { id?: string }).id || "unknown";
    },
    customLogLevel: (_req, res, err) => {
      if (res.statusCode >= 500 || err) return "error";
      if (res.statusCode >= 400) return "warn";
      return "info";
    },
    // Exclude logging of bodies by default for safety
    serializers: {
      req: (req: Request) => ({
        id: (req as Request & { id?: string }).id,
        method: req.method,
        url: req.url,
      }),
      res: (res: Response) => ({
        statusCode: res.statusCode,
      }),
    },
  }) as unknown as RequestHandler;
}
