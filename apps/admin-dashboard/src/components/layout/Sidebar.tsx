import React, { useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  FileCheck2,
  Store,
  Bike,
  ShoppingBag,
  Layers,
  CreditCard,
  BarChart3,
  ShieldCheck,
  History,
  Settings,
  Menu,
  X,
} from 'lucide-react';
import { useVerification } from '../../context/VerificationContext';

interface NavItem {
  name: string;
  path: string;
  icon: React.ElementType;
  badge?: number | string;
}

export const Sidebar: React.FC = () => {
  const location = useLocation();
  const { stats } = useVerification();
  const [mobileOpen, setMobileOpen] = useState(false);

  const navItems: NavItem[] = [
    { name: 'Dashboard', path: '/', icon: LayoutDashboard },
    {
      name: 'Document Verification',
      path: '/document-verification',
      icon: FileCheck2,
      badge: stats.pending > 0 ? stats.pending : 3,
    },
    { name: 'Vendor Management', path: '/vendors', icon: Store },
    { name: 'Rider Management', path: '/riders', icon: Bike },
    { name: 'Order Management', path: '/orders', icon: ShoppingBag },
    { name: 'Product & Category Management', path: '/products', icon: Layers },
    { name: 'Payments & Statements', path: '/payments', icon: CreditCard },
    { name: 'Basic Reports', path: '/reports', icon: BarChart3 },
    { name: 'Staff Roles & Permissions', path: '/staff', icon: ShieldCheck },
    { name: 'Audit Logs', path: '/audit-logs', icon: History },
  ];

  return (
    <>
      {/* Mobile Hamburger Button */}
      <div className="lg:hidden fixed top-3 left-3 z-50">
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="w-10 h-10 rounded-2xl bg-black text-white flex items-center justify-center shadow-lg focus:outline-none focus:ring-2 focus:ring-primary"
          aria-label="Toggle navigation menu"
        >
          {mobileOpen ? <X className="w-5 h-5 text-white" /> : <Menu className="w-5 h-5 text-white" />}
        </button>
      </div>

      {/* Mobile Backdrop */}
      {mobileOpen && (
        <div
          onClick={() => setMobileOpen(false)}
          className="lg:hidden fixed inset-0 bg-black/40 backdrop-blur-sm z-40"
        />
      )}

      {/* Desktop Floating Sidebar & Mobile Drawer (BLACK background, WHITE icons) */}
      <aside
        className={`
          fixed top-4 left-4 bottom-4 w-[76px] bg-black rounded-[28px] z-50
          flex flex-col items-center py-6 shadow-floating border border-white/10
          transition-transform duration-300 ease-in-out
          ${mobileOpen ? 'translate-x-0' : '-translate-x-[150%] lg:translate-x-0'}
        `}
      >
        {/* Top Logo Mark */}
        <div className="mb-6">
          <NavLink
            to="/"
            className="w-11 h-11 rounded-2xl bg-white/10 hover:bg-white/15 flex items-center justify-center transition-all group"
            title="Fillcart Operations"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" className="text-white group-hover:scale-105 transition-transform">
              <circle cx="8" cy="8" r="4.5" fill="#F5B800" />
              <circle cx="16" cy="9" r="4" fill="#FFFFFF" />
              <circle cx="11" cy="16" r="4.5" fill="#FCE8A3" />
            </svg>
          </NavLink>
        </div>

        {/* Navigation Items */}
        <nav className="flex-1 w-full flex flex-col items-center gap-2 overflow-y-auto overflow-x-hidden no-scrollbar px-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive =
              item.path === '/'
                ? location.pathname === '/'
                : location.pathname.startsWith(item.path);

            return (
              <div key={item.path} className="relative group w-full flex justify-center">
                <NavLink
                  to={item.path}
                  onClick={() => setMobileOpen(false)}
                  className={`
                    w-12 h-12 rounded-[18px] flex items-center justify-center transition-all duration-200 relative
                    ${
                      isActive
                        ? 'bg-white text-black shadow-md scale-100'
                        : 'text-white/60 hover:text-white hover:bg-white/10'
                    }
                  `}
                >
                  <Icon className="w-5 h-5 stroke-[1.8]" />

                  {/* Notification Badge: PRIMARY with BLACK text */}
                  {item.badge && (
                    <span className="absolute -top-1 -right-1 bg-primary text-black text-[10px] font-bold rounded-full w-5 h-5 flex items-center justify-center shadow-sm border-2 border-black">
                      {item.badge}
                    </span>
                  )}
                </NavLink>

                {/* Floating Tooltip */}
                <div className="absolute left-[84px] top-1/2 -translate-y-1/2 px-3 py-1.5 bg-black text-white text-xs font-medium rounded-xl whitespace-nowrap shadow-xl border border-white/10 opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity z-50">
                  {item.name}
                  {item.badge && <span className="ml-1 text-primary">({item.badge})</span>}
                </div>
              </div>
            );
          })}
        </nav>

        {/* Bottom Settings */}
        <div className="mt-4 pt-4 border-t border-white/10 w-full flex flex-col items-center gap-3">
          <div className="relative group">
            <button
              className="w-11 h-11 rounded-2xl flex items-center justify-center text-white/60 hover:text-white hover:bg-white/10 transition-colors"
              title="Platform Settings"
            >
              <Settings className="w-5 h-5" />
            </button>
            <div className="absolute left-[84px] top-1/2 -translate-y-1/2 px-3 py-1.5 bg-black text-white text-xs font-medium rounded-xl whitespace-nowrap shadow-xl border border-white/10 opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity z-50">
              Platform Settings
            </div>
          </div>

          <div className="text-[10px] text-white/30 tracking-widest font-mono">
            FC•2.0
          </div>
        </div>
      </aside>
    </>
  );
};
