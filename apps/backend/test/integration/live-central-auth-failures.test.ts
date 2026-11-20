import { describe, it, expect, vi } from "vitest";
import crypto from "node:crypto";
import { LiveVerificationClient } from "../../src/modules/auth/services/live-verification-client.js";

describe("Milestone 2.1 & 2.4 — Live Central Auth Failure Behavior & Fail-Closed Tests", () => {
  const { privateKey } = crypto.generateKeyPairSync("ed25519");
  const privateKeyPem = privateKey.export({ type: "pkcs8", format: "pem" }) as string;

  const clientConfig = {
    centralAuthUrl: "https://auth.fillcart.internal",
    serviceIdentifier: "customer-backend",
    servicePrivateKeyPem: privateKeyPem,
    s2sKeyId: "k-fail-test",
    timeoutMs: 1000,
  };

  // User access token that embeds "claims" with permissions: ["orders:manage"]
  // A non-compliant client might be tempted to inspect this token and authorize access if Central Auth fails!
  const userTokenWithClaims = "header.payloadWithOrdersManagePermission.signature";

  it("1. Central Auth timeout produces a fail-closed authorization result", async () => {
    const mockFetch = vi.fn().mockImplementation(async () => {
      const err = new Error("The operation was aborted");
      err.name = "TimeoutError";
      throw err;
    });

    const result = await LiveVerificationClient.verifySession({
      userAccessToken: userTokenWithClaims,
      requiredPermission: "orders:manage",
      config: clientConfig,
      fetchFn: mockFetch,
    });

    // Must strictly fail closed and never fall back to JWT claims
    expect(result.authorized).toBe(false);
    expect(result.valid).toBe(false);
    expect(result.reason).toBe("CENTRAL_AUTH_TIMEOUT");
  });

  it("2. Central Auth unavailable (network / connection error) produces a fail-closed result", async () => {
    const mockFetch = vi.fn().mockRejectedValue(new Error("connect ECONNREFUSED 127.0.0.1:4000"));

    const result = await LiveVerificationClient.verifySession({
      userAccessToken: userTokenWithClaims,
      requiredPermission: "orders:manage",
      config: clientConfig,
      fetchFn: mockFetch,
    });

    expect(result.authorized).toBe(false);
    expect(result.valid).toBe(false);
    expect(result.reason).toBe("CENTRAL_AUTH_UNAVAILABLE");
  });

  it("3. Central Auth HTTP 503 / 500 error produces a fail-closed result", async () => {
    const mockFetch = vi.fn().mockResolvedValue({
      ok: false,
      status: 503,
    } as any);

    const result = await LiveVerificationClient.verifySession({
      userAccessToken: userTokenWithClaims,
      requiredPermission: "orders:manage",
      config: clientConfig,
      fetchFn: mockFetch,
    });

    expect(result.authorized).toBe(false);
    expect(result.valid).toBe(false);
    expect(result.reason).toBe("CENTRAL_AUTH_HTTP_503");
  });

  it("4. Malformed verification response (non-JSON) produces a fail-closed result", async () => {
    const mockFetch = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => {
        throw new SyntaxError("Unexpected token < in JSON at position 0");
      },
    } as any);

    const result = await LiveVerificationClient.verifySession({
      userAccessToken: userTokenWithClaims,
      requiredPermission: "orders:manage",
      config: clientConfig,
      fetchFn: mockFetch,
    });

    expect(result.authorized).toBe(false);
    expect(result.valid).toBe(false);
    expect(result.reason).toBe("MALFORMED_VERIFICATION_RESPONSE");
  });

  it("5. Incomplete verification response (missing authorized property) produces a fail-closed result", async () => {
    const mockFetch = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({
        valid: true,
        // Missing 'authorized' boolean
        userId: "123",
      }),
    } as any);

    const result = await LiveVerificationClient.verifySession({
      userAccessToken: userTokenWithClaims,
      requiredPermission: "orders:manage",
      config: clientConfig,
      fetchFn: mockFetch,
    });

    expect(result.authorized).toBe(false);
    expect(result.reason).toBe("INCOMPLETE_VERIFICATION_RESPONSE");
  });

  it("6. Invalid or unexpected permission data (corrupted shape) produces a fail-closed result", async () => {
    const mockFetch = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({
        valid: true,
        authorized: true,
        // Corrupted permissions data: array containing numbers instead of valid permission strings
        permissions: [12345, null],
      }),
    } as any);

    const result = await LiveVerificationClient.verifySession({
      userAccessToken: userTokenWithClaims,
      requiredPermission: "orders:manage",
      config: clientConfig,
      fetchFn: mockFetch,
    });

    expect(result.authorized).toBe(false);
    expect(result.reason).toBe("INVALID_PERMISSION_DATA");
  });
});
