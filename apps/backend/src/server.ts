import type { Server } from "node:http";
import { loadEnv, validateConfig } from "./config/index.js";
import { createApp } from "./app.js";
import { getLogger, flushAndCloseLogger } from "./utils/logger.js";
import {
  getPrismaClient,
  checkDatabaseReadiness,
  disconnectDatabase,
} from "./database/index.js";

// 1. Load environment variables
loadEnv();

// 2. Validate configuration
let config;
try {
  config = validateConfig(process.env);
} catch (err) {
  process.stderr.write(`${(err as Error).message}\n`);
  process.exit(1);
}

// 3. Initialize logger
const logger = getLogger(config);

// 4. Initialize Database & verify initial readiness (non-blocking)
const prisma = getPrismaClient(config);
checkDatabaseReadiness(prisma).then((readiness) => {
  if (readiness.ok) {
    logger.info(
      { latencyMs: readiness.latencyMs },
      "Database connection established successfully"
    );
  } else {
    logger.warn(
      "Initial database connection unreachable. Backend started in degraded state; readiness probe will report 503."
    );
  }
});

// 5. Create Express application
const app = createApp(config);

// 6. Bind HTTP server
let server: Server | null = null;

try {
  server = app.listen(config.PORT, config.HOST, () => {
    logger.info(
      {
        port: config.PORT,
        host: config.HOST,
        nodeEnv: config.NODE_ENV,
        corsOrigins: config.CORS_ORIGIN,
      },
      `Fillcart Central Backend started successfully on ${config.HOST}:${config.PORT}`
    );
  });
} catch (err) {
  logger.fatal({ err }, "Failed to start HTTP server");
  flushAndCloseLogger(() => process.exit(1));
}

// 7. Graceful Shutdown & Process Lifecycle Management
let isShuttingDown = false;

async function initiateGracefulShutdown(signal: string) {
  if (isShuttingDown) return;
  isShuttingDown = true;

  logger.info({ signal }, `Received ${signal}. Starting graceful shutdown...`);

  // Unreferenced 10-second forced shutdown safeguard timer
  const forceTimer = setTimeout(() => {
    logger.fatal("Graceful shutdown timed out after 10s. Forcing exit.");
    process.exit(1);
  }, 10000);
  forceTimer.unref();

  // 1. Drain HTTP server connections first
  if (server) {
    await new Promise<void>((resolve) => {
      server?.close((err) => {
        if (err) {
          logger.error({ err }, "Error occurred while closing HTTP server");
        } else {
          logger.info("HTTP server closed cleanly. In-flight requests drained.");
        }
        resolve();
      });
    });
  }

  // 2. Disconnect Prisma & underlying PostgreSQL connection pool
  try {
    await disconnectDatabase(prisma);
    logger.info("Database connection disconnected cleanly.");
  } catch (err) {
    logger.error({ err }, "Error disconnecting database connection pool");
  }

  // 3. Flush logger and exit
  flushAndCloseLogger(() => {
    clearTimeout(forceTimer);
    process.exit(0);
  });
}

// OS Termination Signals
process.on("SIGTERM", () => {
  void initiateGracefulShutdown("SIGTERM");
});
process.on("SIGINT", () => {
  void initiateGracefulShutdown("SIGINT");
});

// Fatal Uncaught Exceptions
process.on("uncaughtException", (err) => {
  logger.fatal({ err }, "Uncaught Exception detected");

  const fallbackTimer = setTimeout(() => {
    process.exit(1);
  }, 500);

  flushAndCloseLogger(() => {
    clearTimeout(fallbackTimer);
    process.exit(1);
  });
});

// Fatal Unhandled Promise Rejections
process.on("unhandledRejection", (reason) => {
  logger.fatal({ reason }, "Unhandled Promise Rejection detected");

  const fallbackTimer = setTimeout(() => {
    process.exit(1);
  }, 500);

  flushAndCloseLogger(() => {
    clearTimeout(fallbackTimer);
    process.exit(1);
  });
});

export { app, server };
