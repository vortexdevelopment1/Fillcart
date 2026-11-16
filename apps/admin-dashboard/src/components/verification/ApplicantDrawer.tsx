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

  // Active document for Lightbox
  const [lightboxDoc, setLightboxDoc] = useState<VerificationDocument | null>(null);

  // Per-document rejection modal state
  const [rejectingDocId, setRejectingDocId] = useState<string | null>(null);
  const [rejectReason, setRejectReason] = useState('Blurry/Unreadable Document');
  const [rejectRemarks, setRejectRemarks] = useState('');

  // Overall rejection modal state
  const [isOverallRejectOpen, setIsOverallRejectOpen] = useState(false);
  const [overallRejectReason, setOverallRejectReason] = useState('Forged / Mismatched Documents');
  const [overallRejectRemarks, setOverallRejectRemarks] = useState('');

  // Re-upload request state
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
      {/* Lightbox for zooming documents */}
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
        className="fixed inset-0 bg-[#222026]/40 backdrop-blur-sm z-40 transition-opacity"
      />

      {/* Right Drawer */}
      <div className="fixed top-0 right-0 bottom-0 w-full max-w-2xl bg-white shadow-2xl z-50 flex flex-col overflow-hidden animate-slide-left border-l border-[#ECECF0]">
        {/* Drawer Header */}
        <div className="p-6 bg-[#F6F6F8] border-b border-[#ECECF0] flex items-start justify-between">
          <div className="flex items-center gap-4">
            <img
              src={applicant.avatar}
              alt={applicant.name}
              className="w-14 h-14 rounded-2xl object-cover ring-2 ring-white shadow-sm"
            />
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-bold text-[#222026]">{applicant.name}</h2>
                <span
                  className={`text-xs px-2.5 py-0.5 rounded-full font-semibold flex items-center gap-1 ${
                    applicant.type === 'Rider'
                      ? 'bg-[#FCE8A3] text-[#8A6500]'
                      : 'bg-[#222026] text-white'
                  }`}
                >
                  {applicant.type === 'Rider' ? (
                    <Bike className="w-3 h-3" />
                  ) : (
                    <Store className="w-3 h-3" />
                  )}
                  {applicant.type}
                </span>
              </div>
              <p className="text-xs text-[#8A8A93] mt-1">
                Applicant ID: <span className="font-mono text-[#222026]">{applicant.id}</span> •
                Submitted {applicant.submittedAt}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-10 h-10 rounded-full bg-white border border-[#ECECF0] flex items-center justify-center text-[#222026] hover:bg-red-50 hover:text-red-600 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Quick Contact & Info Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-4 bg-[#F6F6F8] rounded-2xl border border-[#ECECF0] text-xs">
            <div className="flex items-center gap-2 text-[#222026]">
              <Phone className="w-4 h-4 text-[#8A8A93]" />
              <span className="font-medium">{applicant.phone}</span>
            </div>
            <div className="flex items-center gap-2 text-[#222026]">
              <Mail className="w-4 h-4 text-[#8A8A93]" />
              <span className="font-medium truncate">{applicant.email}</span>
            </div>
            <div className="flex items-center gap-2 text-[#222026]">
              <MapPin className="w-4 h-4 text-[#8A8A93]" />
              <span>
                {applicant.city}, {applicant.state}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span className="font-semibold text-[#8A8A93]">Current Status:</span>
              <span
                className={`font-semibold px-2 py-0.5 rounded-full ${
                  applicant.status === 'Approved'
                    ? 'bg-emerald-100 text-emerald-800'
                    : applicant.status === 'Rejected'
                    ? 'bg-red-100 text-red-800'
                    : 'bg-[#FCE8A3] text-[#8A6500]'
                }`}
              >
                {applicant.status}
              </span>
            </div>
          </div>

          {/* Business or Vehicle Details Box */}
          {applicant.type === 'Rider' && applicant.vehicleDetails && (
            <div className="p-4 bg-white rounded-2xl border border-[#ECECF0] shadow-sm">
              <h4 className="text-xs font-bold text-[#8A8A93] uppercase tracking-wider mb-2">
                Vehicle Specifications
              </h4>
              <div className="grid grid-cols-3 gap-2 text-xs">
                <div>
                  <span className="text-[#8A8A93] block">Vehicle Model</span>
                  <span className="font-semibold text-[#222026]">{applicant.vehicleDetails.model}</span>
                </div>
                <div>
                  <span className="text-[#8A8A93] block">Plate Number</span>
                  <span className="font-mono font-bold text-[#222026]">
                    {applicant.vehicleDetails.plateNumber}
                  </span>
                </div>
                <div>
                  <span className="text-[#8A8A93] block">Class</span>
                  <span className="font-medium text-[#222026]">{applicant.vehicleDetails.type}</span>
                </div>
              </div>
            </div>
          )}

          {applicant.type === 'Vendor' && applicant.businessDetails && (
            <div className="p-4 bg-white rounded-2xl border border-[#ECECF0] shadow-sm">
              <h4 className="text-xs font-bold text-[#8A8A93] uppercase tracking-wider mb-2">
                Merchant & Storefront Details
              </h4>
              <div className="space-y-1.5 text-xs">
                <div>
                  <span className="text-[#8A8A93]">Store: </span>
                  <span className="font-bold text-[#222026]">
                    {applicant.businessDetails.storeName}
                  </span>
                  <span className="ml-2 px-2 py-0.5 bg-[#F6F6F8] rounded text-[#8A8A93]">
                    {applicant.businessDetails.category}
                  </span>
                </div>
                <div className="text-[#8A8A93]">
                  <span>Address: </span>
                  <span className="text-[#222026]">{applicant.businessDetails.address}</span>
                </div>
              </div>
            </div>
          )}

          {/* Document Verification Cards List */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-bold text-[#222026]">
                Verification Documents ({applicant.documents.length})
              </h3>
              <span className="text-xs text-[#8A8A93]">Click any preview to enlarge & inspect</span>
            </div>

            <div className="space-y-3">
              {applicant.documents.map((doc) => {
                const isDocRejecting = rejectingDocId === doc.id;

                return (
                  <div
                    key={doc.id}
                    className="p-4 rounded-2xl border border-[#ECECF0] bg-white hover:border-[#D8D8DF] transition-all shadow-sm"
                  >
                    <div className="flex items-start justify-between gap-4">
                      {/* Thumbnail Preview */}
                      <div
                        onClick={() => setLightboxDoc(doc)}
                        className="relative w-20 h-16 rounded-xl overflow-hidden bg-[#F6F6F8] border border-[#ECECF0] flex-shrink-0 cursor-pointer group shadow-inner"
                      >
                        <img
                          src={doc.previewUrl}
                          alt={doc.name}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform"
                        />
                        <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white">
                          <Eye className="w-5 h-5" />
                        </div>
                      </div>

                      {/* Document Meta */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <h4 className="text-sm font-semibold text-[#222026] truncate">
                            {doc.name}
                          </h4>
                          <span
                            className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                              doc.status === 'Approved'
                                ? 'bg-emerald-100 text-emerald-800'
                                : doc.status === 'Rejected'
                                ? 'bg-red-100 text-red-800'
                                : 'bg-[#FCE8A3] text-[#8A6500]'
                            }`}
                          >
                            {doc.status}
                          </span>
                        </div>

                        {doc.documentNumber && (
                          <p className="text-xs text-[#8A8A93] font-mono mt-0.5">
                            Number: {doc.documentNumber}
                          </p>
                        )}
                        <p className="text-[11px] text-[#8A8A93] mt-0.5">
                          Uploaded: {doc.uploadedAt}
                        </p>

                        {/* Rejection remarks if rejected */}
                        {doc.rejectReason && (
                          <div className="mt-2 p-2 bg-red-50 rounded-lg text-xs text-red-700 border border-red-100">
                            <span className="font-semibold">{doc.rejectReason}: </span>
                            {doc.rejectRemarks || 'Please upload a clearer copy'}
                          </div>
                        )}
                      </div>

                      {/* Per-document Approve / Reject Actions */}
                      <div className="flex items-center gap-1.5 flex-shrink-0">
                        <button
                          onClick={() => approveDocument(applicant.id, doc.id)}
                          className={`p-2 rounded-xl transition-all ${
                            doc.status === 'Approved'
                              ? 'bg-emerald-600 text-white shadow'
                              : 'bg-[#F6F6F8] text-[#222026] hover:bg-emerald-50 hover:text-emerald-700'
                          }`}
                          title="Approve Document"
                        >
                          <CheckCircle className="w-5 h-5" />
                        </button>
                        <button
                          onClick={() => setRejectingDocId(isDocRejecting ? null : doc.id)}
                          className={`p-2 rounded-xl transition-all ${
                            doc.status === 'Rejected'
                              ? 'bg-red-600 text-white shadow'
                              : 'bg-[#F6F6F8] text-[#222026] hover:bg-red-50 hover:text-red-700'
                          }`}
                          title="Reject Document"
                        >
                          <XCircle className="w-5 h-5" />
                        </button>
                      </div>
                    </div>

                    {/* Inline Reject Form for this Document */}
                    {isDocRejecting && (
                      <div className="mt-3 pt-3 border-t border-[#ECECF0] space-y-2 animate-fade-in bg-[#FFF8F8] p-3 rounded-xl border border-red-100">
                        <label className="text-xs font-semibold text-red-900 block">
                          Reason for Document Rejection
                        </label>
                        <select
                          value={rejectReason}
                          onChange={(e) => setRejectReason(e.target.value)}
                          className="w-full text-xs p-2 rounded-lg border border-red-200 bg-white focus:outline-none focus:ring-2 focus:ring-red-400"
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
                          className="w-full text-xs p-2 rounded-lg border border-red-200 bg-white focus:outline-none focus:ring-2 focus:ring-red-400 resize-none"
                        />
                        <div className="flex justify-end gap-2 pt-1">
                          <button
                            onClick={() => setRejectingDocId(null)}
                            className="px-3 py-1 text-xs text-[#8A8A93] hover:text-[#222026]"
                          >
                            Cancel
                          </button>
                          <button
                            onClick={() => handleDocRejectSubmit(doc.id)}
                            className="px-3 py-1 bg-red-600 text-white rounded-lg text-xs font-semibold hover:bg-red-700 shadow"
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

          {/* Activity Timeline (Submitted -> Under review -> Approved/Rejected) */}
          <div className="p-4 bg-[#F6F6F8] rounded-2xl border border-[#ECECF0]">
            <h4 className="text-xs font-bold text-[#222026] mb-3 flex items-center gap-1.5">
              <Clock className="w-4 h-4 text-[#8A8A93]" />
              Verification Activity Timeline
            </h4>
            <div className="space-y-4 relative before:absolute before:left-[11px] before:top-2 before:bottom-2 before:w-[2px] before:bg-[#ECECF0]">
              {applicant.timeline.map((item, idx) => (
                <div key={idx} className="flex items-start gap-3 relative z-10 text-xs">
                  <div
                    className={`w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 text-white shadow-sm ${
                      item.status === 'completed'
                        ? 'bg-emerald-500'
                        : item.status === 'current'
                        ? 'bg-[#F5B800] ring-4 ring-[#FCE8A3]'
                        : 'bg-[#C4C4CC]'
                    }`}
                  >
                    <CheckCircle className="w-3.5 h-3.5" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-[#222026]">{item.title}</span>
                      <span className="text-[10px] text-[#8A8A93]">{item.timestamp}</span>
                    </div>
                    <p className="text-[#8A8A93] text-[11px] mt-0.5">{item.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Overall Actions Bar at Bottom */}
        <div className="p-5 bg-white border-t border-[#ECECF0] space-y-3">
          {/* Modal for Overall Rejection */}
          {isOverallRejectOpen && (
            <div className="p-4 mb-2 bg-red-50 rounded-2xl border border-red-200 animate-slide-up space-y-3">
              <div className="flex items-center gap-2 text-red-800 font-bold text-xs">
                <AlertTriangle className="w-4 h-4" />
                <span>Reject Entire Application</span>
              </div>
              <select
                value={overallRejectReason}
                onChange={(e) => setOverallRejectReason(e.target.value)}
                className="w-full text-xs p-2 rounded-lg border border-red-200 bg-white focus:outline-none"
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
                className="w-full text-xs p-2 rounded-lg border border-red-200 bg-white resize-none"
              />
              <div className="flex justify-end gap-2">
                <button
                  onClick={() => setIsOverallRejectOpen(false)}
                  className="px-3 py-1.5 text-xs text-[#8A8A93]"
                >
                  Cancel
                </button>
                <button
                  onClick={handleOverallRejectSubmit}
                  className="px-4 py-1.5 bg-red-600 text-white rounded-xl text-xs font-semibold hover:bg-red-700 shadow"
                >
                  Confirm Reject All
                </button>
              </div>
            </div>
          )}

          {/* Modal for Re-upload Request */}
          {isReuploadOpen && (
            <div className="p-4 mb-2 bg-[#FFF9E6] rounded-2xl border border-[#FCE8A3] animate-slide-up space-y-3">
              <div className="flex items-center gap-2 text-[#8A6500] font-bold text-xs">
                <RotateCcw className="w-4 h-4" />
                <span>Request Document Re-upload</span>
              </div>
              <textarea
                value={reuploadRemarks}
                onChange={(e) => setReuploadRemarks(e.target.value)}
                rows={2}
                className="w-full text-xs p-2 rounded-lg border border-[#FCE8A3] bg-white resize-none focus:outline-none"
              />
              <div className="flex justify-end gap-2">
                <button
                  onClick={() => setIsReuploadOpen(false)}
                  className="px-3 py-1.5 text-xs text-[#8A8A93]"
                >
                  Cancel
                </button>
                <button
                  onClick={handleReuploadSubmit}
                  className="px-4 py-1.5 bg-[#F5B800] text-[#222026] rounded-xl text-xs font-bold hover:bg-[#D49E00] shadow flex items-center gap-1.5"
                >
                  <Send className="w-3.5 h-3.5" />
                  Send Re-upload Request
                </button>
              </div>
            </div>
          )}

          {/* Action Buttons: Approve All, Reject Application, Request Re-upload */}
          <div className="flex flex-col sm:flex-row items-center gap-2.5">
            <button
              onClick={() => approveAllDocuments(applicant.id)}
              className="w-full sm:flex-1 py-3 px-4 rounded-2xl bg-[#F5B800] hover:bg-[#D49E00] text-[#222026] font-bold text-sm shadow-md transition-all hover:scale-[1.01] flex items-center justify-center gap-2 focus:ring-2 focus:ring-[#F5B800]"
            >
              <CheckCircle className="w-4 h-4" />
              Approve All Documents
            </button>

            <button
              onClick={() => setIsReuploadOpen(!isReuploadOpen)}
              className="w-full sm:w-auto py-3 px-4 rounded-2xl bg-[#F6F6F8] hover:bg-[#ECECF0] text-[#222026] font-semibold text-xs border border-[#ECECF0] transition-colors flex items-center justify-center gap-1.5"
            >
              <RotateCcw className="w-4 h-4" />
              Request Re-upload
            </button>

            <button
              onClick={() => setIsOverallRejectOpen(!isOverallRejectOpen)}
              className="w-full sm:w-auto py-3 px-4 rounded-2xl bg-red-50 hover:bg-red-100 text-red-700 font-semibold text-xs border border-red-200 transition-colors flex items-center justify-center gap-1.5"
            >
              <XCircle className="w-4 h-4" />
              Reject Application
            </button>
          </div>
        </div>
      </div>
    </>
  );
};
