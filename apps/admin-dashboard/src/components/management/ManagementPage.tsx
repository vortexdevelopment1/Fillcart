import React, { useState, useMemo, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useVerification } from '../../context/VerificationContext';
import { ManagementVendor, ManagementRider } from '../../data/mockManagementData';
import { StatCardTotal } from './StatCardTotal';
import { StatCardActive } from './StatCardActive';
import { StatCardPending } from './StatCardPending';
import { StatCardSuspended } from './StatCardSuspended';
import { PersonRow } from './PersonRow';
import { ProfileModal } from './ProfileModal';
import { PersonFormModal } from './PersonFormModal';
import { ConfirmActionModal, ActionType } from './ConfirmActionModal';
import { PaginationControl } from '../common/PaginationControl';
import { Toast } from '../verification/Toast';
import { Search, Upload, Plus, ChevronDown } from 'lucide-react';

export interface ManagementPageConfig {
  type: 'vendor' | 'rider';
  title: string;
  subtitle: string;
  addBtnText: string;
  itemLabel: string; // "vendors" or "riders"
  categoriesOrVehicleTypes: string[];
  filter1Label: string; // "Category" or "Vehicle Type"
}

export const ManagementPage: React.FC<{ config: ManagementPageConfig }> = ({ config }) => {
  const navigate = useNavigate();
  const {
    vendors,
    riders,
    applicants,
    toastMessage,
    showToast,
    suspendPerson,
    reactivatePerson,
    setInactive,
    setActive,
    addPerson,
    editPerson,
  } = useVerification();

  const isVendor = config.type === 'vendor';
  const rawList: (ManagementVendor | ManagementRider)[] = isVendor ? vendors : riders;

  // ──────────── TOOLBAR FILTERS STATE ────────────
  const [searchInput, setSearchInput] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [filter1, setFilter1] = useState('All'); // Category (Vendor) or Vehicle Type (Rider)
  const [availabilityFilter, setAvailabilityFilter] = useState('All'); // Rider only
  const [accountStatusFilter, setAccountStatusFilter] = useState('All'); // All | Active | Inactive | Suspended
  const [verificationFilter, setVerificationFilter] = useState('All'); // All | Verified | Pending | Rejected

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(8);

  // Modal states
  const [viewItem, setViewItem] = useState<ManagementVendor | ManagementRider | null>(null);
  const [formItem, setFormItem] = useState<ManagementVendor | ManagementRider | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);

  // Confirm Action Modal
  const [confirmAction, setConfirmAction] = useState<ActionType | null>(null);
  const [actionTarget, setActionTarget] = useState<ManagementVendor | ManagementRider | null>(null);

  // Debounce search input by 200ms
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchInput);
      setCurrentPage(1);
    }, 200);
    return () => clearTimeout(timer);
  }, [searchInput]);

  // Combined filtering
  const filteredList = useMemo(() => {
    return rawList.filter((item) => {
      // 1. Filter 1: Category (Vendor) or Vehicle Type (Rider)
      if (filter1 !== 'All') {
        if (isVendor) {
          if ((item as ManagementVendor).businessCategory !== filter1) return false;
        } else {
          if ((item as ManagementRider).vehicleType !== filter1) return false;
        }
      }

      // 2. Rider Availability filter
      if (!isVendor && availabilityFilter !== 'All') {
        if ((item as ManagementRider).availability !== availabilityFilter) return false;
      }

      // 3. Account Status filter
      if (accountStatusFilter !== 'All' && item.status !== accountStatusFilter) {
        return false;
      }

      // 4. Verification filter
      if (verificationFilter !== 'All' && item.verificationStatus !== verificationFilter) {
        return false;
      }

      // 5. Debounced Search (name, city, phone, email)
      if (debouncedSearch.trim()) {
        const q = debouncedSearch.toLowerCase().trim();
        const nameVal = isVendor
          ? (item as ManagementVendor).storeName.toLowerCase()
          : (item as ManagementRider).name.toLowerCase();
        const ownerVal = isVendor
          ? (item as ManagementVendor).ownerName.toLowerCase()
          : '';
        const cityVal = item.city.toLowerCase();
        const phoneVal = item.phone.toLowerCase();
        const emailVal = item.email.toLowerCase();

        const match =
          nameVal.includes(q) ||
          ownerVal.includes(q) ||
          cityVal.includes(q) ||
          phoneVal.includes(q) ||
          emailVal.includes(q);

        if (!match) return false;
      }

      return true;
    });
  }, [
    rawList,
    isVendor,
    filter1,
    availabilityFilter,
    accountStatusFilter,
    verificationFilter,
    debouncedSearch,
  ]);

  // Paginated list
  const totalPages = Math.ceil(filteredList.length / pageSize) || 1;
  const paginatedList = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredList.slice(start, start + pageSize);
  }, [filteredList, currentPage, pageSize]);

  // ──────────── STATS CALCULATION (Live from store) ────────────
  const stats = useMemo(() => {
    let verified = 0;
    let pending = 0;
    let rejected = 0;
    let active = 0;
    let inactive = 0;
    let suspended = 0;

    rawList.forEach((item) => {
      if (item.verificationStatus === 'Verified') verified++;
      else if (item.verificationStatus === 'Rejected') rejected++;
      else pending++;

      if (isVendor) {
        if (item.status === 'Active') active++;
        else if (item.status === 'Suspended') suspended++;
        else inactive++;
      } else {
        // Riders: Online Now for card 2
        if ((item as ManagementRider).availability === 'Online') active++;
        if (item.status === 'Suspended') suspended++;
        if (item.status === 'Inactive') inactive++;
      }
    });

    const pendingPeople = rawList
      .filter((i) => i.verificationStatus === 'Pending')
      .map((i) => ({
        id: i.id,
        initials: i.initials,
        name: isVendor ? (i as ManagementVendor).storeName : (i as ManagementRider).name,
      }));

    return {
      total: rawList.length,
      verified,
      pending,
      rejected,
      active,
      inactive,
      suspended,
      pendingPeople,
    };
  }, [rawList, isVendor]);

  // Action handlers
  const handleOpenAction = (action: ActionType, target: ManagementVendor | ManagementRider) => {
    setActionTarget(target);
    setConfirmAction(action);
  };

  const handleConfirmAction = (reason?: string, remarks?: string) => {
    if (!actionTarget || !confirmAction) return;

    if (confirmAction === 'suspend') {
      suspendPerson(config.type, actionTarget.id, reason || 'Policy violation', remarks);
    } else if (confirmAction === 'reactivate') {
      reactivatePerson(config.type, actionTarget.id, remarks);
    } else if (confirmAction === 'set_inactive') {
      setInactive(config.type, actionTarget.id, reason);
    } else if (confirmAction === 'set_active') {
      setActive(config.type, actionTarget.id);
    }

    // If view modal was open on this item, update viewItem pointer
    if (viewItem && viewItem.id === actionTarget.id) {
      setTimeout(() => {
        const fresh = (isVendor ? vendors : riders).find((i) => i.id === actionTarget.id);
        if (fresh) setViewItem(fresh);
      }, 50);
    }

    setConfirmAction(null);
    setActionTarget(null);
  };

  const handleOpenDocuments = (target: ManagementVendor | ManagementRider) => {
    navigate(`/document-verification?type=${config.type}&id=${target.id}`);
  };

  // Find applicant documents for view modal
  const viewApplicantDocs = useMemo(() => {
    if (!viewItem) return undefined;
    const match = applicants.find(
      (a) => a.entityId === viewItem.id || a.name === (isVendor ? (viewItem as ManagementVendor).storeName : (viewItem as ManagementRider).name)
    );
    return match?.documents;
  }, [applicants, viewItem, isVendor]);

  return (
    <div className="w-full flex flex-col gap-4 pb-12 pt-3">
      {/* ──────────── Top Actions Bar (Title/Subtitle handled by global Header) ──────────── */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div className="flex items-center gap-2">
          <span className="text-xs font-sans text-ink/55 font-medium">
            {stats.total} registered {isVendor ? 'partner stores' : 'delivery partners'}
          </span>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            type="button"
            onClick={() => showToast(`Exporting ${config.itemLabel} list...`)}
            className="h-[36px] px-4 rounded-full border border-primary/15 bg-white text-xs font-sans text-ink hover:bg-neutral flex items-center gap-1.5 transition-colors focus:ring-2 focus:ring-secondary shadow-xs"
          >
            <Upload className="w-3.5 h-3.5" />
            Export
          </button>
          <button
            type="button"
            onClick={() => {
              setFormItem(null);
              setIsFormOpen(true);
            }}
            className="h-[36px] px-4 rounded-full bg-primary text-white text-xs font-sans font-medium flex items-center gap-1.5 hover:opacity-90 active:scale-95 transition-all focus:ring-2 focus:ring-secondary shadow-xs"
          >
            <Plus className="w-3.5 h-3.5 stroke-[2.5] text-white" />
            {config.addBtnText}
          </button>
        </div>
      </div>

      {/* ──────────── RESPONSIVE STAT CARDS FOR < 1280px (ABOVE LIST) ──────────── */}
      <div className="grid min-[1280px]:hidden grid-cols-1 sm:grid-cols-2 gap-3.5">
        <StatCardTotal
          title={isVendor ? 'Total Vendors' : 'Total Riders'}
          total={stats.total}
          verified={stats.verified}
          pending={stats.pending}
          rejected={stats.rejected}
          inactive={stats.inactive}
        />
        <StatCardActive
          title={isVendor ? 'Active Vendors' : 'Online Now'}
          activeCount={stats.active}
          total={stats.total}
          isRider={!isVendor}
          itemLabel={config.itemLabel}
        />
        <StatCardPending
          pendingCount={stats.pending}
          total={stats.total}
          pendingPeople={stats.pendingPeople}
          type={config.type}
        />
        <StatCardSuspended
          suspendedCount={stats.suspended}
          total={stats.total}
          items={rawList.map((i) => ({
            id: i.id,
            status: i.status,
            name: isVendor ? (i as ManagementVendor).storeName : (i as ManagementRider).name,
          }))}
        />
      </div>

      {/* ──────────── MAIN BODY GRID (DESKTOP >= 1280px: [1fr 270px]) ──────────── */}
      <div className="w-full grid grid-cols-1 min-[1280px]:grid-cols-[minmax(0,1fr)_270px] gap-4 items-start">
        {/* ──────────── LEFT COLUMN: Toolbar + List Rows + Pagination ──────────── */}
        <div className="w-full min-w-0 flex flex-col gap-3.5">
          {/* Toolbar */}
          <div className="w-full p-2.5 sm:p-3 rounded-[20px] bg-white border border-primary/10 shadow-xs flex flex-wrap items-center justify-between gap-2.5 select-none">
            {/* Search Input (name, city, phone, email) */}
            <div className="relative flex-1 min-w-[200px]">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-ink/40 pointer-events-none" />
              <input
                type="text"
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                placeholder="Search name, city or phone"
                className="w-full pl-9 pr-3 py-2 rounded-full text-xs font-sans border border-primary/10 focus:outline-none focus:ring-2 focus:ring-secondary text-ink placeholder:text-ink/40"
              />
            </div>

            {/* Filter Selects */}
            <div className="flex items-center gap-2 flex-wrap">
              {/* Filter 1: Category or Vehicle Type */}
              <div className="relative">
                <select
                  value={filter1}
                  onChange={(e) => {
                    setFilter1(e.target.value);
                    setCurrentPage(1);
                  }}
                  className="h-[34px] pl-3 pr-7 text-xs font-sans bg-white border border-primary/10 rounded-full text-ink cursor-pointer appearance-none focus:outline-none focus:ring-2 focus:ring-secondary shadow-xs"
                >
                  <option value="All">All {config.filter1Label.toLowerCase()}s</option>
                  {config.categoriesOrVehicleTypes.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
                <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-ink/50 pointer-events-none" />
              </div>

              {/* Rider Availability Select (Riders only) */}
              {!isVendor && (
                <div className="relative">
                  <select
                    value={availabilityFilter}
                    onChange={(e) => {
                      setAvailabilityFilter(e.target.value);
                      setCurrentPage(1);
                    }}
                    className="h-[34px] pl-3 pr-7 text-xs font-sans bg-white border border-primary/10 rounded-full text-ink cursor-pointer appearance-none focus:outline-none focus:ring-2 focus:ring-secondary shadow-xs"
                  >
                    <option value="All">All availability</option>
                    <option value="Online">Online</option>
                    <option value="Offline">Offline</option>
                    <option value="On delivery">On delivery</option>
                  </select>
                  <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-ink/50 pointer-events-none" />
                </div>
              )}

              {/* Account Status Select (All / Active / Inactive / Suspended) */}
              <div className="relative">
                <select
                  value={accountStatusFilter}
                  onChange={(e) => {
                    setAccountStatusFilter(e.target.value);
                    setCurrentPage(1);
                  }}
                  className="h-[34px] pl-3 pr-7 text-xs font-sans bg-white border border-primary/10 rounded-full text-ink cursor-pointer appearance-none focus:outline-none focus:ring-2 focus:ring-secondary shadow-xs"
                >
                  <option value="All">All status</option>
                  <option value="Active">Active</option>
                  <option value="Inactive">Inactive</option>
                  <option value="Suspended">Suspended</option>
                </select>
                <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-ink/50 pointer-events-none" />
              </div>

              {/* Verification Select (All / Verified / Pending / Rejected) */}
              <div className="relative">
                <select
                  value={verificationFilter}
                  onChange={(e) => {
                    setVerificationFilter(e.target.value);
                    setCurrentPage(1);
                  }}
                  className="h-[34px] pl-3 pr-7 text-xs font-sans bg-white border border-primary/10 rounded-full text-ink cursor-pointer appearance-none focus:outline-none focus:ring-2 focus:ring-secondary shadow-xs"
                >
                  <option value="All">All verification</option>
                  <option value="Verified">Verified</option>
                  <option value="Pending">Pending</option>
                  <option value="Rejected">Rejected</option>
                </select>
                <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-ink/50 pointer-events-none" />
              </div>
            </div>
          </div>

          {/* Card Rows List (8 per page) */}
          <div className="flex flex-col gap-2.5 w-full">
            {paginatedList.length > 0 ? (
              paginatedList.map((item) => (
                <PersonRow
                  key={item.id}
                  type={config.type}
                  item={item}
                  onView={() => setViewItem(item)}
                  onEdit={() => {
                    setFormItem(item);
                    setIsFormOpen(true);
                  }}
                  onSuspend={() => handleOpenAction('suspend', item)}
                  onReactivate={() => handleOpenAction('reactivate', item)}
                  onSetInactive={() => handleOpenAction('set_inactive', item)}
                  onSetActive={() => handleOpenAction('set_active', item)}
                  onOpenDocuments={() => handleOpenDocuments(item)}
                />
              ))
            ) : (
              <div className="w-full py-16 text-center text-ink/55 text-[13px] font-sans bg-white rounded-[20px] border border-black/[0.06]">
                No {config.itemLabel} match these filters.
              </div>
            )}
          </div>

          {/* Pagination Footer */}
          {filteredList.length > 0 && (
            <div className="p-2 bg-white rounded-[18px] border border-black/[0.06]">
              <PaginationControl
                currentPage={currentPage}
                totalPages={totalPages}
                pageSize={pageSize}
                totalItems={filteredList.length}
                onPageChange={setCurrentPage}
                onPageSizeChange={setPageSize}
                itemLabel={config.itemLabel}
              />
            </div>
          )}
        </div>

        {/* ──────────── RIGHT COLUMN (270px, Desktop Sticky Top 16px) ──────────── */}
        <div className="hidden min-[1280px]:flex flex-col gap-[14px] w-[270px] flex-shrink-0 sticky top-4">
          {/* Card 1: Total */}
          <StatCardTotal
            title={isVendor ? 'Total Vendors' : 'Total Riders'}
            total={stats.total}
            verified={stats.verified}
            pending={stats.pending}
            rejected={stats.rejected}
            inactive={stats.inactive}
          />

          {/* Card 2: Active / Online */}
          <StatCardActive
            title={isVendor ? 'Active Vendors' : 'Online Now'}
            activeCount={stats.active}
            total={stats.total}
            isRider={!isVendor}
            itemLabel={config.itemLabel}
          />

          {/* Card 3: Pending Verification */}
          <StatCardPending
            pendingCount={stats.pending}
            total={stats.total}
            pendingPeople={stats.pendingPeople}
            type={config.type}
          />

          {/* Card 4: Suspended */}
          <StatCardSuspended
            suspendedCount={stats.suspended}
            total={stats.total}
            items={rawList.map((i) => ({
              id: i.id,
              status: i.status,
              name: isVendor ? (i as ManagementVendor).storeName : (i as ManagementRider).name,
            }))}
          />
        </div>
      </div>

      {/* ──────────── MODALS ──────────── */}
      {/* 1. Full View Profile Modal */}
      <ProfileModal
        isOpen={Boolean(viewItem)}
        type={config.type}
        item={viewItem}
        applicantDocs={viewApplicantDocs}
        onClose={() => setViewItem(null)}
        onEdit={() => {
          setFormItem(viewItem);
          setIsFormOpen(true);
        }}
        onSuspend={() => viewItem && handleOpenAction('suspend', viewItem)}
        onReactivate={() => viewItem && handleOpenAction('reactivate', viewItem)}
        onSetInactive={() => viewItem && handleOpenAction('set_inactive', viewItem)}
        onSetActive={() => viewItem && handleOpenAction('set_active', viewItem)}
      />

      {/* 2. Add / Edit Form Modal */}
      <PersonFormModal
        isOpen={isFormOpen}
        type={config.type}
        item={formItem}
        onClose={() => {
          setIsFormOpen(false);
          setFormItem(null);
        }}
        onSubmit={(data) => {
          if (formItem) {
            editPerson(config.type, formItem.id, data);
            // Refresh viewItem if editing currently open profile
            if (viewItem && viewItem.id === formItem.id) {
              setViewItem((prev: any) => ({ ...prev, ...data }));
            }
          } else {
            addPerson(config.type, data);
          }
          setIsFormOpen(false);
          setFormItem(null);
        }}
      />

      {/* 3. Confirm Action Modal */}
      <ConfirmActionModal
        isOpen={Boolean(confirmAction && actionTarget)}
        action={confirmAction}
        targetName={
          actionTarget
            ? isVendor
              ? (actionTarget as ManagementVendor).storeName
              : (actionTarget as ManagementRider).name
            : ''
        }
        isVerified={actionTarget?.verificationStatus === 'Verified'}
        onClose={() => {
          setConfirmAction(null);
          setActionTarget(null);
        }}
        onConfirm={handleConfirmAction}
        onOpenDocuments={() => {
          if (actionTarget) handleOpenDocuments(actionTarget);
        }}
      />

      {/* Black Toast Notification */}
      <Toast message={toastMessage} />
    </div>
  );
};
