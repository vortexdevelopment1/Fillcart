import React, { useState, useEffect } from 'react';
import { X, Edit2 } from 'lucide-react';
import { StaffMember, StaffRole } from '../../data/staffData';
import { CustomSelect } from '../common/CustomSelect';

interface EditStaffModalProps {
  staffMember: StaffMember | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: (id: string, updates: Partial<StaffMember>) => void;
  availableRoles: string[];
}

export const EditStaffModal: React.FC<EditStaffModalProps> = ({
  staffMember,
  isOpen,
  onClose,
  onSave,
  availableRoles,
}) => {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [role, setRole] = useState<StaffRole>('Support');

  useEffect(() => {
    if (staffMember) {
      setName(staffMember.name);
      setPhone(staffMember.phone);
      setRole(staffMember.role);
    }
  }, [staffMember]);

  if (!isOpen || !staffMember) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(staffMember.id, {
      name: name.trim(),
      phone: phone.trim(),
      role,
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-[24px] max-w-md w-full p-6 shadow-2xl border border-primary/10 relative">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 w-8 h-8 rounded-full bg-neutral hover:bg-neutral/80 flex items-center justify-center text-ink transition-colors focus:outline-none focus:ring-2 focus:ring-secondary"
          aria-label="Close dialog"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-full bg-neutral flex items-center justify-center text-primary border border-primary/20">
            <Edit2 className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h3 className="font-heading text-lg font-normal text-ink">Edit Staff Profile</h3>
            <p className="font-sans text-xs text-ink/60">{staffMember.email}</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3.5">
          <div>
            <label className="block font-sans text-xs font-medium text-ink mb-1">Full Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-primary/20 bg-neutral/30 font-sans text-xs text-ink focus:outline-none focus:ring-2 focus:ring-secondary"
              required
            />
          </div>

          <div>
            <label className="block font-sans text-xs font-medium text-ink mb-1">Phone Number</label>
            <input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-primary/20 bg-neutral/30 font-sans text-xs text-ink focus:outline-none focus:ring-2 focus:ring-secondary"
              required
            />
          </div>

          <div>
            <label className="block font-sans text-xs font-medium text-ink mb-1">Assigned Role</label>
            <CustomSelect
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-primary/20 bg-neutral/30 font-sans text-xs text-ink focus:outline-none focus:ring-2 focus:ring-secondary"
            >
              {availableRoles.map((r) => (
                <option key={r} value={r}>
                  {r}
                </option>
              ))}
            </CustomSelect>
          </div>

          <div className="flex items-center justify-end gap-2.5 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-full border border-primary/20 text-ink font-sans text-xs font-medium hover:bg-neutral transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-full bg-primary text-white font-sans text-xs font-medium hover:bg-primary/90 transition-colors shadow-sm focus:outline-none focus:ring-2 focus:ring-secondary"
            >
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
