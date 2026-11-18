import React, { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { X, Sparkles, Check } from 'lucide-react';
import { NotificationTemplate } from '../../types/settings';

interface TemplateEditorModalProps {
  isOpen: boolean;
  onClose: () => void;
  template: NotificationTemplate | null;
  onSave: (updatedTemplate: NotificationTemplate) => void;
}

export const TemplateEditorModal: React.FC<TemplateEditorModalProps> = ({
  isOpen,
  onClose,
  template,
  onSave,
}) => {
  const [subject, setSubject] = useState('');
  const [body, setBody] = useState('');
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);

  useEffect(() => {
    if (template) {
      setSubject(template.subject);
      setBody(template.body);
    }
  }, [template]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen || !template) return null;

  const insertVariable = (variable: string) => {
    if (!textareaRef.current) {
      setBody((prev) => prev + ' ' + variable);
      return;
    }
    const textarea = textareaRef.current;
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const nextBody = body.substring(0, start) + variable + body.substring(end);
    setBody(nextBody);
    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(start + variable.length, start + variable.length);
    }, 0);
  };

  const generatePreview = () => {
    let preview = body;
    const mockReplacements: Record<string, string> = {
      '{orderId}': '#FK-90241',
      '{customerName}': 'Ananya Sharma',
      '{amount}': '₹916',
      '{vendorName}': 'Fresh Mart Hub',
      '{otp}': '482910',
      '{validityMin}': '5',
      '{merchantName}': 'Fresh Mart Hub',
      '{bankAccount}': 'HDFC ••••8921',
      '{batchId}': 'SETL-3606',
      '{referenceId}': 'TXN-90241',
      '{applicantName}': 'Vikram Singh',
      '{documentType}': 'FSSAI License',
      '{reason}': 'Document blurred or illegible',
    };

    Object.entries(mockReplacements).forEach(([key, val]) => {
      preview = preview.split(key).join(val);
    });
    return preview;
  };

  const handleSave = () => {
    onSave({
      ...template,
      subject,
      body,
    });
    onClose();
  };

  return createPortal(
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="template-editor-title"
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-primary/60 backdrop-blur-xs animate-fadeIn"
    >
      <div className="bg-white rounded-2xl w-full max-w-xl shadow-2xl border border-primary/10 overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="px-6 py-4 border-b border-primary/10 flex items-center justify-between bg-neutral/30">
          <div>
            <h3 id="template-editor-title" className="font-heading text-lg font-normal text-ink">
              Edit Notification Template
            </h3>
            <p className="text-[11px] text-primary/60 mt-0.5">
              Event Trigger: <code className="bg-primary/5 px-1.5 py-0.5 rounded text-primary">{template.event}</code>
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-full hover:bg-neutral flex items-center justify-center text-primary/60 hover:text-ink transition-colors focus:outline-none focus:ring-2 focus:ring-secondary"
            aria-label="Close template editor"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto space-y-4">
          {/* Subject Field */}
          <div>
            <label htmlFor="tpl-subject" className="text-xs font-semibold text-ink block mb-1">
              Subject Line / Header
            </label>
            <input
              id="tpl-subject"
              type="text"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              className="w-full h-9 px-3 rounded-xl border border-primary/20 text-xs font-medium text-ink bg-white focus:outline-none focus:ring-2 focus:ring-secondary"
            />
          </div>

          {/* Variables Pills */}
          <div>
            <span className="text-[11px] font-semibold text-primary/70 uppercase tracking-wider block mb-1.5">
              Available Dynamic Variables (Click to Insert)
            </span>
            <div className="flex flex-wrap gap-1.5">
              {template.variables.map((variable) => (
                <button
                  key={variable}
                  type="button"
                  onClick={() => insertVariable(variable)}
                  className="px-2.5 py-1 rounded-lg bg-neutral hover:bg-[#527781]/15 text-primary text-[11px] font-mono border border-primary/15 transition-colors focus:outline-none focus:ring-2 focus:ring-secondary"
                >
                  +{variable}
                </button>
              ))}
            </div>
          </div>

          {/* Template Body */}
          <div>
            <label htmlFor="tpl-body" className="text-xs font-semibold text-ink block mb-1">
              Message Body (SMS / WhatsApp / Push / Email)
            </label>
            <textarea
              id="tpl-body"
              ref={textareaRef}
              rows={4}
              value={body}
              onChange={(e) => setBody(e.target.value)}
              className="w-full p-3 rounded-xl border border-primary/20 text-xs font-sans text-ink bg-white focus:outline-none focus:ring-2 focus:ring-secondary"
              placeholder="Enter message template..."
            />
          </div>

          {/* Live Preview Box */}
          <div className="p-3.5 rounded-xl bg-neutral/60 border border-primary/10">
            <div className="flex items-center gap-1.5 text-[11px] font-semibold text-primary/70 uppercase tracking-wider mb-1.5">
              <Sparkles className="w-3.5 h-3.5 text-secondary" />
              <span>Live Rendered Customer Preview</span>
            </div>
            <div className="p-3 rounded-lg bg-white border border-primary/10 text-xs text-ink/90 whitespace-pre-wrap font-sans shadow-xs">
              {generatePreview()}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-3.5 border-t border-primary/10 flex items-center justify-end gap-2.5 bg-neutral/20">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-xs font-medium text-ink hover:bg-neutral transition-colors focus:outline-none focus:ring-2 focus:ring-secondary"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSave}
            className="px-5 py-2 rounded-xl text-xs font-semibold bg-[#123747] hover:bg-[#0c242f] text-white flex items-center gap-1.5 shadow-sm transition-all focus:outline-none focus:ring-2 focus:ring-secondary"
          >
            <Check className="w-3.5 h-3.5" />
            <span>Apply to Template</span>
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
};
