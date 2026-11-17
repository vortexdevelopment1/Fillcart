# @fillcart/backend — Fillcart Central Backend Foundation

This package provides the single central modular-monolith HTTP backend service for the Fillcart multi-vendor commerce platform.

---

## 1. Architecture Overview

- **Framework:** Express 5 (`^5.0.1`) with native asynchronous Promise error forwarding to `next(err)`.
- **Environment & Configuration:** Decoupled pure validation via Zod schemas, with anchored `.env` resolution independent of `process.cwd()`.
- **Logging:** High-performance structured JSON logging with Pino (`^9.6.0`) and `pino-http` (`^10.4.0`), with strict header and credential redaction.
- **Request Correlation:** Strict UUID validation (RFC-4122 / RFC-9562 versions 1–8) attached to `req.id`, `x-request-id` response header, Pino child logger context, and `ErrorResponse.error.requestId`.
- **CORS Governance:** Strict parsing, validation, and normalization of HTTP/HTTPS origins. Pathnames, query strings, hashes, credentials, and wildcard (`*`) origins are rejected.
- **Security:** Helmet security middleware (`^8.0.0`) enforcing CSP, HSTS, frameguard, and nosniff.
- **Error Handling:** Standardized 3-tier error architecture distinguishing HTTP 400 client validation errors from HTTP 500 unexpected internal errors.
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

---

## 3. Available Scripts

Execute scripts via npm workspace or Turborepo:

- `npm run dev`: Starts backend development server with watch mode (`tsx watch src/server.ts`).
- `npm run build`: Compiles TypeScript source to `dist/` via `tsc -p tsconfig.json`.
- `npm run start`: Runs compiled production JavaScript via `node dist/server.js`.
- `npm run lint`: Runs ESLint on backend source and test suites.
- `npm run test`: Executes Vitest test suite (`vitest run`).
- `npm run type-check`: Performs TypeScript static type checking without emitting build artifacts.

---

## 4. API Endpoints

### 4.1 Liveness Probes
- `GET /health`: Root liveness check.
- `GET /api/v1/health`: Versioned API liveness check.

Both endpoints return:
```json
{
  "status": "healthy",
  "timestamp": "2026-11-17T10:30:00.000Z",
  "version": "0.1.0"
}
```

*Note: These probes verify application process liveness only. Database readiness probes are deferred to Phase 2.2.5.*

### 4.2 Error Response Format
All errors (client operational errors and internal failures) conform to the OpenAPI `ErrorResponse` schema:
```json
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Request validation failed",
    "requestId": "123e4567-e89b-12d3-a456-426614174000",
    "details": [
      {
        "field": "body.email",
        "message": "Invalid email format"
      }
    ]
  }
}
```

---

## 5. Process Lifecycle & Graceful Shutdown

- **OS Signals:** `SIGTERM` and `SIGINT` trigger clean shutdown:
  1. The server stops accepting new connections (`server.close()`).
  2. In-flight HTTP requests complete.
  3. Pino stream buffers and transports flush.
  4. Process terminates with exit code `0`.
- **Forced Timeout Safeguard:** An unreferenced 10-second timer forces process termination if connections fail to drain.
- **Fatal Error Handling:** Uncaught exceptions and unhandled promise rejections trigger synchronous fallback termination (500ms) alongside log flushing.
