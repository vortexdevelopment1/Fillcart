import React, { useMemo, useEffect, useRef } from 'react';
import { useSearchParams } from 'react-router-dom';
import { FinanceOverviewPage } from './FinanceOverviewPage';
import { SettlementsPage } from './SettlementsPage';
import { CommissionPage } from './CommissionPage';
import { WalletPage } from './WalletPage';
import { CouponsPage } from './CouponsPage';
import { TaxesPage } from './TaxesPage';
import { PaymentsPage } from './PaymentsPage';

export type FinanceTabId =
  | 'overview'
  | 'settlements'
  | 'commission'
  | 'wallet'
  | 'coupons'
  | 'taxes'
  | 'payments';

interface FinanceTabConfig {
  id: FinanceTabId;
  label: string;
}

const FINANCE_TABS: FinanceTabConfig[] = [
  { id: 'overview', label: 'Overview' },
  { id: 'settlements', label: 'Settlements' },
  { id: 'commission', label: 'Commission' },
  { id: 'wallet', label: 'Wallet' },
  { id: 'coupons', label: 'Coupons' },
  { id: 'taxes', label: 'Taxes (GST)' },
  { id: 'payments', label: 'Payments' },
];

export const FinancePage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const activeTabRef = useRef<HTMLButtonElement | null>(null);

  // Active tab derived from URL query parameter (default: 'overview')
  const activeTab = useMemo<FinanceTabId>(() => {
    const rawTab = (searchParams.get('tab') || '').toLowerCase();
    const found = FINANCE_TABS.find((t) => t.id === rawTab);
    return found ? found.id : 'overview';
  }, [searchParams]);

  useEffect(() => {
    if (activeTabRef.current && window.innerWidth < 1024) {
      activeTabRef.current.scrollIntoView({
        inline: 'center',
        block: 'nearest',
        behavior: 'smooth',
      });
    }
  }, [activeTab]);

  const handleTabChange = (tabId: FinanceTabId) => {
    setSearchParams({ tab: tabId });
  };

  return (
    <div className="space-y-5 pb-12 w-full max-w-full min-w-0">
      {/* 0. Top Pill Tabs: Overview | Settlements | Commission | Wallet | Coupons | Taxes (GST) | Payments */}
      <div className="flex items-center gap-1 p-1 rounded-full bg-neutral border border-primary/10 overflow-x-auto no-scrollbar max-w-full w-full min-w-0 scroll-smooth [scroll-snap-type:x_proximity]">
        {FINANCE_TABS.map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              ref={isActive ? activeTabRef : null}
              onClick={() => handleTabChange(tab.id)}
              className={`px-[clamp(10px,2.5vw,16px)] py-[clamp(5px,1.5vw,6px)] rounded-full font-sans text-[clamp(11px,2.8vw,12px)] sm:text-xs font-medium transition-all whitespace-nowrap flex-shrink-0 scroll-snap-align-center ${
                isActive
                  ? 'bg-primary text-white shadow-sm'
                  : 'text-ink/70 hover:text-ink hover:bg-white/60'
              }`}
            >
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* 1. Tab Content */}
      <div>
        {activeTab === 'overview' && (
          <FinanceOverviewPage onSelectTab={(t) => handleTabChange(t as FinanceTabId)} />
        )}
        {activeTab === 'settlements' && <SettlementsPage />}
        {activeTab === 'commission' && <CommissionPage />}
        {activeTab === 'wallet' && <WalletPage />}
        {activeTab === 'coupons' && <CouponsPage />}
        {activeTab === 'taxes' && <TaxesPage />}
        {activeTab === 'payments' && <PaymentsPage />}
      </div>
    </div>
  );
};
