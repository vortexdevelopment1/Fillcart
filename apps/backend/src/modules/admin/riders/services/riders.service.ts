import type { PrismaClient } from "../../../../database/generated/client/client.js";
import { NotFoundError } from "../../../../errors/app-error.js";
import type {
  GetRidersQuery,
  UpdateRiderStatusRequest,
  UpdateRiderAvailabilityRequest,
} from "@fillcart/validations";

export class RidersService {
  constructor(private prisma: PrismaClient) {}

  public async getRiders(query: GetRidersQuery) {
    const page = query.page || 1;
    const limit = query.limit || 20;
    const skip = (page - 1) * limit;

    const where: any = { isDeleted: false };
    if (query.status && query.status !== "ALL") {
      where.status = query.status;
    }
    if (query.availability && query.availability !== "ALL") {
      where.availability = query.availability;
    }
    if (query.search) {
      where.OR = [
        { fullName: { contains: query.search, mode: "insensitive" } },
        { user: { fullName: { contains: query.search, mode: "insensitive" } } },
        { user: { phone: { contains: query.search, mode: "insensitive" } } },
      ];
    }

    const [items, total] = await Promise.all([
      this.prisma.rider.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: "desc" },
        include: {
          user: { select: { fullName: true, displayEmail: true, phone: true } },
          vehicles: true,
          bankAccounts: true,
        },
      }),
      this.prisma.rider.count({ where }),
    ]);

    const formatted = items.map((r) => ({
      id: r.id,
      name: r.fullName || r.user?.fullName || "Delivery Rider",
      email: r.user?.displayEmail || "",
      phone: r.user?.phone || "",
      status: r.status,
      availability: r.availability,
      city: r.city,
      vehicleType: r.vehicles[0]?.vehicleType || "BIKE",
      plateNumber: r.vehicles[0]?.registrationNumber || "N/A",
      deliveriesCompleted: r.deliveriesCompleted,
      rating: Number(r.ratingAverage),
      createdAt: r.createdAt.toISOString(),
    }));

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

  public async getRiderDetails(id: string) {
    const rider = await this.prisma.rider.findUnique({
      where: { id },
      include: {
        user: { select: { id: true, fullName: true, displayEmail: true, phone: true, createdAt: true } },
        vehicles: true,
        bankAccounts: true,
        documents: {
          include: { documentType: true, fileAsset: true },
        },
        locations: {
          take: 1,
          orderBy: { recordedAt: "desc" },
        },
        deliveryAssignments: {
          take: 10,
          orderBy: { assignedAt: "desc" },
          include: {
            order: { select: { id: true, orderNumber: true, totalAmountPaisa: true, status: true } },
          },
        },
      },
    });

    if (!rider) {
      throw new NotFoundError("Rider not found");
    }

    return {
      rider,
      stats: {
        completedDeliveriesCount: rider.deliveriesCompleted,
        rating: Number(rider.ratingAverage),
        onTimePct: Number(rider.onTimePct),
      },
    };
  }

  public async updateStatus(
    id: string,
    adminUserId: string,
    payload: UpdateRiderStatusRequest
  ) {
    const rider = await this.prisma.rider.findUnique({ where: { id } });
    if (!rider) {
      throw new NotFoundError("Rider not found");
    }

    const updated = await this.prisma.rider.update({
      where: { id },
      data: {
        status: payload.status as any,
        statusReason: payload.reason || null,
        statusRemarks: payload.remarks || null,
        statusChangedAt: new Date(),
        statusChangedByUserId: adminUserId,
      },
    });

    return {
      success: true,
      riderId: updated.id,
      status: updated.status,
    };
  }

  public async updateAvailability(
    id: string,
    _adminUserId: string,
    payload: UpdateRiderAvailabilityRequest
  ) {
    const rider = await this.prisma.rider.findUnique({ where: { id } });
    if (!rider) {
      throw new NotFoundError("Rider not found");
    }

    const updated = await this.prisma.rider.update({
      where: { id },
      data: { availability: payload.availability as any },
    });

    return {
      success: true,
      riderId: updated.id,
      availability: updated.availability,
    };
  }
}
