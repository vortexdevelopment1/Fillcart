import type { Response, NextFunction } from "express";
import type { AdminAuthRequest } from "../../middleware/admin-auth.middleware.js";
import type { VerificationService } from "../services/verification.service.js";
import type {
  GetApplicantsQuery,
  ReviewDocumentRequest,
  ApplicantDecisionRequest,
} from "@fillcart/validations";

export class VerificationController {
  constructor(private verificationService: VerificationService) {}

  public getApplicants = async (
    req: AdminAuthRequest,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const query = req.query as unknown as GetApplicantsQuery;
      const result = await this.verificationService.getApplicants(query);
      res.status(200).json(result);
    } catch (err) {
      next(err);
    }
  };

  public getApplicantDetails = async (
    req: AdminAuthRequest,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const id = req.params.id as string;
      const result = await this.verificationService.getApplicantDetails(id);
      res.status(200).json(result);
    } catch (err) {
      next(err);
    }
  };

  public reviewDocument = async (
    req: AdminAuthRequest,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const documentId = req.params.id as string;
      const adminUserId = req.adminUser?.id || "system";
      const payload = req.body as ReviewDocumentRequest;
      const result = await this.verificationService.reviewDocument(
        documentId,
        adminUserId,
        payload
      );
      res.status(200).json(result);
    } catch (err) {
      next(err);
    }
  };

  public applicantDecision = async (
    req: AdminAuthRequest,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const applicantId = req.params.id as string;
      const adminUserId = req.adminUser?.id || "system";
      const payload = req.body as ApplicantDecisionRequest;
      const result = await this.verificationService.applicantDecision(
        applicantId,
        adminUserId,
        payload
      );
      res.status(200).json(result);
    } catch (err) {
      next(err);
    }
  };
}
