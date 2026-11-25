import type { PrismaClient } from "../../../../database/generated/client/client.js";
import { NotFoundError } from "../../../../errors/app-error.js";
import type {
  GetApplicantsQuery,
  ReviewDocumentRequest,
  ApplicantDecisionRequest,
} from "@fillcart/validations";

export class VerificationService {
  constructor(private prisma: PrismaClient) {}

  public async getApplicants(query: GetApplicantsQuery) {
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
  }

  public async getApplicantDetails(id: string) {
    const doc = await this.prisma.document.findFirst({
      where: {
        OR: [{ id }, { vendorId: id }, { riderId: id }],
        isDeleted: false,
      },
      include: {
        documentType: true,
        fileAsset: true,
        vendor: {
          include: {
            user: { select: { id: true, fullName: true, displayEmail: true, phone: true, createdAt: true } },
            stores: true,
            bankAccounts: true,
          },
        },
        rider: {
          include: {
            user: { select: { id: true, fullName: true, displayEmail: true, phone: true, createdAt: true } },
            vehicles: true,
            bankAccounts: true,
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
  }

  public async reviewDocument(
    documentId: string,
    adminUserId: string,
    payload: ReviewDocumentRequest
  ) {
    const doc = await this.prisma.document.findUnique({
      where: { id: documentId },
    });

    if (!doc) {
      throw new NotFoundError("Document not found");
    }

    const newStatus = payload.status === "Approved" ? "APPROVED" : "REJECTED";
    const action = payload.status === "Approved" ? "APPROVE" : "REJECT";

    const updated = await this.prisma.document.update({
      where: { id: documentId },
      data: {
        status: newStatus as any,
        rejectReason: payload.reason || null,
        rejectRemarks: payload.remarks || null,
        reviewedByUserId: adminUserId,
        reviewedAt: new Date(),
      },
    });

    await this.prisma.documentReview.create({
      data: {
        documentId,
        reviewedByUserId: adminUserId,
        action: action as any,
        reason: payload.reason || null,
        remarks: payload.remarks || null,
      },
    });

    return {
      success: true,
      documentId: updated.id,
      status: updated.status,
    };
  }

  public async applicantDecision(
    applicantId: string,
    _adminUserId: string,
    payload: ApplicantDecisionRequest
  ) {
    const isApproved = payload.decision === "Approved";
    const vendorStatus = isApproved ? "ACTIVE" : "REJECTED";
    const riderStatus = isApproved ? "ACTIVE" : "REJECTED";

    const vendor = await this.prisma.vendor.findUnique({
      where: { id: applicantId },
    });

    if (vendor) {
      await this.prisma.vendor.update({
        where: { id: applicantId },
        data: { status: vendorStatus as any },
      });
      return { success: true, applicantType: "VENDOR", status: vendorStatus };
    }

    const rider = await this.prisma.rider.findUnique({
      where: { id: applicantId },
    });

    if (rider) {
      await this.prisma.rider.update({
        where: { id: applicantId },
        data: { status: riderStatus as any },
      });
      return { success: true, applicantType: "RIDER", status: riderStatus };
    }

    return { success: true, status: isApproved ? "APPROVED" : "REJECTED" };
  }
}
