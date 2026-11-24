import { z } from "zod";

export const settingsTabIdEnum = z.enum([
  "GENERAL",
  "ORDERS",
  "ONBOARDING",
  "FINANCE",
  "NOTIFICATIONS",
  "SECURITY",
]);
export const settingsTabIdSchema = settingsTabIdEnum;

export type SettingsTabId = z.infer<typeof settingsTabIdEnum>;

// 1. General Settings
export const generalSettingsSchema = z.object({
  platformName: z.string().min(1).default("Fillkart Hyperlocal"),
  logoUrl: z.string().default("/favicon.ico"),
  supportEmail: z.string().email().default("support@fillkart.in"),
  supportPhone: z.string().default("+91 1800 202 8899"),
  timezone: z.string().default("Asia/Kolkata (IST +05:30)"),
  currency: z.string().default("INR (₹)"),
  language: z.string().default("English (India)"),
  maintenanceMode: z.boolean().default(false),
  maintenanceMessage: z.string().default(
    "We are upgrading Fillkart systems. We will be back shortly with lightning-fast delivery!"
  ),
});

// 2. Orders & Dispatch Settings
export const ordersSettingsSchema = z.object({
  assignmentMode: z.enum(["Manual", "Auto"]).default("Manual"),
  autoAssignRadiusKm: z.number().positive().default(5),
  riderAcceptTimeoutSec: z.number().int().positive().default(45),
  cancellationWindowMin: z.number().int().nonnegative().default(5),
  deliveryRadiusKm: z.number().positive().default(15),
  minOrderValueInr: z.number().nonnegative().default(99),
});

// 3. Onboarding Settings
export const onboardingSettingsSchema = z.object({
  allowPharmacy: z.boolean().default(true),
  gstOptional: z.boolean().default(false),
  docExpiryReminderDays: z.number().int().positive().default(15),
  autoActivateAfterVerification: z.boolean().default(false),
});

// 4. Finance Settings
export const financeSettingsSchema = z.object({
  defaultCommissionPct: z.number().min(0).max(100).default(12),
  settlementCycle: z.enum(["Weekly", "Monthly"]).default("Weekly"),
  paymentMethods: z.object({
    upi: z.boolean().default(true),
    card: z.boolean().default(true),
    cod: z.boolean().default(true),
    wallet: z.boolean().default(true),
  }),
  refundWindowDays: z.number().int().nonnegative().default(7),
  minPayoutInr: z.number().nonnegative().default(500),
});

// 5. Notifications Settings
export const notificationChannelSchema = z.object({
  id: z.enum(["sms", "whatsapp", "email", "push"]),
  name: z.string(),
  enabled: z.boolean(),
  provider: z.string(),
  senderId: z.string(),
  apiKey: z.string(),
});

export const notificationTemplateSchema = z.object({
  id: z.string(),
  title: z.string(),
  event: z.string(),
  subject: z.string(),
  body: z.string(),
  variables: z.array(z.string()),
});

export const notificationsSettingsSchema = z.object({
  channels: z.object({
    sms: notificationChannelSchema,
    whatsapp: notificationChannelSchema,
    email: notificationChannelSchema,
    push: notificationChannelSchema,
  }),
  templates: z.array(notificationTemplateSchema),
});

// 6. Security Settings
export const securitySettingsSchema = z.object({
  adminLoginOtp: z.boolean().default(true),
  accessTokenExpiryMin: z.number().int().positive().default(60),
  refreshTokenExpiryDays: z.number().int().positive().default(30),
  sessionTimeoutMin: z.number().int().positive().default(30),
  passwordRules: z.object({
    minLength: z.number().int().min(6).default(8),
    requireNumberSymbol: z.boolean().default(true),
  }),
  loginAttemptLimit: z.number().int().positive().default(5),
  ipAllowlist: z.array(z.string()).default([]),
  logRetention: z.object({
    adminAuditDays: z.number().int().positive(),
    apiDays: z.number().int().positive(),
    userActivityDays: z.number().int().positive(),
    orderDays: z.number().int().positive(),
    securityDays: z.number().int().positive(),
    paymentDays: z.number().int().positive(),
  }),
});

// Map of validators per SettingsTabId (allowing partial updates)
export const groupSettingsSchemas = {
  GENERAL: generalSettingsSchema.partial().passthrough(),
  ORDERS: ordersSettingsSchema.partial().passthrough(),
  ONBOARDING: onboardingSettingsSchema.partial().passthrough(),
  FINANCE: financeSettingsSchema.partial().passthrough(),
  NOTIFICATIONS: notificationsSettingsSchema.partial().passthrough(),
  SECURITY: securitySettingsSchema.partial().passthrough(),
} as const;

export function validateGroupSettingsPayload(
  group: SettingsTabId,
  payload: unknown
): Record<string, unknown> {
  const schema = groupSettingsSchemas[group];
  if (!schema) {
    throw new Error(`Unknown settings group: ${group}`);
  }
  return schema.parse(payload) as Record<string, unknown>;
}

export const updateSettingsGroupSchema = z.object({
  settings: z.record(z.string(), z.unknown()),
});

export type GeneralSettings = z.infer<typeof generalSettingsSchema>;
export type OrdersSettings = z.infer<typeof ordersSettingsSchema>;
export type OnboardingSettings = z.infer<typeof onboardingSettingsSchema>;
export type FinanceSettings = z.infer<typeof financeSettingsSchema>;
export type NotificationsSettings = z.infer<typeof notificationsSettingsSchema>;
export type SecuritySettings = z.infer<typeof securitySettingsSchema>;
export type UpdateSettingsGroupRequest = z.infer<typeof updateSettingsGroupSchema>;
