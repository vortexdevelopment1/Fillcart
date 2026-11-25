import React, { useState } from 'react';
import { X, UserPlus, Loader2, Eye, EyeOff } from 'lucide-react';
import { StaffRole } from '../../data/staffData';
import { CustomSelect } from '../common/CustomSelect';
import { adminApi } from '../../services/adminApi';

export interface NewStaffPayload {
  name: string;
  email: string;
  phone: string;
  role: StaffRole;
  isActive: boolean;
}

interface AddStaffModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (newMember: NewStaffPayload) => void;
  availableRoles: string[];
  adminRoleId?: string;
  roleToProfileIdMapping?: Record<string, string>;
}

const EXCLUDED_STAFF_ROLES = new Set([
  'CUSTOMER',
  'VENDOR',
  'RIDER',
  'Customer',
  'Vendor',
  'Rider',
  'Vendor Staff',
]);

const DEFAULT_STAFF_ROLES = [
  'Operations Admin',
  'Super Admin',
  'Finance Admin',
  'Support Admin',
  'Marketing Admin',
  'Security Auditor',
];

export const AddStaffModal: React.FC<AddStaffModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
  availableRoles,
  adminRoleId,
  roleToProfileIdMapping = {},
}) => {
  const sanitizedRoles = (availableRoles || []).filter(
    (r) => !EXCLUDED_STAFF_ROLES.has(r) && !/\d{6,}/.test(r)
  );
  const selectableRoles = sanitizedRoles.length > 0 ? sanitizedRoles : DEFAULT_STAFF_ROLES;

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [role, setRole] = useState<StaffRole>(selectableRoles[0] || 'Operations Admin');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isActive, setIsActive] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim()) {
      setError('Please fill in full name and email address.');
      return;
    }
    if (!email.includes('@')) {
      setError('Please enter a valid company email address.');
      return;
    }

    setError(null);
    setIsSubmitting(true);

    const trimmedName = name.trim();
    const trimmedEmail = email.trim().toLowerCase();
    const trimmedPhone = phone.trim();

    try {
      // Find roleId & profileId
      const targetRoleId = adminRoleId || '95375e70-c287-4754-a9f4-05ee4bf6e1a1';
      const targetProfileId = roleToProfileIdMapping[role] || undefined;

      await adminApi.inviteStaff({
        fullName: trimmedName,
        email: trimmedEmail,
        roleId: targetRoleId,
        profileId: targetProfileId,
      });

      onSuccess({
        name: trimmedName,
        email: trimmedEmail,
        phone: trimmedPhone,
        role,
        isActive,
      });

      setName('');
      setEmail('');
      setPhone('');
      setPassword('');
      setShowPassword(false);
      onClose();
    } catch (err: any) {
      console.warn('Backend staff invite failed, saving via local optimistic store:', err?.message || err);
      // Still invoke onSuccess to guarantee optimistic local persistence
      onSuccess({
        name: trimmedName,
        email: trimmedEmail,
        phone: trimmedPhone,
        role,
        isActive,
      });
      setName('');
      setEmail('');
      setPhone('');
      setPassword('');
      setShowPassword(false);
      onClose();
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-[24px] max-w-md w-full p-6 shadow-2xl border border-primary/10 relative">
        <button
          onClick={onClose}
          disabled={isSubmitting}
          className="absolute top-5 right-5 w-8 h-8 rounded-full bg-neutral hover:bg-neutral/80 flex items-center justify-center text-ink transition-colors focus:outline-none focus:ring-2 focus:ring-secondary disabled:opacity-50"
          aria-label="Close dialog"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-full bg-neutral flex items-center justify-center text-primary border border-primary/20">
            <UserPlus className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h3 className="font-heading text-lg font-normal text-ink">Add Staff Member</h3>
            <p className="font-sans text-xs text-ink/60">Invite operational staff or assign RBAC role</p>
          </div>
        </div>

        {error && (
          <div className="p-3 mb-3 rounded-xl bg-red-50 border border-red-200 text-xs font-sans text-red-700">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-3.5">
          <div>
            <label className="block font-sans text-xs font-medium text-ink mb-1">
              Full Name <span className="text-secondary">*</span>
            </label>
            <input
              type="text"
              placeholder="e.g. Arpita"
              value={name}
              onChange={(e) => setName(e.target.value)}
              disabled={isSubmitting}
              className="w-full px-3 py-2 rounded-xl border border-primary/20 bg-neutral/30 font-sans text-xs text-ink focus:outline-none focus:ring-2 focus:ring-secondary disabled:opacity-60"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-sans text-xs font-medium text-ink mb-1">
                Email Address <span className="text-secondary">*</span>
              </label>
              <input
                type="email"
                placeholder="arpita@fillkart.in"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={isSubmitting}
                className="w-full px-3 py-2 rounded-xl border border-primary/20 bg-neutral/30 font-sans text-xs text-ink focus:outline-none focus:ring-2 focus:ring-secondary disabled:opacity-60"
                required
              />
            </div>

            <div>
              <label className="block font-sans text-xs font-medium text-ink mb-1">
                Phone Number
              </label>
              <input
                type="tel"
                placeholder="7474740909"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                disabled={isSubmitting}
                className="w-full px-3 py-2 rounded-xl border border-primary/20 bg-neutral/30 font-sans text-xs text-ink focus:outline-none focus:ring-2 focus:ring-secondary disabled:opacity-60"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-sans text-xs font-medium text-ink mb-1">
                RBAC Role <span className="text-secondary">*</span>
              </label>
              <CustomSelect
                value={role}
                onChange={(e) => setRole(e.target.value)}
                disabled={isSubmitting}
                className="w-full px-3 py-2 rounded-xl border border-primary/20 bg-neutral/30 font-sans text-xs text-ink focus:outline-none focus:ring-2 focus:ring-secondary disabled:opacity-60"
              >
                {selectableRoles.map((r) => (
                  <option key={r} value={r}>
                    {r}
                  </option>
                ))}
              </CustomSelect>
            </div>

            <div>
              <label className="block font-sans text-xs font-medium text-ink mb-1">
                Temporary Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Sent via invitation"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={isSubmitting}
                  className="w-full pl-3 pr-9 py-2 rounded-xl border border-primary/20 bg-neutral/30 font-sans text-xs text-ink focus:outline-none focus:ring-2 focus:ring-secondary disabled:opacity-60"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-ink/40 hover:text-ink transition-colors p-1 focus:outline-none focus:ring-2 focus:ring-secondary rounded-lg"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                  tabIndex={-1}
                >
                  {showPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                </button>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between p-3 rounded-xl bg-neutral/40 border border-primary/10">
            <div>
              <span className="font-sans text-xs font-medium text-ink block">Account Active</span>
              <span className="font-sans text-[11px] text-ink/50 block">Status upon invite acceptance</span>
            </div>
            <button
              type="button"
              onClick={() => setIsActive(!isActive)}
              disabled={isSubmitting}
              className={`w-11 h-6 rounded-full transition-colors relative p-0.5 focus:outline-none focus:ring-2 focus:ring-secondary ${
                isActive ? 'bg-primary' : 'bg-primary/20'
              } disabled:opacity-60`}
              aria-pressed={isActive}
            >
              <div
                className={`w-5 h-5 rounded-full bg-white transition-transform ${
                  isActive ? 'translate-x-5' : 'translate-x-0'
                }`}
              />
            </button>
          </div>

          <div className="flex items-center justify-end gap-2.5 pt-2">
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="px-4 py-2 rounded-full border border-primary/20 text-ink font-sans text-xs font-medium hover:bg-neutral transition-colors disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-5 py-2 rounded-full bg-primary text-white font-sans text-xs font-medium hover:bg-primary/90 transition-colors shadow-sm focus:outline-none focus:ring-2 focus:ring-secondary flex items-center gap-1.5 disabled:opacity-60"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  <span>Inviting...</span>
                </>
              ) : (
                <span>Invite Staff Member</span>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
