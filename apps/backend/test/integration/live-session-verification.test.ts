import { describe, it, expect, beforeAll } from "vitest";
import request from "supertest";
import crypto from "node:crypto";
import { createApp } from "../../src/app.js";
import { validateConfig } from "../../src/config/env.js";
import { getPrismaClient } from "../../src/database/client/prisma.js";
import { CryptoService } from "../../src/modules/auth/services/crypto.service.js";
import { SessionService } from "../../src/modules/auth/services/session.service.js";
import { S2SService } from "../../src/modules/auth/services/s2s.service.js";
import { ERROR_CODES } from "../../src/constants/error-codes.js";
import type { Express } from "express";

describe("Milestone 2.1 & 2.4 — Live Session & Permission Verification Integration Tests", () => {
  let app: Express;
  let prisma: ReturnType<typeof getPrismaClient>;
  let cryptoService: CryptoService;
  let sessionService: SessionService;
  let s2sKeyPair: { privateKeyPem: string; publicKeyPem: string };
  let serviceClientId: string;
  const serviceIdentifier = "customer-backend";
  const s2sKid = "s2s-test-key-1";

  let testUserId: string;
  let testRoleId: string;
  let testPermissionId: string;

  beforeAll(async () => {
    // Generate authoritative central auth signing keypair for both app and sessionService
    const { privateKey: authPriv, publicKey: authPub } = crypto.generateKeyPairSync("ed25519");
    const jwtActivePrivateKeyPem = authPriv.export({ type: "pkcs8", format: "pem" }) as string;
    const jwtActivePublicKeyPem = authPub.export({ type: "spki", format: "pem" }) as string;

    const config = validateConfig({
      DATABASE_URL:
        "postgresql://fillcart_app_user:fillcart_app_pass@127.0.0.1:5432/fillcart?schema=public",
      JWT_ISSUER_URL: "https://auth.fillcart.internal",
      JWT_ACTIVE_KID: "k-test-live-1",
      JWT_ACTIVE_PRIVATE_KEY_PEM: jwtActivePrivateKeyPem,
      JWT_ACTIVE_PUBLIC_KEY_PEM: jwtActivePublicKeyPem,
      LOG_LEVEL: "silent",
      NODE_ENV: "test",
    });

    app = createApp(config);
    prisma = getPrismaClient(config);
    cryptoService = new CryptoService(config);
    sessionService = new SessionService(prisma, cryptoService, config.JWT_ISSUER_URL);

    // 1. Generate S2S Keypair
    const { privateKey, publicKey } = crypto.generateKeyPairSync("ed25519");
    s2sKeyPair = {
      privateKeyPem: privateKey.export({ type: "pkcs8", format: "pem" }) as string,
      publicKeyPem: publicKey.export({ type: "spki", format: "pem" }) as string,
    };

    // 2. Register ServiceClient & ServicePublicKey in DB
    serviceClientId = "svc_test_" + crypto.randomUUID().replace(/-/g, "").slice(0, 16);
    await prisma.serviceClient.upsert({
      where: { serviceIdentifier },
      update: { status: "ACTIVE", allowedScopes: ["auth:verify_session"] },
      create: {
        id: serviceClientId,
        serviceIdentifier,
        name: "Customer Backend Test Service",
        status: "ACTIVE",
        allowedScopes: ["auth:verify_session"],
      },
    });

    const existingClient = await prisma.serviceClient.findUnique({ where: { serviceIdentifier } });
    if (existingClient) serviceClientId = existingClient.id;

    await prisma.servicePublicKey.upsert({
      where: { keyId: s2sKid },
      update: { publicKeyPem: s2sKeyPair.publicKeyPem, isRevoked: false, expiresAt: new Date(Date.now() + 86400000) },
      create: {
        id: "spk_" + crypto.randomUUID().replace(/-/g, "").slice(0, 16),
        serviceClientId,
        keyId: s2sKid,
        algorithm: "EdDSA",
        publicKeyPem: s2sKeyPair.publicKeyPem,
        isRevoked: false,
        expiresAt: new Date(Date.now() + 86400000),
      },
    });

    // 3. Fetch existing seeded Roles & Permissions
    const customerRole = await prisma.role.findUniqueOrThrow({ where: { name: "CUSTOMER" } });
    testRoleId = customerRole.id;

    const permRecord = await prisma.permission.findUniqueOrThrow({
      where: { action_resource: { action: "create", resource: "orders" } },
    });
    testPermissionId = permRecord.id;

    // 4. Create base test User
    testUserId = "usr_live_" + crypto.randomUUID().replace(/-/g, "").slice(0, 16);
    const email = `live_verify_${Date.now()}@fillcart.internal`;
    await prisma.user.create({
      data: {
        id: testUserId,
        emailNormalized: email.toLowerCase(),
        displayEmail: email,
        fullName: "Live Verification Test Principal",
        accountType: "CUSTOMER",
        status: "ACTIVE",
        roleId: testRoleId,
      },
    });
  });

  function mintFreshS2SAssertion(): string {
    return S2SService.mintServiceAssertion({
      serviceIdentifier,
      privateKeyPem: s2sKeyPair.privateKeyPem,
      kid: s2sKid,
      expiresInSec: 30,
    });
  }

  it("1. Valid active session with currently assigned permission succeeds", async () => {
    const session = await sessionService.createSession(testUserId);
    const s2sToken = mintFreshS2SAssertion();

    const res = await request(app)
      .post("/api/v1/internal/auth/verify-session")
      .set("Authorization", `Bearer ${s2sToken}`)
      .send({
        userAccessToken: session.accessToken,
        requiredPermission: "create:orders",
      });

    if (res.status !== 200) {
      console.log("TEST 1 FAILURE BODY:", res.status, res.body);
    }

    expect(res.status).toBe(200);
    expect(res.body.valid).toBe(true);
    expect(res.body.authorized).toBe(true);
    expect(res.body.userId).toBe(testUserId);
    expect(res.body.permissions).toContain("create:orders");
  });

  it("2. Permission revoked after token issuance fails authorization in live check", async () => {
    // Principal has valid token with create:orders claim, but direct override denies it in database
    const session = await sessionService.createSession(testUserId);

    // Apply immediate DENY override in DB
    const directPermId = "spd_" + crypto.randomUUID().replace(/-/g, "").slice(0, 16);
    await prisma.staffDirectPermission.create({
      data: {
        id: directPermId,
        userId: testUserId,
        permissionId: testPermissionId,
        effect: "DENY",
        grantedBy: "admin_tester",
      },
    });

    const s2sToken = mintFreshS2SAssertion();
    const res = await request(app)
      .post("/api/v1/internal/auth/verify-session")
      .set("Authorization", `Bearer ${s2sToken}`)
      .send({
        userAccessToken: session.accessToken,
        requiredPermission: "create:orders",
      });

    expect(res.status).toBe(200);
    expect(res.body.valid).toBe(true);
    // Even though token had permission claim, live DB evaluation overrides to false
    expect(res.body.authorized).toBe(false);
    expect(res.body.reason).toBe("INSUFFICIENT_PERMISSIONS");

    // Clean up direct permission by setting revokedAt (adhering to zero-DELETE baseline)
    await prisma.staffDirectPermission.update({
      where: { id: directPermId },
      data: { revokedAt: new Date() },
    });
  });

  it("3. Role changed after token issuance reflects live DB role, not stale JWT", async () => {
    const session = await sessionService.createSession(testUserId);

    // Switch to existing VENDOR role in DB
    const vendorRole = await prisma.role.findUniqueOrThrow({ where: { name: "VENDOR" } });

    await prisma.user.update({
      where: { id: testUserId },
      data: { roleId: vendorRole.id },
    });

    const s2sToken = mintFreshS2SAssertion();
    const res = await request(app)
      .post("/api/v1/internal/auth/verify-session")
      .set("Authorization", `Bearer ${s2sToken}`)
      .send({ userAccessToken: session.accessToken });

    expect(res.status).toBe(200);
    expect(res.body.valid).toBe(true);
    expect(res.body.role).toBe("VENDOR");

    // Restore role back to CUSTOMER
    await prisma.user.update({
      where: { id: testUserId },
      data: { roleId: testRoleId },
    });
  });

  it("4. Session family revoked after token issuance returns SESSION_REVOKED", async () => {
    const session = await sessionService.createSession(testUserId);

    // Invalidate session in DB
    const tokenHash = cryptoService.hashOpaqueToken(session.refreshToken);
    const tokenRec = await prisma.refreshToken.findUnique({
      where: { tokenHash },
      select: { sessionId: true },
    });
    await sessionService.revokeSession(tokenRec!.sessionId);

    const s2sToken = mintFreshS2SAssertion();
    const res = await request(app)
      .post("/api/v1/internal/auth/verify-session")
      .set("Authorization", `Bearer ${s2sToken}`)
      .send({ userAccessToken: session.accessToken });

    expect(res.status).toBe(200);
    expect(res.body.valid).toBe(false);
    expect(res.body.authorized).toBe(false);
    expect(res.body.reason).toBe("SESSION_REVOKED");
  });

  it("5. Suspended user fails live session check with ACCOUNT_SUSPENDED", async () => {
    const suspUser = "usr_live_susp_" + Date.now();
    const suspEmail = `susp_${Date.now()}@fillcart.internal`;
    await prisma.user.create({
      data: {
        id: suspUser,
        emailNormalized: suspEmail,
        fullName: "Suspended Live Principal",
        accountType: "CUSTOMER",
        status: "ACTIVE",
      },
    });

    const session = await sessionService.createSession(suspUser);

    // Suspend user
    await prisma.user.update({
      where: { id: suspUser },
      data: { status: "SUSPENDED" },
    });

    const s2sToken = mintFreshS2SAssertion();
    const res = await request(app)
      .post("/api/v1/internal/auth/verify-session")
      .set("Authorization", `Bearer ${s2sToken}`)
      .send({ userAccessToken: session.accessToken });

    expect(res.status).toBe(200);
    expect(res.body.valid).toBe(false);
    expect(res.body.authorized).toBe(false);
    expect(res.body.reason).toBe("ACCOUNT_SUSPENDED");
  });

  it("6. Expired session family returns SESSION_EXPIRED", async () => {
    const session = await sessionService.createSession(testUserId);

    // Expire session family in DB
    const tokenHash = cryptoService.hashOpaqueToken(session.refreshToken);
    const tokenRec = await prisma.refreshToken.findUnique({
      where: { tokenHash },
      select: { sessionId: true },
    });

    await prisma.sessionFamily.update({
      where: { id: tokenRec!.sessionId },
      data: {
        createdAt: new Date(Date.now() - 100000),
        expiresAt: new Date(Date.now() - 1000),
      },
    });

    const s2sToken = mintFreshS2SAssertion();
    const res = await request(app)
      .post("/api/v1/internal/auth/verify-session")
      .set("Authorization", `Bearer ${s2sToken}`)
      .send({ userAccessToken: session.accessToken });

    expect(res.status).toBe(200);
    expect(res.body.valid).toBe(false);
    expect(res.body.reason).toBe("SESSION_EXPIRED");
  });

  it("7. Invalid or unregistered S2S caller is rejected with HTTP 401", async () => {
    const session = await sessionService.createSession(testUserId);

    // S2S assertion signed by unknown key / unknown issuer
    const { privateKey } = crypto.generateKeyPairSync("ed25519");
    const fakeKeyPem = privateKey.export({ type: "pkcs8", format: "pem" }) as string;
    const rogueToken = S2SService.mintServiceAssertion({
      serviceIdentifier: "rogue-service",
      privateKeyPem: fakeKeyPem,
      kid: "unknown-kid",
      expiresInSec: 30,
    });

    const res = await request(app)
      .post("/api/v1/internal/auth/verify-session")
      .set("Authorization", `Bearer ${rogueToken}`)
      .send({ userAccessToken: session.accessToken });

    expect(res.status).toBe(401);
    expect(res.body.error.code).toBe(ERROR_CODES.INVALID_SERVICE_ASSERTION);
  });

  it("8. Replay of S2S assertion is detected and rejected with HTTP 401", async () => {
    const session = await sessionService.createSession(testUserId);
    const replayToken = mintFreshS2SAssertion();

    // First presentation succeeds
    const res1 = await request(app)
      .post("/api/v1/internal/auth/verify-session")
      .set("Authorization", `Bearer ${replayToken}`)
      .send({ userAccessToken: session.accessToken });
    expect(res1.status).toBe(200);

    // Second presentation with exact same S2S assertion is rejected via ServiceTokenReplay
    const res2 = await request(app)
      .post("/api/v1/internal/auth/verify-session")
      .set("Authorization", `Bearer ${replayToken}`)
      .send({ userAccessToken: session.accessToken });

    expect(res2.status).toBe(401);
    expect(res2.body.error.code).toBe(ERROR_CODES.TOKEN_REPLAY_DETECTED);
  });

  it("9. Fail-closed on missing or malformed service authorization header", async () => {
    const session = await sessionService.createSession(testUserId);

    const res = await request(app)
      .post("/api/v1/internal/auth/verify-session")
      .send({ userAccessToken: session.accessToken });

    expect(res.status).toBe(401);
    expect(res.body.error.code).toBe(ERROR_CODES.UNAUTHORIZED);
  });

  it("10. Rejects malformed userAccessToken with HTTP 400 or 401", async () => {
    const s2sToken = mintFreshS2SAssertion();

    const res = await request(app)
      .post("/api/v1/internal/auth/verify-session")
      .set("Authorization", `Bearer ${s2sToken}`)
      .send({ userAccessToken: "malformed.jwt.token" });

    expect([400, 401]).toContain(res.status);
    expect(res.body.error).toBeDefined();
  });
});
