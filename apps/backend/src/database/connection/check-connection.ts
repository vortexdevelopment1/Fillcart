import type { PrismaClient } from "../generated/client/client.js";

export interface ReadinessResult {
  ok: boolean;
  latencyMs: number;
}

/**
 * Executes a lightweight verification query ($queryRaw`SELECT 1`)
 * to determine live database connectivity.
 */
export async function checkDatabaseReadiness(
  prisma: PrismaClient
): Promise<ReadinessResult> {
  const start = Date.now();
  try {
    await prisma.$queryRaw`SELECT 1`;
    return {
      ok: true,
      latencyMs: Date.now() - start,
    };
  } catch {
    return {
      ok: false,
      latencyMs: Date.now() - start,
    };
  }
}
