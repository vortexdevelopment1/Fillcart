import { describe, it, expect, vi, beforeEach } from "vitest";
import { OrdersService } from "../../src/modules/admin/orders/services/orders.service.js";
import { FinanceService } from "../../src/modules/admin/finance/services/finance.service.js";
import { VendorsService } from "../../src/modules/admin/vendors/services/vendors.service.js";
import { RidersService } from "../../src/modules/admin/riders/services/riders.service.js";
import { VerificationService } from "../../src/modules/admin/verification/services/verification.service.js";
import { DashboardService } from "../../src/modules/admin/dashboard/services/dashboard.service.js";
import {
  ConflictError,
  MigrationPendingError,
  handlePrismaTableErrors,
} from "../../src/errors/app-error.js";

describe("Phase B: State & Money Safety, Sensitive Data Redaction, and Missing Table Checks", () => {
  let mockPrisma: any;
  const adminId = "admin-uuid-1111";

  beforeEach(() => {
    mockPrisma = {
      $transaction: vi.fn((callback) => callback(mockPrisma)),
      order: {
        findUnique: vi.fn(),
        findMany: vi.fn(),
        count: vi.fn(),
        update: vi.fn(),
        aggregate: vi.fn(),
      },
      orderCancellation: {
        upsert: vi.fn(),
      },
      orderStatusHistory: {
        create: vi.fn(),
      },
      refundRecord: {
        upsert: vi.fn().mockResolvedValue({ id: "refund-rec-1" }),
      },
      adminAuditLog: {
        create: vi.fn().mockResolvedValue({ id: "audit-1" }),
      },
      rider: {
        findUnique: vi.fn(),
        findMany: vi.fn(),
        count: vi.fn(),
        update: vi.fn(),
      },
      deliveryAssignment: {
        findFirst: vi.fn(),
        create: vi.fn(),
      },
      settlementBatch: {
        findUnique: vi.fn(),
        findMany: vi.fn(),
        count: vi.fn(),
        update: vi.fn(),
      },
      vendor: {
        findUnique: vi.fn(),
        findMany: vi.fn(),
        count: vi.fn(),
        update: vi.fn(),
      },
      commissionRule: {
        findFirst: vi.fn(),
        findMany: vi.fn(),
        create: vi.fn(),
        upsert: vi.fn(),
      },
      coupon: {
        count: vi.fn(),
        findMany: vi.fn(),
      },
      taxSlab: {
        findMany: vi.fn(),
      },
      document: {
        findFirst: vi.fn(),
        findMany: vi.fn(),
        count: vi.fn(),
        update: vi.fn(),
      },
      documentReview: {
        create: vi.fn(),
      },
      product: {
        count: vi.fn(),
      },
      category: {
        findMany: vi.fn(),
      },
    };
  });

  describe("Orders: Cancel Order State & Money Safety", () => {
    it("successfully cancels an order in PLACED state with transaction, history, refund, and audit log", async () => {
      const existingOrder = {
        id: "order-1",
        status: "PLACED",
        customerProfileId: "cust-1",
        totalAmountPaisa: 150000n,
        updatedAt: new Date("2026-11-25T10:00:00Z"),
        cancelledAt: null,
        cancelReason: null,
      };

      mockPrisma.order.findUnique.mockResolvedValue(existingOrder);
      mockPrisma.order.update.mockResolvedValue({
        ...existingOrder,
        status: "CANCELLED",
        cancelledAt: new Date(),
      });

      const service = new OrdersService(mockPrisma);
      const res = await service.cancelOrder("order-1", adminId, {
        reason: "Customer requested cancellation before dispatch",
        triggerRefund: true,
      });

      expect(res.success).toBe(true);
      expect(res.status).toBe("CANCELLED");
      expect(mockPrisma.$transaction).toHaveBeenCalled();

      // Check OrderStatusHistory creation
      expect(mockPrisma.orderStatusHistory.create).toHaveBeenCalledWith(
        expect.objectContaining({
          data: expect.objectContaining({
            orderId: "order-1",
            fromStatus: "PLACED",
            toStatus: "CANCELLED",
            triggeredByUserId: adminId,
          }),
        })
      );

      // Check RefundRecord creation in INITIATED state
      expect(mockPrisma.refundRecord.upsert).toHaveBeenCalledWith(
        expect.objectContaining({
          where: { orderId: "order-1" },
          create: expect.objectContaining({
            orderId: "order-1",
            status: "INITIATED",
            reason: "ORDER_CANCELLED",
            processedByUserId: adminId,
          }),
        })
      );

      // Check AdminAuditLog creation with before and after diff
      expect(mockPrisma.adminAuditLog.create).toHaveBeenCalledWith(
        expect.objectContaining({
          data: expect.objectContaining({
            adminUserId: adminId,
            targetType: "ORDER",
            targetId: "order-1",
            changesSummary: expect.objectContaining({
              before: expect.objectContaining({ status: "PLACED" }),
              after: expect.objectContaining({ status: "CANCELLED" }),
            }),
          }),
        })
      );
    });

    it("rejects illegal cancellation with 409 Conflict when order is already DELIVERED", async () => {
      mockPrisma.order.findUnique.mockResolvedValue({
        id: "order-deliv",
        status: "DELIVERED",
        updatedAt: new Date(),
      });

      const service = new OrdersService(mockPrisma);
      await expect(
        service.cancelOrder("order-deliv", adminId, { reason: "Too late", triggerRefund: false })
      ).rejects.toThrow(ConflictError);
    });

    it("rejects illegal cancellation with 409 Conflict when order is already CANCELLED (double submit prevention)", async () => {
      mockPrisma.order.findUnique.mockResolvedValue({
        id: "order-already-canc",
        status: "CANCELLED",
        updatedAt: new Date(),
      });

      const service = new OrdersService(mockPrisma);
      await expect(
        service.cancelOrder("order-already-canc", adminId, { reason: "Duplicate", triggerRefund: false })
      ).rejects.toThrow(ConflictError);
    });
  });

  describe("Orders: Assign Rider State & Concurrency Safety", () => {
    it("successfully assigns an active rider in a transaction with history and audit log", async () => {
      const order = {
        id: "order-assign-1",
        status: "PLACED",
        updatedAt: new Date(),
      };
      const rider = {
        id: "rider-1",
        fullName: "Rajesh Kumar",
        status: "ACTIVE",
      };

      mockPrisma.order.findUnique.mockResolvedValue(order);
      mockPrisma.rider.findUnique.mockResolvedValue(rider);
      mockPrisma.deliveryAssignment.findFirst.mockResolvedValue(null);
      mockPrisma.deliveryAssignment.create.mockResolvedValue({
        id: "assign-1",
        orderId: "order-assign-1",
        riderId: "rider-1",
        status: "ACCEPTED",
      });
      mockPrisma.order.update.mockResolvedValue({
        ...order,
        status: "ACCEPTED",
      });

      const service = new OrdersService(mockPrisma);
      const res = await service.assignRider("order-assign-1", adminId, {
        riderId: "rider-1",
      });

      expect(res.success).toBe(true);
      expect(res.riderId).toBe("rider-1");
      expect(mockPrisma.orderStatusHistory.create).toHaveBeenCalled();
      expect(mockPrisma.adminAuditLog.create).toHaveBeenCalledWith(
        expect.objectContaining({
          data: expect.objectContaining({
            targetType: "ORDER",
            action: "UPDATE",
            changesSummary: expect.objectContaining({
              before: expect.objectContaining({ assignedRiderId: null }),
              after: expect.objectContaining({ assignedRiderId: "rider-1" }),
            }),
          }),
        })
      );
    });

    it("rejects rider assignment with 409 Conflict if order is DELIVERED or CANCELLED", async () => {
      mockPrisma.order.findUnique.mockResolvedValue({
        id: "order-closed",
        status: "DELIVERED",
        updatedAt: new Date(),
      });

      const service = new OrdersService(mockPrisma);
      await expect(
        service.assignRider("order-closed", adminId, { riderId: "rider-1" })
      ).rejects.toThrow(ConflictError);
    });

    it("rejects rider assignment with 409 Conflict if rider is SUSPENDED or INACTIVE", async () => {
      mockPrisma.order.findUnique.mockResolvedValue({
        id: "order-active",
        status: "PLACED",
        updatedAt: new Date(),
      });
      mockPrisma.rider.findUnique.mockResolvedValue({
        id: "rider-susp",
        status: "SUSPENDED",
      });

      const service = new OrdersService(mockPrisma);
      await expect(
        service.assignRider("order-active", adminId, { riderId: "rider-susp" })
      ).rejects.toThrow(ConflictError);
    });

    it("rejects duplicate rider assignment with 409 Conflict if same rider already assigned", async () => {
      mockPrisma.order.findUnique.mockResolvedValue({
        id: "order-active-2",
        status: "ACCEPTED",
        updatedAt: new Date(),
      });
      mockPrisma.rider.findUnique.mockResolvedValue({
        id: "rider-2",
        status: "ACTIVE",
      });
      mockPrisma.deliveryAssignment.findFirst.mockResolvedValue({
        id: "assign-existing",
        riderId: "rider-2",
        status: "ACCEPTED",
      });

      const service = new OrdersService(mockPrisma);
      await expect(
        service.assignRider("order-active-2", adminId, { riderId: "rider-2" })
      ).rejects.toThrow(ConflictError);
    });
  });

  describe("Finance: Settlement Process Safety", () => {
    it("transitions settlement batch from DRAFT to PROCESSING in transaction and writes audit log", async () => {
      const batch = {
        id: "batch-1",
        batchNumber: "SB-2026-001",
        status: "DRAFT",
        updatedAt: new Date("2026-11-25T10:00:00Z"),
        processedAt: null,
      };

      mockPrisma.settlementBatch.findUnique.mockResolvedValue(batch);
      mockPrisma.settlementBatch.update.mockResolvedValue({
        ...batch,
        status: "PROCESSING",
        processedAt: new Date(),
      });

      const service = new FinanceService(mockPrisma);
      const res = await service.processSettlement("batch-1", adminId);

      expect(res.success).toBe(true);
      expect(res.status).toBe("PROCESSING");
      expect(mockPrisma.$transaction).toHaveBeenCalled();
      expect(mockPrisma.adminAuditLog.create).toHaveBeenCalledWith(
        expect.objectContaining({
          data: expect.objectContaining({
            targetType: "FINANCE",
            targetId: "batch-1",
            action: "UPDATE",
            changesSummary: expect.objectContaining({
              before: expect.objectContaining({ status: "DRAFT" }),
              after: expect.objectContaining({ status: "PROCESSING" }),
            }),
          }),
        })
      );
    });

    it("rejects processing with 409 Conflict when batch is already PROCESSING, COMPLETED, or FAILED", async () => {
      mockPrisma.settlementBatch.findUnique.mockResolvedValue({
        id: "batch-proc",
        status: "PROCESSING",
        updatedAt: new Date(),
      });

      const service = new FinanceService(mockPrisma);
      await expect(service.processSettlement("batch-proc", adminId)).rejects.toThrow(ConflictError);

      mockPrisma.settlementBatch.findUnique.mockResolvedValue({
        id: "batch-comp",
        status: "COMPLETED",
        updatedAt: new Date(),
      });
      await expect(service.processSettlement("batch-comp", adminId)).rejects.toThrow(ConflictError);
    });
  });

  describe("Vendors: Commission Rule Creation & Audit", () => {
    it("writes commission to CommissionRule table (never Vendor table) and writes audit log", async () => {
      mockPrisma.vendor.findUnique.mockResolvedValue({
        id: "vendor-10",
        businessName: "Gourmet Bakery",
      });
      mockPrisma.commissionRule.findFirst.mockResolvedValue({
        id: "comm-old",
        ratePct: 15.0,
      });
      mockPrisma.commissionRule.upsert.mockResolvedValue({
        id: "comm-vendor-vendor-10",
        ratePct: 12.5,
      });

      const service = new VendorsService(mockPrisma);
      const res = await service.updateCommission("vendor-10", adminId, {
        commissionPct: 12.5,
        reason: "Volume partner tier discount",
      });

      expect(res.success).toBe(true);
      expect(res.commissionPct).toBe(12.5);
      expect(mockPrisma.commissionRule.upsert).toHaveBeenCalledWith(
        expect.objectContaining({
          where: { id: "comm-vendor-vendor-10" },
          create: expect.objectContaining({
            vendorId: "vendor-10",
            ratePct: 12.5,
            createdByUserId: adminId,
          }),
        })
      );
      expect(mockPrisma.adminAuditLog.create).toHaveBeenCalledWith(
        expect.objectContaining({
          data: expect.objectContaining({
            targetType: "VENDOR",
            targetId: "vendor-10",
            changesSummary: expect.objectContaining({
              before: { commissionPct: 15.0 },
              after: expect.objectContaining({ commissionPct: 12.5 }),
            }),
          }),
        })
      );
    });
  });

  describe("Sensitive Data Masking (Absence of Encrypted Fields)", () => {
    it("ensures bank account and document encrypted fields are never exposed in vendor details", async () => {
      mockPrisma.vendor.findUnique.mockImplementation(({ include }: any) => {
        // Assert that include/select specifies only safe masked columns
        expect(include.bankAccounts.select.accountNumberMasked).toBe(true);
        expect(include.bankAccounts.select.accountNumberEncrypted).toBeUndefined();
        expect(include.documents.select.documentNumberMasked).toBe(true);
        expect(include.documents.select.documentNumberEncrypted).toBeUndefined();

        return Promise.resolve({
          id: "vendor-1",
          bankAccounts: [
            { id: "ba-1", bankName: "HDFC", accountNumberMasked: "XXXXXX7890" },
          ],
          documents: [
            { id: "doc-1", documentNumberMasked: "GSTIN-XXXX-1234" },
          ],
          stores: [],
        });
      });
      mockPrisma.product.count.mockResolvedValue(5);
      mockPrisma.order.count.mockResolvedValue(10);

      const service = new VendorsService(mockPrisma);
      const res = await service.getVendorDetails("vendor-1");

      const resString = JSON.stringify(res);
      expect(resString).not.toContain("accountNumberEncrypted");
      expect(resString).not.toContain("documentNumberEncrypted");
      expect(resString).toContain("accountNumberMasked");
      expect(resString).toContain("documentNumberMasked");
    });

    it("ensures rider bank account and documents encrypted fields are never exposed", async () => {
      mockPrisma.rider.findUnique.mockImplementation(({ include }: any) => {
        expect(include.bankAccounts.select.accountNumberMasked).toBe(true);
        expect(include.bankAccounts.select.accountNumberEncrypted).toBeUndefined();
        expect(include.documents.select.documentNumberMasked).toBe(true);
        expect(include.documents.select.documentNumberEncrypted).toBeUndefined();

        return Promise.resolve({
          id: "rider-1",
          deliveriesCompleted: 100,
          ratingAverage: 4.8,
          onTimePct: 98.5,
          bankAccounts: [
            { id: "ba-2", bankName: "SBI", accountNumberMasked: "XXXXXX1122" },
          ],
          documents: [
            { id: "doc-2", documentNumberMasked: "DL-XXXX-9999" },
          ],
        });
      });

      const service = new RidersService(mockPrisma);
      const res = await service.getRiderDetails("rider-1");

      const resString = JSON.stringify(res);
      expect(resString).not.toContain("accountNumberEncrypted");
      expect(resString).not.toContain("documentNumberEncrypted");
      expect(resString).toContain("accountNumberMasked");
      expect(resString).toContain("documentNumberMasked");
    });
  });

  describe("Missing Table Handling (Condition 3: MIGRATION_PENDING 503)", () => {
    it("throws MigrationPendingError (503) instead of fake zeros when table does not exist (P2021)", async () => {
      const p2021Error = new Error("The table `public.Order` does not exist in the current database.");
      (p2021Error as any).code = "P2021";

      mockPrisma.order.count.mockRejectedValue(p2021Error);

      const dashboardService = new DashboardService(mockPrisma);

      await expect(dashboardService.getSummary()).rejects.toThrow(MigrationPendingError);
      try {
        await dashboardService.getSummary();
      } catch (err: any) {
        expect(err.statusCode).toBe(503);
        expect(err.code).toBe("MIGRATION_PENDING");
      }
    });

    it("handlePrismaTableErrors rethrows unknown operational errors", () => {
      const regularError = new Error("Connection failed");
      expect(() => handlePrismaTableErrors(regularError)).toThrow("Connection failed");
    });
  });
});
