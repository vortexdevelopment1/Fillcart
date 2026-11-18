import React from 'react';

interface ToastProps {
  message: string | null;
}

export const Toast: React.FC<ToastProps> = ({ message }) => {
  if (!message) return null;

  return (
    <div
      role="status"
      aria-live="polite"
      className="fixed bottom-8 left-1/2 -translate-x-1/2 z-[100] pointer-events-none select-none transition-all duration-200 animate-fade-in"
    >
      <div className="bg-ink text-white text-[13px] font-sans font-normal px-5 py-2.5 rounded-full shadow-[0_12px_32px_rgba(18, 55, 71, 0.35)] whitespace-nowrap">
        {message}
      </div>
    </div>
  );
};
