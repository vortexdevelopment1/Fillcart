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

export class InternalServerError extends AppError {
  constructor(message: string = "An internal server error occurred") {
    super(message, 500, ERROR_CODES.INTERNAL_SERVER_ERROR);
  }
}
