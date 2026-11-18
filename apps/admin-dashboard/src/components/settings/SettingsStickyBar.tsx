import React from 'react';
import { Save, RotateCcw } from 'lucide-react';

interface SettingsStickyBarProps {
  isDirty: boolean;
  dirtyCount: number;
  onDiscard: () => void;
  onSave: () => void;
  isSaving?: boolean;
}

export const SettingsStickyBar: React.FC<SettingsStickyBarProps> = ({
  isDirty,
  dirtyCount,
  onDiscard,
  onSave,
  isSaving = false,
}) => {
  if (!isDirty) return null;

  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-40 bg-[#123747] text-white px-5 py-3 rounded-full shadow-2xl flex items-center gap-4 border border-white/10 animate-bounce-subtle">
      <div className="flex items-center gap-2 pr-2 border-r border-white/20">
        <span className="w-2.5 h-2.5 rounded-full bg-amber-400 animate-pulse" />
        <span className="text-xs font-medium">
          {dirtyCount} unsaved change{dirtyCount !== 1 ? 's' : ''}
        </span>
      </div>

      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={onDiscard}
          disabled={isSaving}
          className="px-3.5 py-1.5 rounded-full text-xs font-medium text-white/80 hover:text-white hover:bg-white/10 transition-colors flex items-center gap-1.5 focus:outline-none focus:ring-2 focus:ring-white/40 disabled:opacity-50"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Discard</span>
        </button>

        <button
          type="button"
          onClick={onSave}
          disabled={isSaving}
          className="px-4 py-1.5 rounded-full text-xs font-semibold bg-[#527781] hover:bg-[#43646d] text-white transition-all shadow-sm flex items-center gap-1.5 focus:outline-none focus:ring-2 focus:ring-white disabled:opacity-50"
        >
          <Save className="w-3.5 h-3.5" />
          <span>{isSaving ? 'Saving...' : 'Save changes'}</span>
        </button>
      </div>
    </div>
  );
};
