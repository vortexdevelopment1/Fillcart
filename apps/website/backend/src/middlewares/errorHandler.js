import { logger } from "../utils/logger.js";

// Express centralized error handling middleware (requires 4 arguments)
// eslint-disable-next-line no-unused-vars
export const errorHandler = (err, req, res, next) => {
  const statusCode = err.statusCode || (res.statusCode !== 200 ? res.statusCode : 500);
  const code = err.code || (statusCode === 404 ? "NOT_FOUND" : "INTERNAL_ERROR");
  const message = err.message || "An unexpected error occurred";

  if (statusCode >= 500) {
    logger.error(`Unhandled Error [${req.method} ${req.originalUrl}]:`, {
      message: err.message,
      stack: err.stack,
    });
  }

  res.status(statusCode).json({
    success: false,
    error: {
      code,
      message,
    },
  });
};
