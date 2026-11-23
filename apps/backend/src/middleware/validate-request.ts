import type { Request, Response, NextFunction } from "express";
import type { z } from "@fillcart/validations";
import { ValidationError, type FieldError } from "../errors/app-error.js";

export interface RequestValidationSchemas {
  body?: z.ZodTypeAny;
  query?: z.ZodTypeAny;
  params?: z.ZodTypeAny;
}

/**
 * Middleware that validates incoming request boundary (body, query, params).
 * Failures at this boundary explicitly throw ValidationError, which maps to HTTP 400.
 */
export function validateRequest(schemas: RequestValidationSchemas) {
  return (req: Request, _res: Response, next: NextFunction): void => {
    const fieldErrors: FieldError[] = [];

    if (schemas.body) {
      const result = schemas.body.safeParse(req.body);
      if (!result.success) {
        for (const issue of result.error.issues) {
          fieldErrors.push({
            field: `body.${issue.path.join(".") || "value"}`,
            message: issue.message,
          });
        }
      } else {
        req.body = result.data;
      }
    }

    if (schemas.query) {
      const result = schemas.query.safeParse(req.query);
      if (!result.success) {
        for (const issue of result.error.issues) {
          fieldErrors.push({
            field: `query.${issue.path.join(".") || "value"}`,
            message: issue.message,
          });
        }
      } else {
        Object.defineProperty(req, "query", {
          value: result.data,
          writable: true,
          enumerable: true,
          configurable: true,
        });
      }
    }

    if (schemas.params) {
      const result = schemas.params.safeParse(req.params);
      if (!result.success) {
        for (const issue of result.error.issues) {
          fieldErrors.push({
            field: `params.${issue.path.join(".") || "value"}`,
            message: issue.message,
          });
        }
      } else {
        Object.defineProperty(req, "params", {
          value: result.data,
          writable: true,
          enumerable: true,
          configurable: true,
        });
      }
    }

    if (fieldErrors.length > 0) {
      next(new ValidationError("Request validation failed", fieldErrors));
      return;
    }

    next();
  };
}
