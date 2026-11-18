export type ApplicantType = 'Rider' | 'Vendor';
export type VerificationStatus = 'Pending' | 'Approved' | 'Rejected' | 'Reupload';
export type DocumentStatus = 'Pending' | 'Approved' | 'Rejected';
export type RequirementType = 'Required' | 'Optional' | 'Conditional';

export interface VerificationDocument {
  id: string;
  name: string;
  purpose: string;
  requirement: RequirementType;
  status: DocumentStatus;
  isCategorySpecific?: boolean;
  isNotApplicable?: boolean; // Greyed out for bicycle/on foot riders
  isDataCard?: boolean; // Emergency contact details data card
  dataFields?: {
    name: string;
    relation: string;
    phone: string;
  };
  hint?: string; // e.g. for GST Note
  tag?: string; // e.g. "Signed copy" or "Category specific"
  rejectReason?: string;
  rejectRemarks?: string;
}

export interface VerificationTimelineItem {
  id: string;
  text: string;
  timestamp: string;
}

export interface Applicant {
  id: string;
  entityId?: string; // Links to Vendor or Rider ID
  name: string;
  initials: string;
  type: ApplicantType;
  businessCategory?: string; // For vendors: 'Grocery', 'Dairy', 'Pharmacy', 'Bakery', etc.
  vehicleType?: 'Motorcycle' | 'Scooter' | 'Electric' | 'Bicycle' | 'On foot'; // For riders
  vehicleNumber?: string;
  city: string;
  phone: string;
  email: string;
  submittedAt: string;
  status: VerificationStatus;
  stepApproved?: boolean;
  documents: VerificationDocument[];
  timeline: VerificationTimelineItem[];
}

// Helper to generate full vendor documents checklist
export const createVendorDocuments = (
  applicantId: string,
  businessCategory: string = 'Grocery'
): VerificationDocument[] => {
  const docs: VerificationDocument[] = [
    {
      id: `${applicantId}-pan`,
      name: "Owner's PAN Card",
      purpose: 'Owner / business verification',
      requirement: 'Required',
      status: 'Pending',
    },
    {
      id: `${applicantId}-id`,
      name: 'Identity Proof',
      purpose: 'Owner KYC',
      requirement: 'Required',
      status: 'Pending',
    },
    {
      id: `${applicantId}-addr`,
      name: 'Address Proof',
      purpose: 'Owner verification',
      requirement: 'Required',
      status: 'Pending',
    },
    {
      id: `${applicantId}-shop-addr`,
      name: 'Shop Address Proof',
      purpose: 'Store location verification',
      requirement: 'Required',
      status: 'Pending',
    },
    {
      id: `${applicantId}-shop-photo`,
      name: 'Shop Photograph',
      purpose: 'Store verification',
      requirement: 'Required',
      status: 'Pending',
    },
    {
      id: `${applicantId}-gst`,
      name: 'GST Certificate (GSTIN)',
      purpose: 'If registered',
      requirement: 'Optional',
      status: 'Pending',
      hint: 'GSTIN is not mandatory for every vendor; eligible unregistered sellers may use the GST enrolment route',
    },
    {
      id: `${applicantId}-bank`,
      name: 'Bank Proof / Cancelled Cheque',
      purpose: 'Vendor payments',
      requirement: 'Required',
      status: 'Pending',
    },
    {
      id: `${applicantId}-agreement`,
      name: 'Vendor Agreement',
      purpose: 'Commission, payout and terms',
      requirement: 'Required',
      status: 'Pending',
      tag: 'Signed copy',
    },
  ];

  // Category-wise additional documents
  const lowerCat = businessCategory.toLowerCase();
  if (lowerCat.includes('grocery') || lowerCat.includes('food') || lowerCat.includes('dairy') || lowerCat.includes('sweet')) {
    docs.push({
      id: `${applicantId}-fssai`,
      name: 'FSSAI Registration / Licence',
      purpose: 'Food safety & standards compliance',
      requirement: 'Required',
      status: 'Pending',
      isCategorySpecific: true,
      tag: 'Category specific',
    });
  } else if (lowerCat.includes('pharmacy') || lowerCat.includes('chemist') || lowerCat.includes('drug')) {
    docs.push({
      id: `${applicantId}-drug`,
      name: 'Drug Licence',
      purpose: 'Pharmacy merchant compliance',
      requirement: 'Required',
      status: 'Pending',
      isCategorySpecific: true,
      tag: 'Category specific',
    });
  } else {
    docs.push({
      id: `${applicantId}-biz-lic`,
      name: 'Business Licence',
      purpose: 'Trade & municipality compliance',
      requirement: 'Required',
      status: 'Pending',
      isCategorySpecific: true,
      tag: 'Category specific',
    });
  }

  return docs;
};

// Helper to generate full rider documents checklist
export const createRiderDocuments = (
  applicantId: string,
  vehicleType: 'Motorcycle' | 'Scooter' | 'Electric' | 'Bicycle' | 'On foot' = 'Motorcycle',
  emergencyContact = { name: 'Kavita Verma', relation: 'Spouse', phone: '9876543210' }
): VerificationDocument[] => {
  const isMotorVehicle = vehicleType === 'Motorcycle' || vehicleType === 'Scooter' || vehicleType === 'Electric';

  return [
    {
      id: `${applicantId}-photo`,
      name: 'Profile Photograph',
      purpose: 'Rider identification',
      requirement: 'Required',
      status: 'Pending',
    },
    {
      id: `${applicantId}-aadhaar`,
      name: 'Aadhaar / Other Valid ID',
      purpose: 'Identity verification',
      requirement: 'Required',
      status: 'Pending',
    },
    {
      id: `${applicantId}-addr`,
      name: 'Address Proof',
      purpose: 'Residential verification',
      requirement: 'Required',
      status: 'Pending',
    },
    {
      id: `${applicantId}-dl`,
      name: 'Driving Licence',
      purpose: 'If using a motor vehicle',
      requirement: 'Conditional',
      status: isMotorVehicle ? 'Pending' : 'Approved',
      isNotApplicable: !isMotorVehicle,
    },
    {
      id: `${applicantId}-rc`,
      name: 'Vehicle RC',
      purpose: 'Vehicle verification',
      requirement: 'Conditional',
      status: isMotorVehicle ? 'Pending' : 'Approved',
      isNotApplicable: !isMotorVehicle,
    },
    {
      id: `${applicantId}-ins`,
      name: 'Vehicle Insurance',
      purpose: 'Insurance verification',
      requirement: 'Conditional',
      status: isMotorVehicle ? 'Pending' : 'Approved',
      isNotApplicable: !isMotorVehicle,
    },
    {
      id: `${applicantId}-puc`,
      name: 'PUC Certificate',
      purpose: 'Pollution compliance',
      requirement: 'Conditional',
      status: isMotorVehicle ? 'Pending' : 'Approved',
      isNotApplicable: !isMotorVehicle,
    },
    {
      id: `${applicantId}-bank`,
      name: 'Bank Proof / Passbook',
      purpose: 'Rider payouts',
      requirement: 'Required',
      status: 'Pending',
    },
    {
      id: `${applicantId}-emergency`,
      name: 'Emergency Contact Details',
      purpose: 'Emergency support',
      requirement: 'Required',
      status: 'Pending',
      isDataCard: true,
      dataFields: emergencyContact,
    },
    {
      id: `${applicantId}-agreement`,
      name: 'Rider Agreement',
      purpose: 'Terms and conditions',
      requirement: 'Required',
      status: 'Pending',
    },
  ];
};

// 6 Vendors + 6 Riders initial mock applicants
export const initialApplicants: Applicant[] = [
  // ─── VENDORS ───
  {
    id: 'app-v1',
    entityId: 'ven-1',
    name: 'Fresh Mart Hub',
    initials: 'FM',
    type: 'Vendor',
    businessCategory: 'Grocery',
    city: 'Delhi',
    phone: '9876541201',
    email: 'contact@freshmarthub.in',
    submittedAt: '15 Nov 2026',
    status: 'Approved',
    documents: createVendorDocuments('app-v1', 'Grocery').map((d) => ({
      ...d,
      status: 'Approved',
    })),
    timeline: [
      { id: 't-v1-1', text: 'Application submitted online', timestamp: '15 Nov 2026, 09:30 AM' },
      { id: 't-v1-2', text: 'All required documents verified and approved', timestamp: '15 Nov 2026, 02:45 PM' },
    ],
  },
  {
    id: 'app-v2',
    entityId: 'ven-2',
    name: 'Royal Kirana',
    initials: 'RK',
    type: 'Vendor',
    businessCategory: 'Grocery',
    city: 'Indore',
    phone: '9826012345',
    email: 'orders@royalkirana.com',
    submittedAt: '16 Nov 2026',
    status: 'Pending',
    documents: createVendorDocuments('app-v2', 'Grocery').map((d, idx) => ({
      ...d,
      status: idx < 5 ? 'Approved' : 'Pending',
    })),
    timeline: [
      { id: 't-v2-1', text: 'Application submitted', timestamp: '16 Nov 2026, 11:20 AM' },
      { id: 't-v2-2', text: 'PAN and Identity proofs verified', timestamp: '16 Nov 2026, 04:15 PM' },
    ],
  },
  {
    id: 'app-v3',
    entityId: 'ven-3',
    name: 'Sharma Dairy & Sweets',
    initials: 'SD',
    type: 'Vendor',
    businessCategory: 'Dairy',
    city: 'Jabalpur',
    phone: '9425098765',
    email: 'sharmadairy@gmail.com',
    submittedAt: '16 Nov 2026',
    status: 'Pending',
    documents: createVendorDocuments('app-v3', 'Dairy').map((d, idx) => ({
      ...d,
      status: idx < 3 ? 'Approved' : 'Pending',
    })),
    timeline: [
      { id: 't-v3-1', text: 'Onboarding packet submitted', timestamp: '16 Nov 2026, 01:10 PM' },
    ],
  },
  {
    id: 'app-v4',
    entityId: 'ven-4',
    name: 'Apollo Care Chemist',
    initials: 'AC',
    type: 'Vendor',
    businessCategory: 'Pharmacy',
    city: 'Bhopal',
    phone: '9755011223',
    email: 'apollocare.mp@gmail.com',
    submittedAt: '14 Nov 2026',
    status: 'Pending',
    documents: createVendorDocuments('app-v4', 'Pharmacy').map((d, idx) => ({
      ...d,
      status: idx < 4 ? 'Approved' : 'Pending',
    })),
    timeline: [
      { id: 't-v4-1', text: 'Drug licence and owner KYC submitted', timestamp: '14 Nov 2026, 03:00 PM' },
    ],
  },
  {
    id: 'app-v5',
    entityId: 'ven-5',
    name: 'Bake Delights Bakery',
    initials: 'BD',
    type: 'Vendor',
    businessCategory: 'Bakery',
    city: 'Indore',
    phone: '9893044556',
    email: 'hello@bakedelights.co.in',
    submittedAt: '17 Nov 2026',
    status: 'Pending',
    documents: createVendorDocuments('app-v5', 'Bakery'),
    timeline: [
      { id: 't-v5-1', text: 'New merchant application registered', timestamp: '17 Nov 2026, 10:15 AM' },
    ],
  },
  {
    id: 'app-v6',
    entityId: 'ven-6',
    name: 'Organic Greens Farm',
    initials: 'OG',
    type: 'Vendor',
    businessCategory: 'Fresh Produce',
    city: 'Gwalior',
    phone: '9926077889',
    email: 'supply@organicgreens.in',
    submittedAt: '13 Nov 2026',
    status: 'Approved',
    documents: createVendorDocuments('app-v6', 'Fresh Produce').map((d) => ({
      ...d,
      status: 'Approved',
    })),
    timeline: [
      { id: 't-v6-1', text: 'Application approved and merchant live', timestamp: '13 Nov 2026, 05:00 PM' },
    ],
  },

  // ─── RIDERS ───
  {
    id: 'app-r1',
    entityId: 'rid-1',
    name: 'Rahul Verma',
    initials: 'RV',
    type: 'Rider',
    vehicleType: 'Motorcycle',
    vehicleNumber: 'MP09 AB 1234',
    city: 'Indore',
    phone: '9876501234',
    email: 'rahul.verma@example.com',
    submittedAt: '16 Nov 2026',
    status: 'Pending',
    documents: createRiderDocuments('app-r1', 'Motorcycle', {
      name: 'Kavita Verma',
      relation: 'Spouse',
      phone: '9876543210',
    }).map((d, idx) => ({
      ...d,
      status: idx < 6 ? 'Approved' : 'Pending',
    })),
    timeline: [
      { id: 't-r1-1', text: 'Rider profile registered with Motorcycle', timestamp: '16 Nov 2026, 10:00 AM' },
      { id: 't-r1-2', text: 'Driving Licence & RC verified', timestamp: '16 Nov 2026, 01:30 PM' },
    ],
  },
  {
    id: 'app-r2',
    entityId: 'rid-2',
    name: 'Imran Khan',
    initials: 'IK',
    type: 'Rider',
    vehicleType: 'Scooter',
    vehicleNumber: 'MP09 CD 5678',
    city: 'Indore',
    phone: '9988776655',
    email: 'imran.khan@example.com',
    submittedAt: '14 Nov 2026',
    status: 'Approved',
    documents: createRiderDocuments('app-r2', 'Scooter', {
      name: 'Parveen Khan',
      relation: 'Mother',
      phone: '9826011223',
    }).map((d) => ({
      ...d,
      status: 'Approved',
    })),
    timeline: [
      { id: 't-r2-1', text: 'All rider documents approved', timestamp: '14 Nov 2026, 04:00 PM' },
    ],
  },
  {
    id: 'app-r3',
    entityId: 'rid-3',
    name: 'Amit Sharma',
    initials: 'AS',
    type: 'Rider',
    vehicleType: 'Electric',
    vehicleNumber: 'DL01 EF 9012',
    city: 'Delhi',
    phone: '9811223344',
    email: 'amit.sharma99@gmail.com',
    submittedAt: '15 Nov 2026',
    status: 'Pending',
    documents: createRiderDocuments('app-r3', 'Electric', {
      name: 'Ramesh Sharma',
      relation: 'Father',
      phone: '9811223300',
    }).map((d, idx) => ({
      ...d,
      status: idx < 4 ? 'Approved' : 'Pending',
    })),
    timeline: [
      { id: 't-r3-1', text: 'EV registration packet submitted', timestamp: '15 Nov 2026, 11:45 AM' },
    ],
  },
  {
    id: 'app-r4',
    entityId: 'rid-4',
    name: 'Sandeep Patel',
    initials: 'SP',
    type: 'Rider',
    vehicleType: 'Bicycle',
    vehicleNumber: '-',
    city: 'Bhopal',
    phone: '9713055667',
    email: 'sandeep.patel@yahoo.com',
    submittedAt: '16 Nov 2026',
    status: 'Pending',
    // Bicycle rider: items 4-7 are Conditional and marked isNotApplicable!
    documents: createRiderDocuments('app-r4', 'Bicycle', {
      name: 'Pooja Patel',
      relation: 'Sister',
      phone: '9713055600',
    }),
    timeline: [
      { id: 't-r4-1', text: 'Bicycle delivery partner registered', timestamp: '16 Nov 2026, 02:15 PM' },
    ],
  },
  {
    id: 'app-r5',
    entityId: 'rid-5',
    name: 'Deepak Joshi',
    initials: 'DJ',
    type: 'Rider',
    vehicleType: 'Motorcycle',
    vehicleNumber: 'MP04 GH 3456',
    city: 'Bhopal',
    phone: '9926011445',
    email: 'deepak.joshi@gmail.com',
    submittedAt: '12 Nov 2026',
    status: 'Approved',
    documents: createRiderDocuments('app-r5', 'Motorcycle', {
      name: 'Sunita Joshi',
      relation: 'Mother',
      phone: '9926011400',
    }).map((d) => ({
      ...d,
      status: 'Approved',
    })),
    timeline: [
      { id: 't-r5-1', text: 'Rider onboarding verified', timestamp: '12 Nov 2026, 06:30 PM' },
    ],
  },
  {
    id: 'app-r6',
    entityId: 'rid-6',
    name: 'Sunita Rao',
    initials: 'SR',
    type: 'Rider',
    vehicleType: 'Bicycle',
    vehicleNumber: '-',
    city: 'Indore',
    phone: '9827033445',
    email: 'sunita.rao@gmail.com',
    submittedAt: '17 Nov 2026',
    status: 'Pending',
    documents: createRiderDocuments('app-r6', 'Bicycle', {
      name: 'Anand Rao',
      relation: 'Brother',
      phone: '9827033400',
    }),
    timeline: [
      { id: 't-r6-1', text: 'Bicycle partner documents awaiting review', timestamp: '17 Nov 2026, 09:00 AM' },
    ],
  },
];
