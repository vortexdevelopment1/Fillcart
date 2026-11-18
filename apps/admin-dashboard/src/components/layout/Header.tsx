import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { RotateCw } from 'lucide-react';
import { useToast } from '../../context/ToastContext';
import { GlobalSearch } from './GlobalSearch';

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

export const Header: React.FC = () => {
  const location = useLocation();
  const [greeting, setGreeting] = useState('Good Afternoon');
  const [isSyncing, setIsSyncing] = useState(false);
  const [lastSyncText, setLastSyncText] = useState('Just now');
  const { addToast } = useToast();

  const isHome = location.pathname === '/';
  const pageMeta = ROUTE_CONFIG[location.pathname];

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
    <header className="flex items-center justify-between gap-4 mb-3.5 flex-shrink-0 pl-11 md:pl-0">
      {/* Left: Heading 28px, Arbutus Slab; subtitle Poppins 12px, INK 60% */}
      <div>
        <h1 className="font-heading text-[28px] font-normal text-ink tracking-tight leading-[1.2]">
          {isHome ? (
            <>
              {greeting}, <span className="font-heading font-normal">Sarah</span>
            </>
          ) : (
            pageMeta?.title || 'Fillkart Admin'
          )}
        </h1>
        <p className="font-sans text-[12px] text-ink/60 mt-1 leading-none">
          {isHome
            ? 'Your latest platform updates here'
            : pageMeta?.subtitle || 'Enterprise Operations & Governance'}
        </p>
      </div>

      {/* Right Controls */}
      <div className="flex items-center gap-3">
        {/* Global Search Bar / Button */}
        <GlobalSearch />

        {/* Sync Pill: "Last sync / Just now" */}
        <button
          onClick={handleManualSync}
          className="h-10 px-3.5 rounded-full bg-white border border-primary/10 flex items-center gap-2 shadow-sm hover:bg-neutral transition-all group focus:outline-none focus:ring-2 focus:ring-secondary"
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

        {/* Avatar: Sarah photo on Home, PRIMARY "AD" round avatar on all other pages */}
        {isHome ? (
          <div className="relative pl-1">
            <img
              src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80"
              alt="Sarah Profile"
              className="w-10 h-10 rounded-full object-cover border-2 border-white shadow-sm ring-1 ring-primary/10"
            />
            <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-secondary rounded-full border-2 border-white" />
          </div>
        ) : (
          <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-white font-sans text-xs font-medium shadow-sm ring-1 ring-primary/10 select-none">
            AD
          </div>
        )}
      </div>
    </header>
  );
};
