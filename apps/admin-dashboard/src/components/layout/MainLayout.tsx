import React from 'react';
import { SidebarProvider, useSidebar } from '../../context/SidebarContext';
import { Sidebar } from './Sidebar';
import { Header } from './Header';

const LayoutContent: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isExpanded } = useSidebar();

  return (
    <div className="h-full w-full max-w-full bg-white flex relative">
      {/* Global Fixed/Floating Sidebar (Collapsed / Expanded / Mobile Drawer) */}
      <Sidebar />

      {/* Main Screen Area - desktop pushes by 288px when expanded, 88px when collapsed */}
      <main
        style={{
          transition: 'padding-left 250ms cubic-bezier(0.16, 1, 0.3, 1)',
        }}
        className={`flex-1 min-w-0 w-full max-w-full h-full min-h-0 flex flex-col pt-3 pb-3 pr-3 sm:pt-4 sm:pb-4 sm:pr-4 md:pr-5 lg:pr-6 box-border bg-white ${
          isExpanded
            ? 'pl-3 sm:pl-4 md:pl-[88px] lg:pl-[288px]'
            : 'pl-3 sm:pl-4 md:pl-[88px] lg:pl-[88px]'
        }`}
      >
        {/* Global Header */}
        <Header />

        {/* Dynamic Page Content with 1760px centering on 2xl and stable scrollbar-gutter */}
        <div
          className="flex-1 min-h-0 min-w-0 overflow-y-auto overflow-x-hidden"
          style={{ scrollbarGutter: 'stable' }}
        >
          <div className="w-full max-w-[1760px] mx-auto min-h-0 flex flex-col min-w-0 pb-8 box-border">
            {children}
          </div>
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
