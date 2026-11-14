# Backend Runtime Database Infrastructure (`src/database/`)

This directory houses the **application-runtime database infrastructure** for the central Express.js backend.

---

## 1. Architectural Responsibilities

- **`client/`**: Instantiation, lifecycle configuration, and global singleton export of the generated `@prisma/client`.
- **`connection/`**: Database connection lifecycle management, health check probes, connection pool tuning, and disconnect event hooks.
- **`repositories/`**: Generic, low-level database access utilities and cross-cutting query abstractions.

---

## 2. Strict Architectural Boundaries

1. **No Migration Logic**: Schema migrations and seed definitions belong strictly in `apps/backend/prisma/`. This directory does NOT own or manage database schemas or migration files.
2. **Runtime Focus**: Everything here operates strictly within the running Node.js application process, consuming the generated Prisma client.
