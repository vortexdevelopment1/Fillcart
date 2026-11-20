import { describe, it, expect, beforeEach, vi } from "vitest";
import { OtpService } from "../../src/modules/auth/services/otp.service.js";

describe("Milestone 2.3 — Durable OtpService Tests", () => {
  let otpService: OtpService;
  let mockPrisma: any;
  const secret = "test-hmac-secret-min16chars!";

  beforeEach(() => {
    mockPrisma = {
      $transaction: vi.fn(async (cb) => {
        return await cb({
          $executeRaw: vi.fn().mockResolvedValue(1),
          rateLimitRecord: {
            count: vi.fn().mockResolvedValue(0),
            createMany: vi.fn().mockResolvedValue({ count: 2 }),
          },
        });
      }),
      otpChallenge: {
        create: vi.fn().mockResolvedValue({ id: "challenge-123" }),
        findUnique: vi.fn().mockResolvedValue(null),
        update: vi.fn().mockResolvedValue({}),
      },
    };

    otpService = new OtpService(mockPrisma, secret);
  });

  it("generates and durably persists an OTP challenge", async () => {
    const res = await otpService.generateAndSendOtp({
      phone: "+919876543210",
      accountType: "CUSTOMER",
      purpose: "LOGIN",
    });

    expect(res.challengeId).toBeDefined();
    expect(res.cooldownSeconds).toBe(60);
    expect(mockPrisma.otpChallenge.create).toHaveBeenCalledOnce();
  });

  it("rejects non-existent or consumed challenge", async () => {
    mockPrisma.otpChallenge.findUnique.mockResolvedValueOnce(null);

    await expect(
      otpService.verifyOtp({
        challengeId: "non-existent",
        otp: "123456",
        phone: "+919876543210",
        accountType: "CUSTOMER",
        purpose: "LOGIN",
      })
    ).rejects.toThrowError(/Invalid or expired OTP challenge/);
  });

  it("persists attempt decrement on invalid OTP submission", async () => {
    const now = new Date();
    mockPrisma.otpChallenge.findUnique.mockResolvedValueOnce({
      id: "ch-1",
      phoneNormalized: "+919876543210",
      accountType: "CUSTOMER",
      purpose: "LOGIN",
      tokenHash: "dummyhash",
      attemptsLeft: 3,
      expiresAt: new Date(now.getTime() + 5 * 60 * 1000),
      cooldownUntil: new Date(now.getTime() + 60 * 1000),
      consumedAt: null,
      userId: null,
      sessionId: null,
    });

    await expect(
      otpService.verifyOtp({
        challengeId: "ch-1",
        otp: "000000", // Wrong OTP
        phone: "+919876543210",
        accountType: "CUSTOMER",
        purpose: "LOGIN",
      })
    ).rejects.toThrowError(/Invalid OTP code. 2 attempts remaining./);

    expect(mockPrisma.otpChallenge.update).toHaveBeenCalledWith({
      where: { id: "ch-1" },
      data: { attemptsLeft: 2 },
    });
  });
});
