import { S2SService } from "./s2s.service.js";
import type { LiveSessionVerificationResponse } from "@fillcart/shared-types";

export interface CentralAuthVerificationClientConfig {
  centralAuthUrl: string;
  serviceIdentifier: string;
  servicePrivateKeyPem: string;
  s2sKeyId: string;
  timeoutMs?: number;
}

export interface VerificationResult {
  authorized: boolean;
  valid: boolean;
  userId?: string;
  sessionId?: string;
  role?: string;
  permissions?: string[];
  reason?: string;
}

/**
 * Standard hybrid verification client helper for business backends.
 * Strictly fail-closed: on any network timeout, availability error, malformed response,
 * or corrupted permission payload, it rejects access and NEVER falls back to stale JWT claims.
 */
export class LiveVerificationClient {
  public static async verifySession(params: {
    userAccessToken: string;
    requiredPermission?: string;
    config: CentralAuthVerificationClientConfig;
    fetchFn?: typeof fetch;
  }): Promise<VerificationResult> {
    const fetchImpl = params.fetchFn ?? fetch;
    const timeout = params.config.timeoutMs ?? 3000;

    let s2sAssertion: string;
    try {
      s2sAssertion = S2SService.mintServiceAssertion({
        serviceIdentifier: params.config.serviceIdentifier,
        privateKeyPem: params.config.servicePrivateKeyPem,
        kid: params.config.s2sKeyId,
        expiresInSec: 30,
      });
    } catch {
      return { authorized: false, valid: false, reason: "S2S_MINT_FAILED" };
    }

    let response: Response;
    try {
      response = await fetchImpl(
        `${params.config.centralAuthUrl}/api/v1/internal/auth/verify-session`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${s2sAssertion}`,
          },
          body: JSON.stringify({
            userAccessToken: params.userAccessToken,
            requiredPermission: params.requiredPermission,
          }),
          signal: AbortSignal.timeout(timeout),
        }
      );
    } catch (err) {
      if ((err as Error).name === "TimeoutError") {
        return { authorized: false, valid: false, reason: "CENTRAL_AUTH_TIMEOUT" };
      }
      return { authorized: false, valid: false, reason: "CENTRAL_AUTH_UNAVAILABLE" };
    }

    if (!response.ok) {
      return { authorized: false, valid: false, reason: `CENTRAL_AUTH_HTTP_${response.status}` };
    }

    let body: any;
    try {
      body = (await response.json()) as LiveSessionVerificationResponse;
    } catch {
      return { authorized: false, valid: false, reason: "MALFORMED_VERIFICATION_RESPONSE" };
    }

    // Assert complete response structure
    if (typeof body !== "object" || body === null || typeof body.valid !== "boolean") {
      return { authorized: false, valid: false, reason: "INCOMPLETE_VERIFICATION_RESPONSE" };
    }

    if (body.valid !== true) {
      return { authorized: false, valid: false, reason: body.reason ?? "INVALID_SESSION" };
    }

    if (typeof body.authorized !== "boolean") {
      return { authorized: false, valid: true, reason: "INCOMPLETE_VERIFICATION_RESPONSE" };
    }

    // Validate permission data shape
    if (body.permissions !== undefined) {
      if (!Array.isArray(body.permissions) || body.permissions.some((p: any) => typeof p !== "string")) {
        return { authorized: false, valid: true, reason: "INVALID_PERMISSION_DATA" };
      }
    }

    if (body.authorized !== true) {
      return {
        authorized: false,
        valid: true,
        userId: body.userId,
        sessionId: body.sessionId,
        role: body.role,
        permissions: body.permissions,
        reason: body.reason ?? "UNAUTHORIZED",
      };
    }

    return {
      authorized: true,
      valid: true,
      userId: body.userId,
      sessionId: body.sessionId,
      role: body.role,
      permissions: body.permissions,
    };
  }
}
