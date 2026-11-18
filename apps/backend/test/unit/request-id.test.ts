import { describe, it, expect, vi } from "vitest";
import type { Request, Response } from "express";
import {
  isValidUuid,
  requestIdMiddleware,
} from "../../src/middleware/request-id.js";

describe("Request ID Middleware Unit Tests", () => {
  it("validates RFC-4122 / RFC-9562 UUID versions (v1, v4, v7)", () => {
    // Valid v1
    expect(isValidUuid("c7e7b51e-e2b2-11ef-bd50-325096b39f47")).toBe(true);
    // Valid v4
    expect(isValidUuid("123e4567-e89b-12d3-a456-426614174000")).toBe(true);
    // Valid v7
    expect(isValidUuid("018f3a55-8c7c-7d9a-9e12-3456789abcde")).toBe(true);

    // Invalid non-UUID strings
    expect(isValidUuid("not-a-uuid")).toBe(false);
    expect(isValidUuid("12345")).toBe(false);
    expect(isValidUuid("")).toBe(false);
    expect(isValidUuid(null)).toBe(false);
    expect(isValidUuid(undefined)).toBe(false);
  });

  it("preserves incoming valid UUID and attaches to req.id and res header", () => {
    const validId = "123e4567-e89b-12d3-a456-426614174000";
    const req = {
      header: vi.fn().mockReturnValue(validId),
    } as unknown as Request & { id: string };

    const setHeaderMock = vi.fn();
    const res = {
      setHeader: setHeaderMock,
    } as unknown as Response;

    const next = vi.fn();

    requestIdMiddleware(req, res, next);

    expect(req.id).toBe(validId);
    expect(setHeaderMock).toHaveBeenCalledWith("x-request-id", validId);
    expect(next).toHaveBeenCalledTimes(1);
  });

  it("generates a new valid UUID when incoming header is missing", () => {
    const req = {
      header: vi.fn().mockReturnValue(undefined),
    } as unknown as Request & { id: string };

    const setHeaderMock = vi.fn();
    const res = {
      setHeader: setHeaderMock,
    } as unknown as Response;

    const next = vi.fn();

    requestIdMiddleware(req, res, next);

    expect(isValidUuid(req.id)).toBe(true);
    expect(setHeaderMock).toHaveBeenCalledWith("x-request-id", req.id);
    expect(next).toHaveBeenCalledTimes(1);
  });

  it("generates a new valid UUID when incoming header is malformed or oversized", () => {
    const req = {
      header: vi.fn().mockReturnValue("malicious-oversized-header-payload-123"),
    } as unknown as Request & { id: string };

    const setHeaderMock = vi.fn();
    const res = {
      setHeader: setHeaderMock,
    } as unknown as Response;

    const next = vi.fn();

    requestIdMiddleware(req, res, next);

    expect(isValidUuid(req.id)).toBe(true);
    expect(req.id).not.toBe("malicious-oversized-header-payload-123");
    expect(setHeaderMock).toHaveBeenCalledWith("x-request-id", req.id);
    expect(next).toHaveBeenCalledTimes(1);
  });
});
