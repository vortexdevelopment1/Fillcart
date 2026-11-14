# Prisma Single Source of Truth (`apps/backend/prisma/`)

This directory is the **exclusive, authoritative owner** of all database schema definitions, Prisma-generated migrations, and seed scripts for the Fillcart ecosystem.

---

## 1. Architectural Responsibilities

- **`schema.prisma`** (future): Declarative schema definitions for PostgreSQL tables, relations, enums, and indexes.
- **`migrations/`**: Chronological, versioned SQL migrations generated exclusively by the Prisma CLI (`prisma migrate dev`, `prisma migrate deploy`).
- **`seeds/`**: Seed data definitions and database seeding entry points (`seed.ts`) executed via Prisma CLI runner.

---

## 2. Strict Architectural Boundaries

1. **Single Migration Authority**: All schema migrations MUST originate from and be managed within this directory. No secondary migration tools or manual SQL scripts outside of Prisma migration history are permitted.
2. **Separation from Runtime**: This directory strictly contains schema definitions, declarative migrations, and seeding scripts. Runtime database connection pooling and Prisma Client instantiation live in `src/database/`.
