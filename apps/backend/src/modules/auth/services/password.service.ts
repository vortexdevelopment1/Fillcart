import { hash, verify } from "@node-rs/argon2";
import type { Algorithm } from "@node-rs/argon2";
import crypto from "node:crypto";

/**
 * Standard-Compliant Password Hashing Service.
 *
 * Requirements:
 * - Algorithm: Argon2id
 * - Memory Cost: 64 MB (65,536 KiB)
 * - Time Cost / Iterations: 3
 * - Parallelism: 1 lane
 *
 * Backwards Compatibility & Migration:
 * - Supports legacy $pbkdf2-sha512$ hashes for safe upgrade/rehash-on-success.
 * - Constant-time comparison, zero leakage of credentials or account existence.
 */
export class PasswordService {
  // Approved Argon2id Parameters: 64 MB memory, 3 iterations, 1 lane
  private static readonly MEMORY_COST_KIB = 64 * 1024; // 65,536 KiB = 64 MB
  private static readonly TIME_COST = 3;
  private static readonly PARALLELISM = 1;

  /**
   * Hashes a password using standard Argon2id with 64 MB memory, 3 iterations, and 1 lane.
   */
  public static async hashPassword(password: string): Promise<string> {
    return await hash(password, {
      memoryCost: PasswordService.MEMORY_COST_KIB,
      timeCost: PasswordService.TIME_COST,
      parallelism: PasswordService.PARALLELISM,
      algorithm: 2 as Algorithm, // 2 = Algorithm.Argon2id
    });
  }

  /**
   * Verifies a candidate password against stored Argon2id (or legacy PBKDF2) hash.
   * Returns:
   * - valid: boolean
   * - needsRehash: true if the stored hash is legacy PBKDF2 and should be upgraded to Argon2id on success.
   */
  public static async verifyPassword(
    password: string,
    storedHash: string
  ): Promise<{ valid: boolean; needsRehash: boolean }> {
    if (!storedHash || typeof storedHash !== "string") {
      return { valid: false, needsRehash: false };
    }

    // 1. Argon2id / Argon2 Verification
    if (storedHash.startsWith("$argon2")) {
      try {
        const isValid = await verify(storedHash, password);
        return { valid: isValid, needsRehash: false };
      } catch {
        return { valid: false, needsRehash: false };
      }
    }

    // 2. Legacy PBKDF2 Verification & Rehash Detection
    if (storedHash.startsWith("$pbkdf2-sha512$")) {
      const isValid = await PasswordService.verifyLegacyPbkdf2(password, storedHash);
      return { valid: isValid, needsRehash: isValid };
    }

    return { valid: false, needsRehash: false };
  }

  private static async verifyLegacyPbkdf2(password: string, storedHash: string): Promise<boolean> {
    try {
      const parts = storedHash.split("$");
      if (parts.length < 5 || !parts[2] || !parts[3] || !parts[4]) {
        return false;
      }
      const iterations = parseInt(parts[2].replace("i=", ""), 10);
      const salt = parts[3].replace("s=", "");
      const expectedHash = parts[4].replace("h=", "");

      return new Promise((resolve) => {
        crypto.pbkdf2(
          password,
          salt,
          iterations,
          64,
          "sha512",
          (err, derivedKey) => {
            if (err) return resolve(false);
            const actualHash = derivedKey.toString("base64url");
            const actualBuf = Buffer.from(actualHash);
            const expectedBuf = Buffer.from(expectedHash);
            if (actualBuf.length !== expectedBuf.length) return resolve(false);
            resolve(crypto.timingSafeEqual(actualBuf, expectedBuf));
          }
        );
      });
    } catch {
      return false;
    }
  }
}
