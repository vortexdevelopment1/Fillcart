import "dotenv/config";
import path from "node:path";
import { fileURLToPath } from "node:url";
import dotenv from "dotenv";
import { defineConfig } from "prisma/config";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Explicitly load .env from the backend root directory (in case invoked from repository root)
dotenv.config({
  path: path.resolve(__dirname, ".env"),
});

const databaseUrl = process.env.DATABASE_URL;

if (!databaseUrl) {
  throw new Error("DATABASE_URL missing in apps/website/backend/.env");
}

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
    seed: "node prisma/seed.js",
  },
  datasource: {
    url: databaseUrl,
  },
});
