import { PrescriptionService } from "../services/prescription.service.js";

const prescriptionService = new PrescriptionService();

export async function getPrescriptions(req, res, next) {
  try {
    const prescriptions = await prescriptionService.getPrescriptions(req.user.id);
    return res.status(200).json({
      success: true,
      data: prescriptions,
    });
  } catch (err) {
    next(err);
  }
}

export async function getPrescriptionById(req, res, next) {
  try {
    const prescription = await prescriptionService.getPrescriptionById(
      req.user.id,
      req.params.id
    );
    return res.status(200).json({
      success: true,
      data: prescription,
    });
  } catch (err) {
    next(err);
  }
}

export async function createPrescription(req, res, next) {
  try {
    const prescription = await prescriptionService.createPrescription(
      req.user.id,
      req.body
    );
    return res.status(201).json({
      success: true,
      data: prescription,
    });
  } catch (err) {
    next(err);
  }
}

export async function deletePrescription(req, res, next) {
  try {
    const result = await prescriptionService.deletePrescription(
      req.user.id,
      req.params.id
    );
    return res.status(200).json({
      success: true,
      data: result,
    });
  } catch (err) {
    next(err);
  }
}
