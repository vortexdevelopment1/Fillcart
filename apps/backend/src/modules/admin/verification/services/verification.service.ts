import type { PrismaClient } from "../../../../database/generated/client/client.js";
import { NotFoundError, handlePrismaTableErrors } from "../../../../errors/app-error.js";
import type {
  GetApplicantsQuery,
  ReviewDocumentRequest,
  ApplicantDecisionRequest,
} from "@fillcart/validations";

export class VerificationService {
  constructor(private prisma: PrismaClient) {}

  public async getApplicants(query: GetApplicantsQuery) {
    try {
      const page = query.page || 1;
      const limit = query.limit || 20;
      const skip = (page - 1) * limit;

      const where: any = { isDeleted: false };
      if (query.type && query.type !== "ALL") {
        where.entityType = query.type.toUpperCase();
      }
      if (query.status && query.status !== "ALL") {
        where.status = query.status.toUpperCase();
      }

      const [items, total] = await Promise.all([
        this.prisma.document.findMany({
          where,
          skip,
          take: limit,
          orderBy: { createdAt: "desc" },
          include: {
            documentType: true,
            fileAsset: true,
            vendor: {
              include: {
                user: { select: { fullName: true, displayEmail: true, phone: true } },
                stores: { select: { storeName: true } },
              },
            },
            rider: {
              include: {
                user: { select: { fullName: true, displayEmail: true, phone: true } },
                vehicles: true,
              },
            },
          },
        }),
        this.prisma.document.count({ where }),
      ]);

      const formatted = items.map((doc) => {
        const applicantName =
          doc.entityType === "VENDOR"
            ? doc.vendor?.businessName || doc.vendor?.user?.fullName || "Vendor Applicant"
            : doc.rider?.fullName || doc.rider?.user?.fullName || "Rider Applicant";

        const applicantPhone =
          doc.entityType === "VENDOR"
            ? doc.vendor?.user?.phone || ""
            : doc.rider?.user?.phone || "";

        return {
          id: doc.id,
          entityType: doc.entityType,
          applicantId: doc.vendorId || doc.riderId || doc.id,
          applicantName,
          applicantPhone,
          documentType: doc.documentType?.name || "Official Document",
          documentCode: doc.documentType?.code || "DOC",
          documentNumberMasked: doc.documentNumberMasked || "XXXX-XXXX",
          fileUrl: doc.fileAsset?.fileUrl || "",
          status: doc.status,
          rejectReason: doc.rejectReason,
          rejectRemarks: doc.rejectRemarks,
          submittedAt: doc.createdAt.toISOString(),
          reviewedAt: doc.reviewedAt?.toISOString() || null,
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

  public async getApplicantDetails(id: string) {
    try {
      const doc = await this.prisma.document.findFirst({
        where: {
          OR: [{ id }, { vendorId: id }, { riderId: id }],
          isDeleted: false,
        },
        select: {
          id: true,
          entityType: true,
          vendorId: true,
          riderId: true,
          documentTypeId: true,
          documentNumberMasked: true,
          status: true,
          rejectReason: true,
          rejectRemarks: true,
          reviewedByUserId: true,
          reviewedAt: true,
          createdAt: true,
          documentType: true,
          fileAsset: true,
          vendor: {
            include: {
              user: { select: { id: true, fullName: true, displayEmail: true, phone: true, createdAt: true } },
              stores: true,
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
            },
          },
          rider: {
            include: {
              user: { select: { id: true, fullName: true, displayEmail: true, phone: true, createdAt: true } },
              vehicles: true,
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
            },
          },
          reviews: {
            orderBy: { createdAt: "desc" },
          },
        },
      });

      if (!doc) {
        throw new NotFoundError("Applicant verification record not found");
      }

      return doc;
    } catch (err) {
      handlePrismaTableErrors(err);
    }
  }

  public async reviewDocument(
    documentId: string,
    adminUserId: string,
    payload: ReviewDocumentRequest
  ) {
    return await this.prisma.$transaction(async (tx) => {
      const doc = await tx.document.findUnique({
        where: { id: documentId },
      });

      if (!doc) {
        throw new NotFoundError("Document not found");
      }

      const newStatus = payload.status;
      const action = payload.status;

      const updated = await tx.document.update({
        where: { id: documentId, updatedAt: doc.updatedAt },
        data: {
          status: newStatus as any,
          rejectReason: payload.reason || null,
          rejectRemarks: payload.remarks || null,
          reviewedByUserId: adminUserId,
          reviewedAt: new Date(),
        },
      });

      await tx.documentReview.create({
        data: {
          documentId,
          reviewedByUserId: adminUserId,
          action: action as any,
          reason: payload.reason || null,
          remarks: payload.remarks || null,
        },
      });

      await tx.adminAuditLog.create({
        data: {
          adminUserId,
          targetType: "DOCUMENT",
          targetId: documentId,
          action: "UPDATE",
          changesSummary: {
            before: { status: doc.status },
            after: { status: updated.status, reason: payload.reason },
          },
        },
      });

      return {
        success: true,
        documentId: updated.id,
        status: updated.status,
      };
    });
  }

  public async applicantDecision(
    applicantId: string,
    adminUserId: string,
    payload: ApplicantDecisionRequest
  ) {
    return await this.prisma.$transaction(async (tx) => {
      const isApproved = payload.decision === "APPROVED";
      const status = isApproved ? "ACTIVE" : "SUSPENDED";
      const verificationStatus = isApproved ? "APPROVED" : "UNDER_REVIEW";

      const vendor = await tx.vendor.findUnique({
        where: { id: applicantId },
      });

      if (vendor) {
        await tx.vendor.update({
          where: { id: applicantId, updatedAt: vendor.updatedAt },
          data: {
            status: status as any,
            verificationStatus: verificationStatus as any,
            statusReason: payload.notes || (isApproved ? "Approved by admin" : "Application rejected by admin"),
            statusChangedAt: new Date(),
            statusChangedByUserId: adminUserId,
          },
        });

        await tx.adminAuditLog.create({
          data: {
            adminUserId,
            targetType: "VENDOR",
            targetId: applicantId,
            action: isApproved ? "APPROVE" : "REJECT",
            changesSummary: {
              before: { status: vendor.status, verificationStatus: vendor.verificationStatus },
              after: { status, verificationStatus, notes: payload.notes },
            },
          },
        });

        return { success: true, applicantType: "VENDOR", status, verificationStatus };
      }

      const rider = await tx.rider.findUnique({
        where: { id: applicantId },
      });

      if (rider) {
        await tx.rider.update({
          where: { id: applicantId, updatedAt: rider.updatedAt },
          data: {
            status: status as any,
            verificationStatus: verificationStatus as any,
            statusReason: payload.notes || (isApproved ? "Approved by admin" : "Application rejected by admin"),
            statusChangedAt: new Date(),
            statusChangedByUserId: adminUserId,
          },
        });

        await tx.adminAuditLog.create({
          data: {
            adminUserId,
            targetType: "RIDER",
            targetId: applicantId,
            action: isApproved ? "APPROVE" : "REJECT",
            changesSummary: {
              before: { status: rider.status, verificationStatus: rider.verificationStatus },
              after: { status, verificationStatus, notes: payload.notes },
            },
          },
        });

        return { success: true, applicantType: "RIDER", status, verificationStatus };
      }

      throw new NotFoundError("Applicant not found");
    });
  }
}
