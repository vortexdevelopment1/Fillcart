import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  User,
  Settings,
  Bell,
  HelpCircle,
  LogOut,
  ArrowLeft,
  ShieldCheck,
  Check,
} from 'lucide-react';
import { useToast } from '../../context/ToastContext';
import { useApp } from '../../context/AppContext';
import { lockSettings } from '../../services/settingsAccess';

export interface AdminProfileContentProps {
  onClose: () => void;
  activeTriggerRef?: React.RefObject<HTMLButtonElement | null>;
}

export const AdminProfileContent: React.FC<AdminProfileContentProps> = ({
  onClose,
  activeTriggerRef,
}) => {
  const navigate = useNavigate();
  const { addToast } = useToast();
  const { currentRole, staff, logAudit } = useApp();

  const currentMember = staff?.find((s) => s.role === currentRole && s.isActive);

  // Profile data (initialized from staff/mock store)
  const [name, setName] = useState(currentMember?.name || 'Sarah Mitchell');
  const [email, setEmail] = useState(currentMember?.email || 'sarah.m@fillkart.in');
  const [phone, setPhone] = useState(currentMember?.phone || '+91 98765 43210');
  const [viewMode, setViewMode] = useState<'menu' | 'edit'>('menu');

  const containerRef = useRef<HTMLDivElement>(null);

  // Arrow key navigation between menu items
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (viewMode !== 'menu') return;

    if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
      e.preventDefault();
      const items = containerRef.current?.querySelectorAll<HTMLButtonElement>('[role="menuitem"]');
      if (!items || items.length === 0) return;

      const activeElement = document.activeElement as HTMLButtonElement;
      const currentIndex = Array.from(items).indexOf(activeElement);

      let nextIndex = 0;
      if (e.key === 'ArrowDown') {
        nextIndex = currentIndex >= 0 && currentIndex < items.length - 1 ? currentIndex + 1 : 0;
      } else {
        nextIndex = currentIndex > 0 ? currentIndex - 1 : items.length - 1;
      }
      items[nextIndex]?.focus();
    }
  };

  // Auto-focus first item on open
  useEffect(() => {
    const timer = setTimeout(() => {
      if (viewMode === 'menu') {
        const firstItem = containerRef.current?.querySelector<HTMLButtonElement>('[role="menuitem"]');
        firstItem?.focus();
      } else {
        const firstInput = containerRef.current?.querySelector<HTMLInputElement>('input');
        firstInput?.focus();
      }
    }, 50);
    return () => clearTimeout(timer);
  }, [viewMode]);

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    if (logAudit) {
      logAudit(
        'Update',
        'Staff',
        name,
        `Admin profile details updated (${email}, ${phone})`,
        'Admin Audit'
      );
    }
    addToast('success', 'Profile Updated', 'Admin profile changes saved successfully.');
    setViewMode('menu');
  };

  const handleLogout = () => {
    // TODO: Connect production SSO/JWT logout API to invalidate session tokens
    lockSettings();
    addToast(
      'info',
      'Admin Logout',
      'Session ended (Mock). Production auth will clear tokens & redirect to login on backend integration.'
    );
    onClose();
    navigate('/');
  };

  return (
    <div ref={containerRef} onKeyDown={handleKeyDown} className="w-full text-left">
      {viewMode === 'menu' ? (
        <>
          {/* ──────────────── 1. HEADER PROFILE BLOCK ──────────────── */}
          <div className="flex items-center gap-3 pb-3 border-b border-primary/10">
            <div className="relative flex-shrink-0">
              <img
                src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80"
                alt="Sarah Mitchell"
                className="w-12 h-12 rounded-full object-cover border-2 border-white shadow-sm ring-1 ring-primary/10"
              />
              <span className="absolute bottom-0 right-0 w-3 h-3 bg-secondary rounded-full border-2 border-white" />
            </div>

            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-1.5 flex-wrap">
                <h3 className="font-heading text-sm font-normal text-ink truncate leading-tight">
                  {name}
                </h3>
                <span className="bg-primary/10 text-primary text-[10px] font-medium px-2 py-0.5 rounded-full whitespace-nowrap">
                  {currentRole || 'Super Admin'}
                </span>
              </div>
              <p className="font-sans text-[11px] text-ink/60 truncate mt-0.5">{email}</p>
              <div className="flex items-center gap-2 mt-1 text-[10px] text-primary/70">
                <span className="flex items-center gap-1">
                  <ShieldCheck className="w-3 h-3 text-secondary" />
                  2FA Active
                </span>
                <span>•</span>
                <span>Ops Central</span>
              </div>
            </div>
          </div>

          {/* ──────────────── 2. NAVIGATION ACTIONS ──────────────── */}
          <div className="py-1.5 flex flex-col gap-0.5">
            {/* My Profile */}
            <button
              type="button"
              role="menuitem"
              onClick={() => setViewMode('edit')}
              className="w-full min-h-[44px] px-3 py-2 rounded-xl flex items-center justify-between text-left text-ink hover:bg-neutral transition-colors group focus:outline-none focus:ring-2 focus:ring-secondary cursor-pointer"
            >
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-8 h-8 rounded-lg bg-primary/5 flex items-center justify-center text-primary group-hover:bg-primary/10 transition-colors flex-shrink-0">
                  <User className="w-4 h-4" />
                </div>
                <div className="min-w-0">
                  <span className="text-xs font-medium text-ink block leading-tight">My Profile</span>
                  <span className="text-[10px] text-ink/50 block truncate">
                    View & edit admin credentials
                  </span>
                </div>
              </div>
              <span className="text-[10px] text-secondary font-medium opacity-0 group-hover:opacity-100 transition-opacity">
                Edit
              </span>
            </button>

            {/* Account Settings */}
            <button
              type="button"
              role="menuitem"
              onClick={() => {
                onClose();
                navigate('/settings');
              }}
              className="w-full min-h-[44px] px-3 py-2 rounded-xl flex items-center justify-between text-left text-ink hover:bg-neutral transition-colors group focus:outline-none focus:ring-2 focus:ring-secondary cursor-pointer"
            >
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-8 h-8 rounded-lg bg-primary/5 flex items-center justify-center text-primary group-hover:bg-primary/10 transition-colors flex-shrink-0">
                  <Settings className="w-4 h-4" />
                </div>
                <div className="min-w-0">
                  <span className="text-xs font-medium text-ink block leading-tight">
                    Account Settings
                  </span>
                  <span className="text-[10px] text-ink/50 block truncate">
                    Security, orders & system options
                  </span>
                </div>
              </div>
            </button>

            {/* Notifications */}
            <button
              type="button"
              role="menuitem"
              onClick={() => {
                onClose();
                navigate('/settings?tab=notifications');
              }}
              className="w-full min-h-[44px] px-3 py-2 rounded-xl flex items-center justify-between text-left text-ink hover:bg-neutral transition-colors group focus:outline-none focus:ring-2 focus:ring-secondary cursor-pointer"
            >
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-8 h-8 rounded-lg bg-primary/5 flex items-center justify-center text-primary group-hover:bg-primary/10 transition-colors flex-shrink-0">
                  <Bell className="w-4 h-4" />
                </div>
                <div className="min-w-0">
                  <span className="text-xs font-medium text-ink block leading-tight">
                    Notifications
                  </span>
                  <span className="text-[10px] text-ink/50 block truncate">
                    Alert triggers & dispatch preferences
                  </span>
                </div>
              </div>
            </button>

            {/* Help & Support */}
            <button
              type="button"
              role="menuitem"
              onClick={() => {
                addToast(
                  'info',
                  'Help & Support',
                  'Central Operations Desk: ops-support@fillkart.in · Ext: 4022'
                );
                onClose();
              }}
              className="w-full min-h-[44px] px-3 py-2 rounded-xl flex items-center justify-between text-left text-ink hover:bg-neutral transition-colors group focus:outline-none focus:ring-2 focus:ring-secondary cursor-pointer"
            >
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-8 h-8 rounded-lg bg-primary/5 flex items-center justify-center text-primary group-hover:bg-primary/10 transition-colors flex-shrink-0">
                  <HelpCircle className="w-4 h-4" />
                </div>
                <div className="min-w-0">
                  <span className="text-xs font-medium text-ink block leading-tight">
                    Help & Support
                  </span>
                  <span className="text-[10px] text-ink/50 block truncate">
                    Platform documentation & ops desk
                  </span>
                </div>
              </div>
            </button>
          </div>

          {/* ──────────────── 3. DIVIDER ──────────────── */}
          <div className="my-1.5 border-t border-primary/10" />

          {/* ──────────────── 4. LOGOUT ACTION ──────────────── */}
          <button
            type="button"
            role="menuitem"
            onClick={handleLogout}
            className="w-full min-h-[44px] px-3 py-2 rounded-xl flex items-center gap-3 text-left text-[#DC2626] hover:bg-[#FEE2E2]/60 focus:bg-[#FEE2E2]/60 transition-colors group focus:outline-none focus:ring-2 focus:ring-[#DC2626] cursor-pointer"
          >
            <div className="w-8 h-8 rounded-lg bg-[#DC2626]/10 flex items-center justify-center text-[#DC2626] flex-shrink-0">
              <LogOut className="w-4 h-4" />
            </div>
            <div className="min-w-0">
              <span className="text-xs font-medium text-[#DC2626] block leading-tight">Logout</span>
              <span className="text-[10px] text-[#DC2626]/70 block truncate">
                End current administrative session
              </span>
            </div>
          </button>
        </>
      ) : (
        /* ──────────────── IN-PANEL PROFILE EDIT VIEW ──────────────── */
        <div className="py-1">
          <div className="flex items-center justify-between pb-3 border-b border-primary/10 mb-3">
            <button
              type="button"
              onClick={() => setViewMode('menu')}
              className="flex items-center gap-1.5 text-xs text-primary hover:text-ink font-medium focus:outline-none focus:ring-2 focus:ring-secondary rounded px-2 py-1 transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back</span>
            </button>
            <span className="font-heading text-sm font-normal text-ink">Edit Admin Profile</span>
            <div className="w-10" />
          </div>

          <form onSubmit={handleSaveProfile} className="space-y-3">
            <div>
              <label className="block text-[11px] font-medium text-ink/75 mb-1">Full Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full h-9 px-3 rounded-xl border border-primary/15 bg-neutral/50 text-xs text-ink focus:outline-none focus:ring-2 focus:ring-secondary focus:bg-white transition-all"
                required
              />
            </div>

            <div>
              <label className="block text-[11px] font-medium text-ink/75 mb-1">Email Address</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full h-9 px-3 rounded-xl border border-primary/15 bg-neutral/50 text-xs text-ink focus:outline-none focus:ring-2 focus:ring-secondary focus:bg-white transition-all"
                required
              />
            </div>

            <div>
              <label className="block text-[11px] font-medium text-ink/75 mb-1">Phone Number</label>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full h-9 px-3 rounded-xl border border-primary/15 bg-neutral/50 text-xs text-ink focus:outline-none focus:ring-2 focus:ring-secondary focus:bg-white transition-all"
              />
            </div>

            <div className="p-2.5 rounded-xl bg-neutral/70 border border-primary/10 text-[11px] space-y-1.5">
              <div className="flex justify-between items-center text-ink/70">
                <span>Role</span>
                <span className="font-medium text-primary bg-primary/10 px-2 py-0.5 rounded-full text-[10px]">
                  {currentRole || 'Super Admin'} (System Locked)
                </span>
              </div>
              <div className="flex justify-between items-center text-ink/70">
                <span>Security</span>
                <span className="text-secondary font-medium flex items-center gap-1">
                  <Check className="w-3 h-3" />
                  Two-Factor Active
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2 pt-2">
              <button
                type="submit"
                className="flex-1 h-9 rounded-full bg-primary text-white text-xs font-medium hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-secondary transition-colors"
              >
                Save Changes
              </button>
              <button
                type="button"
                onClick={() => setViewMode('menu')}
                className="h-9 px-3.5 rounded-full border border-primary/15 text-xs text-ink/70 hover:text-ink hover:bg-neutral focus:outline-none focus:ring-2 focus:ring-secondary transition-colors"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};
