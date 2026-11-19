import React, { useState, useRef, useEffect } from 'react';
import { ManagementVendor, ManagementRider } from '../../data/mockManagementData';
import { MoreVertical, Star, FileText, Edit2, Ban, CheckCircle2, Power } from 'lucide-react';

interface PersonRowProps {
  type: 'vendor' | 'rider';
  item: ManagementVendor | ManagementRider;
  onView: () => void;
  onEdit: () => void;
  onSuspend: () => void;
  onReactivate: () => void;
  onSetInactive: () => void;
  onSetActive: () => void;
  onOpenDocuments: () => void;
}

export const PersonRow: React.FC<PersonRowProps> = ({
  type,
  item,
  onView,
  onEdit,
  onSuspend,
  onReactivate,
  onSetInactive,
  onSetActive,
  onOpenDocuments,
}) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false);
      }
    };
    if (menuOpen) document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [menuOpen]);

  const isVendor = type === 'vendor';
  const vendor = isVendor ? (item as ManagementVendor) : null;
  const rider = !isVendor ? (item as ManagementRider) : null;

  const titleName = vendor ? vendor.storeName : rider?.name || '';
  const subText = vendor
    ? `${vendor.ownerName} · ${vendor.phone}`
    : rider?.phone || '';
  const isVerified = item.verificationStatus === 'Verified';

  // Badges:
  // Verified / Active = PRIMARY bg, white text
  // Pending = SECONDARY at 18% bg, PRIMARY text
  // Suspended = INK bg, white text
  // Rejected / Inactive = white bg + 1px PRIMARY border
  const verBadgeClass = {
    Verified: 'bg-primary text-white border-transparent',
    Pending: 'bg-secondary/18 text-primary border border-secondary/35',
    Rejected: 'bg-white text-primary border border-primary',
  }[item.verificationStatus];

  const accBadgeClass = {
    Active: 'bg-primary text-white border-transparent',
    Inactive: 'bg-white text-primary border border-primary',
    Suspended: 'bg-primary text-white border-transparent',
  }[item.status];

  return (
    <div className="w-full rounded-[20px] bg-white border border-primary/10 shadow-[0_2px_8px_rgba(18,55,71,0.03)] hover:border-secondary hover:bg-neutral/30 transition-all p-[10px_16px] select-none">
      <div className="grid grid-cols-[1fr_auto] min-[1280px]:grid-cols-[minmax(180px,2fr)_100px_80px_80px_90px_90px_80px_70px_36px] gap-2.5 items-center">
        {/* Col 1: Initials tile (SECONDARY) + store/rider name + subtext */}
        <div
          onClick={onView}
          className="flex items-center gap-3 min-w-0 cursor-pointer group"
        >
          <div className="w-[36px] h-[36px] rounded-[12px] bg-neutral text-primary font-sans text-xs flex items-center justify-center font-medium flex-shrink-0 group-hover:bg-primary group-hover:text-white transition-colors">
            {item.initials}
          </div>
          <div className="min-w-0">
            <h4 className="font-sans text-[13px] font-medium text-ink truncate leading-tight group-hover:text-primary transition-colors">
              {titleName}
            </h4>
            <p className="font-sans text-[11px] text-ink/55 truncate leading-tight mt-0.5">
              {subText}
            </p>
          </div>
        </div>

        {/* Col 2: Category (Vendor) or Vehicle (Rider) - hidden on mobile/small */}
        <div className="hidden min-[1280px]:block truncate">
          <span className="text-[12px] font-sans text-ink/80 font-normal">
            {isVendor
              ? vendor?.businessCategory
              : `${rider?.vehicleType} ${rider?.vehicleNumber !== '-' ? `(${rider?.vehicleNumber})` : ''}`}
          </span>
        </div>

        {/* Col 3: City - hidden on mobile/small */}
        <div className="hidden min-[1280px]:block truncate">
          <span className="text-[12px] font-sans text-ink/65 font-normal">
            {item.city}
          </span>
        </div>

        {/* Col 4: Products count (Vendor) or Availability (Rider) */}
        <div className="hidden min-[1280px]:block">
          {isVendor ? (
            <span className="text-[12px] font-sans text-ink/75">
              {vendor?.productsCount} items
            </span>
          ) : (
            <div className="flex items-center gap-1.5">
              <span
                className={`w-2 h-2 rounded-full flex-shrink-0 ${
                  rider?.availability === 'Online'
                    ? 'bg-primary'
                    : rider?.availability === 'On delivery'
                    ? 'bg-primary'
                    : 'bg-neutral'
                }`}
              />
              <span className="text-[11px] font-sans text-ink font-normal">
                {rider?.availability}
              </span>
            </div>
          )}
        </div>

        {/* Col 5: Verification badge */}
        <div className="hidden min-[1280px]:flex items-center">
          <span
            className={`px-2.5 py-0.5 rounded-full text-[10px] font-sans font-medium leading-tight ${verBadgeClass}`}
          >
            {item.verificationStatus}
          </span>
        </div>

        {/* Col 6: Account Status badge */}
        <div className="hidden min-[1280px]:flex items-center">
          <span
            className={`px-2.5 py-0.5 rounded-full text-[10px] font-sans font-medium leading-tight ${accBadgeClass}`}
          >
            {item.status}
          </span>
        </div>

        {/* Col 7: Orders count (Vendor) or Rating (Rider) */}
        <div className="hidden min-[1280px]:block text-right">
          {isVendor ? (
            <span className="text-[12px] font-sans text-ink/80 font-medium">
              {vendor?.ordersCount.toLocaleString()} orders
            </span>
          ) : (
            <div className="flex items-center justify-end gap-1">
              <Star className="w-3.5 h-3.5 fill-ink text-ink" />
              <span className="text-[12px] font-sans text-ink font-medium">
                {rider?.rating.toFixed(1)}
              </span>
            </div>
          )}
        </div>

        {/* Col 8: "View" button */}
        <div className="flex justify-end xs:flex hidden">
          <button
            type="button"
            onClick={onView}
            className="h-[32px] px-4 rounded-full text-xs font-sans bg-white border border-primary/15 text-ink hover:bg-neutral focus:ring-2 focus:ring-primary focus:outline-none transition-colors"
          >
            View
          </button>
        </div>

        {/* Col 9: Kebab menu (3 dots) */}
        <div className="relative flex justify-end" ref={menuRef}>
          <button
            type="button"
            onClick={() => setMenuOpen(!menuOpen)}
            className="w-8 h-8 rounded-full flex items-center justify-center text-ink/60 hover:text-ink hover:bg-neutral transition-colors focus:outline-none"
            aria-label="Options"
          >
            <MoreVertical className="w-4 h-4" />
          </button>

          {menuOpen && (
            <div className="absolute right-0 top-9 w-44 rounded-[14px] bg-white border border-primary/10 shadow-[0_10px_26px_rgba(18, 55, 71, 0.12)] p-1.5 z-30 text-xs font-sans">
              <button
                type="button"
                onClick={() => {
                  setMenuOpen(false);
                  onView();
                }}
                className="w-full flex items-center gap-2 px-2.5 py-1.5 rounded-[8px] hover:bg-neutral text-ink text-left"
              >
                View details
              </button>

              <button
                type="button"
                onClick={() => {
                  setMenuOpen(false);
                  onEdit();
                }}
                className="w-full flex items-center gap-2 px-2.5 py-1.5 rounded-[8px] hover:bg-neutral text-ink text-left"
              >
                <Edit2 className="w-3.5 h-3.5" />
                Edit
              </button>

              {/* Set Inactive / Set Active */}
              {item.status === 'Active' ? (
                <button
                  type="button"
                  onClick={() => {
                    setMenuOpen(false);
                    onSetInactive();
                  }}
                  className="w-full flex items-center gap-2 px-2.5 py-1.5 rounded-[8px] hover:bg-neutral text-ink text-left"
                >
                  <Power className="w-3.5 h-3.5" />
                  Set Inactive
                </button>
              ) : (
                <button
                  type="button"
                  disabled={!isVerified}
                  onClick={() => {
                    setMenuOpen(false);
                    onSetActive();
                  }}
                  title={!isVerified ? 'Verify documents first' : undefined}
                  className={`w-full flex items-center gap-2 px-2.5 py-1.5 rounded-[8px] text-left ${
                    isVerified
                      ? 'hover:bg-neutral text-ink'
                      : 'text-ink/35 cursor-not-allowed'
                  }`}
                >
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  Set Active
                </button>
              )}

              {/* Suspend / Block / Unblock */}
              {item.status === 'Suspended' ? (
                <button
                  type="button"
                  onClick={() => {
                    setMenuOpen(false);
                    onReactivate();
                  }}
                  className="w-full flex items-center gap-2 px-2.5 py-1.5 rounded-[8px] hover:bg-neutral text-ink text-left"
                >
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  Unblock (Reactivate)
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => {
                    setMenuOpen(false);
                    onSuspend();
                  }}
                  className="w-full flex items-center gap-2 px-2.5 py-1.5 rounded-[8px] hover:bg-neutral text-ink text-left"
                >
                  <Ban className="w-3.5 h-3.5" />
                  Suspend (Block)
                </button>
              )}

              {/* Open documents */}
              <button
                type="button"
                onClick={() => {
                  setMenuOpen(false);
                  onOpenDocuments();
                }}
                className="w-full flex items-center gap-2 px-2.5 py-1.5 rounded-[8px] hover:bg-neutral text-ink text-left border-t border-primary/10 mt-1 pt-1.5"
              >
                <FileText className="w-3.5 h-3.5" />
                Open documents
              </button>
            </div>
          )}
        </div>
      </div>

      {/* ──────────── LINE 2 FOR < 1280px (CHIPS) ──────────── */}
      <div className="flex min-[1280px]:hidden flex-wrap items-center gap-2 mt-2 pt-2 border-t border-primary/5 text-[11px] font-sans">
        {/* Category / Vehicle */}
        <span className="px-2 py-0.5 rounded-full bg-neutral text-ink/80 font-normal">
          {isVendor
            ? vendor?.businessCategory
            : `${rider?.vehicleType} ${rider?.vehicleNumber !== '-' ? `(${rider?.vehicleNumber})` : ''}`}
        </span>

        {/* City */}
        <span className="px-2 py-0.5 rounded-full bg-neutral text-ink/70">
          {item.city}
        </span>

        {/* Items / Availability */}
        {isVendor ? (
          <span className="px-2 py-0.5 rounded-full bg-neutral text-ink/75">
            {vendor?.productsCount} items
          </span>
        ) : (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-neutral text-ink">
            <span
              className={`w-1.5 h-1.5 rounded-full ${
                rider?.availability === 'Online'
                  ? 'bg-primary'
                  : rider?.availability === 'On delivery'
                  ? 'bg-primary'
                  : 'bg-neutral'
              }`}
            />
            {rider?.availability}
          </span>
        )}

        {/* Verification Status */}
        <span className={`px-2 py-0.5 rounded-full text-[10px] font-medium ${verBadgeClass}`}>
          {item.verificationStatus}
        </span>

        {/* Account Status */}
        <span className={`px-2 py-0.5 rounded-full text-[10px] font-medium ${accBadgeClass}`}>
          {item.status}
        </span>

        {/* Orders / Rating */}
        {isVendor ? (
          <span className="px-2 py-0.5 rounded-full bg-neutral text-ink/80 font-medium">
            {vendor?.ordersCount.toLocaleString()} orders
          </span>
        ) : (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-neutral text-ink font-medium">
            <Star className="w-3 h-3 fill-ink text-ink" />
            {rider?.rating.toFixed(1)}
          </span>
        )}

        {/* Full-width View Button on < 480px */}
        <div className="w-full xs:hidden pt-1.5">
          <button
            type="button"
            onClick={onView}
            className="w-full h-[32px] rounded-full text-xs font-sans bg-white border border-primary/15 text-ink hover:bg-neutral focus:ring-2 focus:ring-primary focus:outline-none transition-colors"
          >
            View details
          </button>
        </div>
      </div>
    </div>
  );
};
