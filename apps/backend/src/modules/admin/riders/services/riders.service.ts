import type { PrismaClient } from "../../../../database/generated/client/client.js";
import { NotFoundError, handlePrismaTableErrors } from "../../../../errors/app-error.js";
import type {
  GetRidersQuery,
  UpdateRiderStatusRequest,
  UpdateRiderAvailabilityRequest,
} from "@fillcart/validations";

export class RidersService {
  constructor(private prisma: PrismaClient) {}

  public async getRiders(query: GetRidersQuery) {
    try {
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
          { user: { phone: { contains: query.search, mode: "insensitive" } } },
          { user: { displayEmail: { contains: query.search, mode: "insensitive" } } },
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
            documents: { select: { id: true, status: true } },
          },
        }),
        this.prisma.rider.count({ where }),
      ]);

      const formatted = items.map((r) => ({
        id: r.id,
        name: r.fullName || r.user?.fullName || "Rider",
        phone: r.user?.phone || "",
        email: r.user?.displayEmail || "",
        city: r.city,
        status: r.status,
        availability: r.availability,
        vehicleType: r.vehicles[0]?.vehicleType || "MOTORCYCLE",
        vehiclePlate: r.vehicles[0]?.registrationNumber || "N/A",
        deliveriesCompleted: r.deliveriesCompleted,
        rating: Number(r.ratingAverage),
        documentsCount: r.documents.length,
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
    } catch (err) {
      handlePrismaTableErrors(err);
    }
  }

  public async getRiderDetails(id: string) {
    try {
      const rider = await this.prisma.rider.findUnique({
        where: { id },
        include: {
          user: { select: { id: true, fullName: true, displayEmail: true, phone: true, createdAt: true } },
          vehicles: true,
          // SENSITIVE DATA REDACTION: strictly select masked fields only, never encrypted columns
          bankAccounts: {
            select: {
              id: true,
              bankName: true,
              accountHolderName: true,
              accountNumberMasked: true,
              ifscCode: true,
              isPrimary: true,
              verificationStatus: true,
              createdAt: true,
            },
          },
          documents: {
            select: {
              id: true,
              entityType: true,
              documentTypeId: true,
              documentNumberMasked: true,
              status: true,
              rejectReason: true,
              rejectRemarks: true,
              reviewedAt: true,
              createdAt: true,
              documentType: true,
              fileAsset: true,
            },
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
    } catch (err) {
      handlePrismaTableErrors(err);
    }
  }

  public async updateStatus(
    id: string,
    adminUserId: string,
    payload: UpdateRiderStatusRequest
  ) {
    return await this.prisma.$transaction(async (tx) => {
      const rider = await tx.rider.findUnique({ where: { id } });
      if (!rider) {
        throw new NotFoundError("Rider not found");
      }

      const updated = await tx.rider.update({
        where: { id, updatedAt: rider.updatedAt },
        data: {
          status: payload.status as any,
          statusReason: payload.reason || null,
          statusRemarks: payload.remarks || null,
          statusChangedAt: new Date(),
          statusChangedByUserId: adminUserId,
        },
      });

      await tx.adminAuditLog.create({
        data: {
          adminUserId,
          targetType: "RIDER",
          targetId: id,
          action: "UPDATE",
          changesSummary: {
            before: { status: rider.status },
            after: { status: updated.status, reason: payload.reason },
          },
        },
      });

      return {
        success: true,
        riderId: updated.id,
        status: updated.status,
      };
    });
  }

  public async updateAvailability(
    id: string,
    adminUserId: string,
    payload: UpdateRiderAvailabilityRequest
  ) {
    return await this.prisma.$transaction(async (tx) => {
      const rider = await tx.rider.findUnique({ where: { id } });
      if (!rider) {
        throw new NotFoundError("Rider not found");
      }

      const updated = await tx.rider.update({
        where: { id, updatedAt: rider.updatedAt },
        data: {
          availability: payload.availability as any,
        },
      });

      await tx.adminAuditLog.create({
        data: {
          adminUserId,
          targetType: "RIDER",
          targetId: id,
          action: "UPDATE",
          changesSummary: {
            before: { availability: rider.availability },
            after: { availability: updated.availability },
          },
        },
      });

      return {
        success: true,
        riderId: updated.id,
        availability: updated.availability,
      };
    });
  }
}
