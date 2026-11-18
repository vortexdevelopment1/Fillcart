# @fillcart/backend — Fillcart Central Backend Foundation

This package provides the single central modular-monolith HTTP backend service for the Fillcart multi-vendor commerce platform.

---

## 1. Architecture Overview

- **Framework:** Express 5 (`^5.3.0`) with native asynchronous Promise error forwarding to `next(err)`.
- **Database & ORM:** PostgreSQL 16 managed via Prisma ORM 7 (`^7.10.1`), `@prisma/adapter-pg` driver adapter, and connection pooling.
- **Environment & Configuration:** Decoupled pure validation via Zod schemas, with anchored `.env` resolution independent of `process.cwd()`.
- **Logging:** High-performance structured JSON logging with Pino (`^10.4.0`) and `pino-http` (`^11.0.0`), with strict header, token, and credential redaction.
- **Request Correlation:** Strict UUID validation (RFC-4122 / RFC-9562 versions 1–8) attached to `req.id`, `x-request-id` response header, Pino child logger context, and `ErrorResponse.error.requestId`.
- **CORS Governance:** Strict parsing, validation, and normalization of HTTP/HTTPS origins. Pathnames, query strings, hashes, credentials, and wildcard (`*`) origins are rejected.
- **Security:** Helmet security middleware (`^8.0.0`) enforcing CSP, HSTS, frameguard, and nosniff.
- **Health Architecture:** Clear separation between **Process Liveness Probes** and **Database Readiness Probes**.
- **API Contracts:** Complete alignment with OpenAPI 3.1 specification (`packages/api-contracts/openapi/v1/openapi.yaml`).

---

## 2. Environment Configuration

All environment variables are declared in `apps/backend/.env` (and documented in `apps/backend/.env.example`):

| Variable | Type | Default | Description |
| :--- | :--- | :--- | :--- |
| `PORT` | number | `4000` | Local port for HTTP server binding (1–65535). |
| `HOST` | string | `127.0.0.1` | Loopback IP address for local development. |
| `NODE_ENV` | string | `development` | Environment mode: `development`, `test`, or `production`. |
| `CORS_ORIGIN` | string | `http://localhost:3000,http://127.0.0.1:3000` | Comma-separated list of allowed HTTP/HTTPS origins. |
| `LOG_LEVEL` | string | `info` | Minimum log level: `fatal`, `error`, `warn`, `info`, `debug`, `trace`, `silent`. |
| `DATABASE_URL` | string | `postgresql://...` | PostgreSQL connection string matching Docker Compose credentials. |

---

## 3. Local PostgreSQL Infrastructure (Docker Compose)

A standalone Docker Compose configuration is provided at the repository root (`docker-compose.yml`) for local PostgreSQL orchestration:

### 3.1 Starting the Database Container
```bash
# Start background PostgreSQL 16 container with healthcheck
npm run docker:db:up
```

### 3.2 Stopping the Container (Preserves Persistent Data)
```bash
# Stops and removes container; persistent volume (fillcart_pgdata) is KEPT
npm run docker:db:down
```

### 3.3 Inspecting Logs
```bash
npm run docker:db:logs
```

### 3.4 Destructive Volume Cleanup (Data Deletion)
```bash
# WARNING: Deletes container AND named volume (wipes local database data)
npm run docker:db:clean
```

---

## 4. Prisma 7 Database Workflows

Prisma schema and migrations belong exclusively to `apps/backend/prisma/`. Configuration is declared in `apps/backend/prisma7.config.ts`.

```bash
# Validate Prisma schema
npm run db:validate

# Generate Prisma Client to src/database/generated/client
npm run db:generate

# Execute baseline seed script
npm run db:seed
```

*Note: The first database migration will be generated when domain entities are established in Phase 3.*

---

## 5. API Endpoints

### 5.1 Liveness Probes (Process Alive)
- `GET /health`
- `GET /api/v1/health`

Returns HTTP 200 indicating the Node.js Express event loop is healthy:
```json
{
  "status": "healthy",
  "timestamp": "2026-11-17T12:00:00.000Z",
  "version": "0.1.0"
}
```

### 5.2 Readiness Probes (Database Connectivity)
- `GET /health/ready`
- `GET /api/v1/health/ready`

When PostgreSQL is connected and responsive:
```json
{
  "status": "ready",
  "database": "connected",
  "timestamp": "2026-11-17T12:00:00.000Z"
}
```

When PostgreSQL is unreachable (HTTP 503):
```json
{
  "status": "degraded",
  "database": "disconnected",
  "message": "Database service is temporarily unavailable",
  "timestamp": "2026-11-17T12:00:00.000Z"
}
```

---

## 6. Process Lifecycle & Graceful Shutdown

- **Resilient Startup:** If PostgreSQL is temporarily unreachable upon boot, the backend logs a warning and continues listening on HTTP so liveness checks, monitoring, and non-database routes remain active.
- **Graceful Shutdown (`SIGTERM`/`SIGINT`):**
  1. Stops receiving new HTTP requests (`server.close()`).
  2. Drains in-flight requests.
  3. Disconnects Prisma client and drains adapter connection pool via `prisma.$disconnect()`.
  4. Flushes Pino stream buffers.
  5. Terminates cleanly with code `0` (protected by a 10-second forced shutdown safeguard).
