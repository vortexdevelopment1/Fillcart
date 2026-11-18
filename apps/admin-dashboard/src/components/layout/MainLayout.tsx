import React from 'react';
import { SidebarProvider, useSidebar } from '../../context/SidebarContext';
import { Sidebar } from './Sidebar';
import { Header } from './Header';

const LayoutContent: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isExpanded } = useSidebar();

  return (
    <div className="h-screen w-screen bg-white flex overflow-hidden relative">
      {/* Global Fixed/Floating Sidebar (Collapsed / Expanded) */}
      <Sidebar />

      {/* Main Screen Area - desktop pushes by 272px when expanded, 88px when collapsed */}
      <main
        style={{
          transition: 'padding-left 250ms cubic-bezier(0.16, 1, 0.3, 1)',
        }}
        className={`flex-1 h-screen flex flex-col pt-4 pb-4 pr-4 md:pr-6 w-full overflow-hidden bg-white ${
          isExpanded
            ? 'pl-4 md:pl-[88px] lg:pl-[272px]'
            : 'pl-4 md:pl-[88px]'
        }`}
      >
        {/* Global Header */}
        <Header />

        {/* Dynamic Page Content */}
        <div className="flex-1 min-h-0 overflow-y-auto">
          {children}
        </div>
      </main>
    </div>
  );
};

export const MainLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <SidebarProvider>
      <LayoutContent>{children}</LayoutContent>
    </SidebarProvider>
  );
};
