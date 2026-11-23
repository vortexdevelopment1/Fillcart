import React, { useState, useRef, useEffect } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
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
  PanelLeftOpen,
  PanelLeftClose,
  Menu,
  X,
  Landmark,
  LogOut,
} from 'lucide-react';
import { useVerification } from '../../context/VerificationContext';
import { useSidebar } from '../../context/SidebarContext';
import { useApp } from '../../context/AppContext';
import { useToast } from '../../context/ToastContext';
import { ModuleName } from '../../data/staffData';
import { SidebarTooltipPortal } from './SidebarTooltipPortal';
import { lockSettings } from '../../services/settingsAccess';

interface NavItemConfig {
  id: string;
  name: string;
  path: string;
  icon: React.ElementType;
  badge?: number | string;
  group: 'MAIN' | 'USERS' | 'MANAGEMENT' | 'FINANCE' | 'SYSTEM' | 'BOTTOM';
  module?: ModuleName;
}

export const Sidebar: React.FC = () => {
  const location = useLocation();
  const { stats } = useVerification();
  const {
    isExpanded,
    toggleExpanded,
    isMobileOpen,
    toggleMobileOpen,
    closeMobile,
  } = useSidebar();
  const { hasPermission, currentRole } = useApp();
  const { addToast } = useToast();

  // On mobile (< 768px), sidebar is completely hidden when closed. When open (isMobileOpen),
  // it is ALWAYS in full open panel mode (256px wide, expanded header, group titles and links).
  // Single strap (collapsed mode) is NEVER shown on mobile.
  // On tablet/desktop (>= 768px), isExpanded controls whether it's collapsed (56px) or expanded (256px).
  const isPanelOpen = isExpanded || isMobileOpen;

  const handleLogout = () => {
    lockSettings();
    addToast(
      'info',
      'Admin Logout',
      'Session ended (Mock). Production auth will clear tokens & redirect to login on backend integration.'
    );
  };

  // Floating Portal Tooltip state for Collapsed Mode
  const [tooltipState, setTooltipState] = useState<{
    visible: boolean;
    text: string;
    badge?: number | string;
    targetRect: DOMRect | null;
  }>({
    visible: false,
    text: '',
    targetRect: null,
  });

  const hoverTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Check if touch device
  const isTouchDevice =
    typeof window !== 'undefined' &&
    window.matchMedia('(pointer: coarse)').matches;

  // Single shared config array for all navigation items
  const navItems: NavItemConfig[] = [
    // Group: MAIN
    { id: 'dashboard', name: 'Dashboard', path: '/', icon: LayoutDashboard, group: 'MAIN' },
    {
      id: 'doc-verification',
      name: 'Document Verification',
      path: '/document-verification',
      icon: FileCheck2,
      badge: stats.pending > 0 ? stats.pending : undefined,
      group: 'MAIN',
      module: 'Users',
    },
    { id: 'orders', name: 'Orders', path: '/orders', icon: ShoppingBag, group: 'MAIN', module: 'Orders' },

    // Group: USERS
    { id: 'vendors', name: 'Vendors', path: '/vendors', icon: Store, group: 'USERS', module: 'Users' },
    { id: 'riders', name: 'Riders', path: '/riders', icon: Bike, group: 'USERS', module: 'Users' },

    // Group: MANAGEMENT
    {
      id: 'products',
      name: 'Products & Categories',
      path: '/products',
      icon: Layers,
      group: 'MANAGEMENT',
      module: 'Products',
    },

    // Group: FINANCE
    { id: 'finance', name: 'Finance', path: '/finance', icon: Landmark, group: 'FINANCE', module: 'Payments' },

    // Group: SYSTEM
    { id: 'reports', name: 'Reports', path: '/reports', icon: BarChart3, group: 'SYSTEM', module: 'Reports' },
    {
      id: 'staff',
      name: 'Staff Roles & Permissions',
      path: '/staff',
      icon: ShieldCheck,
      group: 'SYSTEM',
      module: 'Settings',
    },
    { id: 'audit-logs', name: 'Audit Logs', path: '/audit-logs', icon: History, group: 'SYSTEM', module: 'Audit Logs' },

    // Pinned Bottom
    { id: 'settings', name: 'Settings', path: '/settings', icon: Settings, group: 'BOTTOM' },
  ];

  // RBAC Filtering: Finance Admin sees MAIN (Dashboard, Orders view-only), FINANCE, and Reports; hide the rest.
  const visibleItems = navItems.filter((i) => {
    if (currentRole === 'Finance Admin') {
      if (i.id === 'dashboard' || i.id === 'orders') return true;
      if (i.id === 'finance') return true;
      if (i.id === 'reports') return true;
      return false;
    }
    return !i.module || hasPermission(i.module, 'View');
  });

  const mainItems = visibleItems.filter((i) => i.group === 'MAIN');
  const userItems = visibleItems.filter((i) => i.group === 'USERS');
  const managementItems = visibleItems.filter((i) => i.group === 'MANAGEMENT');
  const financeItems = visibleItems.filter((i) => i.group === 'FINANCE');
  const systemItems = visibleItems.filter((i) => i.group === 'SYSTEM');
  const settingsItem = navItems.find((i) => i.group === 'BOTTOM')!;
  const showSettings =
    currentRole === 'Super Admin' ||
    currentRole === 'Finance Admin' ||
    currentRole === 'Marketing Admin';

  // Handle tooltip on mouseEnter for collapsed mode
  const handleMouseEnter = (
    e: React.MouseEvent<HTMLElement>,
    name: string,
    badge?: number | string
  ) => {
    if (isExpanded) return;
    const rect = e.currentTarget.getBoundingClientRect();

    if (hoverTimerRef.current) clearTimeout(hoverTimerRef.current);
    hoverTimerRef.current = setTimeout(() => {
      setTooltipState({
        visible: true,
        text: name,
        badge,
        targetRect: rect,
      });
    }, 60);
  };

  const handleMouseLeave = () => {
    if (hoverTimerRef.current) clearTimeout(hoverTimerRef.current);
    setTooltipState((prev) => (prev.visible ? { ...prev, visible: false } : prev));
  };

  // Automatically dismiss tooltip on route change, expand toggle, scroll, resize, or pointerdown
  useEffect(() => {
    handleMouseLeave();
  }, [location.pathname, isExpanded]);

  useEffect(() => {
    if (!tooltipState.visible) return;

    const dismissTooltip = () => {
      handleMouseLeave();
    };

    window.addEventListener('scroll', dismissTooltip, true);
    window.addEventListener('pointerdown', dismissTooltip);
    window.addEventListener('resize', dismissTooltip);
    window.addEventListener('wheel', dismissTooltip, { passive: true });

    return () => {
      window.removeEventListener('scroll', dismissTooltip, true);
      window.removeEventListener('pointerdown', dismissTooltip);
      window.removeEventListener('resize', dismissTooltip);
      window.removeEventListener('wheel', dismissTooltip);
    };
  }, [tooltipState.visible]);

  const handleNavClick = () => {
    handleMouseLeave();
    closeMobile();
  };

  // Render individual nav item
  const renderNavItem = (item: NavItemConfig) => {
    const Icon = item.icon;
    const isActive =
      item.path === '/'
        ? location.pathname === '/'
        : location.pathname.startsWith(item.path);

    if (isPanelOpen) {
      // ──────────── EXPANDED MODE ROW ────────────
      return (
        <NavLink
          key={item.id}
          to={item.path}
          onClick={handleNavClick}
          aria-current={isActive ? 'page' : undefined}
          className={`
            w-[calc(100%-8px)] mx-auto h-[40px] rounded-[14px] px-3 flex items-center gap-2.5 transition-all duration-150 select-none relative group focus:outline-none focus:ring-2 focus:ring-secondary
            ${
              isActive
                ? 'bg-neutral text-primary font-medium shadow-xs'
                : 'text-white/75 hover:bg-white/10 hover:text-white'
            }
          `}
        >
          <Icon className="w-[18px] h-[18px] stroke-[1.5] flex-shrink-0" />

          {/* Label with delay-fade animation */}
          <span
            className="text-[12px] font-sans whitespace-nowrap overflow-hidden transition-opacity duration-150 delay-100 opacity-100 tracking-tight"
          >
            {item.name}
          </span>

          {/* 20px SECONDARY Pill Notification Badge */}
          {item.badge !== undefined && (
            <span className="ml-auto px-2 h-[20px] rounded-full bg-secondary text-white text-[10px] font-sans font-medium flex items-center justify-center leading-none flex-shrink-0 shadow-xs">
              {item.badge}
            </span>
          )}
        </NavLink>
      );
    }

    // ──────────── COLLAPSED MODE TILE (36px) ────────────
    return (
      <div
        key={item.id}
        className="relative flex items-center justify-center flex-shrink-0 w-[40px]"
        onMouseEnter={(e) => handleMouseEnter(e, item.name, item.badge)}
        onMouseLeave={handleMouseLeave}
      >
        <NavLink
          to={item.path}
          onClick={(e) => {
            handleMouseLeave();
            (e.currentTarget as HTMLElement).blur();
            handleNavClick();
          }}
          aria-label={item.name}
          aria-current={isActive ? 'page' : undefined}
          className={`
            w-[36px] h-[36px] rounded-[14px] flex items-center justify-center transition-all duration-150 relative focus:outline-none focus:ring-2 focus:ring-secondary
            ${
              isActive
                ? 'bg-white text-primary shadow-sm'
                : 'bg-white/10 text-white/80 hover:bg-white/[0.18] hover:text-white'
            }
          `}
        >
          <Icon className="w-[18px] h-[18px] stroke-[1.5]" />

          {/* 16px Circle Badge on Top-Right Corner */}
          {item.badge !== undefined && (
            <span className="absolute -top-[2px] -right-[2px] w-[16px] h-[16px] rounded-full bg-secondary text-white text-[9px] font-sans font-medium flex items-center justify-center leading-none shadow-sm pointer-events-none">
              {item.badge}
            </span>
          )}
        </NavLink>
      </div>
    );
  };

  return (
    <>
      {/* ──────────── Overlay for Mobile (< 768px) ──────────── */}
      {isMobileOpen && (
        <div
          onClick={closeMobile}
          className="fixed inset-0 z-40 bg-primary/30 backdrop-blur-[6px] transition-opacity duration-200 md:hidden"
          aria-hidden="true"
        />
      )}

      {/* ──────────── SIDEBAR CONTAINER ──────────── */}
      <aside
        onMouseLeave={handleMouseLeave}
        style={{
          width: isPanelOpen ? '256px' : '56px',
          backgroundColor: '#123747',
          backgroundImage: 'none',
          transition:
            'width 250ms cubic-bezier(0.16, 1, 0.3, 1), transform 250ms cubic-bezier(0.16, 1, 0.3, 1)',
          overflowX: 'hidden',
          boxSizing: 'border-box',
        }}
        className={`
          fixed top-3 left-3 h-[calc(100dvh-24px)]
          md:top-4 md:left-4 md:h-[calc(100dvh-32px)]
          bg-primary text-white rounded-[24px] z-50 select-none box-border
          flex flex-col overflow-y-hidden overflow-x-hidden shadow-2xl border border-white/[0.08]
          ${isPanelOpen ? 'p-[14px_10px]' : 'pt-3.5 pb-3 px-[8px] items-center'}
          ${
            isMobileOpen
              ? 'translate-x-0 w-[256px] p-[14px_10px]'
              : '-translate-x-[150%] md:translate-x-0'
          }
        `}
      >
        {/* ──────────── 1. HEADER ROW ──────────── */}
        {isPanelOpen ? (
          <div className="h-[44px] flex items-center justify-between mb-3 px-1 flex-shrink-0">
            {/* Logo + App Name */}
            <Link
              to="/"
              onClick={handleNavClick}
              className="flex items-center gap-2.5 focus:outline-none focus:ring-2 focus:ring-secondary rounded-lg"
              aria-label="Fillkart Dashboard Home"
            >
              <div className="w-[36px] h-[36px] rounded-full bg-secondary flex items-center justify-center flex-shrink-0 shadow-xs">
                <svg width="22" height="22" viewBox="0 0 28 28" fill="none">
                  <ellipse
                    cx="9.5"
                    cy="10"
                    rx="5.2"
                    ry="3.8"
                    transform="rotate(-38 9.5 10)"
                    fill="#FFFFFF"
                  />
                  <ellipse
                    cx="19"
                    cy="10.5"
                    rx="2.4"
                    ry="4.5"
                    transform="rotate(8 19 10.5)"
                    fill="#FFFFFF"
                  />
                  <ellipse
                    cx="14.5"
                    cy="18.5"
                    rx="4.8"
                    ry="3.2"
                    transform="rotate(-3 14.5 18.5)"
                    fill="#FFFFFF"
                  />
                </svg>
              </div>

              <span className="font-sans text-[15px] font-medium text-white tracking-tight">
                Fillkart
              </span>
            </Link>

            {/* Collapse Toggle Button (Far Right) */}
            <button
              type="button"
              onClick={() => {
                if (isMobileOpen) {
                  closeMobile();
                } else {
                  toggleExpanded();
                }
              }}
              aria-label={isMobileOpen ? 'Close sidebar' : 'Collapse sidebar'}
              aria-expanded={true}
              className="w-8 h-8 rounded-full hover:bg-white/10 flex items-center justify-center text-white/70 hover:text-white transition-colors focus:outline-none focus:ring-2 focus:ring-secondary"
            >
              <PanelLeftClose className="w-5 h-5 stroke-[1.5]" />
            </button>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-[6px] flex-shrink-0 mb-[6px] w-[40px] overflow-x-hidden">
            {/* Logo in Collapsed Mode: no active background */}
            <Link
              to="/"
              onClick={handleNavClick}
              className="w-[36px] h-[36px] rounded-full flex items-center justify-center flex-shrink-0 hover:bg-white/10 transition-colors focus:outline-none focus:ring-2 focus:ring-secondary"
              title="Fillkart"
              aria-label="Fillkart Home"
            >
              <svg width="22" height="22" viewBox="0 0 28 28" fill="none">
                <ellipse
                  cx="9.5"
                  cy="10"
                  rx="5.2"
                  ry="3.8"
                  transform="rotate(-38 9.5 10)"
                  fill="#FFFFFF"
                />
                <ellipse
                  cx="19"
                  cy="10.5"
                  rx="2.4"
                  ry="4.5"
                  transform="rotate(8 19 10.5)"
                  fill="#FFFFFF"
                />
                <ellipse
                  cx="14.5"
                  cy="18.5"
                  rx="4.8"
                  ry="3.2"
                  transform="rotate(-3 14.5 18.5)"
                  fill="#FFFFFF"
                />
              </svg>
            </Link>

            {/* Toggle Button Directly Below Logo in Collapsed Mode */}
            <div
              onMouseEnter={(e) => handleMouseEnter(e, 'Expand sidebar')}
              onMouseLeave={handleMouseLeave}
              className="flex items-center justify-center w-[40px]"
            >
              <button
                type="button"
                onClick={(e) => {
                  handleMouseLeave();
                  (e.currentTarget as HTMLElement).blur();
                  toggleExpanded();
                }}
                aria-label="Expand sidebar"
                aria-expanded={false}
                className="w-[36px] h-[36px] rounded-[14px] bg-white/10 text-white/80 hover:bg-white/[0.18] hover:text-white flex items-center justify-center transition-all focus:outline-none focus:ring-2 focus:ring-secondary"
              >
                <PanelLeftOpen className="w-[18px] h-[18px] stroke-[1.5]" />
              </button>
            </div>
          </div>
        )}

        {/* ──────────── 2. SCROLLABLE NAV AREA ──────────── */}
        <div className="relative flex-1 min-h-0 w-full flex flex-col overflow-hidden overflow-x-hidden">
          <nav
            aria-label="Main"
            style={{
              scrollbarWidth: 'none',
              msOverflowStyle: 'none',
              overflowX: 'hidden',
              WebkitOverflowScrolling: 'touch',
              overscrollBehaviorY: 'contain',
            }}
            onScroll={(e) => {
              if (e.currentTarget.scrollLeft !== 0) e.currentTarget.scrollLeft = 0;
            }}
            className={`flex-1 min-h-0 overflow-y-auto overflow-x-hidden no-scrollbar w-full flex flex-col ${
              isPanelOpen ? 'gap-1.5 py-1' : 'py-0'
            }`}
          >
            {/* Group 1: MAIN */}
            {isPanelOpen && (
              <span className="text-[10px] font-sans uppercase tracking-wider text-white/40 px-3 pt-1">
                Main
              </span>
            )}
            <div
              className={`flex flex-col ${
                isPanelOpen ? 'gap-1 w-full' : 'items-center gap-[6px] w-full'
              }`}
            >
              {mainItems.map(renderNavItem)}
            </div>

            {/* Divider 1 */}
            <div
              className={`h-[1px] bg-white/[0.12] flex-shrink-0 ${
                isPanelOpen ? 'w-full my-1.5' : 'w-[24px] self-center my-[4px]'
              }`}
            />

            {/* Group 2: USERS */}
            {userItems.length > 0 && (
              <>
                {isPanelOpen && (
                  <span className="text-[10px] font-sans uppercase tracking-wider text-white/40 px-3 pt-1">
                    Users
                  </span>
                )}
                <div
                  className={`flex flex-col ${
                    isPanelOpen ? 'gap-1 w-full' : 'items-center gap-[6px] w-full'
                  }`}
                >
                  {userItems.map(renderNavItem)}
                </div>

                {/* Divider between Users and Management */}
                <div
                  className={`h-[1px] bg-white/[0.12] flex-shrink-0 ${
                    isPanelOpen ? 'w-full my-1.5' : 'w-[24px] self-center my-[4px]'
                  }`}
                />
              </>
            )}

            {/* Group 3: MANAGEMENT */}
            {managementItems.length > 0 && (
              <>
                {isPanelOpen && (
                  <span className="text-[10px] font-sans uppercase tracking-wider text-white/40 px-3 pt-1">
                    Management
                  </span>
                )}
                <div
                  className={`flex flex-col ${
                    isPanelOpen ? 'gap-1 w-full' : 'items-center gap-[6px] w-full'
                  }`}
                >
                  {managementItems.map(renderNavItem)}
                </div>

                {/* Divider between Management and Finance */}
                <div
                  className={`h-[1px] bg-white/[0.12] flex-shrink-0 ${
                    isPanelOpen ? 'w-full my-1.5' : 'w-[24px] self-center my-[4px]'
                  }`}
                />
              </>
            )}

            {/* Group 4: FINANCE */}
            {financeItems.length > 0 && (
              <>
                {isPanelOpen && (
                  <span className="text-[10px] font-sans uppercase tracking-wider text-white/40 px-3 pt-1">
                    Finance
                  </span>
                )}
                <div
                  className={`flex flex-col ${
                    isPanelOpen ? 'gap-1 w-full' : 'items-center gap-[6px] w-full'
                  }`}
                >
                  {financeItems.map(renderNavItem)}
                </div>

                {/* Divider between Finance and System */}
                <div
                  className={`h-[1px] bg-white/[0.12] flex-shrink-0 ${
                    isPanelOpen ? 'w-full my-1.5' : 'w-[24px] self-center my-[4px]'
                  }`}
                />
              </>
            )}

            {/* Group 5: SYSTEM */}
            {systemItems.length > 0 && (
              <>
                {isPanelOpen && (
                  <span className="text-[10px] font-sans uppercase tracking-wider text-white/40 px-3 pt-1">
                    System
                  </span>
                )}
                <div
                  className={`flex flex-col ${
                    isPanelOpen ? 'gap-1 w-full' : 'items-center gap-[6px] w-full'
                  }`}
                >
                  {systemItems.map(renderNavItem)}
                </div>
              </>
            )}
            {/* Mobile-only Settings & Logout (inside scrollable nav so it can never be cut off) */}
            <div className="md:hidden mt-auto pt-2 border-t border-white/[0.12] flex flex-col gap-1 w-full flex-shrink-0 pb-3">
              {showSettings && renderNavItem(settingsItem)}

              <button
                type="button"
                onClick={handleLogout}
                className="w-[calc(100%-8px)] mx-auto h-[40px] px-3 rounded-[14px] flex items-center gap-2.5 transition-all duration-150 relative text-left focus:outline-none focus:ring-2 focus:ring-secondary text-white/70 hover:text-red-300 hover:bg-red-500/15"
                aria-label="Logout"
              >
                <LogOut className="w-[18px] h-[18px] stroke-[1.5] flex-shrink-0" />
                <span className="text-[12px] font-sans whitespace-nowrap overflow-hidden transition-opacity duration-150 delay-100 opacity-100 tracking-tight">
                  Logout
                </span>
              </button>
            </div>
          </nav>
        </div>

        {/* ──────────── 3. PINNED SETTINGS & LOGOUT AT BOTTOM (Desktop / Tablet >=md) ──────────── */}
        <div
          className={`hidden md:flex mt-auto flex-shrink-0 border-t border-white/[0.12] overflow-x-hidden flex-col ${
            isPanelOpen ? 'w-full pt-2 gap-1' : 'w-full items-center pt-[4px] gap-[6px]'
          }`}
        >
          {showSettings && renderNavItem(settingsItem)}

          {isPanelOpen ? (
            <button
              type="button"
              onClick={handleLogout}
              className="w-[calc(100%-8px)] mx-auto h-[40px] px-3 rounded-[14px] flex items-center gap-2.5 transition-all duration-150 relative text-left focus:outline-none focus:ring-2 focus:ring-secondary text-white/70 hover:text-red-300 hover:bg-red-500/15"
              aria-label="Logout"
            >
              <LogOut className="w-[18px] h-[18px] stroke-[1.5] flex-shrink-0" />
              <span className="text-[12px] font-sans whitespace-nowrap overflow-hidden transition-opacity duration-150 delay-100 opacity-100 tracking-tight">
                Logout
              </span>
            </button>
          ) : (
            <div
              className="relative flex items-center justify-center flex-shrink-0 w-[40px] max-w-[40px]"
              onMouseEnter={(e) => handleMouseEnter(e, 'Logout')}
              onMouseLeave={handleMouseLeave}
            >
              <button
                type="button"
                onClick={(e) => {
                  handleMouseLeave();
                  (e.currentTarget as HTMLElement).blur();
                  handleLogout();
                }}
                aria-label="Logout"
                className="w-[36px] h-[36px] rounded-[14px] flex items-center justify-center transition-all duration-150 relative focus:outline-none focus:ring-2 focus:ring-secondary bg-white/10 text-white/70 hover:text-red-300 hover:bg-red-500/20"
              >
                <LogOut className="w-[18px] h-[18px] stroke-[1.5]" />
              </button>
            </div>
          )}
        </div>
      </aside>

      {/* ──────────── Floating Portal Tooltip (Collapsed Mode) ──────────── */}
      <SidebarTooltipPortal
        visible={tooltipState.visible && !isPanelOpen}
        text={tooltipState.text}
        badge={tooltipState.badge}
        targetRect={tooltipState.targetRect}
      />
    </>
  );
};
