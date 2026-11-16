import React from 'react';
import { Sidebar } from './Sidebar';
import { Header } from './Header';

interface MainLayoutProps {
  children: React.ReactNode;
}

export const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  return (
    <div className="min-h-screen bg-[#F6F6F8] flex">
      {/* Fixed/Floating Sidebar */}
      <Sidebar />

      {/* Main Content Area */}
      <main className="flex-1 lg:pl-[104px] p-4 md:p-8 max-w-[1600px] mx-auto w-full">
        {/* Global Header */}
        <Header />

        {/* Page Content */}
        <div className="transition-all duration-300">
          {children}
        </div>
      </main>
    </div>
  );
};
