# OpenAPI Version 1 Specification (`packages/api-contracts/openapi/v1/`)

This directory will contain the version 1 (`v1`) OpenAPI specification files defining the Fillcart REST API.

---

## Structure Guidelines

- **Root Specification**: Will contain the root OpenAPI document (e.g., `openapi.yaml`) defining platform metadata, security schemes, tags, and global server definitions.
- **Components & Paths**: Endpoints and schema components will be organized cleanly by domain matching the backend modules:
  - Auth, Users, Products, Categories, Orders, Cart, Payments, Delivery, Vendors, Riders, Analytics, Admin.
- **Validation**: Specifications must pass standard OpenAPI linters (e.g., Spectral) before triggering automated TypeScript or Dart client code generation.
