import { describe, it, expect } from "vitest";
import crypto from "node:crypto";
import { PasswordService } from "../../src/modules/auth/services/password.service.js";

describe("Milestone 2.2 — Argon2id PasswordService Tests", () => {
  it("hashes password with approved Argon2id parameters (m=65536, t=3, p=1)", async () => {
    const password = "StrongArgon2idPassword#2026";
    const hash = await PasswordService.hashPassword(password);

    expect(hash).toBeDefined();
    expect(hash.startsWith("$argon2id$")).toBe(true);
    expect(hash).toContain("m=65536,t=3,p=1");

    const { valid, needsRehash } = await PasswordService.verifyPassword(password, hash);
    expect(valid).toBe(true);
    expect(needsRehash).toBe(false);
  });

  it("fails verification on incorrect password", async () => {
    const hash = await PasswordService.hashPassword("CorrectPassword123!");
    const { valid } = await PasswordService.verifyPassword("WrongPassword123!", hash);
    expect(valid).toBe(false);
  });

  it("safely verifies and flags legacy PBKDF2 hash for rehash upgrade", async () => {
    // Generate valid legacy PBKDF2 hash format
    const salt = "dGVzdHNhbHQ";
    const password = "LegacyPassword123!";
    const iterations = 10000;
    const derivedKey = crypto.pbkdf2Sync(password, salt, iterations, 64, "sha512");
    const validLegacyHash = `$pbkdf2-sha512$i=${iterations}$s=${salt}$h=${derivedKey.toString("base64url")}`;

    // Valid password must verify and flag needsRehash: true
    const { valid, needsRehash } = await PasswordService.verifyPassword(password, validLegacyHash);
    expect(valid).toBe(true);
    expect(needsRehash).toBe(true);

    // Wrong password must fail verification and flag needsRehash: false
    const wrongAttempt = await PasswordService.verifyPassword("WrongPassword!", validLegacyHash);
    expect(wrongAttempt.valid).toBe(false);
    expect(wrongAttempt.needsRehash).toBe(false);
  });

  it("fails safely without error on malformed or empty hashes", async () => {
    expect((await PasswordService.verifyPassword("password", "")).valid).toBe(false);
    expect((await PasswordService.verifyPassword("password", "invalid-hash-format")).valid).toBe(false);
  });
});
