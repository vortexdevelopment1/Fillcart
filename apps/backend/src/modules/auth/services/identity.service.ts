import type { PrismaClient } from "../../../database/generated/client/client.js";
import { PasswordService } from "./password.service.js";
import { SessionService } from "./session.service.js";


import {
  UnauthorizedError,
  BadRequestError,
  ForbiddenError,
} from "../../../errors/app-error.js";
import { ERROR_CODES } from "../../../constants/error-codes.js";
import type { RegisterRequest, LoginRequest } from "@fillcart/validations";
import type { AuthTokens } from "@fillcart/shared-types";

export class IdentityService {
  constructor(
    private prisma: PrismaClient,
    private sessionService: SessionService
  ) {}

  /**
   * Registers a new user account with normalized email and password.
   * Prohibits public creation of ADMIN or operational VENDOR/RIDER accounts.
   */
  public async register(
    data: RegisterRequest,
    clientInfo?: { ipAddress?: string; userAgent?: string }
  ): Promise<{ userId: string; tokens: AuthTokens }> {
    const emailNormalized = data.email.trim().toLowerCase();

    // Prevent public creation of ADMIN
    if (data.accountType === ("ADMIN" as string)) {
      throw new ForbiddenError(
        "Administrative accounts cannot be registered publicly",
        ERROR_CODES.FORBIDDEN
      );
    }

    // Check for duplicate normalized email
    const existing = await this.prisma.user.findUnique({
      where: { emailNormalized },
    });
    if (existing) {
      throw new BadRequestError("An account with this email already exists", ERROR_CODES.USER_ALREADY_EXISTS);
    }

    // Hash using approved Argon2id
    const hashedPassword = await PasswordService.hashPassword(data.password);
    const userId = crypto.randomUUID();

    // Determine default role and approval status
    let status: "ACTIVE" | "PENDING_APPROVAL" = "ACTIVE";
    let roleName = "CUSTOMER";

    if (data.accountType === "VENDOR_APPLICANT" || data.accountType === "RIDER_APPLICANT") {
      status = "PENDING_APPROVAL";
      // Applicant accounts have roleId = null until approved by admin
      roleName = "";
    }

    const role = roleName ? await this.prisma.role.findUnique({ where: { name: roleName } }) : null;

    await this.prisma.$transaction(async (tx) => {
      // 1. Create User
      await tx.user.create({
        data: {
          id: userId,
          emailNormalized,
          displayEmail: data.email,
          fullName: data.fullName,
          phone: data.phone,
          accountType: data.accountType,
          status,
          roleId: role?.id ?? null,
        },
      });

      // 2. Create Credential with Argon2id hash
      await tx.credential.create({
        data: {
          id: crypto.randomUUID(),
          userId,
          type: "PASSWORD",
          secretHash: hashedPassword,
          failedAttempts: 0,
        },
      });
    });

    const tokens = await this.sessionService.createSession(userId, clientInfo);

    return {
      userId,
      tokens,
    };
  }

  /**
   * Authenticates user via normalized email and password.
   * Implements progressive lockout (5 failed attempts -> 15-minute lockout).
   * Prevents account existence leakage.
   * Seamlessly upgrades legacy PBKDF2 hashes to Argon2id on successful login.
   */
  public async login(
    data: LoginRequest,
    clientInfo?: { ipAddress?: string; userAgent?: string }
  ): Promise<AuthTokens> {
    const emailNormalized = data.email.trim().toLowerCase();

    const user = await this.prisma.user.findUnique({
      where: { emailNormalized },
      include: {
        credentials: { where: { type: "PASSWORD" } },
      },
    });

    // Account Enumeration Defense: If user not found, perform dummy verification to balance timing
    if (!user || user.credentials.length === 0 || !user.credentials[0]) {
      await PasswordService.verifyPassword(
        "dummy-password",
        "$argon2id$v=19$m=65536,t=3,p=1$dummySaltForAntiTiming123$dummyHashValueForConstantTimeOp"
      );
      throw new UnauthorizedError("Invalid email or password", ERROR_CODES.INVALID_CREDENTIALS);
    }

    const credential = user.credentials[0];
    const now = new Date();

    // Check progressive lockout
    if (credential.lockedUntil && now < credential.lockedUntil) {
      const waitMinutes = Math.ceil((credential.lockedUntil.getTime() - now.getTime()) / (60 * 1000));
      throw new ForbiddenError(
        `Account is temporarily locked due to consecutive failed attempts. Try again in ${waitMinutes} minutes.`,
        ERROR_CODES.ACCOUNT_LOCKED
      );
    }

    const { valid, needsRehash } = await PasswordService.verifyPassword(data.password, credential.secretHash);

    if (!valid) {
      const newFailedAttempts = credential.failedAttempts + 1;
      let lockedUntil: Date | null = null;

      if (newFailedAttempts >= 5) {
        lockedUntil = new Date(now.getTime() + 15 * 60 * 1000); // 15-minute lockout
      }

      await this.prisma.credential.update({
        where: { id: credential.id },
        data: {
          failedAttempts: newFailedAttempts,
          lockedUntil,
        },
      });

      throw new UnauthorizedError("Invalid email or password", ERROR_CODES.INVALID_CREDENTIALS);
    }

    // Successful login: Reset failed attempts
    const updateData: { failedAttempts: number; lockedUntil: null; secretHash?: string } = {
      failedAttempts: 0,
      lockedUntil: null,
    };

    // Rehash-on-success: Upgrade legacy hash to Argon2id
    if (needsRehash) {
      updateData.secretHash = await PasswordService.hashPassword(data.password);
    }

    await this.prisma.credential.update({
      where: { id: credential.id },
      data: updateData,
    });

    return await this.sessionService.createSession(user.id, clientInfo);
  }
}
