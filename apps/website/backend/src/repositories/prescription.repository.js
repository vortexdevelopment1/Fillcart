import { randomUUID } from "node:crypto";
import { prisma } from "../db/prisma.js";

// In-memory fallback store when migration has not yet generated models
const fallbackPrescriptions = new Map();

export class PrescriptionRepository {
  async findAll(userId) {
    if (prisma.prescription) {
      return prisma.prescription.findMany({
        where: { userId },
        orderBy: { createdAt: "desc" },
      });
    }

    return Array.from(fallbackPrescriptions.values())
      .filter((p) => p.userId === userId)
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  }

  async findById(id, userId) {
    if (prisma.prescription) {
      return prisma.prescription.findFirst({
        where: { id, userId },
      });
    }

    const item = fallbackPrescriptions.get(id);
    return item && item.userId === userId ? item : null;
  }

  async countByUserId(userId) {
    if (prisma.prescription) {
      return prisma.prescription.count({
        where: { userId },
      });
    }

    return Array.from(fallbackPrescriptions.values()).filter((p) => p.userId === userId).length;
  }

  async create(userId, data) {
    if (prisma.prescription) {
      return prisma.prescription.create({
        data: {
          userId,
          fileName: data.fileName,
          fileUrl: data.fileUrl,
          fileType: data.fileType,
          patientName: data.patientName || null,
          doctorName: data.doctorName || null,
          notes: data.notes || null,
          status: "PENDING",
        },
      });
    }

    const id = randomUUID();
    const created = {
      id,
      userId,
      fileName: data.fileName,
      fileUrl: data.fileUrl,
      fileType: data.fileType,
      patientName: data.patientName || null,
      doctorName: data.doctorName || null,
      notes: data.notes || null,
      status: "PENDING",
      rejectionReason: null,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    fallbackPrescriptions.set(id, created);
    return created;
  }

  async delete(id, userId) {
    if (prisma.prescription) {
      return prisma.prescription.deleteMany({
        where: { id, userId },
      });
    }

    const item = fallbackPrescriptions.get(id);
    if (item && item.userId === userId) {
      fallbackPrescriptions.delete(id);
      return { count: 1 };
    }
    return { count: 0 };
  }

  static clearFallback() {
    fallbackPrescriptions.clear();
  }
}
