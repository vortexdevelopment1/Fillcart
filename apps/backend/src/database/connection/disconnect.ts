import type { PrismaClient } from "../generated/client/client.js";
import { resetPrismaClient } from "../client/prisma.js";

/**
 * Safely disconnects the PrismaClient.
 * Since PrismaPg adapter owns the connection pool, calling prisma.$disconnect()
 * cleanly terminates the pool without requiring manual pool teardown.
 */
export async function disconnectDatabase(
  prisma: PrismaClient | null
): Promise<void> {
  if (!prisma) return;

  const timeoutPromise = new Promise<void>((resolve) => {
    setTimeout(resolve, 5000).unref();
  });

  try {
    await Promise.race([prisma.$disconnect(), timeoutPromise]);
  } catch {
    // Continue with process shutdown regardless of disconnect error
  } finally {
    resetPrismaClient();
  }
}
