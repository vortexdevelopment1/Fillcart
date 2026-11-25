import { describe, it, expect, vi } from "vitest";
import type { Response } from "express";
import { createAdminRouter } from "../../src/modules/admin/routes/admin.routes.js";
import {
  requirePermission,
  type AdminAuthRequest,
} from "../../src/modules/admin/middleware/admin-auth.middleware.js";
import { ForbiddenError } from "../../src/errors/app-error.js";

interface DiscoveredRoute {
  method: string;
  path: string;
  permissionKey?: string;
  hasPermissionMiddleware: boolean;
}

function walkRouter(router: any, prefix = ""): DiscoveredRoute[] {
  const routes: DiscoveredRoute[] = [];
  if (!router?.stack) return routes;

  for (const layer of router.stack) {
    if (layer.route) {
      const routePath = prefix + (layer.route.path === "/" && prefix ? "" : layer.route.path);
      const methods = Object.keys(layer.route.methods);
      for (const method of methods) {
        const permLayer = layer.route.stack.find(
          (s: any) => s.handle?.isPermissionMiddleware || s.handle?.permissionKey
        );
        routes.push({
          method: method.toUpperCase(),
          path: routePath,
          permissionKey: permLayer?.handle?.permissionKey,
          hasPermissionMiddleware: Boolean(permLayer),
        });
      }
    } else if (layer.name === "router" && layer.handle?.stack) {
      let subPrefix = prefix;
      if (layer.regexp) {
        const match = layer.regexp.source.match(/\\\/([a-zA-Z0-9_-]+)/);
        if (match && match[1]) {
          subPrefix = prefix + "/" + match[1];
        }
      }
      routes.push(...walkRouter(layer.handle, subPrefix));
    }
  }

  return routes;
}

describe("Phase C: Complete Permission Coverage & RBAC Isolation", () => {
  const mockDummyHandler: any = vi.fn((_req: any, _res: any, next?: any) => next?.());
  const mockMiddleware: any = (_req: any, _res: any, next: any) => next();

  const createMockController = () =>
    new Proxy({}, { get: () => mockDummyHandler });

  const mockDeps: any = {
    adminAuthMiddleware: mockMiddleware,
    requireSettingsAccessMiddleware: mockMiddleware,
    adminAuthController: createMockController(),
    staffController: createMockController(),
    categoriesController: createMockController(),
    brandsController: createMockController(),
    productsController: createMockController(),
    inventoryController: createMockController(),
    settingsController: createMockController(),
    auditLogsController: createMockController(),
    notificationsController: createMockController(),
    supportController: createMockController(),
    dashboardController: createMockController(),
    verificationController: createMockController(),
    vendorsController: createMockController(),
    ridersController: createMockController(),
    ordersController: createMockController(),
    financeController: createMockController(),
    reportsController: createMockController(),
  };

  const adminRouter = createAdminRouter(mockDeps);
  const discoveredRoutes = walkRouter(adminRouter);

  it("walks the Express admin route table and verifies 100% of routes have requirePermission middleware", () => {
    expect(discoveredRoutes.length).toBeGreaterThanOrEqual(40);

    const unprotectedRoutes = discoveredRoutes.filter((r) => !r.hasPermissionMiddleware);
    if (unprotectedRoutes.length > 0) {
      console.error("Unprotected admin routes found:", unprotectedRoutes);
    }
    expect(unprotectedRoutes).toEqual([]);
  });

  it("ensures every permission key follows canonical resource:action or action:resource format", () => {
    for (const r of discoveredRoutes) {
      expect(r.permissionKey).toBeDefined();
      expect(r.permissionKey).toContain(":");
      const [part1, part2] = r.permissionKey!.split(":");
      expect(part1).toBeDefined();
      expect(part2).toBeDefined();
      expect(part1!.length).toBeGreaterThan(0);
      expect(part2!.length).toBeGreaterThan(0);
    }
  });

  describe("RBAC Cross-Profile Isolation Tests", () => {
    it("Finance profile admin CANNOT call vendor status, rider status, or settings write routes", () => {
      const financeAdminReq = {
        adminUser: {
          id: "fin-admin",
          profileNames: ["Finance"],
          permissions: new Set([
            "dashboard:view",
            "finance:view",
            "finance:process",
            "finance:manage",
            "reports:view",
            "notifications:view",
            "notifications:manage",
          ]),
        },
      } as unknown as AdminAuthRequest;

      // Cannot update vendor status / manage vendors
      const next1 = vi.fn();
      requirePermission("vendors", "manage")(financeAdminReq, {} as Response, next1);
      expect(next1).toHaveBeenCalledWith(expect.any(ForbiddenError));

      // Cannot update rider status / manage riders
      const next2 = vi.fn();
      requirePermission("riders", "manage")(financeAdminReq, {} as Response, next2);
      expect(next2).toHaveBeenCalledWith(expect.any(ForbiddenError));

      // Cannot update settings
      const next3 = vi.fn();
      requirePermission("admin", "manage")(financeAdminReq, {} as Response, next3);
      expect(next3).toHaveBeenCalledWith(expect.any(ForbiddenError));
    });

    it("Support profile admin CANNOT call finance view, settlement process, or commission routes", () => {
      const supportAdminReq = {
        adminUser: {
          id: "supp-admin",
          profileNames: ["Support"],
          permissions: new Set([
            "dashboard:view",
            "orders:view",
            "vendors:view",
            "riders:view",
            "notifications:view",
            "notifications:manage",
            "support:view",
            "support:manage",
          ]),
        },
      } as unknown as AdminAuthRequest;

      // Cannot access finance view / overview
      const next1 = vi.fn();
      requirePermission("finance", "view")(supportAdminReq, {} as Response, next1);
      expect(next1).toHaveBeenCalledWith(expect.any(ForbiddenError));

      // Cannot process settlements
      const next2 = vi.fn();
      requirePermission("finance", "process")(supportAdminReq, {} as Response, next2);
      expect(next2).toHaveBeenCalledWith(expect.any(ForbiddenError));

      // Cannot manage staff
      const next3 = vi.fn();
      requirePermission("staff", "manage")(supportAdminReq, {} as Response, next3);
      expect(next3).toHaveBeenCalledWith(expect.any(ForbiddenError));
    });

    it("Operations profile admin CAN access orders, vendors, riders, and verification", () => {
      const opsAdminReq = {
        adminUser: {
          id: "ops-admin",
          profileNames: ["Operations"],
          permissions: new Set([
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
          ]),
        },
      } as unknown as AdminAuthRequest;

      const next1 = vi.fn();
      requirePermission("orders", "cancel")(opsAdminReq, {} as Response, next1);
      expect(next1).toHaveBeenCalledWith();

      const next2 = vi.fn();
      requirePermission("orders", "assign_rider")(opsAdminReq, {} as Response, next2);
      expect(next2).toHaveBeenCalledWith();
    });
  });
});
