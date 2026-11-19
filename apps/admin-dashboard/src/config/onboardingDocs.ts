// ─────────────────────────────────────────────────────────────────────────────
// Fillcarts Onboarding Documents - Single Source of Truth
// ─────────────────────────────────────────────────────────────────────────────

export type DocumentRequirement = 'Required' | 'Optional' | 'Conditional' | 'Category specific';
export type VerificationDocStatus = 'Approved' | 'Pending' | 'Rejected' | 'N/A' | 'Not registered';

export interface BaseDocDefinition {
  id: string;
  name: string;
  purpose: string;
  requirement: DocumentRequirement;
  isCategorySpecific?: boolean;
  isConditional?: boolean;
  categoryCondition?: string; // e.g. "Grocery / Food Vendors", "Pharmacy"
  conditionalVehicleTypes?: ('Motorcycle' | 'Scooter' | 'Electric')[];
  isDataCard?: boolean; // e.g. Emergency Contact Details
  dataPayload?: Record<string, string>;
}

export interface VerificationStepDefinition {
  id: string;
  name: string;
  description: string;
  required: boolean;
}

// Global flag controlling pharmacy category eligibility
export const allowPharmacy = true;

// 1) VENDOR ONBOARDING DOCUMENTS (8 base documents)
export const VENDOR_BASE_DOCS: BaseDocDefinition[] = [
  {
    id: 'v-pan',
    name: "Owner's PAN Card",
    purpose: 'Owner / business verification',
    requirement: 'Required',
  },
  {
    id: 'v-id',
    name: 'Identity Proof',
    purpose: 'Owner KYC',
    requirement: 'Required',
  },
  {
    id: 'v-addr',
    name: 'Address Proof',
    purpose: 'Owner verification',
    requirement: 'Required',
  },
  {
    id: 'v-shop-addr',
    name: 'Shop Address Proof',
    purpose: 'Store location verification',
    requirement: 'Required',
  },
  {
    id: 'v-photo',
    name: 'Shop Photograph',
    purpose: 'Store verification',
    requirement: 'Required',
  },
  {
    id: 'v-gst',
    name: 'GST Certificate (GSTIN)',
    purpose: 'If registered',
    requirement: 'Optional',
  },
  {
    id: 'v-bank',
    name: 'Bank Proof / Cancelled Cheque',
    purpose: 'Vendor payments',
    requirement: 'Required',
  },
  {
    id: 'v-agreement',
    name: 'Vendor Agreement',
    purpose: 'Commission, payout and terms',
    requirement: 'Required',
  },
];

// Additional Category-specific Vendor Documents
export const VENDOR_CATEGORY_DOCS: Record<string, BaseDocDefinition> = {
  'Grocery & Staples': {
    id: 'v-fssai',
    name: 'FSSAI Registration / Licence',
    purpose: 'Applicable FSSAI registration or license',
    requirement: 'Category specific',
    isCategorySpecific: true,
    categoryCondition: 'Grocery / Food Vendors',
  },
  'Dairy & Eggs': {
    id: 'v-fssai-dairy',
    name: 'FSSAI Registration / Licence',
    purpose: 'Applicable FSSAI registration or license',
    requirement: 'Category specific',
    isCategorySpecific: true,
    categoryCondition: 'Grocery / Food Vendors',
  },
  'Fresh Produce': {
    id: 'v-fssai-produce',
    name: 'FSSAI Registration / Licence',
    purpose: 'Applicable FSSAI registration or license',
    requirement: 'Category specific',
    isCategorySpecific: true,
    categoryCondition: 'Grocery / Food Vendors',
  },
  'Beverages & Snacks': {
    id: 'v-fssai-bev',
    name: 'FSSAI Registration / Licence',
    purpose: 'Applicable FSSAI registration or license',
    requirement: 'Category specific',
    isCategorySpecific: true,
    categoryCondition: 'Grocery / Food Vendors',
  },
  Pharmacy: {
    id: 'v-drug-licence',
    name: 'Drug Licence',
    purpose: 'Applicable drug license, only if pharmacy vendors are allowed',
    requirement: 'Category specific',
    isCategorySpecific: true,
    categoryCondition: 'Pharmacy',
  },
  'Other Regulated': {
    id: 'v-biz-licence',
    name: 'Business Licence',
    purpose: 'Relevant business licence, wherever required',
    requirement: 'Category specific',
    isCategorySpecific: true,
    categoryCondition: 'Other Regulated Categories',
  },
};

// Vendor Admin Verification Step
export const VENDOR_VERIFICATION_STEP: VerificationStepDefinition = {
  id: 'v-step-store',
  name: 'Store Verification',
  description: 'Admin confirms the shop at the given address using Shop Photograph and Shop Address Proof.',
  required: true,
};

// 2) RIDER ONBOARDING DOCUMENTS (10 documents)
export const RIDER_BASE_DOCS: BaseDocDefinition[] = [
  {
    id: 'r-photo',
    name: 'Profile Photograph',
    purpose: 'Rider identification',
    requirement: 'Required',
  },
  {
    id: 'r-id',
    name: 'Aadhaar / Other Valid ID',
    purpose: 'Identity verification',
    requirement: 'Required',
  },
  {
    id: 'r-addr',
    name: 'Address Proof',
    purpose: 'Residential verification',
    requirement: 'Required',
  },
  {
    id: 'r-dl',
    name: 'Driving Licence',
    purpose: 'If using a motor vehicle',
    requirement: 'Conditional',
    isConditional: true,
    conditionalVehicleTypes: ['Motorcycle', 'Scooter', 'Electric'],
  },
  {
    id: 'r-rc',
    name: 'Vehicle RC',
    purpose: 'Vehicle verification',
    requirement: 'Conditional',
    isConditional: true,
    conditionalVehicleTypes: ['Motorcycle', 'Scooter', 'Electric'],
  },
  {
    id: 'r-ins',
    name: 'Vehicle Insurance',
    purpose: 'Insurance verification',
    requirement: 'Conditional',
    isConditional: true,
    conditionalVehicleTypes: ['Motorcycle', 'Scooter', 'Electric'],
  },
  {
    id: 'r-puc',
    name: 'PUC Certificate',
    purpose: 'Pollution compliance',
    requirement: 'Conditional',
    isConditional: true,
    conditionalVehicleTypes: ['Motorcycle', 'Scooter', 'Electric'],
  },
  {
    id: 'r-bank',
    name: 'Bank Proof / Passbook',
    purpose: 'Rider payouts',
    requirement: 'Required',
  },
  {
    id: 'r-emergency',
    name: 'Emergency Contact Details',
    purpose: 'Emergency support',
    requirement: 'Required',
    isDataCard: true,
  },
  {
    id: 'r-agreement',
    name: 'Rider Agreement',
    purpose: 'Terms and conditions',
    requirement: 'Required',
  },
];

// Rider Admin Verification Step
export const RIDER_VERIFICATION_STEP: VerificationStepDefinition = {
  id: 'r-step-police',
  name: 'Police Verification',
  description: 'Admin confirms the official police background verification result.',
  required: true,
};

// GST Note constant for display
export const GST_INFO_NOTE =
  'GSTIN is not automatically mandatory for every vendor. Eligible unregistered sellers can use the GST enrolment route, subject to specific conditions.';

// Helper function to build dynamic checklist for a vendor
export const getVendorChecklist = (category?: string) => {
  const list = [...VENDOR_BASE_DOCS];
  if (category && VENDOR_CATEGORY_DOCS[category]) {
    list.push(VENDOR_CATEGORY_DOCS[category]);
  }
  return list;
};

// Helper function to check if a rider document is applicable
export const isRiderDocApplicable = (
  doc: BaseDocDefinition,
  vehicleType: string
): boolean => {
  if (!doc.isConditional) return true;
  return (
    vehicleType === 'Motorcycle' ||
    vehicleType === 'Scooter' ||
    vehicleType === 'Electric'
  );
};
