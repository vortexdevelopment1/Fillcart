import React, { createContext, useContext, useState, useEffect } from 'react';

interface SidebarContextType {
  isExpanded: boolean;
  isMobileOpen: boolean;
  toggleExpanded: () => void;
  setExpanded: (expanded: boolean) => void;
  toggleMobileOpen: () => void;
  closeMobile: () => void;
}

const SidebarContext = createContext<SidebarContextType | undefined>(undefined);

export const SidebarProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Restore persisted state from localStorage, default to false (collapsed)
  const [isExpanded, setIsExpanded] = useState<boolean>(() => {
    try {
      return localStorage.getItem('sidebar-expanded') === 'true';
    } catch {
      return false;
    }
  });

  const [isMobileOpen, setIsMobileOpen] = useState(false);

  // Sync to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('sidebar-expanded', String(isExpanded));
    } catch {}
  }, [isExpanded]);

  // Global Keyboard Shortcut: Ctrl+B or Cmd+B toggles sidebar
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Toggle on Ctrl+B or Cmd+B
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'b') {
        e.preventDefault();
        setIsExpanded((prev) => !prev);
      }
      // Close on Esc if in overlay/mobile mode
      if (e.key === 'Escape') {
        setIsMobileOpen(false);
        // If screen width is < 1024px and expanded, collapse it
        if (window.innerWidth < 1024 && isExpanded) {
          setIsExpanded(false);
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isExpanded]);

  const toggleExpanded = () => setIsExpanded((prev) => !prev);
  const toggleMobileOpen = () => setIsMobileOpen((prev) => !prev);
  const closeMobile = () => setIsMobileOpen(false);

  return (
    <SidebarContext.Provider
      value={{
        isExpanded,
        isMobileOpen,
        toggleExpanded,
        setExpanded: setIsExpanded,
        toggleMobileOpen,
        closeMobile,
      }}
    >
      {children}
    </SidebarContext.Provider>
  );
};

export const useSidebar = () => {
  const ctx = useContext(SidebarContext);
  if (!ctx) throw new Error('useSidebar must be used within SidebarProvider');
  return ctx;
};
