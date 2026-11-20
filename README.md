# Fillcart – Scalable Monorepo Platform

Fillcart is a multi-vendor on-demand product delivery platform engineered with a modular, security-hardened monorepo architecture.

> [!IMPORTANT] > **New Developer Onboarding & Architecture Verification:**
>
> - [**Fillcart Developer Onboarding, Local Setup & Integration Guide**](FILLCART_DEVELOPER_ONBOARDING_GUIDE.md) — The authoritative guide for local Docker PostgreSQL setup, Central Auth environment configuration, S2S integration, and application setup.
> - [**Fillcart Repository Verification & Architecture Audit Report**](FILLCART_REPOSITORY_VERIFICATION_REPORT.md) — The comprehensive technical verification audit, baseline evidence, and open architectural decisions.

---

## 1. Current Implementation Status

To prevent confusion, the table below documents the exact implementation status of each component in this repository snapshot:

| Subsystem / Application       | Directory                   | Status                                | Description                                                                                                                                                                 |
| ----------------------------- | --------------------------- | ------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Central Auth Backend**      | `apps/backend/`             | **Implemented & Operational**         | Express 5, Prisma 7, PostgreSQL 16. Handles authentication, Argon2id passwords, Ed25519 tokens, single-use refresh tokens, OTP via MSG91, and S2S session verification.     |
| **Shared Packages**           | `packages/*`                | **Implemented & Verified**            | All 8 TypeScript packages (`api-contracts`, `constants`, `design-tokens`, `shared-types`, `ui-web`, `utils`, `validations`, `config`) pass strict typecheck and unit tests. |
| **Shared Flutter Foundation** | `packages/flutter_shared/`  | **Implemented & Verified**            | Reusable Dart library (`fillcart_shared`): `FCNetworkClient`, interceptors (Auth, Correlation, Safe Logging), Material 3 `FCTheme`, and atomic UI widgets.                  |
| **Vendor Mobile App**         | `apps/vendor-app/`          | **Application Foundation / Skeleton** | Flutter 3.44.4 + Dart 3.12.2. Valid `pubspec.yaml`, entry point with error boundaries, BLoC state management foundation, and widget tests; business domain screens pending. |
| **Customer Mobile App**       | `apps/customer-app/`        | **Directory Scaffold Only**           | Feature folder layout with placeholder files. **No `pubspec.yaml` exists yet**; not a runnable application in this snapshot.                                                |
| **Rider Mobile App**          | `apps/rider-app/`           | **Directory Scaffold Only**           | Feature folder layout with placeholder files. **No `pubspec.yaml` exists yet**; not a runnable application in this snapshot.                                                |
| **Admin Dashboard**           | `apps/admin-dashboard/`     | **Directory Scaffold Only**           | Next.js directory scaffold with `.gitkeep` files. Build scripts echo pending Phase 2.2.6.                                                                                   |
| **Customer Website**          | `apps/website/`             | **Directory Scaffold Only**           | Next.js directory scaffold with `.gitkeep` files. Build scripts echo pending Phase 2.2.6.                                                                                   |
| **Business Backend Modules**  | `apps/backend/src/modules/` | **Scaffold Placeholders Only**        | 18 domain folders with `.gitkeep`. **Do NOT implement business domain APIs here.** Business backends must be developed as independent domain services.                      |

---

## 2. Monorepo Overview & Project Tour

```text
Fillcart/
├── apps/
│   ├── backend/             # Central Auth & Identity Provider (Express 5, Prisma 7, PostgreSQL 16)
│   ├── vendor-app/          # Vendor Mobile Application (Flutter 3.44.4 foundation / BLoC)
│   ├── customer-app/        # Customer Mobile Application (Directory scaffold; no pubspec.yaml)
│   ├── rider-app/           # Rider Mobile Application (Directory scaffold; no pubspec.yaml)
│   ├── admin-dashboard/     # Admin Web Portal (Next.js directory scaffold; pending Phase 2.2.6)
│   └── website/             # Customer Web Storefront (Next.js directory scaffold; pending Phase 2.2.6)
├── packages/
│   ├── api-contracts/       # OpenAPI 3.1 specifications and generated TypeScript DTOs
│   ├── config/              # Shared ESLint, Prettier, and TypeScript base configurations
│   ├── constants/           # Shared platform constants and system-wide enumerations
│   ├── design-tokens/       # Cross-platform design tokens (colors, typography, spacing)
│   ├── flutter_shared/      # Shared Flutter package (FCNetworkClient, interceptors, FCTheme)
│   ├── shared-types/        # Shared TypeScript domain interfaces and auth token claims
│   ├── ui-web/              # Shared React/Web UI components and coordinateWebLockRefresh helper
│   ├── utils/               # Shared cross-cutting utility functions
│   ├── validations/         # Shared Zod validation schemas for requests and payloads
│   └── assets/              # Brand assets, vectors, and shared graphics
├── infrastructure/         # Deployment definitions, Docker configurations, and CI/CD templates
├── docs/                   # Architectural blueprints, contracts, and integration documentation
├── scripts/                # Workspace automation scripts (including flutter-tooling.mjs)
├── docker-compose.yml       # Canonical Docker Compose template for local PostgreSQL 16
├── package.json             # Root monorepo configuration (npm workspaces)
├── turbo.json               # Turborepo build, lint, and test pipeline configuration
├── .nvmrc                   # Pinned Node.js version (26.13.1)
├── FILLCART_DEVELOPER_ONBOARDING_GUIDE.md   # Authoritative local setup and integration guide
├── FILLCART_REPOSITORY_VERIFICATION_REPORT.md # Technical verification audit and gate report
└── README.md               # Repository documentation and architecture overview
```

---

## 3. Technology Stack

| Layer                  | Technology            | Version / Specification                                      |
| ---------------------- | --------------------- | ------------------------------------------------------------ |
| **Runtime**            | Node.js               | `v26.13.1` (Active LTS, pinned in `.nvmrc`)                  |
| **Package Manager**    | npm Workspaces        | `v11.20.0` or higher                                         |
| **Monorepo Engine**    | Turborepo             | `2.11.11`                                                    |
| **Database**           | PostgreSQL            | `16-alpine` (Docker)                                         |
| **ORM**                | Prisma                | `7.10.1`                                                     |
| **Backend Framework**  | Express               | `5.3.0` (Modular TypeScript)                                 |
| **Password Security**  | Argon2id              | `@node-rs/argon2` ($m=65536, t=3, p=1$)                      |
| **Token Cryptography** | Ed25519 (EdDSA)       | Native Node.js `crypto` with JWKS (`/.well-known/jwks.json`) |
| **Mobile Framework**   | Flutter & Dart        | Flutter `3.44.4` / Dart `3.12.2`                             |
| **State Management**   | BLoC                  | `flutter_bloc: ^8.1.6`, `equatable: ^2.0.7`                  |
| **Mobile Networking**  | Dio                   | `5.7.0` (wrapped in `FCNetworkClient`)                       |
| **Web Framework**      | Next.js & React       | Next.js / React 19 (Scaffold)                                |
| **API Contracts**      | OpenAPI               | OpenAPI 3.1 validated with Redocly                           |
| **Validation**         | Zod                   | `3.25.x`                                                     |
| **Test Runners**       | Vitest & Flutter Test | Vitest `5.1.0` (Web & Backend), Flutter Test (Mobile)        |

---

## 4. Architectural Boundaries & Security Model

1. **Central Auth Boundary:**
   - Central Auth (`apps/backend`) is solely an **Identity Provider (IdP)**. It owns user identities, credentials, login/registration, OTP verification, sessions, refresh tokens, role assignments, and S2S authorization.
   - **Business domains (Orders, Products, Payments, Cart, Delivery, etc.) must NOT be implemented inside `apps/backend`.** The directories in `apps/backend/src/modules/` are repository scaffolds.
2. **Database Isolation & Least-Privilege Roles:**
   - **`fillcart_user` (`MIGRATION_DATABASE_URL`):** Privileged schema-owner role used exclusively for Prisma migrations and the standalone CLI maintenance script (`cleanup.ts`).
   - **`fillcart_app_user` (`DATABASE_URL`):** Runtime least-privilege connection. It has `SELECT`, `INSERT`, and `UPDATE` privileges, with **zero `DELETE` privileges** across all operational tables.
   - Business services must **never** query Central Auth database tables directly.
3. **Live S2S Session Verification:**
   - Business backends must authenticate incoming user requests by calling Central Auth's live S2S verification endpoint: `POST /api/v1/internal/auth/verify-session`.
   - Authorization is **fail-closed**: if Central Auth is unreachable or the session is revoked, the business service must reject the request immediately.
4. **Dart vs. TypeScript Isolation:**
   - Flutter applications consume shared Dart packages (`packages/flutter_shared`) and must not depend on TypeScript packages.
   - Web applications and the backend share TypeScript packages (`api-contracts`, `shared-types`, `validations`, `constants`, `utils`, `ui-web`).

---

## 5. Quick Start (Local Development)

### Prerequisites

- Node.js `v26.13.1` (run `nvm use` if using nvm)
- npm `v11.20.0` or higher
- Docker Desktop
- Flutter `3.44.4` / Dart `3.12.2` (for mobile development)

### Step 1: Install Dependencies

```bash
npm install
```

### Step 2: Start Local PostgreSQL Database

```bash
npm run docker:db:up
```

_(Starts PostgreSQL 16 container `fillcart-postgres` on `127.0.0.1:5432`)_

### Step 3: Configure Backend Environment

```bash
# Windows PowerShell:
Copy-Item apps/backend/.env.example apps/backend/.env

# macOS / Linux:
cp apps/backend/.env.example apps/backend/.env
```

### Step 4: Run Migrations & Generate Prisma Client

```bash
npx --prefix apps/backend prisma migrate deploy --config apps/backend/prisma7.config.ts
npx --prefix apps/backend prisma generate --schema=apps/backend/prisma/schema.prisma
```

### Step 5: Start Central Auth Development Server

```bash
npm --workspace=@fillcart/backend run dev
```

Verify the server is running:

```bash
curl http://127.0.0.1:4000/health/ready
```

_(Expected response: `{"status":"ready", ...}`)_

---

## 6. Primary Workspace Scripts

| Command                                    | Purpose                                                                              |
| ------------------------------------------ | ------------------------------------------------------------------------------------ |
| `npm run build`                            | Builds all packages and backend using Turborepo                                      |
| `npm run type-check`                       | Runs strict TypeScript typechecks across the monorepo                                |
| `npm run test`                             | Runs unit tests across packages and Central Auth backend                             |
| `npm run lint:openapi`                     | Validates OpenAPI 3.1 specifications with Redocly                                    |
| `npm run docker:db:up`                     | Starts local PostgreSQL container (`docker compose up -d postgres`)                  |
| `npm run docker:db:down`                   | Stops local PostgreSQL container safely (data preserved)                             |
| `npm run docker:db:clean`                  | Destructive database reset: stops and wipes Docker volume (`docker compose down -v`) |
| `node scripts/flutter-tooling.mjs format`  | Formats Dart code across Flutter packages                                            |
| `node scripts/flutter-tooling.mjs analyze` | Runs Dart analyzer across Flutter packages                                           |
| `node scripts/flutter-tooling.mjs test`    | Runs tests across Flutter packages                                                   |

---

## 7. Developer Guides & Reference Documents

- [**Developer Onboarding & Integration Guide**](FILLCART_DEVELOPER_ONBOARDING_GUIDE.md) — Comprehensive local setup, 19-variable environment table, audience derivation rules, applicant promotion workflow, and troubleshooting.
- [**Repository Verification & Architecture Report**](FILLCART_REPOSITORY_VERIFICATION_REPORT.md) — Codebase audit, evidence logs, gate evaluations, and the 8 open architectural decisions.
- [**OpenAPI 3.1 Specification**](packages/api-contracts/openapi/v1/openapi.yaml) — Authoritative REST API contracts.
