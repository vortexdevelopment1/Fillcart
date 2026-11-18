-- DropForeignKey
ALTER TABLE "AuthAuditLog" DROP CONSTRAINT "AuthAuditLog_actorServiceClientId_fkey";

-- DropForeignKey
ALTER TABLE "AuthAuditLog" DROP CONSTRAINT "AuthAuditLog_actorUserId_fkey";

-- DropForeignKey
ALTER TABLE "AuthAuditLog" DROP CONSTRAINT "AuthAuditLog_targetUserId_fkey";

-- AddForeignKey
ALTER TABLE "AuthAuditLog" ADD CONSTRAINT "AuthAuditLog_actorUserId_fkey" FOREIGN KEY ("actorUserId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AuthAuditLog" ADD CONSTRAINT "AuthAuditLog_actorServiceClientId_fkey" FOREIGN KEY ("actorServiceClientId") REFERENCES "ServiceClient"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AuthAuditLog" ADD CONSTRAINT "AuthAuditLog_targetUserId_fkey" FOREIGN KEY ("targetUserId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- =============================================================
-- Additional Database Integrity Constraints
-- =============================================================

-- 1. Audit actor integrity CHECK constraint
ALTER TABLE "AuthAuditLog" ADD CONSTRAINT "audit_actor_integrity_chk" 
  CHECK (
    ("actorType" = 'USER' AND "actorUserId" IS NOT NULL AND "actorServiceClientId" IS NULL) OR
    ("actorType" = 'SERVICE_CLIENT' AND "actorServiceClientId" IS NOT NULL AND "actorUserId" IS NULL) OR
    ("actorType" = 'SYSTEM_CLI' AND "actorUserId" IS NULL AND "actorServiceClientId" IS NULL)
  );

-- 2. Refresh token rotation and date integrity CHECK constraints
ALTER TABLE "RefreshToken" ADD CONSTRAINT "refresh_token_rotation_chk"
  CHECK (
    ("rotatedAt" IS NULL AND "replacedByTokenHash" IS NULL) OR
    ("rotatedAt" IS NOT NULL)
  );

ALTER TABLE "RefreshToken" ADD CONSTRAINT "refresh_token_dates_chk"
  CHECK ("expiresAt" >= "createdAt");

-- 3. Session family date and revocation integrity CHECK constraints
ALTER TABLE "SessionFamily" ADD CONSTRAINT "session_family_dates_chk"
  CHECK ("expiresAt" >= "createdAt");

ALTER TABLE "SessionFamily" ADD CONSTRAINT "session_family_revocation_chk"
  CHECK (("isRevoked" = false) OR ("isRevoked" = true AND "revokedAt" IS NOT NULL));

-- 4. Service token replay date integrity CHECK constraint
ALTER TABLE "ServiceTokenReplay" ADD CONSTRAINT "service_token_replay_dates_chk"
  CHECK ("expiresAt" >= "consumedAt");

-- 5. Credential failed attempts non-negative CHECK constraint
ALTER TABLE "Credential" ADD CONSTRAINT "credential_failed_attempts_chk"
  CHECK ("failedAttempts" >= 0);

-- =============================================================
-- Least-Privilege Runtime Application Role Configuration
-- =============================================================

DO $$
BEGIN
  IF NOT EXISTS (SELECT FROM pg_catalog.pg_roles WHERE rolname = 'fillcart_app_user') THEN
    CREATE ROLE fillcart_app_user WITH LOGIN PASSWORD 'fillcart_app_pass';
  END IF;
END $$;

GRANT CONNECT ON DATABASE fillcart TO fillcart_app_user;
GRANT USAGE ON SCHEMA public TO fillcart_app_user;

-- Grant standard DML (SELECT, INSERT, UPDATE, DELETE) on operational tables
GRANT SELECT, INSERT, UPDATE, DELETE ON TABLE
  "User",
  "Credential",
  "Role",
  "Permission",
  "RolePermission",
  "PermissionProfile",
  "ProfilePermission",
  "AdminProfileAssignment",
  "StaffDirectPermission",
  "AdminInvitation",
  "SessionFamily",
  "RefreshToken",
  "ServiceClient",
  "ServicePublicKey",
  "ServiceTokenReplay",
  "AdminBootstrapMarker"
TO fillcart_app_user;

-- Grant strictly append/read-only (SELECT, INSERT) on AuthAuditLog
-- Explicitly exclude UPDATE, DELETE, and TRUNCATE
GRANT SELECT, INSERT ON TABLE "AuthAuditLog" TO fillcart_app_user;
REVOKE UPDATE, DELETE, TRUNCATE ON TABLE "AuthAuditLog" FROM fillcart_app_user;

-- Grant sequence usage
GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA public TO fillcart_app_user;
