/**
 * In-memory IP rate limiter middleware.
 * Limits an IP to a specified number of requests within a rolling window.
 *
 * @param {Object} options
 * @param {number} options.windowMs - Time window in milliseconds (default: 10 minutes)
 * @param {number} options.max - Maximum requests allowed within window (default: 5)
 */
export function rateLimit({ windowMs = 10 * 60 * 1000, max = 5 } = {}) {
  const ipRequests = new Map();

  // Periodic cleanup of expired entries
  setInterval(() => {
    const now = Date.now();
    for (const [ip, entry] of ipRequests.entries()) {
      if (now > entry.resetTime) {
        ipRequests.delete(ip);
      }
    }
  }, 5 * 60 * 1000).unref();

  return (req, res, next) => {
    const ip =
      req.ip ||
      req.headers["x-forwarded-for"]?.split(",")[0]?.trim() ||
      req.socket?.remoteAddress ||
      "unknown-ip";

    const now = Date.now();
    const record = ipRequests.get(ip);

    if (!record || now > record.resetTime) {
      ipRequests.set(ip, {
        count: 1,
        resetTime: now + windowMs,
      });
      return next();
    }

    if (record.count >= max) {
      return res.status(429).json({
        success: false,
        error: {
          code: "RATE_LIMITED",
          message: "Too many contact requests. Please try again later.",
        },
      });
    }

    record.count++;
    next();
  };
}
