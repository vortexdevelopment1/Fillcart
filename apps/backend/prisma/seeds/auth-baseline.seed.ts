import type { PrismaClient } from "../../src/database/generated/client/client.js";

/**
 * Seeds the foundational Central Authentication & Authorization baseline.
 *
 * Seeded entities:
 * 1. Standard operational roles: CUSTOMER, VENDOR, RIDER, ADMIN.
 * 2. Foundational operational and administrative permissions.
 * 3. Base Role-to-Permission mappings.
 * 4. System Administrative Permission Profiles and their permission mappings.
 *
 * Guarantees:
 * - Strictly idempotent: safe to run multiple times without duplicate record errors.
 * - Zero real user accounts or credentials created.
 * - Keeps service scopes separate from user permissions.
 */
export async function seedAuthBaseline(prisma: PrismaClient): Promise<void> {
  console.log("[Seed] Starting Central Auth baseline seeding...");

  // ---------------------------------------------------------------------------
  // 1. Roles
  // ---------------------------------------------------------------------------
  const rolesData = [
    {
      name: "CUSTOMER",
      description: "Standard customer account with shopping and ordering access",
      isSystem: true,
    },
    {
      name: "VENDOR",
      description: "Verified merchant account with product and inventory management access",
      isSystem: true,
    },
    {
      name: "RIDER",
      description: "Verified delivery partner account with order delivery access",
      isSystem: true,
    },
    {
      name: "ADMIN",
      description: "Administrative staff account with scoped operational access",
      isSystem: true,
    },
  ];

  const rolesMap = new Map<string, string>();
  for (const roleDef of rolesData) {
    const role = await prisma.role.upsert({
      where: { name: roleDef.name },
      update: {
        description: roleDef.description,
        isSystem: roleDef.isSystem,
      },
      create: roleDef,
    });
    rolesMap.set(role.name, role.id);
  }
  console.log(`[Seed] Synced ${rolesMap.size} system roles.`);

  // ---------------------------------------------------------------------------
  // 2. Baseline Permissions
  // ---------------------------------------------------------------------------
  const permissionsData = [
    // Catalog & Products
    { action: "view", resource: "products", description: "View products in the catalog" },
    { action: "manage", resource: "products", description: "Manage vendor product catalog and listings" },
    // Orders
    { action: "view", resource: "orders", description: "View relevant orders" },
    { action: "create", resource: "orders", description: "Create customer orders" },
    { action: "cancel", resource: "orders", description: "Cancel customer orders" },
    { action: "manage", resource: "orders", description: "Manage vendor order pipeline" },
    // Inventory
    { action: "manage", resource: "inventory", description: "Adjust and manage inventory balances" },
    // Deliveries
    { action: "view", resource: "deliveries", description: "View assigned delivery tasks" },
    { action: "update", resource: "deliveries", description: "Update delivery task status" },
    // Admin Operations
    { action: "view", resource: "users", description: "View user accounts and profiles" },
    { action: "suspend", resource: "users", description: "Suspend or deactivate user accounts" },
    { action: "review", resource: "vendors", description: "Review pending vendor applications" },
    { action: "approve", resource: "vendors", description: "Approve or reject vendor applications" },
    { action: "review", resource: "riders", description: "Review pending rider applications" },
    { action: "approve", resource: "riders", description: "Approve or reject rider applications" },
    { action: "invite", resource: "admin", description: "Create and manage admin staff invitations" },
    { action: "audit_view", resource: "admin", description: "View authentication and security audit logs" },
  ];

  const permissionsMap = new Map<string, string>();
  for (const permDef of permissionsData) {
    const key = `${permDef.action}:${permDef.resource}`;
    const perm = await prisma.permission.upsert({
      where: {
        action_resource: {
          action: permDef.action,
          resource: permDef.resource,
        },
      },
      update: {
        description: permDef.description,
      },
      create: permDef,
    });
    permissionsMap.set(key, perm.id);
  }
  console.log(`[Seed] Synced ${permissionsMap.size} baseline permissions.`);

  // ---------------------------------------------------------------------------
  // 3. Role-to-Permission Mappings
  // ---------------------------------------------------------------------------
  const rolePermissions: Record<string, string[]> = {
    CUSTOMER: ["view:products", "create:orders", "view:orders", "cancel:orders"],
    VENDOR: ["view:products", "manage:products", "manage:inventory", "view:orders", "manage:orders"],
    RIDER: ["view:deliveries", "update:deliveries"],
    ADMIN: [], // Base ADMIN has empty permission set; capabilities granted strictly via PermissionProfile & StaffDirectPermission
  };

  // Ensure ADMIN base role does not retain obsolete baseline permissions
  const adminRoleId = rolesMap.get("ADMIN");
  if (adminRoleId) {
    const obsoleteBaselineKeys = ["view:users", "audit_view:admin"];
    const obsoleteIds = obsoleteBaselineKeys
      .map((k) => permissionsMap.get(k))
      .filter((id): id is string => Boolean(id));

    if (obsoleteIds.length > 0) {
      await prisma.rolePermission.deleteMany({
        where: {
          roleId: adminRoleId,
          permissionId: { in: obsoleteIds },
        },
      });
    }
  }

  let rolePermCount = 0;
  for (const [roleName, permKeys] of Object.entries(rolePermissions)) {
    const roleId = rolesMap.get(roleName);
    if (!roleId) continue;

    for (const key of permKeys) {
      const permissionId = permissionsMap.get(key);
      if (!permissionId) continue;

      await prisma.rolePermission.upsert({
        where: {
          roleId_permissionId: {
            roleId,
            permissionId,
          },
        },
        update: {},
        create: {
          roleId,
          permissionId,
        },
      });
      rolePermCount++;
    }
  }
  console.log(`[Seed] Synced ${rolePermCount} role-permission mappings.`);

  // ---------------------------------------------------------------------------
  // 4. System Administrative Permission Profiles
  // ---------------------------------------------------------------------------
  const profilesData = [
    {
      name: "System_Admin",
      description: "Full administrative capabilities across all platform operations",
      isSystem: true,
      permissions: [
        "view:users",
        "suspend:users",
        "review:vendors",
        "approve:vendors",
        "review:riders",
        "approve:riders",
        "view:orders",
        "invite:admin",
        "audit_view:admin",
      ],
    },
    {
      name: "Operations_Lead",
      description: "Review and approval capabilities for vendor and rider onboarding",
      isSystem: true,
      permissions: [
        "review:vendors",
        "approve:vendors",
        "review:riders",
        "approve:riders",
        "view:orders",
        "view:users",
      ],
    },
    {
      name: "Support_Tier_1",
      description: "Read-only customer account and order verification access",
      isSystem: true,
      permissions: ["view:users", "view:orders"],
    },
    {
      name: "Security_Auditor",
      description: "Security audit log inspection and account monitoring",
      isSystem: true,
      permissions: ["audit_view:admin", "view:users"],
    },
  ];

  let profilePermCount = 0;
  for (const profDef of profilesData) {
    const profile = await prisma.permissionProfile.upsert({
      where: { name: profDef.name },
      update: {
        description: profDef.description,
        isSystem: profDef.isSystem,
      },
      create: {
        name: profDef.name,
        description: profDef.description,
        isSystem: profDef.isSystem,
      },
    });

    for (const key of profDef.permissions) {
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
      profilePermCount++;
    }
  }
  console.log(`[Seed] Synced ${profilesData.length} permission profiles with ${profilePermCount} mappings.`);
  console.log("[Seed] Central Auth baseline seeding complete.");
}
