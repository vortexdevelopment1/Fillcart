import { PrescriptionRepository } from "../repositories/prescription.repository.js";
import { ApiError } from "../utils/ApiError.js";
import { serialize } from "../utils/serialize.js";

export class PrescriptionService {
  constructor() {
    this.prescriptionRepo = new PrescriptionRepository();
  }

  async getPrescriptions(userId) {
    const list = await this.prescriptionRepo.findAll(userId);
    return serialize(list);
  }

  async getPrescriptionById(userId, id) {
    const prescription = await this.prescriptionRepo.findById(id, userId);
    if (!prescription) {
      throw new ApiError(404, "Prescription not found", "NOT_FOUND");
    }
    return serialize(prescription);
  }

  async createPrescription(userId, data) {
    const count = await this.prescriptionRepo.countByUserId(userId);
    if (count >= 20) {
      throw new ApiError(
        400,
        "Maximum limit of 20 prescriptions per user reached. Please remove older prescriptions before adding new ones.",
        "PRESCRIPTION_LIMIT_REACHED"
      );
    }

    if (!data.fileUrl || !data.fileUrl.startsWith("https://")) {
      throw new ApiError(400, "Prescription file URL must be a valid secure HTTPS link", "INVALID_FILE_URL");
    }

    const created = await this.prescriptionRepo.create(userId, {
      fileName: data.fileName.trim(),
      fileUrl: data.fileUrl.trim(),
      fileType: data.fileType.trim().toLowerCase(),
      patientName: data.patientName ? data.patientName.trim() : null,
      doctorName: data.doctorName ? data.doctorName.trim() : null,
      notes: data.notes ? data.notes.trim() : null,
    });

    return serialize(created);
  }

  async deletePrescription(userId, id) {
    const existing = await this.prescriptionRepo.findById(id, userId);
    if (!existing) {
      throw new ApiError(404, "Prescription not found", "NOT_FOUND");
    }

    await this.prescriptionRepo.delete(id, userId);
    return { message: "Prescription deleted successfully" };
  }
}
