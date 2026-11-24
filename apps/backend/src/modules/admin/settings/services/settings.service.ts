import type { PrismaClient, Prisma } from "../../../../database/generated/client/client.js";
import { recordAdminAudit } from "../../utils/audit-logger.js";
import type { SettingsTabId } from "@fillcart/validations";

const SENSITIVE_KEY_REGEX = /api[_-]?key|secret|token|password|webhook|credential|private[_-]?key/i;
const MASKED_PLACEHOLDER = "••••••••";

export class SettingsService {
  constructor(private prisma: PrismaClient) {}

  public async getSettingsByGroup(group: SettingsTabId): Promise<{
    group: SettingsTabId;
    settings: Record<string, unknown>;
  }> {
    const records = await this.prisma.systemSetting.findMany({
      where: { tabId: group },
      orderBy: { key: "asc" },
    });

    const settingsObj: Record<string, unknown> = {};
    for (const r of records) {
      let val = r.value;
      if (r.isEncrypted || SENSITIVE_KEY_REGEX.test(r.key)) {
        val = MASKED_PLACEHOLDER;
      }
      settingsObj[r.key] = val;
    }

    return {
      group,
      settings: settingsObj,
    };
  }

  public async updateSettingsByGroup(
    group: SettingsTabId,
    newSettings: Record<string, unknown>,
    adminUserId: string,
    ipAddress?: string,
    userAgent?: string
  ): Promise<{
    group: SettingsTabId;
    settings: Record<string, unknown>;
  }> {
    // 1. Fetch current settings for this group
    const currentRecords = await this.prisma.systemSetting.findMany({
      where: { tabId: group },
    });
    const currentMap = new Map<string, { value: unknown; isEncrypted: boolean }>();
    for (const r of currentRecords) {
      currentMap.set(r.key, { value: r.value, isEncrypted: r.isEncrypted });
    }

    const auditBefore: Record<string, unknown> = {};
    const auditAfter: Record<string, unknown> = {};
    const finalMaskedSettings: Record<string, unknown> = {};

    return await this.prisma.$transaction(async (tx) => {
      for (const [key, rawValue] of Object.entries(newSettings)) {
        const isSensitive = SENSITIVE_KEY_REGEX.test(key);
        const existing = currentMap.get(key);

        let finalValue = rawValue;
        let isEncrypted = isSensitive;

        // If client sent back the mask, preserve existing value in DB
        if (rawValue === MASKED_PLACEHOLDER && existing) {
          finalValue = existing.value;
          isEncrypted = existing.isEncrypted;
        }

        // Upsert setting row
        await tx.systemSetting.upsert({
          where: { key },
          create: {
            tabId: group,
            key,
            value: finalValue as Prisma.InputJsonValue,
            isEncrypted,
            updatedByUserId: adminUserId,
          },
          update: {
            tabId: group,
            value: finalValue as Prisma.InputJsonValue,
            isEncrypted,
            updatedByUserId: adminUserId,
          },
        });

        // Audit diff preparation (strictly never logging real secrets)
        if (isSensitive || isEncrypted) {
          auditBefore[key] = MASKED_PLACEHOLDER;
          auditAfter[key] = rawValue === MASKED_PLACEHOLDER ? MASKED_PLACEHOLDER : "[REDACTED_SECRET]";
          finalMaskedSettings[key] = MASKED_PLACEHOLDER;
        } else {
          auditBefore[key] = existing ? existing.value : null;
          auditAfter[key] = finalValue;
          finalMaskedSettings[key] = finalValue;
        }
      }

      await recordAdminAudit(tx, {
        adminUserId,
        action: "CONFIG_CHANGE",
        targetType: "SETTING",
        targetId: group,
        changesSummary: {
          group,
          before: auditBefore,
          after: auditAfter,
        },
        ipAddress,
        userAgent,
      });

      return {
        group,
        settings: finalMaskedSettings,
      };
    });
  }
}
