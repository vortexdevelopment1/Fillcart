import { Router, type Request, type Response } from "express";
import { getPrismaClient, checkDatabaseReadiness } from "../database/index.js";
import { type AppConfig } from "../config/env.schema.js";

export function createReadyRouter(config: AppConfig): Router {
  const router = Router();
  const prisma = getPrismaClient(config);

  router.get("/", async (_req: Request, res: Response): Promise<void> => {
    const result = await checkDatabaseReadiness(prisma);

    if (result.ok) {
      res.status(200).json({
        status: "ready",
        database: "connected",
        timestamp: new Date().toISOString(),
      });
      return;
    }

    // Degraded: return generic message with zero credentials or internal SQL errors exposed
    res.status(503).json({
      status: "degraded",
      database: "disconnected",
      message: "Database service is temporarily unavailable",
      timestamp: new Date().toISOString(),
    });
  });

  return router;
}
