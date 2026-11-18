import React from 'react';
import { VerificationStatus } from '../../data/verification';

interface StatusBadgeProps {
  status: VerificationStatus;
  className?: string;
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status, className = '' }) => {
  switch (status) {
    case 'Approved':
      return (
        <span
          className={`inline-flex items-center justify-center font-sans font-normal text-[11px] leading-tight px-3 py-1 rounded-[8px] bg-primary text-white select-none ${className}`}
        >
          Approved
        </span>
      );
    case 'Rejected':
      return (
        <span
          className={`inline-flex items-center justify-center font-sans font-normal text-[11px] leading-tight px-3 py-1 rounded-[8px] bg-white border border-primary text-primary select-none ${className}`}
        >
          Rejected
        </span>
      );
    case 'Reupload':
      return (
        <span
          className={`inline-flex items-center justify-center font-sans font-normal text-[11px] leading-tight px-3 py-1 rounded-[8px] bg-neutral border border-primary/20 text-primary select-none whitespace-nowrap ${className}`}
        >
          Re-upload asked
        </span>
      );
    case 'Pending':
    default:
      return (
        <span
          className={`inline-flex items-center justify-center font-sans font-normal text-[11px] leading-tight px-3 py-1 rounded-[8px] bg-secondary/18 text-primary border border-secondary/35 select-none ${className}`}
        >
          Pending
        </span>
      );
  }
};
