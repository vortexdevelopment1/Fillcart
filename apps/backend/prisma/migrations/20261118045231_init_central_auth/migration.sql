-- CreateEnum
CREATE TYPE "AccountType" AS ENUM ('CUSTOMER', 'VENDOR_APPLICANT', 'RIDER_APPLICANT', 'ADMIN');

-- CreateEnum
CREATE TYPE "UserStatus" AS ENUM ('ACTIVE', 'SUSPENDED', 'DEACTIVATED', 'PENDING_APPROVAL');

-- CreateEnum
CREATE TYPE "CredentialType" AS ENUM ('PASSWORD');

-- CreateEnum
CREATE TYPE "PermissionEffect" AS ENUM ('ALLOW', 'DENY');

-- CreateEnum
CREATE TYPE "ServiceClientStatus" AS ENUM ('ACTIVE', 'SUSPENDED', 'REVOKED');

-- CreateEnum
CREATE TYPE "AuditActorType" AS ENUM ('USER', 'SERVICE_CLIENT', 'SYSTEM_CLI');

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "emailNormalized" TEXT NOT NULL,
    "displayEmail" TEXT,
    "fullName" TEXT NOT NULL,
    "phone" TEXT,
    "accountType" "AccountType" NOT NULL DEFAULT 'CUSTOMER',
    "status" "UserStatus" NOT NULL DEFAULT 'ACTIVE',
    "roleId" TEXT,
    "suspensionReason" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Credential" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "type" "CredentialType" NOT NULL DEFAULT 'PASSWORD',
    "secretHash" TEXT NOT NULL,
    "failedAttempts" INTEGER NOT NULL DEFAULT 0,
    "lockedUntil" TIMESTAMP(3),
    "lastRotatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Credential_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Role" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "isSystem" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Role_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Permission" (
    "id" TEXT NOT NULL,
    "action" TEXT NOT NULL,
    "resource" TEXT NOT NULL,
    "description" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Permission_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RolePermission" (
    "roleId" TEXT NOT NULL,
    "permissionId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "RolePermission_pkey" PRIMARY KEY ("roleId","permissionId")
);

-- CreateTable
CREATE TABLE "PermissionProfile" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "isSystem" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PermissionProfile_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ProfilePermission" (
    "profileId" TEXT NOT NULL,
    "permissionId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ProfilePermission_pkey" PRIMARY KEY ("profileId","permissionId")
);

-- CreateTable
CREATE TABLE "AdminProfileAssignment" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "profileId" TEXT NOT NULL,
    "assignedBy" TEXT NOT NULL,
    "assignedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "revokedAt" TIMESTAMP(3),
    "revokedBy" TEXT,
    "revocationReason" TEXT,

    CONSTRAINT "AdminProfileAssignment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "StaffDirectPermission" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "permissionId" TEXT NOT NULL,
    "effect" "PermissionEffect" NOT NULL DEFAULT 'ALLOW',
    "grantedBy" TEXT NOT NULL,
    "reason" TEXT,
    "revokedAt" TIMESTAMP(3),
    "revokedBy" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "StaffDirectPermission_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AdminInvitation" (
    "id" TEXT NOT NULL,
    "emailNormalized" TEXT NOT NULL,
    "roleId" TEXT NOT NULL,
    "profileId" TEXT,
    "tokenHash" TEXT NOT NULL,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "isRevoked" BOOLEAN NOT NULL DEFAULT false,
    "acceptedAt" TIMESTAMP(3),
    "invitedById" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "AdminInvitation_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SessionFamily" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "ipAddress" TEXT,
    "userAgent" TEXT,
    "isRevoked" BOOLEAN NOT NULL DEFAULT false,
    "revokedAt" TIMESTAMP(3),
    "revocationReason" TEXT,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "SessionFamily_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RefreshToken" (
    "id" TEXT NOT NULL,
    "sessionId" TEXT NOT NULL,
    "tokenHash" TEXT NOT NULL,
    "replacedByTokenHash" TEXT,
    "isRevoked" BOOLEAN NOT NULL DEFAULT false,
    "rotatedAt" TIMESTAMP(3),
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "RefreshToken_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ServiceClient" (
    "id" TEXT NOT NULL,
    "serviceIdentifier" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "status" "ServiceClientStatus" NOT NULL DEFAULT 'ACTIVE',
    "allowedScopes" TEXT[],
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ServiceClient_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ServicePublicKey" (
    "id" TEXT NOT NULL,
    "serviceClientId" TEXT NOT NULL,
    "keyId" TEXT NOT NULL,
    "publicKeyPem" TEXT NOT NULL,
    "algorithm" TEXT NOT NULL DEFAULT 'Ed25519',
    "isRevoked" BOOLEAN NOT NULL DEFAULT false,
    "revokedAt" TIMESTAMP(3),
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ServicePublicKey_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ServiceTokenReplay" (
    "id" TEXT NOT NULL,
    "serviceClientId" TEXT NOT NULL,
    "jti" TEXT NOT NULL,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "consumedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ServiceTokenReplay_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AdminBootstrapMarker" (
    "id" TEXT NOT NULL DEFAULT 'root_admin_bootstrap_marker',
    "bootstrappedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "adminUserId" TEXT NOT NULL,
    "ipAddress" TEXT,

    CONSTRAINT "AdminBootstrapMarker_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AuthAuditLog" (
    "id" TEXT NOT NULL,
    "actorType" "AuditActorType" NOT NULL,
    "actorId" TEXT NOT NULL,
    "actorUserId" TEXT,
    "actorServiceClientId" TEXT,
    "targetType" TEXT NOT NULL,
    "targetId" TEXT NOT NULL,
    "targetUserId" TEXT,
    "action" TEXT NOT NULL,
    "requestId" TEXT,
    "ipAddress" TEXT,
    "userAgent" TEXT,
    "metadata" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "AuthAuditLog_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_emailNormalized_key" ON "User"("emailNormalized");

-- CreateIndex
CREATE INDEX "User_roleId_idx" ON "User"("roleId");

-- CreateIndex
CREATE INDEX "User_status_idx" ON "User"("status");

-- CreateIndex
CREATE INDEX "User_accountType_idx" ON "User"("accountType");

-- CreateIndex
CREATE INDEX "Credential_userId_idx" ON "Credential"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "Credential_userId_type_key" ON "Credential"("userId", "type");

-- CreateIndex
CREATE UNIQUE INDEX "Role_name_key" ON "Role"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Permission_action_resource_key" ON "Permission"("action", "resource");

-- CreateIndex
CREATE INDEX "RolePermission_permissionId_idx" ON "RolePermission"("permissionId");

-- CreateIndex
CREATE UNIQUE INDEX "PermissionProfile_name_key" ON "PermissionProfile"("name");

-- CreateIndex
CREATE INDEX "ProfilePermission_permissionId_idx" ON "ProfilePermission"("permissionId");

-- CreateIndex
CREATE INDEX "AdminProfileAssignment_userId_idx" ON "AdminProfileAssignment"("userId");

-- CreateIndex
CREATE INDEX "AdminProfileAssignment_profileId_idx" ON "AdminProfileAssignment"("profileId");

-- CreateIndex
CREATE INDEX "StaffDirectPermission_userId_idx" ON "StaffDirectPermission"("userId");

-- CreateIndex
CREATE INDEX "StaffDirectPermission_permissionId_idx" ON "StaffDirectPermission"("permissionId");

-- CreateIndex
CREATE UNIQUE INDEX "AdminInvitation_tokenHash_key" ON "AdminInvitation"("tokenHash");

-- CreateIndex
CREATE INDEX "AdminInvitation_emailNormalized_idx" ON "AdminInvitation"("emailNormalized");

-- CreateIndex
CREATE INDEX "SessionFamily_userId_isRevoked_idx" ON "SessionFamily"("userId", "isRevoked");

-- CreateIndex
CREATE INDEX "SessionFamily_expiresAt_idx" ON "SessionFamily"("expiresAt");

-- CreateIndex
CREATE UNIQUE INDEX "RefreshToken_tokenHash_key" ON "RefreshToken"("tokenHash");

-- CreateIndex
CREATE INDEX "RefreshToken_sessionId_isRevoked_idx" ON "RefreshToken"("sessionId", "isRevoked");

-- CreateIndex
CREATE UNIQUE INDEX "ServiceClient_serviceIdentifier_key" ON "ServiceClient"("serviceIdentifier");

-- CreateIndex
CREATE UNIQUE INDEX "ServicePublicKey_keyId_key" ON "ServicePublicKey"("keyId");

-- CreateIndex
CREATE INDEX "ServicePublicKey_serviceClientId_isRevoked_idx" ON "ServicePublicKey"("serviceClientId", "isRevoked");

-- CreateIndex
CREATE INDEX "ServiceTokenReplay_expiresAt_idx" ON "ServiceTokenReplay"("expiresAt");

-- CreateIndex
CREATE UNIQUE INDEX "ServiceTokenReplay_serviceClientId_jti_key" ON "ServiceTokenReplay"("serviceClientId", "jti");

-- CreateIndex
CREATE UNIQUE INDEX "AdminBootstrapMarker_adminUserId_key" ON "AdminBootstrapMarker"("adminUserId");

-- CreateIndex
CREATE INDEX "AuthAuditLog_actorId_idx" ON "AuthAuditLog"("actorId");

-- CreateIndex
CREATE INDEX "AuthAuditLog_targetUserId_idx" ON "AuthAuditLog"("targetUserId");

-- CreateIndex
CREATE INDEX "AuthAuditLog_action_idx" ON "AuthAuditLog"("action");

-- CreateIndex
CREATE INDEX "AuthAuditLog_createdAt_idx" ON "AuthAuditLog"("createdAt");

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_roleId_fkey" FOREIGN KEY ("roleId") REFERENCES "Role"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Credential" ADD CONSTRAINT "Credential_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RolePermission" ADD CONSTRAINT "RolePermission_roleId_fkey" FOREIGN KEY ("roleId") REFERENCES "Role"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RolePermission" ADD CONSTRAINT "RolePermission_permissionId_fkey" FOREIGN KEY ("permissionId") REFERENCES "Permission"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProfilePermission" ADD CONSTRAINT "ProfilePermission_profileId_fkey" FOREIGN KEY ("profileId") REFERENCES "PermissionProfile"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProfilePermission" ADD CONSTRAINT "ProfilePermission_permissionId_fkey" FOREIGN KEY ("permissionId") REFERENCES "Permission"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AdminProfileAssignment" ADD CONSTRAINT "AdminProfileAssignment_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AdminProfileAssignment" ADD CONSTRAINT "AdminProfileAssignment_profileId_fkey" FOREIGN KEY ("profileId") REFERENCES "PermissionProfile"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StaffDirectPermission" ADD CONSTRAINT "StaffDirectPermission_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StaffDirectPermission" ADD CONSTRAINT "StaffDirectPermission_permissionId_fkey" FOREIGN KEY ("permissionId") REFERENCES "Permission"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AdminInvitation" ADD CONSTRAINT "AdminInvitation_roleId_fkey" FOREIGN KEY ("roleId") REFERENCES "Role"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AdminInvitation" ADD CONSTRAINT "AdminInvitation_profileId_fkey" FOREIGN KEY ("profileId") REFERENCES "PermissionProfile"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AdminInvitation" ADD CONSTRAINT "AdminInvitation_invitedById_fkey" FOREIGN KEY ("invitedById") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SessionFamily" ADD CONSTRAINT "SessionFamily_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RefreshToken" ADD CONSTRAINT "RefreshToken_sessionId_fkey" FOREIGN KEY ("sessionId") REFERENCES "SessionFamily"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ServicePublicKey" ADD CONSTRAINT "ServicePublicKey_serviceClientId_fkey" FOREIGN KEY ("serviceClientId") REFERENCES "ServiceClient"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ServiceTokenReplay" ADD CONSTRAINT "ServiceTokenReplay_serviceClientId_fkey" FOREIGN KEY ("serviceClientId") REFERENCES "ServiceClient"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AdminBootstrapMarker" ADD CONSTRAINT "AdminBootstrapMarker_adminUserId_fkey" FOREIGN KEY ("adminUserId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AuthAuditLog" ADD CONSTRAINT "AuthAuditLog_actorUserId_fkey" FOREIGN KEY ("actorUserId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AuthAuditLog" ADD CONSTRAINT "AuthAuditLog_actorServiceClientId_fkey" FOREIGN KEY ("actorServiceClientId") REFERENCES "ServiceClient"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AuthAuditLog" ADD CONSTRAINT "AuthAuditLog_targetUserId_fkey" FOREIGN KEY ("targetUserId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- =============================================================
-- Custom Stage 1 Database Integrity Constraints & Triggers
-- =============================================================

-- 1. Canonical email normalization CHECK constraints
ALTER TABLE "User" ADD CONSTRAINT "user_email_normalized_chk" 
  CHECK ("emailNormalized" = LOWER(TRIM("emailNormalized")) AND "emailNormalized" <> '');

ALTER TABLE "AdminInvitation" ADD CONSTRAINT "invitation_email_normalized_chk" 
  CHECK ("emailNormalized" = LOWER(TRIM("emailNormalized")) AND "emailNormalized" <> '');

-- 2. Partial unique index for active Admin profile assignments
CREATE UNIQUE INDEX "active_user_profile_idx" 
  ON "AdminProfileAssignment" ("userId", "profileId") 
  WHERE "revokedAt" IS NULL;

-- 3. Partial unique index for active staff direct permission overrides
CREATE UNIQUE INDEX "active_staff_permission_idx" 
  ON "StaffDirectPermission" ("userId", "permissionId") 
  WHERE "revokedAt" IS NULL;

-- 4. Partial unique index for active outstanding Admin invitations
CREATE UNIQUE INDEX "active_admin_invitation_email_idx" 
  ON "AdminInvitation" ("emailNormalized") 
  WHERE "isRevoked" = false AND "acceptedAt" IS NULL;

-- 5. Admin bootstrap marker singleton CHECK constraint
ALTER TABLE "AdminBootstrapMarker" ADD CONSTRAINT "admin_bootstrap_marker_singleton_chk" 
  CHECK ("id" = 'root_admin_bootstrap_marker');

-- 6. Database-level immutability function and trigger for AuthAuditLog
CREATE OR REPLACE FUNCTION prevent_audit_log_modification()
RETURNS TRIGGER AS $$
BEGIN
  RAISE EXCEPTION 'AuthAuditLog entries are immutable and cannot be updated or deleted.';
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER audit_log_immutability_trigger
BEFORE UPDATE OR DELETE ON "AuthAuditLog"
FOR EACH ROW EXECUTE FUNCTION prevent_audit_log_modification();
