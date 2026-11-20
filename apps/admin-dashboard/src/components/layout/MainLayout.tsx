import React from 'react';
import { SidebarProvider, useSidebar } from '../../context/SidebarContext';
import { Sidebar } from './Sidebar';
import { Header } from './Header';

const LayoutContent: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isExpanded } = useSidebar();

  return (
    <div className="h-full w-full max-w-full bg-white flex overflow-hidden relative">
      {/* Global Fixed/Floating Sidebar (Collapsed / Expanded / Mobile Drawer) */}
      <Sidebar />

      {/* Main Screen Area - desktop pushes by 272px when expanded, 88px when collapsed */}
      <main
        style={{
          transition: 'padding-left 250ms cubic-bezier(0.16, 1, 0.3, 1)',
        }}
        className={`flex-1 h-full min-h-0 min-w-0 flex flex-col pt-3 pb-3 pr-3 sm:pt-4 sm:pb-4 sm:pr-4 md:pr-5 xl:pr-6 w-full max-w-full overflow-hidden bg-white ${
          isExpanded
            ? 'pl-3 sm:pl-4 md:pl-[84px] lg:pl-[284px]'
            : 'pl-3 sm:pl-4 md:pl-[84px] lg:pl-[88px]'
        }`}
      >
        {/* Global Header */}
        <Header />

        {/* Dynamic Page Content with 1760px centering on 2xl */}
        <div className="flex-1 min-h-0 min-w-0 overflow-y-auto overflow-x-hidden">
          <div className="w-full max-w-[1760px] mx-auto h-auto xl:h-full flex flex-col min-w-0 pb-6 xl:pb-0">
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
