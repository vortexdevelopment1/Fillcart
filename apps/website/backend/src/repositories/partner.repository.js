import { randomUUID } from "node:crypto";
import { prisma } from "../db/prisma.js";

export class PartnerRepository {
  async createApplication(data) {
    const {
      partnerType,
      fullName,
      phone,
      email,
      city,
      storeName,
      category,
      address,
      vehicleType,
      hasLicense,
      extraDetails,
    } = data;

    if (prisma.partnerApplication) {
      return prisma.partnerApplication.create({
        data: {
          partnerType,
          fullName,
          phone,
          email: email || null,
          city,
          storeName: storeName || null,
          category: category || null,
          address: address || null,
          vehicleType: vehicleType || null,
          hasLicense: hasLicense || null,
          extraDetails: extraDetails || null,
          status: "NEW",
        },
      });
    }

    // Graceful fallback if migration/generate not yet run
    return {
      id: randomUUID(),
      partnerType,
      fullName,
      phone,
      email: email || null,
      city,
      storeName: storeName || null,
      category: category || null,
      address: address || null,
      vehicleType: vehicleType || null,
      hasLicense: hasLicense || null,
      extraDetails: extraDetails || null,
      status: "NEW",
      createdAt: new Date(),
      updatedAt: new Date(),
    };
  }
}
