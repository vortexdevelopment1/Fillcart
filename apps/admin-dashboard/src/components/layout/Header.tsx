import React, { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { useLocation } from 'react-router-dom';
import { RotateCw, Menu, X } from 'lucide-react';
import { useToast } from '../../context/ToastContext';
import { useSidebar } from '../../context/SidebarContext';
import { GlobalSearch } from './GlobalSearch';
import { AdminProfileContent } from './AdminProfileMenu';

// Route-specific titles and subtitles for all dashboard pages
const ROUTE_CONFIG: Record<string, { title: string; subtitle: string }> = {
  '/document-verification': {
    title: 'Document Verification',
    subtitle: "Review riders' and vendors' documents before they go live",
  },
  '/products': {
    title: 'Products & Categories',
    subtitle: 'Manage your catalogue and categories',
  },
  '/vendors': {
    title: 'Vendor Management',
    subtitle: 'Manage local vendors, their stores and payouts',
  },
  '/riders': {
    title: 'Rider Management',
    subtitle: 'Manage delivery partners, availability and payouts',
  },
  '/orders': {
    title: 'Order Management',
    subtitle: 'Live dispatch pipeline, cart exceptions, refund requests & cancellation tickets',
  },
  '/finance': {
    title: 'Finance Hub',
    subtitle: 'Overview, settlements, commission rates, wallet, coupons, taxes & statements',
  },
  '/payments': {
    title: 'Payments & Statements',
    subtitle: 'Automated merchant payouts, UPI gateway reconciliations & delivery fees',
  },
  '/reports': {
    title: 'Basic Reports',
    subtitle: 'Executive performance metrics, SLA delivery reports & regional revenue charts',
  },
  '/staff': {
    title: 'Staff Roles & Permissions',
    subtitle: 'Internal ops hierarchy, RBAC policy assignments & two-factor authorization',
  },
  '/audit-logs': {
    title: 'Audit Logs',
    subtitle: 'System audit trails, staff activity logs & security events',
  },
  '/settings': {
    title: 'System Settings',
    subtitle: 'Control how the platform behaves',
  },
};

// Avatar button component with full accessibility, focus rings, and status dot
interface AdminAvatarButtonProps {
  isHome?: boolean;
  isOpen: boolean;
  onClick: () => void;
  className?: string;
  buttonRef?: React.Ref<HTMLButtonElement>;
}

const AdminAvatarButton: React.FC<AdminAvatarButtonProps> = ({
  isOpen,
  onClick,
  className = '',
  buttonRef,
}) => {
  const [imgError, setImgError] = useState(false);

  return (
    <button
      ref={buttonRef}
      type="button"
      onClick={onClick}
      aria-label="Open profile"
      aria-haspopup="menu"
      aria-expanded={isOpen}
      className={`rounded-full cursor-pointer focus:outline-none focus:ring-2 focus:ring-secondary focus:ring-offset-2 transition-transform duration-150 active:scale-95 flex-shrink-0 ${className}`}
    >
      <div className="relative flex-shrink-0">
        {!imgError ? (
          <img
            src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80"
            alt="Sarah Profile"
            onError={() => setImgError(true)}
            className="w-10 h-10 rounded-full object-cover border-2 border-white shadow-sm ring-1 ring-primary/10"
          />
        ) : (
          <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-white font-sans text-xs font-medium shadow-sm ring-1 ring-primary/10 select-none flex-shrink-0">
            SM
          </div>
        )}
        <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-secondary rounded-full border-2 border-white" />
      </div>
    </button>
  );
};

export const Header: React.FC = () => {
  const location = useLocation();
  const [greeting, setGreeting] = useState('Good Afternoon');
  const [isSyncing, setIsSyncing] = useState(false);
  const [lastSyncText, setLastSyncText] = useState('Just now');
  const { addToast } = useToast();
  const { isMobileOpen, toggleMobileOpen } = useSidebar();

  // Profile Menu State & Refs
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const mobileAvatarButtonRef = useRef<HTMLButtonElement>(null);
  const desktopAvatarButtonRef = useRef<HTMLButtonElement>(null);
  const desktopContainerRef = useRef<HTMLDivElement>(null);
  const activeTriggerRef = useRef<HTMLButtonElement | null>(null);

  const toggleProfile = (source: 'mobile' | 'desktop') => {
    activeTriggerRef.current =
      source === 'mobile' ? mobileAvatarButtonRef.current : desktopAvatarButtonRef.current;
    setIsProfileOpen((prev) => !prev);
  };

  const closeProfile = () => {
    setIsProfileOpen(false);
    activeTriggerRef.current?.focus();
  };

  // Close menu on route change
  useEffect(() => {
    setIsProfileOpen(false);
  }, [location.pathname]);

  // Lock body scroll on mobile/tablet when bottom sheet is open
  useEffect(() => {
    if (isProfileOpen && window.innerWidth < 1024) {
      const originalOverflow = document.body.style.overflow;
      document.body.style.overflow = 'hidden';
      return () => {
        document.body.style.overflow = originalOverflow;
      };
    }
  }, [isProfileOpen]);

  // Keyboard accessibility: Escape closes menu and returns focus
  useEffect(() => {
    if (!isProfileOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        closeProfile();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isProfileOpen]);

  // Click outside listener for desktop dropdown
  useEffect(() => {
    if (!isProfileOpen) return;
    const handleClickOutside = (e: MouseEvent) => {
      if (
        window.innerWidth >= 1024 &&
        desktopContainerRef.current &&
        !desktopContainerRef.current.contains(e.target as Node)
      ) {
        setIsProfileOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isProfileOpen]);

  const isHome = location.pathname === '/';
  let pageMeta = ROUTE_CONFIG[location.pathname];
  if (!pageMeta) {
    if (location.pathname.startsWith('/vendors/')) {
      pageMeta = {
        title: 'Vendor Details',
        subtitle: 'Manage vendor store, verification status, catalogue & payouts',
      };
    } else if (location.pathname.startsWith('/riders/')) {
      pageMeta = {
        title: 'Rider Details',
        subtitle: 'Manage delivery partner, vehicle spec, SLA & earnings',
      };
    }
  }

  useEffect(() => {
    const hour = new Date().getHours();
    if (hour < 12) {
      setGreeting('Good Morning');
    } else if (hour < 18) {
      setGreeting('Good Afternoon');
    } else {
      setGreeting('Good Evening');
    }
  }, []);

  const handleManualSync = () => {
    if (isSyncing) return;
    setIsSyncing(true);
    setLastSyncText('Syncing...');

    setTimeout(() => {
      setIsSyncing(false);
      setLastSyncText('Just now');
      addToast('info', 'Data Synchronized', 'All operations data refreshed from platform network.');
    }, 900);
  };

  return (
    <header className="relative z-40 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-2.5 lg:gap-3 mb-3.5 flex-shrink-0 w-full min-w-0">
      {/* ─────────────────────────────────────────────────────────────
          ROW 1 on mobile/tablet (<1024px) | LEFT TITLE on desktop (>=1024px)
          - Left: Hamburger button (fixed size 40x40, flex-shrink:0)
          - Middle: Title + subtitle block (flex:1, min-width:0, clamp font size)
          - Right: Admin Avatar (pinned to top-right on <1024px, hidden on desktop >=1024px)
         ───────────────────────────────────────────────────────────── */}
      <div className="flex items-center justify-between gap-2 sm:gap-3 w-full lg:w-auto min-w-0 flex-nowrap">
        {/* Mobile Hamburger Button in Header (<768px) */}
        <button
          onClick={toggleMobileOpen}
          className="md:hidden w-10 h-10 rounded-[14px] bg-primary text-white flex items-center justify-center shadow-md focus:outline-none focus:ring-2 focus:ring-secondary flex-shrink-0"
          aria-label={isMobileOpen ? 'Close navigation menu' : 'Open navigation menu'}
        >
          {isMobileOpen ? (
            <X className="w-5 h-5 text-white" />
          ) : (
            <Menu className="w-5 h-5 text-white" />
          )}
        </button>

        {/* Title + Subtitle Block */}
        <div className="flex-1 min-w-0">
          <h1 className="font-heading text-[clamp(19px,4.5vw,28px)] font-normal text-ink tracking-tight leading-[1.2] truncate">
            {isHome ? (
              <>
                {greeting}, <span className="font-heading font-normal">Sarah</span>
              </>
            ) : (
              pageMeta?.title || 'Fillkart Admin'
            )}
          </h1>
          <p className="font-sans text-[11px] md:text-[12px] text-ink/60 mt-0.5 leading-snug line-clamp-1 sm:line-clamp-2 lg:truncate">
            {isHome
              ? 'Your latest platform updates here'
              : pageMeta?.subtitle || 'Enterprise Operations & Governance'}
          </p>
        </div>

        {/* Mobile/Tablet Avatar: ALWAYS pinned to the top-right corner of Row 1 on <1024px */}
        <div className="lg:hidden flex-shrink-0 ml-auto">
          <AdminAvatarButton
            isHome={isHome}
            isOpen={isProfileOpen}
            onClick={() => toggleProfile('mobile')}
            buttonRef={mobileAvatarButtonRef}
          />
        </div>
      </div>

      {/* ─────────────────────────────────────────────────────────────
          ROW 2 on mobile/tablet (<1024px) | RIGHT ACTIONS on desktop (>=1024px)
          - Search button on the left (starts at left edge of row 2 on mobile)
          - "Last sync / Just now" pill next to it
          - Desktop Avatar (shown only on >=1024px at the end of the action group)
         ───────────────────────────────────────────────────────────── */}
      <div className="w-full lg:w-auto flex items-center justify-start lg:justify-end gap-2 sm:gap-3 flex-shrink-0">
        {/* Global Search Bar / Button */}
        <GlobalSearch />

        {/* Sync Pill: "Last sync / Just now" */}
        <button
          onClick={handleManualSync}
          className="h-10 px-3.5 rounded-full bg-white border border-primary/10 flex items-center gap-2 shadow-sm hover:bg-neutral transition-all group focus:outline-none focus:ring-2 focus:ring-secondary flex-shrink-0"
          title="Click to sync operations state"
        >
          <RotateCw
            className={`w-3.5 h-3.5 text-ink/60 group-hover:text-ink transition-transform ${
              isSyncing ? 'animate-spin text-secondary' : ''
            }`}
          />
          <div className="text-left text-xs leading-none">
            <span className="text-ink/60 block text-[9px] mb-0.5">Last sync</span>
            <span className="text-ink font-medium block text-[11px]">{lastSyncText}</span>
          </div>
        </button>

        {/* Desktop Avatar (>=1024px): sits in the right actions group */}
        <div ref={desktopContainerRef} className="hidden lg:block relative flex-shrink-0">
          <AdminAvatarButton
            isHome={isHome}
            isOpen={isProfileOpen}
            onClick={() => toggleProfile('desktop')}
            buttonRef={desktopAvatarButtonRef}
          />

          {/* Desktop Dropdown anchored below avatar */}
          {isProfileOpen && (
            <div
              role="menu"
              aria-label="Admin Profile Menu"
              className="absolute right-0 top-[calc(100%+8px)] z-[1000] w-[310px] max-w-[calc(100vw-24px)] bg-white rounded-[22px] border border-primary/10 shadow-floating p-4 animate-in fade-in slide-in-from-top-2 duration-150 motion-reduce:animate-none"
            >
              <AdminProfileContent
                onClose={closeProfile}
                activeTriggerRef={desktopAvatarButtonRef}
              />
            </div>
          )}
        </div>
      </div>

      {/* Mobile/Tablet Bottom Sheet (<1024px) rendered via Portal */}
      {isProfileOpen &&
        typeof document !== 'undefined' &&
        createPortal(
          <div className="lg:hidden fixed inset-0 z-[999] flex flex-col justify-end">
            {/* Dark semi-transparent backdrop */}
            <div
              onClick={closeProfile}
              className="fixed inset-0 bg-ink/50 backdrop-blur-[2px] transition-opacity duration-200"
              aria-hidden="true"
            />

            {/* Bottom Sheet Card */}
            <div
              role="dialog"
              aria-modal="true"
              aria-label="Admin Profile"
              className="relative z-[1000] w-full max-w-full sm:max-w-md sm:mx-auto bg-white rounded-t-[28px] border-t border-primary/10 shadow-floating p-5 max-h-[85dvh] overflow-y-auto animate-in slide-in-from-bottom duration-200 ease-out motion-reduce:animate-none"
            >
              {/* Top Drag Handle */}
              <div className="w-10 h-1 bg-ink/20 rounded-full mx-auto mb-3" />

              {/* Close (X) button */}
              <button
                type="button"
                onClick={closeProfile}
                className="absolute top-4 right-4 w-9 h-9 rounded-full bg-neutral hover:bg-neutral/80 flex items-center justify-center text-ink/70 hover:text-ink transition-colors focus:outline-none focus:ring-2 focus:ring-secondary"
                aria-label="Close profile panel"
              >
                <X className="w-4 h-4" />
              </button>

              {/* Profile Content */}
              <AdminProfileContent
                onClose={closeProfile}
                activeTriggerRef={mobileAvatarButtonRef}
              />
            </div>
          </div>,
          document.body
        )}
    </header>
  );
};
