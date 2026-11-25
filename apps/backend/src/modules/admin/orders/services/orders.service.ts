import type { PrismaClient } from "../../../../database/generated/client/client.js";
import { NotFoundError } from "../../../../errors/app-error.js";
import type {
  GetOrdersQuery,
  CancelOrderRequest,
  AssignRiderRequest,
} from "@fillcart/validations";

export class OrdersService {
  constructor(private prisma: PrismaClient) {}

  public async getOrders(query: GetOrdersQuery) {
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
  }

  public async getOrderDetails(id: string) {
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
  }

  public async cancelOrder(
    id: string,
    adminUserId: string,
    payload: CancelOrderRequest
  ) {
    const order = await this.prisma.order.findUnique({ where: { id } });
    if (!order) {
      throw new NotFoundError("Order not found");
    }

    const updated = await this.prisma.order.update({
      where: { id },
      data: {
        status: "CANCELLED",
        cancelReason: payload.reason,
        cancelRemarks: payload.remarks || null,
        cancelledAt: new Date(),
      },
    });

    // Record order cancellation
    await this.prisma.orderCancellation.upsert({
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

    // Log status history
    await this.prisma.orderStatusHistory.create({
      data: {
        orderId: id,
        fromStatus: order.status,
        toStatus: "CANCELLED",
        triggeredByActorType: "USER",
        triggeredByUserId: adminUserId,
        reason: payload.reason,
      },
    });

    return {
      success: true,
      orderId: updated.id,
      status: updated.status,
    };
  }

  public async assignRider(
    id: string,
    adminUserId: string,
    payload: AssignRiderRequest
  ) {
    const order = await this.prisma.order.findUnique({ where: { id } });
    if (!order) {
      throw new NotFoundError("Order not found");
    }

    const rider = await this.prisma.rider.findUnique({
      where: { id: payload.riderId },
    });
    if (!rider) {
      throw new NotFoundError("Rider not found");
    }

    const assignment = await this.prisma.deliveryAssignment.create({
      data: {
        orderId: id,
        riderId: payload.riderId,
        status: "ACCEPTED",
        assignedByMode: "MANUAL",
        assignedByUserId: adminUserId,
      },
    });

    return {
      success: true,
      orderId: id,
      riderId: assignment.riderId,
      status: assignment.status,
    };
  }
}
