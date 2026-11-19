import React, { createContext, useContext, useState, useCallback } from 'react';
import { ToastMessage } from '../types';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

interface ToastContextType {
  toasts: ToastMessage[];
  addToast: (type: 'success' | 'error' | 'info', title: string, message: string) => void;
  removeToast: (id: string) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const addToast = useCallback((type: 'success' | 'error' | 'info', title: string, message: string) => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts((prev) => [...prev, { id, type, title, message }]);

    setTimeout(() => {
      removeToast(id);
    }, 4000);
  }, [removeToast]);

  return (
    <ToastContext.Provider value={{ toasts, addToast, removeToast }}>
      {children}
      {/* Toast Notification Container */}
      <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-3 pointer-events-none max-w-sm w-full">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className="pointer-events-auto flex items-start gap-3 p-4 bg-white border border-primary/10 rounded-[16px] shadow-[0_8px_24px_rgba(18,55,71,0.08)] transition-all duration-300"
          >
            {toast.type === 'success' && (
              <div className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center flex-shrink-0 text-white">
                <CheckCircle2 className="w-5 h-5 text-ink" />
              </div>
            )}
            {toast.type === 'error' && (
              <div className="w-8 h-8 rounded-full bg-ink text-white flex items-center justify-center flex-shrink-0">
                <AlertCircle className="w-5 h-5 text-white" />
              </div>
            )}
            {toast.type === 'info' && (
              <div className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center flex-shrink-0 text-white">
                <Info className="w-5 h-5 text-ink" />
              </div>
            )}
            <div className="flex-1">
              <h4 className="text-sm font-semibold text-ink">{toast.title}</h4>
              <p className="text-xs text-ink/55 mt-0.5 leading-relaxed">{toast.message}</p>
            </div>
            <button
              onClick={() => removeToast(toast.id)}
              className="text-ink/55 hover:text-ink p-1 transition-colors"
            >
              <X className="w-4 h-4 text-ink" />
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
};

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
};
