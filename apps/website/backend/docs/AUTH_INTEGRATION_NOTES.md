# Fillcart Customer Website Backend — Central Auth Integration Specification & Verification Manual

> **Document Type:** Read-Only Engineering Investigation & Technical Architecture Report  
> **Target Scope:** Customer Web Backend (`apps/website/backend`) Integration with Central Auth (`apps/backend`)  
> **Investigator:** Antigravity Engineering AI Assistant  
> **Date:** November 28, 2026  
> **Status:** Final Read-Only Architectural Baseline  

---

## 10-Line Executive Summary

1. Central Auth (`apps/backend`) issues RFC 7519 JSON Web Tokens (JWT) signed with Edwards-curve Ed25519 asymmetric cryptography (`alg: "EdDSA"`).
2. The active public key is published at `GET /.well-known/jwks.json` on port 4000 as standard RFC 8037 JSON Web Key Set (`kty: "OKP"`, `crv: "Ed25519"`).
3. Access tokens have an expiration lifetime of exactly 15 minutes (`exp = iat + 900` seconds) and are completely stateless.
4. Token claims include 11 mandatory fields: `sub` (UUIDv4 user ID), `iss`, `aud`, `iat`, `nbf`, `exp`, `jti`, `token_use: "access"`, `session_id`, `account_type`, and `account_status`.
5. For customer web traffic, authoritative `aud` is strictly `"customer-backend"`, `account_type` is `"CUSTOMER"`, and `iss` defaults to `"https://auth.fillcart.internal"`.
6. Token verification in Central Auth uses Node.js standard built-in `node:crypto` (`crypto.verify`); external libraries like `jose` or `jsonwebtoken` are not used and not installed.
7. Central Auth provides a canonical S2S endpoint `POST /api/v1/internal/auth/verify-session`, but calling it requires a pre-registered asymmetric Ed25519 service assertion keypair in the Central Auth database.
8. Tier 1 local stateless JWKS verification is the recommended approach for `apps/website/backend`: fast (sub-millisecond), zero S2S network round-trip overhead, and zero DB dependencies.
9. Customer database tables should reference users using `user_id VARCHAR(36)` / `TEXT` without cross-schema foreign keys to preserve independent database scaling and isolation.
10. Local testing uses `POST /api/v1/auth/register` and `POST /api/v1/auth/login` on port 4000, returning `{ accessToken, expiresIn: 900 }` directly in the JSON response body.

---

## 1. Access Token Specification & Cryptography

### 1.1 Token Format & Algorithm
- **Token Format:** Compact RFC 7519 JSON Web Token (`<header>.<payload>.<signature>` in base64url).
  - *Source:* [apps/backend/src/modules/auth/services/crypto.service.ts#L98-L109](file:///c:/Users/kishu/OneDrive/Desktop/Fillcart/apps/backend/src/modules/auth/services/crypto.service.ts#L98-L109)
- **Signing Algorithm:** Asymmetric Edwards-curve Digital Signature Algorithm (`"EdDSA"` over Curve25519 / Ed25519).
  - Algorithm allowlist strictly checks `header.alg === "EdDSA"`; any token with `RS256`, `HS256`, `ES256`, or `none` is explicitly rejected with `INVALID_TOKEN`.
  - *Source:* [apps/backend/src/modules/auth/services/crypto.service.ts#L138-L140](file:///c:/Users/kishu/OneDrive/Desktop/Fillcart/apps/backend/src/modules/auth/services/crypto.service.ts#L138-L140)
- **Key Identifier (`kid`):**
  - Included in the JWT header (`header.kid`).
  - Active key ID defaults to `k-default-dev-1` via environment variable `JWT_ACTIVE_KID`.
  - Central Auth supports retired keys for verification and maintains a blacklist of revoked keys (`JWT_REVOKED_KIDS`).
  - *Source:* [apps/backend/src/config/env.schema.ts#L144](file:///c:/Users/kishu/OneDrive/Desktop/Fillcart/apps/backend/src/config/env.schema.ts#L144), [apps/backend/src/modules/auth/services/crypto.service.ts#L14-L26](file:///c:/Users/kishu/OneDrive/Desktop/Fillcart/apps/backend/src/modules/auth/services/crypto.service.ts#L14-L26)

### 1.2 JWKS Endpoint
- **URL Path:** `GET /.well-known/jwks.json`
- **Port / Host:** Port `4000` (e.g. `http://127.0.0.1:4000/.well-known/jwks.json`)
  - *Source:* [apps/backend/src/app.ts#L84](file:///c:/Users/kishu/OneDrive/Desktop/Fillcart/apps/backend/src/app.ts#L84), [packages/api-contracts/openapi/v1/openapi.yaml#L10-L24](file:///c:/Users/kishu/OneDrive/Desktop/Fillcart/packages/api-contracts/openapi/v1/openapi.yaml#L10-L24)
- **Response Format (RFC 8037):**
  ```json
  {
    "keys": [
      {
        "kty": "OKP",
        "crv": "Ed25519",
        "x": "<base64url-public-key-coordinate>",
        "kid": "k-default-dev-1",
        "use": "sig",
        "alg": "EdDSA"
      }
    ]
  }
  ```
  - *Source:* [apps/backend/src/modules/auth/services/crypto.service.ts#L61-L90](file:///c:/Users/kishu/OneDrive/Desktop/Fillcart/apps/backend/src/modules/auth/services/crypto.service.ts#L61-L90)

### 1.3 Token Expiry & Lifetime
- **Lifetime:** Exactly 15 minutes (900 seconds).
- **Calculation in Code:**
  ```ts
  const nowSec = Math.floor(Date.now() / 1000);
  const expSec = nowSec + 900; // 15 minutes
  ```
  - *Source:* [apps/backend/src/modules/auth/services/session.service.ts#L68-L69](file:///c:/Users/kishu/OneDrive/Desktop/Fillcart/apps/backend/src/modules/auth/services/session.service.ts#L68-L69)
- **Clock Skew Tolerance:** Central Auth allows $\pm 5$ seconds of clock skew when verifying `exp` and `nbf`.
  - *Source:* [apps/backend/src/modules/auth/services/crypto.service.ts#L176-L195](file:///c:/Users/kishu/OneDrive/Desktop/Fillcart/apps/backend/src/modules/auth/services/crypto.service.ts#L176-L195)

---

## 2. Complete Token Claims Inventory

Access tokens minted by `SessionService.mintUserAccessToken` contain the following 11 mandatory claims (and 2 optional role/permission claims):

| Claim Name | Type | Description | Example Value | Mandatory? | Source Reference |
| :--- | :--- | :--- | :--- | :---: | :--- |
| **`sub`** | `string` (UUIDv4) | Canonical Subject User Identifier | `"a465b26a-dd39-42d2-86d0-bad4c54a6ecf"` | **YES** | [session.service.ts#L74](file:///c:/Users/kishu/OneDrive/Desktop/Fillcart/apps/backend/src/modules/auth/services/session.service.ts#L74) |
| **`iss`** | `string` (URI) | Authoritative Token Issuer | `"https://auth.fillcart.internal"` | **YES** | [session.service.ts#L75](file:///c:/Users/kishu/OneDrive/Desktop/Fillcart/apps/backend/src/modules/auth/services/session.service.ts#L75) |
| **`aud`** | `string` | Target Authoritative Backend Audience | `"customer-backend"` | **YES** | [session.service.ts#L76](file:///c:/Users/kishu/OneDrive/Desktop/Fillcart/apps/backend/src/modules/auth/services/session.service.ts#L76) |
| **`iat`** | `number` (Epoch sec) | Issued At Timestamp | `1732789200` | **YES** | [session.service.ts#L77](file:///c:/Users/kishu/OneDrive/Desktop/Fillcart/apps/backend/src/modules/auth/services/session.service.ts#L77) |
| **`nbf`** | `number` (Epoch sec) | Not Before Timestamp | `1732789200` | **YES** | [session.service.ts#L78](file:///c:/Users/kishu/OneDrive/Desktop/Fillcart/apps/backend/src/modules/auth/services/session.service.ts#L78) |
| **`exp`** | `number` (Epoch sec) | Expiration Timestamp (`iat + 900`) | `1732790100` | **YES** | [session.service.ts#L79](file:///c:/Users/kishu/OneDrive/Desktop/Fillcart/apps/backend/src/modules/auth/services/session.service.ts#L79) |
| **`jti`** | `string` (UUIDv4) | Unique Token Identifier for anti-replay | `"7e9f3b14-c182-4412-9c98-df6c10b2a8d1"` | **YES** | [session.service.ts#L80](file:///c:/Users/kishu/OneDrive/Desktop/Fillcart/apps/backend/src/modules/auth/services/session.service.ts#L80) |
| **`token_use`** | `string` | Purpose indicator; strictly `"access"` | `"access"` | **YES** | [session.service.ts#L81](file:///c:/Users/kishu/OneDrive/Desktop/Fillcart/apps/backend/src/modules/auth/services/session.service.ts#L81) |
| **`session_id`**| `string` (UUIDv4) | Foreign key to `SessionFamily.id` | `"3c85f190-b193-4a11-89ab-76d12e0981aa"` | **YES** | [session.service.ts#L82](file:///c:/Users/kishu/OneDrive/Desktop/Fillcart/apps/backend/src/modules/auth/services/session.service.ts#L82) |
| **`account_type`**| `string` | Type of account (`CUSTOMER`, `VENDOR_APPLICANT`, `RIDER_APPLICANT`, `ADMIN`) | `"CUSTOMER"` | **YES** | [session.service.ts#L83](file:///c:/Users/kishu/OneDrive/Desktop/Fillcart/apps/backend/src/modules/auth/services/session.service.ts#L83) |
| **`account_status`**| `string` | User account lifecycle state (`ACTIVE`, `SUSPENDED`, `DEACTIVATED`, `PENDING_APPROVAL`) | `"ACTIVE"` | **YES** | [session.service.ts#L84](file:///c:/Users/kishu/OneDrive/Desktop/Fillcart/apps/backend/src/modules/auth/services/session.service.ts#L84) |
| **`role`** | `string` | Assigned RBAC Role Name | `"CUSTOMER"` | *Optional* | [session.service.ts#L85](file:///c:/Users/kishu/OneDrive/Desktop/Fillcart/apps/backend/src/modules/auth/services/session.service.ts#L85) |
| **`permissions`** | `string[]` | Specific resolved permissions | `["view:products", "create:orders"]` | *Optional* | [session.service.ts#L86](file:///c:/Users/kishu/OneDrive/Desktop/Fillcart/apps/backend/src/modules/auth/services/session.service.ts#L86) |

> [!NOTE]
> `email` and `fullName` are **NOT** stored inside the JWT access token payload. To avoid PII bloat and keep tokens lightweight, Central Auth stores identity in the database and only places the immutable `sub` (user UUID) in the token.

---

## 3. Issuer & Audience Origins and Development Values

### 3.1 Issuer (`iss`)
- **Environment Variable Name:** `JWT_ISSUER_URL` in `apps/backend`
- **Default Value in Code:** `"https://auth.fillcart.internal"`
- **Local Development Value:** Defaults to `"https://auth.fillcart.internal"`.
- *Source:* [apps/backend/src/config/env.schema.ts#L139-L142](file:///c:/Users/kishu/OneDrive/Desktop/Fillcart/apps/backend/src/config/env.schema.ts#L139-L142)

### 3.2 Audience (`aud`)
- Audience is **dynamically derived on the server** during token creation based on `accountType` and `status` via `SessionService.deriveAudience`:
  ```ts
  if (status === "ACTIVE") {
    switch (accountType) {
      case "CUSTOMER":
        return "customer-backend";
      case "VENDOR_APPLICANT":
        return "vendor-backend";
      case "RIDER_APPLICANT":
        return "rider-backend";
      case "ADMIN":
        return "admin-backend";
    }
  }
  ```
  - *Source:* [apps/backend/src/modules/auth/services/session.service.ts#L28-L55](file:///c:/Users/kishu/OneDrive/Desktop/Fillcart/apps/backend/src/modules/auth/services/session.service.ts#L28-L55)
- **For Customer Website Backend:**
  - Authoritative expected audience: Strictly `"customer-backend"`.
  - Any token with audience `vendor-backend`, `rider-backend`, or `admin-backend` submitted to `apps/website/backend` MUST be rejected with HTTP 403 Forbidden (`AUDIENCE_MISMATCH`).

---

## 4. Existing Verification Code & Library Audit

### 4.1 Verification Code in `apps/backend`
`apps/backend` has token verification methods implemented in:
1. `CryptoService.verifyJwt` ([crypto.service.ts#L112-L215](file:///c:/Users/kishu/OneDrive/Desktop/Fillcart/apps/backend/src/modules/auth/services/crypto.service.ts#L112-L215))
2. `LiveVerificationClient.verifySession` ([live-verification-client.ts#L27-L125](file:///c:/Users/kishu/OneDrive/Desktop/Fillcart/apps/backend/src/modules/auth/services/live-verification-client.ts#L27-L125))

Code snippet of signature verification in `CryptoService`:
```ts
// apps/backend/src/modules/auth/services/crypto.service.ts (lines 166-172)
const signingInput = Buffer.from(`${headerB64}.${payloadB64}`);
const signature = Buffer.from(signatureB64, "base64url");
const isValid = crypto.verify(null, signingInput, verificationKey, signature);

if (!isValid) {
  throw new UnauthorizedError("Invalid token signature", ERROR_CODES.INVALID_TOKEN);
}
```

### 4.2 Library Check (`jose` / `jsonwebtoken`)
- **Library Used:** Standard Node.js built-in module `node:crypto`.
- **Is `jose` installed in root `node_modules` or `package.json`?** **NO** (`Test-Path node_modules/jose` -> `False`).
- **Is `jsonwebtoken` installed in root `node_modules` or `package.json`?** **NO** (`Test-Path node_modules/jsonwebtoken` -> `False`).
- *Source:* [package.json#L38-L47](file:///c:/Users/kishu/OneDrive/Desktop/Fillcart/package.json#L38-L47), [apps/backend/package.json#L17-L30](file:///c:/Users/kishu/OneDrive/Desktop/Fillcart/apps/backend/package.json#L17-L30)

> [!TIP]
> Node.js 18+ natively supports Ed25519 asymmetric cryptography and base64url encoding in standard `node:crypto`. `apps/website/backend` does NOT need any external JWT library dependency to verify Central Auth tokens.

---

## 5. Service-to-Service (S2S) `verify-session` Endpoint Audit

### 5.1 Endpoint Specification
- **Method & Path:** `POST /api/v1/internal/auth/verify-session`
- **Request Headers:**
  - `Content-Type: application/json`
  - `Authorization: Bearer <S2S_JWT>`
- **Request Body Contract:**
  ```json
  {
    "userAccessToken": "eyJhbGciOiJFZERTQSI...",
    "requiredPermission": "orders:create" // optional
  }
  ```
  - *Source:* [packages/api-contracts/openapi/v1/openapi.yaml#L169-L200](file:///c:/Users/kishu/OneDrive/Desktop/Fillcart/packages/api-contracts/openapi/v1/openapi.yaml#L169-L200)

- **Response Contract (HTTP 200):**
  ```json
  {
    "valid": true,
    "authorized": true,
    "userId": "123e4567-e89b-12d3-a456-426614174000",
    "sessionId": "456e7890-e89b-12d3-a456-426614174000",
    "accountType": "CUSTOMER",
    "status": "ACTIVE",
    "role": "CUSTOMER",
    "permissions": ["view:products", "create:orders"]
  }
  ```
  - *Source:* [packages/shared-types/src/auth/index.ts#L70-L80](file:///c:/Users/kishu/OneDrive/Desktop/Fillcart/packages/shared-types/src/auth/index.ts#L70-L80)

### 5.2 S2S Authorization Requirements
To call `verify-session`, Central Auth strictly enforces:
1. S2S caller must send an Ed25519 JWT signed with a registered private key.
2. The caller's `serviceIdentifier` (e.g. `"customer-backend"`) must exist in Central Auth's `ServiceClient` table with `status: "ACTIVE"`.
3. The key ID (`kid`) must match a non-revoked public key in `ServicePublicKey` table.
4. The service must have scope `"auth:verify_session"`.
5. The `aud` of the S2S token must be `"central-auth"` and lifetime cannot exceed 60 seconds.
6. The `jti` is checked in `ServiceTokenReplay` table to block replay attacks.
- *Source:* [apps/backend/src/modules/auth/services/s2s.service.ts#L11-L100](file:///c:/Users/kishu/OneDrive/Desktop/Fillcart/apps/backend/src/modules/auth/services/s2s.service.ts#L11-L100)

### 5.3 Comparison: Local JWKS Verification (Tier 1) vs Synchronous S2S (Tier 2)

| Dimension | Option A: Tier 1 Stateless JWKS Verification | Option B: Tier 2 Live S2S Verification (`verify-session`) |
| :--- | :--- | :--- |
| **Network Latency** | **Near Zero (<0.5 ms)**; Keys cached locally in memory. | **High (20–60 ms)**; Adds an internal HTTP hop on every customer request. |
| **Dependencies & Setup** | **Zero DB setup**; Only needs public endpoint `GET /.well-known/jwks.json`. | **Heavy setup**; Requires pre-registering `ServiceClient`, public key PEM in Central Auth DB, and storing an S2S private key in customer backend. |
| **High Concurrency Scale** | **Extreme**; Backend can handle tens of thousands of req/sec without burdening Central Auth. | **Limited**; Every customer request hits Central Auth DB (`sessionFamily.findUnique`). |
| **Logout / Revocation Handling** | Token remains valid until 15-min expiration (`exp`). If immediate revocation is required, needs Redis blacklist. | Immediately rejects request if session was revoked (`session.isRevoked === true`). |
| **Recommendation for Customer Backend** | **Recommended for all customer browsing, cart, and profile endpoints.** | **Optional for sensitive financial checkout only** (once S2S keys are provisioned). |

---

## 6. Database & Identity Mapping Architecture

### 6.1 Central Auth User Model
Defined in `apps/backend/prisma/schema.prisma` (lines 53–78):
- `id`: `String @id @default(uuid())` — RFC 4122 UUIDv4 string.
- `emailNormalized`: `String @unique`
- `fullName`: `String`
- `phone`: `String?`
- `accountType`: `AccountType` Enum (`CUSTOMER`, `VENDOR_APPLICANT`, `RIDER_APPLICANT`, `ADMIN`) — Default: `CUSTOMER`.
- `status`: `UserStatus` Enum (`ACTIVE`, `SUSPENDED`, `DEACTIVATED`, `PENDING_APPROVAL`) — Default: `ACTIVE`.

### 6.2 Customer-Side Tables User Reference Strategy
In `apps/website/backend/prisma/schema.prisma`:
- Schema is isolated under PostgreSQL schema `customer` (`@@schema("customer")`).
- User reference in customer tables (e.g. `cart`, `wishlist_items`, `addresses`, `orders`, `prescriptions`) should be defined as:
  ```prisma
  userId    String   @map("user_id") // UUID string matching Central Auth User.id
  @@index([userId])
  ```
- **Why NO cross-schema foreign key?**
  1. **Microservice / Modular Monolith Isolation:** `central-auth-integration.md` Section 1 mandates that business backends must never connect directly or bind foreign keys to Central Auth tables.
  2. **Zero Migration Lock:** If Central Auth database is upgraded, migrated, or extracted into an independent microservice container/RDS instance, customer migrations will not break.
  3. **Cryptographic Trust:** The `userId` is securely extracted from the cryptographically validated `sub` claim of the access token, guaranteeing identity integrity without DB joins.

---

## 7. Local Testing & Execution Guide

### 7.1 Starting Central Auth Service
Run Central Auth backend from root workspace:
```bash
# Start Central Auth on port 4000
npm --workspace=@fillcart/backend run dev
```
Health probe check:
```bash
curl -X GET http://127.0.0.1:4000/health
curl -X GET http://127.0.0.1:4000/.well-known/jwks.json
```

### 7.2 Customer Registration Request
- **Endpoint:** `POST http://127.0.0.1:4000/api/v1/auth/register`
- **Headers:** `Content-Type: application/json`
- **Request Body (cURL):**
  ```bash
  curl -X POST http://127.0.0.1:4000/api/v1/auth/register \
    -H "Content-Type: application/json" \
    -d '{
      "email": "customer@example.com",
      "password": "SecurePassword123!",
      "fullName": "Aarav Sharma",
      "phone": "+919876543210",
      "accountType": "CUSTOMER"
    }'
  ```
- **Request Body (PowerShell):**
  ```powershell
  $body = @{
    email = "customer@example.com"
    password = "SecurePassword123!"
    fullName = "Aarav Sharma"
    phone = "+919876543210"
    accountType = "CUSTOMER"
  } | ConvertTo-Json

  $response = Invoke-RestMethod -Uri "http://127.0.0.1:4000/api/v1/auth/register" -Method Post -Body $body -ContentType "application/json"
  $response.accessToken
  ```

### 7.3 Customer Login Request
- **Endpoint:** `POST http://127.0.0.1:4000/api/v1/auth/login`
- **Headers:** `Content-Type: application/json`
- **Request Body (cURL):**
  ```bash
  curl -X POST http://127.0.0.1:4000/api/v1/auth/login \
    -H "Content-Type: application/json" \
    -d '{
      "email": "customer@example.com",
      "password": "SecurePassword123!"
    }'
  ```

### 7.4 Response Tokens & Lifetime
- **Where is the access token?** In the JSON response body under `response.accessToken`.
- **Response Shape (HTTP 200/201):**
  ```json
  {
    "userId": "a465b26a-dd39-42d2-86d0-bad4c54a6ecf",
    "accessToken": "eyJhbGciOiJFZERTQSI...",
    "refreshToken": "4a71b...64charhex",
    "expiresIn": 900
  }
  ```
- **Token Validity:** Exactly 900 seconds (15 minutes).
- **Refresh Cookie Note:** Central Auth also sets a secure `__Host-fillcart-rt` cookie in the `Set-Cookie` header for browser session refreshes, which the customer backend does not need and can ignore.

---

## 8. Proposed `requireAuth` Middleware Design for `apps/website/backend`

### 8.1 Step-by-Step Middleware Execution Flow

```
[Incoming Request]
       │
       ▼
1. Extract Header: Authorization: Bearer <token>
       │  (If missing or no 'Bearer ' prefix -> 401 UNAUTHENTICATED)
       ▼
2. Parse JWT Header: Base64URL decode parts[0]
       │  (Assert alg === "EdDSA" and kid exists -> else 401 UNAUTHENTICATED)
       ▼
3. Resolve Public Key from Cached JWKS:
       │  (Look up kid in local in-memory cache)
       │  (If cache miss or expired, fetch GET ${CENTRAL_AUTH_URL}/.well-known/jwks.json once)
       │  (If kid still not found -> 401 UNAUTHENTICATED / UNKNOWN_KEY)
       ▼
4. Verify Cryptographic Signature:
       │  node:crypto.verify(null, signingInput, publicKey, signature)
       │  (If invalid -> 401 UNAUTHENTICATED / INVALID_SIGNATURE)
       ▼
5. Validate Timing Claims (±5s clock skew):
       │  (If now > exp + 5s -> 401 TOKEN_EXPIRED)
       │  (If now < nbf - 5s -> 401 UNAUTHENTICATED)
       ▼
6. Validate Authoritative Claims:
       │  (If claims.iss !== CENTRAL_AUTH_ISSUER -> 401 UNAUTHENTICATED)
       │  (If claims.aud !== CENTRAL_AUTH_AUDIENCE -> 403 FORBIDDEN / AUDIENCE_MISMATCH)
       │  (If claims.token_use !== "access" -> 401 UNAUTHENTICATED)
       │  (If claims.account_type !== "CUSTOMER" -> 403 FORBIDDEN / FORBIDDEN_ACCOUNT_TYPE)
       │  (If claims.account_status !== "ACTIVE" -> 403 FORBIDDEN / ACCOUNT_SUSPENDED)
       ▼
7. Populate User Context & Proceed:
       │  req.user = {
       │    id: claims.sub,
       │    sessionId: claims.session_id,
       │    accountType: claims.account_type,
       │    accountStatus: claims.account_status,
       │    role: claims.role || "CUSTOMER",
       │    permissions: claims.permissions || []
       │  }
       ▼
    next()
```

### 8.2 Standardized Error Responses
- **401 Unauthorized (`UNAUTHENTICATED` / `TOKEN_EXPIRED`):**
  ```json
  {
    "success": false,
    "error": {
      "code": "UNAUTHENTICATED",
      "message": "Authorization token is missing, invalid, or expired"
    }
  }
  ```
- **403 Forbidden (`FORBIDDEN` / `AUDIENCE_MISMATCH`):**
  ```json
  {
    "success": false,
    "error": {
      "code": "FORBIDDEN",
      "message": "Access denied: Account type or audience is not authorized for this resource"
    }
  }
  ```

### 8.3 Required Environment Variables for `apps/website/backend`
The following environment variable names should be added to `apps/website/backend/src/config/env.js`:
- `CENTRAL_AUTH_URL` — e.g. `http://127.0.0.1:4000` (URL of Central Auth service for JWKS retrieval)
- `CENTRAL_AUTH_ISSUER` — e.g. `https://auth.fillcart.internal` (Expected JWT `iss` claim)
- `CENTRAL_AUTH_AUDIENCE` — e.g. `customer-backend` (Authoritative expected `aud` claim for customer endpoints)
- `JWKS_CACHE_TTL_MS` — (Optional, default: `3600000` / 1 hour) In-memory cache duration for public keys.

---

## 9. Questions for Engineering Manager & Leadership

The following questions could not be answered purely from the existing codebase and require architectural sign-off:

1. **User Profile Data (Name & Email in Token vs Separate Fetch):**
   Central Auth access tokens contain `sub` (UUID) but **not** `email` or `fullName`. When the customer frontend loads the Profile page (`/profile/account`), should `customer-backend` store customer profile details locally in `customer.users_profile` table, or should `apps/backend` add non-sensitive identity claims (`email`, `fullName`) to the access token, or expose a `/api/v1/auth/me` endpoint?
2. **Tier 1 (Stateless JWKS) vs Tier 2 (Live S2S) for Orders:**
   Is stateless Tier 1 verification sufficient for all customer operations including `POST /orders`, or does management require live synchronous verification (`verify-session`) specifically at checkout to guard against instantly banned users?
3. **S2S Key Provisioning Workflow:**
   If Tier 2 is required for checkout, how should S2S Ed25519 keypairs be provisioned in development and production? Will there be an automated script to register `customer-backend` in `ServiceClient` table?
4. **Session Invalidation on Immediate Logout:**
   When a user clicks "Logout", Central Auth revokes the `SessionFamily` record in PostgreSQL. Under Tier 1 stateless verification, an existing access token remains cryptographically valid until its 15-minute expiry. Is a 15-minute window acceptable for customer web sessions, or should `customer-backend` connect to a shared Redis cluster for immediate token revocation?

---
*Report generated and validated by Antigravity Read-Only Investigation Service.*
