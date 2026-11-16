import { describe, expect, it } from "vitest";
import { paginationQuerySchema, type PaginationQuery } from "./common.js";

describe("paginationQuerySchema", () => {
  it("applies default values when page and limit are omitted", () => {
    const result = paginationQuerySchema.parse({});
    expect(result).toEqual<PaginationQuery>({ page: 1, limit: 20 });
  });

  it("parses and coerces valid string numbers into integers", () => {
    const result = paginationQuerySchema.parse({ page: "3", limit: "50" });
    expect(result).toEqual<PaginationQuery>({ page: 3, limit: 50 });
  });

  it("rejects non-positive page numbers", () => {
    expect(() => paginationQuerySchema.parse({ page: 0 })).toThrow();
    expect(() => paginationQuerySchema.parse({ page: -5 })).toThrow();
  });

  it("rejects limits exceeding the maximum boundary", () => {
    expect(() => paginationQuerySchema.parse({ limit: 101 })).toThrow();
  });
});
