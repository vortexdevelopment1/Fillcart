/**
 * Fillcart Central Auth — Database Maintenance & Pruning Routine
 *
 * GOVERNANCE & SECURITY RATIONALE:
 * The runtime application database role (`fillcart_app_user`) operates under a strict
 * append/update-only privilege profile (`can_delete = false` on operational tables)
 * to prevent unauthorized truncation or deletion by compromised application instances.
 *
 * Consequently, periodic maintenance cleanup of expired replay cache and rate limit
 * records MUST run in a dedicated maintenance job using a privileged connection
 * (`MIGRATION_DATABASE_URL` or administrative database role).
 *
 * PRUNING RETENTION SCHEDULES:
 * 1. ServiceTokenReplay:
 *    - Records prevent replay attacks within token validity windows.
 *    - Pruning condition: `expiresAt < NOW() - INTERVAL '300 seconds'` (safety buffer).
 * 2. RateLimitRecord:
 *    - Records enforce hourly sliding rate limit windows for OTP and sensitive endpoints.
 *    - Pruning condition: `timestamp < NOW() - INTERVAL '24 hours'` (retention for daily audit).
 * 3. OtpChallenge:
 *    - Ephemeral OTP challenges consumed or expired.
 *    - Pruning condition: `expiresAt < NOW() - INTERVAL '24 hours'`.
 */

import pg from "pg";

export interface CleanupResult {
  serviceTokenReplaysDeleted: number;
  rateLimitRecordsDeleted: number;
  otpChallengesDeleted: number;
  durationMs: number;
}

export async function runMaintenanceCleanup(
  databaseUrl?: string
): Promise<CleanupResult> {
  const connectionString =
    databaseUrl ||
    process.env.MIGRATION_DATABASE_URL ||
    process.env.DATABASE_URL;

  if (!connectionString) {
    throw new Error(
      "Maintenance cleanup requires MIGRATION_DATABASE_URL or DATABASE_URL."
    );
  }

  const startTime = Date.now();
  const pool = new pg.Pool({ connectionString, max: 2 });

  try {
    const client = await pool.connect();
    try {
      // 1. Prune ServiceTokenReplay records with 300s buffer past expiration
      const replayRes = await client.query(`
        DELETE FROM "ServiceTokenReplay"
        WHERE "expiresAt" < (NOW() - INTERVAL '300 seconds')
      `);

      // 2. Prune RateLimitRecord older than 24 hours
      const rateLimitRes = await client.query(`
        DELETE FROM "RateLimitRecord"
        WHERE "timestamp" < (NOW() - INTERVAL '24 hours')
      `);

      // 3. Prune OtpChallenge older than 24 hours
      const otpRes = await client.query(`
        DELETE FROM "OtpChallenge"
        WHERE "expiresAt" < (NOW() - INTERVAL '24 hours')
      `);

      const durationMs = Date.now() - startTime;

      return {
        serviceTokenReplaysDeleted: replayRes.rowCount ?? 0,
        rateLimitRecordsDeleted: rateLimitRes.rowCount ?? 0,
        otpChallengesDeleted: otpRes.rowCount ?? 0,
        durationMs,
      };
    } finally {
      client.release();
    }
  } finally {
    await pool.end();
  }
}

// Standalone execution entrypoint
if (process.argv[1] && process.argv[1].endsWith("cleanup.ts")) {
  runMaintenanceCleanup()
    .then((result) => {
      console.log("[Maintenance Cleanup] Successfully pruned expired records:", result);
      process.exit(0);
    })
    .catch((err) => {
      console.error("[Maintenance Cleanup] Execution failed:", err);
      process.exit(1);
    });
}
