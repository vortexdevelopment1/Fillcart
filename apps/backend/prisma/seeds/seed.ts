import { loadEnv, validateConfig } from "../../src/config/env.js";
import { getPrismaClient } from "../../src/database/client/prisma.js";
import { seedAuthBaseline } from "./auth-baseline.seed.js";

/**
 * Fillcart Baseline Database Seeder.
 * Orchestrates domain baseline seeding pipelines using safe configuration loading
 * and idempotent operations.
 */
async function main(): Promise<void> {
  loadEnv();

  const migrationUrl = process.env.MIGRATION_DATABASE_URL;
  if (!migrationUrl) {
    throw new Error(
      "Missing required environment variable: MIGRATION_DATABASE_URL. Baseline system seeding manages system roles and permissions and must exclusively execute using MIGRATION_DATABASE_URL with schema-owner privileges. Fallback to DATABASE_URL is strictly forbidden."
    );
  }

  const config = validateConfig({ ...process.env, DATABASE_URL: migrationUrl });
  const prisma = getPrismaClient(config);

  try {
    await seedAuthBaseline(prisma);
  } finally {
    await prisma.$disconnect();
  }
}

main().catch((e) => {
  console.error("Seeding error:", (e as Error)?.message || e);
  process.exit(1);
});
