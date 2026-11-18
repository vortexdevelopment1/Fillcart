import path from "node:path";
import { fileURLToPath } from "node:url";
import dotenv from "dotenv";
import { defineConfig } from "prisma/config";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

dotenv.config({
  path: path.resolve(__dirname, ".env"),
});

const migrationDatabaseUrl = process.env.MIGRATION_DATABASE_URL;

if (!migrationDatabaseUrl) {
  throw new Error(
    "Missing required environment variable: MIGRATION_DATABASE_URL. Prisma CLI and migration tooling must exclusively use MIGRATION_DATABASE_URL with schema-owner privileges."
  );
}

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
    seed: "tsx prisma/seeds/seed.ts",
  },
  datasource: {
    url: migrationDatabaseUrl,
  },
});
