# Fillcart Developer Onboarding, Local Setup & Integration Guide

Welcome to the **Fillcart** engineering team!

This guide is your authoritative, step-by-step onboarding document. It explains how to set up your local development environment, run an isolated PostgreSQL database using Docker, configure and run the Central Auth backend, integrate client applications and future business backends, and adhere to Fillcart's security and architecture standards.

> [!IMPORTANT]
> **Repository Implementation Status (Read First):**
> - **Central Auth Backend (`apps/backend`)**: Implemented and operational.
> - **Shared Libraries (`packages/*`)**: Implemented and verified (API contracts, design tokens, shared types, validations, UI web helpers, Flutter shared library).
> - **Vendor Mobile App (`apps/vendor-app`)**: Foundation/MVP skeleton implemented (BLoC, Material 3 theme, error boundaries, widget tests; business screens pending).
> - **Customer & Rider Mobile Apps (`apps/customer-app`, `apps/rider-app`)**: Directory scaffolds only (no `pubspec.yaml`; not runnable in this snapshot).
> - **Web Applications (`apps/admin-dashboard`, `apps/website`)**: Directory scaffolds only (scripts echo pending Phase 2.2.6; not runnable in this snapshot).
> - **Business Backends (`customer-backend`, `vendor-backend`, `rider-backend`, `admin-backend`)**: Not yet implemented. They must be developed as independent domain services with their own databases. **Never** implement business domain APIs inside `apps/backend/src/modules/`.

---

## Table of Contents

1. [System Requirements & Software Installation](#1-system-requirements--software-installation)
2. [Repository Structure & Project Tour](#2-repository-structure--project-tour)
3. [Independent Local PostgreSQL Setup (Docker)](#3-independent-local-postgresql-setup-docker)
4. [Central Auth Backend Setup & Database Migrations](#4-central-auth-backend-setup--database-migrations)
5. [How Central Auth Works (Integration Guide)](#5-how-central-auth-works-integration-guide)
6. [Application-Specific Setup (The 5 Applications)](#6-application-specific-setup-the-5-applications)
   - [A. Vendor App (Flutter Foundation)](#a-vendor-app-flutter-foundation)
   - [B. Customer App (Flutter Scaffold)](#b-customer-app-flutter-scaffold)
   - [C. Rider App (Flutter Scaffold)](#c-rider-app-flutter-scaffold)
   - [D. Admin Dashboard (Next.js Scaffold)](#d-admin-dashboard-nextjs-scaffold)
   - [E. Customer Website (Next.js Scaffold)](#e-customer-website-nextjs-scaffold)
7. [Building Your Business Backend & Database Ownership](#7-building-your-business-backend--database-ownership)
8. [Frontend Authentication Rules](#8-frontend-authentication-rules)
9. [Developer Responsibilities & Code Boundaries](#9-developer-responsibilities--code-boundaries)
10. [Useful Terminal Commands Cheat Sheet](#10-useful-terminal-commands-cheat-sheet)
11. [Troubleshooting & Common Pitfalls](#11-troubleshooting--common-pitfalls)
12. [Verification & Health Checks](#12-verification--health-checks)
13. [Open Architecture Decisions & Owner Sign-Offs](#13-open-architecture-decisions--owner-sign-offs)

---

## 1. System Requirements & Software Installation

Before cloning or running the repository, verify that your machine meets these software requirements:

| Software | Required Version | Purpose | Verification Command |
|---|---|---|---|
| **Node.js** | `>=26.13.1` (Active LTS, pinned `26.13.1`) | JavaScript/TypeScript runtime for backend and web apps | `node --version` |
| **npm** | `v11.20.0` or higher | Workspace package manager | `npm --version` |
| **Docker Desktop** | Latest stable | Container runtime for local PostgreSQL database | `docker --version` |
| **Flutter SDK** | `3.44.4` (channel stable) | Mobile application framework | `flutter --version` |
| **Dart SDK** | `3.12.2` (bundled with Flutter) | Dart compiler and analyzer | `dart --version` |
| **Git** | Latest stable | Version control | `git --version` |

> [!TIP]
> **Node Version Enforcement:**
> The repository root contains an `.nvmrc` file specifying `26.13.1`. If you use `nvm` (macOS/Linux) or `nvm-windows`, run:
> ```bash
> nvm use
> ```

---

## 2. Repository Structure & Project Tour

Fillcart is an npm workspace monorepo orchestrated with Turborepo:

```text
Fillcart/
├── apps/
│   ├── backend/             # Central Auth Service (Node.js 26, Express 5, Prisma 7, PostgreSQL 16)
│   ├── vendor-app/          # Vendor Mobile App (Flutter 3.44.4 foundation / BLoC skeleton)
│   ├── customer-app/        # Customer Mobile App (Directory scaffold; no pubspec.yaml)
│   ├── rider-app/           # Rider Mobile App (Directory scaffold; no pubspec.yaml)
│   ├── admin-dashboard/     # Admin Web Portal (Directory scaffold; pending Phase 2.2.6)
│   └── website/             # Customer Web Storefront (Directory scaffold; pending Phase 2.2.6)
├── packages/
│   ├── api-contracts/       # OpenAPI 3.1 specifications and generated TypeScript DTOs
│   ├── config/              # Shared ESLint, Prettier, and TypeScript base configurations
│   ├── constants/           # Shared system-wide constants and enumerations
│   ├── design-tokens/       # Shared UI design tokens (palette, spacing, typography)
│   ├── flutter_shared/      # Shared Flutter package (FCNetworkClient, interceptors, FCTheme)
│   ├── shared-types/        # Shared domain and auth TypeScript interfaces
│   ├── ui-web/              # Shared React/Web UI components and coordinateWebLockRefresh helper
│   ├── utils/               # Shared cross-cutting utility functions
│   └── validations/         # Shared Zod validation schemas for requests and payloads
├── docker-compose.yml       # Canonical Docker Compose template for PostgreSQL 16
├── package.json             # Root monorepo configuration (npm workspaces)
├── turbo.json               # Turborepo build and test pipeline definition
└── .nvmrc                   # Pinned Node.js version (26.13.1)
```

---

## 3. Independent Local PostgreSQL Setup (Docker)

Every Fillcart developer must run an isolated local PostgreSQL 16 instance. Never attempt to connect to another developer's database or modify shared database state.

### Step 1: Canonical Setup (Standard Workflow)
The repository provides a production-grade PostgreSQL 16 service in the root `docker-compose.yml`:
- **Image:** `postgres:16-alpine`
- **Default Container Name:** `fillcart-postgres`
- **Default Port:** `127.0.0.1:5432:5432`
- **Default Database:** `fillcart`
- **Default User:** `fillcart_user`
- **Volume:** `fillcart_pgdata`

Start the database using the workspace root npm script:
```bash
npm run docker:db:up
```
*(Equivalent to `docker compose up -d postgres`)*

To check that the database container is healthy and listening:
```bash
docker compose ps
```

### Step 2: Custom Local Overrides (Alternative Port or Container Name)
If port `5432` is already in use on your host machine (e.g. by a local PostgreSQL service), do **not** edit `docker-compose.yml`. Instead, create a local `.env.local` file in the repository root:

```env
POSTGRES_PORT=5433
POSTGRES_CONTAINER_NAME=fillcart-postgres-custom
POSTGRES_VOLUME_NAME=fillcart_pgdata_custom
POSTGRES_USER=fillcart_user
POSTGRES_PASSWORD=your_strong_local_password
POSTGRES_DB=fillcart
```

Start Docker Compose passing your local environment file:
```bash
docker compose --env-file .env.local up -d postgres
```

> [!CAUTION]
> **Safe Stop vs. Destructive Data Wipe:**
> - **Safe Stop (Keeps Data Intact):**
>   ```bash
>   npm run docker:db:down
>   # or: docker compose down
>   ```
>   This stops and removes the container, but **preserves** your database volume and all test users.
> - **Destructive Reset (Deletes All Data):**
>   ```bash
>   npm run docker:db:clean
>   # or: docker compose down -v
>   ```
>   The `-v` flag permanently removes the Docker volume and all data. Use this **only** when you want a clean database slate.

---

## 4. Central Auth Backend Setup & Database Migrations

Central Auth (`apps/backend`) is the core security service that manages identities, credentials, sessions, refresh tokens, OTP challenges, and internal S2S authorization.

### Step 1: Install Dependencies
From the repository root:
```bash
npm install
```

### Step 2: Environment Configuration
Copy the template environment file:
```bash
# Windows PowerShell:
Copy-Item apps/backend/.env.example apps/backend/.env

# macOS / Linux:
cp apps/backend/.env.example apps/backend/.env
```

Fillcart's Central Auth backend enforces configuration validation through Zod (`apps/backend/src/config/env.schema.ts`). Below is the complete table of all environment variables:

| Variable Name | Required / Optional | Default Value | Description |
|---|---|---|---|
| `PORT` | Optional | `4000` | HTTP port for Central Auth server (1-65535) |
| `HOST` | Optional | `127.0.0.1` | Network interface binding |
| `NODE_ENV` | Optional | `development` | Environment mode (`development`, `test`, `production`) |
| `CORS_ORIGIN` | Optional | `http://localhost:3000,http://127.0.0.1:3000` | Explicit comma-separated CORS allowlist (wildcard `*` is strictly forbidden) |
| `LOG_LEVEL` | Optional | `info` | Logger verbosity (`fatal`, `error`, `warn`, `info`, `debug`, `trace`, `silent`) |
| `DATABASE_URL` | **Required** | `postgresql://fillcart_app_user:fillcart_app_pass@127.0.0.1:5432/fillcart?schema=public` | **Runtime role connection.** Uses `fillcart_app_user` with `SELECT`, `INSERT`, `UPDATE` and **zero `DELETE`** privileges |
| `MIGRATION_DATABASE_URL` | **Required for DDL** | `postgresql://fillcart_user:fillcart_pass@127.0.0.1:5432/fillcart?schema=public` | **Privileged schema-owner role.** Used exclusively for Prisma migrations and CLI maintenance |
| `JWT_ISSUER_URL` | Optional | `https://auth.fillcart.internal` | Token issuer URL asserted in JWT `iss` claim |
| `JWT_ACTIVE_KID` | Optional | `k-default-dev-1` | Key ID for active Ed25519 signing key |
| `JWT_ACTIVE_PRIVATE_KEY_PEM` | Optional in dev | *(auto-generated dev key)* | PKCS#8 PEM string of active Ed25519 private key |
| `JWT_ACTIVE_PUBLIC_KEY_PEM` | Optional in dev | *(auto-generated dev key)* | SPKI PEM string of active Ed25519 public key |
| `JWT_RETIRED_PUBLIC_KEYS` | Optional | `[]` | JSON array of retired public keys for verification grace period |
| `JWT_REVOKED_KIDS` | Optional | `""` | Comma-separated list of revoked key IDs |
| `CONFIG_VERSION` | Optional | `v1` | Key configuration version identifier |
| `REVOCATION_CONFIG_DIGEST` | Optional | `undefined` | SHA-256 digest of key revocation state |
| `OTP_HMAC_SECRET` | **Required** | `fillcart-dev-otp-hmac-secret-min16chars!` | HMAC-SHA256 secret for hashing OTP tokens (min 16 chars) |
| `MSG91_AUTH_KEY` | Optional in dev | `undefined` | MSG91 SMS gateway authentication key |
| `MSG91_TEMPLATE_ID` | Optional in dev | `undefined` | MSG91 DLT approved SMS template ID |
| `MSG91_BASE_URL` | Optional | `https://control.msg91.com` | Base URL for MSG91 REST API |

> [!IMPORTANT]
> **Database Role Separation Security Boundary:**
> 1. `fillcart_user` (`MIGRATION_DATABASE_URL`): Owns the database schema. Used by `prisma migrate` to run DDL and by the standalone `cleanup.ts` maintenance CLI to prune expired records.
> 2. `fillcart_app_user` (`DATABASE_URL`): Runtime least-privilege connection. It has `SELECT`, `INSERT`, and `UPDATE` permissions, but **zero `DELETE` permissions** on operational tables (`fillcart_app_user` cannot execute `DELETE`). The running Express server strictly connects as `fillcart_app_user` and **never** receives `MIGRATION_DATABASE_URL`.

### Step 3: Run Database Migrations
Apply the migrations using Prisma 7:
```bash
npx --prefix apps/backend prisma migrate deploy --config apps/backend/prisma7.config.ts
```

Check migration status:
```bash
npx --prefix apps/backend prisma migrate status --config apps/backend/prisma7.config.ts
```

Generate Prisma client:
```bash
npx --prefix apps/backend prisma generate --schema=apps/backend/prisma/schema.prisma
```

### Step 4: Maintenance Cleanup CLI Execution
Because the runtime application role cannot delete records, expired rate limits, replay records, and OTP challenges are pruned by a standalone maintenance script (`apps/backend/src/database/maintenance/cleanup.ts`).
- It is a standalone CLI script, **never** exposed over public HTTP routes.
- It requires `MIGRATION_DATABASE_URL` (connecting as `fillcart_app_user` will fail with SQL permission denied).
- It does not load dotenv automatically, so pass `--env-file`:

```bash
# Run standalone maintenance cleanup:
node --env-file=apps/backend/.env --import tsx apps/backend/src/database/maintenance/cleanup.ts
```

### Step 5: Start the Development Server
```bash
npm --workspace=@fillcart/backend run dev
```

Verify backend health:
```bash
curl http://127.0.0.1:4000/health/ready
```
Expected output: `{"status":"ready", ...}`

---

## 5. How Central Auth Works (Integration Guide)

Central Auth provides identity management, single-use refresh token rotation, and live session verification.

### Public and Internal Endpoints

| HTTP Method | Route | Description | Auth Requirement |
|---|---|---|---|
| `GET` | `/.well-known/jwks.json` | Active and retired Ed25519 public verification keys | Public |
| `GET` | `/health` | Liveness healthcheck | Public |
| `GET` | `/health/ready` | Readiness check (validates database pool connectivity) | Public |
| `POST` | `/api/v1/auth/register` | User registration (Customer, Vendor applicant, Rider applicant) | Public |
| `POST` | `/api/v1/auth/login` | Email & Argon2id password login | Public |
| `POST` | `/api/v1/auth/refresh` | Single-use refresh token rotation | Refresh Token Cookie or Body |
| `POST` | `/api/v1/auth/logout` | Session family revocation | Bearer Token / Cookie |
| `POST` | `/api/v1/auth/otp/send` | Dispatches SMS OTP (MSG91 gateway, 60s cooldown) | Public (Rate Limited) |
| `POST` | `/api/v1/auth/otp/verify` | Verifies OTP challenge and issues session | Public (Rate Limited) |
| `POST` | `/api/v1/internal/auth/verify-session` | S2S live session verification & fail-closed permission check | S2S Bearer Token (`auth:verify_session`) |

### Identity Identifiers Format
All primary keys in Central Auth (`User.id`, `Session.id`, `RefreshToken.id`, etc.) are canonical **36-character hyphenated UUID strings** (e.g. `123e4567-e89b-12d3-a456-426614174000`) stored in PostgreSQL `TEXT` columns. Central Auth does not use prefixed strings like `usr_...` or `ses_...`.

### Account Types, Promotion & Audience Mapping
In `schema.prisma`, `enum AccountType` has strictly four values: `CUSTOMER`, `VENDOR_APPLICANT`, `RIDER_APPLICANT`, `ADMIN`. There is **no** `VENDOR` or `RIDER` value in `AccountType`.

When an applicant is approved:
1. `User.accountType` remains `VENDOR_APPLICANT` or `RIDER_APPLICANT`.
2. `User.status` transitions from `PENDING_APPROVAL` to `ACTIVE`.
3. The operational `Role` (`'VENDOR'` or `'RIDER'`) is assigned via `roleId`.
4. All existing applicant sessions are revoked to enforce re-login.

Tokens issued by Central Auth include an audience (`aud`) claim derived from account state:

| `accountType` | `status` | Operational Role | Issued JWT Audience (`aud`) |
|---|---|---|---|
| `CUSTOMER` | `ACTIVE` | Customer | `customer-backend` |
| `VENDOR_APPLICANT` | `PENDING_APPROVAL` | Applicant | `vendor-onboarding` |
| `VENDOR_APPLICANT` | `ACTIVE` | Vendor | `vendor-backend` |
| `RIDER_APPLICANT` | `PENDING_APPROVAL` | Applicant | `rider-onboarding` |
| `RIDER_APPLICANT` | `ACTIVE` | Rider | `rider-backend` |
| `ADMIN` | `ACTIVE` | Admin | `admin-backend` |

### Service-to-Service (S2S) Fail-Closed Authorization
Business backends **must never query Central Auth database tables directly**. Instead, they verify requests using Central Auth's live S2S verification endpoint:

```
[ Client App ] ---> (Bearer User Access Token) ---> [ Business Backend ]
                                                            │
                                              POST /api/v1/internal/auth/verify-session
                                              Authorization: Bearer <S2S_SERVICE_TOKEN>
                                              { userAccessToken, requiredPermission }
                                                            │
                                                            ▼
                                                   [ Central Auth ]
```

1. **Preliminary Signature Check**: The business backend may verify the access token's Ed25519 signature locally using public keys fetched from `GET /.well-known/jwks.json`.
2. **Live S2S Session Verification**: The business backend makes a live HTTP call to `POST /api/v1/internal/auth/verify-session` passing its registered S2S service token and the user's access token.
3. **Fail-Closed Rule**: If Central Auth is unreachable, returns an error, or indicates the session has been revoked, the business backend must **immediately reject the request**. Never fall back to cached JWT permissions.

---

## 6. Application-Specific Setup (The 5 Applications)

### A. Vendor App (Flutter Foundation)
- **Status:** **Implemented Foundation / MVP Skeleton**
- **Location:** `apps/vendor-app/`
- **Framework:** Flutter `3.44.4` / Dart `3.12.2`
- **State Management:** `flutter_bloc: ^8.1.6`, `equatable: ^2.0.7`
- **Shared Package:** `packages/flutter_shared`

```bash
cd apps/vendor-app
flutter pub get
flutter analyze
flutter test
flutter run
```

### B. Customer App (Flutter Scaffold)
- **Status:** **Directory Scaffold Only (Not Runnable)**
- **Location:** `apps/customer-app/`
- **Current State:** Contains feature folder structure (`addresses`, `cart`, `checkout`, `orders`, `products`) with placeholder files. **No `pubspec.yaml` exists.**
- **Next Step:** Author `pubspec.yaml` declaring dependency on `packages/flutter_shared` following the pattern in `apps/vendor-app`.

### C. Rider App (Flutter Scaffold)
- **Status:** **Directory Scaffold Only (Not Runnable)**
- **Location:** `apps/rider-app/`
- **Current State:** Contains feature folder structure with placeholder files. **No `pubspec.yaml` exists.**
- **Next Step:** Author `pubspec.yaml` declaring dependency on `packages/flutter_shared`.

### D. Admin Dashboard (Next.js Scaffold)
- **Status:** **Directory Scaffold Only (Not Runnable)**
- **Location:** `apps/admin-dashboard/`
- **Current State:** Directory structure with `.gitkeep` files. Build script outputs `echo "[@fillcart/admin-dashboard] build pending Phase 2.2.6"`.
- **Next Step:** Configure Next.js, React 19, Tailwind CSS, and import `@fillcart/ui-web`.

### E. Customer Website (Next.js Scaffold)
- **Status:** **Directory Scaffold Only (Not Runnable)**
- **Location:** `apps/website/`
- **Current State:** Directory structure with `.gitkeep` files. Build script outputs `echo "[@fillcart/website] build pending Phase 2.2.6"`.
- **Next Step:** Configure Next.js storefront pages and connect to `@fillcart/ui-web`.

---

## 7. Building Your Business Backend & Database Ownership

Central Auth owns authentication and credential security. Business backends (`customer-backend`, `vendor-backend`, `rider-backend`, `admin-backend`) own their respective domain logic and data.

> [!CAUTION]
> **Strict Code Boundaries:**
> 1. **Do NOT build business backends inside `apps/backend/src/modules/`:** The folders under `apps/backend/src/modules/` are placeholders. Central Auth is solely an identity provider.
> 2. **Zero Direct Database Access:** Business services must **never** connect to Central Auth's database or read its tables.
> 3. **Database Ownership:** Business domains must own their own PostgreSQL databases (or schemas, subject to owner decision).

When implementing an approved business service, follow this modular domain layout:
```text
<business-service-root>/src/modules/<domain>/
├── controllers/       # HTTP request handlers
├── dto/               # Request/Response Data Transfer Objects
├── models/            # Domain models / Prisma schemas
├── repositories/      # Database access logic
├── routes/            # Express route registrations
├── services/          # Pure business logic
├── tests/             # Unit and integration tests
└── validators/        # Request payload validators (using @fillcart/validations)
```

---

## 8. Frontend Authentication Rules

### Mobile Applications (Flutter)
- Network communication must use `FCNetworkClient` from `packages/flutter_shared`. Pre-configured timeouts: connect: 10s, receive: 15s, send: 10s.
- Interceptors must include:
  - `FillcartAuthInterceptor`: Injects `Authorization: Bearer <token>` and handles token lifecycle.
  - `FCCorrelationInterceptor`: Injects unique `x-request-id` header for request tracing.
  - `FCSafeLoggingInterceptor`: Redacts tokens, passwords, and sensitive headers from client logs.
- **Token Delivery & Storage:** Mobile clients receive `refreshToken` directly in the JSON response body (`res.status(200/201).json({ userId, accessToken, refreshToken, expiresIn })`). Mobile applications must store `refreshToken` strictly in secure platform storage (`flutter_secure_storage`). Never persist tokens in plain `SharedPreferences` or plaintext storage.

### Web Applications (Next.js / Browser)
- **Token Delivery:** In addition to the response body, Central Auth sets the production-hardened `__Host-fillcart-rt` cookie on registration, login, and refresh responses.
- **Access Tokens:** Must be held strictly in memory. Never store access tokens in `localStorage` or `sessionStorage`.
- **Refresh Tokens:** Web applications rely on the secure HTTP-only cookie:
  - Name: `__Host-fillcart-rt`
  - Attributes: `Secure`, `HttpOnly`, `Path=/`, `SameSite=Lax` (no `Domain` attribute).
  - Expiry: 7-day rolling expiry (`maxAge: 7 * 24 * 60 * 60 * 1000`; cannot exceed 30-day absolute session ceiling).
- **Concurrency:** Multi-tab token refresh must be coordinated using `coordinateWebLockRefresh` from `@fillcart/ui-web` to prevent duplicate refresh token replay revocation.

---

## 9. Developer Responsibilities & Code Boundaries

| Team / Developer | Assigned Frontend | Assigned Backend | Database Ownership |
|---|---|---|---|
| **Central Auth Team** | None (Core Platform) | `apps/backend` | Central Auth PostgreSQL Database |
| **Vendor Team** | `apps/vendor-app` | `vendor-backend` (Future) | Vendor Domain Database |
| **Customer Team** | `apps/customer-app` | `customer-backend` (Future) | Customer Domain Database |
| **Rider Team** | `apps/rider-app` | `rider-backend` (Future) | Rider Domain Database |
| **Admin Team** | `apps/admin-dashboard` | `admin-backend` (Future) | Admin Domain Database |
| **Website Team** | `apps/website` | `customer-backend` (Future) | Storefront Domain Database |

### Allowed to Modify Without Prior Approval:
- Your assigned frontend application directory.
- Your own local Docker Compose environment and `.env.local`.
- Unit tests and integration tests for your own features.

### Requires Lead Architect / Project Owner Sign-Off:
- Any file in `apps/backend/` (Central Auth code, auth routes, crypto policies).
- Central Auth database schema or migrations (`apps/backend/prisma/`).
- Shared packages in `packages/*`.
- Root monorepo configuration (`package.json`, `turbo.json`, `docker-compose.yml`).

---

## 10. Useful Terminal Commands Cheat Sheet

| Category | Command | Purpose |
|---|---|---|
| **Setup** | `npm install` | Install all monorepo dependencies |
| **Docker** | `npm run docker:db:up` | Start local PostgreSQL 16 container (`docker compose up -d postgres`) |
| **Docker** | `npm run docker:db:down` | Stop local PostgreSQL container safely (data preserved) |
| **Docker** | `npm run docker:db:clean` | Stop and delete local PostgreSQL volume (destructive data wipe) |
| **Build** | `npm run build` | Build all workspace packages via Turborepo |
| **Lint** | `npm run lint:openapi` | Lint OpenAPI 3.1 specification via Redocly |
| **Backend** | `npm --workspace=@fillcart/backend run type-check` | Strict TypeScript typecheck of Central Auth |
| **Backend** | `npm --workspace=@fillcart/backend run test` | Run Central Auth test suite |
| **Backend** | `npm --workspace=@fillcart/backend run dev` | Start Central Auth backend in watch mode on port 4000 |
| **Prisma** | `npx --prefix apps/backend prisma migrate deploy --config apps/backend/prisma7.config.ts` | Apply migrations to local database |
| **Prisma** | `npx --prefix apps/backend prisma migrate status --config apps/backend/prisma7.config.ts` | Verify migration status |
| **Maintenance** | `node --env-file=apps/backend/.env --import tsx apps/backend/src/database/maintenance/cleanup.ts` | Run privileged maintenance cleanup CLI |
| **Flutter** | `node scripts/flutter-tooling.mjs format` | Format Dart code across all Flutter packages |
| **Flutter** | `node scripts/flutter-tooling.mjs analyze` | Analyze Dart code across all Flutter packages |
| **Flutter** | `node scripts/flutter-tooling.mjs test` | Run tests across all Flutter packages |

---

## 11. Troubleshooting & Common Pitfalls

### 1. Port 5432 Already in Use
- **Symptom:** `Error starting userland proxy: listen tcp4 127.0.0.1:5432: bind: address already in use`.
- **Solution:** Another PostgreSQL service is running locally. Set `POSTGRES_PORT=5433` in `.env.local` and run `docker compose --env-file .env.local up -d postgres`. Update `DATABASE_URL` and `MIGRATION_DATABASE_URL` in `apps/backend/.env` to use port `5433`.

### 2. Prisma Connection Error (`P1001: Can't reach database server`)
- **Symptom:** Backend crashes on startup with `Can't reach database server at 127.0.0.1:5432`.
- **Solution:** Verify Docker is running (`docker info`) and the container is active (`docker compose ps`). Ensure the port in your database URL matches the port mapped in Docker.

### 3. Workstation npm PATH Issue on Windows
- **Symptom:** Running `npm` fails with `Cannot find module '...npm-prefix.js'`.
- **Solution:** Invoke npm using the full executable path: `& "E:\Apps\Node\npm.cmd" <command>` or run tools directly via `./node_modules/.bin/<tool>`.

### 4. Running Cleanup Fails with SQL Permission Denied
- **Symptom:** `permission denied for table ServiceTokenReplay` when running `cleanup.ts`.
- **Solution:** `cleanup.ts` was run with `DATABASE_URL` (`fillcart_app_user`), which has no `DELETE` rights. Ensure `MIGRATION_DATABASE_URL` (`fillcart_user`) is configured in `apps/backend/.env` and passed via `--env-file`.

---

## 12. Verification & Health Checks

After completing setup, verify that your environment is fully operational:

1. **Check Database:** Run `docker compose ps` to ensure `fillcart-postgres` is `Up` and healthy.
2. **Check Backend:** Run `curl http://127.0.0.1:4000/health/ready`. It must return HTTP 200 with `status: "ready"`.
3. **Run Unit Tests:** Run `npm --workspace=@fillcart/backend run test:unit`. All 49 unit tests must pass.
4. **Run Vendor App Tests:** In `apps/vendor-app/`, run `flutter test`. All widget and BLoC tests must pass.

---

## 13. Open Architecture Decisions & Owner Sign-Offs

The following architectural and operational decisions remain open and require project-owner sign-off:

1. **Secondary SMS Gateway Fallback:** MSG91 is currently configured. A secondary SMS provider (e.g. AWS SNS or Twilio) needs approval for automated failover.
2. **Mobile Idle-Session Timeout:** The maximum session duration is 30 days. An explicit idle timeout for mobile apps before requiring biometric re-authentication is pending approval.
3. **S2S Client Registration Tooling:** S2S client keys are currently provisioned manually via database migration/seeds. An automated self-service registration CLI or portal requires approval.
4. **Production Maintenance Daemon:** The cleanup script (`cleanup.ts`) is currently a standalone CLI. A scheduled cron job or dedicated worker container for production pruning requires operational sign-off.
5. **Multi-Role Audience Selection:** Users holding both Vendor and Rider capabilities currently receive a deterministic single audience. Dynamic audience selection or token exchange requires approval.
6. **Standalone S2S Client SDK:** A reusable npm package (`@fillcart/s2s-client`) for business backends to verify sessions and cache JWKS keys requires architecture approval.
7. **Business Backend Service Topology:** Whether business services will be deployed as separate repositories/services or as a modular monorepo, and whether domain tables will use separate databases or separate schemas, remains pending owner decision.
8. **Mobile Background Refresh & Secure Storage:** Device-specific hardware-backed storage guarantees and background token refresh strategies require mobile platform sign-off.
