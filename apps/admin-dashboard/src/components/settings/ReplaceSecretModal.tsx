import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { X, KeyRound, Eye, EyeOff, Check } from 'lucide-react';

interface ReplaceSecretModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  provider: string;
  onSave: (newSecret: string) => void;
}

export const ReplaceSecretModal: React.FC<ReplaceSecretModalProps> = ({
  isOpen,
  onClose,
  title,
  provider,
  onSave,
}) => {
  const [newKey, setNewKey] = useState('');
  const [showKey, setShowKey] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (isOpen) {
      setNewKey('');
      setShowKey(false);
      setError('');
    }
  }, [isOpen]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleApply = () => {
    if (!newKey.trim()) {
      setError('API key cannot be empty');
      return;
    }
    if (newKey.length < 8) {
      setError('API key should be at least 8 characters');
      return;
    }

    // Generate masked representation (e.g. ••••1234)
    const suffix = newKey.slice(-4);
    const masked = `••••${suffix}`;
    onSave(masked);
    onClose();
  };

  return createPortal(
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="replace-secret-title"
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-primary/60 backdrop-blur-xs animate-fadeIn"
    >
      <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl border border-primary/10 overflow-hidden">
        {/* Header */}
        <div className="px-5 py-4 border-b border-primary/10 flex items-center justify-between bg-neutral/30">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-secondary/15 flex items-center justify-center text-secondary">
              <KeyRound className="w-4 h-4" />
            </div>
            <div>
              <h3 id="replace-secret-title" className="font-heading text-base font-normal text-ink">
                Replace API Key
              </h3>
              <p className="text-[11px] text-primary/60">{provider} &bull; {title}</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-full hover:bg-neutral flex items-center justify-center text-primary/60 hover:text-ink transition-colors focus:outline-none focus:ring-2 focus:ring-secondary"
            aria-label="Close modal"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 space-y-3.5">
          <p className="text-xs text-primary/70">
            Enter the production API credential or auth token provided by {provider}.
            Once saved, the secret will remain encrypted and masked in the admin interface.
          </p>

          <div>
            <label htmlFor="newSecretKey" className="text-xs font-semibold text-ink block mb-1">
              New Secret API Key *
            </label>
            <div className="relative">
              <input
                id="newSecretKey"
                type={showKey ? 'text' : 'password'}
                value={newKey}
                onChange={(e) => {
                  setNewKey(e.target.value);
                  if (error) setError('');
                }}
                placeholder="sk_live_..."
                className="w-full h-9 pl-3 pr-10 rounded-xl border border-primary/20 text-xs font-mono text-ink bg-white focus:outline-none focus:ring-2 focus:ring-secondary"
                autoFocus
              />
              <button
                type="button"
                onClick={() => setShowKey(!showKey)}
                className="absolute right-2.5 top-2 text-primary/50 hover:text-ink"
                aria-label={showKey ? 'Hide key' : 'Show key'}
              >
                {showKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
            {error && <p className="text-[10px] text-red-500 mt-1">{error}</p>}
          </div>
        </div>

        {/* Footer */}
        <div className="px-5 py-3.5 border-t border-primary/10 flex items-center justify-end gap-2.5 bg-neutral/20">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-xs font-medium text-ink hover:bg-neutral transition-colors focus:outline-none focus:ring-2 focus:ring-secondary"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleApply}
            className="px-5 py-2 rounded-xl text-xs font-semibold bg-[#123747] hover:bg-[#0c242f] text-white flex items-center gap-1.5 shadow-sm transition-all focus:outline-none focus:ring-2 focus:ring-secondary"
          >
            <Check className="w-3.5 h-3.5" />
            <span>Update Secret</span>
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
};
