import { Router, type Request, type Response } from "express";

export const healthRouter = Router();

export interface HealthResponse {
  status: "healthy";
  timestamp: string;
  version: string;
}

function handleHealthCheck(_req: Request, res: Response): void {
  const payload: HealthResponse = {
    status: "healthy",
    timestamp: new Date().toISOString(),
    version: "0.1.0",
  };

  res.status(200).json(payload);
}

// Handlers for liveness check
healthRouter.get("/", handleHealthCheck);
healthRouter.get("/health", handleHealthCheck);
