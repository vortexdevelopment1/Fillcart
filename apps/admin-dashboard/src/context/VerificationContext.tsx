import React, { createContext, useContext, useState, useMemo, useCallback } from 'react';
import {
  Applicant,
  VerificationStatus,
  DocumentStatus,
  createVendorDocuments,
  createRiderDocuments,
} from '../data/verification';
import {
  ManagementVendor,
  ManagementRider,
  initialMockVendors,
  initialMockRiders,
} from '../data/mockManagementData';

export interface AuditLogEntry {
  id: string;
  entityType: 'vendor' | 'rider';
  entityId: string;
  entityName: string;
  action: string;
  reason?: string;
  remarks?: string;
  admin: string;
  timestamp: string;
}

export interface VerificationStats {
  total: number;
  pending: number;
  approved: number;
  rejected: number;
}

interface VerificationContextType {
  // Store lists
  vendors: ManagementVendor[];
  riders: ManagementRider[];
  applicants: Applicant[];
  auditLogs: AuditLogEntry[];
  toastMessage: string | null;
  showToast: (msg: string) => void;

  // Applicant Review Drawer
  selectedApplicant: Applicant | null;
  setSelectedApplicant: (applicant: Applicant | null) => void;
  stats: VerificationStats;

  // Document Verification Actions
  approveDocument: (applicantId: string, docId: string) => void;
  rejectDocument: (applicantId: string, docId: string, reason: string, remarks?: string) => void;
  approveAllDocuments: (applicantId: string) => void;
  approveApplication: (applicantId: string) => boolean;
  rejectApplication: (applicantId: string) => void;
  requestReupload: (applicantId: string) => void;
  updateVehicleType?: (applicantId: string, vehicleType: 'Motorcycle' | 'Scooter' | 'Electric' | 'Bicycle' | 'On foot') => void;
  approveVerificationStep?: (applicantId: string) => void;

  // Administrative Lifecycle Actions
  suspendPerson: (type: 'vendor' | 'rider', id: string, reason: string, remarks?: string) => void;
  reactivatePerson: (type: 'vendor' | 'rider', id: string, note?: string) => void;
  setInactive: (type: 'vendor' | 'rider', id: string, reason?: string) => void;
  setActive: (type: 'vendor' | 'rider', id: string) => boolean;
  addPerson: (type: 'vendor' | 'rider', data: any) => void;
  editPerson: (type: 'vendor' | 'rider', id: string, data: any) => void;
}

const VerificationContext = createContext<VerificationContextType | undefined>(undefined);

// Generate initial applicants from the 24 vendors and 24 riders
const createInitialApplicants = (): Applicant[] => {
  const apps: Applicant[] = [];

  // Vendor applicants
  initialMockVendors.forEach((v) => {
    const isApproved = v.verificationStatus === 'Verified';
    const isRejected = v.verificationStatus === 'Rejected';
    const verStatus: VerificationStatus = isApproved ? 'Approved' : isRejected ? 'Rejected' : 'Pending';

    const rawDocs = createVendorDocuments(v.id, v.businessCategory);
    const docs = rawDocs.map((d, idx) => ({
      ...d,
      status: (isApproved
        ? 'Approved'
        : isRejected && idx === 0
        ? 'Rejected'
        : !isRejected && idx < 2
        ? 'Approved'
        : 'Pending') as DocumentStatus,
      rejectReason: isRejected && idx === 0 ? 'Document verification failed' : undefined,
    }));

    apps.push({
      id: `app-${v.id}`,
      entityId: v.id,
      name: v.storeName,
      initials: v.initials,
      type: 'Vendor',
      businessCategory: v.businessCategory,
      city: v.city,
      phone: v.phone,
      email: v.email,
      submittedAt: v.joinedDate,
      status: verStatus,
      documents: docs,
      timeline: [
        { id: `t1-${v.id}`, text: 'Store onboarding submitted', timestamp: v.joinedDate },
        ...(isApproved
          ? [{ id: `t2-${v.id}`, text: 'All required documents approved', timestamp: '1 day later' }]
          : []),
      ],
    });
  });

  // Rider applicants
  initialMockRiders.forEach((r) => {
    const isApproved = r.verificationStatus === 'Verified';
    const isRejected = r.verificationStatus === 'Rejected';
    const verStatus: VerificationStatus = isApproved ? 'Approved' : isRejected ? 'Rejected' : 'Pending';

    const rawDocs = createRiderDocuments(r.id, r.vehicleType, r.emergencyContact);
    const docs = rawDocs.map((d, idx) => {
      if (d.isNotApplicable) return d;
      return {
        ...d,
        status: (isApproved
          ? 'Approved'
          : isRejected && idx === 3
          ? 'Rejected'
          : !isRejected && idx < 3
          ? 'Approved'
          : 'Pending') as DocumentStatus,
        rejectReason: isRejected && idx === 3 ? 'VAHAN check failed' : undefined,
      };
    });

    apps.push({
      id: `app-${r.id}`,
      entityId: r.id,
      name: r.name,
      initials: r.initials,
      type: 'Rider',
      vehicleType: r.vehicleType,
      vehicleNumber: r.vehicleNumber,
      city: r.city,
      phone: r.phone,
      email: r.email,
      submittedAt: r.joinedDate,
      status: verStatus,
      documents: docs,
      timeline: [
        { id: `t1-${r.id}`, text: 'Rider onboarding submitted', timestamp: r.joinedDate },
        ...(isApproved
          ? [{ id: `t2-${r.id}`, text: 'All onboarding documents verified', timestamp: '1 day later' }]
          : []),
      ],
    });
  });

  return apps;
};

export const VerificationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [vendors, setVendors] = useState<ManagementVendor[]>(initialMockVendors);
  const [riders, setRiders] = useState<ManagementRider[]>(initialMockRiders);
  const [applicants, setApplicants] = useState<Applicant[]>(createInitialApplicants);
  const [auditLogs, setAuditLogs] = useState<AuditLogEntry[]>([]);
  const [selectedApplicant, setSelectedApplicant] = useState<Applicant | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = useCallback((msg: string) => {
    setToastMessage(msg);
    const t = setTimeout(() => {
      setToastMessage((c) => (c === msg ? null : c));
    }, 2400);
    return () => clearTimeout(t);
  }, []);

  // Compute live verification stats
  const stats: VerificationStats = useMemo(() => {
    let pending = 0;
    let approved = 0;
    let rejected = 0;

    applicants.forEach((a) => {
      if (a.status === 'Approved') approved++;
      else if (a.status === 'Rejected' || a.status === 'Reupload') rejected++;
      else pending++;
    });

    return { total: applicants.length, pending, approved, rejected };
  }, [applicants]);

  // Sync entity verification state
  const syncEntityVerification = useCallback(
    (app: Applicant, newStatus: VerificationStatus) => {
      const verStatus =
        newStatus === 'Approved' ? 'Verified' : newStatus === 'Rejected' ? 'Rejected' : 'Pending';

      if (app.type === 'Vendor') {
        setVendors((prev) =>
          prev.map((v) =>
            v.id === app.entityId || v.storeName === app.name
              ? {
                  ...v,
                  verificationStatus: verStatus,
                  activity: [
                    {
                      id: `act-${Date.now()}`,
                      action: `Verification: ${verStatus}`,
                      details: `Application marked as ${verStatus}`,
                      admin: 'Verification Ops',
                      timestamp: 'Just now',
                    },
                    ...v.activity,
                  ],
                }
              : v
          )
        );
      } else {
        setRiders((prev) =>
          prev.map((r) =>
            r.id === app.entityId || r.name === app.name
              ? {
                  ...r,
                  verificationStatus: verStatus,
                  activity: [
                    {
                      id: `act-${Date.now()}`,
                      action: `Verification: ${verStatus}`,
                      details: `Application marked as ${verStatus}`,
                      admin: 'Verification Ops',
                      timestamp: 'Just now',
                    },
                    ...r.activity,
                  ],
                }
              : r
          )
        );
      }
    },
    []
  );

  const areAllRequiredDocumentsApproved = (app: Applicant): boolean => {
    return app.documents.every((doc) => {
      if (doc.isNotApplicable) return true;
      if (doc.requirement === 'Optional') return true;
      return doc.status === 'Approved';
    });
  };

  const approveDocument = (applicantId: string, docId: string) => {
    let docName = 'Document';

    setApplicants((prev) =>
      prev.map((app) => {
        if (app.id !== applicantId) return app;

        const updatedDocs = app.documents.map((doc) => {
          if (doc.id === docId) {
            docName = doc.name;
            return { ...doc, status: 'Approved' as DocumentStatus };
          }
          return doc;
        });

        const allReqApproved = updatedDocs.every((d) => {
          if (d.isNotApplicable) return true;
          if (d.requirement === 'Optional') return true;
          return d.status === 'Approved';
        });

        const newStatus: VerificationStatus = allReqApproved ? 'Approved' : 'Pending';

        const newTimeline = [
          ...app.timeline,
          { id: `tl-${Date.now()}`, text: `${docName} approved`, timestamp: 'Just now' },
        ];

        if (newStatus === 'Approved' && app.status !== 'Approved') {
          newTimeline.push({
            id: `tl-${Date.now()}-app`,
            text: 'Application verified and approved',
            timestamp: 'Just now',
          });
          syncEntityVerification(app, 'Approved');
        }

        const updatedApp = {
          ...app,
          status: newStatus,
          documents: updatedDocs,
          timeline: newTimeline,
        };

        if (selectedApplicant?.id === applicantId) setSelectedApplicant(updatedApp);
        return updatedApp;
      })
    );

    showToast('Document approved');
  };

  const rejectDocument = (
    applicantId: string,
    docId: string,
    reason: string,
    remarks?: string
  ) => {
    let docName = 'Document';

    setApplicants((prev) =>
      prev.map((app) => {
        if (app.id !== applicantId) return app;

        const updatedDocs = app.documents.map((doc) => {
          if (doc.id === docId) {
            docName = doc.name;
            return {
              ...doc,
              status: 'Rejected' as DocumentStatus,
              rejectReason: reason,
              rejectRemarks: remarks,
            };
          }
          return doc;
        });

        const updatedApp = {
          ...app,
          status: 'Rejected' as VerificationStatus,
          documents: updatedDocs,
          timeline: [
            ...app.timeline,
            { id: `tl-${Date.now()}`, text: `${docName} rejected (${reason})`, timestamp: 'Just now' },
          ],
        };

        syncEntityVerification(app, 'Rejected');
        if (selectedApplicant?.id === applicantId) setSelectedApplicant(updatedApp);
        return updatedApp;
      })
    );

    showToast('Document rejected');
  };

  const approveAllDocuments = (applicantId: string) => {
    setApplicants((prev) =>
      prev.map((app) => {
        if (app.id !== applicantId) return app;

        const updatedDocs = app.documents.map((doc) => {
          if (doc.isNotApplicable) return doc;
          return { ...doc, status: 'Approved' as DocumentStatus };
        });

        const updatedApp = {
          ...app,
          status: 'Approved' as VerificationStatus,
          documents: updatedDocs,
          timeline: [
            ...app.timeline,
            { id: `tl-${Date.now()}`, text: 'All applicable documents approved', timestamp: 'Just now' },
          ],
        };

        syncEntityVerification(app, 'Approved');
        if (selectedApplicant?.id === applicantId) setSelectedApplicant(updatedApp);
        return updatedApp;
      })
    );

    showToast('Application approved');
  };

  const approveApplication = (applicantId: string): boolean => {
    const target = applicants.find((a) => a.id === applicantId);
    if (!target) return false;

    if (!areAllRequiredDocumentsApproved(target)) {
      showToast('Approve all required documents first');
      return false;
    }

    setApplicants((prev) =>
      prev.map((app) => {
        if (app.id !== applicantId) return app;
        const updatedApp = {
          ...app,
          status: 'Approved' as VerificationStatus,
          timeline: [
            ...app.timeline,
            { id: `tl-${Date.now()}`, text: 'Application approved by reviewer', timestamp: 'Just now' },
          ],
        };
        syncEntityVerification(app, 'Approved');
        if (selectedApplicant?.id === applicantId) setSelectedApplicant(updatedApp);
        return updatedApp;
      })
    );

    showToast('Application approved');
    return true;
  };

  const rejectApplication = (applicantId: string) => {
    setApplicants((prev) =>
      prev.map((app) => {
        if (app.id !== applicantId) return app;
        const updatedApp = {
          ...app,
          status: 'Rejected' as VerificationStatus,
          timeline: [
            ...app.timeline,
            { id: `tl-${Date.now()}`, text: 'Application rejected by reviewer', timestamp: 'Just now' },
          ],
        };
        syncEntityVerification(app, 'Rejected');
        if (selectedApplicant?.id === applicantId) setSelectedApplicant(updatedApp);
        return updatedApp;
      })
    );

    showToast('Application rejected');
  };

  const requestReupload = (applicantId: string) => {
    setApplicants((prev) =>
      prev.map((app) => {
        if (app.id !== applicantId) return app;
        const updatedApp = {
          ...app,
          status: 'Reupload' as VerificationStatus,
          timeline: [
            ...app.timeline,
            { id: `tl-${Date.now()}`, text: 'Re-upload requested', timestamp: 'Just now' },
          ],
        };
        if (selectedApplicant?.id === applicantId) setSelectedApplicant(updatedApp);
        return updatedApp;
      })
    );

    showToast('Re-upload requested');
  };

  const updateVehicleType = (
    applicantId: string,
    vehicleType: 'Motorcycle' | 'Scooter' | 'Electric' | 'Bicycle' | 'On foot'
  ) => {
    const isMotor =
      vehicleType === 'Motorcycle' || vehicleType === 'Scooter' || vehicleType === 'Electric';
    setApplicants((prev) =>
      prev.map((app) => {
        if (app.id !== applicantId) return app;
        const updatedDocs = app.documents.map((doc) => {
          const isVehicleDoc =
            doc.id.includes('-dl') ||
            doc.id.includes('-rc') ||
            doc.id.includes('-ins') ||
            doc.id.includes('-puc') ||
            doc.name.includes('Licence') ||
            doc.name.includes('RC') ||
            doc.name.includes('Insurance') ||
            doc.name.includes('PUC');
          if (isVehicleDoc) {
            return {
              ...doc,
              isNotApplicable: !isMotor,
              status: (!isMotor ? 'Approved' : 'Pending') as DocumentStatus,
            };
          }
          return doc;
        });

        const updated = {
          ...app,
          vehicleType,
          documents: updatedDocs,
          timeline: [
            ...app.timeline,
            { id: `tl-${Date.now()}`, text: `Vehicle type changed to ${vehicleType}`, timestamp: 'Just now' },
          ],
        };
        if (selectedApplicant?.id === applicantId) setSelectedApplicant(updated);
        return updated;
      })
    );
    showToast(`Updated vehicle type to ${vehicleType}`);
  };

  const approveVerificationStep = (applicantId: string) => {
    setApplicants((prev) =>
      prev.map((app) => {
        if (app.id !== applicantId) return app;
        const stepName = app.type === 'Vendor' ? 'Store Verification' : 'Police Verification';
        const updated = {
          ...app,
          stepApproved: true,
          timeline: [
            ...app.timeline,
            { id: `tl-${Date.now()}`, text: `${stepName} step approved by admin`, timestamp: 'Just now' },
          ],
        };
        if (selectedApplicant?.id === applicantId) setSelectedApplicant(updated);
        return updated;
      })
    );
    showToast('Verification step approved');
  };

  // ──────────── ADMINISTRATIVE LIFECYCLE ACTIONS ────────────
  const suspendPerson = (
    type: 'vendor' | 'rider',
    id: string,
    reason: string,
    remarks?: string
  ) => {
    const dateStr = new Date().toLocaleDateString('en-GB', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });

    let entityName = '';
    if (type === 'vendor') {
      setVendors((prev) =>
        prev.map((v) => {
          if (v.id !== id) return v;
          entityName = v.storeName;
          return {
            ...v,
            status: 'Suspended',
            statusReason: reason,
            statusRemarks: remarks,
            statusDate: dateStr,
            statusAdmin: 'Admin (Current User)',
            activity: [
              {
                id: `act-${Date.now()}`,
                action: 'Suspended',
                details: `Reason: ${reason}${remarks ? ` (${remarks})` : ''}`,
                admin: 'Admin (Current User)',
                timestamp: 'Just now',
              },
              ...v.activity,
            ],
          };
        })
      );
    } else {
      setRiders((prev) =>
        prev.map((r) => {
          if (r.id !== id) return r;
          entityName = r.name;
          return {
            ...r,
            status: 'Suspended',
            availability: 'Offline', // Forced offline
            statusReason: reason,
            statusRemarks: remarks,
            statusDate: dateStr,
            statusAdmin: 'Admin (Current User)',
            activity: [
              {
                id: `act-${Date.now()}`,
                action: 'Suspended',
                details: `Reason: ${reason}${remarks ? ` (${remarks})` : ''}`,
                admin: 'Admin (Current User)',
                timestamp: 'Just now',
              },
              ...r.activity,
            ],
          };
        })
      );
    }

    // Append to audit logs
    setAuditLogs((prev) => [
      {
        id: `aud-${Date.now()}`,
        entityType: type,
        entityId: id,
        entityName,
        action: 'SUSPEND',
        reason,
        remarks,
        admin: 'Admin',
        timestamp: 'Just now',
      },
      ...prev,
    ]);

    showToast(`${type === 'vendor' ? 'Vendor' : 'Rider'} suspended`);
  };

  const reactivatePerson = (type: 'vendor' | 'rider', id: string, note?: string) => {
    const dateStr = new Date().toLocaleDateString('en-GB', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });

    let entityName = '';
    if (type === 'vendor') {
      setVendors((prev) =>
        prev.map((v) => {
          if (v.id !== id) return v;
          entityName = v.storeName;
          const nextStatus = v.verificationStatus === 'Verified' ? 'Active' : 'Inactive';
          return {
            ...v,
            status: nextStatus,
            statusReason: undefined,
            statusRemarks: note,
            statusDate: dateStr,
            statusAdmin: 'Admin (Current User)',
            activity: [
              {
                id: `act-${Date.now()}`,
                action: 'Reactivated',
                details: `Account reactivated to ${nextStatus}${note ? ` · ${note}` : ''}`,
                admin: 'Admin (Current User)',
                timestamp: 'Just now',
              },
              ...v.activity,
            ],
          };
        })
      );
    } else {
      setRiders((prev) =>
        prev.map((r) => {
          if (r.id !== id) return r;
          entityName = r.name;
          const nextStatus = r.verificationStatus === 'Verified' ? 'Active' : 'Inactive';
          return {
            ...r,
            status: nextStatus,
            statusReason: undefined,
            statusRemarks: note,
            statusDate: dateStr,
            statusAdmin: 'Admin (Current User)',
            activity: [
              {
                id: `act-${Date.now()}`,
                action: 'Reactivated',
                details: `Account reactivated to ${nextStatus}${note ? ` · ${note}` : ''}`,
                admin: 'Admin (Current User)',
                timestamp: 'Just now',
              },
              ...r.activity,
            ],
          };
        })
      );
    }

    setAuditLogs((prev) => [
      {
        id: `aud-${Date.now()}`,
        entityType: type,
        entityId: id,
        entityName,
        action: 'REACTIVATE',
        remarks: note,
        admin: 'Admin',
        timestamp: 'Just now',
      },
      ...prev,
    ]);

    showToast(`${type === 'vendor' ? 'Vendor' : 'Rider'} reactivated`);
  };

  const setInactive = (type: 'vendor' | 'rider', id: string, reason?: string) => {
    const dateStr = new Date().toLocaleDateString('en-GB', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });

    let entityName = '';
    if (type === 'vendor') {
      setVendors((prev) =>
        prev.map((v) => {
          if (v.id !== id) return v;
          entityName = v.storeName;
          return {
            ...v,
            status: 'Inactive',
            statusReason: reason || 'Under review',
            statusDate: dateStr,
            statusAdmin: 'Admin',
            activity: [
              {
                id: `act-${Date.now()}`,
                action: 'Set Inactive',
                details: `Reason: ${reason || 'Under review'}`,
                admin: 'Admin',
                timestamp: 'Just now',
              },
              ...v.activity,
            ],
          };
        })
      );
    } else {
      setRiders((prev) =>
        prev.map((r) => {
          if (r.id !== id) return r;
          entityName = r.name;
          return {
            ...r,
            status: 'Inactive',
            availability: 'Offline', // forced offline
            statusReason: reason || 'Under review',
            statusDate: dateStr,
            statusAdmin: 'Admin',
            activity: [
              {
                id: `act-${Date.now()}`,
                action: 'Set Inactive',
                details: `Reason: ${reason || 'Under review'}`,
                admin: 'Admin',
                timestamp: 'Just now',
              },
              ...r.activity,
            ],
          };
        })
      );
    }

    setAuditLogs((prev) => [
      {
        id: `aud-${Date.now()}`,
        entityType: type,
        entityId: id,
        entityName,
        action: 'SET_INACTIVE',
        reason,
        admin: 'Admin',
        timestamp: 'Just now',
      },
      ...prev,
    ]);

    showToast(`${type === 'vendor' ? 'Vendor' : 'Rider'} set inactive`);
  };

  const setActive = (type: 'vendor' | 'rider', id: string): boolean => {
    const target =
      type === 'vendor' ? vendors.find((v) => v.id === id) : riders.find((r) => r.id === id);

    if (!target) return false;
    if (target.verificationStatus !== 'Verified') {
      showToast('Verify documents first');
      return false;
    }

    const dateStr = new Date().toLocaleDateString('en-GB', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });

    let entityName = '';
    if (type === 'vendor') {
      setVendors((prev) =>
        prev.map((v) => {
          if (v.id !== id) return v;
          entityName = v.storeName;
          return {
            ...v,
            status: 'Active',
            statusReason: undefined,
            statusRemarks: undefined,
            statusDate: dateStr,
            statusAdmin: 'Admin',
            activity: [
              {
                id: `act-${Date.now()}`,
                action: 'Set Active',
                details: 'Store activated for customer orders',
                admin: 'Admin',
                timestamp: 'Just now',
              },
              ...v.activity,
            ],
          };
        })
      );
    } else {
      setRiders((prev) =>
        prev.map((r) => {
          if (r.id !== id) return r;
          entityName = r.name;
          return {
            ...r,
            status: 'Active',
            statusReason: undefined,
            statusRemarks: undefined,
            statusDate: dateStr,
            statusAdmin: 'Admin',
            activity: [
              {
                id: `act-${Date.now()}`,
                action: 'Set Active',
                details: 'Delivery partner activated for dispatches',
                admin: 'Admin',
                timestamp: 'Just now',
              },
              ...r.activity,
            ],
          };
        })
      );
    }

    setAuditLogs((prev) => [
      {
        id: `aud-${Date.now()}`,
        entityType: type,
        entityId: id,
        entityName,
        action: 'SET_ACTIVE',
        admin: 'Admin',
        timestamp: 'Just now',
      },
      ...prev,
    ]);

    showToast(`${type === 'vendor' ? 'Vendor' : 'Rider'} set active`);
    return true;
  };

  const addPerson = (type: 'vendor' | 'rider', data: any) => {
    const id = `${type === 'vendor' ? 'ven' : 'rid'}-${Date.now()}`;
    const nameVal = type === 'vendor' ? data.storeName : data.name;
    const initials = nameVal
      .split(' ')
      .map((w: string) => w[0])
      .slice(0, 2)
      .join('')
      .toUpperCase();

    const dateStr = new Date().toLocaleDateString('en-GB', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });

    if (type === 'vendor') {
      const newVendor: ManagementVendor = {
        id,
        storeName: data.storeName,
        ownerName: data.ownerName,
        initials,
        phone: data.phone,
        email: data.email,
        businessCategory: data.businessCategory,
        city: data.city,
        shopAddress: data.shopAddress,
        gstin: data.gstin || undefined,
        licenceNumber: `${data.businessCategory.toUpperCase()}-LIC-${Date.now().toString().slice(-6)}`,
        commissionPct: data.commissionPct || 8,
        joinedDate: dateStr,
        productsCount: 0,
        ordersCount: 0,
        verificationStatus: 'Pending',
        status: 'Inactive', // Starts Inactive per rule 8
        statusReason: 'Under review',
        statusRemarks: 'New onboarding pending document verification',
        statusDate: dateStr,
        statusAdmin: 'System',
        bankDetails: {
          accountMasked: 'HDFC •••• 1001',
          bankName: 'HDFC Bank',
          ifsc: 'HDFC0001234',
        },
        lastPayout: '₹0',
        pendingPayout: '₹0',
        salesLast7Days: [0, 0, 0, 0, 0, 0, 0],
        products: [],
        activity: [
          {
            id: `act-${Date.now()}`,
            action: 'Store Registered',
            details: 'Onboarding completed online',
            admin: 'Self',
            timestamp: 'Just now',
          },
        ],
      };

      setVendors((prev) => [newVendor, ...prev]);

      // Add to Document Verification
      const newApp: Applicant = {
        id: `app-${id}`,
        entityId: id,
        name: data.storeName,
        initials,
        type: 'Vendor',
        businessCategory: data.businessCategory,
        city: data.city,
        phone: data.phone,
        email: data.email,
        submittedAt: dateStr,
        status: 'Pending',
        documents: createVendorDocuments(id, data.businessCategory),
        timeline: [
          { id: `t-${Date.now()}`, text: 'Store onboarded (Pending verification)', timestamp: 'Just now' },
        ],
      };

      setApplicants((prev) => [newApp, ...prev]);
      showToast('Vendor added');
    } else {
      const newRider: ManagementRider = {
        id,
        name: data.name,
        initials,
        phone: data.phone,
        email: data.email,
        city: data.city,
        address: data.address,
        vehicleType: data.vehicleType,
        vehicleNumber: data.vehicleNumber,
        emergencyContact: data.emergencyContact,
        availability: 'Offline',
        joinedDate: dateStr,
        deliveriesCompleted: 0,
        onTimePct: 100,
        rating: 5.0,
        verificationStatus: 'Pending',
        status: 'Inactive', // Starts Inactive
        statusReason: 'Under review',
        statusRemarks: 'New partner pending document verification',
        statusDate: dateStr,
        statusAdmin: 'System',
        bankDetails: {
          accountMasked: 'SBI •••• 9901',
          bankName: 'State Bank of India',
        },
        lastPayout: '₹0',
        pendingPayout: '₹0',
        weeklyEarnings: [0, 0, 0, 0, 0, 0, 0],
        recentDeliveries: [],
        activity: [
          {
            id: `act-${Date.now()}`,
            action: 'Rider Registered',
            details: 'Profile submitted for onboarding',
            admin: 'Self',
            timestamp: 'Just now',
          },
        ],
      };

      setRiders((prev) => [newRider, ...prev]);

      // Add to Document Verification
      const newApp: Applicant = {
        id: `app-${id}`,
        entityId: id,
        name: data.name,
        initials,
        type: 'Rider',
        vehicleType: data.vehicleType,
        vehicleNumber: data.vehicleNumber,
        city: data.city,
        phone: data.phone,
        email: data.email,
        submittedAt: dateStr,
        status: 'Pending',
        documents: createRiderDocuments(id, data.vehicleType, data.emergencyContact),
        timeline: [
          { id: `t-${Date.now()}`, text: 'Rider onboarded (Pending verification)', timestamp: 'Just now' },
        ],
      };

      setApplicants((prev) => [newApp, ...prev]);
      showToast('Rider added');
    }
  };

  const editPerson = (type: 'vendor' | 'rider', id: string, data: any) => {
    if (type === 'vendor') {
      setVendors((prev) =>
        prev.map((v) => {
          if (v.id !== id) return v;
          return {
            ...v,
            storeName: data.storeName,
            ownerName: data.ownerName,
            phone: data.phone,
            email: data.email,
            businessCategory: data.businessCategory,
            city: data.city,
            shopAddress: data.shopAddress,
            gstin: data.gstin || undefined,
            commissionPct: data.commissionPct,
            activity: [
              {
                id: `act-${Date.now()}`,
                action: 'Profile Updated',
                details: 'Store information modified by admin',
                admin: 'Admin',
                timestamp: 'Just now',
              },
              ...v.activity,
            ],
          };
        })
      );
    } else {
      setRiders((prev) =>
        prev.map((r) => {
          if (r.id !== id) return r;
          return {
            ...r,
            name: data.name,
            phone: data.phone,
            email: data.email,
            city: data.city,
            address: data.address,
            vehicleType: data.vehicleType,
            vehicleNumber: data.vehicleNumber,
            emergencyContact: data.emergencyContact,
            activity: [
              {
                id: `act-${Date.now()}`,
                action: 'Profile Updated',
                details: 'Rider information modified by admin',
                admin: 'Admin',
                timestamp: 'Just now',
              },
              ...r.activity,
            ],
          };
        })
      );
    }

    showToast(`${type === 'vendor' ? 'Vendor' : 'Rider'} updated`);
  };

  return (
    <VerificationContext.Provider
      value={{
        vendors,
        riders,
        applicants,
        auditLogs,
        toastMessage,
        showToast,
        selectedApplicant,
        setSelectedApplicant,
        stats,
        approveDocument,
        rejectDocument,
        approveAllDocuments,
        approveApplication,
        rejectApplication,
        requestReupload,
        updateVehicleType,
        approveVerificationStep,
        suspendPerson,
        reactivatePerson,
        setInactive,
        setActive,
        addPerson,
        editPerson,
      }}
    >
      {children}
    </VerificationContext.Provider>
  );
};

export const useVerification = () => {
  const ctx = useContext(VerificationContext);
  if (!ctx) throw new Error('useVerification must be used within VerificationProvider');
  return ctx;
};
