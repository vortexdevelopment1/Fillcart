import React from 'react';
import { ShieldAlert, ArrowLeft } from 'lucide-react';
import { useApp } from '../../context/AppContext';

interface NoAccessStateProps {
  moduleName: string;
}

export const NoAccessState: React.FC<NoAccessStateProps> = ({ moduleName }) => {
  const { currentRole, setCurrentRole } = useApp();

  return (
    <div className="min-h-[50vh] flex flex-col items-center justify-center text-center p-8 rounded-[24px] bg-white border border-primary/10 shadow-[0_2px_8px_rgba(18,55,71,0.03)] select-none">
      <div className="w-16 h-16 rounded-full bg-neutral flex items-center justify-center text-primary mb-4 border border-primary/20">
        <ShieldAlert className="w-8 h-8 text-primary" />
      </div>

      <h2 className="font-heading text-2xl font-normal text-ink mb-2">Access Restricted</h2>
      <p className="font-sans text-xs text-ink/65 max-w-md mb-6 leading-relaxed">
        Your current active role <strong>"{currentRole}"</strong> does not have View permission to access the{' '}
        <strong>{moduleName}</strong> module under the organization's RBAC security policy.
      </p>

      <div className="flex items-center gap-3">
        <button
          onClick={() => setCurrentRole('Super Admin')}
          className="px-5 py-2 rounded-full bg-primary text-white font-sans text-xs font-medium hover:bg-primary/90 transition-colors shadow-sm focus:outline-none focus:ring-2 focus:ring-secondary"
        >
          Switch to Super Admin (Demo)
        </button>
      </div>
    </div>
  );
};
