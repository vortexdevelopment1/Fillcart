import React, { useState, useMemo, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { useVerification } from '../context/VerificationContext';
import { VerificationStatus } from '../data/verification';
import { SummaryPieCard } from '../components/verification/SummaryPieCard';
import { VerificationToolbar } from '../components/verification/VerificationToolbar';
import { ApplicantRow } from '../components/verification/ApplicantRow';
import { ReviewDrawer } from '../components/verification/ReviewDrawer';
import { Toast } from '../components/verification/Toast';
import { ArrowLeft } from 'lucide-react';

export const DocumentVerificationPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const {
    applicants,
    stats,
    selectedApplicant,
    setSelectedApplicant,
    toastMessage,
    approveDocument,
    rejectDocument,
    approveAllDocuments,
    approveApplication,
    rejectApplication,
    requestReupload,
    updateVehicleType,
    approveVerificationStep,
  } = useVerification();

  // Tab filter: All | Riders | Vendors
  const [activeTab, setActiveTab] = useState<'All' | 'Riders' | 'Vendors'>('All');

  // Search filter: name or city
  const [searchQuery, setSearchQuery] = useState('');

  // Status filter: All | Pending | Approved | Rejected | Reupload
  const [statusFilter, setStatusFilter] = useState<'All' | VerificationStatus>('All');

  const typeParam = searchParams.get('type') || searchParams.get('tab');
  const targetId = searchParams.get('id') || searchParams.get('openAppId');

  // Back link metadata
  const backRoute = typeParam?.toLowerCase().startsWith('rider')
    ? { path: '/riders', label: 'Back to Riders' }
    : typeParam?.toLowerCase().startsWith('vendor')
    ? { path: '/vendors', label: 'Back to Vendors' }
    : null;

  // Sync tab and open target from URL parameters
  useEffect(() => {
    if (typeParam) {
      if (typeParam.toLowerCase().startsWith('vendor')) {
        setActiveTab('Vendors');
      } else if (typeParam.toLowerCase().startsWith('rider')) {
        setActiveTab('Riders');
      }
    }

    if (targetId) {
      const match = applicants.find(
        (a) => a.id === targetId || a.entityId === targetId || a.id === `app-${targetId}`
      );
      if (match) {
        setSelectedApplicant(match);
      }
    }
  }, [typeParam, targetId, applicants, setSelectedApplicant]);

  // Filtered applicants based on tab + search + status
  const filteredApplicants = useMemo(() => {
    return applicants.filter((applicant) => {
      // 1. Tab filter
      if (activeTab === 'Riders' && applicant.type !== 'Rider') return false;
      if (activeTab === 'Vendors' && applicant.type !== 'Vendor') return false;

      // 2. Status filter
      if (statusFilter !== 'All' && applicant.status !== statusFilter) return false;

      // 3. Search query filter (name or city)
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase().trim();
        const matchesName = applicant.name.toLowerCase().includes(query);
        const matchesCity = applicant.city.toLowerCase().includes(query);
        if (!matchesName && !matchesCity) return false;
      }

      return true;
    });
  }, [applicants, activeTab, statusFilter, searchQuery]);

  return (
    <div className="w-full flex flex-col gap-4 pb-12">
      {/* Back Link if opened via deep link */}
      {backRoute && (
        <div className="flex items-center">
          <Link
            to={backRoute.path}
            className="inline-flex items-center gap-1.5 text-xs font-sans font-medium text-ink hover:opacity-75 transition-opacity px-3 py-1.5 rounded-full bg-white border border-primary/15 shadow-2xs"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            {backRoute.label}
          </Link>
        </div>
      )}

      {/* A) SUMMARY CARD (single combined card, compact) */}
      <SummaryPieCard
        total={stats.total}
        pending={stats.pending}
        approved={stats.approved}
        rejected={stats.rejected}
      />

      {/* B) TOOLBAR: Tabs [All | Riders | Vendors] + Search + Status Select */}
      <VerificationToolbar
        activeTab={activeTab}
        onTabChange={setActiveTab}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        statusFilter={statusFilter}
        onStatusChange={setStatusFilter}
      />

      {/* C) APPLICANT LIST = CARD ROWS */}
      <div className="flex flex-col gap-2.5 w-full">
        {filteredApplicants.length > 0 ? (
          filteredApplicants.map((applicant) => (
            <ApplicantRow
              key={applicant.id}
              applicant={applicant}
              onReview={(app) => setSelectedApplicant(app)}
            />
          ))
        ) : (
          <div className="w-full py-16 text-center text-ink/55 text-[13px] font-sans bg-white rounded-[20px] border border-black/[0.06]">
            No applications match these filters.
          </div>
        )}
      </div>

      {/* Review Drawer / Modal */}
      <ReviewDrawer
        isOpen={Boolean(selectedApplicant)}
        applicant={selectedApplicant}
        onClose={() => setSelectedApplicant(null)}
        onApproveDoc={approveDocument}
        onRejectDoc={rejectDocument}
        onApproveAll={approveAllDocuments}
        onRequestReupload={requestReupload}
        onRejectApplication={rejectApplication}
        onApproveApplication={approveApplication}
        onApproveStep={approveVerificationStep}
        onUpdateVehicleType={updateVehicleType}
      />

      {/* Black Toast Notification (2.2s duration) */}
      <Toast message={toastMessage} />
    </div>
  );
};
