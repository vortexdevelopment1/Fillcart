import { Router } from "express";
import { validateRequest } from "../../../../middleware/validate-request.js";
import type { VerificationController } from "../controllers/verification.controller.js";
import {
  getApplicantsQuerySchema,
  reviewDocumentSchema,
  applicantDecisionSchema,
} from "@fillcart/validations";

export interface VerificationRouterDependencies {
  verificationController: VerificationController;
}

export function createVerificationRouter(
  deps: VerificationRouterDependencies
): Router {
  const router = Router();

  // GET /api/v1/admin/verification/applicants
  router.get(
    "/applicants",
    validateRequest({ query: getApplicantsQuerySchema }),
    deps.verificationController.getApplicants
  );

  // GET /api/v1/admin/verification/applicants/:id
  router.get(
    "/applicants/:id",
    deps.verificationController.getApplicantDetails
  );

  // PATCH /api/v1/admin/verification/documents/:id/review
  router.patch(
    "/documents/:id/review",
    validateRequest({ body: reviewDocumentSchema }),
    deps.verificationController.reviewDocument
  );

  // POST /api/v1/admin/verification/applicants/:id/decision
  router.post(
    "/applicants/:id/decision",
    validateRequest({ body: applicantDecisionSchema }),
    deps.verificationController.applicantDecision
  );

  return router;
}
