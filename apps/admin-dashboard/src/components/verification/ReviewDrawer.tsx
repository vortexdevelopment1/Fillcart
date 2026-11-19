import React, { useState, useEffect } from 'react';
import { Applicant } from '../../data/verification';
import { StatusBadge } from './StatusBadge';
import { DocumentCard } from './DocumentCard';
import { Lightbox } from './Lightbox';
import { X } from 'lucide-react';

interface ReviewDrawerProps {
  isOpen: boolean;
  applicant: Applicant | null;
  onClose: () => void;
  onApproveDoc: (applicantId: string, docId: string) => void;
  onRejectDoc: (applicantId: string, docId: string, reason: string, remarks?: string) => void;
  onApproveAll: (applicantId: string) => void;
  onRequestReupload: (applicantId: string) => void;
  onRejectApplication: (applicantId: string) => void;
  onApproveApplication?: (applicantId: string) => void;
  onApproveStep?: (applicantId: string) => void;
  onUpdateVehicleType?: (
    applicantId: string,
    vehicleType: 'Motorcycle' | 'Scooter' | 'Electric' | 'Bicycle' | 'On foot'
  ) => void;
}

export const ReviewDrawer: React.FC<ReviewDrawerProps> = ({
  isOpen,
  applicant,
  onClose,
  onApproveDoc,
  onRejectDoc,
  onApproveAll,
  onRequestReupload,
  onRejectApplication,
  onApproveApplication,
  onApproveStep,
  onUpdateVehicleType,
}) => {
  const [lightboxDoc, setLightboxDoc] = useState<string | null>(null);
  const [stepApproved, setStepApproved] = useState(false);

  useEffect(() => {
    if (applicant) {
      setStepApproved(Boolean(applicant.stepApproved || applicant.status === 'Approved'));
    }
  }, [applicant]);

  // Lock page scroll while open & listen to Esc
  useEffect(() => {
    if (!isOpen) return;

    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (lightboxDoc) {
          setLightboxDoc(null);
        } else {
          onClose();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      document.body.style.overflow = originalOverflow;
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, lightboxDoc, onClose]);

  if (!isOpen || !applicant) return null;

  // Applicable documents (skip not applicable vehicle documents)
  const applicableDocs = applicant.documents.filter((d) => !d.isNotApplicable);
  const approvedCount = applicableDocs.filter((d) => d.status === 'Approved').length;

  return (
    <>
      {/* ──────────── 1. OVERLAY (background blur) ──────────── */}
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
        {/* ──────────── 2. POPUP BOX (centered, wider horizontal proportions) ──────────── */}
        <div
          onClick={(e) => e.stopPropagation()}
          className="w-[calc(100vw-24px)] min-[700px]:w-[min(780px,calc(100vw-32px))] max-h-[calc(100dvh-24px)] min-[700px]:max-h-[min(680px,calc(100dvh-48px))] bg-white rounded-[20px] min-[700px]:rounded-[24px] shadow-[0_24px_60px_rgba(18, 55, 71, 0.25)] flex flex-col overflow-hidden relative select-none"
          style={{
            animation: 'popupOpen 200ms cubic-bezier(0.16, 1, 0.3, 1) forwards',
          }}
          role="dialog"
          aria-modal="true"
          aria-label={`Review ${applicant.name}`}
        >
          {/* Top Header: initials + name (Arbutus Slab 18px) + status badge + X, padding 20px 24px */}
          <div className="p-[18px_24px] border-b border-primary/10 flex items-center justify-between flex-shrink-0 bg-white">
            <div className="flex items-center gap-3 min-w-0">
              <div className="w-[38px] h-[38px] rounded-[12px] bg-neutral text-primary font-sans text-xs flex items-center justify-center font-medium select-none flex-shrink-0">
                {applicant.initials}
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <h3 className="font-heading text-[18px] text-ink font-normal leading-tight truncate">
                    {applicant.name}
                  </h3>
                  <span className="text-[10px] font-sans px-2 py-0.5 rounded-full bg-white text-primary border border-primary">
                    {applicant.type}
                  </span>
                </div>
                <div className="mt-1">
                  <StatusBadge status={applicant.status} />
                </div>
              </div>
            </div>

            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full hover:bg-neutral flex items-center justify-center text-ink/55 hover:text-ink transition-colors focus:outline-none focus:ring-2 focus:ring-secondary ml-2 flex-shrink-0"
              aria-label="Close review popup"
            >
              <X className="w-5 h-5 text-ink" />
            </button>
          </div>

          {/* Scrollable Middle Area: Info Grid + Documents Grid + Timeline */}
          <div className="flex-1 min-h-0 overflow-y-auto p-5 min-[700px]:p-6 space-y-6">
            {/* Applicant info grid: 4 columns in 1 row on desktop, 2 columns on mobile */}
            <div className="grid grid-cols-2 min-[700px]:grid-cols-4 gap-3 p-3.5 rounded-[16px] bg-neutral border border-primary/10 text-xs font-sans">
              <div>
                <span className="text-primary/60 block text-[11px]">
                  {applicant.type === 'Vendor' ? 'Business Category' : 'Vehicle Type'}
                </span>
                {applicant.type === 'Rider' && applicant.status === 'Pending' ? (
                  <select
                    value={applicant.vehicleType || 'Motorcycle'}
                    onChange={(e) => {
                      const newType = e.target.value as
                        | 'Motorcycle'
                        | 'Scooter'
                        | 'Electric'
                        | 'Bicycle'
                        | 'On foot';
                      onUpdateVehicleType?.(applicant.id, newType);
                    }}
                    className="mt-0.5 px-2 py-0.5 rounded-[6px] border border-primary/20 bg-white text-primary font-medium text-xs focus:outline-none focus:ring-1 focus:ring-primary cursor-pointer"
                  >
                    <option value="Motorcycle">Motorcycle</option>
                    <option value="Scooter">Scooter</option>
                    <option value="Electric">Electric</option>
                    <option value="Bicycle">Bicycle (No motor docs)</option>
                    <option value="On foot">On foot (No motor docs)</option>
                  </select>
                ) : (
                  <span className="font-medium text-primary mt-0.5 block truncate">
                    {applicant.type === 'Vendor'
                      ? applicant.businessCategory || 'General'
                      : `${applicant.vehicleType || 'Motorcycle'} ${
                          applicant.vehicleNumber ? `(${applicant.vehicleNumber})` : ''
                        }`}
                  </span>
                )}
              </div>
              <div>
                <span className="text-primary/60 block text-[11px]">City</span>
                <span className="font-medium text-primary mt-0.5 block">{applicant.city}</span>
              </div>
              <div>
                <span className="text-primary/60 block text-[11px]">Phone</span>
                <span className="font-medium text-primary mt-0.5 block">{applicant.phone}</span>
              </div>
              <div className="truncate">
                <span className="text-primary/60 block text-[11px]">Email</span>
                <span
                  className="font-medium text-primary mt-0.5 block truncate"
                  title={applicant.email}
                >
                  {applicant.email}
                </span>
              </div>
            </div>

            {/* Document list: 2-column grid on desktop, 1 column on mobile */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <h4 className="font-sans text-[13px] font-medium text-ink">
                  Onboarding Documents Checklist ({applicableDocs.length} applicable)
                </h4>
                <span className="text-[11px] font-sans text-ink/70 font-medium">
                  {approvedCount}/{applicableDocs.length} approved
                </span>
              </div>

              {/* 2-column grid on desktop, 1 column on mobile (<700px) */}
              <div className="grid grid-cols-1 min-[700px]:grid-cols-2 gap-3 mb-4">
                {applicant.documents.map((doc) => (
                  <DocumentCard
                    key={doc.id}
                    document={doc}
                    onPreview={(name) => setLightboxDoc(name)}
                    onApprove={(docId) => onApproveDoc(applicant.id, docId)}
                    onReject={(docId, reason, remarks) =>
                      onRejectDoc(applicant.id, docId, reason, remarks)
                    }
                  />
                ))}
              </div>

              {/* Separate Verification Step Card */}
              <div className="p-4 rounded-[18px] bg-white border border-primary/15 shadow-xs">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <h5 className="font-sans text-[13px] font-medium text-ink">
                        {applicant.type === 'Vendor' ? 'Store Verification' : 'Police Verification'}
                      </h5>
                      <span className="px-2 py-0.2 rounded-full text-[9px] font-sans bg-primary text-white">
                        Required Step
                      </span>
                      {stepApproved ? (
                        <span className="px-2 py-0.2 rounded-full text-[9px] font-sans bg-secondary text-white">
                          Verified
                        </span>
                      ) : (
                        <span className="px-2 py-0.2 rounded-full text-[9px] font-sans bg-secondary/18 text-primary border border-secondary/35">
                          Pending Admin Check
                        </span>
                      )}
                    </div>
                    <p className="text-[11px] font-sans text-ink/65">
                      {applicant.type === 'Vendor'
                        ? 'Admin confirms the physical store location was verified on ground or by phone/video.'
                        : 'Admin confirms the official police verification result for this delivery partner.'}
                    </p>
                  </div>

                  <div className="flex items-center gap-2 flex-shrink-0">
                    <button
                      type="button"
                      onClick={() => {
                        setStepApproved(true);
                        onApproveStep?.(applicant.id);
                      }}
                      disabled={stepApproved}
                      className={`px-3.5 py-1.5 rounded-full text-xs font-sans font-medium transition-all ${
                        stepApproved
                          ? 'bg-neutral text-primary/50 cursor-default'
                          : 'bg-primary text-white hover:opacity-90 active:scale-95 shadow-xs'
                      }`}
                    >
                      {stepApproved ? '✓ Step Approved' : 'Approve Step'}
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Activity Timeline at bottom */}
            <div>
              <h4 className="font-sans text-[13px] font-medium text-ink mb-3">
                Verification Activity
              </h4>
              <div className="border-l-2 border-primary/10 ml-2 pl-3.5 space-y-3 relative">
                {applicant.timeline.map((item) => (
                  <div key={item.id} className="relative text-xs font-sans">
                    {/* Primary dot on the timeline line */}
                    <div className="absolute -left-[19px] top-1 w-2 h-2 rounded-full bg-primary" />
                    <p className="font-normal text-ink leading-tight">{item.text}</p>
                    <span className="text-[11px] text-ink/55 leading-none block mt-0.5">
                      {item.timestamp}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Sticky Footer Actions */}
          <div className="p-3 sm:p-[14px_24px] bg-white border-t border-primary/10 flex flex-col min-[600px]:flex-row items-center gap-2 sm:gap-2.5 flex-shrink-0">
            <button
              type="button"
              onClick={() => onApproveAll(applicant.id)}
              className="w-full min-[600px]:flex-1 py-2 sm:py-2.5 px-3 rounded-full text-xs font-sans bg-primary text-white font-medium hover:opacity-90 active:scale-95 transition-all focus:outline-none focus:ring-2 focus:ring-secondary whitespace-nowrap text-center shadow-xs"
            >
              Approve all
            </button>
            <button
              type="button"
              onClick={() => onRequestReupload(applicant.id)}
              className="w-full min-[600px]:flex-1 py-2 sm:py-2.5 px-3 rounded-full text-xs font-sans bg-white border border-primary/25 text-primary hover:bg-neutral active:scale-95 transition-all focus:outline-none focus:ring-2 focus:ring-secondary whitespace-nowrap text-center"
            >
              Request re-upload
            </button>
            <button
              type="button"
              onClick={() => onRejectApplication(applicant.id)}
              className="w-full min-[600px]:flex-1 py-2 sm:py-2.5 px-3 rounded-full text-xs font-sans bg-primary text-white hover:opacity-90 active:scale-95 transition-all focus:outline-none focus:ring-2 focus:ring-secondary whitespace-nowrap text-center"
            >
              Reject application
            </button>
          </div>
        </div>
      </div>

      {/* Lightbox for document preview */}
      <Lightbox
        isOpen={Boolean(lightboxDoc)}
        docName={lightboxDoc || ''}
        onClose={() => setLightboxDoc(null)}
      />
    </>
  );
};
