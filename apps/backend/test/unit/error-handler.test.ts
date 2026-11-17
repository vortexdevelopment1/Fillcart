import { describe, it, expect, vi } from "vitest";
import type { Request, Response, NextFunction } from "express";
import { z } from "@fillcart/validations";
import { errorHandler } from "../../src/middleware/error-handler.js";
import { ValidationError, NotFoundError } from "../../src/errors/app-error.js";
import { ERROR_CODES } from "../../src/constants/error-codes.js";

describe("Error Handler Middleware Unit Tests", () => {
  const dummyRequestId = "123e4567-e89b-12d3-a456-426614174000";

  function createMocks() {
    const req = {
      id: dummyRequestId,
    } as unknown as Request & { id: string };

    const jsonMock = vi.fn();
    const statusMock = vi.fn().mockReturnValue({ json: jsonMock });
    const res = {
      status: statusMock,
      getHeader: vi.fn().mockReturnValue(dummyRequestId),
    } as unknown as Response;

    const next = vi.fn() as NextFunction;

    return { req, res, statusMock, jsonMock, next };
  }

  it("maps operational ValidationError to HTTP 400 with VALIDATION_ERROR code and details", () => {
    const { req, res, statusMock, jsonMock, next } = createMocks();
    const error = new ValidationError("Invalid parameters", [
      { field: "body.email", message: "Email required" },
    ]);

    errorHandler(error, req, res, next);

    expect(statusMock).toHaveBeenCalledWith(400);
    expect(jsonMock).toHaveBeenCalledWith({
      error: {
        code: ERROR_CODES.VALIDATION_ERROR,
        message: "Invalid parameters",
        requestId: dummyRequestId,
        details: [{ field: "body.email", message: "Email required" }],
      },
    });
  });

  it("maps operational NotFoundError to HTTP 404 with NOT_FOUND code", () => {
    const { req, res, statusMock, jsonMock, next } = createMocks();
    const error = new NotFoundError("User not found");

    errorHandler(error, req, res, next);

    expect(statusMock).toHaveBeenCalledWith(404);
    expect(jsonMock).toHaveBeenCalledWith({
      error: {
        code: ERROR_CODES.NOT_FOUND,
        message: "User not found",
        requestId: dummyRequestId,
      },
    });
  });

  it("classifies unexpected internal ZodError as HTTP 500 INTERNAL_SERVER_ERROR", () => {
    const { req, res, statusMock, jsonMock, next } = createMocks();

    // Internal schema parsing failure inside a service/handler
    const internalSchema = z.object({ internalSecret: z.string() });
    const parseResult = internalSchema.safeParse({});
    expect(parseResult.success).toBe(false);

    if (!parseResult.success) {
      errorHandler(parseResult.error, req, res, next);
    }

    expect(statusMock).toHaveBeenCalledWith(500);
    expect(jsonMock).toHaveBeenCalledWith({
      error: {
        code: ERROR_CODES.INTERNAL_SERVER_ERROR,
        message: "An internal server error occurred",
        requestId: dummyRequestId,
      },
    });
  });

  it("classifies unhandled generic Error as HTTP 500 INTERNAL_SERVER_ERROR without leaking stack trace", () => {
    const { req, res, statusMock, jsonMock, next } = createMocks();
    const genericError = new Error("Database connection dropped unexpectedly");

    errorHandler(genericError, req, res, next);

    expect(statusMock).toHaveBeenCalledWith(500);
    expect(jsonMock).toHaveBeenCalledWith({
      error: {
        code: ERROR_CODES.INTERNAL_SERVER_ERROR,
        message: "An internal server error occurred",
        requestId: dummyRequestId,
      },
    });
  });
});
