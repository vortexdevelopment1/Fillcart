import React from 'react';
import { Sidebar } from './Sidebar';
import { Header } from './Header';

interface MainLayoutProps {
  children: React.ReactNode;
}

export const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  return (
    <div className="h-screen w-screen bg-white flex overflow-hidden">
      {/* Fixed/Floating Sidebar */}
      <Sidebar />

      {/* Main Screen Area - pl-4 on mobile, md:pl-[88px] on desktop so content never hides behind 56px floating sidebar */}
      <main className="flex-1 h-screen flex flex-col pt-4 pb-4 pl-4 md:pl-[88px] pr-4 md:pr-6 w-full overflow-hidden bg-white">
        {/* Global Header */}
        <Header />

        {/* Dynamic Page Content */}
        <div className="flex-1 min-h-0 overflow-y-auto xl:overflow-hidden">
          {children}
        </div>
      </main>
    </div>
  );
};
