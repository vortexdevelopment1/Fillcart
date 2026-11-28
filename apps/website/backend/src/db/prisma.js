import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@prisma/client";
import dotenv from "dotenv";

dotenv.config();

let prismaInstance = null;

/**
 * Returns the singleton PrismaClient instance configured with @prisma/adapter-pg.
 */
export function getPrismaClient() {
  if (!prismaInstance) {
    const databaseUrl = process.env.DATABASE_URL;
    if (!databaseUrl) {
      throw new Error(
        "Missing required environment variable: DATABASE_URL. Please set DATABASE_URL in your .env file."
      );
    }

    const adapter = new PrismaPg({
      connectionString: databaseUrl,
    });

    prismaInstance = new PrismaClient({
      adapter,
    });
  }

  return prismaInstance;
}

/**
 * Proxy object providing lazy initialization for PrismaClient on first access.
 */
export const prisma = new Proxy(
  {},
  {
    get(_target, prop) {
      const client = getPrismaClient();
      const val = client[prop];
      return typeof val === "function" ? val.bind(client) : val;
    },
  }
);

export default prisma;
