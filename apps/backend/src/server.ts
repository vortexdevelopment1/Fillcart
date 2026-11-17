import type { Server } from "node:http";
import { loadEnv, validateConfig } from "./config/index.js";
import { createApp } from "./app.js";
import { getLogger, flushAndCloseLogger } from "./utils/logger.js";

// 1. Load environment variables from apps/backend/.env
loadEnv();

// 2. Validate configuration via pure Zod function
let config;
try {
  config = validateConfig(process.env);
} catch (err) {
  process.stderr.write(`${(err as Error).message}\n`);
  process.exit(1);
}

// 3. Initialize logger
const logger = getLogger(config);

// 4. Create Express application
const app = createApp(config);

// 5. Bind HTTP server
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

// 6. Graceful Shutdown & Process Lifecycle Management
let isShuttingDown = false;

function initiateGracefulShutdown(signal: string) {
  if (isShuttingDown) return;
  isShuttingDown = true;

  logger.info({ signal }, `Received ${signal}. Starting graceful shutdown...`);

  // Unreferenced 10-second forced shutdown safeguard timer
  const forceTimer = setTimeout(() => {
    logger.fatal("Graceful shutdown timed out after 10s. Forcing exit.");
    process.exit(1);
  }, 10000);
  forceTimer.unref();

  if (server) {
    server.close((err) => {
      if (err) {
        logger.error({ err }, "Error occurred while closing HTTP server");
      } else {
        logger.info("HTTP server closed cleanly. In-flight requests drained.");
      }

      flushAndCloseLogger(() => {
        clearTimeout(forceTimer);
        process.exit(0);
      });
    });
  } else {
    flushAndCloseLogger(() => {
      clearTimeout(forceTimer);
      process.exit(0);
    });
  }
}

// OS Termination Signals
process.on("SIGTERM", () => initiateGracefulShutdown("SIGTERM"));
process.on("SIGINT", () => initiateGracefulShutdown("SIGINT"));

// Fatal Uncaught Exceptions
process.on("uncaughtException", (err) => {
  logger.fatal({ err }, "Uncaught Exception detected");

  // Reliable fallback timer: actively referenced to ensure termination if flush hangs
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

  // Reliable fallback timer: actively referenced to ensure termination if flush hangs
  const fallbackTimer = setTimeout(() => {
    process.exit(1);
  }, 500);

  flushAndCloseLogger(() => {
    clearTimeout(fallbackTimer);
    process.exit(1);
  });
});

export { app, server };
