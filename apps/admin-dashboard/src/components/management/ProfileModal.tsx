import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ManagementVendor, ManagementRider } from '../../data/mockManagementData';
import { VerificationDocument, createVendorDocuments, createRiderDocuments } from '../../data/verification';
import { Lightbox } from '../verification/Lightbox';
import { X, ExternalLink, Star, Eye } from 'lucide-react';

interface ProfileModalProps {
  isOpen: boolean;
  type: 'vendor' | 'rider';
  item: ManagementVendor | ManagementRider | null;
  applicantDocs?: VerificationDocument[];
  onClose: () => void;
  onEdit: () => void;
  onSuspend: () => void;
  onReactivate: () => void;
  onSetInactive: () => void;
  onSetActive: () => void;
}

export const ProfileModal: React.FC<ProfileModalProps> = ({
  isOpen,
  type,
  item,
  applicantDocs,
  onClose,
  onEdit,
  onSuspend,
  onReactivate,
  onSetInactive,
  onSetActive,
}) => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<
    'Overview' | 'Documents' | 'CatalogueOrDeliveries' | 'Payouts' | 'Activity'
  >('Overview');
  const [lightboxDoc, setLightboxDoc] = useState<string | null>(null);

  useEffect(() => {
    if (!isOpen) return;
    setActiveTab('Overview');

    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (lightboxDoc) setLightboxDoc(null);
        else onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      document.body.style.overflow = originalOverflow;
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, lightboxDoc, onClose]);

  if (!isOpen || !item) return null;

  const isVendor = type === 'vendor';
  const vendor = isVendor ? (item as ManagementVendor) : null;
  const rider = !isVendor ? (item as ManagementRider) : null;

  const name = vendor ? vendor.storeName : rider?.name || '';
  const initials = item.initials;
  const isVerified = item.verificationStatus === 'Verified';

  // Badges
  const verBadgeClass = {
    Verified: 'bg-primary text-white border-transparent',
    Pending: 'bg-secondary/18 text-primary border border-secondary/35',
    Rejected: 'bg-white text-ink border border-primary/25',
  }[item.verificationStatus];

  const accBadgeClass = {
    Active: 'bg-primary text-white border-transparent',
    Inactive: 'bg-white text-ink border border-primary/25',
    Suspended: 'bg-primary text-white border-transparent',
  }[item.status];

  // Documents checklist
  const documents: VerificationDocument[] =
    applicantDocs && applicantDocs.length > 0
      ? applicantDocs
      : isVendor
      ? createVendorDocuments(vendor!.id, vendor!.businessCategory)
      : createRiderDocuments(rider!.id, rider!.vehicleType, rider!.emergencyContact);

  const applicableDocs = documents.filter((d) => !d.isNotApplicable);
  const approvedDocsCount = applicableDocs.filter((d) => d.status === 'Approved').length;
  const progressPercent = Math.round(
    (approvedDocsCount / (applicableDocs.length || 1)) * 100
  );

  const handleOpenDocVerification = () => {
    onClose();
    navigate(`/document-verification?type=${type}&id=${item.id}`);
  };

  // 7-day chart calculations
  const chartData = isVendor
    ? vendor?.salesLast7Days || [3500, 4200, 4900, 5100, 6800, 7500, 6200]
    : rider?.weeklyEarnings || [450, 620, 580, 710, 920, 840, 690];
  const maxVal = Math.max(...chartData, 1);
  const daysOfWeek = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

  return (
    <>
      <div
        onClick={onClose}
        className="fixed inset-0 z-[60] flex items-center justify-center p-3 sm:p-4 transition-all duration-200"
        style={{
          backgroundColor: 'rgba(18, 55, 71, 0.35)',
          backdropFilter: 'blur(6px)',
          WebkitBackdropFilter: 'blur(6px)',
        }}
        aria-hidden="true"
      >
        <div
          onClick={(e) => e.stopPropagation()}
          className="w-[calc(100vw-24px)] min-[700px]:w-[min(780px,calc(100vw-32px))] max-h-[calc(100vh-24px)] min-[700px]:max-h-[min(680px,calc(100vh-48px))] bg-white rounded-[24px] shadow-[0_24px_60px_rgba(18, 55, 71, 0.25)] flex flex-col overflow-hidden relative select-none animate-in fade-in zoom-in-95 duration-200"
          role="dialog"
          aria-modal="true"
          aria-label={`Profile: ${name}`}
        >
          {/* ──────────── Top Header (Fixed) ──────────── */}
          <div className="p-[18px_24px] border-b border-primary/10 flex items-center justify-between flex-shrink-0 bg-white">
            <div className="flex items-center gap-3.5 min-w-0">
              <div className="w-[42px] h-[42px] rounded-[14px] bg-secondary text-white font-sans text-sm flex items-center justify-center font-normal flex-shrink-0 shadow-2xs">
                {initials}
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <h3 className="font-heading text-[18px] text-ink font-normal leading-tight truncate">
                    {name}
                  </h3>
                  <span
                    className={`px-2.5 py-0.5 rounded-full text-[10px] font-sans font-medium leading-tight ${accBadgeClass}`}
                  >
                    {item.status}
                  </span>
                  <span
                    className={`px-2.5 py-0.5 rounded-full text-[10px] font-sans font-medium leading-tight ${verBadgeClass}`}
                  >
                    {item.verificationStatus}
                  </span>
                </div>
                <p className="font-sans text-[11px] text-ink/55 mt-0.5 truncate">
                  {isVendor
                    ? `${vendor?.ownerName} · ${vendor?.businessCategory} · ${vendor?.city}`
                    : `${rider?.vehicleType} · ${rider?.city} · ${rider?.phone}`}
                </p>
              </div>
            </div>

            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full hover:bg-neutral flex items-center justify-center text-ink/55 hover:text-ink transition-colors focus:ring-2 focus:ring-secondary ml-2 flex-shrink-0"
              aria-label="Close"
            >
              <X className="w-5 h-5 text-ink" />
            </button>
          </div>

          {/* ──────────── Pill Tabs Strip (Fixed) ──────────── */}
          <div className="px-6 border-b border-primary/10 flex items-center gap-2 bg-neutral/40 overflow-x-auto flex-shrink-0">
            {[
              { id: 'Overview', label: 'Overview' },
              { id: 'Documents', label: 'Documents' },
              {
                id: 'CatalogueOrDeliveries',
                label: isVendor ? 'Products' : 'Deliveries',
              },
              { id: 'Payouts', label: 'Payouts' },
              { id: 'Activity', label: 'Activity' },
            ].map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id as any)}
                className={`py-3 px-3 text-xs font-sans border-b-2 font-medium whitespace-nowrap transition-colors ${
                  activeTab === tab.id
                    ? 'border-primary text-ink font-semibold'
                    : 'border-transparent text-ink/55 hover:text-ink'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* ──────────── Scrollable Middle Area ──────────── */}
          <div className="flex-1 min-h-0 overflow-y-auto p-5 min-[700px]:p-6 space-y-4">
            {/* Status Banners */}
            {item.status === 'Suspended' && (
              <div className="p-3.5 rounded-[14px] bg-primary text-white text-xs font-sans space-y-1 shadow-xs">
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-primary">
                    Account Suspended on {item.statusDate || '12 Nov 2026'} by{' '}
                    {item.statusAdmin || 'Admin'}
                  </span>
                  <span className="text-[10px] text-white/50">Disciplinary Block</span>
                </div>
                <p className="text-white/80">
                  Reason: <strong>{item.statusReason || 'Policy violation'}</strong>
                  {item.statusRemarks ? ` — ${item.statusRemarks}` : ''}
                </p>
              </div>
            )}

            {item.status === 'Inactive' && (
              <div className="p-3 rounded-[14px] bg-white border border-primary/20 text-xs font-sans space-y-0.5">
                <span className="font-medium text-ink">
                  Account Inactive since {item.statusDate || 'Recently'}
                </span>
                <p className="text-ink/60 text-[11px]">
                  Reason: {item.statusReason || 'Under review / Temporarily closed'}
                  {item.statusRemarks ? ` — ${item.statusRemarks}` : ''}
                </p>
              </div>
            )}

            {/* TAB 1: OVERVIEW */}
            {activeTab === 'Overview' && (
              <div className="space-y-4">
                <div className="grid grid-cols-2 min-[700px]:grid-cols-4 gap-3 text-xs font-sans">
                  {isVendor ? (
                    <>
                      <div className="p-3 rounded-[12px] bg-black/[0.02] border border-primary/10">
                        <span className="text-[10px] text-ink/50 block">Store Name</span>
                        <span className="text-ink font-medium mt-0.5 block truncate">
                          {vendor?.storeName}
                        </span>
                      </div>
                      <div className="p-3 rounded-[12px] bg-black/[0.02] border border-primary/10">
                        <span className="text-[10px] text-ink/50 block">Owner Name</span>
                        <span className="text-ink font-medium mt-0.5 block truncate">
                          {vendor?.ownerName}
                        </span>
                      </div>
                      <div className="p-3 rounded-[12px] bg-black/[0.02] border border-primary/10">
                        <span className="text-[10px] text-ink/50 block">Mobile Phone</span>
                        <span className="text-ink font-medium mt-0.5 block">
                          {vendor?.phone}
                        </span>
                      </div>
                      <div className="p-3 rounded-[12px] bg-black/[0.02] border border-primary/10 truncate">
                        <span className="text-[10px] text-ink/50 block">Email Address</span>
                        <span className="text-ink font-medium mt-0.5 block truncate">
                          {vendor?.email}
                        </span>
                      </div>
                      <div className="p-3 rounded-[12px] bg-black/[0.02] border border-primary/10">
                        <span className="text-[10px] text-ink/50 block">Category</span>
                        <span className="text-ink font-medium mt-0.5 block">
                          {vendor?.businessCategory}
                        </span>
                      </div>
                      <div className="p-3 rounded-[12px] bg-black/[0.02] border border-primary/10">
                        <span className="text-[10px] text-ink/50 block">City</span>
                        <span className="text-ink font-medium mt-0.5 block">
                          {vendor?.city}
                        </span>
                      </div>
                      <div className="p-3 rounded-[12px] bg-black/[0.02] border border-primary/10">
                        <span className="text-[10px] text-ink/50 block">GSTIN</span>
                        <span className="text-ink font-medium mt-0.5 block truncate">
                          {vendor?.gstin || 'Not registered'}
                        </span>
                      </div>
                      <div className="p-3 rounded-[12px] bg-black/[0.02] border border-primary/10">
                        <span className="text-[10px] text-ink/50 block">FSSAI / Licence</span>
                        <span className="text-ink font-medium mt-0.5 block truncate">
                          {vendor?.licenceNumber || 'Category compliance verified'}
                        </span>
                      </div>
                      <div className="p-3 rounded-[12px] bg-black/[0.02] border border-primary/10 col-span-2 min-[700px]:col-span-4">
                        <span className="text-[10px] text-ink/50 block">Shop Address</span>
                        <span className="text-ink font-medium mt-0.5 block">
                          {vendor?.shopAddress}, {vendor?.city}
                        </span>
                      </div>
                      <div className="p-3 rounded-[12px] bg-black/[0.02] border border-primary/10">
                        <span className="text-[10px] text-ink/50 block">Commission Rate</span>
                        <span className="text-ink font-semibold text-sm mt-0.5 block">
                          {vendor?.commissionPct}%
                        </span>
                      </div>
                      <div className="p-3 rounded-[12px] bg-black/[0.02] border border-primary/10">
                        <span className="text-[10px] text-ink/50 block">Joined Date</span>
                        <span className="text-ink font-medium mt-0.5 block">
                          {vendor?.joinedDate}
                        </span>
                      </div>
                      <div className="p-3 rounded-[12px] bg-black/[0.02] border border-primary/10">
                        <span className="text-[10px] text-ink/50 block">Total Products</span>
                        <span className="text-ink font-semibold text-sm mt-0.5 block">
                          {vendor?.productsCount}
                        </span>
                      </div>
                      <div className="p-3 rounded-[12px] bg-black/[0.02] border border-primary/10">
                        <span className="text-[10px] text-ink/50 block">Total Orders</span>
                        <span className="text-ink font-semibold text-sm mt-0.5 block">
                          {vendor?.ordersCount.toLocaleString()}
                        </span>
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="p-3 rounded-[12px] bg-black/[0.02] border border-primary/10">
                        <span className="text-[10px] text-ink/50 block">Full Name</span>
                        <span className="text-ink font-medium mt-0.5 block truncate">
                          {rider?.name}
                        </span>
                      </div>
                      <div className="p-3 rounded-[12px] bg-black/[0.02] border border-primary/10">
                        <span className="text-[10px] text-ink/50 block">Phone</span>
                        <span className="text-ink font-medium mt-0.5 block">
                          {rider?.phone}
                        </span>
                      </div>
                      <div className="p-3 rounded-[12px] bg-black/[0.02] border border-primary/10 truncate">
                        <span className="text-[10px] text-ink/50 block">Email Address</span>
                        <span className="text-ink font-medium mt-0.5 block truncate">
                          {rider?.email}
                        </span>
                      </div>
                      <div className="p-3 rounded-[12px] bg-black/[0.02] border border-primary/10">
                        <span className="text-[10px] text-ink/50 block">City</span>
                        <span className="text-ink font-medium mt-0.5 block">
                          {rider?.city}
                        </span>
                      </div>
                      <div className="p-3 rounded-[12px] bg-black/[0.02] border border-primary/10">
                        <span className="text-[10px] text-ink/50 block">Vehicle Spec</span>
                        <span className="text-ink font-medium mt-0.5 block">
                          {rider?.vehicleType}{' '}
                          {rider?.vehicleNumber !== '-' ? `(${rider?.vehicleNumber})` : ''}
                        </span>
                      </div>
                      <div className="p-3 rounded-[12px] bg-black/[0.02] border border-primary/10">
                        <span className="text-[10px] text-ink/50 block">Emergency Contact</span>
                        <span className="text-ink font-medium mt-0.5 block truncate">
                          {rider?.emergencyContact.name} ({rider?.emergencyContact.relation}) ·{' '}
                          {rider?.emergencyContact.phone}
                        </span>
                      </div>
                      <div className="p-3 rounded-[12px] bg-black/[0.02] border border-primary/10">
                        <span className="text-[10px] text-ink/50 block">Availability</span>
                        <span className="text-ink font-medium mt-0.5 block">
                          {rider?.availability}
                        </span>
                      </div>
                      <div className="p-3 rounded-[12px] bg-black/[0.02] border border-primary/10">
                        <span className="text-[10px] text-ink/50 block">Joined Date</span>
                        <span className="text-ink font-medium mt-0.5 block">
                          {rider?.joinedDate}
                        </span>
                      </div>
                      <div className="p-3 rounded-[12px] bg-black/[0.02] border border-primary/10 col-span-2 min-[700px]:col-span-4">
                        <span className="text-[10px] text-ink/50 block">Residential Address</span>
                        <span className="text-ink font-medium mt-0.5 block">
                          {rider?.address}, {rider?.city}
                        </span>
                      </div>
                      <div className="p-3 rounded-[12px] bg-black/[0.02] border border-primary/10">
                        <span className="text-[10px] text-ink/50 block">Deliveries Done</span>
                        <span className="text-ink font-semibold text-sm mt-0.5 block">
                          {rider?.deliveriesCompleted}
                        </span>
                      </div>
                      <div className="p-3 rounded-[12px] bg-black/[0.02] border border-primary/10">
                        <span className="text-[10px] text-ink/50 block">On-Time SLA</span>
                        <span className="text-ink font-semibold text-sm mt-0.5 block">
                          {rider?.onTimePct}%
                        </span>
                      </div>
                      <div className="p-3 rounded-[12px] bg-black/[0.02] border border-primary/10">
                        <span className="text-[10px] text-ink/50 block">Average Rating</span>
                        <span className="text-ink font-semibold text-sm mt-0.5 block">
                          ★ {rider?.rating.toFixed(1)}
                        </span>
                      </div>
                      <div className="p-3 rounded-[12px] bg-black/[0.02] border border-primary/10">
                        <span className="text-[10px] text-ink/50 block">Last Status Update</span>
                        <span className="text-ink font-medium mt-0.5 block">
                          {item.statusDate || 'Recently'}
                        </span>
                      </div>
                    </>
                  )}
                </div>
              </div>
            )}

            {/* TAB 2: DOCUMENTS */}
            {activeTab === 'Documents' && (
              <div className="space-y-4">
                {/* Progress Strip */}
                <div className="p-3.5 rounded-[16px] bg-black/[0.02] border border-primary/10 flex items-center justify-between gap-3 flex-wrap">
                  <div className="flex-1 min-w-[200px]">
                    <div className="flex items-center justify-between text-xs font-sans mb-1.5">
                      <span className="font-medium text-ink">
                        Onboarding Documents Status
                      </span>
                      <span className="text-ink/60 font-medium">
                        {approvedDocsCount} of {applicableDocs.length} approved
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

                  {/* Prominent PRIMARY button "Open in Document Verification" */}
                  <button
                    type="button"
                    onClick={handleOpenDocVerification}
                    className="h-[36px] px-4 rounded-full bg-primary text-white font-sans text-xs font-medium flex items-center gap-1.5 hover:opacity-90 active:scale-95 transition-all shadow-xs flex-shrink-0"
                  >
                    Open in Document Verification
                    <ExternalLink className="w-3.5 h-3.5" />
                  </button>
                </div>

                {/* Read-only Checklist */}
                <div className="space-y-2">
                  {documents.map((doc) => (
                    <div
                      key={doc.id}
                      className={`p-3 rounded-[14px] border border-primary/10 flex items-center justify-between gap-3 text-xs font-sans ${
                        doc.isNotApplicable ? 'bg-black/[0.02] opacity-45' : 'bg-white'
                      }`}
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        {/* Small hatch thumbnail button to preview */}
                        {!doc.isNotApplicable && (
                          <button
                            type="button"
                            onClick={() => setLightboxDoc(doc.name)}
                            className="w-10 h-10 rounded-[8px] hatch hover:bg-secondary flex-shrink-0 flex items-center justify-center border border-primary/10 cursor-pointer"
                            title={`Preview ${doc.name}`}
                          >
                            <Eye className="w-3.5 h-3.5 text-ink/70" />
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
                          <span className="text-[11px] text-ink/50 block mt-0.5 truncate">
                            {doc.purpose}
                          </span>
                        </div>
                      </div>

                      {/* Status Badge */}
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

            {/* TAB 3: PRODUCTS (Vendor) / DELIVERIES (Rider) */}
            {activeTab === 'CatalogueOrDeliveries' && (
              <div className="space-y-4">
                {isVendor ? (
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-sans text-[13px] font-medium text-ink">
                        Store Catalogue ({vendor?.products.length || 0} products)
                      </h4>
                      <span className="text-[11px] font-sans text-ink/55">
                        Vendors manage their own stock
                      </span>
                    </div>
                    <div className="w-full overflow-x-auto border border-primary/10 rounded-[16px]">
                      <table className="w-full text-left text-xs font-sans border-collapse">
                        <thead>
                          <tr className="bg-black/[0.03] border-b border-primary/10 text-ink/60">
                            <th className="py-2.5 px-3">Product Name</th>
                            <th className="py-2.5 px-3">Category</th>
                            <th className="py-2.5 px-3">Sale Price</th>
                            <th className="py-2.5 px-3 text-right">Status</th>
                          </tr>
                        </thead>
                        <tbody>
                          {vendor?.products.map((p) => (
                            <tr
                              key={p.id}
                              className="border-b border-black/[0.04] last:border-b-0"
                            >
                              <td className="py-2 px-3 text-ink font-medium">{p.name}</td>
                              <td className="py-2 px-3 text-ink/65">{p.category}</td>
                              <td className="py-2 px-3 text-ink font-medium">{p.price}</td>
                              <td className="py-2 px-3 text-right">
                                <span
                                  className={`px-2 py-0.5 rounded-full text-[10px] ${
                                    p.status === 'Active'
                                      ? 'bg-primary text-white'
                                      : 'bg-black/[0.05] text-ink/60'
                                  }`}
                                >
                                  {p.status}
                                </span>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {/* 3 Summary Cards */}
                    <div className="grid grid-cols-3 gap-3 text-xs font-sans">
                      <div className="p-3.5 rounded-[16px] bg-primary text-white">
                        <span className="text-[10px] text-white/60 block">Total Deliveries</span>
                        <span className="font-heading text-xl font-normal mt-0.5 block text-white">
                          {rider?.deliveriesCompleted}
                        </span>
                      </div>
                      <div className="p-3.5 rounded-[16px] bg-primary text-white">
                        <span className="text-[10px] text-ink/70 block">On-Time SLA</span>
                        <span className="font-heading text-xl font-normal mt-0.5 block text-ink">
                          {rider?.onTimePct}%
                        </span>
                      </div>
                      <div className="p-3.5 rounded-[16px] bg-secondary text-white">
                        <span className="text-[10px] text-ink/60 block">Average Rating</span>
                        <div className="flex items-center gap-1 mt-0.5">
                          <Star className="w-3.5 h-3.5 fill-ink text-ink" />
                          <span className="font-heading text-xl font-normal text-ink">
                            {rider?.rating.toFixed(1)}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Recent 5 Deliveries Table */}
                    <div className="w-full overflow-x-auto border border-primary/10 rounded-[16px]">
                      <table className="w-full text-left text-xs font-sans border-collapse">
                        <thead>
                          <tr className="bg-black/[0.03] border-b border-primary/10 text-ink/60">
                            <th className="py-2.5 px-3">Order ID</th>
                            <th className="py-2.5 px-3">Merchant / Store</th>
                            <th className="py-2.5 px-3">Date</th>
                            <th className="py-2.5 px-3">Status</th>
                            <th className="py-2.5 px-3 text-right">Earning</th>
                          </tr>
                        </thead>
                        <tbody>
                          {rider?.recentDeliveries.map((del) => (
                            <tr
                              key={del.id}
                              className="border-b border-black/[0.04] last:border-b-0"
                            >
                              <td className="py-2 px-3 text-ink font-medium">{del.id}</td>
                              <td className="py-2 px-3 text-ink/75">{del.vendor}</td>
                              <td className="py-2 px-3 text-ink/60">{del.date}</td>
                              <td className="py-2 px-3">
                                <span
                                  className={`px-2 py-0.5 rounded-full text-[10px] ${
                                    del.status === 'Delivered'
                                      ? 'bg-primary text-white'
                                      : 'bg-primary text-white'
                                  }`}
                                >
                                  {del.status}
                                </span>
                              </td>
                              <td className="py-2 px-3 text-right font-medium text-ink">
                                {del.earning}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* TAB 4: PAYOUTS */}
            {activeTab === 'Payouts' && (
              <div className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs font-sans">
                  <div className="p-3.5 rounded-[16px] bg-black/[0.02] border border-primary/10">
                    <span className="text-[10px] text-ink/50 block">Masked Bank Account</span>
                    <span className="text-ink font-semibold mt-0.5 block">
                      {item.bankDetails.accountMasked}
                    </span>
                    <span className="text-[10px] text-ink/50 block mt-0.5">
                      {item.bankDetails.bankName}
                    </span>
                  </div>
                  <div className="p-3.5 rounded-[16px] bg-black/[0.02] border border-primary/10">
                    <span className="text-[10px] text-ink/50 block">Last Settlement</span>
                    <span className="text-ink font-semibold text-base mt-0.5 block">
                      {item.lastPayout}
                    </span>
                    <span className="text-[10px] text-ink/50 block mt-0.5">
                      Processed via NEFT / IMPS
                    </span>
                  </div>
                  <div className="p-3.5 rounded-[16px] bg-secondary border border-primary/10">
                    <span className="text-[10px] text-ink/60 block">Pending Payout</span>
                    <span className="text-ink font-semibold text-base mt-0.5 block">
                      {item.pendingPayout}
                    </span>
                    <span className="text-[10px] text-ink/60 block mt-0.5">
                      Scheduled for upcoming Monday
                    </span>
                  </div>
                </div>

                {/* 7-Bar Chart (black bars, tallest = PRIMARY) */}
                <div className="p-4 rounded-[18px] border border-primary/10 bg-black/[0.02] space-y-3">
                  <div className="flex items-center justify-between">
                    <h5 className="font-sans text-[13px] font-medium text-ink">
                      {isVendor ? 'Last 7 Days Sales Activity' : 'Weekly Earnings (Mon - Sun)'}
                    </h5>
                    <span className="text-xs font-sans font-semibold text-ink">
                      Total: ₹
                      {chartData.reduce((acc, curr) => acc + curr, 0).toLocaleString()}
                    </span>
                  </div>

                  <div className="h-28 flex items-end justify-between gap-2.5 pt-3 px-2">
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
                            className={`w-full max-w-[28px] rounded-t-[6px] transition-all ${
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

            {/* TAB 5: ACTIVITY TIMELINE */}
            {activeTab === 'Activity' && (
              <div className="space-y-3">
                <h4 className="font-sans text-[13px] font-medium text-ink">
                  Audit & Status Timeline
                </h4>
                <div className="border-l-2 border-primary/10 ml-2 pl-3.5 space-y-3.5 relative">
                  {item.activity.map((ev) => (
                    <div key={ev.id} className="relative text-xs font-sans">
                      <div className="absolute -left-[19px] top-1 w-2 h-2 rounded-full bg-primary" />
                      <p className="font-medium text-ink leading-tight">{ev.action}</p>
                      {ev.details && (
                        <p className="text-[11px] text-ink/60 mt-0.5 leading-snug">
                          {ev.details}
                        </p>
                      )}
                      <span className="text-[10px] text-ink/50 leading-none block mt-0.5">
                        {ev.timestamp} · by {ev.admin}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* ──────────── Fixed Footer (Always Visible) ──────────── */}
          <div className="p-[14px_24px] bg-white border-t border-primary/10 flex items-center justify-between flex-wrap gap-2 flex-shrink-0">
            <div className="flex items-center gap-2">
              {/* Suspend / Reactivate Action */}
              {item.status === 'Suspended' ? (
                <button
                  type="button"
                  onClick={onReactivate}
                  className="px-4 py-2 rounded-full text-xs font-sans bg-white border border-black text-ink hover:bg-neutral transition-all"
                >
                  Reactivate
                </button>
              ) : (
                <button
                  type="button"
                  onClick={onSuspend}
                  className="px-4 py-2 rounded-full text-xs font-sans bg-white border border-black text-ink hover:bg-neutral transition-all"
                >
                  Suspend
                </button>
              )}

              {/* Set Inactive / Set Active Action */}
              {item.status === 'Active' ? (
                <button
                  type="button"
                  onClick={onSetInactive}
                  className="px-4 py-2 rounded-full text-xs font-sans bg-white border border-black text-ink hover:bg-neutral transition-all"
                >
                  Set Inactive
                </button>
              ) : (
                <button
                  type="button"
                  disabled={!isVerified}
                  onClick={onSetActive}
                  title={!isVerified ? 'Verify documents first' : undefined}
                  className={`px-4 py-2 rounded-full text-xs font-sans transition-all ${
                    isVerified
                      ? 'bg-white border border-black text-ink hover:bg-neutral'
                      : 'bg-neutral text-ink/35 border border-primary/10 cursor-not-allowed'
                  }`}
                >
                  Set Active
                </button>
              )}
            </div>

            {/* Edit Button (PRIMARY) */}
            <button
              type="button"
              onClick={onEdit}
              className="px-5 py-2 rounded-full text-xs font-sans bg-primary text-white font-medium hover:opacity-90 active:scale-95 transition-all shadow-xs"
            >
              {isVendor ? 'Edit Vendor' : 'Edit Rider'}
            </button>
          </div>
        </div>
      </div>

      {/* Lightbox for Document Preview */}
      <Lightbox
        isOpen={Boolean(lightboxDoc)}
        docName={lightboxDoc || ''}
        onClose={() => setLightboxDoc(null)}
      />
    </>
  );
};
