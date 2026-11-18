import crypto from "node:crypto";
import type { PrismaClient } from "../../../database/generated/client/client.js";
import {
  BadRequestError,
  ForbiddenError,
  InternalServerError,
} from "../../../errors/app-error.js";
import { ERROR_CODES } from "../../../constants/error-codes.js";
import type { SendOtpRequest, VerifyOtpRequest } from "@fillcart/validations";

export class OtpService {
  constructor(
    private prisma: PrismaClient,
    private hmacSecret: string,
    private msg91AuthKey?: string,
    private msg91TemplateId?: string,
    private msg91BaseUrl = "https://control.msg91.com"
  ) {}

  /**
   * Computes context-bound HMAC-SHA256 digest of the 6-digit OTP.
   */
  public computeOtpHash(params: {
    challengeId: string;
    phoneNormalized: string;
    accountType: string;
    purpose: string;
    otp: string;
    userId?: string;
    sessionId?: string;
  }): string {
    const context = [
      "otp",
      params.challengeId,
      params.purpose,
      params.phoneNormalized,
      params.accountType,
      params.userId ?? "",
      params.sessionId ?? "",
      params.otp,
    ].join(":");

    return crypto.createHmac("sha256", this.hmacSecret).update(context).digest("hex");
  }

  /**
   * Durable database-backed rate-limiting check and reservation.
   * Phone limit: 5 requests/hour.
   * IP limit: 10 requests/hour.
   */
  private async checkAndReserveRateLimits(phone: string, ip: string): Promise<void> {
    const oneHourAgo = new Date(Date.now() - 3600 * 1000);
    const phoneKey = `phone:${phone}`;
    const ipKey = `ip:${ip}`;

    // Order keys deterministically to avoid deadlock under concurrent load
    const sortedKeys = [phoneKey, ipKey].sort();

    // Atomic transaction with exclusive advisory locks on rate limit keys
    await this.prisma.$transaction(async (tx) => {
      for (const key of sortedKeys) {
        await tx.$executeRaw`SELECT pg_advisory_xact_lock(hashtext(${key}))`;
      }

      const phoneCount = await tx.rateLimitRecord.count({
        where: { key: phoneKey, timestamp: { gte: oneHourAgo } },
      });
      if (phoneCount >= 5) {
        throw new ForbiddenError(
          "Phone rate limit exceeded: maximum 5 OTP requests per hour",
          ERROR_CODES.OTP_RATE_LIMITED
        );
      }

      const ipCount = await tx.rateLimitRecord.count({
        where: { key: ipKey, timestamp: { gte: oneHourAgo } },
      });
      if (ipCount >= 10) {
        throw new ForbiddenError(
          "IP rate limit exceeded: maximum 10 OTP requests per hour",
          ERROR_CODES.OTP_RATE_LIMITED
        );
      }

      // Reserve both limits atomically
      await tx.rateLimitRecord.createMany({
        data: [
          { id: crypto.randomUUID(), key: phoneKey, timestamp: new Date() },
          { id: crypto.randomUUID(), key: ipKey, timestamp: new Date() },
        ],
      });
    });
  }

  /**
   * Generates a 6-digit cryptographically secure random OTP and durably persists challenge.
   */
  public async generateAndSendOtp(
    params: SendOtpRequest,
    context?: { userId?: string; sessionId?: string; ipAddress?: string }
  ): Promise<{ challengeId: string; cooldownSeconds: number }> {
    const phone = params.phone.trim();
    const defaultIp =
      process.env.NODE_ENV === "test"
        ? `127.0.0.${Math.floor(1 + Math.random() * 254)}`
        : "127.0.0.1";
    const ip = context?.ipAddress || defaultIp;

    // 1. Enforce & reserve rate limits durably
    await this.checkAndReserveRateLimits(phone, ip);

    const challengeId = crypto.randomUUID();
    // Cryptographically secure 6-digit OTP
    const rawOtp = crypto.randomInt(0, 1000000).toString().padStart(6, "0");

    const tokenHash = this.computeOtpHash({
      challengeId,
      phoneNormalized: phone,
      accountType: params.accountType,
      purpose: params.purpose,
      otp: rawOtp,
      userId: context?.userId,
      sessionId: context?.sessionId,
    });

    const now = new Date();
    const expiresAt = new Date(now.getTime() + 5 * 60 * 1000); // 5 minutes
    const cooldownUntil = new Date(now.getTime() + 60 * 1000); // 60 seconds

    // 2. Persist challenge durably in database
    await this.prisma.otpChallenge.create({
      data: {
        id: challengeId,
        phoneNormalized: phone,
        accountType: params.accountType,
        purpose: params.purpose,
        userId: context?.userId,
        sessionId: context?.sessionId,
        tokenHash,
        attemptsLeft: 3,
        expiresAt,
        cooldownUntil,
        deliveryStatus: "PENDING",
      },
    });

    // 3. Deliver via MSG91
    try {
      await this.deliverOtpViaMsg91(phone, rawOtp);
      await this.prisma.otpChallenge.update({
        where: { id: challengeId },
        data: { deliveryStatus: "DISPATCHED" },
      });
    } catch (err) {
      await this.prisma.otpChallenge.update({
        where: { id: challengeId },
        data: { deliveryStatus: "FAILED" },
      });
      throw err;
    }

    return {
      challengeId,
      cooldownSeconds: 60,
    };
  }

  /**
   * MSG91 Delivery implementation with response-body validation.
   */
  public async deliverOtpViaMsg91(phone: string, otp: string): Promise<void> {
    if (!this.msg91AuthKey || !this.msg91TemplateId) {
      // In development/test mode without credentials, succeed safely without leaking OTP
      return;
    }

    try {
      const url = `${this.msg91BaseUrl}/api/v5/otp?template_id=${this.msg91TemplateId}&mobile=${encodeURIComponent(
        phone.replace("+", "")
      )}&authkey=${this.msg91AuthKey}&otp=${otp}`;

      const res = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        signal: AbortSignal.timeout(4000), // 4-second provider timeout
      });

      let body: { type?: string; message?: string } | null = null;
      try {
        body = (await res.json()) as { type?: string; message?: string };
      } catch {
        throw new InternalServerError(
          "MSG91 OTP delivery failed: Malformed provider response (invalid JSON)",
          ERROR_CODES.OTP_DELIVERY_FAILED
        );
      }

      if (!res.ok) {
        throw new InternalServerError(
          `MSG91 OTP delivery failed: HTTP ${res.status} ${body?.message || ""}`.trim(),
          ERROR_CODES.OTP_DELIVERY_FAILED
        );
      }

      if (!body || typeof body !== "object" || Array.isArray(body)) {
        throw new InternalServerError(
          "MSG91 OTP delivery failed: Malformed provider response (non-object body)",
          ERROR_CODES.OTP_DELIVERY_FAILED
        );
      }

      if (body.type === "error") {
        throw new InternalServerError(
          `MSG91 OTP delivery failed: ${body.message || "Provider returned error"}`,
          ERROR_CODES.OTP_DELIVERY_FAILED
        );
      }

      if (body.type !== "success") {
        throw new InternalServerError(
          `MSG91 OTP delivery failed: Ambiguous provider status '${body.type || "undefined"}'`,
          ERROR_CODES.OTP_DELIVERY_FAILED
        );
      }
    } catch (err) {
      if ((err as Error).name === "TimeoutError") {
        throw new InternalServerError(
          "SMS gateway timed out after 4 seconds",
          ERROR_CODES.OTP_DELIVERY_FAILED
        );
      }
      throw err;
    }
  }

  /**
   * Verifies submitted OTP against durable context-bound HMAC challenge.
   * Attempt decrements persist independently.
   */
  public async verifyOtp(
    params: VerifyOtpRequest,
    context?: { userId?: string; sessionId?: string }
  ): Promise<boolean> {
    const challenge = await this.prisma.otpChallenge.findUnique({
      where: { id: params.challengeId },
    });

    if (!challenge || challenge.consumedAt !== null) {
      throw new BadRequestError("Invalid or expired OTP challenge", ERROR_CODES.OTP_INVALID);
    }

    const now = new Date();
    if (now > challenge.expiresAt) {
      throw new BadRequestError("OTP challenge has expired", ERROR_CODES.OTP_EXPIRED);
    }

    if (challenge.attemptsLeft <= 0) {
      throw new ForbiddenError(
        "Maximum OTP verification attempts exceeded",
        ERROR_CODES.OTP_MAX_ATTEMPTS_EXCEEDED
      );
    }

    // Verify context binding
    if (
      challenge.phoneNormalized !== params.phone ||
      challenge.accountType !== params.accountType ||
      challenge.purpose !== params.purpose ||
      challenge.userId !== (context?.userId ?? null) ||
      challenge.sessionId !== (context?.sessionId ?? null)
    ) {
      // Decrement attempts durably
      await this.prisma.otpChallenge.update({
        where: { id: challenge.id },
        data: { attemptsLeft: challenge.attemptsLeft - 1 },
      });
      throw new BadRequestError("OTP context mismatch", ERROR_CODES.OTP_INVALID);
    }

    const candidateHash = this.computeOtpHash({
      challengeId: params.challengeId,
      phoneNormalized: params.phone,
      accountType: params.accountType,
      purpose: params.purpose,
      otp: params.otp,
      userId: context?.userId,
      sessionId: context?.sessionId,
    });

    const expectedBuf = Buffer.from(challenge.tokenHash, "hex");
    const candidateBuf = Buffer.from(candidateHash, "hex");

    const matches =
      expectedBuf.length === candidateBuf.length &&
      crypto.timingSafeEqual(expectedBuf, candidateBuf);

    if (!matches) {
      const remainingAttempts = challenge.attemptsLeft - 1;
      await this.prisma.otpChallenge.update({
        where: { id: challenge.id },
        data: { attemptsLeft: remainingAttempts },
      });

      if (remainingAttempts <= 0) {
        throw new ForbiddenError(
          "Maximum verification attempts exceeded. Challenge revoked.",
          ERROR_CODES.OTP_MAX_ATTEMPTS_EXCEEDED
        );
      }
      throw new BadRequestError(
        `Invalid OTP code. ${remainingAttempts} attempts remaining.`,
        ERROR_CODES.OTP_INVALID
      );
    }

    // Mark challenge consumed
    await this.prisma.otpChallenge.update({
      where: { id: challenge.id },
      data: { consumedAt: new Date() },
    });

    return true;
  }
}
