import dotenv from "dotenv";
import { z } from "zod";

// Load local environment variables from .env if present
dotenv.config();

const envSchema = z.object({
  PORT: z.coerce.number().default(4100),
  CORS_ORIGIN: z.string().default("http://127.0.0.1:5173,http://localhost:5173"),
  DATABASE_URL: z.string().optional(),
  NODE_ENV: z.enum(["development", "production", "test"]).default("development"),
  CENTRAL_AUTH_URL: z.string().url().default("http://127.0.0.1:4000"),
  CENTRAL_AUTH_ISSUER: z.string().default("https://auth.fillcart.internal"),
  CENTRAL_AUTH_AUDIENCE: z.string().default("customer-backend"),
  JWKS_CACHE_TTL_MS: z.coerce.number().default(3600000),
});

const parsedEnv = envSchema.safeParse(process.env);

if (!parsedEnv.success) {
  console.error("Invalid environment configuration:", parsedEnv.error.format());
  process.exit(1);
}

export const env = {
  ...parsedEnv.data,
  corsOrigins: parsedEnv.data.CORS_ORIGIN.split(",").map((origin) => origin.trim()),
};
