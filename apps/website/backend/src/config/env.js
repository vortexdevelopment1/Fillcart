import dotenv from "dotenv";
import { z } from "zod";

// Load local environment variables from .env if present
dotenv.config();

const envSchema = z.object({
  PORT: z.coerce.number().default(4100),
  CORS_ORIGIN: z.string().default("http://127.0.0.1:5173,http://localhost:5173"),
  DATABASE_URL: z.string().optional(),
  NODE_ENV: z.enum(["development", "production", "test"]).default("development"),
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
