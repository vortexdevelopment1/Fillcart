import { describe, it, expect, vi } from "vitest";
import type { Response } from "express";
import {
  requirePermission,
  type AdminAuthRequest,
} from "../../src/modules/admin/middleware/admin-auth.middleware.js";
import { ForbiddenError } from "../../src/errors/app-error.js";
import {
  reviewDocumentSchema,
  applicantDecisionSchema,
  updateVendorStatusSchema,
  updateRiderStatusSchema,
  updateRiderAvailabilitySchema,
  getApplicantsQuerySchema,
  getOrdersQuerySchema,
} from "@fillcart/validations";
import { VerificationService } from "../../src/modules/admin/verification/services/verification.service.js";

describe("Phase A: Super Admin Bypass, Exact Enums & Verification Flow", () => {
  describe("Super Admin Bypass & Permission Checking", () => {
    it("allows user with Super Admin profile regardless of direct permissions", () => {
      const req = {
        adminUser: {
          id: "admin-1",
          roleName: "STAFF",
          profileNames: ["Super Admin"],
          permissions: new Set<string>(),
        },
      } as unknown as AdminAuthRequest;

      const next = vi.fn();
      requirePermission("vendors:write")(req, {} as Response, next);
      expect(next).toHaveBeenCalledWith();
    });

    it("allows user with *:* wildcard permission", () => {
      const req = {
        adminUser: {
          id: "admin-2",
          roleName: "OPS",
          profileNames: [],
          permissions: new Set(["*:*"]),
        },
      } as unknown as AdminAuthRequest;

      const next = vi.fn();
      requirePermission("finance:approve")(req, {} as Response, next);
      expect(next).toHaveBeenCalledWith();
    });

    it("STRICTLY REJECTS user with roleName 'ADMIN' if profile is not 'Super Admin' and lacks wildcard", () => {
      const req = {
        adminUser: {
          id: "admin-3",
          roleName: "ADMIN",
          profileNames: ["Finance Profile"],
          permissions: new Set(["finance:read"]),
        },
      } as unknown as AdminAuthRequest;

      const next = vi.fn();
      requirePermission("riders:write")(req, {} as Response, next);
      expect(next).toHaveBeenCalledWith(expect.any(ForbiddenError));
    });

    it("allows user with exact canonical permission (resource:action)", () => {
      const req = {
        adminUser: {
          id: "admin-4",
          profileNames: ["Orders Agent"],
          permissions: new Set(["orders:assign-rider"]),
        },
      } as unknown as AdminAuthRequest;

      const next = vi.fn();
      requirePermission("orders:assign-rider")(req, {} as Response, next);
      expect(next).toHaveBeenCalledWith();
    });
  });

  describe("Exact Schema Enums Validation", () => {
    it("reviewDocumentSchema validates uppercase enums and rejects mixed-case", () => {
      expect(reviewDocumentSchema.safeParse({ status: "APPROVED" }).success).toBe(true);
      expect(reviewDocumentSchema.safeParse({ status: "REJECTED" }).success).toBe(true);
      expect(reviewDocumentSchema.safeParse({ status: "REUPLOAD_REQUESTED" }).success).toBe(true);
      expect(reviewDocumentSchema.safeParse({ status: "Approved" }).success).toBe(false);
      expect(reviewDocumentSchema.safeParse({ status: "Pending" }).success).toBe(false);
    });

    it("applicantDecisionSchema validates uppercase enums and rejects mixed-case", () => {
      expect(applicantDecisionSchema.safeParse({ decision: "APPROVED" }).success).toBe(true);
      expect(applicantDecisionSchema.safeParse({ decision: "REJECTED" }).success).toBe(true);
      expect(applicantDecisionSchema.safeParse({ decision: "Approved" }).success).toBe(false);
      expect(applicantDecisionSchema.safeParse({ decision: "Rejected" }).success).toBe(false);
    });

    it("getApplicantsQuerySchema validates exact DocumentStatus and ApplicantType enums", () => {
      expect(getApplicantsQuerySchema.safeParse({ type: "VENDOR", status: "PENDING" }).success).toBe(true);
      expect(getApplicantsQuerySchema.safeParse({ type: "RIDER", status: "APPROVED" }).success).toBe(true);
      expect(getApplicantsQuerySchema.safeParse({ status: "Pending" }).success).toBe(false);
    });

    it("updateVendorStatusSchema validates exact VendorStatus enums", () => {
      expect(updateVendorStatusSchema.safeParse({ status: "ACTIVE" }).success).toBe(true);
      expect(updateVendorStatusSchema.safeParse({ status: "SUSPENDED" }).success).toBe(true);
      expect(updateVendorStatusSchema.safeParse({ status: "PENDING_ONBOARDING" }).success).toBe(true);
      expect(updateVendorStatusSchema.safeParse({ status: "REJECTED" }).success).toBe(false);
    });

    it("updateRiderStatusSchema and availability validate exact Rider enums", () => {
      expect(updateRiderStatusSchema.safeParse({ status: "ACTIVE" }).success).toBe(true);
      expect(updateRiderStatusSchema.safeParse({ status: "SUSPENDED" }).success).toBe(true);
      expect(updateRiderAvailabilitySchema.safeParse({ availability: "ONLINE" }).success).toBe(true);
      expect(updateRiderAvailabilitySchema.safeParse({ availability: "OFFLINE" }).success).toBe(true);
      expect(updateRiderAvailabilitySchema.safeParse({ availability: "ON_DELIVERY" }).success).toBe(true);
      expect(updateRiderAvailabilitySchema.safeParse({ availability: "BUSY" }).success).toBe(false);
    });

    it("getOrdersQuerySchema validates exact OrderStatus enums", () => {
      expect(getOrdersQuerySchema.safeParse({ status: "PLACED" }).success).toBe(true);
      expect(getOrdersQuerySchema.safeParse({ status: "DELIVERED" }).success).toBe(true);
      expect(getOrdersQuerySchema.safeParse({ status: "CANCELLED" }).success).toBe(true);
      expect(getOrdersQuerySchema.safeParse({ status: "Shipped" }).success).toBe(false);
    });
  });

  describe("Verification Service Logic", () => {
    it("reviewDocument transitions document status and records DocumentReview with action", async () => {
      const mockPrisma: any = {
        $transaction: vi.fn((cb) => cb(mockPrisma)),
        document: {
          findUnique: vi.fn().mockResolvedValue({ id: "doc-1", status: "PENDING" }),
          update: vi.fn().mockResolvedValue({ id: "doc-1", status: "APPROVED" }),
        },
        documentReview: {
          create: vi.fn().mockResolvedValue({ id: "rev-1" }),
        },
        adminAuditLog: {
          create: vi.fn().mockResolvedValue({ id: "audit-1" }),
        },
      };

      const service = new VerificationService(mockPrisma);
      const res = await service.reviewDocument("doc-1", "admin-1", {
        status: "APPROVED",
        reason: "Valid GST",
      });

      expect(res.success).toBe(true);
      expect(res.status).toBe("APPROVED");
      expect(mockPrisma.document.update).toHaveBeenCalledWith(
        expect.objectContaining({
          where: { id: "doc-1" },
          data: expect.objectContaining({ status: "APPROVED", reviewedByUserId: "admin-1" }),
        })
      );
      expect(mockPrisma.documentReview.create).toHaveBeenCalledWith(
        expect.objectContaining({
          data: expect.objectContaining({
            documentId: "doc-1",
            reviewedByUserId: "admin-1",
            action: "APPROVED",
          }),
        })
      );
    });

    it("applicantDecision transitions Vendor to ACTIVE and verificationStatus to APPROVED on approval", async () => {
      const mockPrisma: any = {
        $transaction: vi.fn((cb) => cb(mockPrisma)),
        vendor: {
          findUnique: vi.fn().mockResolvedValue({ id: "vendor-1" }),
          update: vi.fn().mockResolvedValue({ id: "vendor-1" }),
        },
        rider: {
          findUnique: vi.fn().mockResolvedValue(null),
        },
        adminAuditLog: {
          create: vi.fn().mockResolvedValue({ id: "audit-2" }),
        },
      };

      const service = new VerificationService(mockPrisma);
      const res = await service.applicantDecision("vendor-1", "admin-1", {
        decision: "APPROVED",
        notes: "KYC passed",
      });

      expect(res.success).toBe(true);
      expect(res.applicantType).toBe("VENDOR");
      expect(res.status).toBe("ACTIVE");
      expect(res.verificationStatus).toBe("APPROVED");
      expect(mockPrisma.vendor.update).toHaveBeenCalledWith(
        expect.objectContaining({
          where: { id: "vendor-1" },
          data: expect.objectContaining({
            status: "ACTIVE",
            verificationStatus: "APPROVED",
            statusChangedByUserId: "admin-1",
          }),
        })
      );
    });
  });
});
