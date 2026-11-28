import { Router } from "express";
import {
  getPrescriptions,
  getPrescriptionById,
  createPrescription,
  deletePrescription,
} from "../controllers/prescription.controller.js";
import { requireAuth } from "../middlewares/requireAuth.js";
import { validate } from "../middlewares/validate.js";
import {
  createPrescriptionSchema,
  prescriptionIdParamSchema,
} from "../validators/prescription.validator.js";

export const prescriptionRouter = Router();

// All prescription endpoints require customer authentication
prescriptionRouter.use(requireAuth);

prescriptionRouter.get("/", getPrescriptions);
prescriptionRouter.post("/", validate(createPrescriptionSchema), createPrescription);
prescriptionRouter.get("/:id", validate(prescriptionIdParamSchema), getPrescriptionById);
prescriptionRouter.delete("/:id", validate(prescriptionIdParamSchema), deletePrescription);
