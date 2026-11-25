import type { PrismaClient } from "../../../../database/generated/client/client.js";
import { NotFoundError, ConflictError, handlePrismaTableErrors } from "../../../../errors/app-error.js";
import type {
  GetOrdersQuery,
  CancelOrderRequest,
  AssignRiderRequest,
} from "@fillcart/validations";

export class OrdersService {
  constructor(private prisma: PrismaClient) {}

  public async getOrders(query: GetOrdersQuery) {
    try {
      const page = query.page || 1;
      const limit = query.limit || 20;
      const skip = (page - 1) * limit;

      const where: any = { isDeleted: false };
      if (query.status && query.status !== "ALL") {
        where.status = query.status;
      }
      if (query.search) {
        where.OR = [
          { orderNumber: { contains: query.search, mode: "insensitive" } },
          { customerProfile: { user: { fullName: { contains: query.search, mode: "insensitive" } } } },
        ];
      }

      const [items, total] = await Promise.all([
        this.prisma.order.findMany({
          where,
          skip,
          take: limit,
          orderBy: { createdAt: "desc" },
          include: {
            customerProfile: {
              include: {
                user: { select: { fullName: true, phone: true, displayEmail: true } },
              },
            },
            store: { select: { storeName: true } },
            items: {
              take: 3,
              select: { productName: true, variantName: true, quantity: true },
            },
            deliveryAssignments: {
              take: 1,
              orderBy: { assignedAt: "desc" },
              include: {
                rider: {
                  include: {
                    user: { select: { fullName: true, phone: true } },
                  },
                },
              },
            },
          },
        }),
        this.prisma.order.count({ where }),
      ]);

      const formatted = items.map((o) => {
        const activeAssignment = o.deliveryAssignments[0];
        return {
          id: o.id,
          orderNumber: o.orderNumber,
          customerName: o.customerProfile?.user?.fullName || "Customer",
          customerPhone: o.customerProfile?.user?.phone || "",
          storeName: o.store?.storeName || "Merchant Store",
          itemCount: o.items.length,
          totalAmount: Number(o.totalAmountPaisa) / 100,
          status: o.status,
          paymentStatus: o.paymentStatus,
          riderName: activeAssignment?.rider?.fullName || activeAssignment?.rider?.user?.fullName || "Unassigned",
          riderPhone: activeAssignment?.rider?.user?.phone || null,
          createdAt: o.createdAt.toISOString(),
        };
      });

      return {
        items: formatted,
        pagination: {
          page,
          limit,
          total,
          totalPages: Math.ceil(total / limit) || 1,
        },
      };
    } catch (err) {
      handlePrismaTableErrors(err);
    }
  }

  public async getOrderDetails(id: string) {
    try {
      const order = await this.prisma.order.findUnique({
        where: { id },
        include: {
          customerProfile: {
            include: {
              user: { select: { id: true, fullName: true, displayEmail: true, phone: true } },
            },
          },
          deliveryAddress: true,
          store: true,
          items: true,
          deliveryAssignments: {
            include: {
              rider: {
                include: {
                  user: { select: { fullName: true, phone: true } },
                  vehicles: true,
                },
              },
            },
          },
          payment: true,
          cancellationRecord: true,
          refundRecord: true,
          statusHistory: {
            orderBy: { createdAt: "asc" },
          },
        },
      });

      if (!order) {
        throw new NotFoundError("Order not found");
      }

      return order;
    } catch (err) {
      handlePrismaTableErrors(err);
    }
  }

  public async cancelOrder(
    id: string,
    adminUserId: string,
    payload: CancelOrderRequest
  ) {
    try {
      return await this.prisma.$transaction(async (tx) => {
        // 1. Concurrency read & state validation
        const currentOrder = await tx.order.findUnique({ where: { id } });
        if (!currentOrder) {
          throw new NotFoundError("Order not found");
        }

        // Reject illegal transitions with 409
        if (currentOrder.status === "DELIVERED") {
          throw new ConflictError("Cannot cancel an order that has already been delivered");
        }
        if (currentOrder.status === "CANCELLED") {
          throw new ConflictError("Order is already cancelled");
        }

        // 2. Row lock / concurrency check against double submits
        const updated = await tx.order.update({
          where: {
            id,
            updatedAt: currentOrder.updatedAt,
          },
          data: {
            status: "CANCELLED",
            cancelReason: payload.reason,
            cancelRemarks: payload.remarks || null,
            cancelledAt: new Date(),
          },
        });

        // 3. OrderCancellation audit record
        await tx.orderCancellation.upsert({
          where: { orderId: id },
          update: {
            customReason: payload.reason,
          },
          create: {
            orderId: id,
            cancelledByActorType: "USER",
            cancelledByUserId: adminUserId,
            reasonCode: "ADMIN_OVERRIDE",
            customReason: payload.reason,
          },
        });

        // 4. OrderStatusHistory entry
        await tx.orderStatusHistory.create({
          data: {
            orderId: id,
            fromStatus: currentOrder.status,
            toStatus: "CANCELLED",
            triggeredByActorType: "USER",
            triggeredByUserId: adminUserId,
            reason: payload.reason,
            metadata: { remarks: payload.remarks },
          },
        });

        // 5. Refund trigger: Only creates a RefundRecord in INITIATED state (no payment provider call)
        let refundRecordId: string | null = null;
        if (payload.triggerRefund) {
          const refund = await tx.refundRecord.upsert({
            where: { orderId: id },
            update: {},
            create: {
              orderId: id,
              customerProfileId: currentOrder.customerProfileId,
              amountPaisa: currentOrder.totalAmountPaisa,
              status: "INITIATED",
              reason: "ORDER_CANCELLED",
              processedByUserId: adminUserId,
            },
          });
          refundRecordId = refund.id;
        }

        // 6. AdminAuditLog entry with before and after in the same transaction
        await tx.adminAuditLog.create({
          data: {
            adminUserId,
            targetType: "ORDER",
            targetId: id,
            action: "UPDATE",
            changesSummary: {
              before: {
                status: currentOrder.status,
                cancelledAt: currentOrder.cancelledAt,
                cancelReason: currentOrder.cancelReason,
              },
              after: {
                status: "CANCELLED",
                cancelledAt: updated.cancelledAt,
                cancelReason: payload.reason,
                refundRecordId,
              },
            },
          },
        });

        return {
          success: true,
          orderId: updated.id,
          status: updated.status,
          refundInitiated: Boolean(payload.triggerRefund),
        };
      });
    } catch (err: any) {
      if (err.code === "P2025" || err.message?.includes("P2025")) {
        throw new ConflictError("Order was modified concurrently. Please refresh.");
      }
      throw err;
    }
  }

  public async assignRider(
    id: string,
    adminUserId: string,
    payload: AssignRiderRequest
  ) {
    return await this.prisma.$transaction(async (tx) => {
      // 1. Fetch current order
      const currentOrder = await tx.order.findUnique({ where: { id } });
      if (!currentOrder) {
        throw new NotFoundError("Order not found");
      }

      // Reject illegal transitions with 409
      if (currentOrder.status === "DELIVERED") {
        throw new ConflictError("Cannot assign a rider to a delivered order");
      }
      if (currentOrder.status === "CANCELLED") {
        throw new ConflictError("Cannot assign a rider to a cancelled order");
      }

      // 2. Validate rider exists and is active
      const rider = await tx.rider.findUnique({
        where: { id: payload.riderId },
      });
      if (!rider) {
        throw new NotFoundError("Rider not found");
      }
      if (rider.status === "SUSPENDED" || rider.status === "INACTIVE") {
        throw new ConflictError(`Rider is not available (status: ${rider.status})`);
      }

      // 3. Concurrency check: Ensure no duplicate assignment to same rider
      const activeAssignment = await tx.deliveryAssignment.findFirst({
        where: {
          orderId: id,
          status: { in: ["ACCEPTED", "ARRIVED_AT_STORE", "PICKED_UP"] },
        },
      });
      if (activeAssignment && activeAssignment.riderId === payload.riderId) {
        throw new ConflictError("Order is already assigned to this rider");
      }

      // 4. Create new DeliveryAssignment
      const assignment = await tx.deliveryAssignment.create({
        data: {
          orderId: id,
          riderId: payload.riderId,
          status: "ACCEPTED",
          assignedByMode: "MANUAL",
          assignedByUserId: adminUserId,
        },
      });

      // 5. Update order status if appropriate
      const newOrderStatus = currentOrder.status === "PLACED" ? "ACCEPTED" : currentOrder.status;
      const updatedOrder = await tx.order.update({
        where: { id, updatedAt: currentOrder.updatedAt },
        data: {
          status: newOrderStatus,
        },
      });

      // 6. OrderStatusHistory entry
      await tx.orderStatusHistory.create({
        data: {
          orderId: id,
          fromStatus: currentOrder.status,
          toStatus: newOrderStatus,
          triggeredByActorType: "USER",
          triggeredByUserId: adminUserId,
          reason: `Rider assigned manually: ${rider.fullName} (${payload.riderId})`,
          metadata: { notes: payload.notes || null, riderId: payload.riderId },
        },
      });

      // 7. AdminAuditLog entry with before and after in the same transaction
      await tx.adminAuditLog.create({
        data: {
          adminUserId,
          targetType: "ORDER",
          targetId: id,
          action: "UPDATE",
          changesSummary: {
            before: {
              assignedRiderId: activeAssignment?.riderId || null,
              orderStatus: currentOrder.status,
            },
            after: {
              assignedRiderId: payload.riderId,
              orderStatus: newOrderStatus,
              assignmentId: assignment.id,
            },
          },
        },
      });

      return {
        success: true,
        orderId: id,
        riderId: assignment.riderId,
        status: assignment.status,
        orderStatus: updatedOrder.status,
      };
    });
  }
}
