import { Router } from "express";
import { healthRouter } from "./health.routes.js";

export const v1Router = Router();

// Mount liveness probe on /health within /api/v1
v1Router.use("/health", healthRouter);

export * from "./health.routes.js";
