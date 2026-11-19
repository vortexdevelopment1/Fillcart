import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Search,
  X,
  LayoutDashboard,
  FileCheck2,
  Store,
  Bike,
  ShoppingBag,
  Layers,
  Landmark,
  BarChart3,
  ShieldCheck,
  History,
  Settings,
  CreditCard,
  HandCoins,
  Percent,
  Wallet,
  Ticket,
  Receipt,
  ArrowRight,
  Sparkles,
} from 'lucide-react';

interface SearchEntry {
  id: string;
  title: string;
  subtitle: string;
  category: 'Page' | 'Finance' | 'Vendor' | 'Order';
  path: string;
  icon: React.ElementType;
}

const SEARCH_DATABASE: SearchEntry[] = [
  // Primary Pages
  {
    id: 'dashboard',
    title: 'Dashboard',
    subtitle: 'Platform analytics, GMV metrics & live counters',
    category: 'Page',
    path: '/',
    icon: LayoutDashboard,
  },
  {
    id: 'doc-verification',
    title: 'Document Verification',
    subtitle: 'Review & approve rider/vendor onboarding KYC licenses',
    category: 'Page',
    path: '/document-verification',
    icon: FileCheck2,
  },
  {
    id: 'orders',
    title: 'Orders',
    subtitle: 'Live order pipeline, dispatch tracking & status management',
    category: 'Page',
    path: '/orders',
    icon: ShoppingBag,
  },
  {
    id: 'vendors',
    title: 'Vendors',
    subtitle: 'Manage merchant stores, documents, commissions & status',
    category: 'Page',
    path: '/vendors',
    icon: Store,
  },
  {
    id: 'riders',
    title: 'Riders',
    subtitle: 'Manage delivery fleet, availability, payouts & performance',
    category: 'Page',
    path: '/riders',
    icon: Bike,
  },
  {
    id: 'products',
    title: 'Products & Categories',
    subtitle: 'Catalog SKUs, inventory status, prices & categories',
    category: 'Page',
    path: '/products',
    icon: Layers,
  },
  {
    id: 'reports',
    title: 'Reports & Analytics',
    subtitle: 'SLA delivery reports, merchant sales & revenue charts',
    category: 'Page',
    path: '/reports',
    icon: BarChart3,
  },
  {
    id: 'staff',
    title: 'Staff Roles & Permissions',
    subtitle: 'Ops hierarchy, RBAC matrix, admin assignments & 2FA',
    category: 'Page',
    path: '/staff',
    icon: ShieldCheck,
  },
  {
    id: 'audit-logs',
    title: 'Audit Logs',
    subtitle: 'System audit trails, API logs, payment & admin events',
    category: 'Page',
    path: '/audit-logs',
    icon: History,
  },
  {
    id: 'audit-logs-payment',
    title: 'Payment Audit Trail',
    subtitle: 'Immutable ledger of merchant settlements, payouts, refunds & GST',
    category: 'Finance',
    path: '/audit-logs?tab=Payment',
    icon: CreditCard,
  },
  {
    id: 'audit-logs-api',
    title: 'API Request Logs',
    subtitle: 'HTTP request telemetry, latencies, status codes & endpoint errors',
    category: 'Page',
    path: '/audit-logs?tab=API',
    icon: History,
  },
  {
    id: 'settings',
    title: 'System Settings',
    subtitle: 'Platform configs, API credentials & maintenance options',
    category: 'Page',
    path: '/settings',
    icon: Settings,
  },

  // Finance Hub & Tabs
  {
    id: 'finance-overview',
    title: 'Finance Overview',
    subtitle: 'Revenue vs commission bar chart, GMV & financial stats',
    category: 'Finance',
    path: '/finance?tab=overview',
    icon: Landmark,
  },
  {
    id: 'settlements',
    title: 'Settlements',
    subtitle: 'Process merchant & rider batch payouts and net earnings',
    category: 'Finance',
    path: '/finance?tab=settlements',
    icon: HandCoins,
  },
  {
    id: 'commission',
    title: 'Commission Rates',
    subtitle: 'Category take-rates, vendor commission overrides & history',
    category: 'Finance',
    path: '/finance?tab=commission',
    icon: Percent,
  },
  {
    id: 'wallet',
    title: 'Customer Wallets',
    subtitle: 'Wallet balances, goodwill credits & refund ledger',
    category: 'Finance',
    path: '/finance?tab=wallet',
    icon: Wallet,
  },
  {
    id: 'coupons',
    title: 'Coupons & Promos',
    subtitle: 'Discount codes, campaign limits, validity & redemption',
    category: 'Finance',
    path: '/finance?tab=coupons',
    icon: Ticket,
  },
  {
    id: 'taxes',
    title: 'Taxes (GST)',
    subtitle: 'GST slabs (0%, 5%, 12%, 18%) & vendor GSTIN registry',
    category: 'Finance',
    path: '/finance?tab=taxes',
    icon: Receipt,
  },
  {
    id: 'payments',
    title: 'Payments & Statements',
    subtitle: 'Gateway transactions, UPI reconciliations & statements',
    category: 'Finance',
    path: '/finance?tab=payments',
    icon: CreditCard,
  },

  // Key Mock Entities for Instant Jump
  {
    id: 'vendor-fresh-mart',
    title: 'Fresh Mart Hub',
    subtitle: 'Active Vendor store in Delhi (Grocery)',
    category: 'Vendor',
    path: '/vendors',
    icon: Store,
  },
  {
    id: 'vendor-royal-kirana',
    title: 'Royal Kirana Stores',
    subtitle: 'Active Vendor store in Indore (FMCG)',
    category: 'Vendor',
    path: '/vendors',
    icon: Store,
  },
  {
    id: 'vendor-sharma-dairy',
    title: 'Sharma Dairy & Provisions',
    subtitle: 'Active Vendor store in Jabalpur (Dairy)',
    category: 'Vendor',
    path: '/vendors',
    icon: Store,
  },
  {
    id: 'order-fk8921',
    title: 'Order #FK-8921',
    subtitle: 'Recent customer order dispatched with rider Vikram',
    category: 'Order',
    path: '/orders',
    icon: ShoppingBag,
  },
  {
    id: 'order-fk8922',
    title: 'Order #FK-8922',
    subtitle: 'Out for delivery order to Priya Nair',
    category: 'Order',
    path: '/orders',
    icon: ShoppingBag,
  },
];

export const GlobalSearch: React.FC = () => {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);

  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Filter items based on query
  const trimmed = query.trim().toLowerCase();
  const filteredItems = trimmed
    ? SEARCH_DATABASE.filter(
        (item) =>
          item.title.toLowerCase().includes(trimmed) ||
          item.subtitle.toLowerCase().includes(trimmed) ||
          item.category.toLowerCase().includes(trimmed)
      )
    : SEARCH_DATABASE.slice(0, 7); // Default top quick links when query is empty

  // Focus input when opened
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => {
        inputRef.current?.focus();
      }, 50);
    } else {
      setQuery('');
      setSelectedIndex(0);
    }
  }, [isOpen]);

  // Click outside listener
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  // Global keyboard shortcuts: "/" or "Ctrl+K" / "Cmd+K" to open, "Escape" to close
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Do not trigger if typing in an input or textarea
      const targetTag = (e.target as HTMLElement)?.tagName?.toLowerCase();
      const isInput = targetTag === 'input' || targetTag === 'textarea' || (e.target as HTMLElement)?.isContentEditable;

      if ((e.key === '/' && !isInput) || ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k')) {
        e.preventDefault();
        setIsOpen(true);
      } else if (e.key === 'Escape' && isOpen) {
        e.preventDefault();
        setIsOpen(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen]);

  const handleSelect = (item: SearchEntry) => {
    navigate(item.path);
    setIsOpen(false);
    setQuery('');
  };

  const handleKeyDownInInput = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex((prev) => (filteredItems.length > 0 ? (prev + 1) % filteredItems.length : 0));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex((prev) => (filteredItems.length > 0 ? (prev - 1 + filteredItems.length) % filteredItems.length : 0));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (filteredItems[selectedIndex]) {
        handleSelect(filteredItems[selectedIndex]);
      } else if (trimmed) {
        // Fallback: search in orders or vendors
        navigate(`/orders?search=${encodeURIComponent(trimmed)}`);
        setIsOpen(false);
        setQuery('');
      }
    } else if (e.key === 'Escape') {
      setIsOpen(false);
    }
  };

  return (
    <div ref={containerRef} className="relative">
      {!isOpen ? (
        // ──────────── Collapsed: Round 40px Search Icon Button ────────────
        <button
          onClick={() => setIsOpen(true)}
          className="w-10 h-10 rounded-full bg-white border border-primary/10 flex items-center justify-center text-ink hover:bg-neutral transition-all shadow-sm focus:outline-none focus:ring-2 focus:ring-secondary group cursor-pointer"
          title="Search dashboard (Press / or Ctrl+K)"
          aria-label="Search"
        >
          <Search className="w-4 h-4 text-ink group-hover:scale-105 transition-transform" />
        </button>
      ) : (
        // ──────────── Expanded: Active Search Input Pill ────────────
        <div className="flex items-center">
          <div className="relative flex items-center w-64 sm:w-80 md:w-88 h-10 bg-white rounded-full border border-primary/25 shadow-md focus-within:ring-2 focus-within:ring-secondary focus-within:border-secondary transition-all">
            <Search className="w-4 h-4 text-secondary ml-3.5 flex-shrink-0" />
            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={(e) => {
                setQuery(e.target.value);
                setSelectedIndex(0);
              }}
              onKeyDown={handleKeyDownInInput}
              placeholder="Search orders, vendors, pages..."
              className="w-full h-full pl-2.5 pr-8 bg-transparent text-[13px] font-sans text-ink placeholder:text-ink/40 focus:outline-none"
              aria-label="Search dashboard"
            />
            <button
              type="button"
              onClick={() => {
                if (query) {
                  setQuery('');
                  inputRef.current?.focus();
                } else {
                  setIsOpen(false);
                }
              }}
              className="p-1 mr-2 text-ink/40 hover:text-ink rounded-full hover:bg-neutral transition-colors flex-shrink-0"
              title={query ? 'Clear' : 'Close'}
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* ──────────── Mobile Dim Overlay (< 768px) ──────────── */}
          <div
            onClick={() => setIsOpen(false)}
            className="fixed inset-0 bg-primary/35 backdrop-blur-[2px] z-40 md:hidden"
            aria-hidden="true"
          />

          {/* ──────────── Dropdown Results Card ────────────
              On < 768px: fixed left 12px, right 12px, top 104px (below header row 2), width auto, max-height calc(100dvh - 120px)
              On >= 768px: absolute top-[48px] right-0 w-[400px] max-h-[380px]
          */}
          <div className="fixed md:absolute top-[104px] md:top-[48px] left-3 right-3 md:left-auto md:right-0 w-auto md:w-[400px] max-h-[calc(100dvh-120px)] md:max-h-[380px] bg-white rounded-[20px] shadow-2xl border border-primary/12 py-2.5 z-50 overflow-hidden flex flex-col animate-in fade-in slide-in-from-top-1 duration-150">
            {/* Header info */}
            <div className="px-3.5 pb-2 border-b border-primary/8 flex items-center justify-between text-[11px] font-sans text-ink/50">
              <span className="font-medium uppercase tracking-wider text-[10px] text-ink/40">
                {trimmed ? `Results for "${trimmed}"` : 'Quick Navigation'}
              </span>
              <span className="hidden md:flex text-[10px] items-center gap-1">
                <kbd className="px-1.5 py-0.5 rounded bg-neutral text-ink/60 border border-primary/10 text-[9px]">↑↓</kbd> to navigate
                <kbd className="px-1.5 py-0.5 rounded bg-neutral text-ink/60 border border-primary/10 text-[9px] ml-1">↵</kbd>
              </span>
            </div>

            {/* Results list */}
            <div className="overflow-y-auto max-h-[calc(100dvh-200px)] md:max-h-[300px] px-1.5 py-1">
              {filteredItems.length > 0 ? (
                filteredItems.map((item, idx) => {
                  const Icon = item.icon;
                  const isSelected = idx === selectedIndex;
                  return (
                    <div
                      key={item.id}
                      onClick={() => handleSelect(item)}
                      onMouseEnter={() => setSelectedIndex(idx)}
                      className={`
                        flex items-center gap-3 px-3 py-2 min-h-[56px] rounded-[14px] cursor-pointer transition-all
                        ${isSelected ? 'bg-neutral text-primary font-medium shadow-xs' : 'text-ink/80 hover:bg-neutral/70'}
                      `}
                    >
                      <div
                        className={`w-[36px] h-[36px] rounded-[10px] flex items-center justify-center flex-shrink-0 ${
                          isSelected ? 'bg-primary text-white' : 'bg-primary/8 text-primary'
                        }`}
                      >
                        <Icon className="w-4 h-4 stroke-[1.8]" />
                      </div>

                      <div className="flex-1 min-w-0 text-left">
                        <div className="flex items-center justify-between gap-2">
                          <span className="text-[13px] font-sans font-medium text-ink truncate">
                            {item.title}
                          </span>
                          <span
                            className={`text-[9px] font-sans font-medium px-1.5 py-0.5 rounded-full uppercase tracking-wider whitespace-nowrap flex-shrink-0 ${
                              item.category === 'Finance'
                                ? 'bg-secondary/15 text-secondary'
                                : item.category === 'Order'
                                ? 'bg-primary/10 text-primary'
                                : item.category === 'Vendor'
                                ? 'bg-amber-100 text-amber-800'
                                : 'bg-neutral text-ink/60'
                            }`}
                          >
                            {item.category}
                          </span>
                        </div>
                        <p className="text-[11px] font-sans text-ink/50 truncate leading-tight mt-0.5">
                          {item.subtitle}
                        </p>
                      </div>

                      <ArrowRight
                        className={`w-3.5 h-3.5 text-ink/30 transition-transform flex-shrink-0 ${
                          isSelected ? 'translate-x-0.5 text-secondary' : 'opacity-0'
                        }`}
                      />
                    </div>
                  );
                })
              ) : (
                <div className="py-6 px-4 text-center">
                  <div className="w-10 h-10 rounded-full bg-primary/5 flex items-center justify-center mx-auto mb-2 text-ink/40">
                    <Search className="w-5 h-5" />
                  </div>
                  <p className="text-[13px] font-sans font-medium text-ink">No matching results found</p>
                  <p className="text-[11px] font-sans text-ink/50 mt-1">
                    Try searching for <span className="font-medium text-primary">Orders</span>, <span className="font-medium text-primary">Vendors</span>, or <span className="font-medium text-primary">Finance</span>
                  </p>
                </div>
              )}
            </div>

            {/* Bottom shortcut bar */}
            <div className="px-3.5 pt-2 border-t border-primary/8 flex items-center justify-between text-[11px] font-sans text-ink/40">
              <span className="flex items-center gap-1.5">
                <Sparkles className="w-3 h-3 text-secondary" />
                <span className="whitespace-nowrap">Fillkart Operations Hub</span>
              </span>
              <span className="hidden md:inline">
                Press <kbd className="px-1.5 py-0.5 rounded bg-neutral text-ink/60 border border-primary/10 text-[9px]">Esc</kbd> to close
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
