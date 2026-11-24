-- CreateEnum
CREATE TYPE "VendorStatus" AS ENUM ('ACTIVE', 'INACTIVE', 'SUSPENDED', 'PENDING_ONBOARDING');

-- CreateEnum
CREATE TYPE "VerificationStatus" AS ENUM ('PENDING', 'UNDER_REVIEW', 'APPROVED', 'REJECTED', 'REUPLOAD_REQUESTED');

-- CreateEnum
CREATE TYPE "BankVerificationStatus" AS ENUM ('PENDING', 'PENNY_DROP_VERIFIED', 'REJECTED');

-- CreateEnum
CREATE TYPE "RiderStatus" AS ENUM ('ACTIVE', 'INACTIVE', 'SUSPENDED', 'PENDING_ONBOARDING');

-- CreateEnum
CREATE TYPE "RiderAvailability" AS ENUM ('ONLINE', 'OFFLINE', 'ON_DELIVERY');

-- CreateEnum
CREATE TYPE "VehicleType" AS ENUM ('MOTORCYCLE', 'SCOOTER', 'ELECTRIC_VEHICLE', 'BICYCLE', 'ON_FOOT');

-- CreateEnum
CREATE TYPE "ApplicantType" AS ENUM ('VENDOR', 'RIDER');

-- CreateEnum
CREATE TYPE "RequirementType" AS ENUM ('REQUIRED', 'OPTIONAL', 'CONDITIONAL');

-- CreateEnum
CREATE TYPE "DocumentStatus" AS ENUM ('PENDING', 'APPROVED', 'REJECTED', 'REUPLOAD_REQUESTED');

-- CreateEnum
CREATE TYPE "DocumentReviewAction" AS ENUM ('APPROVED', 'REJECTED', 'REUPLOAD_REQUESTED');

-- CreateTable
CREATE TABLE "Vendor" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "businessName" TEXT NOT NULL,
    "ownerName" TEXT NOT NULL,
    "businessCategory" TEXT NOT NULL,
    "city" TEXT NOT NULL,
    "shopAddress" TEXT NOT NULL,
    "gstin" TEXT,
    "licenceNumber" TEXT,
    "status" "VendorStatus" NOT NULL DEFAULT 'PENDING_ONBOARDING',
    "verificationStatus" "VerificationStatus" NOT NULL DEFAULT 'PENDING',
    "statusReason" TEXT,
    "statusRemarks" TEXT,
    "statusChangedAt" TIMESTAMP(3),
    "statusChangedByUserId" TEXT,
    "joinedDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "isDeleted" BOOLEAN NOT NULL DEFAULT false,
    "deletedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Vendor_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Store" (
    "id" TEXT NOT NULL,
    "vendorId" TEXT NOT NULL,
    "storeName" TEXT NOT NULL,
    "storeCode" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "email" TEXT,
    "addressLine1" TEXT NOT NULL,
    "addressLine2" TEXT,
    "city" TEXT NOT NULL,
    "state" TEXT NOT NULL,
    "postalCode" TEXT NOT NULL,
    "latitude" DOUBLE PRECISION NOT NULL,
    "longitude" DOUBLE PRECISION NOT NULL,
    "serviceRadiusKm" DECIMAL(4,1) NOT NULL DEFAULT 5.0,
    "isOpen" BOOLEAN NOT NULL DEFAULT true,
    "openingTime" TEXT NOT NULL DEFAULT '07:00',
    "closingTime" TEXT NOT NULL DEFAULT '23:00',
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "isDeleted" BOOLEAN NOT NULL DEFAULT false,
    "deletedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Store_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "VendorBankAccount" (
    "id" TEXT NOT NULL,
    "vendorId" TEXT NOT NULL,
    "accountHolderName" TEXT NOT NULL,
    "bankName" TEXT NOT NULL,
    "accountNumberEncrypted" TEXT NOT NULL,
    "accountNumberMasked" TEXT NOT NULL,
    "ifscCode" TEXT NOT NULL,
    "isPrimary" BOOLEAN NOT NULL DEFAULT true,
    "verificationStatus" "BankVerificationStatus" NOT NULL DEFAULT 'PENDING',
    "isDeleted" BOOLEAN NOT NULL DEFAULT false,
    "deletedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "VendorBankAccount_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Rider" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "fullName" TEXT NOT NULL,
    "city" TEXT NOT NULL,
    "address" TEXT NOT NULL,
    "emergencyContactName" TEXT NOT NULL,
    "emergencyContactRelation" TEXT NOT NULL,
    "emergencyContactPhone" TEXT NOT NULL,
    "availability" "RiderAvailability" NOT NULL DEFAULT 'OFFLINE',
    "verificationStatus" "VerificationStatus" NOT NULL DEFAULT 'PENDING',
    "status" "RiderStatus" NOT NULL DEFAULT 'PENDING_ONBOARDING',
    "statusReason" TEXT,
    "statusRemarks" TEXT,
    "statusChangedAt" TIMESTAMP(3),
    "statusChangedByUserId" TEXT,
    "ratingAverage" DECIMAL(3,2) NOT NULL DEFAULT 5.00,
    "deliveriesCompleted" INTEGER NOT NULL DEFAULT 0,
    "onTimePct" DECIMAL(5,2) NOT NULL DEFAULT 100.0,
    "joinedDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "isDeleted" BOOLEAN NOT NULL DEFAULT false,
    "deletedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Rider_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Vehicle" (
    "id" TEXT NOT NULL,
    "riderId" TEXT NOT NULL,
    "vehicleType" "VehicleType" NOT NULL,
    "model" TEXT,
    "registrationNumber" TEXT,
    "isPrimary" BOOLEAN NOT NULL DEFAULT true,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "isDeleted" BOOLEAN NOT NULL DEFAULT false,
    "deletedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Vehicle_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RiderBankAccount" (
    "id" TEXT NOT NULL,
    "riderId" TEXT NOT NULL,
    "accountHolderName" TEXT NOT NULL,
    "bankName" TEXT NOT NULL,
    "accountNumberEncrypted" TEXT NOT NULL,
    "accountNumberMasked" TEXT NOT NULL,
    "ifscCode" TEXT NOT NULL,
    "isPrimary" BOOLEAN NOT NULL DEFAULT true,
    "verificationStatus" "BankVerificationStatus" NOT NULL DEFAULT 'PENDING',
    "isDeleted" BOOLEAN NOT NULL DEFAULT false,
    "deletedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "RiderBankAccount_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RiderLocation" (
    "id" TEXT NOT NULL,
    "riderId" TEXT NOT NULL,
    "latitude" DOUBLE PRECISION NOT NULL,
    "longitude" DOUBLE PRECISION NOT NULL,
    "heading" DOUBLE PRECISION,
    "accuracyMeters" DOUBLE PRECISION,
    "speedKmph" DOUBLE PRECISION,
    "recordedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "RiderLocation_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "FileAsset" (
    "id" TEXT NOT NULL,
    "storageKey" TEXT NOT NULL,
    "bucketName" TEXT NOT NULL,
    "fileUrl" TEXT NOT NULL,
    "mimeType" TEXT NOT NULL,
    "fileSizeBytes" INTEGER NOT NULL,
    "checksumSha256" TEXT NOT NULL,
    "uploadedByUserId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "FileAsset_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DocumentType" (
    "id" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "purpose" TEXT NOT NULL,
    "appliesTo" "ApplicantType" NOT NULL,
    "requirementLevel" "RequirementType" NOT NULL DEFAULT 'REQUIRED',
    "isCategorySpecific" BOOLEAN NOT NULL DEFAULT false,
    "applicableCategory" TEXT,
    "isVehicleRequired" BOOLEAN NOT NULL DEFAULT false,
    "displayOrder" INTEGER NOT NULL DEFAULT 0,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "DocumentType_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Document" (
    "id" TEXT NOT NULL,
    "entityType" "ApplicantType" NOT NULL,
    "vendorId" TEXT,
    "riderId" TEXT,
    "documentTypeId" TEXT NOT NULL,
    "fileAssetId" TEXT,
    "documentNumberEncrypted" TEXT,
    "documentNumberMasked" TEXT,
    "status" "DocumentStatus" NOT NULL DEFAULT 'PENDING',
    "rejectReason" TEXT,
    "rejectRemarks" TEXT,
    "reviewedByUserId" TEXT,
    "reviewedAt" TIMESTAMP(3),
    "isDeleted" BOOLEAN NOT NULL DEFAULT false,
    "deletedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Document_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DocumentReview" (
    "id" TEXT NOT NULL,
    "documentId" TEXT NOT NULL,
    "reviewedByUserId" TEXT NOT NULL,
    "action" "DocumentReviewAction" NOT NULL,
    "reason" TEXT,
    "remarks" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "DocumentReview_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Vendor_userId_key" ON "Vendor"("userId");

-- CreateIndex
CREATE INDEX "Vendor_status_verificationStatus_idx" ON "Vendor"("status", "verificationStatus");

-- CreateIndex
CREATE INDEX "Vendor_city_idx" ON "Vendor"("city");

-- CreateIndex
CREATE INDEX "Vendor_gstin_idx" ON "Vendor"("gstin");

-- CreateIndex
CREATE INDEX "Vendor_isDeleted_idx" ON "Vendor"("isDeleted");

-- CreateIndex
CREATE UNIQUE INDEX "Store_storeCode_key" ON "Store"("storeCode");

-- CreateIndex
CREATE INDEX "Store_vendorId_idx" ON "Store"("vendorId");

-- CreateIndex
CREATE INDEX "Store_city_state_idx" ON "Store"("city", "state");

-- CreateIndex
CREATE INDEX "Store_latitude_longitude_idx" ON "Store"("latitude", "longitude");

-- CreateIndex
CREATE INDEX "Store_isOpen_isActive_isDeleted_idx" ON "Store"("isOpen", "isActive", "isDeleted");

-- CreateIndex
CREATE INDEX "VendorBankAccount_vendorId_idx" ON "VendorBankAccount"("vendorId");

-- CreateIndex
CREATE INDEX "VendorBankAccount_isPrimary_idx" ON "VendorBankAccount"("isPrimary");

-- CreateIndex
CREATE UNIQUE INDEX "Rider_userId_key" ON "Rider"("userId");

-- CreateIndex
CREATE INDEX "Rider_status_verificationStatus_idx" ON "Rider"("status", "verificationStatus");

-- CreateIndex
CREATE INDEX "Rider_availability_idx" ON "Rider"("availability");

-- CreateIndex
CREATE INDEX "Rider_city_idx" ON "Rider"("city");

-- CreateIndex
CREATE INDEX "Rider_isDeleted_idx" ON "Rider"("isDeleted");

-- CreateIndex
CREATE INDEX "Vehicle_riderId_idx" ON "Vehicle"("riderId");

-- CreateIndex
CREATE INDEX "Vehicle_registrationNumber_idx" ON "Vehicle"("registrationNumber");

-- CreateIndex
CREATE INDEX "RiderBankAccount_riderId_idx" ON "RiderBankAccount"("riderId");

-- CreateIndex
CREATE INDEX "RiderBankAccount_isPrimary_idx" ON "RiderBankAccount"("isPrimary");

-- CreateIndex
CREATE INDEX "RiderLocation_riderId_recordedAt_idx" ON "RiderLocation"("riderId", "recordedAt");

-- CreateIndex
CREATE INDEX "RiderLocation_latitude_longitude_idx" ON "RiderLocation"("latitude", "longitude");

-- CreateIndex
CREATE UNIQUE INDEX "FileAsset_storageKey_key" ON "FileAsset"("storageKey");

-- CreateIndex
CREATE INDEX "FileAsset_uploadedByUserId_idx" ON "FileAsset"("uploadedByUserId");

-- CreateIndex
CREATE UNIQUE INDEX "DocumentType_code_key" ON "DocumentType"("code");

-- CreateIndex
CREATE INDEX "DocumentType_appliesTo_isActive_idx" ON "DocumentType"("appliesTo", "isActive");

-- CreateIndex
CREATE INDEX "Document_vendorId_idx" ON "Document"("vendorId");

-- CreateIndex
CREATE INDEX "Document_riderId_idx" ON "Document"("riderId");

-- CreateIndex
CREATE INDEX "Document_status_idx" ON "Document"("status");

-- CreateIndex
CREATE INDEX "Document_documentTypeId_idx" ON "Document"("documentTypeId");

-- CreateIndex
CREATE INDEX "DocumentReview_documentId_idx" ON "DocumentReview"("documentId");

-- CreateIndex
CREATE INDEX "DocumentReview_reviewedByUserId_idx" ON "DocumentReview"("reviewedByUserId");

-- CreateIndex
CREATE INDEX "DocumentReview_createdAt_idx" ON "DocumentReview"("createdAt");

-- AddForeignKey
ALTER TABLE "InventoryBalance" ADD CONSTRAINT "InventoryBalance_storeId_fkey" FOREIGN KEY ("storeId") REFERENCES "Store"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Vendor" ADD CONSTRAINT "Vendor_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Vendor" ADD CONSTRAINT "Vendor_statusChangedByUserId_fkey" FOREIGN KEY ("statusChangedByUserId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Store" ADD CONSTRAINT "Store_vendorId_fkey" FOREIGN KEY ("vendorId") REFERENCES "Vendor"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "VendorBankAccount" ADD CONSTRAINT "VendorBankAccount_vendorId_fkey" FOREIGN KEY ("vendorId") REFERENCES "Vendor"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Rider" ADD CONSTRAINT "Rider_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Rider" ADD CONSTRAINT "Rider_statusChangedByUserId_fkey" FOREIGN KEY ("statusChangedByUserId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Vehicle" ADD CONSTRAINT "Vehicle_riderId_fkey" FOREIGN KEY ("riderId") REFERENCES "Rider"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RiderBankAccount" ADD CONSTRAINT "RiderBankAccount_riderId_fkey" FOREIGN KEY ("riderId") REFERENCES "Rider"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RiderLocation" ADD CONSTRAINT "RiderLocation_riderId_fkey" FOREIGN KEY ("riderId") REFERENCES "Rider"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FileAsset" ADD CONSTRAINT "FileAsset_uploadedByUserId_fkey" FOREIGN KEY ("uploadedByUserId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Document" ADD CONSTRAINT "Document_vendorId_fkey" FOREIGN KEY ("vendorId") REFERENCES "Vendor"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Document" ADD CONSTRAINT "Document_riderId_fkey" FOREIGN KEY ("riderId") REFERENCES "Rider"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Document" ADD CONSTRAINT "Document_documentTypeId_fkey" FOREIGN KEY ("documentTypeId") REFERENCES "DocumentType"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Document" ADD CONSTRAINT "Document_fileAssetId_fkey" FOREIGN KEY ("fileAssetId") REFERENCES "FileAsset"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Document" ADD CONSTRAINT "Document_reviewedByUserId_fkey" FOREIGN KEY ("reviewedByUserId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DocumentReview" ADD CONSTRAINT "DocumentReview_documentId_fkey" FOREIGN KEY ("documentId") REFERENCES "Document"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DocumentReview" ADD CONSTRAINT "DocumentReview_reviewedByUserId_fkey" FOREIGN KEY ("reviewedByUserId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;


-- =============================================================
-- Runtime Application Role Grants (Least Privilege: Zero DELETE)
-- =============================================================

-- 1. Append-only Document Review History: SELECT and INSERT only
GRANT SELECT, INSERT ON TABLE "DocumentReview" TO fillcart_app_user;
REVOKE UPDATE, DELETE, TRUNCATE ON TABLE "DocumentReview" FROM fillcart_app_user;

-- 2. Sensitive Bank Account Tables: SELECT, INSERT, UPDATE only (Zero DELETE)
GRANT SELECT, INSERT, UPDATE ON TABLE
    "VendorBankAccount",
    "RiderBankAccount"
TO fillcart_app_user;

REVOKE DELETE ON TABLE
    "VendorBankAccount",
    "RiderBankAccount"
FROM fillcart_app_user;

-- 3. Operational Tables: SELECT, INSERT, UPDATE only (Zero DELETE)
GRANT SELECT, INSERT, UPDATE ON TABLE
    "Vendor",
    "Store",
    "Rider",
    "Vehicle",
    "RiderLocation",
    "FileAsset",
    "DocumentType",
    "Document"
TO fillcart_app_user;

REVOKE DELETE ON TABLE
    "DocumentReview",
    "Vendor",
    "Store",
    "Rider",
    "Vehicle",
    "RiderLocation",
    "FileAsset",
    "DocumentType",
    "Document"
FROM fillcart_app_user;
