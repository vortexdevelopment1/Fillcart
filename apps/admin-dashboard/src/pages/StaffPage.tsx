import React, { useState, useEffect, useRef } from 'react';
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
import {
  Plus,
  MoreVertical,
  Check,
  Shield,
  ShieldAlert,
  Save,
  RotateCcw,
  KeyRound,
  Trash2,
  Lock,
} from 'lucide-react';

export const StaffPage: React.FC = () => {
  const {
    staff,
    roles,
    addStaff,
    updateStaff,
    toggleStaffActive,
    deleteStaff,
    saveRolePermissions,
    addCustomRole,
    logAudit,
  } = useApp();

  const [activeRoleTab, setActiveRoleTab] = useState<string>('Super Admin');
  const [localPermissions, setLocalPermissions] = useState<RolePermissions>(
    roles['Super Admin']
  );
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [activeMenuId, setActiveMenuId] = useState<string | null>(null);

  // Modals state
  const [isAddStaffOpen, setIsAddStaffOpen] = useState(false);
  const [editingStaff, setEditingStaff] = useState<StaffMember | null>(null);
  const [isEditStaffOpen, setIsEditStaffOpen] = useState(false);
  const [notification, setNotification] = useState<string | null>(null);

  // Tabs scroll & overflow detection
  const tabsContainerRef = useRef<HTMLDivElement>(null);
  const [canScrollRight, setCanScrollRight] = useState(false);

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
  }, [roles]);

  const handleTabClick = (e: React.MouseEvent<HTMLButtonElement>, role: string) => {
    if (hasUnsavedChanges) {
      const ok = window.confirm('You have unsaved changes. Switch tab anyway?');
      if (!ok) return;
    }
    setActiveRoleTab(role);
    e.currentTarget.scrollIntoView({ inline: 'center', block: 'nearest', behavior: 'smooth' });
    setTimeout(checkTabsScroll, 300);
  };

  // Sync local permissions when tab switches or roles change
  useEffect(() => {
    if (roles[activeRoleTab]) {
      setLocalPermissions(JSON.parse(JSON.stringify(roles[activeRoleTab])));
      setHasUnsavedChanges(false);
    }
  }, [activeRoleTab, roles]);

  const showNotification = (msg: string) => {
    setNotification(msg);
    setTimeout(() => setNotification(null), 3000);
  };

  const isSuperAdminTab = activeRoleTab === 'Super Admin';

  // Checkbox toggle logic with dependency rules:
  // - Create needs View
  // - Delete needs Edit & View
  // - Unchecking View unchecks all other actions for that module!
  const handleCheckboxToggle = (module: ModuleName, action: ActionName) => {
    if (isSuperAdminTab) return; // Super Admin is locked

    setLocalPermissions((prev) => {
      const currentMod = { ...prev[module] };
      const nextVal = !currentMod[action];
      currentMod[action] = nextVal;

      // Rule: Unchecking View turns off everything in module
      if (action === 'View' && !nextVal) {
        currentMod.Create = false;
        currentMod.Edit = false;
        currentMod.Delete = false;
        currentMod.Approve = false;
      }

      // Rule: Create requires View
      if (action === 'Create' && nextVal) {
        currentMod.View = true;
      }

      // Rule: Delete requires Edit & View
      if (action === 'Delete' && nextVal) {
        currentMod.Edit = true;
        currentMod.View = true;
      }

      // Rule: Approve requires View
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

  const handleSaveChanges = () => {
    saveRolePermissions(activeRoleTab, localPermissions);
    setHasUnsavedChanges(false);
    showNotification(`Saved permissions for ${activeRoleTab}`);
  };

  const handleDiscardChanges = () => {
    if (roles[activeRoleTab]) {
      setLocalPermissions(JSON.parse(JSON.stringify(roles[activeRoleTab])));
      setHasUnsavedChanges(false);
    }
  };

  const handleCreateNewRole = () => {
    const roleName = window.prompt('Enter new role title (e.g. "Regional Supervisor"):');
    if (roleName && roleName.trim()) {
      addCustomRole(roleName.trim());
      setActiveRoleTab(roleName.trim());
      showNotification(`Created custom role "${roleName.trim()}"`);
    }
  };

  const handleToggleStaff = (id: string) => {
    const success = toggleStaffActive(id);
    if (!success) {
      showNotification('Cannot deactivate the last active Super Admin account.');
    }
    setActiveMenuId(null);
  };

  const handleDeleteStaff = (id: string) => {
    const confirm = window.confirm('Are you sure you want to delete this staff account?');
    if (confirm) {
      const success = deleteStaff(id);
      if (!success) {
        showNotification('Cannot delete the last Super Admin account.');
      } else {
        showNotification('Staff member removed.');
      }
    }
    setActiveMenuId(null);
  };

  const handleResetPassword = (name: string) => {
    logAudit('Update', 'Staff', name, 'Triggered administrative password reset link');
    showNotification(`Temporary reset link sent to ${name}'s verified email.`);
    setActiveMenuId(null);
  };

  const availableRoleNames = Object.keys(roles);

  return (
    <div className="space-y-5 pb-12 w-full max-w-full min-w-0">
      {/* Toast Notification */}
      {notification && (
        <div className="p-3 rounded-2xl bg-primary text-white font-sans text-xs font-medium fixed bottom-6 right-6 z-50 shadow-lg animate-in fade-in slide-in-from-bottom-2">
          {notification}
        </div>
      )}

      {/* Two Column Responsive Layout: Left Staff List, Right Role Permissions */}
      <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.15fr)] gap-5 items-start w-full max-w-full min-w-0">
        {/* ─── LEFT COLUMN: STAFF LIST ─── */}
        <div className="space-y-4 w-full max-w-full min-w-0">
          <div className="p-4 rounded-[24px] bg-white border border-primary/10 shadow-[0_2px_8px_rgba(18,55,71,0.02)] flex items-center justify-between">
            <div>
              <h2 className="font-heading text-lg font-normal text-ink">Ops Team Staff ({staff.length})</h2>
              <p className="font-sans text-xs text-ink/60">
                Authorized internal administrators & operators
              </p>
            </div>

            <button
              onClick={() => setIsAddStaffOpen(true)}
              className="px-4 py-2 rounded-full bg-primary text-white font-sans text-xs font-medium hover:bg-primary/90 transition-colors shadow-sm flex items-center gap-1.5 focus:outline-none focus:ring-2 focus:ring-secondary"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Staff</span>
            </button>
          </div>

          {/* Staff Member Rows */}
          <div className="space-y-2.5">
            {staff.map((member) => (
              <div
                key={member.id}
                className="w-full rounded-[20px] bg-white border border-primary/10 shadow-[0_2px_8px_rgba(18,55,71,0.03)] hover:border-secondary hover:bg-neutral/20 transition-all p-[12px_18px] relative select-none"
              >
                <div className="flex items-center justify-between gap-3">
                  {/* Left: Initials tile (36px, radius 12, bg-neutral, text-primary) + Name + Email */}
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
                              : member.role === 'Manager'
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
        </div>

        {/* ─── RIGHT COLUMN: ROLE PERMISSIONS MATRIX ─── */}
        <div className="p-4 sm:p-5 rounded-[24px] bg-white border border-primary/10 shadow-[0_2px_8px_rgba(18,55,71,0.02)] space-y-4 w-full max-w-full min-w-0">
          <div className="flex items-center justify-between pb-3 border-b border-primary/10 gap-2 flex-wrap sm:flex-nowrap">
            <div className="min-w-0">
              <h2 className="font-heading text-lg font-normal text-ink truncate">Role Permissions Matrix</h2>
              <p className="font-sans text-xs text-ink/60 truncate">
                Granular action policies across 9 core modules
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

          {/* Unsaved Changes Warning Bar */}
          {hasUnsavedChanges && activeRoleTab !== 'External Roles' && (
            <div className="p-3 rounded-2xl bg-secondary/15 border border-secondary/30 flex items-center justify-between gap-3 animate-in fade-in">
              <span className="font-sans text-xs text-primary font-medium">
                Unsaved modifications to <strong>{activeRoleTab}</strong> matrix
              </span>
              <div className="flex items-center gap-2">
                <button
                  onClick={handleDiscardChanges}
                  className="px-3 py-1 rounded-full text-xs font-sans font-medium text-ink hover:bg-white transition-colors"
                >
                  Discard
                </button>
                <button
                  onClick={handleSaveChanges}
                  className="px-4 py-1 rounded-full bg-primary text-white text-xs font-sans font-medium hover:bg-primary/90 transition-colors shadow-sm flex items-center gap-1.5"
                >
                  <Save className="w-3 h-3" />
                  <span>Save Changes</span>
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
                                {/* Custom 22px Checkbox: checked = PRIMARY + white tick */}
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

          {/* Sticky Save Changes Bar at bottom if modified */}
          {hasUnsavedChanges && (
            <div className="pt-2 flex justify-end">
              <button
                onClick={handleSaveChanges}
                className="px-6 py-2 rounded-full bg-primary text-white font-sans text-xs font-medium hover:bg-primary/90 transition-colors shadow-sm flex items-center gap-1.5 focus:outline-none focus:ring-2 focus:ring-secondary"
              >
                <Save className="w-3.5 h-3.5" />
                <span>Save {activeRoleTab} Permissions</span>
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Add Staff Modal */}
      <AddStaffModal
        isOpen={isAddStaffOpen}
        onClose={() => setIsAddStaffOpen(false)}
        onAdd={(data) => {
          addStaff(data);
          showNotification(`Added ${data.name} to ops staff.`);
        }}
        availableRoles={availableRoleNames}
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
          updateStaff(id, updates);
          showNotification('Updated staff member profile.');
        }}
        availableRoles={availableRoleNames}
      />
    </div>
  );
};
