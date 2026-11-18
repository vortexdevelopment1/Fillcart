import { z } from "zod";

export const accountTypeSchema = z.enum([
  "CUSTOMER",
  "VENDOR_APPLICANT",
  "RIDER_APPLICANT",
  "ADMIN",
]);

export const userStatusSchema = z.enum([
  "ACTIVE",
  "SUSPENDED",
  "DEACTIVATED",
  "PENDING_APPROVAL",
]);

export const canonicalUuidSchema = z
  .string()
  .regex(
    /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/,
    "Must be a canonical lowercase RFC 4122 UUIDv4"
  );

export const normalizedEmailSchema = z
  .string()
  .email()
  .transform((val) => val.trim().toLowerCase());

export const normalizedPhoneSchema = z
  .string()
  .regex(/^\+[1-9]\d{1,14}$/, "Must be in E.164 format (+919876543210)");

export const passwordSchema = z
  .string()
  .min(8, "Password must be at least 8 characters")
  .max(128, "Password must be at most 128 characters");

export const tokenPurposeSchema = z.literal("access");

export const audienceSchema = z.enum([
  "customer-backend",
  "vendor-backend",
  "rider-backend",
  "admin-backend",
  "vendor-onboarding",
  "rider-onboarding",
]);

export const registerRequestSchema = z.object({
  email: z.string().email(),
  password: passwordSchema,
  fullName: z.string().min(1).max(100),
  phone: normalizedPhoneSchema.optional(),
  accountType: z.enum(["CUSTOMER", "VENDOR_APPLICANT", "RIDER_APPLICANT"]).default("CUSTOMER"),
});

export const loginRequestSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

export const refreshRequestSchema = z.object({
  refreshToken: z.string().min(32),
});

export const logoutRequestSchema = z.object({
  refreshToken: z.string().min(32).optional(),
});

export const verifySessionRequestSchema = z.object({
  userAccessToken: z.string().min(20),
  requiredPermission: z.string().optional(), // e.g. "orders:create", "products:manage"
});

export const sendOtpRequestSchema = z.object({
  phone: normalizedPhoneSchema,
  accountType: z.enum(["CUSTOMER", "VENDOR_APPLICANT", "RIDER_APPLICANT"]).default("CUSTOMER"),
  purpose: z.enum(["REGISTRATION", "LOGIN", "PHONE_VERIFICATION"]).default("LOGIN"),
});

export const verifyOtpRequestSchema = z.object({
  challengeId: z.string().min(1),
  otp: z.string().regex(/^\d{6}$/, "OTP must be exactly 6 digits"),
  phone: normalizedPhoneSchema,
  accountType: z.enum(["CUSTOMER", "VENDOR_APPLICANT", "RIDER_APPLICANT"]).default("CUSTOMER"),
  purpose: z.enum(["REGISTRATION", "LOGIN", "PHONE_VERIFICATION"]).default("LOGIN"),
});

export const linkAccountRequestSchema = z.object({
  targetUserId: canonicalUuidSchema,
  stepUpGrant: z.string().min(20),
});

export type RegisterRequest = z.infer<typeof registerRequestSchema>;
export type LoginRequest = z.infer<typeof loginRequestSchema>;
export type RefreshRequest = z.infer<typeof refreshRequestSchema>;
export type VerifySessionRequest = z.infer<typeof verifySessionRequestSchema>;
export type SendOtpRequest = z.infer<typeof sendOtpRequestSchema>;
export type VerifyOtpRequest = z.infer<typeof verifyOtpRequestSchema>;
export type LinkAccountRequest = z.infer<typeof linkAccountRequestSchema>;
