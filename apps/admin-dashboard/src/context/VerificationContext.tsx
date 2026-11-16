import React, { createContext, useContext, useState, useMemo } from 'react';
import { Applicant, VerificationStatus, DocumentStatus } from '../types';
import { mockApplicants } from '../data/mockVerificationData';
import { useToast } from './ToastContext';

interface VerificationStats {
  total: number;
  pending: number;
  approved: number;
  rejected: number;
}

interface VerificationContextType {
  applicants: Applicant[];
  selectedApplicant: Applicant | null;
  setSelectedApplicant: (applicant: Applicant | null) => void;
  stats: VerificationStats;
  approveDocument: (applicantId: string, docId: string) => void;
  rejectDocument: (applicantId: string, docId: string, reason: string, remarks?: string) => void;
  approveAllDocuments: (applicantId: string) => void;
  rejectApplication: (applicantId: string, reason: string, remarks?: string) => void;
  requestReupload: (applicantId: string, remarks: string) => void;
}

const VerificationContext = createContext<VerificationContextType | undefined>(undefined);

export const VerificationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [applicants, setApplicants] = useState<Applicant[]>(mockApplicants);
  const [selectedApplicant, setSelectedApplicant] = useState<Applicant | null>(null);
  const { addToast } = useToast();

  // Summary stats
  const stats = useMemo(() => {
    let pending = 0;
    let approved = 0;
    let rejected = 0;

    applicants.forEach((app) => {
      if (app.status === 'Approved') approved++;
      else if (app.status === 'Rejected') rejected++;
      else pending++; // 'Pending' or 'Under Review'
    });

    return {
      total: applicants.length,
      pending,
      approved,
      rejected,
    };
  }, [applicants]);

  const approveDocument = (applicantId: string, docId: string) => {
    setApplicants((prev) =>
      prev.map((app) => {
        if (app.id !== applicantId) return app;

        const updatedDocs = app.documents.map((doc) =>
          doc.id === docId ? { ...doc, status: 'Approved' as DocumentStatus } : doc
        );

        // Check if all are approved
        const allApproved = updatedDocs.every((d) => d.status === 'Approved');
        const anyRejected = updatedDocs.some((d) => d.status === 'Rejected');
        const newStatus: VerificationStatus = allApproved
          ? 'Approved'
          : anyRejected
          ? 'Rejected'
          : 'Under Review';

        const updatedApp = {
          ...app,
          status: newStatus,
          documents: updatedDocs,
        };

        if (selectedApplicant?.id === applicantId) {
          setSelectedApplicant(updatedApp);
        }

        return updatedApp;
      })
    );

    addToast('success', 'Document Approved', 'The verification document was approved.');
  };

  const rejectDocument = (
    applicantId: string,
    docId: string,
    reason: string,
    remarks?: string
  ) => {
    setApplicants((prev) =>
      prev.map((app) => {
        if (app.id !== applicantId) return app;

        const updatedDocs = app.documents.map((doc) =>
          doc.id === docId
            ? {
                ...doc,
                status: 'Rejected' as DocumentStatus,
                rejectReason: reason,
                rejectRemarks: remarks,
              }
            : doc
        );

        const updatedApp = {
          ...app,
          status: 'Under Review' as VerificationStatus,
          documents: updatedDocs,
        };

        if (selectedApplicant?.id === applicantId) {
          setSelectedApplicant(updatedApp);
        }

        return updatedApp;
      })
    );

    addToast('error', 'Document Rejected', `Document marked as rejected: ${reason}`);
  };

  const approveAllDocuments = (applicantId: string) => {
    setApplicants((prev) =>
      prev.map((app) => {
        if (app.id !== applicantId) return app;

        const updatedDocs = app.documents.map((doc) => ({
          ...doc,
          status: 'Approved' as DocumentStatus,
        }));

        const now = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        const updatedApp = {
          ...app,
          status: 'Approved' as VerificationStatus,
          documents: updatedDocs,
          timeline: [
            ...app.timeline,
            {
              id: `t-${Date.now()}`,
              title: 'Application Approved',
              timestamp: `Today, ${now}`,
              description: 'All submitted verification documents verified and approved.',
              status: 'completed' as const,
            },
          ],
        };

        if (selectedApplicant?.id === applicantId) {
          setSelectedApplicant(updatedApp);
        }

        return updatedApp;
      })
    );

    addToast('success', 'Application Approved', 'All documents approved. Partner is now verified!');
  };

  const rejectApplication = (applicantId: string, reason: string, remarks?: string) => {
    setApplicants((prev) =>
      prev.map((app) => {
        if (app.id !== applicantId) return app;

        const now = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        const updatedApp = {
          ...app,
          status: 'Rejected' as VerificationStatus,
          timeline: [
            ...app.timeline,
            {
              id: `t-${Date.now()}`,
              title: 'Application Rejected',
              timestamp: `Today, ${now}`,
              description: `Reason: ${reason}${remarks ? ` - ${remarks}` : ''}`,
              status: 'completed' as const,
            },
          ],
        };

        if (selectedApplicant?.id === applicantId) {
          setSelectedApplicant(updatedApp);
        }

        return updatedApp;
      })
    );

    addToast('error', 'Application Rejected', 'Partner application has been rejected.');
  };

  const requestReupload = (applicantId: string, remarks: string) => {
    setApplicants((prev) =>
      prev.map((app) => {
        if (app.id !== applicantId) return app;

        const now = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        const updatedApp = {
          ...app,
          status: 'Under Review' as VerificationStatus,
          timeline: [
            ...app.timeline,
            {
              id: `t-${Date.now()}`,
              title: 'Re-upload Requested',
              timestamp: `Today, ${now}`,
              description: `Notification sent to user: ${remarks}`,
              status: 'completed' as const,
            },
          ],
        };

        if (selectedApplicant?.id === applicantId) {
          setSelectedApplicant(updatedApp);
        }

        return updatedApp;
      })
    );

    addToast('info', 'Re-upload Requested', 'Notification dispatched to partner mobile app.');
  };

  return (
    <VerificationContext.Provider
      value={{
        applicants,
        selectedApplicant,
        setSelectedApplicant,
        stats,
        approveDocument,
        rejectDocument,
        approveAllDocuments,
        rejectApplication,
        requestReupload,
      }}
    >
      {children}
    </VerificationContext.Provider>
  );
};

export const useVerification = () => {
  const context = useContext(VerificationContext);
  if (!context) {
    throw new Error('useVerification must be used within a VerificationProvider');
  }
  return context;
};
