import type { PrismaClient } from "../../src/database/generated/client/client.js";

/**
 * Additive, idempotent local seed for new Admin Modules permissions and profile assignments.
 * Does not overwrite existing core baseline; safely upserts newly added operational keys.
 */
export async function seedAdminModulesPermissions(prisma: PrismaClient): Promise<void> {
  const newPermissions = [
    // Dashboard
    { action: "view", resource: "dashboard", description: "View dashboard operational metrics and summary" },

    // Verification / KYC
    { action: "view", resource: "verification", description: "View KYC documents and applicant profiles" },
    { action: "review", resource: "verification", description: "Review and approve/reject individual KYC documents" },
    { action: "decide", resource: "verification", description: "Make final onboarding approve/reject decisions" },

    // Vendors
    { action: "view", resource: "vendors", description: "View vendor directory and details" },
    { action: "manage", resource: "vendors", description: "Manage vendor operational status and commissions" },

    // Riders
    { action: "view", resource: "riders", description: "View rider fleet and profiles" },
    { action: "manage", resource: "riders", description: "Manage rider operational status and availability" },

    // Orders
    { action: "view", resource: "orders", description: "View customer order records and dispatch history" },
    { action: "cancel", resource: "orders", description: "Cancel customer orders with audit trail and refund trigger" },
    { action: "assign_rider", resource: "orders", description: "Manually assign or reassign delivery riders" },

    // Finance Hub
    { action: "view", resource: "finance", description: "View finance KPIs, revenue overview, settlements, commissions, coupons, and taxes" },
    { action: "process", resource: "finance", description: "Process and lock settlement payout batches" },
    { action: "manage", resource: "finance", description: "Create or update platform commissions and promotional coupons" },

    // Reports
    { action: "view", resource: "reports", description: "View sales, vendor, and rider performance reports" },

    // Notifications
    { action: "view", resource: "notifications", description: "View admin operational notifications" },
    { action: "manage", resource: "notifications", description: "Mark admin notifications as read" },

    // Support
    { action: "view", resource: "support", description: "View support desk contact information" },
    { action: "manage", resource: "support", description: "Submit internal support tickets" },

    // Reauth / Settings
    { action: "access", resource: "settings", description: "Re-authenticate admin for sensitive settings access" },
  ];

  // 1. Idempotently upsert each permission
  const permissionsMap = new Map<string, string>();
  for (const permDef of newPermissions) {
    const key = `${permDef.resource}:${permDef.action}`;
    const p = await prisma.permission.upsert({
      where: {
        action_resource: {
          action: permDef.action,
          resource: permDef.resource,
        },
      },
      update: { description: permDef.description },
      create: permDef,
    });
    permissionsMap.set(key, p.id);
  }

  // 2. Profile Definitions & Assigned Canonical Keys
  const profileMappings: Record<string, string[]> = {
    "Super Admin": [
      // Wildcard / full access handled automatically by Super Admin profile
    ],
    "Operations": [
      "dashboard:view",
      "verification:view",
      "verification:review",
      "verification:decide",
      "vendors:view",
      "vendors:manage",
      "riders:view",
      "riders:manage",
      "orders:view",
      "orders:cancel",
      "orders:assign_rider",
      "reports:view",
      "notifications:view",
      "notifications:manage",
      "support:view",
      "support:manage",
    ],
    "Finance": [
      "dashboard:view",
      "finance:view",
      "finance:process",
      "finance:manage",
      "reports:view",
      "notifications:view",
      "notifications:manage",
      "support:view",
      "support:manage",
    ],
    "Support": [
      "dashboard:view",
      "orders:view",
      "vendors:view",
      "riders:view",
      "notifications:view",
      "notifications:manage",
      "support:view",
      "support:manage",
    ],
  };

  // 3. Upsert profiles and mappings
  for (const [profileName, keys] of Object.entries(profileMappings)) {
    const profile = await prisma.permissionProfile.upsert({
      where: { name: profileName },
      update: {},
      create: {
        name: profileName,
        description: `Standard ${profileName} profile`,
        isSystem: true,
      },
    });

    for (const key of keys) {
      const permissionId = permissionsMap.get(key);
      if (!permissionId) continue;

      await prisma.profilePermission.upsert({
        where: {
          profileId_permissionId: {
            profileId: profile.id,
            permissionId,
          },
        },
        update: {},
        create: {
          profileId: profile.id,
          permissionId,
        },
      });
    }
  }
}
