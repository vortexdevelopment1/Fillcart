import React, { useState, useMemo, useEffect, useRef } from 'react';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import { useVerification } from '../context/VerificationContext';
import { createRiderDocuments, VerificationDocument } from '../data/verification';
import { PersonFormModal } from '../components/management/PersonFormModal';
import { ConfirmActionModal, ActionType } from '../components/management/ConfirmActionModal';
import { Lightbox } from '../components/verification/Lightbox';
import {
  ArrowLeft,
  ExternalLink,
  Edit2,
  Eye,
  Bike,
  Phone,
  Mail,
  MapPin,
  Calendar,
  FileText,
  CreditCard,
  Star,
  Clock,
  Shield,
  UserCheck,
  CheckCircle2,
  TrendingUp,
} from 'lucide-react';

const VALID_TABS = ['overview', 'documents', 'deliveries', 'payouts', 'activity'] as const;
type TabType = typeof VALID_TABS[number];

export const RiderDetailPage: React.FC = () => {
  const { riderId } = useParams<{ riderId: string }>();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const tabListRef = useRef<HTMLDivElement>(null);
  const activeTabRef = useRef<HTMLButtonElement>(null);

  const {
    riders,
    applicants,
    suspendPerson,
    reactivatePerson,
    setInactive,
    setActive,
    editPerson,
    showToast,
  } = useVerification();

  // Find rider from state
  const rider = useMemo(() => {
    return riders.find((r) => r.id === riderId);
  }, [riders, riderId]);

  // Tab State via URL query parameter ?tab=...
  const tabParam = (searchParams.get('tab') || 'overview').toLowerCase();
  const activeTab: TabType = VALID_TABS.includes(tabParam as TabType) ? (tabParam as TabType) : 'overview';

  const handleTabChange = (newTab: TabType) => {
    setSearchParams({ tab: newTab });
  };

  // Auto-scroll active tab into view on mobile
  useEffect(() => {
    if (activeTabRef.current) {
      activeTabRef.current.scrollIntoView({
        behavior: 'smooth',
        block: 'nearest',
        inline: 'center',
      });
    }
  }, [activeTab]);

  // Modals state
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [confirmAction, setConfirmAction] = useState<ActionType | null>(null);
  const [lightboxDoc, setLightboxDoc] = useState<string | null>(null);

  // Applicant documents
  const applicantDocs = useMemo(() => {
    if (!rider) return [];
    const match = applicants.find(
      (a) => a.entityId === rider.id || a.name === rider.name
    );
    return match?.documents && match.documents.length > 0
      ? match.documents
      : createRiderDocuments(rider.id, rider.vehicleType, rider.emergencyContact);
  }, [applicants, rider]);

  const applicableDocs = useMemo(
    () => applicantDocs.filter((d) => !d.isNotApplicable),
    [applicantDocs]
  );
  const approvedDocsCount = useMemo(
    () => applicableDocs.filter((d) => d.status === 'Approved').length,
    [applicableDocs]
  );
  const progressPercent = Math.round(
    (approvedDocsCount / (applicableDocs.length || 1)) * 100
  );

  // Weekly earnings chart calculations
  const chartData = rider?.weeklyEarnings || [450, 620, 580, 710, 920, 840, 690];
  const maxVal = Math.max(...chartData, 1);
  const daysOfWeek = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

  // Handle action confirmation
  const handleConfirmAction = (reason?: string, remarks?: string) => {
    if (!rider || !confirmAction) return;

    if (confirmAction === 'suspend') {
      suspendPerson('rider', rider.id, reason || 'Policy violation', remarks);
    } else if (confirmAction === 'reactivate') {
      reactivatePerson('rider', rider.id, remarks);
    } else if (confirmAction === 'set_inactive') {
      setInactive('rider', rider.id, reason);
    } else if (confirmAction === 'set_active') {
      setActive('rider', rider.id);
    }

    setConfirmAction(null);
  };

  // Back navigation preserving history
  const handleBack = () => {
    if (window.history.length > 1) {
      navigate(-1);
    } else {
      navigate('/riders');
    }
  };

  // If rider is not found, render clean Not Found state
  if (!rider) {
    return (
      <div className="w-full flex flex-col items-center justify-center py-20 px-4 text-center">
        <div className="w-16 h-16 rounded-[20px] bg-neutral text-primary flex items-center justify-center mb-4">
          <Bike className="w-8 h-8" />
        </div>
        <h2 className="font-heading text-2xl text-ink font-normal mb-2">Rider Not Found</h2>
        <p className="font-sans text-xs text-ink/60 max-w-md mb-6">
          The delivery partner with ID <span className="font-semibold text-ink">{riderId}</span> could not be found or may have been removed.
        </p>
        <button
          type="button"
          onClick={() => navigate('/riders')}
          className="min-h-[40px] px-5 rounded-full bg-primary text-white text-xs font-sans font-medium flex items-center gap-2 hover:opacity-90 transition-all shadow-xs"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Riders
        </button>
      </div>
    );
  }

  const isVerified = rider.verificationStatus === 'Verified';

  // Badges styling
  const verBadgeClass = {
    Verified: 'bg-primary text-white border-transparent',
    Pending: 'bg-secondary/18 text-primary border border-secondary/35',
    Rejected: 'bg-white text-ink border border-primary/25',
  }[rider.verificationStatus];

  const accBadgeClass = {
    Active: 'bg-primary text-white border-transparent',
    Inactive: 'bg-white text-ink border border-primary/25',
    Suspended: 'bg-primary text-white border-transparent',
  }[rider.status];

  // Render individual field card matching modal style
  const renderFieldCard = (label: string, value: React.ReactNode, fullWidth = false) => (
    <div
      className={`p-3 rounded-[12px] bg-black/[0.02] border border-primary/10 ${
        fullWidth ? 'col-span-full' : ''
      }`}
    >
      <span className="text-[10px] text-ink/50 block font-sans">{label}</span>
      <div className="text-ink font-medium mt-0.5 text-xs font-sans break-words">{value}</div>
    </div>
  );

  // Render summary stat card
  const renderStatCard = (title: string, value: React.ReactNode, subtitle?: string, icon?: React.ReactNode) => (
    <div className="p-4 rounded-[16px] bg-white border border-primary/10 shadow-xs flex flex-col justify-between">
      <div className="flex items-center justify-between text-xs font-sans text-ink/55">
        <span>{title}</span>
        {icon}
      </div>
      <div className="font-heading text-2xl text-ink font-normal mt-2 leading-none">{value}</div>
      {subtitle && <p className="text-[10px] font-sans text-ink/50 mt-1.5">{subtitle}</p>}
    </div>
  );

  return (
    <div className="w-full flex flex-col gap-4 pb-12 pt-1 select-none">
      {/* ──────────── TOP BAR & BACK LINK ──────────── */}
      <div className="flex items-center justify-between flex-wrap gap-2">
        <button
          type="button"
          onClick={handleBack}
          className="min-h-[40px] inline-flex items-center gap-1.5 text-xs font-sans font-medium text-ink/75 hover:text-ink transition-colors py-2 px-3 -ml-2 rounded-full hover:bg-neutral focus:outline-none focus:ring-2 focus:ring-secondary"
        >
          <ArrowLeft className="w-4 h-4 text-ink" />
          Back to Riders
        </button>

        <span className="text-[11px] font-sans text-ink/50">
          Rider ID: <span className="font-mono text-ink font-medium">{rider.id}</span>
        </span>
      </div>

      {/* ──────────── HERO HEADER CARD ──────────── */}
      <div className="w-full rounded-[24px] bg-white border border-primary/10 shadow-sm p-4 sm:p-6 flex flex-col gap-4">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          {/* Avatar + Title + Badges + Subtitle */}
          <div className="flex items-start sm:items-center gap-3.5 min-w-0">
            <div className="w-14 h-14 rounded-[18px] bg-secondary text-white font-sans text-base font-semibold flex items-center justify-center flex-shrink-0 shadow-xs">
              {rider.initials}
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <h2 className="font-heading text-xl sm:text-2xl text-ink font-normal leading-tight break-words">
                  {rider.name}
                </h2>
                <span
                  className={`px-2.5 py-0.5 rounded-full text-[10px] font-sans font-medium leading-tight ${accBadgeClass}`}
                >
                  {rider.status}
                </span>
                <span
                  className={`px-2.5 py-0.5 rounded-full text-[10px] font-sans font-medium leading-tight ${verBadgeClass}`}
                >
                  {rider.verificationStatus}
                </span>
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-neutral text-[10px] font-sans text-ink">
                  <span
                    className={`w-1.5 h-1.5 rounded-full ${
                      rider.availability === 'Online'
                        ? 'bg-primary'
                        : rider.availability === 'On delivery'
                        ? 'bg-primary'
                        : 'bg-neutral'
                    }`}
                  />
                  {rider.availability}
                </span>
              </div>
              <p className="font-sans text-xs text-ink/60 mt-1 flex items-center gap-2 flex-wrap break-words">
                <span>{rider.vehicleType} {rider.vehicleNumber !== '-' ? `(${rider.vehicleNumber})` : ''}</span>
                <span>•</span>
                <span>{rider.city}</span>
                <span>•</span>
                <span>{rider.phone}</span>
              </p>
            </div>
          </div>

          {/* Primary Action Buttons */}
          <div className="flex items-center gap-2 flex-wrap self-start lg:self-center">
            {/* Suspend / Reactivate */}
            {rider.status === 'Suspended' ? (
              <button
                type="button"
                onClick={() => setConfirmAction('reactivate')}
                className="min-h-[40px] px-4 rounded-full text-xs font-sans bg-white border border-black text-ink hover:bg-neutral transition-all font-medium focus:outline-none focus:ring-2 focus:ring-secondary"
              >
                Reactivate
              </button>
            ) : (
              <button
                type="button"
                onClick={() => setConfirmAction('suspend')}
                className="min-h-[40px] px-4 rounded-full text-xs font-sans bg-white border border-black text-ink hover:bg-neutral transition-all font-medium focus:outline-none focus:ring-2 focus:ring-secondary"
              >
                Suspend
              </button>
            )}

            {/* Set Inactive / Set Active */}
            {rider.status === 'Active' ? (
              <button
                type="button"
                onClick={() => setConfirmAction('set_inactive')}
                className="min-h-[40px] px-4 rounded-full text-xs font-sans bg-white border border-black text-ink hover:bg-neutral transition-all font-medium focus:outline-none focus:ring-2 focus:ring-secondary"
              >
                Set Inactive
              </button>
            ) : (
              <button
                type="button"
                disabled={!isVerified}
                onClick={() => setConfirmAction('set_active')}
                title={!isVerified ? 'Verify documents first' : undefined}
                className={`min-h-[40px] px-4 rounded-full text-xs font-sans transition-all font-medium ${
                  isVerified
                    ? 'bg-white border border-black text-ink hover:bg-neutral'
                    : 'bg-neutral text-ink/35 border border-primary/10 cursor-not-allowed'
                }`}
              >
                Set Active
              </button>
            )}

            {/* Edit Rider (PRIMARY) */}
            <button
              type="button"
              onClick={() => setIsEditOpen(true)}
              className="min-h-[40px] px-5 rounded-full text-xs font-sans bg-primary text-white font-medium hover:opacity-90 active:scale-95 transition-all shadow-xs flex items-center gap-1.5 focus:outline-none focus:ring-2 focus:ring-secondary"
            >
              <Edit2 className="w-3.5 h-3.5" />
              Edit Rider
            </button>
          </div>
        </div>

        {/* Status Banners */}
        {rider.status === 'Suspended' && (
          <div className="p-3.5 rounded-[16px] bg-primary text-white text-xs font-sans space-y-1 shadow-xs">
            <div className="flex items-center justify-between">
              <span className="font-semibold text-white">
                Account Suspended on {rider.statusDate || '12 Nov 2026'} by {rider.statusAdmin || 'Admin'}
              </span>
              <span className="text-[10px] text-white/60">Disciplinary Block</span>
            </div>
            <p className="text-white/80">
              Reason: <strong>{rider.statusReason || 'Policy violation'}</strong>
              {rider.statusRemarks ? ` — ${rider.statusRemarks}` : ''}
            </p>
          </div>
        )}

        {rider.status === 'Inactive' && (
          <div className="p-3.5 rounded-[16px] bg-neutral/80 border border-primary/15 text-xs font-sans space-y-0.5">
            <span className="font-medium text-ink">
              Account Inactive since {rider.statusDate || 'Recently'}
            </span>
            <p className="text-ink/65 text-[11px]">
              Reason: {rider.statusReason || 'Under review / Temporarily closed'}
              {rider.statusRemarks ? ` — ${rider.statusRemarks}` : ''}
            </p>
          </div>
        )}
      </div>

      {/* ──────────── TAB NAVIGATION STRIP (Horizontally scrollable with no scrollbar) ──────────── */}
      <div
        ref={tabListRef}
        className="w-full border-b border-primary/10 flex items-center gap-1 sm:gap-2 overflow-x-auto no-scrollbar bg-neutral/30 px-2 sm:px-4 rounded-[18px]"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        {[
          { id: 'overview', label: 'Overview' },
          { id: 'documents', label: `Documents (${approvedDocsCount}/${applicableDocs.length})` },
          { id: 'deliveries', label: `Deliveries (${rider.recentDeliveries.length})` },
          { id: 'payouts', label: 'Payouts' },
          { id: 'activity', label: `Activity (${rider.activity.length})` },
        ].map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              ref={isActive ? activeTabRef : null}
              type="button"
              onClick={() => handleTabChange(tab.id as TabType)}
              className={`min-h-[40px] py-2.5 px-3 sm:px-4 text-xs font-sans whitespace-nowrap transition-colors relative font-medium border-b-2 flex-shrink-0 ${
                isActive
                  ? 'border-primary text-primary font-semibold'
                  : 'border-transparent text-ink/60 hover:text-ink'
              }`}
            >
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* ──────────── TAB CONTENT ──────────── */}
      <div className="w-full">
        {/* TAB 1: OVERVIEW */}
        {activeTab === 'overview' && (
          <div className="w-full flex flex-col lg:grid lg:grid-cols-[1fr_320px] xl:grid-cols-[1fr_350px] gap-5 items-start">
            {/* ──────────── LEFT (WIDER) COLUMN: Detail Field Cards Grouped Into Sections ──────────── */}
            <div className="w-full flex flex-col gap-4 order-2 lg:order-1">
              {/* Section 1: Personal Contact Info */}
              <div className="p-4 sm:p-5 rounded-[20px] bg-white border border-primary/10 shadow-xs space-y-3">
                <div className="flex items-center gap-2 pb-1.5 border-b border-primary/10">
                  <Bike className="w-4 h-4 text-primary" />
                  <h3 className="font-sans text-xs font-semibold text-ink uppercase tracking-wider">
                    Personal & Contact Information
                  </h3>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {renderFieldCard('Full Name', rider.name)}
                  {renderFieldCard('Mobile Phone', rider.phone)}
                  {renderFieldCard('Email Address', <span className="break-all">{rider.email}</span>)}
                </div>
              </div>

              {/* Section 2: Vehicle & Transit Details */}
              <div className="p-4 sm:p-5 rounded-[20px] bg-white border border-primary/10 shadow-xs space-y-3">
                <div className="flex items-center gap-2 pb-1.5 border-b border-primary/10">
                  <Shield className="w-4 h-4 text-primary" />
                  <h3 className="font-sans text-xs font-semibold text-ink uppercase tracking-wider">
                    Vehicle & Transit Details
                  </h3>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {renderFieldCard('Vehicle Spec', rider.vehicleType)}
                  {renderFieldCard(
                    'Registration Number',
                    rider.vehicleNumber !== '-' ? rider.vehicleNumber : 'N/A (Bicycle / On foot)'
                  )}
                  {renderFieldCard('Operating City', rider.city)}
                </div>
              </div>

              {/* Section 3: Emergency Contact */}
              <div className="p-4 sm:p-5 rounded-[20px] bg-white border border-primary/10 shadow-xs space-y-3">
                <div className="flex items-center gap-2 pb-1.5 border-b border-primary/10">
                  <Phone className="w-4 h-4 text-primary" />
                  <h3 className="font-sans text-xs font-semibold text-ink uppercase tracking-wider">
                    Emergency Contact
                  </h3>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {renderFieldCard(
                    'Contact Person',
                    `${rider.emergencyContact.name} (${rider.emergencyContact.relation})`
                  )}
                  {renderFieldCard('Emergency Phone', rider.emergencyContact.phone)}
                </div>
              </div>

              {/* Section 4: Residential Address */}
              <div className="p-4 sm:p-5 rounded-[20px] bg-white border border-primary/10 shadow-xs space-y-3">
                <div className="flex items-center gap-2 pb-1.5 border-b border-primary/10">
                  <MapPin className="w-4 h-4 text-primary" />
                  <h3 className="font-sans text-xs font-semibold text-ink uppercase tracking-wider">
                    Residential Address
                  </h3>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {renderFieldCard(
                    'Address',
                    `${rider.address}, ${rider.city}`,
                    true
                  )}
                  {renderFieldCard('City', rider.city)}
                  {renderFieldCard('Country', 'India')}
                </div>
              </div>

              {/* Section 5: Bank & Settlement */}
              <div className="p-4 sm:p-5 rounded-[20px] bg-white border border-primary/10 shadow-xs space-y-3">
                <div className="flex items-center gap-2 pb-1.5 border-b border-primary/10">
                  <CreditCard className="w-4 h-4 text-primary" />
                  <h3 className="font-sans text-xs font-semibold text-ink uppercase tracking-wider">
                    Settlement & Bank Details
                  </h3>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {renderFieldCard(
                    'Masked Bank Account',
                    `${rider.bankDetails.accountMasked} (${rider.bankDetails.bankName})`
                  )}
                  {renderFieldCard('Last Settlement', `${rider.lastPayout} (Direct Bank Transfer)`)}
                  {renderFieldCard(
                    'Pending Payout',
                    `${rider.pendingPayout} (Scheduled upcoming Monday)`,
                    true
                  )}
                </div>
              </div>
            </div>

            {/* ──────────── RIGHT COLUMN: Summary/Stat Cards (Desktop: Stacked | Tablet & Mobile: 2-col Grid on Top) ──────────── */}
            <div className="w-full flex flex-col gap-3.5 order-1 lg:order-2">
              <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-1 gap-3 w-full">
                {renderStatCard(
                  'Deliveries Done',
                  rider.deliveriesCompleted,
                  'Lifetime completed dispatches',
                  <Bike className="w-4 h-4 text-primary" />
                )}
                {renderStatCard(
                  'On-Time SLA',
                  `${rider.onTimePct}%`,
                  'Within promised delivery window',
                  <Clock className="w-4 h-4 text-primary" />
                )}
                {renderStatCard(
                  'Average Rating',
                  `★ ${rider.rating.toFixed(1)}`,
                  'Rated by customers & merchants',
                  <Star className="w-4 h-4 text-primary" />
                )}
                {renderStatCard(
                  'Joined Date',
                  rider.joinedDate,
                  'Delivery partner tenure',
                  <Calendar className="w-4 h-4 text-primary" />
                )}
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: DOCUMENTS */}
        {activeTab === 'documents' && (
          <div className="space-y-4">
            {/* Progress Strip */}
            <div className="p-4 sm:p-5 rounded-[20px] bg-white border border-primary/10 shadow-xs flex items-center justify-between gap-4 flex-wrap">
              <div className="flex-1 min-w-[220px]">
                <div className="flex items-center justify-between text-xs font-sans mb-2">
                  <span className="font-medium text-ink">Onboarding Documents Status</span>
                  <span className="text-ink/60 font-medium">
                    {approvedDocsCount} of {applicableDocs.length} approved ({progressPercent}%)
                  </span>
                </div>
                <div className="w-full h-[8px] rounded-full bg-primary/10 overflow-hidden">
                  <div
                    style={{
                      width: `${progressPercent}%`,
                      backgroundColor: '#FFFFFF',
                      backgroundImage:
                        'repeating-linear-gradient(45deg, #123747 0, #123747 1px, transparent 1px, transparent 2.5px)',
                    }}
                    className="h-full rounded-full transition-all duration-500"
                  />
                </div>
              </div>

              <button
                type="button"
                onClick={() => navigate(`/document-verification?type=rider&id=${rider.id}`)}
                className="min-h-[40px] px-4 rounded-full bg-primary text-white font-sans text-xs font-medium flex items-center gap-1.5 hover:opacity-90 active:scale-95 transition-all shadow-xs flex-shrink-0"
              >
                Open in Document Verification
                <ExternalLink className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Checklist */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {applicantDocs.map((doc) => (
                <div
                  key={doc.id}
                  className={`p-3.5 rounded-[18px] border border-primary/10 flex items-center justify-between gap-3 text-xs font-sans shadow-xs ${
                    doc.isNotApplicable ? 'bg-neutral/40 opacity-50' : 'bg-white'
                  }`}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    {!doc.isNotApplicable && (
                      <button
                        type="button"
                        onClick={() => setLightboxDoc(doc.name)}
                        className="w-10 h-10 rounded-[10px] hatch hover:bg-secondary flex-shrink-0 flex items-center justify-center border border-primary/10 cursor-pointer"
                        title={`Preview ${doc.name}`}
                      >
                        <Eye className="w-4 h-4 text-ink/70" />
                      </button>
                    )}

                    <div className="min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span
                          className={`font-medium text-ink ${
                            doc.isNotApplicable ? 'line-through text-ink/50' : ''
                          }`}
                        >
                          {doc.name}
                        </span>
                        {doc.isNotApplicable ? (
                          <span className="px-1.5 py-0.2 rounded-full text-[9px] border border-primary/20 text-ink/60 bg-white">
                            Not applicable
                          </span>
                        ) : doc.requirement === 'Required' ? (
                          <span className="px-1.5 py-0.2 rounded-full text-[9px] bg-primary text-white">
                            Required
                          </span>
                        ) : (
                          <span className="px-1.5 py-0.2 rounded-full text-[9px] border border-primary/20 text-ink/70">
                            {doc.requirement}
                          </span>
                        )}
                        {doc.tag && (
                          <span className="px-1.5 py-0.2 rounded-full text-[9px] bg-secondary text-white">
                            {doc.tag}
                          </span>
                        )}
                      </div>
                      <span className="text-[11px] text-ink/55 block mt-0.5 break-words">
                        {doc.purpose}
                      </span>
                    </div>
                  </div>

                  <span
                    className={`px-2.5 py-0.5 rounded-full text-[10px] font-medium flex-shrink-0 ${
                      doc.isNotApplicable
                        ? 'bg-transparent text-ink/40'
                        : doc.status === 'Approved'
                        ? 'bg-primary text-white'
                        : doc.status === 'Rejected'
                        ? 'bg-white border border-black text-ink'
                        : 'bg-secondary text-white'
                    }`}
                  >
                    {doc.isNotApplicable ? 'N/A' : doc.status}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 3: DELIVERIES */}
        {activeTab === 'deliveries' && (
          <div className="space-y-4">
            {/* 3 Summary Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs font-sans">
              <div className="p-4 rounded-[18px] bg-primary text-white shadow-xs">
                <span className="text-[10px] text-white/60 block">Total Deliveries</span>
                <span className="font-heading text-2xl font-normal mt-1 block text-white">
                  {rider.deliveriesCompleted}
                </span>
                <span className="text-[10px] text-white/70 block mt-0.5">
                  Lifetime completed dispatches
                </span>
              </div>
              <div className="p-4 rounded-[18px] bg-primary text-white shadow-xs">
                <span className="text-[10px] text-white/60 block">On-Time SLA</span>
                <span className="font-heading text-2xl font-normal mt-1 block text-white">
                  {rider.onTimePct}%
                </span>
                <span className="text-[10px] text-white/70 block mt-0.5">
                  Within promised delivery window
                </span>
              </div>
              <div className="p-4 rounded-[18px] bg-secondary text-white shadow-xs">
                <span className="text-[10px] text-white/70 block">Average Rating</span>
                <div className="flex items-center gap-1.5 mt-1">
                  <Star className="w-5 h-5 fill-white text-white" />
                  <span className="font-heading text-2xl font-normal text-white">
                    {rider.rating.toFixed(1)}
                  </span>
                </div>
                <span className="text-[10px] text-white/80 block mt-0.5">
                  Rated by customers & merchants
                </span>
              </div>
            </div>

            {/* Recent Deliveries Table (Horizontally scrollable on small screens) */}
            <div className="w-full overflow-x-auto border border-primary/10 rounded-[20px] bg-white shadow-xs">
              <div className="p-3.5 sm:p-4 border-b border-primary/10 flex items-center justify-between">
                <h4 className="font-sans text-xs font-semibold text-ink uppercase tracking-wider">
                  Recent Dispatches
                </h4>
                <span className="text-[11px] font-sans text-ink/50">
                  Showing latest {rider.recentDeliveries.length} orders
                </span>
              </div>
              <table className="w-full min-w-[500px] text-left text-xs font-sans border-collapse">
                <thead>
                  <tr className="bg-neutral/40 border-b border-primary/10 text-ink/70">
                    <th className="py-3 px-4 font-medium">Order ID</th>
                    <th className="py-3 px-4 font-medium">Merchant / Store</th>
                    <th className="py-3 px-4 font-medium">Date</th>
                    <th className="py-3 px-4 font-medium">Status</th>
                    <th className="py-3 px-4 font-medium text-right">Earning</th>
                  </tr>
                </thead>
                <tbody>
                  {rider.recentDeliveries.map((del) => (
                    <tr
                      key={del.id}
                      className="border-b border-primary/5 hover:bg-neutral/20 transition-colors last:border-b-0"
                    >
                      <td className="py-3 px-4 text-ink font-mono font-medium">{del.id}</td>
                      <td className="py-3 px-4 text-ink/75 break-words">{del.vendor}</td>
                      <td className="py-3 px-4 text-ink/60">{del.date}</td>
                      <td className="py-3 px-4">
                        <span
                          className={`px-2.5 py-0.5 rounded-full text-[10px] font-medium ${
                            del.status === 'Delivered'
                              ? 'bg-primary text-white'
                              : 'bg-secondary text-white'
                          }`}
                        >
                          {del.status}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-right font-medium text-ink">
                        {del.earning}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 4: PAYOUTS */}
        {activeTab === 'payouts' && (
          <div className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs font-sans">
              <div className="p-4 rounded-[18px] bg-white border border-primary/10 shadow-xs">
                <span className="text-[10px] text-ink/50 block">Masked Bank Account</span>
                <span className="text-ink font-semibold mt-1 block text-sm font-mono break-all">
                  {rider.bankDetails.accountMasked}
                </span>
                <span className="text-[10px] text-ink/50 block mt-0.5">
                  {rider.bankDetails.bankName}
                </span>
              </div>
              <div className="p-4 rounded-[18px] bg-white border border-primary/10 shadow-xs">
                <span className="text-[10px] text-ink/50 block">Last Settlement</span>
                <span className="text-ink font-semibold text-base mt-1 block">
                  {rider.lastPayout}
                </span>
                <span className="text-[10px] text-ink/50 block mt-0.5">
                  Direct Bank Transfer
                </span>
              </div>
              <div className="p-4 rounded-[18px] bg-secondary/15 border border-secondary/30 shadow-xs">
                <span className="text-[10px] text-ink/60 block">Pending Payout</span>
                <span className="text-ink font-semibold text-base mt-1 block">
                  {rider.pendingPayout}
                </span>
                <span className="text-[10px] text-ink/60 block mt-0.5">
                  Scheduled for upcoming Monday
                </span>
              </div>
            </div>

            {/* Weekly Earnings Chart */}
            <div className="p-5 rounded-[20px] border border-primary/10 bg-white shadow-xs space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-sans text-xs font-semibold text-ink uppercase tracking-wider">
                    Weekly Earnings (Mon - Sun)
                  </h4>
                  <p className="text-[11px] font-sans text-ink/55 mt-0.5">
                    Completed delivery fee compensation & incentives
                  </p>
                </div>
                <span className="text-xs font-sans font-semibold text-ink">
                  Total: ₹{chartData.reduce((acc, curr) => acc + curr, 0).toLocaleString()}
                </span>
              </div>

              <div className="h-36 flex items-end justify-between gap-3 pt-4 px-2">
                {chartData.map((amount, idx) => {
                  const isTallest = amount === maxVal && amount > 0;
                  const heightPercent = Math.max(12, (amount / maxVal) * 100);

                  return (
                    <div
                      key={daysOfWeek[idx]}
                      className="flex-1 flex flex-col items-center gap-1.5 h-full justify-end group"
                    >
                      <span className="text-[10px] font-sans text-ink/60 opacity-0 group-hover:opacity-100 transition-opacity">
                        ₹{amount}
                      </span>
                      <div
                        style={{ height: `${heightPercent}%` }}
                        className={`w-full max-w-[34px] rounded-t-[8px] transition-all ${
                          isTallest ? 'bg-primary' : 'bg-black'
                        }`}
                        title={`${daysOfWeek[idx]}: ₹${amount}`}
                      />
                      <span
                        className={`text-[10px] font-sans ${
                          isTallest ? 'font-semibold text-ink' : 'text-ink/60'
                        }`}
                      >
                        {daysOfWeek[idx]}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* TAB 5: ACTIVITY */}
        {activeTab === 'activity' && (
          <div className="p-5 rounded-[20px] bg-white border border-primary/10 shadow-xs space-y-4">
            <h4 className="font-sans text-xs font-semibold text-ink uppercase tracking-wider">
              Audit & Status Timeline
            </h4>
            <div className="border-l-2 border-primary/10 ml-2.5 pl-4 space-y-4 relative">
              {rider.activity.map((ev) => (
                <div key={ev.id} className="relative text-xs font-sans">
                  <div className="absolute -left-[23px] top-1 w-2.5 h-2.5 rounded-full bg-primary ring-4 ring-white" />
                  <p className="font-medium text-ink leading-tight">{ev.action}</p>
                  {ev.details && (
                    <p className="text-[11px] text-ink/65 mt-0.5 leading-snug break-words">
                      {ev.details}
                    </p>
                  )}
                  <span className="text-[10px] text-ink/50 leading-none block mt-1">
                    {ev.timestamp} · by {ev.admin}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* ──────────── MODALS ──────────── */}
      {/* 1. Edit Form Modal */}
      <PersonFormModal
        isOpen={isEditOpen}
        type="rider"
        item={rider}
        onClose={() => setIsEditOpen(false)}
        onSubmit={(data) => {
          editPerson('rider', rider.id, data);
          setIsEditOpen(false);
          showToast('Rider details updated successfully');
        }}
      />

      {/* 2. Confirm Action Modal */}
      <ConfirmActionModal
        isOpen={Boolean(confirmAction)}
        action={confirmAction}
        targetName={rider.name}
        isVerified={isVerified}
        onClose={() => setConfirmAction(null)}
        onConfirm={handleConfirmAction}
        onOpenDocuments={() => {
          setConfirmAction(null);
          navigate(`/document-verification?type=rider&id=${rider.id}`);
        }}
      />

      {/* 3. Lightbox for Document Preview */}
      <Lightbox
        isOpen={Boolean(lightboxDoc)}
        docName={lightboxDoc || ''}
        onClose={() => setLightboxDoc(null)}
      />
    </div>
  );
};
