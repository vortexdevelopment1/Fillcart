import { ERROR_CODES, type ErrorCode } from "../constants/error-codes.js";

export interface FieldError {
  field: string;
  message: string;
}

export class AppError extends Error {
  public readonly statusCode: number;
  public readonly code: ErrorCode;
  public readonly details?: FieldError[];
  public readonly isOperational: boolean;

  constructor(
    message: string,
    statusCode: number = 500,
    code: ErrorCode = ERROR_CODES.INTERNAL_SERVER_ERROR,
    details?: FieldError[]
  ) {
    super(message);
    this.name = this.constructor.name;
    this.statusCode = statusCode;
    this.code = code;
    this.details = details;
    this.isOperational = true;

    Error.captureStackTrace(this, this.constructor);
  }
}

export class NotFoundError extends AppError {
  constructor(message: string = "Resource not found") {
    super(message, 404, ERROR_CODES.NOT_FOUND);
  }
}

export class ValidationError extends AppError {
  constructor(message: string = "Validation failed", details?: FieldError[]) {
    super(message, 400, ERROR_CODES.VALIDATION_ERROR, details);
  }
}

export class UnauthorizedError extends AppError {
  constructor(
    message: string = "Unauthorized",
    code: ErrorCode = ERROR_CODES.UNAUTHORIZED,
    details?: FieldError[]
  ) {
    super(message, 401, code, details);
  }
}

export class ForbiddenError extends AppError {
  constructor(
    message: string = "Forbidden",
    code: ErrorCode = ERROR_CODES.FORBIDDEN,
    details?: FieldError[]
  ) {
    super(message, 403, code, details);
  }
}

export class BadRequestError extends AppError {
  constructor(
    message: string = "Bad Request",
    code: ErrorCode = ERROR_CODES.BAD_REQUEST,
    details?: FieldError[]
  ) {
    super(message, 400, code, details);
  }
}

export class InternalServerError extends AppError {
  constructor(
    message: string = "An internal server error occurred",
    code: ErrorCode = ERROR_CODES.INTERNAL_SERVER_ERROR,
    details?: FieldError[]
  ) {
    super(message, 500, code, details);
  }
}

export class ConflictError extends AppError {
  constructor(
    message: string = "State transition conflict",
    code: ErrorCode = ("STATE_CONFLICT" as any),
    details?: FieldError[]
  ) {
    super(message, 409, code, details);
  }
}

export class MigrationPendingError extends AppError {
  constructor(
    message: string = "Required database table does not exist. Migration is pending.",
    code: ErrorCode = ("MIGRATION_PENDING" as any)
  ) {
    super(message, 503, code);
  }
}

export function handlePrismaTableErrors(err: unknown): never {
  const pErr = err as { code?: string; message?: string };
  if (
    pErr?.code === "P2021" ||
    (typeof pErr?.message === "string" &&
      (pErr.message.includes("does not exist in the current database") ||
        pErr.message.includes("relation") && pErr.message.includes("does not exist")))
  ) {
    throw new MigrationPendingError();
  }
  throw err;
}
