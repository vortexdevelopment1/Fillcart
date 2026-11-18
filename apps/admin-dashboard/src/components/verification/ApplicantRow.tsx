import React from 'react';
import { Applicant } from '../../data/verification';
import { TypeBadge } from './TypeBadge';
import { StatusBadge } from './StatusBadge';

interface ApplicantRowProps {
  applicant: Applicant;
  onReview: (applicant: Applicant) => void;
}

export const ApplicantRow: React.FC<ApplicantRowProps> = ({ applicant, onReview }) => {
  const applicableDocs = applicant.documents.filter((d) => !d.isNotApplicable);
  const approvedDocsCount = applicableDocs.filter((d) => d.status === 'Approved').length;
  const isPending = applicant.status === 'Pending';

  const extraMeta =
    applicant.type === 'Vendor'
      ? applicant.businessCategory
      : applicant.vehicleType;

  return (
    <div className="w-full rounded-[20px] bg-white border border-primary/10 shadow-[0_2px_8px_rgba(18,55,71,0.02)] hover:border-secondary hover:bg-neutral/30 transition-all p-[12px_18px] select-none">
      <div className="grid grid-cols-[1fr_auto] md:grid-cols-[minmax(180px,2fr)_80px_100px_minmax(130px,1.2fr)_120px_90px] gap-3 items-center">
        {/* Col 1: Initials tile (36px, radius 12, SECONDARY bg) + name + "City · phone · category" */}
        <div className="flex items-center gap-3 min-w-0">
          <div className="w-[36px] h-[36px] rounded-[12px] bg-neutral text-primary font-sans text-xs flex items-center justify-center font-medium flex-shrink-0 select-none">
            {applicant.initials}
          </div>
          <div className="min-w-0">
            <h4 className="font-sans text-[13px] font-normal text-ink truncate leading-tight">
              {applicant.name}
            </h4>
            <p className="font-sans text-[11px] text-ink/55 truncate leading-tight mt-0.5">
              {applicant.city} · {applicant.phone} {extraMeta ? `· ${extraMeta}` : ''}
            </p>
          </div>
        </div>

        {/* Col 2: Type badge (Rider / Vendor) - hidden on mobile */}
        <div className="hidden md:flex justify-start">
          <TypeBadge type={applicant.type} />
        </div>

        {/* Col 3: Submitted date (muted) - hidden on mobile */}
        <div className="hidden md:block">
          <span className="font-sans text-[12px] text-ink/55 whitespace-nowrap">
            {applicant.submittedAt}
          </span>
        </div>

        {/* Col 4: Documents progress: applicable ticks in a row + "x/y approved" - hidden on mobile */}
        <div className="hidden md:flex flex-col justify-center">
          <div className="flex items-center gap-[3px] w-full max-w-[130px]">
            {applicableDocs.map((doc) => {
              let tickColor = 'bg-neutral border border-primary/15'; // Pending
              if (doc.status === 'Approved') tickColor = 'bg-secondary';
              else if (doc.status === 'Rejected') tickColor = 'bg-secondary';

              return (
                <div
                  key={doc.id}
                  className={`h-[16px] flex-1 rounded-[2px] transition-colors ${tickColor}`}
                  title={`${doc.name}: ${doc.status}`}
                />
              );
            })}
          </div>
          <span className="font-sans text-[11px] text-ink/55 leading-none mt-1">
            {approvedDocsCount}/{applicableDocs.length} approved
          </span>
        </div>

        {/* Col 5: Status badge - hidden on mobile */}
        <div className="hidden md:flex justify-start">
          <StatusBadge status={applicant.status} />
        </div>

        {/* Col 6: "Review" button (pill, 34px) */}
        <div className="flex justify-end">
          <button
            type="button"
            onClick={() => onReview(applicant)}
            className={`h-[34px] px-5 rounded-full text-xs font-sans transition-all focus:outline-none focus:ring-2 focus:ring-primary whitespace-nowrap ${
              isPending
                ? 'bg-primary text-white hover:opacity-90 active:scale-95'
                : 'bg-white border border-primary/25 text-primary hover:bg-neutral active:scale-95'
            }`}
            aria-label={`Review documents for ${applicant.name}`}
          >
            Review
          </button>
        </div>
      </div>
    </div>
  );
};
