# Authoritative OpenAPI Specifications (`packages/api-contracts/openapi/`)

This directory houses the **canonical, language-neutral API specifications** (OpenAPI / Swagger 3.x) for the entire Fillcart platform.

---

## 1. Architectural Purpose

- **Single Source of Truth**: Serves as the authoritative blueprint for all REST endpoints, query parameters, request bodies, response schemas, and authentication schemes across the platform.
- **Contract-First Development**: Eliminates drift between backend implementations and frontend consumers (web & mobile).
- **Multi-Language Codegen Target**: Generates type-safe TypeScript interfaces for web and backend apps, and strong-typed Dart models and API clients for Flutter mobile applications.

---

## 2. Directory Structure

- **`v1/`**: Version 1 OpenAPI specification documents (`openapi.yaml` / modular JSON/YAML schemas).
- Additional major API versions (`v2/`, etc.) will reside in dedicated versioned subdirectories alongside `v1/`.
