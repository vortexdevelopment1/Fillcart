import React, { createContext, useContext } from 'react';
import { useAppStore } from '../store/useAppStore';

// Adapter to ensure complete backward compatibility with useApp()
const AppContext = createContext<ReturnType<typeof useAppStore.getState> | null>(null);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const store = useAppStore();
  return <AppContext.Provider value={store}>{children}</AppContext.Provider>;
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    // If used outside provider, fallback directly to Zustand store hook
    return useAppStore();
  }
  return context;
};
