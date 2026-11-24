import { z } from "zod";

export const settingsTabIdSchema = z.enum([
  "GENERAL",
  "ORDERS",
  "ONBOARDING",
  "FINANCE",
  "NOTIFICATIONS",
  "SECURITY",
]);

export const updateSettingsGroupSchema = z.object({
  settings: z.record(z.string(), z.unknown()),
});

export type SettingsTabId = z.infer<typeof settingsTabIdSchema>;
export type UpdateSettingsGroupRequest = z.infer<typeof updateSettingsGroupSchema>;
