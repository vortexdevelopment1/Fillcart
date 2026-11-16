export type ApplicantType = 'Rider' | 'Vendor';

export type VerificationStatus = 'Pending' | 'Approved' | 'Rejected' | 'Under Review';

export type DocumentStatus = 'Pending' | 'Approved' | 'Rejected';

export interface VerificationDocument {
  id: string;
  name: string;
  type: string;
  documentNumber?: string;
  status: DocumentStatus;
  uploadedAt: string;
  previewUrl: string;
  rejectReason?: string;
  rejectRemarks?: string;
}

export interface VerificationTimelineItem {
  id: string;
  title: string;
  timestamp: string;
  description: string;
  status: 'completed' | 'current' | 'pending';
}

export interface Applicant {
  id: string;
  name: string;
  avatar: string;
  type: ApplicantType;
  email: string;
  phone: string;
  city: string;
  state: string;
  submittedAt: string;
  documentsCount: number;
  status: VerificationStatus;
  documents: VerificationDocument[];
  timeline: VerificationTimelineItem[];
  vehicleDetails?: {
    model: string;
    plateNumber: string;
    type: string;
  };
  businessDetails?: {
    storeName: string;
    category: string;
    address: string;
  };
}

export interface ToastMessage {
  id: string;
  type: 'success' | 'error' | 'info';
  title: string;
  message: string;
}

export interface TopContactOrder {
  id: string;
  name: string;
  email: string;
  share: number;
  orders: number;
  color: string;
}

export interface AuditLogItem {
  id: string;
  adminName: string;
  adminAvatar: string;
  action: string;
  target: string;
  timeAgo: string;
  badgeType: 'approval' | 'update' | 'security';
}
