import { pino, type Logger } from "pino";
import type { AppConfig } from "../config/env.schema.js";

let loggerInstance: Logger | null = null;
let devTransportInstance: {
  end?: () => void;
  once?: (event: string, listener: () => void) => void;
} | null = null;

/**
 * Creates or retrieves the structured Pino logger instance.
 */
export function getLogger(config?: AppConfig): Logger {
  if (loggerInstance) {
    return loggerInstance;
  }

  const isDev = config?.NODE_ENV === "development";
  const logLevel = config?.LOG_LEVEL ?? "info";

  const redactPaths = [
    "req.headers.authorization",
    "req.headers.cookie",
    'req.headers["set-cookie"]',
    'req.headers["x-api-key"]',
    "password",
    "token",
    "refreshToken",
    "accessToken",
    "*.password",
    "*.token",
  ];

  if (isDev) {
    // In development, use pino-pretty transport
    const transport = pino.transport({
      target: "pino-pretty",
      options: {
        colorize: true,
        translateTime: "SYS:standard",
        ignore: "pid,hostname",
      },
    });
    devTransportInstance = transport;

    loggerInstance = pino(
      {
        level: logLevel,
        redact: redactPaths,
      },
      transport
    );
  } else {
    loggerInstance = pino({
      level: logLevel,
      redact: redactPaths,
    });
  }

  return loggerInstance;
}

/**
 * Safely flushes the logger and closes any worker transports.
 * If devTransportInstance exists, awaits the 'close' event upon calling .end().
 */
export function flushAndCloseLogger(cb?: () => void): void {
  if (!loggerInstance) {
    cb?.();
    return;
  }

  const flushCoreLogger = () => {
    if (loggerInstance && typeof loggerInstance.flush === "function") {
      try {
        loggerInstance.flush(() => {
          cb?.();
        });
        return;
      } catch {
        cb?.();
        return;
      }
    }
    cb?.();
  };

  // If a dev worker transport exists, end it and await 'close'
  if (devTransportInstance && typeof devTransportInstance.end === "function") {
    try {
      if (typeof devTransportInstance.once === "function") {
        let closed = false;
        const onClose = () => {
          if (!closed) {
            closed = true;
            flushCoreLogger();
          }
        };

        devTransportInstance.once("close", onClose);
        devTransportInstance.end();

        // 1-second safety fallback in case transport 'close' is not emitted
        setTimeout(() => {
          if (!closed) {
            closed = true;
            flushCoreLogger();
          }
        }, 1000).unref();
        return;
      }

      devTransportInstance.end();
    } catch {
      // Fall through to flush core logger
    }
  }

  flushCoreLogger();
}
