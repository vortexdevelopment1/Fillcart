# Dart API Contracts & Models (`packages/api-contracts/dart/`)

This directory is reserved for **Dart API models, serialization adapters, and client stubs** generated directly from the authoritative OpenAPI specification in `packages/api-contracts/openapi/`.

---

## 1. Architectural Purpose

- **Strong-Typed Mobile Contracts**: Provides Dart data models and API client libraries consumed by:
  - `apps/customer-app/`
  - `apps/vendor-app/`
  - `apps/rider-app/`
- **Zero Manual Schema Duplication**: Eliminates manual, error-prone translation of backend endpoints and DTOs into Dart classes.
- **Type Safety**: Automatically aligns serialization logic (`fromJson` / `toJson`) with backend request/response structures.

---

## 2. Generation Workflow (Future Phase)

1. Updates are applied and validated in `packages/api-contracts/openapi/v1/`.
2. OpenAPI generator tooling (e.g., `openapi-generator-cli`) compiles the specification into strong-typed Dart classes.
3. Mobile applications import the compiled models either through this package or via `packages/flutter_shared/`.
