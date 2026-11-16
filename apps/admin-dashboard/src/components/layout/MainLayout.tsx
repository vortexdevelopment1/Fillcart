import React from 'react';
import { Sidebar } from './Sidebar';
import { Header } from './Header';

interface MainLayoutProps {
  children: React.ReactNode;
}

export const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  return (
    <div className="h-screen w-screen bg-[#F6F6F8] flex overflow-hidden">
      {/* Fixed/Floating Sidebar */}
      <Sidebar />

      {/* Main Screen Area */}
      <main className="flex-1 lg:pl-[96px] h-screen flex flex-col pt-5 pb-4 px-4 lg:px-6 w-full max-w-[1600px] mx-auto overflow-hidden">
        {/* Global Header */}
        <Header />

        {/* Dynamic Page Content (fills exact remaining height without page scroll on desktop) */}
        <div className="flex-1 min-h-0 overflow-y-auto xl:overflow-hidden">
          {children}
        </div>
      </main>
    </div>
  );
};
