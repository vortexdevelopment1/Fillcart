import { fileURLToPath } from "node:url";
import path from "node:path";
import dotenv from "dotenv";
import { envSchema, type AppConfig } from "./env.schema.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

/**
 * Default .env file location anchored to apps/backend/.env
 * (traversing up from src/config to the apps/backend workspace root).
 */
export const DEFAULT_ENV_PATH = path.resolve(__dirname, "../../.env");

/**
 * Loads environment variables from the designated file into process.env.
 * Uses DEFAULT_ENV_PATH unless an explicit customPath is provided.
 */
export function loadEnv(customPath?: string): void {
  const targetPath = customPath ?? DEFAULT_ENV_PATH;
  dotenv.config({ path: targetPath });
}

/**
 * Pure validation function that runs raw inputs against envSchema.
 * Never mutates or reads directly from process.env, enabling deterministic testing.
 */
export function validateConfig(raw: Record<string, unknown>): AppConfig {
  const result = envSchema.safeParse(raw);
  if (!result.success) {
    const errorDetails = result.error.issues
      .map((issue) => ` - ${issue.path.join(".") || "config"}: ${issue.message}`)
      .join("\n");
    throw new Error(`Environment validation failed:\n${errorDetails}`);
  }
  return result.data;
}
