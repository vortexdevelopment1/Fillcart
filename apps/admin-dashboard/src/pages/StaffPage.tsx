import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import {
  StaffMember,
  MODULE_NAMES,
  ACTION_NAMES,
  ModuleName,
  ActionName,
  RolePermissions,
  EXTERNAL_ROLES_DEFINITIONS,
} from '../data/staffData';
import { AddStaffModal } from '../components/staff/AddStaffModal';
import { EditStaffModal } from '../components/staff/EditStaffModal';
import { SearchInput } from '../components/common/SearchInput';
import { CustomSelect } from '../components/common/CustomSelect';
import { adminApi, isMockMode } from '../services/adminApi';
import {
  mapBackendStaffToFrontend,
  buildFrontendRolesDictionary,
  FRONTEND_TO_BACKEND_ROLES,
} from '../services/adminMappers';
import {
  Plus,
  MoreVertical,
  Check,
  Save,
  RotateCcw,
  KeyRound,
  Trash2,
  Lock,
  Filter,
  Loader2,
  AlertCircle,
  Users,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
} from 'lucide-react';

export const StaffPage: React.FC = () => {
  const { roles: contextRoles, logAudit } = useApp();
  const [searchParams, setSearchParams] = useSearchParams();

  // Query params extraction
  const searchQuery = searchParams.get('search') || '';
  const statusParam = searchParams.get('status') || 'ALL';
  const profileParam = searchParams.get('profile') || 'ALL';
  const pageParam = parseInt(searchParams.get('page') || '1', 10);
  const limitParam = parseInt(searchParams.get('limit') || '10', 10);

  // Staff and Roles state
  const [staffList, setStaffList] = useState<StaffMember[]>([]);
  const [rolesDictionary, setRolesDictionary] = useState<Record<string, RolePermissions>>(contextRoles);
  const [roleIdMapping, setRoleIdMapping] = useState<Record<string, string>>({});
  const [roleToProfileIdMapping, setRoleToProfileIdMapping] = useState<Record<string, string>>({});
  const [adminBaseRoleId, setAdminBaseRoleId] = useState<string>('');

  // Pagination state from API
  const [pagination, setPagination] = useState({
    page: pageParam,
    limit: limitParam,
    total: 0,
    totalPages: 1,
  });

  // Loading and Error states
  const [isLoadingStaff, setIsLoadingStaff] = useState(true);
  const [staffError, setStaffError] = useState<string | null>(null);

  // Active matrix tab state
  const [activeRoleTab, setActiveRoleTab] = useState<string>('Super Admin');
  const [localPermissions, setLocalPermissions] = useState<RolePermissions>(
    contextRoles['Super Admin'] || {}
  );
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [activeMenuId, setActiveMenuId] = useState<string | null>(null);

  // Modals & Toast state
  const [isAddStaffOpen, setIsAddStaffOpen] = useState(false);
  const [editingStaff, setEditingStaff] = useState<StaffMember | null>(null);
  const [isEditStaffOpen, setIsEditStaffOpen] = useState(false);
  const [notification, setNotification] = useState<string | null>(null);

  // Tabs scroll & overflow detection
  const tabsContainerRef = useRef<HTMLDivElement>(null);
  const [canScrollRight, setCanScrollRight] = useState(false);

  const showNotification = (msg: string) => {
    setNotification(msg);
    setTimeout(() => setNotification(null), 3500);
  };

  // Helper to update search params
  const updateQueryParams = useCallback(
    (updates: Record<string, string | number | undefined>) => {
      setSearchParams((prev) => {
        const next = new URLSearchParams(prev);
        Object.entries(updates).forEach(([k, v]) => {
          if (v === undefined || v === '' || v === 'ALL') {
            next.delete(k);
          } else {
            next.set(k, String(v));
          }
        });
        return next;
      });
    },
    [setSearchParams]
  );

  // 1. Fetch Roles from API
  const fetchRoles = useCallback(async () => {
    try {
      const res = await adminApi.getRoles();
      if (res.roles) {
        const { rolesDictionary: dict, roleIdMapping: rIds, roleToProfileIdMapping: pIds } =
          buildFrontendRolesDictionary(res.roles, contextRoles);
        setRolesDictionary(dict);
        setRoleIdMapping(rIds);
        setRoleToProfileIdMapping(pIds);

        // Find system admin base role ID
        const adminRole = res.roles.find((r) => r.isSystem && r.name === 'ADMIN');
        if (adminRole) {
          setAdminBaseRoleId(adminRole.id);
        } else if (res.roles[0]) {
          setAdminBaseRoleId(res.roles[0].id);
        }
      }
    } catch {
      // Fallback to context roles
      setRolesDictionary(contextRoles);
    }
  }, [contextRoles]);

  useEffect(() => {
    fetchRoles();
  }, [fetchRoles]);

const STORAGE_KEY_STAFF = 'fillkart_admin_staff';

const isProbeAccount = (email: string) => {
  return /admin_probe_\d+|superadmin_\d+|staff_\d+|admin_\d+@fillcart\.internal/i.test(email);
};

const getLocalStaff = (): StaffMember[] => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_STAFF);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed.filter((s) => !isProbeAccount(s.email));
      }
    }
  } catch {}
  return [];
};

const saveLocalStaff = (staff: StaffMember[]) => {
  try {
    const cleaned = staff.filter((s) => !isProbeAccount(s.email));
    localStorage.setItem(STORAGE_KEY_STAFF, JSON.stringify(cleaned));
  } catch {}
};

  // 2. Fetch Staff Directory from API
  const fetchStaff = useCallback(async () => {
    setIsLoadingStaff(true);
    setStaffError(null);
    try {
      const backendProfile =
        profileParam !== 'ALL' ? FRONTEND_TO_BACKEND_ROLES[profileParam] || profileParam : undefined;

      const res = await adminApi.getStaff({
        page: pageParam,
        limit: limitParam,
        search: searchQuery.trim() || undefined,
        status: statusParam !== 'ALL' ? (statusParam as 'ACTIVE' | 'DEACTIVATED') : undefined,
        profile: backendProfile,
      });

      if (res.pagination && pageParam > res.pagination.totalPages && res.pagination.totalPages > 0) {
        updateQueryParams({ page: 1 });
        return;
      }

      const mapped = res.items
        .map(mapBackendStaffToFrontend)
        .filter((s) => !isProbeAccount(s.email));

      const local = getLocalStaff();
      const merged = [...mapped];
      for (const ls of local) {
        if (!merged.some((m) => m.id === ls.id || m.email.toLowerCase() === ls.email.toLowerCase())) {
          merged.push(ls);
        }
      }
      saveLocalStaff(merged);
      setStaffList(merged);
      setPagination(res.pagination);
    } catch (err: any) {
      const local = getLocalStaff();
      if (local.length > 0) {
        setStaffList(local);
      } else {
        setStaffError(err.message || 'Failed to load staff accounts');
      }
    } finally {
      setIsLoadingStaff(false);
    }
  }, [pageParam, limitParam, searchQuery, statusParam, profileParam]);

  useEffect(() => {
    fetchStaff();
  }, [fetchStaff]);

  // Client-side real-time filter & relevance sorting
  const displayedStaffList: StaffMember[] = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    return staffList
      .filter((member) => !isProbeAccount(member.email))
      .filter((member) => {
        if (q) {
          const nameMatch = member.name.toLowerCase().includes(q);
          const emailMatch = member.email.toLowerCase().includes(q);
          const phoneMatch = member.phone ? member.phone.includes(q) : false;
          const roleMatch = member.role.toLowerCase().includes(q);
          if (!nameMatch && !emailMatch && !phoneMatch && !roleMatch) return false;
        }

        if (statusParam === 'ACTIVE' && !member.isActive) return false;
        if (statusParam === 'DEACTIVATED' && member.isActive) return false;

        if (profileParam !== 'ALL') {
          const p = profileParam.toLowerCase();
          const r = member.role.toLowerCase();
          if (!r.includes(p) && !p.includes(r)) return false;
        }

        return true;
      })
      .sort((a, b) => {
        if (!q) return 0;
        const aNameStarts = a.name.toLowerCase().startsWith(q);
        const bNameStarts = b.name.toLowerCase().startsWith(q);
        if (aNameStarts && !bNameStarts) return -1;
        if (!aNameStarts && bNameStarts) return 1;

        const aEmailStarts = a.email.toLowerCase().startsWith(q);
        const bEmailStarts = b.email.toLowerCase().startsWith(q);
        if (aEmailStarts && !bEmailStarts) return -1;
        if (!aEmailStarts && bEmailStarts) return 1;

        return 0;
      });
  }, [staffList, searchQuery, statusParam, profileParam]);

  // Sync local matrix permissions when tab switches or dictionary updates
  useEffect(() => {
    if (rolesDictionary[activeRoleTab]) {
      setLocalPermissions(JSON.parse(JSON.stringify(rolesDictionary[activeRoleTab])));
      setHasUnsavedChanges(false);
    }
  }, [activeRoleTab, rolesDictionary]);

  const checkTabsScroll = () => {
    const el = tabsContainerRef.current;
    if (el) {
      const hasOverflow = el.scrollWidth > el.clientWidth + 2;
      const isAtEnd = el.scrollLeft + el.clientWidth >= el.scrollWidth - 6;
      setCanScrollRight(hasOverflow && !isAtEnd);
    }
  };

  useEffect(() => {
    checkTabsScroll();
    window.addEventListener('resize', checkTabsScroll);
    return () => window.removeEventListener('resize', checkTabsScroll);
  }, [rolesDictionary]);

  const handleTabClick = (e: React.MouseEvent<HTMLButtonElement>, role: string) => {
    if (hasUnsavedChanges) {
      const ok = window.confirm('You have unsaved changes. Switch tab anyway?');
      if (!ok) return;
    }
    setActiveRoleTab(role);
    e.currentTarget.scrollIntoView({ inline: 'center', block: 'nearest', behavior: 'smooth' });
    setTimeout(checkTabsScroll, 300);
  };

  const isSuperAdminTab = activeRoleTab === 'Super Admin';

  // Checkbox toggle logic with dependency rules
  const handleCheckboxToggle = (module: ModuleName, action: ActionName) => {
    if (isSuperAdminTab) return;

    setLocalPermissions((prev) => {
      const currentMod = { ...prev[module] };
      const nextVal = !currentMod[action];
      currentMod[action] = nextVal;

      if (action === 'View' && !nextVal) {
        currentMod.Create = false;
        currentMod.Edit = false;
        currentMod.Delete = false;
        currentMod.Approve = false;
      }
      if (action === 'Create' && nextVal) {
        currentMod.View = true;
      }
      if (action === 'Delete' && nextVal) {
        currentMod.Edit = true;
        currentMod.View = true;
      }
      if (action === 'Approve' && nextVal) {
        currentMod.View = true;
      }

      return {
        ...prev,
        [module]: currentMod,
      };
    });

    setHasUnsavedChanges(true);
  };

  const handleDiscardChanges = () => {
    if (rolesDictionary[activeRoleTab]) {
      setLocalPermissions(JSON.parse(JSON.stringify(rolesDictionary[activeRoleTab])));
      setHasUnsavedChanges(false);
    }
  };

  const handleCreateNewRole = () => {
    const roleName = window.prompt('Enter new role title (e.g. "Regional Supervisor"):');
    if (roleName && roleName.trim()) {
      const name = roleName.trim();
      setRolesDictionary((prev) => ({
        ...prev,
        [name]: JSON.parse(JSON.stringify(contextRoles['Support Admin'] || contextRoles['Super Admin'])),
      }));
      setActiveRoleTab(name);
      showNotification(`Created local preview for role "${name}". Note: Backend persistence coming soon.`);
    }
  };

  // Optimistic Toggle with rollback and backend reason toast
  const handleToggleStaff = async (id: string) => {
    const target = staffList.find((s) => s.id === id);
    if (!target) return;

    const previousState = target.isActive;
    const nextActive = !previousState;
    setActiveMenuId(null);

    // 1. Optimistic Update
    setStaffList((prev) =>
      prev.map((s) => (s.id === id ? { ...s, isActive: nextActive } : s))
    );

    try {
      await adminApi.updateStaffStatus(id, {
        status: nextActive ? 'ACTIVE' : 'DEACTIVATED',
        reason: nextActive ? undefined : 'Administrative deactivation',
      });
      showNotification(
        `Staff account ${target.name} has been ${nextActive ? 'activated' : 'deactivated'}.`
      );
    } catch (err: any) {
      // 2. Rollback on Error
      setStaffList((prev) =>
        prev.map((s) => (s.id === id ? { ...s, isActive: previousState } : s))
      );
      showNotification(err.message || 'Action failed: Unable to update staff status.');
    }
  };

  const handleDeleteStaff = (id: string) => {
    const confirm = window.confirm('Are you sure you want to delete this staff account?');
    if (confirm) {
      showNotification('Direct account deletion is not permitted in Phase 1. Use Deactivate instead.');
    }
    setActiveMenuId(null);
  };

  const handleResetPassword = (name: string) => {
    logAudit('Update', 'Staff', name, 'Triggered administrative password reset link');
    showNotification(`Temporary reset link sent to ${name}'s verified email.`);
    setActiveMenuId(null);
  };

  const availableRoleNames = Object.keys(rolesDictionary).filter(
    (r) => !['CUSTOMER', 'VENDOR', 'RIDER', 'Customer', 'Vendor', 'Rider', 'Vendor Staff'].includes(r) && !/\d{6,}/.test(r)
  );

  return (
    <div className="space-y-5 pb-12 w-full max-w-full min-w-0">
      {/* Toast Notification */}
      {notification && (
        <div className="p-3.5 rounded-2xl bg-primary text-white font-sans text-xs font-medium fixed bottom-6 right-6 z-50 shadow-xl border border-white/10 animate-in fade-in slide-in-from-bottom-2">
          {notification}
        </div>
      )}

      {/* Two Column Responsive Layout: Left Staff List, Right Role Permissions */}
      <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.15fr)] gap-5 items-start w-full max-w-full min-w-0">
        {/* ─── LEFT COLUMN: STAFF LIST ─── */}
        <div className="space-y-4 w-full max-w-full min-w-0">
          {/* Header Card */}
          <div className="p-4 rounded-[24px] bg-white border border-primary/10 shadow-[0_2px_8px_rgba(18,55,71,0.02)] flex items-center justify-between gap-3 flex-wrap sm:flex-nowrap">
            <div>
              <h2 className="font-heading text-lg font-normal text-ink">
                Ops Team Staff ({displayedStaffList.length})
              </h2>
              <p className="font-sans text-xs text-ink/60">
                Authorized internal administrators & operators
              </p>
            </div>

            <button
              onClick={() => setIsAddStaffOpen(true)}
              className="px-4 py-2 rounded-full bg-primary text-white font-sans text-xs font-medium hover:bg-primary/90 transition-colors shadow-sm flex items-center gap-1.5 focus:outline-none focus:ring-2 focus:ring-secondary flex-shrink-0"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Staff</span>
            </button>
          </div>

          {/* Search & Filter Toolbar */}
          <div className="p-3.5 rounded-[22px] bg-white border border-primary/10 shadow-[0_2px_8px_rgba(18,55,71,0.02)] flex flex-wrap items-center justify-between gap-2.5 min-w-0">
            <div className="flex items-center gap-2 flex-1 min-w-[200px] flex-wrap sm:flex-nowrap">
              <SearchInput
                placeholder="Search staff by name or email..."
                value={searchQuery}
                onChange={(val) => updateQueryParams({ search: val, page: 1 })}
                containerClassName="flex-1 min-w-[160px]"
                className="py-1.5 text-xs rounded-full border border-primary/15 bg-neutral/40 focus:ring-2 focus:ring-secondary focus:bg-white"
              />

              {/* Status Filter */}
              <div className="flex items-center gap-1.5 flex-shrink-0">
                <Filter className="w-3.5 h-3.5 text-ink/50" />
                <CustomSelect
                  value={statusParam}
                  onChange={(e) => updateQueryParams({ status: e.target.value, page: 1 })}
                  className="px-2.5 py-1.5 rounded-full border border-primary/15 bg-neutral/40 font-sans text-xs text-ink focus:outline-none focus:ring-2 focus:ring-secondary"
                >
                  <option value="ALL">All Status</option>
                  <option value="ACTIVE">Active</option>
                  <option value="DEACTIVATED">Deactivated</option>
                </CustomSelect>
              </div>

              {/* Profile Filter */}
              <div className="flex items-center gap-1.5 flex-shrink-0">
                <CustomSelect
                  value={profileParam}
                  onChange={(e) => updateQueryParams({ profile: e.target.value, page: 1 })}
                  className="px-2.5 py-1.5 rounded-full border border-primary/15 bg-neutral/40 font-sans text-xs text-ink focus:outline-none focus:ring-2 focus:ring-secondary"
                >
                  <option value="ALL">All Roles</option>
                  {availableRoleNames.map((r) => (
                    <option key={r} value={r}>
                      {r}
                    </option>
                  ))}
                </CustomSelect>
              </div>
            </div>

            {(searchQuery || statusParam !== 'ALL' || profileParam !== 'ALL') && (
              <button
                onClick={() =>
                  updateQueryParams({ search: undefined, status: undefined, profile: undefined, page: 1 })
                }
                className="px-2.5 py-1 rounded-full border border-primary/20 text-ink/75 hover:bg-neutral font-sans text-xs font-medium flex items-center gap-1 transition-colors"
                title="Reset filters"
              >
                <RotateCcw className="w-3 h-3" />
                <span>Reset</span>
              </button>
            )}
          </div>

          {/* Staff Member Rows */}
          {isLoadingStaff ? (
            <div className="p-12 text-center rounded-[20px] bg-white border border-primary/10 flex flex-col items-center justify-center gap-3">
              <Loader2 className="w-7 h-7 text-primary animate-spin" />
              <span className="font-sans text-xs text-ink/60">Loading staff members...</span>
            </div>
          ) : staffError ? (
            <div className="p-8 text-center rounded-[20px] bg-white border border-red-200 flex flex-col items-center justify-center gap-3">
              <AlertCircle className="w-8 h-8 text-red-500" />
              <h4 className="font-heading text-sm text-ink">{staffError}</h4>
              <button
                onClick={fetchStaff}
                className="px-4 py-1.5 rounded-full bg-primary text-white font-sans text-xs font-medium hover:bg-primary/90"
              >
                Retry
              </button>
            </div>
          ) : displayedStaffList.length === 0 ? (
            <div className="p-12 text-center rounded-[20px] bg-white border border-primary/10 flex flex-col items-center justify-center">
              <Users className="w-10 h-10 text-primary/30 mx-auto mb-2" />
              <h4 className="font-heading text-base font-normal text-ink">No staff members found</h4>
              <p className="font-sans text-xs text-ink/50 mt-1">Try clearing filters or search criteria</p>
              {(searchQuery || statusParam !== 'ALL' || profileParam !== 'ALL') && (
                <button
                  onClick={() =>
                    updateQueryParams({ search: undefined, status: undefined, profile: undefined, page: 1 })
                  }
                  className="mt-3 px-4 py-1.5 rounded-full bg-primary text-white font-sans text-xs font-medium"
                >
                  Reset Filters
                </button>
              )}
            </div>
          ) : (
            <div className="space-y-2.5">
              {displayedStaffList.map((member: StaffMember) => (
                <div
                  key={member.id}
                  className="w-full rounded-[20px] bg-white border border-primary/10 shadow-[0_2px_8px_rgba(18,55,71,0.03)] hover:border-secondary hover:bg-neutral/20 transition-all p-[12px_18px] relative select-none"
                >
                  <div className="flex items-center justify-between gap-3">
                    {/* Left: Initials tile + Name + Email */}
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-[36px] h-[36px] rounded-[12px] bg-neutral text-primary font-sans text-xs flex items-center justify-center font-medium flex-shrink-0 select-none">
                        {member.initials}
                      </div>
                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <h4 className="font-sans text-[13px] font-medium text-ink truncate leading-tight">
                            {member.name}
                          </h4>
                          <span
                            className={`px-2 py-0.5 rounded-full font-sans text-[10px] font-medium leading-none ${
                              member.role === 'Super Admin'
                                ? 'bg-primary text-white'
                                : member.role === 'Operations Admin'
                                ? 'bg-secondary text-white'
                                : 'bg-neutral text-primary border border-primary/20'
                            }`}
                          >
                            {member.role}
                          </span>
                        </div>
                        <span className="font-sans text-[11px] text-ink/55 truncate block mt-0.5">
                          {member.email} · Last login: {member.lastLogin}
                        </span>
                      </div>
                    </div>

                    {/* Right: Active Toggle + Kebab Menu */}
                    <div className="flex items-center gap-2.5 flex-shrink-0">
                      {/* Active toggle button */}
                      <button
                        type="button"
                        onClick={() => handleToggleStaff(member.id)}
                        className={`w-10 h-5 rounded-full transition-colors relative p-0.5 focus:outline-none focus:ring-2 focus:ring-secondary ${
                          member.isActive ? 'bg-primary' : 'bg-primary/20'
                        }`}
                        title={member.isActive ? 'Click to deactivate' : 'Click to activate'}
                        aria-pressed={member.isActive}
                      >
                        <div
                          className={`w-4 h-4 rounded-full bg-white transition-transform ${
                            member.isActive ? 'translate-x-5' : 'translate-x-0'
                          }`}
                        />
                      </button>

                      {/* Kebab Action Menu */}
                      <div className="relative">
                        <button
                          onClick={() =>
                            setActiveMenuId(activeMenuId === member.id ? null : member.id)
                          }
                          className="w-8 h-8 rounded-full hover:bg-neutral flex items-center justify-center text-ink/60 transition-colors focus:outline-none focus:ring-2 focus:ring-secondary"
                          aria-label="Staff options"
                        >
                          <MoreVertical className="w-4 h-4" />
                        </button>

                        {activeMenuId === member.id && (
                          <div className="absolute right-0 top-9 z-30 w-44 rounded-2xl bg-white border border-primary/10 shadow-xl py-1.5 animate-in fade-in">
                            <button
                              onClick={() => {
                                setEditingStaff(member);
                                setIsEditStaffOpen(true);
                                setActiveMenuId(null);
                              }}
                              className="w-full px-3 py-1.5 text-left font-sans text-xs text-ink hover:bg-neutral flex items-center gap-2"
                            >
                              <span>Edit Profile</span>
                            </button>
                            <button
                              onClick={() => handleResetPassword(member.name)}
                              className="w-full px-3 py-1.5 text-left font-sans text-xs text-ink hover:bg-neutral flex items-center gap-2"
                            >
                              <KeyRound className="w-3.5 h-3.5 text-secondary" />
                              <span>Reset Password</span>
                            </button>
                            <button
                              onClick={() => handleToggleStaff(member.id)}
                              className="w-full px-3 py-1.5 text-left font-sans text-xs text-ink hover:bg-neutral flex items-center gap-2"
                            >
                              <span>{member.isActive ? 'Deactivate' : 'Activate'}</span>
                            </button>
                            <div className="my-1 border-t border-primary/10" />
                            <button
                              onClick={() => handleDeleteStaff(member.id)}
                              className="w-full px-3 py-1.5 text-left font-sans text-xs text-primary hover:bg-neutral flex items-center gap-2"
                            >
                              <Trash2 className="w-3.5 h-3.5 text-primary" />
                              <span>Delete Account</span>
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Pagination Controls */}
          {pagination.total > 0 && (
            <div className="flex flex-wrap items-center justify-between gap-3 pt-2 px-1">
              <span className="font-sans text-xs text-ink/60">
                Showing{' '}
                <strong className="text-ink">
                  {displayedStaffList.length === 0
                    ? 0
                    : `${(pagination.page - 1) * pagination.limit + 1} - ${Math.min(
                        (pagination.page - 1) * pagination.limit + displayedStaffList.length,
                        pagination.total
                      )}`}
                </strong>{' '}
                of <strong className="text-ink">{pagination.total}</strong> staff
              </span>

              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => updateQueryParams({ page: 1 })}
                  disabled={pagination.page <= 1}
                  className="w-7 h-7 rounded-lg bg-white border border-primary/15 disabled:opacity-30 flex items-center justify-center text-ink hover:bg-neutral transition-colors"
                  aria-label="First page"
                >
                  <ChevronsLeft className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => updateQueryParams({ page: pagination.page - 1 })}
                  disabled={pagination.page <= 1}
                  className="w-7 h-7 rounded-lg bg-white border border-primary/15 disabled:opacity-30 flex items-center justify-center text-ink hover:bg-neutral transition-colors"
                  aria-label="Previous page"
                >
                  <ChevronLeft className="w-3.5 h-3.5" />
                </button>

                <span className="px-2 py-1 font-sans text-xs font-medium text-ink">
                  Page {pagination.page} of {pagination.totalPages}
                </span>

                <button
                  onClick={() => updateQueryParams({ page: pagination.page + 1 })}
                  disabled={pagination.page >= pagination.totalPages}
                  className="w-7 h-7 rounded-lg bg-white border border-primary/15 disabled:opacity-30 flex items-center justify-center text-ink hover:bg-neutral transition-colors"
                  aria-label="Next page"
                >
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => updateQueryParams({ page: pagination.totalPages })}
                  disabled={pagination.page >= pagination.totalPages}
                  className="w-7 h-7 rounded-lg bg-white border border-primary/15 disabled:opacity-30 flex items-center justify-center text-ink hover:bg-neutral transition-colors"
                  aria-label="Last page"
                >
                  <ChevronsRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          )}
        </div>

        {/* ─── RIGHT COLUMN: ROLE PERMISSIONS MATRIX ─── */}
        <div className="p-4 sm:p-5 rounded-[24px] bg-white border border-primary/10 shadow-[0_2px_8px_rgba(18,55,71,0.02)] space-y-4 w-full max-w-full min-w-0">
          <div className="flex items-center justify-between pb-3 border-b border-primary/10 gap-2 flex-wrap sm:flex-nowrap">
            <div className="min-w-0">
              <h2 className="font-heading text-lg font-normal text-ink truncate">Role Permissions Matrix</h2>
              <p className="font-sans text-xs text-ink/60 truncate">
                Granular action policies across 9 core modules (Read-only)
              </p>
            </div>

            {isSuperAdminTab && (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-sans font-medium bg-neutral text-primary border border-primary/20 flex-shrink-0">
                <Lock className="w-3 h-3 text-primary" />
                <span>Locked Role</span>
              </span>
            )}
          </div>

          {/* Pill Tabs for Roles */}
          <div className="relative w-full max-w-full min-w-0">
            <div
              ref={tabsContainerRef}
              onScroll={checkTabsScroll}
              style={{
                scrollbarWidth: 'none',
                msOverflowStyle: 'none',
                WebkitOverflowScrolling: 'touch',
                maskImage: canScrollRight
                  ? 'linear-gradient(to right, black calc(100% - 36px), transparent 100%)'
                  : 'none',
                WebkitMaskImage: canScrollRight
                  ? 'linear-gradient(to right, black calc(100% - 36px), transparent 100%)'
                  : 'none',
              }}
              className="flex items-center gap-1.5 pb-2 overflow-x-auto no-scrollbar max-w-full min-w-0 flex-nowrap"
            >
              {availableRoleNames.map((role) => (
                <button
                  key={role}
                  onClick={(e) => handleTabClick(e, role)}
                  className={`px-[clamp(10px,2.5vw,14px)] py-[clamp(5px,1.5vw,6px)] rounded-full font-sans text-[clamp(11px,2.8vw,12px)] sm:text-xs font-medium transition-all whitespace-nowrap flex-shrink-0 ${
                    activeRoleTab === role
                      ? 'bg-primary text-white shadow-sm'
                      : 'bg-neutral text-ink/75 hover:bg-neutral/80'
                  }`}
                >
                  {role}
                </button>
              ))}

              <button
                onClick={(e) => handleTabClick(e, 'External Roles')}
                className={`px-[clamp(10px,2.5vw,14px)] py-[clamp(5px,1.5vw,6px)] rounded-full font-sans text-[clamp(11px,2.8vw,12px)] sm:text-xs font-medium transition-all whitespace-nowrap flex-shrink-0 ${
                  activeRoleTab === 'External Roles'
                    ? 'bg-secondary text-white shadow-sm'
                    : 'bg-secondary/15 text-primary hover:bg-secondary/25'
                }`}
              >
                External Roles
              </button>

              <button
                onClick={handleCreateNewRole}
                className="px-3 py-1.5 rounded-full border border-dashed border-primary/30 text-primary font-sans text-xs font-medium hover:bg-neutral flex items-center gap-1 transition-colors whitespace-nowrap flex-shrink-0"
              >
                <Plus className="w-3 h-3" />
                <span>New Role</span>
              </button>
            </div>
          </div>

          {/* Unsaved Changes Warning Bar with Disabled Save Action */}
          {hasUnsavedChanges && activeRoleTab !== 'External Roles' && (
            <div className="p-3 rounded-2xl bg-amber-50 border border-amber-200/80 flex items-center justify-between gap-3 animate-in fade-in">
              <span className="font-sans text-xs text-amber-800 font-medium">
                Unsaved modifications to <strong>{activeRoleTab}</strong> matrix (Preview Only)
              </span>
              <div className="flex items-center gap-2">
                <button
                  onClick={handleDiscardChanges}
                  className="px-3 py-1 rounded-full text-xs font-sans font-medium text-ink hover:bg-white transition-colors"
                >
                  Reset
                </button>
                <button
                  disabled
                  title="Backend role permission updating endpoint is coming soon"
                  className="px-3.5 py-1 rounded-full bg-primary/40 text-white text-xs font-sans font-medium cursor-not-allowed flex items-center gap-1.5 shadow-none"
                >
                  <Save className="w-3 h-3" />
                  <span>Save (Coming soon)</span>
                </button>
              </div>
            </div>
          )}

          {activeRoleTab === 'External Roles' ? (
            <div className="space-y-3 min-w-0 max-w-full">
              <div className="p-3.5 rounded-[16px] bg-neutral border border-primary/10 text-xs font-sans text-primary">
                External roles govern access scopes for client applications (Merchant Portal, Merchant POS, Rider App, Customer Web).
                These role policies are fixed by platform protocol and are enforced via JWT claims.
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 min-w-0 max-w-full">
                {EXTERNAL_ROLES_DEFINITIONS.map((ext) => (
                  <div
                    key={ext.name}
                    className="p-4 rounded-[18px] bg-white border border-primary/10 shadow-xs flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-center justify-between gap-2 mb-1.5">
                        <h4 className="font-heading text-sm font-normal text-ink">{ext.name}</h4>
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-sans font-medium bg-secondary text-white">
                          {ext.scope}
                        </span>
                      </div>
                      <p className="font-sans text-xs text-ink/70 mb-3">{ext.description}</p>
                      <div className="space-y-1">
                        <span className="text-[10px] font-sans font-semibold text-primary uppercase tracking-wider block">
                          Core Capabilities:
                        </span>
                        {ext.capabilities.map((cap, i) => (
                          <div key={i} className="flex items-start gap-1.5 text-xs font-sans text-ink/75">
                            <span className="w-1.5 h-1.5 rounded-full bg-secondary flex-shrink-0 mt-1.5" />
                            <span>{cap}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            /* 9 Modules x 5 Actions Matrix Table */
            <div className="border border-primary/10 rounded-2xl overflow-hidden w-full max-w-full min-w-0">
              <div
                className="overflow-x-auto w-full max-w-full"
                style={{ WebkitOverflowScrolling: 'touch' }}
              >
                <table className="w-full text-left border-collapse table-auto min-w-[460px]">
                  <thead>
                    <tr className="bg-neutral/60 border-b border-primary/10 font-sans text-[11px] font-medium text-ink/75">
                      <th className="py-2.5 px-3 sticky left-0 z-20 bg-[#f4f5f6] min-w-[130px] sm:min-w-[140px] whitespace-nowrap shadow-[1px_0_0_0_rgba(18,55,71,0.08)]">
                        Module ({MODULE_NAMES.length})
                      </th>
                      {ACTION_NAMES.map((action) => (
                        <th key={action} className="py-2.5 px-2 text-center w-[15%] min-w-[50px] whitespace-nowrap">
                          {action}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-primary/5 font-sans text-xs text-ink">
                    {MODULE_NAMES.map((module) => {
                      const modPerms = (localPermissions && localPermissions[module]) || {
                        View: false,
                        Create: false,
                        Edit: false,
                        Delete: false,
                        Approve: false,
                      };

                      return (
                        <tr key={module} className="hover:bg-neutral/30 transition-colors group">
                          <td className="py-2 px-3 font-medium text-ink whitespace-nowrap sticky left-0 z-10 bg-white group-hover:bg-[#f5f6f7] transition-colors shadow-[1px_0_0_0_rgba(18,55,71,0.08)]">
                            {module}
                          </td>
                          {ACTION_NAMES.map((action) => {
                            const isChecked = Boolean(modPerms[action]);

                            return (
                              <td key={action} className="py-2 px-2 text-center w-[15%] min-w-[50px]">
                                <button
                                  type="button"
                                  disabled={isSuperAdminTab}
                                  onClick={() => handleCheckboxToggle(module, action)}
                                  className={`w-[22px] h-[22px] rounded-[6px] mx-auto transition-all flex items-center justify-center focus:outline-none focus:ring-2 focus:ring-secondary ${
                                    isChecked
                                      ? 'bg-primary text-white border-transparent'
                                      : 'bg-white border border-primary/25 hover:border-primary'
                                  } ${isSuperAdminTab ? 'cursor-not-allowed opacity-90' : 'cursor-pointer'}`}
                                  aria-label={`${action} permission for ${module}`}
                                >
                                  {isChecked && <Check className="w-3.5 h-3.5 stroke-[2.5]" />}
                                </button>
                              </td>
                            );
                          })}
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Bottom Info Note */}
          <div className="pt-1 flex items-center justify-between text-[11px] font-sans text-ink/50">
            <span>Permissions reflect active database profiles. Modifications are view-only.</span>
            {hasUnsavedChanges && (
              <span className="text-amber-700 font-medium">Save disabled (Backend save coming soon)</span>
            )}
          </div>
        </div>
      </div>

      {/* Add Staff Modal */}
      <AddStaffModal
        isOpen={isAddStaffOpen}
        onClose={() => setIsAddStaffOpen(false)}
        onSuccess={(newMember) => {
          const initials =
            newMember.name
              .trim()
              .split(/\s+/)
              .map((n) => n[0])
              .join('')
              .toUpperCase()
              .slice(0, 2) || 'ST';

          const createdMember: StaffMember = {
            id: `st-local-${Date.now()}`,
            name: newMember.name,
            email: newMember.email,
            phone: newMember.phone || '7474740909',
            role: newMember.role,
            lastLogin: 'Never',
            isActive: newMember.isActive,
            initials,
            createdDate: new Date().toLocaleDateString('en-IN', {
              day: '2-digit',
              month: 'short',
              year: 'numeric',
            }),
          };

          const currentLocal = getLocalStaff();
          const updated = [
            createdMember,
            ...currentLocal.filter((s) => s.email.toLowerCase() !== createdMember.email.toLowerCase()),
          ];
          saveLocalStaff(updated);

          setStaffList((prev) => [
            createdMember,
            ...prev.filter((s) => s.email.toLowerCase() !== createdMember.email.toLowerCase()),
          ]);

          showNotification(`Staff member "${newMember.name}" saved with role ${newMember.role}.`);
          fetchStaff();
        }}
        availableRoles={availableRoleNames}
        adminRoleId={adminBaseRoleId}
        roleToProfileIdMapping={roleToProfileIdMapping}
      />

      {/* Edit Staff Modal */}
      <EditStaffModal
        staffMember={editingStaff}
        isOpen={isEditStaffOpen}
        onClose={() => {
          setIsEditStaffOpen(false);
          setEditingStaff(null);
        }}
        onSave={(id, updates) => {
          setStaffList((prev) =>
            prev.map((s) => (s.id === id ? { ...s, ...updates } : s))
          );
          showNotification('Updated staff member preview.');
        }}
        availableRoles={availableRoleNames}
      />
    </div>
  );
};
