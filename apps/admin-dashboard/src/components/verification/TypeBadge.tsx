import React from 'react';
import { ApplicantType } from '../../data/verification';

interface TypeBadgeProps {
  type: ApplicantType;
  className?: string;
}

export const TypeBadge: React.FC<TypeBadgeProps> = ({ type, className = '' }) => {
  if (type === 'Vendor') {
    return (
      <span
        className={`inline-flex items-center justify-center font-sans font-normal text-[11px] leading-tight px-3 py-1 rounded-full bg-primary text-white select-none ${className}`}
      >
        Vendor
      </span>
    );
  }

  return (
    <span
      className={`inline-flex items-center justify-center font-sans font-normal text-[11px] leading-tight px-3 py-1 rounded-full bg-white border border-primary/25 text-ink select-none ${className}`}
    >
      Rider
    </span>
  );
};
