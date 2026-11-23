# Fillcart Table Ownership & Data Governance Registry

**Document Location:** `docs/TABLE_OWNERSHIP.md`  
**Version:** 1.0.0  
**Status:** Authoritative Data Governance Baseline  
**Last Updated:** November 23, 2026  
**Audience:** Platform Architects, Service Leads (Admin, Vendor, Rider, Customer, Central Auth), Database Engineers  

---

## 1. Table Governance Principles & Mandatory Rules

1. **Strict Single Ownership (`One Owner per Table`):**  
   Every table in the Fillcart centralized database is assigned exactly **one authoritative service/team owner**. The table owner is accountable for schema evolution, domain validation logic, lifecycle state machines, and data consistency.
2. **Additive-Only Schema Changes:**  
   Destructive DDL (`DROP TABLE`, `DROP COLUMN`, renaming columns or altering constraints in breaking ways) is strictly prohibited across all migrations. Any change must be backward-compatible, additive, and reviewed via RFC.
3. **Pre-Creation Check Mandate:**  
   Before creating or extending any database table, developers and architects **must check this registry** to verify ownership, naming conventions, and column boundaries.
4. **Least-Privilege Runtime Grants:**  
   Runtime application connections strictly operate under `fillcart_app_user` with **ZERO `DELETE` privileges** (`can_delete = false`). Operational records are soft-deleted (`isDeleted = true`, `deletedAt = NOW()`), while history and audit tables are strictly append-only (`SELECT, INSERT` only).
5. **Money Serialization Rule:**  
   All monetary amounts are stored as **64-bit integer Paisa (`BigInt`)** in PostgreSQL to guarantee zero float drift. Presentation formatting (`₹`) and string serialization occur at API/DTO boundaries.
6. **Decoupled Commission & Location:**  
   - Commercial commissions are never duplicated on merchant profiles; they are strictly resolved via `CommissionRule`.
   - Rider live location telemetry is never written directly to the static `Rider` profile; it is streamed into `RiderLocation`.

---

## 2. Table Ownership & Column Write Governance Matrix

### Migration 1: Admin Governance & Catalogue (`20261124010000_core_admin_and_catalogue`)

| Table Name | Owning Service / Team | Migration | Read Access | Write & Mutation Rules by Column |
| :--- | :--- | :--- | :--- | :--- |
| **`AdminAuditLog`** | Admin Backend | Migration 1 | Super Admin | **Append-Only (`SELECT, INSERT` only).**<br>• `adminUserId`, `targetType`, `targetId`, `action`, `changesSummary`, `ipAddress`, `userAgent`, `createdAt` are written on event creation.<br>• *Updates and Deletions are cryptographically and privilege-revoked.* |
| **`SystemSetting`** | Admin Backend | Migration 1 | All Backends (Cached) | **Admin Owned:**<br>• `tabId`, `key`, `value`, `isEncrypted`, `updatedByUserId`, `updatedAt` are written exclusively by Super Admin during portal setting updates. |
| **`OpsPolicy`** | Admin Backend | Migration 1 | All Backends | **Admin Owned:**<br>• `policyKey`, `policyName`, `config`, `effectiveFrom`, `effectiveTo`, `updatedByUserId` written by Super Admin. |
| **`Category`** | Admin Backend | Migration 1 | Customer, Vendor, Admin | **Admin Owned:**<br>• `name`, `slug`, `description`, `iconName`, `parentCategoryId`, `displayOrder`, `isActive`, `isDeleted`, `deletedAt` are authored and maintained by Super Admin Catalog Managers. |
| **`Brand`** | Admin Backend | Migration 1 | Customer, Vendor, Admin | **Admin Owned:**<br>• `name`, `slug`, `logoUrl`, `isActive`, `isDeleted`, `deletedAt` written exclusively by Super Admin. |
| **`Product`** | Admin Backend *(Co-authored with Vendor)* | Migration 1 | Customer, Vendor, Admin | **Partitioned Ownership:**<br>• **Vendor Backend writes:** `name`, `slug`, `description`, `categoryId`, `brandId`, `hsnCode`.<br>• **Admin Backend exclusively writes:** `status`, `moderationStatus`, `rejectReason`, `moderatedByUserId`, `moderatedAt`, `isActive`, `isDeleted`, `deletedAt`. |
| **`ProductVariant`** | Vendor Backend | Migration 1 | Customer, Admin | **Vendor Owned:**<br>• `productId`, `sku`, `barcode`, `variantName`, `unitQuantity`, `unitType`, `mrpPaisa`, `salePricePaisa`, `discountPct`, `isDefault`, `isActive`, `isDeleted`, `deletedAt`.<br>• Super Admin has emergency soft-delete override. |
| **`InventoryBalance`** | Vendor Backend | Migration 1 | Customer (Search), Admin | **Store/Fulfillment Owned:**<br>• `storeId`, `variantId`, `reorderThreshold`, `lastRestockedAt` managed by Merchant store staff.<br>• `quantityOnHand`: Updated on stock restock or reconciliation.<br>• `reservedQuantity`: Reserved/released automatically by the Order Management System during checkout. |

---

### Migration 2: Vendors, Riders & Documents (`20261124020000_core_vendors_riders_documents`)

| Table Name | Owning Service / Team | Migration | Read Access | Write & Mutation Rules by Column |
| :--- | :--- | :--- | :--- | :--- |
| **`Vendor`** | Vendor Backend | Migration 2 | Customer, Admin, Finance | **Partitioned Ownership:**<br>• **Vendor writes:** `userId`, `businessName`, `ownerName`, `businessCategory`, `city`, `shopAddress`, `gstin`, `licenceNumber`.<br>• **Admin exclusively writes:** `status`, `verificationStatus`, `statusReason`, `statusRemarks`, `statusChangedAt`, `statusChangedByUserId`, `isDeleted`, `deletedAt`. |
| **`Store`** | Vendor Backend | Migration 2 | Customer, Rider, Admin | **Merchant Owned:**<br>• `vendorId`, `storeName`, `storeCode`, `phone`, `email`, address lines, geo coordinates (`latitude`, `longitude`), `serviceRadiusKm`, `isOpen`, `openingTime`, `closingTime`, `isActive`, `isDeleted`.<br>• Admin can toggle `isActive = false` upon compliance breaches. |
| **`VendorBankAccount`** | Vendor Backend | Migration 2 | Admin, Finance | **Sensitive Banking Asset:**<br>• **Vendor writes:** `accountHolderName`, `bankName`, `accountNumberEncrypted`, `accountNumberMasked`, `ifscCode`, `isPrimary`.<br>• **Admin/Finance writes:** `verificationStatus` (e.g. `PENNY_DROP_VERIFIED`, `REJECTED`).<br>• *Explicit zero hard-delete.* |
| **`Rider`** | Rider Backend | Migration 2 | Customer, Admin, Dispatch | **Partitioned Ownership:**<br>• **Rider writes:** `userId`, `fullName`, `phone`, `email`, `city`, `address`, emergency contact details, `availability` (`ONLINE`/`OFFLINE`).<br>• **Admin exclusively writes:** `status`, `verificationStatus`, `statusReason`, `statusRemarks`, `statusChangedAt`, `statusChangedByUserId`, `isDeleted`, `deletedAt`.<br>• **Dispatch Engine writes:** `deliveriesCompleted`, `ratingAverage`, `onTimePct`. |
| **`Vehicle`** | Rider Backend | Migration 2 | Admin | **Rider Owned:**<br>• `riderId`, `vehicleType`, `model`, `registrationNumber`, `isPrimary`, `isActive`, `isDeleted`. Verified by Admin. |
| **`RiderBankAccount`** | Rider Backend | Migration 2 | Admin, Finance | **Sensitive Banking Asset:**<br>• **Rider writes:** `accountHolderName`, `bankName`, `accountNumberEncrypted`, `accountNumberMasked`, `ifscCode`, `isPrimary`.<br>• **Admin/Finance writes:** `verificationStatus`. |
| **`RiderLocation`** | Rider Backend *(Telemetry)* | Migration 2 | Dispatch Engine, Customer (Active Order) | **High-Frequency Ingestion:**<br>• `riderId`, `latitude`, `longitude`, `heading`, `accuracyMeters`, `speedKmph`, `recordedAt`, `createdAt`.<br>• Append-only telemetry records streamed by Rider App background service. |
| **`FileAsset`** | Platform / Shared Storage | Migration 2 | All Services | **Immutable Object Registry:**<br>• `storageKey`, `bucketName`, `fileUrl`, `mimeType`, `fileSizeBytes`, `checksumSha256`, `uploadedByUserId`, `createdAt`.<br>• Authored exclusively on cloud upload completion. |
| **`DocumentType`** | Admin Backend | Migration 2 | Vendor, Rider, Admin | **Admin Owned:**<br>• `code`, `name`, `purpose`, `appliesTo`, `requirementLevel`, `isCategorySpecific`, `applicableCategory`, `isVehicleRequired`, `displayOrder`, `isActive` managed by Super Admin KYC configuration. |
| **`Document`** | Vendor / Rider *(Co-authored with Admin)* | Migration 2 | Applicant, Admin | **Partitioned Ownership:**<br>• **Applicant writes:** `entityType`, `vendorId`, `riderId`, `documentTypeId`, `fileAssetId`, `documentNumber`.<br>• **Admin exclusively writes:** `status`, `rejectReason`, `rejectRemarks`, `reviewedByUserId`, `reviewedAt`, `isDeleted`, `deletedAt`. |
| **`DocumentReview`** | Admin Backend | Migration 2 | Applicant (Read-only status) | **Append-Only (`SELECT, INSERT` only).**<br>• `documentId`, `reviewedByUserId`, `action`, `reason`, `remarks`, `createdAt` recorded when an Admin reviews a compliance document. |

---

### Migration 3: Customers & Orders (`20261124030000_core_customers_and_orders`)

| Table Name | Owning Service / Team | Migration | Read Access | Write & Mutation Rules by Column |
| :--- | :--- | :--- | :--- | :--- |
| **`CustomerProfile`**| Customer Backend | Migration 3 | Admin | **Customer Owned:**<br>• `userId`, `dateOfBirth`, `alternatePhone`, `isDeleted`, `deletedAt`.<br>• **Admin writes:** `isVip`.<br>• **Order Service writes:** `totalOrdersPlaced`. |
| **`Address`** | Customer Backend | Migration 3 | Order, Rider, Admin | **Customer Owned:**<br>• `customerProfileId`, `addressType`, `recipientName`, `recipientPhone`, address text, geo coordinates (`latitude`, `longitude`), `isDefault`, `isDeleted`. |
| **`Order`** | Customer Backend *(Transactional Hub)* | Migration 3 | Customer, Vendor, Rider, Admin | **Lifecycle Partitioned:**<br>• **Customer writes:** `orderNumber`, `customerProfileId`, `storeId`, `deliveryAddressId`, `paymentMethod`, `couponId`, `specialInstructions`.<br>• **Pricing Engine calculates:** `itemTotalPaisa`, `deliveryFeePaisa`, `taxPaisa`, `discountPaisa`, `tipPaisa`, `totalAmountPaisa`.<br>• **State Machine / Admin writes:** `status`, `paymentStatus`, lifecycle timestamps (`acceptedAt`, `preparingAt`, `readyForPickupAt`, `outForDeliveryAt`, `deliveredAt`, `cancelledAt`), `cancelReason`, `cancelRemarks`, `isRefunded`. |
| **`OrderItem`** | Customer Backend | Migration 3 | Vendor, Customer, Admin | **Immutable Snapshot:**<br>• `orderId`, `variantId`, `productName`, `variantName`, `unitPricePaisa`, `quantity`, `subtotalPaisa`, `taxPaisa`, `totalPaisa`, `specialNotes`. Authored once at checkout. |
| **`OrderStatusHistory`**| Order Service | Migration 3 | Customer, Vendor, Rider, Admin | **Append-Only (`SELECT, INSERT` only).**<br>• `orderId`, `fromStatus`, `toStatus`, `triggeredByActorType`, `triggeredByUserId`, `reason`, `metadata`, `createdAt` recorded on every state change. |
| **`DeliveryAssignment`**| Dispatch Engine / Rider Backend | Migration 3 | Customer, Vendor, Rider, Admin | **Dispatch Owned:**<br>• `orderId`, `riderId`, `status`, `assignedByMode`, `assignedByUserId` (Admin manual override), dispatch timestamps, `distanceMeters`, `riderEarningsPaisa`. |
| **`OrderCancellation`**| Order Service | Migration 3 | Customer, Vendor, Admin | **Immutable Cancellation Audit:**<br>• `orderId`, `cancelledByActorType`, `cancelledByUserId`, `reasonCode`, `customReason`, `isAutoCancelled`, `feeAppliedPaisa`, `createdAt`. |
| **`RefundRecord`** | Finance / Admin Backend | Migration 3 | Customer, Admin | **Financial Dispute Audit:**<br>• `orderId`, `paymentId`, `customerProfileId`, `amountPaisa`, `status`, `reason`, `processedByUserId`, `gatewayRefundId`, `processedAt`. Written when refunds are initiated or settled. |

---

### Migration 4: Finance, Settlements & Promotions (`20261124040000_core_finance`)

| Table Name | Owning Service / Team | Migration | Read Access | Write & Mutation Rules by Column |
| :--- | :--- | :--- | :--- | :--- |
| **`Payment`** | Payments Gateway Webhook | Migration 4 | Customer, Admin, Finance | **Payment Gateway Owned:**<br>• `orderId`, `customerProfileId`, `gatewayTransactionId`, `gatewayName`, `method`, `amountPaisa`, `currency`, `status`, `failureReason`, `gatewayResponse`. Mutated strictly via verified webhooks. |
| **`SettlementBatch`**| Finance / Admin Backend | Migration 4 | Vendor, Rider, Admin | **Finance Admin Owned:**<br>• `batchNumber`, `entityType`, `periodStart`, `periodEnd`, totals in paisa (`totalGrossAmountPaisa`, `totalCommissionPaisa`, `totalGstPaisa`, `totalNetPayoutPaisa`), `totalCount`, `status`, `createdByUserId`, `processedAt`. |
| **`Payout`** | Finance / Admin Backend | Migration 4 | Vendor, Rider, Admin | **Finance Admin Owned:**<br>• `settlementBatchId`, `entityType`, `vendorId`, `riderId`, `periodLabel`, amounts in paisa, `commissionPct`, deductions, `status`, bank account references, `utrNumber`, `failureReason`, `initiatedByUserId`, `processedAt`. |
| **`CommissionRule`** | Admin Backend | Migration 4 | Vendor, Finance | **Admin Owned:**<br>• `name`, `categoryId`, `vendorId`, `ratePct`, `effectiveFrom`, `effectiveTo`, `reason`, `createdByUserId`, `isActive`, `isDeleted`, `deletedAt`. |
| **`Wallet`** | Customer Backend | Migration 4 | Customer, Admin | **Stored-Value Asset:**<br>• `customerProfileId`, `balancePaisa`, `totalSpentPaisa`, `currency`, `isDeleted`.<br>• **Admin writes:** `status = FROZEN` / `ACTIVE`. |
| **`WalletTransaction`**| Customer / Admin Backend | Migration 4 | Customer, Admin | **Append-Only (`SELECT, INSERT` only).**<br>• `walletId`, `type` (`CREDIT`, `DEBIT`, `REFUND`, `CASHBACK`), `amountPaisa`, `balanceAfterPaisa`, `referenceOrderId`, `reason`, `performedByUserId`, `createdAt`. |
| **`Coupon`** | Marketing / Admin Backend | Migration 4 | Customer, Admin | **Admin Owned:**<br>• `code`, `type`, `valuePaisaOrPct`, `minOrderValuePaisa`, `maxDiscountPaisa`, `totalUsageLimit`, `currentUsageCount`, `perUserLimit`, `applicableAudience`, `validFrom`, `validTo`, `status`, `isDeleted`. |
| **`CouponUsage`** | Order / Checkout Engine | Migration 4 | Admin, Customer | **Redemption Record:**<br>• `couponId`, `customerProfileId`, `orderId`, `discountAppliedPaisa`, `usedAt`. Recorded atomically during order placement. |
| **`TaxSlab`** | Finance / Admin Backend | Migration 4 | Catalogue, Checkout | **Admin Owned:**<br>• `name`, `categoryId`, `hsnCode`, `slabPercentage`, `cessPercentage`, `effectiveFrom`, `isActive`. |

---

## 3. Maintenance & Evolution Checklist

When adding or altering fields in future migrations:
1. Confirm that changes are **additive only** (`ADD COLUMN`, `ADD CONSTRAINT`).
2. Verify that **zero existing tables** are dropped or renamed.
3. If new columns contain financial figures, use `BigInt` (paisa).
4. If a new operational table is added, grant `SELECT, INSERT, UPDATE` to `fillcart_app_user` and explicitly `REVOKE DELETE`.
5. If a new audit or event history table is added, grant `SELECT, INSERT` only and explicitly `REVOKE UPDATE, DELETE, TRUNCATE`.
6. Update this document (`docs/TABLE_OWNERSHIP.md`) in the same pull request.
