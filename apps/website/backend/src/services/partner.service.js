import { PartnerRepository } from "../repositories/partner.repository.js";

export class PartnerService {
  constructor() {
    this.partnerRepo = new PartnerRepository();
  }

  async submitVendorApplication(payload) {
    if (payload.honeypot || payload._hp) {
      return { id: "spam-filtered", message: "Vendor application submitted successfully" };
    }

    const record = await this.partnerRepo.createApplication({
      partnerType: "VENDOR",
      fullName: payload.ownerName,
      phone: payload.phone,
      email: payload.email,
      city: payload.city,
      storeName: payload.storeName,
      category: payload.category,
      address: payload.address,
    });

    return {
      id: record.id,
      message: "Vendor application submitted successfully",
    };
  }

  async submitRiderApplication(payload) {
    if (payload.honeypot || payload._hp) {
      return { id: "spam-filtered", message: "Rider application submitted successfully" };
    }

    const record = await this.partnerRepo.createApplication({
      partnerType: "RIDER",
      fullName: payload.fullName,
      phone: payload.phone,
      email: payload.email,
      city: payload.city,
      vehicleType: payload.vehicleType,
      hasLicense: payload.hasLicense,
    });

    return {
      id: record.id,
      message: "Rider application submitted successfully",
    };
  }
}
