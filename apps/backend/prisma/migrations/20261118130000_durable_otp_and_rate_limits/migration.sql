-- CreateTable OtpChallenge
CREATE TABLE "OtpChallenge" (
    "id" TEXT NOT NULL,
    "phoneNormalized" TEXT NOT NULL,
    "accountType" "AccountType" NOT NULL,
    "purpose" TEXT NOT NULL,
    "tokenHash" TEXT NOT NULL,
    "attemptsLeft" INTEGER NOT NULL DEFAULT 3,
    "userId" TEXT,
    "sessionId" TEXT,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "cooldownUntil" TIMESTAMP(3) NOT NULL,
    "consumedAt" TIMESTAMP(3),
    "deliveryStatus" TEXT NOT NULL DEFAULT 'PENDING',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "OtpChallenge_pkey" PRIMARY KEY ("id")
);

-- CreateTable RateLimitRecord
CREATE TABLE "RateLimitRecord" (
    "id" TEXT NOT NULL,
    "key" TEXT NOT NULL,
    "timestamp" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "RateLimitRecord_pkey" PRIMARY KEY ("id")
);

-- Indices
CREATE INDEX "OtpChallenge_phoneNormalized_idx" ON "OtpChallenge"("phoneNormalized");
CREATE INDEX "OtpChallenge_expiresAt_idx" ON "OtpChallenge"("expiresAt");
CREATE INDEX "RateLimitRecord_key_timestamp_idx" ON "RateLimitRecord"("key", "timestamp");

-- Runtime Role Grants
GRANT SELECT, INSERT, UPDATE ON "OtpChallenge" TO fillcart_app_user;
GRANT SELECT, INSERT ON "RateLimitRecord" TO fillcart_app_user;

-- Explicitly ensure NO DELETE permission is granted to runtime role
REVOKE DELETE ON "OtpChallenge" FROM fillcart_app_user;
REVOKE DELETE ON "RateLimitRecord" FROM fillcart_app_user;
