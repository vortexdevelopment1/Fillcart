import { z } from "@fillcart/validations";

/**
 * Validates that an origin string is a valid HTTP/HTTPS URL
 * with no path (other than root '/'), no query string, no hash fragment,
 * and no embedded credentials. Normalizes the output to url.origin.
 */
function parseAndValidateOrigin(val: string): string {
  const trimmed = val.trim();
  if (!trimmed) {
    throw new Error("Origin cannot be empty");
  }

  let url: URL;
  try {
    url = new URL(trimmed);
  } catch {
    throw new Error(`Invalid URL format: "${trimmed}"`);
  }

  if (url.protocol !== "http:" && url.protocol !== "https:") {
    throw new Error(
      `Origin must use http: or https: protocol, received: "${url.protocol}"`
    );
  }

  if (url.username || url.password) {
    throw new Error("Origin cannot contain credentials");
  }

  if (url.pathname !== "" && url.pathname !== "/") {
    throw new Error(
      `Origin cannot include a path, received path: "${url.pathname}"`
    );
  }

  if (url.search) {
    throw new Error(
      `Origin cannot include query parameters, received: "${url.search}"`
    );
  }

  if (url.hash) {
    throw new Error(
      `Origin cannot include a hash fragment, received: "${url.hash}"`
    );
  }

  return url.origin;
}

export const envSchema = z.object({
  PORT: z
    .string()
    .default("4000")
    .transform((val, ctx) => {
      const parsed = parseInt(val, 10);
      if (isNaN(parsed) || parsed <= 0 || parsed > 65535) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: `PORT must be a valid integer between 1 and 65535, received: "${val}"`,
        });
        return z.NEVER;
      }
      return parsed;
    }),

  HOST: z.string().min(1).default("127.0.0.1"),

  NODE_ENV: z
    .enum(["development", "test", "production"])
    .default("development"),

  CORS_ORIGIN: z
    .string()
    .default("http://localhost:3000,http://127.0.0.1:3000")
    .transform((val, ctx) => {
      const rawOrigins = val
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean);

      if (rawOrigins.length === 0) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "CORS_ORIGIN must contain at least one origin",
        });
        return z.NEVER;
      }

      const validatedOrigins: string[] = [];
      for (const origin of rawOrigins) {
        if (origin === "*") {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message:
              "Wildcard CORS origins are forbidden. Use explicit allowlisted origins.",
          });
          return z.NEVER;
        }

        try {
          const normalized = parseAndValidateOrigin(origin);
          validatedOrigins.push(normalized);
        } catch (err) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: `Invalid CORS origin "${origin}": ${(err as Error).message}`,
          });
          return z.NEVER;
        }
      }

      return Array.from(new Set(validatedOrigins));
    }),

  LOG_LEVEL: z
    .enum(["fatal", "error", "warn", "info", "debug", "trace", "silent"])
    .default("info"),

  DATABASE_URL: z
    .string()
    .default(
      "postgresql://fillcart_user:fillcart_pass@127.0.0.1:5432/fillcart?schema=public"
    )
    .refine(
      (val) => val.startsWith("postgresql://") || val.startsWith("postgres://"),
      {
        message:
          "DATABASE_URL must be a valid PostgreSQL connection string starting with postgresql:// or postgres://",
      }
    ),
});

export type AppConfig = z.infer<typeof envSchema>;
