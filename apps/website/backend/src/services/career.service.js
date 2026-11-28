import { CareerRepository } from "../repositories/career.repository.js";

export class CareerService {
  constructor() {
    this.careerRepo = new CareerRepository();
  }

  getOpenings(filters = {}) {
    return this.careerRepo.findOpenings(filters);
  }

  async submitApplication(payload) {
    // Honeypot check: If bot filled honeypot, return early without saving
    if (payload.honeypot || payload._hp) {
      return { id: "spam-filtered", message: "Application submitted successfully" };
    }

    const fullName = payload.fullName || payload.name;
    const record = await this.careerRepo.createApplication({
      fullName,
      email: payload.email,
      phone: payload.phone,
      jobTitle: payload.jobTitle || payload.jobId,
      department: payload.department,
      experience: payload.experience,
      resumeName: payload.resumeName,
      resumeUrl: payload.resumeUrl,
      coverNote: payload.coverNote,
    });

    return {
      id: record.id,
      message: "Application submitted successfully",
    };
  }
}
