import type { Request, Response, NextFunction } from "express";

/**
 * Safely decodes a URI component string.
 * Returns the unencoded raw value if decoding fails.
 */
function safeDecode(val: string): string {
  try {
    return decodeURIComponent(val);
  } catch {
    return val;
  }
}

/**
 * Lightweight Express middleware to parse the HTTP `Cookie` request header into `req.cookies`.
 *
 * Characteristics:
 * - Zero external dependencies.
 * - String values only.
 * - Safe URI component decoding with try/catch fallback.
 * - Ignores malformed pairs (missing '=', empty names).
 * - Defends against prototype pollution by using `Object.create(null)` and skipping
 *   dangerous properties (`__proto__`, `constructor`, `prototype`).
 */
export function cookiesMiddleware(
  req: Request,
  _res: Response,
  next: NextFunction
): void {
  const cookieHeader = req.headers.cookie;
  const cookies: Record<string, string> = Object.create(null);

  if (typeof cookieHeader === "string" && cookieHeader.length > 0) {
    const pairs = cookieHeader.split(";");

    for (let i = 0; i < pairs.length; i++) {
      const pair = pairs[i]!.trim();
      if (!pair) continue;

      const equalIndex = pair.indexOf("=");
      if (equalIndex === -1) continue;

      const rawKey = pair.slice(0, equalIndex).trim();
      let rawVal = pair.slice(equalIndex + 1).trim();

      if (!rawKey) continue;

      // Guard against prototype pollution
      if (
        rawKey === "__proto__" ||
        rawKey === "constructor" ||
        rawKey === "prototype"
      ) {
        continue;
      }

      // Unwrap optional wrapping double-quotes per RFC 6265
      if (rawVal.length >= 2 && rawVal.startsWith('"') && rawVal.endsWith('"')) {
        rawVal = rawVal.slice(1, -1);
      }

      cookies[rawKey] = safeDecode(rawVal);
    }
  }

  req.cookies = cookies;
  next();
}
