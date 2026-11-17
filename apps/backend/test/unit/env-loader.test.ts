import { describe, it, expect, beforeEach, afterEach } from "vitest";
import fs from "node:fs";
import path from "node:path";
import os from "node:os";
import { DEFAULT_ENV_PATH, loadEnv } from "../../src/config/env.js";

describe("Environment Loader Unit Tests", () => {
  const originalCwd = process.cwd();
  const originalEnv = { ...process.env };

  beforeEach(() => {
    // Reset process.env overrides
    delete process.env.TEST_LOAD_MARKER;
  });

  afterEach(() => {
    process.chdir(originalCwd);
    process.env = { ...originalEnv };
  });

  it("DEFAULT_ENV_PATH accurately points to apps/backend/.env", () => {
    expect(DEFAULT_ENV_PATH).toMatch(/apps[\\/]backend[\\/]\.env$/);
    expect(fs.existsSync(DEFAULT_ENV_PATH)).toBe(true);
  });

  it("loads environment correctly when cwd is workspace root", () => {
    // Set cwd to repository root
    const rootDir = path.resolve(DEFAULT_ENV_PATH, "../../..");
    process.chdir(rootDir);

    // Call loadEnv with no arguments
    loadEnv();

    expect(process.env.PORT).toBeDefined();
    expect(process.env.NODE_ENV).toBeDefined();
  });

  it("loads environment correctly regardless of process working directory", () => {
    // Change working directory to system temp directory
    const tempDir = os.tmpdir();
    process.chdir(tempDir);

    // loadEnv() still resolves to DEFAULT_ENV_PATH
    loadEnv();

    expect(process.env.PORT).toBeDefined();
    expect(process.env.HOST).toBeDefined();
  });

  it("loads from custom path when explicitly provided", () => {
    const customEnvFile = path.join(os.tmpdir(), `test-custom-${Date.now()}.env`);
    fs.writeFileSync(customEnvFile, "TEST_LOAD_MARKER=custom_success\n");

    try {
      loadEnv(customEnvFile);
      expect(process.env.TEST_LOAD_MARKER).toBe("custom_success");
    } finally {
      if (fs.existsSync(customEnvFile)) {
        fs.unlinkSync(customEnvFile);
      }
    }
  });
});
