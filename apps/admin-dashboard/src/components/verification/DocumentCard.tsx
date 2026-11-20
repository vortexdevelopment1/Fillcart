import React, { useState, useEffect, useRef } from 'react';
import { VerificationDocument, DocumentStatus } from '../../data/verification';
import { CustomSelect } from '../common/CustomSelect';
import { Eye, Check, X, ShieldAlert, Phone, User, HeartHandshake, ChevronDown } from 'lucide-react';

interface ChangeStatusControlProps {
  status: DocumentStatus;
  documentId: string;
  documentName: string;
  onApprove: (docId: string) => void;
  onStartReject: () => void;
}

const ChangeStatusControl: React.FC<ChangeStatusControlProps> = ({
  status,
  documentId,
  documentName,
  onApprove,
  onStartReject,
}) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // Close menu on click outside
  useEffect(() => {
    if (!isMenuOpen) return;
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setIsMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isMenuOpen]);

  // Close menu on Escape
  useEffect(() => {
    if (!isMenuOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsMenuOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isMenuOpen]);

  const isApproved = status?.toLowerCase() === 'approved';
  const isRejected = status?.toLowerCase() === 'rejected';

  // 1. Status = Approved: HIDE Approve & Reject. Show subtle "Change status" control.
  if (isApproved) {
    return (
      <div className="relative inline-flex items-center" ref={menuRef}>
        <button
          type="button"
          onClick={() => setIsMenuOpen((prev) => !prev)}
          aria-label={`Change status for ${documentName}`}
          aria-haspopup="menu"
          aria-expanded={isMenuOpen}
          className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-sans text-ink/65 hover:text-ink hover:bg-neutral transition-colors border border-primary/20 focus:outline-none focus:ring-2 focus:ring-secondary min-h-[36px] sm:min-h-0 cursor-pointer"
        >
          <span>Change status</span>
          <ChevronDown
            className={`w-3 h-3 text-ink/50 transition-transform duration-150 ${
              isMenuOpen ? 'rotate-180' : ''
            }`}
          />
        </button>

        {isMenuOpen && (
          <div
            role="menu"
            aria-label={`Status options for ${documentName}`}
            className="absolute right-0 bottom-full mb-1.5 z-30 bg-white rounded-xl shadow-card-hover border border-primary/15 py-1 min-w-[130px] animate-in fade-in duration-150"
          >
            <button
              type="button"
              role="menuitem"
              onClick={() => {
                setIsMenuOpen(false);
                onStartReject();
              }}
              className="w-full text-left px-3 py-1.5 text-[11px] font-sans text-[#DC2626] hover:bg-[#FEE2E2]/60 flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <X className="w-3 h-3 stroke-[2]" />
              <span>Reject</span>
            </button>
          </div>
        )}
      </div>
    );
  }

  // 2. Status = Rejected: HIDE Reject. Show original Approve button only.
  if (isRejected) {
    return (
      <div className="flex items-center gap-1.5">
        <button
          type="button"
          onClick={() => onApprove(documentId)}
          className="px-3 py-1 rounded-full text-[11px] font-sans bg-primary text-white hover:opacity-90 active:scale-95 transition-all focus:outline-none focus:ring-2 focus:ring-secondary cursor-pointer shadow-xs min-h-[36px] sm:min-h-0"
          aria-label={`Approve ${documentName}`}
        >
          Approve
        </button>
      </div>
    );
  }

  // 3. Status = Pending / Not yet reviewed / Not approved or rejected yet: Show original Approve and Reject buttons
  return (
    <div className="flex items-center gap-1.5">
      <button
        type="button"
        onClick={() => onApprove(documentId)}
        className="px-3 py-1 rounded-full text-[11px] font-sans bg-primary text-white hover:opacity-90 active:scale-95 transition-all focus:outline-none focus:ring-2 focus:ring-secondary cursor-pointer shadow-xs min-h-[36px] sm:min-h-0"
        aria-label={`Approve ${documentName}`}
      >
        Approve
      </button>
      <button
        type="button"
        onClick={onStartReject}
        className="px-3 py-1 rounded-full text-[11px] font-sans bg-white border border-primary text-primary hover:bg-black/[0.04] transition-all focus:outline-none focus:ring-2 focus:ring-secondary active:scale-95 cursor-pointer min-h-[36px] sm:min-h-0"
        aria-label={`Reject ${documentName}`}
      >
        Reject
      </button>
    </div>
  );
};

interface DocumentCardProps {
  document: VerificationDocument;
  onPreview: (docName: string) => void;
  onApprove: (docId: string) => void;
  onReject: (docId: string, reason: string, remarks?: string) => void;
}

const REJECT_REASONS = [
  'Image is blurry',
  'Document expired',
  'Name does not match',
  'Wrong document',
];

export const DocumentCard: React.FC<DocumentCardProps> = ({
  document,
  onPreview,
  onApprove,
  onReject,
}) => {
  const [isRejecting, setIsRejecting] = useState(false);
  const [rejectReason, setRejectReason] = useState(REJECT_REASONS[0]);
  const [rejectRemarks, setRejectRemarks] = useState('');

  const handleConfirmReject = () => {
    onReject(document.id, rejectReason, rejectRemarks.trim() || undefined);
    setIsRejecting(false);
    setRejectRemarks('');
  };

  // Greyed out if marked not applicable (e.g. vehicle docs for bicycle/on foot riders)
  if (document.isNotApplicable) {
    return (
      <div className="p-3.5 rounded-[16px] border border-primary/10 bg-black/[0.02] opacity-45 select-none transition-all">
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2">
              <h5 className="font-sans text-[13px] font-normal text-ink line-through">
                {document.name}
              </h5>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-sans border border-primary/20 text-ink/60 bg-white">
                Not applicable
              </span>
            </div>
            <p className="text-[11px] font-sans text-ink/45 mt-0.5">
              {document.purpose}
            </p>
          </div>
          <span className="text-[10px] font-sans text-ink/40 italic">
            Skipped for this vehicle
          </span>
        </div>
      </div>
    );
  }

  // DATA CARD for Emergency Contact Details
  if (document.isDataCard && document.dataFields) {
    return (
      <div className="p-3.5 rounded-[16px] border border-primary/10 bg-white transition-all col-span-1 min-[700px]:col-span-2 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <h5 className="font-sans text-[13px] font-medium text-ink">
                {document.name}
              </h5>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-sans bg-primary text-white">
                Required
              </span>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-sans border border-primary/15 text-ink/70 bg-black/[0.02]">
                Contact Info Card
              </span>
            </div>
            <p className="text-[11px] font-sans text-ink/55 mt-0.5">
              {document.purpose}
            </p>

            {/* Read-only Data Fields */}
            <div className="mt-2.5 grid grid-cols-1 sm:grid-cols-3 gap-2 p-2.5 rounded-[12px] bg-neutral border border-black/[0.05] text-xs font-sans">
              <div className="flex items-center gap-2 min-w-0">
                <User className="w-3.5 h-3.5 text-ink/50 flex-shrink-0" />
                <div className="truncate">
                  <span className="text-[10px] text-ink/50 block">Contact Name</span>
                  <span className="text-ink font-normal truncate block">
                    {document.dataFields.name}
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-2 min-w-0">
                <HeartHandshake className="w-3.5 h-3.5 text-ink/50 flex-shrink-0" />
                <div className="truncate">
                  <span className="text-[10px] text-ink/50 block">Relation</span>
                  <span className="text-ink font-normal truncate block">
                    {document.dataFields.relation}
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-2 min-w-0">
                <Phone className="w-3.5 h-3.5 text-ink/50 flex-shrink-0" />
                <div className="truncate">
                  <span className="text-[10px] text-ink/50 block">Phone</span>
                  <span className="text-ink font-normal truncate block">
                    {document.dataFields.phone}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Status & Action */}
          <div className="flex sm:flex-col items-center sm:items-end justify-between sm:justify-start gap-2 flex-shrink-0 pt-1">
            <div>
              {document.status === 'Approved' && (
                <span className="inline-flex items-center gap-1 font-sans text-[10px] leading-tight px-2 py-0.5 rounded-full bg-primary text-white font-normal">
                  <Check className="w-2.5 h-2.5 stroke-[2.5]" />
                  Approved
                </span>
              )}
              {document.status === 'Rejected' && (
                <span className="inline-flex items-center gap-1 font-sans text-[10px] leading-tight px-2 py-0.5 rounded-full bg-white border border-primary text-primary">
                  <X className="w-2.5 h-2.5 stroke-[2.5]" />
                  Rejected
                </span>
              )}
              {document.status === 'Pending' && (
                <span className="inline-flex items-center font-sans text-[10px] leading-tight px-2 py-0.5 rounded-full bg-secondary/18 text-primary border border-secondary/35">
                  Pending
                </span>
              )}
            </div>

            <ChangeStatusControl
              status={document.status}
              documentId={document.id}
              documentName={document.name}
              onApprove={onApprove}
              onStartReject={() => setIsRejecting(true)}
            />
          </div>
        </div>

        {/* Inline Reject Form */}
        {isRejecting && (
          <div className="mt-3 p-3 rounded-[12px] bg-neutral border border-primary/10 space-y-2">
            <span className="text-[11px] font-sans text-ink block">Reason for rejection:</span>
            <CustomSelect
              value={rejectReason}
              onChange={(e) => setRejectReason(e.target.value)}
              className="w-full text-xs font-sans px-2.5 py-1.5 rounded-[8px] border border-primary/15 bg-white text-ink focus:outline-none focus:ring-2 focus:ring-secondary"
            >
              {REJECT_REASONS.map((r) => (
                <option key={r} value={r}>
                  {r}
                </option>
              ))}
            </CustomSelect>
            <input
              type="text"
              value={rejectRemarks}
              onChange={(e) => setRejectRemarks(e.target.value)}
              placeholder="Optional remarks..."
              className="w-full text-xs font-sans px-2.5 py-1.5 rounded-[8px] border border-primary/15 bg-white text-ink placeholder:text-ink/40 focus:outline-none focus:ring-2 focus:ring-secondary"
            />
            <div className="flex items-center justify-end gap-2 pt-1">
              <button
                type="button"
                onClick={() => setIsRejecting(false)}
                className="px-3 py-1 rounded-full text-[11px] font-sans bg-white border border-primary/15 text-ink hover:bg-neutral"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmReject}
                className="px-3 py-1 rounded-full text-[11px] font-sans bg-primary text-white hover:opacity-90"
              >
                Confirm Reject
              </button>
            </div>
          </div>
        )}
      </div>
    );
  }

  // Standard File Document Card
  return (
    <div className="p-3.5 rounded-[16px] border border-primary/10 bg-white transition-all shadow-xs flex flex-col justify-between">
      <div>
        <div className="flex items-start gap-3">
          {/* 56px Square Thumbnail button labelled "Preview" with clean theme styling */}
          <button
            type="button"
            onClick={() => onPreview(document.name)}
            className="w-[56px] h-[56px] rounded-[12px] bg-neutral/80 hover:bg-secondary/15 flex-shrink-0 flex flex-col items-center justify-center cursor-pointer transition-colors group focus:outline-none focus:ring-2 focus:ring-secondary border border-primary/10 shadow-2xs"
            aria-label={`Preview ${document.name}`}
          >
            <Eye className="w-4 h-4 text-secondary group-hover:text-primary mb-0.5 transition-colors" />
            <span className="text-[10px] font-sans font-medium text-ink/70 group-hover:text-primary leading-none transition-colors">
              Preview
            </span>
          </button>

          {/* Document Info */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-1.5 flex-wrap">
              <h5 className="font-sans text-[13px] font-medium text-ink truncate" title={document.name}>
                {document.name}
              </h5>

              {/* Requirement Badge: Required (black pill) or Optional / Conditional (outline pill) */}
              {document.requirement === 'Required' ? (
                <span className="px-2 py-0.2 rounded-full text-[9px] font-sans bg-primary text-white leading-tight">
                  Required
                </span>
              ) : document.requirement === 'Optional' ? (
                <span className="px-2 py-0.2 rounded-full text-[9px] font-sans border border-primary/40 text-primary bg-white leading-tight">
                  Optional
                </span>
              ) : (
                <span className="px-2 py-0.2 rounded-full text-[9px] font-sans border border-primary/40 text-primary bg-white leading-tight">
                  Conditional
                </span>
              )}

              {/* Tag (e.g. "Signed copy" or "Category specific") */}
              {document.tag && (
                <span className="px-1.5 py-0.2 rounded-full text-[9px] font-sans bg-secondary/18 text-primary border border-secondary/35 font-normal leading-tight">
                  {document.tag}
                </span>
              )}
            </div>

            {/* Purpose */}
            <p className="text-[11px] font-sans text-ink/55 mt-0.5 leading-snug">
              {document.purpose}
            </p>

            {/* Status Badge */}
            <div className="mt-1.5 flex items-center gap-2 flex-wrap">
              {document.status === 'Approved' && (
                <span className="inline-flex items-center gap-1 font-sans text-[10px] leading-tight px-2 py-0.5 rounded-full bg-primary text-white">
                  <Check className="w-2.5 h-2.5 stroke-[2.5]" />
                  Approved
                </span>
              )}
              {document.status === 'Rejected' && (
                <span className="inline-flex items-center gap-1 font-sans text-[10px] leading-tight px-2 py-0.5 rounded-full bg-white border border-primary text-primary">
                  <X className="w-2.5 h-2.5 stroke-[2.5]" />
                  Rejected
                </span>
              )}
              {document.status === 'Pending' && (
                <span className="inline-flex items-center font-sans text-[10px] leading-tight px-2 py-0.5 rounded-full bg-secondary/18 text-primary border border-secondary/35">
                  Pending
                </span>
              )}

              {document.rejectReason && (
                <span className="text-[10px] text-ink/60 truncate">
                  · {document.rejectReason}
                </span>
              )}
            </div>
          </div>
        </div>

        {/* GST Note / Hint */}
        {document.hint && (
          <div className="mt-2 text-[10px] font-sans text-ink/65 bg-neutral p-1.5 rounded-[8px] border border-black/[0.05] flex items-start gap-1">
            <span className="font-medium text-ink">Note:</span>
            <span>{document.hint}</span>
          </div>
        )}
      </div>

      {/* Action Buttons: Status-aware actions */}
      <div className="flex items-center justify-end gap-1.5 mt-3 pt-2 border-t border-black/[0.05]">
        <ChangeStatusControl
          status={document.status}
          documentId={document.id}
          documentName={document.name}
          onApprove={onApprove}
          onStartReject={() => setIsRejecting(true)}
        />
      </div>

      {/* Inline Reject Form */}
      {isRejecting && (
        <div className="mt-2.5 p-2.5 rounded-[12px] bg-neutral border border-primary/10 space-y-2">
          <span className="text-[11px] font-sans text-ink block">Reason for rejection:</span>
          <CustomSelect
            value={rejectReason}
            onChange={(e) => setRejectReason(e.target.value)}
            className="w-full text-xs font-sans px-2.5 py-1.5 rounded-[8px] border border-primary/15 bg-white text-ink focus:outline-none focus:ring-2 focus:ring-secondary"
          >
            {REJECT_REASONS.map((r) => (
              <option key={r} value={r}>
                {r}
              </option>
            ))}
          </CustomSelect>
          <input
            type="text"
            value={rejectRemarks}
            onChange={(e) => setRejectRemarks(e.target.value)}
            placeholder="Optional remarks..."
            className="w-full text-xs font-sans px-2.5 py-1.5 rounded-[8px] border border-primary/15 bg-white text-ink placeholder:text-ink/40 focus:outline-none focus:ring-2 focus:ring-secondary"
          />
          <div className="flex items-center justify-end gap-2 pt-1">
            <button
              type="button"
              onClick={() => setIsRejecting(false)}
              className="px-3 py-1 rounded-full text-[11px] font-sans bg-white border border-primary/15 text-ink hover:bg-neutral"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleConfirmReject}
              className="px-3 py-1 rounded-full text-[11px] font-sans bg-primary text-white hover:opacity-90"
            >
              Confirm Reject
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
