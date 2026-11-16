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

  // Group 1: Core Operations
  const group1Items: NavItem[] = [
    { name: 'Dashboard', path: '/', icon: LayoutDashboard },
    {
      name: 'Document Verification',
      path: '/document-verification',
      icon: FileCheck2,
      badge: stats.pending > 0 ? stats.pending : 3,
    },
    { name: 'Vendors', path: '/vendors', icon: Store },
    { name: 'Riders', path: '/riders', icon: Bike },
    { name: 'Orders', path: '/orders', icon: ShoppingBag },
  ];

  // Group 2: Management & Finance
  const group2Items: NavItem[] = [
    { name: 'Products & Categories', path: '/products', icon: Layers },
    { name: 'Payments & Statements', path: '/payments', icon: CreditCard },
    { name: 'Basic Reports', path: '/reports', icon: BarChart3 },
  ];

  // Group 3: Administration
  const group3Items: NavItem[] = [
    { name: 'Staff Roles & Permissions', path: '/staff', icon: ShieldCheck },
    { name: 'Audit Logs', path: '/audit-logs', icon: History },
  ];

  const renderNavTile = (item: NavItem) => {
    const Icon = item.icon;
    const isActive =
      item.path === '/'
        ? location.pathname === '/'
        : location.pathname.startsWith(item.path);

    return (
      <div key={item.path} className="relative group flex items-center justify-center flex-shrink-0">
        <NavLink
          to={item.path}
          onClick={() => setMobileOpen(false)}
          className={`
            w-[40px] h-[40px] rounded-[12px] flex items-center justify-center transition-all duration-150 relative
            ${
              isActive
                ? 'bg-white text-black'
                : 'bg-white/10 text-white/80 hover:bg-white/[0.18] hover:text-white'
            }
          `}
          aria-label={item.name}
        >
          <Icon className="w-[18px] h-[18px] stroke-[1.5]" />

          {/* Notification Badge on Document Verification */}
          {item.badge !== undefined && (
            <span
              className="absolute -top-[4px] -right-[4px] w-[16px] h-[16px] rounded-full bg-primary text-black text-[9px] font-sans font-medium flex items-center justify-center leading-none shadow-sm pointer-events-none"
              style={{ top: '-4px', right: '-4px' }}
            >
              {item.badge}
            </span>
          )}
        </NavLink>

        {/* Floating Tooltip to the right: black pill, white text, Poppins 11px */}
        <div className="absolute left-[54px] top-1/2 -translate-y-1/2 px-2.5 py-1 bg-black text-white text-[11px] font-sans font-normal rounded-lg whitespace-nowrap shadow-xl border border-white/10 opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity z-50">
          {item.name}
          {item.badge && <span className="ml-1 text-primary">({item.badge})</span>}
        </div>
      </div>
    );
  };

  return (
    <>
      {/* Mobile Hamburger Button */}
      <div className="md:hidden fixed top-3 left-3 z-50">
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
          className="md:hidden fixed inset-0 bg-black/40 backdrop-blur-sm z-40"
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`
          fixed top-4 left-4 bottom-4 w-[56px] h-[calc(100vh-32px)]
          bg-black rounded-[24px] py-[12px] px-[8px] z-50
          flex flex-col items-center gap-[10px]
          transition-transform duration-300 ease-in-out select-none
          overflow-y-auto no-scrollbar
          ${mobileOpen ? 'translate-x-0' : '-translate-x-[150%] md:translate-x-0'}
        `}
      >
        {/* Top: Logo (36px, centered, no tile background) */}
        <NavLink
          to="/"
          onClick={() => setMobileOpen(false)}
          className="w-[36px] h-[36px] flex items-center justify-center flex-shrink-0 text-white hover:opacity-90 transition-opacity"
          title="Fillcart"
          aria-label="Fillcart Home"
        >
          <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
            {/* Top-Left: large tilted oval (-38 deg) */}
            <ellipse cx="9.5" cy="10" rx="5.2" ry="3.8" transform="rotate(-38 9.5 10)" fill="#FFFFFF" />
            {/* Top-Right: vertical oval (+8 deg) */}
            <ellipse cx="19" cy="10.5" rx="2.4" ry="4.5" transform="rotate(8 19 10.5)" fill="#FFFFFF" />
            {/* Bottom: horizontal oval (-3 deg) */}
            <ellipse cx="14.5" cy="18.5" rx="4.8" ry="3.2" transform="rotate(-3 14.5 18.5)" fill="#FFFFFF" />
          </svg>
        </NavLink>

        {/* Group 1: Core Operations */}
        <div className="flex flex-col items-center gap-[10px] w-full">
          {group1Items.map(renderNavTile)}
        </div>

        {/* Divider 1: 1px, rgba(255,255,255,0.12), width 24px, margin 6px 0 */}
        <div className="w-[24px] h-[1px] bg-white/[0.12] my-[6px] flex-shrink-0" />

        {/* Group 2: Management & Finance */}
        <div className="flex flex-col items-center gap-[10px] w-full">
          {group2Items.map(renderNavTile)}
        </div>

        {/* Divider 2: 1px, rgba(255,255,255,0.12), width 24px, margin 6px 0 */}
        <div className="w-[24px] h-[1px] bg-white/[0.12] my-[6px] flex-shrink-0" />

        {/* Group 3: Administration */}
        <div className="flex flex-col items-center gap-[10px] w-full">
          {group3Items.map(renderNavTile)}
        </div>

        {/* Settings: pinned to very bottom (margin-top: auto), same 40px tile style */}
        <div className="mt-auto relative group flex items-center justify-center flex-shrink-0 pt-1">
          <NavLink
            to="/staff"
            onClick={() => setMobileOpen(false)}
            className={`
              w-[40px] h-[40px] rounded-[12px] flex items-center justify-center transition-all duration-150 relative
              ${
                location.pathname === '/settings' || location.pathname === '/staff'
                  ? 'bg-white text-black'
                  : 'bg-white/10 text-white/80 hover:bg-white/[0.18] hover:text-white'
              }
            `}
            aria-label="Settings"
          >
            <Settings className="w-[18px] h-[18px] stroke-[1.5]" />
          </NavLink>

          {/* Tooltip on hover */}
          <div className="absolute left-[54px] top-1/2 -translate-y-1/2 px-2.5 py-1 bg-black text-white text-[11px] font-sans font-normal rounded-lg whitespace-nowrap shadow-xl border border-white/10 opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity z-50">
            Settings
          </div>
        </div>
      </aside>
    </>
  );
};
