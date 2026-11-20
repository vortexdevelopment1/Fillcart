import { describe, it, expect, beforeAll, vi } from "vitest";
import crypto from "node:crypto";
import { validateConfig } from "../../src/config/env.js";
import { getPrismaClient } from "../../src/database/client/prisma.js";
import { OtpService } from "../../src/modules/auth/services/otp.service.js";
import { ERROR_CODES } from "../../src/constants/error-codes.js";

describe("Milestone 2.3 — Durable Database OTP & Provider Handling Integration Tests", () => {
  let prisma: ReturnType<typeof getPrismaClient>;
  let otpService: OtpService;
  const hmacSecret = "test-durable-otp-secret-min16!";

  beforeAll(() => {
    const config = validateConfig({
      DATABASE_URL:
        "postgresql://fillcart_app_user:fillcart_app_pass@127.0.0.1:5432/fillcart?schema=public",
      LOG_LEVEL: "silent",
      NODE_ENV: "test",
    });

    prisma = getPrismaClient(config);
    otpService = new OtpService(prisma, hmacSecret);
  });

  it("enforces durable rate limit boundary: 5 requests/hr per phone", async () => {
    const testPhone = `+9199999${Math.floor(10000 + Math.random() * 90000)}`;

    // Dispatch 5 OTP requests
    for (let i = 0; i < 5; i++) {
      const res = await otpService.generateAndSendOtp({
        phone: testPhone,
        accountType: "CUSTOMER",
        purpose: "LOGIN",
      });
      expect(res.challengeId).toBeDefined();
    }

    // 6th OTP request on the same phone within 1 hour must be rejected
    await expect(
      otpService.generateAndSendOtp({
        phone: testPhone,
        accountType: "CUSTOMER",
        purpose: "LOGIN",
      })
    ).rejects.toThrow("Phone rate limit exceeded: maximum 5 OTP requests per hour");
  });

  it("durably persists challenge in PostgreSQL, verifies matching OTP, and prevents replay", async () => {
    const testPhone = `+9188888${Math.floor(10000 + Math.random() * 90000)}`;
    const knownOtp = "482910";

    const challengeId = crypto.randomUUID();
    const tokenHash = otpService.computeOtpHash({
      challengeId,
      phoneNormalized: testPhone,
      accountType: "CUSTOMER",
      purpose: "LOGIN",
      otp: knownOtp,
    });

    // Durably insert into OtpChallenge
    await prisma.otpChallenge.create({
      data: {
        id: challengeId,
        phoneNormalized: testPhone,
        accountType: "CUSTOMER",
        purpose: "LOGIN",
        tokenHash,
        attemptsLeft: 3,
        expiresAt: new Date(Date.now() + 300000),
        cooldownUntil: new Date(Date.now() + 60000),
        deliveryStatus: "DISPATCHED",
      },
    });

    // First verification with correct OTP succeeds
    const verified = await otpService.verifyOtp({
      challengeId,
      phone: testPhone,
      accountType: "CUSTOMER",
      purpose: "LOGIN",
      otp: knownOtp,
    });
    expect(verified).toBe(true);

    // Replay with exact same valid OTP must fail because challenge was consumed
    await expect(
      otpService.verifyOtp({
        challengeId,
        phone: testPhone,
        accountType: "CUSTOMER",
        purpose: "LOGIN",
        otp: knownOtp,
      })
    ).rejects.toThrow("Invalid or expired OTP challenge");
  });

  it("decrements attempts in DB and revokes challenge when attempts exhausted", async () => {
    const testPhone = `+9177777${Math.floor(10000 + Math.random() * 90000)}`;
    const challengeId = crypto.randomUUID();
    const tokenHash = otpService.computeOtpHash({
      challengeId,
      phoneNormalized: testPhone,
      accountType: "CUSTOMER",
      purpose: "LOGIN",
      otp: "999999",
    });

    await prisma.otpChallenge.create({
      data: {
        id: challengeId,
        phoneNormalized: testPhone,
        accountType: "CUSTOMER",
        purpose: "LOGIN",
        tokenHash,
        attemptsLeft: 3,
        expiresAt: new Date(Date.now() + 300000),
        cooldownUntil: new Date(Date.now() + 60000),
        deliveryStatus: "DISPATCHED",
      },
    });

    // Attempt 1: wrong OTP -> 2 left
    await expect(
      otpService.verifyOtp({
        challengeId,
        phone: testPhone,
        accountType: "CUSTOMER",
        purpose: "LOGIN",
        otp: "000001",
      })
    ).rejects.toThrow("2 attempts remaining");

    // Attempt 2: wrong OTP -> 1 left
    await expect(
      otpService.verifyOtp({
        challengeId,
        phone: testPhone,
        accountType: "CUSTOMER",
        purpose: "LOGIN",
        otp: "000002",
      })
    ).rejects.toThrow("1 attempts remaining");

    // Attempt 3: wrong OTP -> 0 left, revoked
    await expect(
      otpService.verifyOtp({
        challengeId,
        phone: testPhone,
        accountType: "CUSTOMER",
        purpose: "LOGIN",
        otp: "000003",
      })
    ).rejects.toThrow("Maximum verification attempts exceeded");

    // Verify in DB that attemptsLeft is 0
    const rec = await prisma.otpChallenge.findUnique({ where: { id: challengeId } });
    expect(rec?.attemptsLeft).toBe(0);
  });

  it("rejects expired OTP challenge", async () => {
    const testPhone = `+9166666${Math.floor(10000 + Math.random() * 90000)}`;
    const challengeId = crypto.randomUUID();
    const tokenHash = otpService.computeOtpHash({
      challengeId,
      phoneNormalized: testPhone,
      accountType: "CUSTOMER",
      purpose: "LOGIN",
      otp: "123456",
    });

    await prisma.otpChallenge.create({
      data: {
        id: challengeId,
        phoneNormalized: testPhone,
        accountType: "CUSTOMER",
        purpose: "LOGIN",
        tokenHash,
        attemptsLeft: 3,
        createdAt: new Date(Date.now() - 400000),
        expiresAt: new Date(Date.now() - 1000), // Expired
        cooldownUntil: new Date(Date.now() - 340000),
        deliveryStatus: "DISPATCHED",
      },
    });

    await expect(
      otpService.verifyOtp({
        challengeId,
        phone: testPhone,
        accountType: "CUSTOMER",
        purpose: "LOGIN",
        otp: "123456",
      })
    ).rejects.toThrow("OTP challenge has expired");
  });

  it("detects MSG91 delivery failure when provider returns HTTP 200 with error body", async () => {
    const msg91Service = new OtpService(
      prisma,
      hmacSecret,
      "dummy_auth_key",
      "dummy_template_id",
      "https://control.msg91.com"
    );

    // Mock global fetch to return HTTP 200 with error body type: "error"
    const originalFetch = global.fetch;
    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({ type: "error", message: "Invalid mobile number format" }),
    } as any);

    try {
      await expect(
        msg91Service.deliverOtpViaMsg91("+910000000000", "123456")
      ).rejects.toThrow("MSG91 OTP delivery failed: Invalid mobile number format");
    } finally {
      global.fetch = originalFetch;
    }
  });

  it("detects MSG91 provider timeout after 4 seconds and throws descriptive error", async () => {
    const msg91Service = new OtpService(
      prisma,
      hmacSecret,
      "dummy_auth_key",
      "dummy_template_id",
      "https://control.msg91.com"
    );

    const originalFetch = global.fetch;
    const timeoutError = new Error("The operation was aborted");
    timeoutError.name = "TimeoutError";
    global.fetch = vi.fn().mockRejectedValue(timeoutError);

    try {
      await expect(
        msg91Service.deliverOtpViaMsg91("+919876543210", "123456")
      ).rejects.toThrow("SMS gateway timed out after 4 seconds");
    } finally {
      global.fetch = originalFetch;
    }
  });

  it("enforces durable rate limit boundary: 10 requests/hr per IP across different phones", async () => {
    const testIp = `198.51.100.${Math.floor(1 + Math.random() * 250)}`;

    // Dispatch 10 OTP requests from same IP using distinct phone numbers
    for (let i = 0; i < 10; i++) {
      const distinctPhone = `+9191000${Math.floor(10000 + Math.random() * 90000)}`;
      const res = await otpService.generateAndSendOtp(
        {
          phone: distinctPhone,
          accountType: "CUSTOMER",
          purpose: "LOGIN",
        },
        { ipAddress: testIp }
      );
      expect(res.challengeId).toBeDefined();
    }

    // 11th request from same IP must be rejected
    const eleventhPhone = `+9191000${Math.floor(10000 + Math.random() * 90000)}`;
    await expect(
      otpService.generateAndSendOtp(
        {
          phone: eleventhPhone,
          accountType: "CUSTOMER",
          purpose: "LOGIN",
        },
        { ipAddress: testIp }
      )
    ).rejects.toThrow("IP rate limit exceeded: maximum 10 OTP requests per hour");
  });

  it("handles concurrent phone limit reservations atomically (max 5 succeed)", async () => {
    const concurrentPhone = `+9192000${Math.floor(10000 + Math.random() * 90000)}`;
    // Fire 7 parallel requests for the same phone
    const promises = Array.from({ length: 7 }, (_, i) =>
      otpService.generateAndSendOtp(
        {
          phone: concurrentPhone,
          accountType: "CUSTOMER",
          purpose: "LOGIN",
        },
        { ipAddress: `192.0.2.${i + 1}` } // Distinct IPs to isolate phone rate limit
      )
    );

    const results = await Promise.allSettled(promises);
    const fulfilled = results.filter((r) => r.status === "fulfilled");
    const rejected = results.filter((r) => r.status === "rejected");

    expect(fulfilled.length).toBe(5);
    expect(rejected.length).toBe(2);
    for (const r of rejected) {
      if (r.status === "rejected") {
        expect(r.reason.message).toContain("Phone rate limit exceeded: maximum 5 OTP requests per hour");
      }
    }
  });

  it("handles concurrent IP limit reservations atomically (max 10 succeed)", async () => {
    const concurrentIp = `203.0.113.${Math.floor(1 + Math.random() * 250)}`;
    // Fire 13 parallel requests with distinct phones from the same IP
    const promises = Array.from({ length: 13 }, () => {
      const distinctPhone = `+9193000${Math.floor(10000 + Math.random() * 90000)}`;
      return otpService.generateAndSendOtp(
        {
          phone: distinctPhone,
          accountType: "CUSTOMER",
          purpose: "LOGIN",
        },
        { ipAddress: concurrentIp }
      );
    });

    const results = await Promise.allSettled(promises);
    const fulfilled = results.filter((r) => r.status === "fulfilled");
    const rejected = results.filter((r) => r.status === "rejected");

    expect(fulfilled.length).toBe(10);
    expect(rejected.length).toBe(3);
    for (const r of rejected) {
      if (r.status === "rejected") {
        expect(r.reason.message).toContain("IP rate limit exceeded: maximum 10 OTP requests per hour");
      }
    }
  });

  it("accepts definitive MSG91 success response", async () => {
    const msg91Service = new OtpService(
      prisma,
      hmacSecret,
      "dummy_auth_key",
      "dummy_template_id",
      "https://control.msg91.com"
    );

    const originalFetch = global.fetch;
    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({ type: "success", message: "OTP sent successfully" }),
    } as any);

    try {
      await expect(
        msg91Service.deliverOtpViaMsg91("+919876500001", "123456")
      ).resolves.toBeUndefined();
    } finally {
      global.fetch = originalFetch;
    }
  });

  it("rejects ambiguous MSG91 response status and fails closed", async () => {
    const msg91Service = new OtpService(
      prisma,
      hmacSecret,
      "dummy_auth_key",
      "dummy_template_id",
      "https://control.msg91.com"
    );

    const originalFetch = global.fetch;
    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({ type: "pending", message: "Message queued" }),
    } as any);

    try {
      await expect(
        msg91Service.deliverOtpViaMsg91("+919876500002", "123456")
      ).rejects.toThrow("MSG91 OTP delivery failed: Ambiguous provider status 'pending'");
    } finally {
      global.fetch = originalFetch;
    }
  });

  it("rejects malformed MSG91 response body and fails closed", async () => {
    const msg91Service = new OtpService(
      prisma,
      hmacSecret,
      "dummy_auth_key",
      "dummy_template_id",
      "https://control.msg91.com"
    );

    const originalFetch = global.fetch;
    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({ invalid_payload: 123 }),
    } as any);

    try {
      await expect(
        msg91Service.deliverOtpViaMsg91("+919876500003", "123456")
      ).rejects.toThrow("MSG91 OTP delivery failed: Ambiguous provider status 'undefined'");
    } finally {
      global.fetch = originalFetch;
    }
  });

  it("transitions challenge deliveryStatus to DISPATCHED on successful delivery", async () => {
    const msg91Service = new OtpService(
      prisma,
      hmacSecret,
      "dummy_auth_key",
      "dummy_template_id",
      "https://control.msg91.com"
    );

    const originalFetch = global.fetch;
    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({ type: "success", message: "OTP sent successfully" }),
    } as any);

    try {
      const phone = `+9194000${Math.floor(10000 + Math.random() * 90000)}`;
      const res = await msg91Service.generateAndSendOtp({
        phone,
        accountType: "CUSTOMER",
        purpose: "LOGIN",
      });

      const record = await prisma.otpChallenge.findUnique({
        where: { id: res.challengeId },
      });
      expect(record?.deliveryStatus).toBe("DISPATCHED");
    } finally {
      global.fetch = originalFetch;
    }
  });

  it("transitions challenge deliveryStatus to FAILED on delivery error and preserves FAILED record", async () => {
    const msg91Service = new OtpService(
      prisma,
      hmacSecret,
      "dummy_auth_key",
      "dummy_template_id",
      "https://control.msg91.com"
    );

    const originalFetch = global.fetch;
    global.fetch = vi.fn().mockResolvedValue({
      ok: false,
      status: 502,
      json: async () => ({ type: "error", message: "Bad Gateway" }),
    } as any);

    try {
      const phone = `+9195000${Math.floor(10000 + Math.random() * 90000)}`;
      let challengeId: string | undefined;

      await expect(
        msg91Service.generateAndSendOtp({
          phone,
          accountType: "CUSTOMER",
          purpose: "LOGIN",
        })
      ).rejects.toThrow("MSG91 OTP delivery failed: HTTP 502 Bad Gateway");

      // Verify that the record was persisted with FAILED status
      const failedRecord = await prisma.otpChallenge.findFirst({
        where: { phoneNormalized: phone },
        orderBy: { createdAt: "desc" },
      });
      expect(failedRecord).not.toBeNull();
      expect(failedRecord?.deliveryStatus).toBe("FAILED");
    } finally {
      global.fetch = originalFetch;
    }
  });
});
