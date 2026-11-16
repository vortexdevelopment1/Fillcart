import React, { useState } from 'react';
import {
  X,
  CheckCircle,
  XCircle,
  Eye,
  AlertTriangle,
  RotateCcw,
  Bike,
  Store,
  Phone,
  Mail,
  MapPin,
  Clock,
  Send,
} from 'lucide-react';
import { Applicant, VerificationDocument } from '../../types';
import { useVerification } from '../../context/VerificationContext';
import { DocumentLightbox } from './DocumentLightbox';

interface ApplicantDrawerProps {
  applicant: Applicant | null;
  isOpen: boolean;
  onClose: () => void;
}

export const ApplicantDrawer: React.FC<ApplicantDrawerProps> = ({
  applicant,
  isOpen,
  onClose,
}) => {
  const {
    approveDocument,
    rejectDocument,
    approveAllDocuments,
    rejectApplication,
    requestReupload,
  } = useVerification();

  const [lightboxDoc, setLightboxDoc] = useState<VerificationDocument | null>(null);
  const [rejectingDocId, setRejectingDocId] = useState<string | null>(null);
  const [rejectReason, setRejectReason] = useState('Blurry/Unreadable Document');
  const [rejectRemarks, setRejectRemarks] = useState('');

  const [isOverallRejectOpen, setIsOverallRejectOpen] = useState(false);
  const [overallRejectReason, setOverallRejectReason] = useState('Forged / Mismatched Documents');
  const [overallRejectRemarks, setOverallRejectRemarks] = useState('');

  const [isReuploadOpen, setIsReuploadOpen] = useState(false);
  const [reuploadRemarks, setReuploadRemarks] = useState(
    'Please re-upload clearer photos of rejected documents without flash glare.'
  );

  if (!isOpen || !applicant) return null;

  const handleDocRejectSubmit = (docId: string) => {
    rejectDocument(applicant.id, docId, rejectReason, rejectRemarks);
    setRejectingDocId(null);
    setRejectRemarks('');
  };

  const handleOverallRejectSubmit = () => {
    rejectApplication(applicant.id, overallRejectReason, overallRejectRemarks);
    setIsOverallRejectOpen(false);
  };

  const handleReuploadSubmit = () => {
    requestReupload(applicant.id, reuploadRemarks);
    setIsReuploadOpen(false);
  };

  return (
    <>
      {lightboxDoc && (
        <DocumentLightbox
          isOpen={!!lightboxDoc}
          onClose={() => setLightboxDoc(null)}
          documentName={lightboxDoc.name}
          imageUrl={lightboxDoc.previewUrl}
          documentNumber={lightboxDoc.documentNumber}
        />
      )}

      {/* Backdrop */}
      <div
        onClick={onClose}
        className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40 transition-opacity"
      />

      {/* Right Drawer */}
      <div className="fixed top-0 right-0 bottom-0 w-full max-w-2xl bg-white shadow-2xl z-50 flex flex-col overflow-hidden animate-slide-left border-l border-black/[0.08]">
        {/* Drawer Header */}
        <div className="p-6 bg-white border-b border-black/[0.08] flex items-start justify-between">
          <div className="flex items-center gap-4">
            <img
              src={applicant.avatar}
              alt={applicant.name}
              className="w-14 h-14 rounded-2xl object-cover ring-1 ring-black/[0.08] shadow-sm"
            />
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-bold text-black">{applicant.name}</h2>
                <span
                  className={`text-xs px-2.5 py-0.5 rounded-full font-semibold flex items-center gap-1 ${
                    applicant.type === 'Rider'
                      ? 'bg-secondary text-black'
                      : 'bg-black text-white'
                  }`}
                >
                  {applicant.type === 'Rider' ? (
                    <Bike className="w-3 h-3 text-black" />
                  ) : (
                    <Store className="w-3 h-3 text-white" />
                  )}
                  {applicant.type}
                </span>
              </div>
              <p className="text-xs text-black/55 mt-1">
                Applicant ID: <span className="font-mono text-black">{applicant.id}</span> •
                Submitted {applicant.submittedAt}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-10 h-10 rounded-full bg-white border border-black/[0.08] flex items-center justify-center text-black hover:bg-black/[0.04] transition-colors"
          >
            <X className="w-5 h-5 text-black" />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-white">
          {/* Quick Contact & Info Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-4 bg-white rounded-2xl border border-black/[0.08] text-xs">
            <div className="flex items-center gap-2 text-black">
              <Phone className="w-4 h-4 text-black/55" />
              <span className="font-medium">{applicant.phone}</span>
            </div>
            <div className="flex items-center gap-2 text-black">
              <Mail className="w-4 h-4 text-black/55" />
              <span className="font-medium truncate">{applicant.email}</span>
            </div>
            <div className="flex items-center gap-2 text-black">
              <MapPin className="w-4 h-4 text-black/55" />
              <span>
                {applicant.city}, {applicant.state}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span className="font-semibold text-black/55">Current Status:</span>
              <span
                className={`font-semibold px-2 py-0.5 rounded-full ${
                  applicant.status === 'Approved'
                    ? 'bg-secondary text-black'
                    : applicant.status === 'Rejected'
                    ? 'bg-white text-black border border-black'
                    : 'bg-secondary text-black'
                }`}
              >
                {applicant.status}
              </span>
            </div>
          </div>

          {/* Details Box */}
          {applicant.type === 'Rider' && applicant.vehicleDetails && (
            <div className="p-4 bg-white rounded-2xl border border-black/[0.08] shadow-sm">
              <h4 className="text-xs font-bold text-black/55 uppercase tracking-wider mb-2">
                Vehicle Specifications
              </h4>
              <div className="grid grid-cols-3 gap-2 text-xs">
                <div>
                  <span className="text-black/55 block">Vehicle Model</span>
                  <span className="font-semibold text-black">{applicant.vehicleDetails.model}</span>
                </div>
                <div>
                  <span className="text-black/55 block">Plate Number</span>
                  <span className="font-mono font-bold text-black">
                    {applicant.vehicleDetails.plateNumber}
                  </span>
                </div>
                <div>
                  <span className="text-black/55 block">Class</span>
                  <span className="font-medium text-black">{applicant.vehicleDetails.type}</span>
                </div>
              </div>
            </div>
          )}

          {applicant.type === 'Vendor' && applicant.businessDetails && (
            <div className="p-4 bg-white rounded-2xl border border-black/[0.08] shadow-sm">
              <h4 className="text-xs font-bold text-black/55 uppercase tracking-wider mb-2">
                Merchant & Storefront Details
              </h4>
              <div className="space-y-1.5 text-xs">
                <div>
                  <span className="text-black/55">Store: </span>
                  <span className="font-bold text-black">
                    {applicant.businessDetails.storeName}
                  </span>
                  <span className="ml-2 px-2 py-0.5 bg-black/[0.04] rounded text-black/55">
                    {applicant.businessDetails.category}
                  </span>
                </div>
                <div className="text-black/55">
                  <span>Address: </span>
                  <span className="text-black">{applicant.businessDetails.address}</span>
                </div>
              </div>
            </div>
          )}

          {/* Document Verification Cards List */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-bold text-black">
                Verification Documents ({applicant.documents.length})
              </h3>
              <span className="text-xs text-black/55">Click any preview to enlarge & inspect</span>
            </div>

            <div className="space-y-3">
              {applicant.documents.map((doc) => {
                const isDocRejecting = rejectingDocId === doc.id;

                return (
                  <div
                    key={doc.id}
                    className="p-4 rounded-2xl border border-black/[0.08] bg-white hover:border-black/[0.2] transition-all shadow-sm"
                  >
                    <div className="flex items-start justify-between gap-4">
                      {/* Thumbnail Preview */}
                      <div
                        onClick={() => setLightboxDoc(doc)}
                        className="relative w-20 h-16 rounded-xl overflow-hidden bg-white border border-black/[0.08] flex-shrink-0 cursor-pointer group shadow-inner"
                      >
                        <img
                          src={doc.previewUrl}
                          alt={doc.name}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform"
                        />
                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white">
                          <Eye className="w-5 h-5 text-white" />
                        </div>
                      </div>

                      {/* Document Meta */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <h4 className="text-sm font-semibold text-black truncate">
                            {doc.name}
                          </h4>
                          <span
                            className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                              doc.status === 'Approved'
                                ? 'bg-secondary text-black'
                                : doc.status === 'Rejected'
                                ? 'bg-white text-black border border-black'
                                : 'bg-secondary text-black'
                            }`}
                          >
                            {doc.status}
                          </span>
                        </div>

                        {doc.documentNumber && (
                          <p className="text-xs text-black/55 font-mono mt-0.5">
                            Number: {doc.documentNumber}
                          </p>
                        )}
                        <p className="text-[11px] text-black/55 mt-0.5">
                          Uploaded: {doc.uploadedAt}
                        </p>

                        {/* Rejection remarks */}
                        {doc.rejectReason && (
                          <div className="mt-2 p-2 bg-white rounded-lg text-xs text-black border border-black">
                            <span className="font-semibold">{doc.rejectReason}: </span>
                            {doc.rejectRemarks || 'Please upload a clearer copy'}
                          </div>
                        )}
                      </div>

                      {/* Per-document Actions */}
                      <div className="flex items-center gap-1.5 flex-shrink-0">
                        <button
                          onClick={() => approveDocument(applicant.id, doc.id)}
                          className={`p-2 rounded-xl transition-all ${
                            doc.status === 'Approved'
                              ? 'bg-primary text-black shadow'
                              : 'bg-white text-black border border-black/[0.08] hover:bg-secondary'
                          }`}
                          title="Approve Document"
                        >
                          <CheckCircle className="w-5 h-5 text-black" />
                        </button>
                        <button
                          onClick={() => setRejectingDocId(isDocRejecting ? null : doc.id)}
                          className={`p-2 rounded-xl transition-all ${
                            doc.status === 'Rejected'
                              ? 'bg-black text-white shadow'
                              : 'bg-white text-black border border-black/[0.08] hover:bg-black hover:text-white'
                          }`}
                          title="Reject Document"
                        >
                          <XCircle className="w-5 h-5" />
                        </button>
                      </div>
                    </div>

                    {/* Inline Reject Form */}
                    {isDocRejecting && (
                      <div className="mt-3 pt-3 border-t border-black/[0.08] space-y-2 animate-fade-in bg-white p-3 rounded-xl border border-black">
                        <label className="text-xs font-semibold text-black block">
                          Reason for Document Rejection
                        </label>
                        <select
                          value={rejectReason}
                          onChange={(e) => setRejectReason(e.target.value)}
                          className="w-full text-xs p-2 rounded-lg border border-black/[0.12] bg-white text-black focus:outline-none focus:ring-2 focus:ring-primary"
                        >
                          <option>Blurry/Unreadable Document</option>
                          <option>Expired Document</option>
                          <option>Name Mismatch with PAN/Profile</option>
                          <option>Invalid Document Type Uploaded</option>
                          <option>Cropped / Incomplete Certificate</option>
                          <option>Suspected Document Tampering</option>
                        </select>
                        <textarea
                          placeholder="Optional remarks for applicant..."
                          value={rejectRemarks}
                          onChange={(e) => setRejectRemarks(e.target.value)}
                          rows={2}
                          className="w-full text-xs p-2 rounded-lg border border-black/[0.12] bg-white text-black focus:outline-none focus:ring-2 focus:ring-primary resize-none"
                        />
                        <div className="flex justify-end gap-2 pt-1">
                          <button
                            onClick={() => setRejectingDocId(null)}
                            className="px-3 py-1 text-xs text-black/55 hover:text-black"
                          >
                            Cancel
                          </button>
                          <button
                            onClick={() => handleDocRejectSubmit(doc.id)}
                            className="px-3 py-1 bg-black text-white rounded-lg text-xs font-semibold hover:bg-black/80 shadow"
                          >
                            Confirm Rejection
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Activity Timeline */}
          <div className="p-4 bg-white rounded-2xl border border-black/[0.08]">
            <h4 className="text-xs font-bold text-black mb-3 flex items-center gap-1.5">
              <Clock className="w-4 h-4 text-black/55" />
              Verification Activity Timeline
            </h4>
            <div className="space-y-4 relative before:absolute before:left-[11px] before:top-2 before:bottom-2 before:w-[2px] before:bg-black/[0.08]">
              {applicant.timeline.map((item, idx) => (
                <div key={idx} className="flex items-start gap-3 relative z-10 text-xs">
                  <div
                    className={`w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 text-black shadow-sm ${
                      item.status === 'completed'
                        ? 'bg-secondary'
                        : item.status === 'current'
                        ? 'bg-primary'
                        : 'bg-black/[0.12]'
                    }`}
                  >
                    <CheckCircle className="w-3.5 h-3.5 text-black" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-black">{item.title}</span>
                      <span className="text-[10px] text-black/55">{item.timestamp}</span>
                    </div>
                    <p className="text-black/55 text-[11px] mt-0.5">{item.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Overall Actions Bar */}
        <div className="p-5 bg-white border-t border-black/[0.08] space-y-3">
          {/* Modal for Overall Rejection */}
          {isOverallRejectOpen && (
            <div className="p-4 mb-2 bg-white rounded-2xl border border-black space-y-3">
              <div className="flex items-center gap-2 text-black font-bold text-xs">
                <AlertTriangle className="w-4 h-4 text-black" />
                <span>Reject Entire Application</span>
              </div>
              <select
                value={overallRejectReason}
                onChange={(e) => setOverallRejectReason(e.target.value)}
                className="w-full text-xs p-2 rounded-lg border border-black/[0.12] bg-white text-black focus:outline-none"
              >
                <option>Forged / Mismatched Documents</option>
                <option>Failed Police Clearance / Background Check</option>
                <option>Multiple Document Non-Compliance</option>
                <option>Blacklisted Applicant</option>
              </select>
              <textarea
                placeholder="Official rejection notice sent to user..."
                value={overallRejectRemarks}
                onChange={(e) => setOverallRejectRemarks(e.target.value)}
                rows={2}
                className="w-full text-xs p-2 rounded-lg border border-black/[0.12] bg-white text-black resize-none"
              />
              <div className="flex justify-end gap-2">
                <button
                  onClick={() => setIsOverallRejectOpen(false)}
                  className="px-3 py-1.5 text-xs text-black/55"
                >
                  Cancel
                </button>
                <button
                  onClick={handleOverallRejectSubmit}
                  className="px-4 py-1.5 bg-black text-white rounded-xl text-xs font-semibold hover:bg-black/80 shadow"
                >
                  Confirm Reject All
                </button>
              </div>
            </div>
          )}

          {/* Modal for Re-upload Request */}
          {isReuploadOpen && (
            <div className="p-4 mb-2 bg-white rounded-2xl border border-primary space-y-3">
              <div className="flex items-center gap-2 text-black font-bold text-xs">
                <RotateCcw className="w-4 h-4 text-black" />
                <span>Request Document Re-upload</span>
              </div>
              <textarea
                value={reuploadRemarks}
                onChange={(e) => setReuploadRemarks(e.target.value)}
                rows={2}
                className="w-full text-xs p-2 rounded-lg border border-black/[0.12] bg-white text-black resize-none focus:outline-none"
              />
              <div className="flex justify-end gap-2">
                <button
                  onClick={() => setIsReuploadOpen(false)}
                  className="px-3 py-1.5 text-xs text-black/55"
                >
                  Cancel
                </button>
                <button
                  onClick={handleReuploadSubmit}
                  className="px-4 py-1.5 bg-primary text-black rounded-xl text-xs font-bold hover:bg-primary/90 shadow flex items-center gap-1.5"
                >
                  <Send className="w-3.5 h-3.5 text-black" />
                  Send Re-upload Request
                </button>
              </div>
            </div>
          )}

          {/* Bottom Action Buttons */}
          <div className="flex flex-col sm:flex-row items-center gap-2.5">
            <button
              onClick={() => approveAllDocuments(applicant.id)}
              className="w-full sm:flex-1 py-3 px-4 rounded-2xl bg-primary hover:bg-primary/90 text-black font-bold text-sm shadow-md transition-all hover:scale-[1.01] flex items-center justify-center gap-2 focus:ring-2 focus:ring-primary"
            >
              <CheckCircle className="w-4 h-4 text-black" />
              Approve All Documents
            </button>

            <button
              onClick={() => setIsReuploadOpen(!isReuploadOpen)}
              className="w-full sm:w-auto py-3 px-4 rounded-2xl bg-white hover:bg-black/[0.04] text-black font-semibold text-xs border border-black/[0.12] transition-colors flex items-center justify-center gap-1.5"
            >
              <RotateCcw className="w-4 h-4 text-black" />
              Request Re-upload
            </button>

            <button
              onClick={() => setIsOverallRejectOpen(!isOverallRejectOpen)}
              className="w-full sm:w-auto py-3 px-4 rounded-2xl bg-black hover:bg-black/80 text-white font-semibold text-xs transition-colors flex items-center justify-center gap-1.5"
            >
              <XCircle className="w-4 h-4 text-white" />
              Reject Application
            </button>
          </div>
        </div>
      </div>
    </>
  );
};
