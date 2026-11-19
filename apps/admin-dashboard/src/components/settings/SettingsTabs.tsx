import React, { useEffect, useRef } from 'react';
import {
  Globe,
  Truck,
  UserCheck,
  Landmark,
  BellRing,
  ShieldAlert,
} from 'lucide-react';
import { SettingsTabId } from '../../types/settings';

export interface TabConfig {
  id: SettingsTabId;
  label: string;
  icon: React.ElementType;
}

export const ALL_TABS: TabConfig[] = [
  { id: 'general', label: 'General', icon: Globe },
  { id: 'orders', label: 'Orders & Dispatch', icon: Truck },
  { id: 'onboarding', label: 'Onboarding', icon: UserCheck },
  { id: 'finance', label: 'Finance', icon: Landmark },
  { id: 'notifications', label: 'Notifications', icon: BellRing },
  { id: 'security', label: 'Security & Logs', icon: ShieldAlert },
];

interface SettingsTabsProps {
  activeTab: SettingsTabId;
  onTabChange: (tabId: SettingsTabId) => void;
  allowedTabs: SettingsTabId[];
  dirtyTabs?: SettingsTabId[];
}

export const SettingsTabs: React.FC<SettingsTabsProps> = ({
  activeTab,
  onTabChange,
  allowedTabs,
  dirtyTabs = [],
}) => {
  const visibleTabs = ALL_TABS.filter((tab) => allowedTabs.includes(tab.id));
  const activeTabRef = useRef<HTMLButtonElement | null>(null);
  const containerRef = useRef<HTMLElement | null>(null);

  // Auto-scroll active tab into view when activeTab changes or on mount (e.g., from ?tab= param)
  useEffect(() => {
    if (activeTabRef.current && window.innerWidth < 1024) {
      activeTabRef.current.scrollIntoView({
        inline: 'center',
        block: 'nearest',
        behavior: 'smooth',
      });
    }
  }, [activeTab]);

  return (
    <nav
      ref={containerRef}
      aria-label="Settings navigation"
      className="
        flex flex-row lg:flex-col gap-1.5 sm:gap-2
        overflow-x-auto lg:overflow-x-visible no-scrollbar
        scroll-smooth px-1 sm:px-1.5 lg:px-0 py-1 lg:py-0
        w-full max-w-full min-w-0 lg:w-[230px] flex-shrink-0
        [scroll-snap-type:x_proximity]
      "
      style={{
        WebkitOverflowScrolling: 'touch',
      }}
    >
      {visibleTabs.map((tab) => {
        const Icon = tab.icon;
        const isActive = activeTab === tab.id;
        const isDirty = dirtyTabs.includes(tab.id);

        return (
          <button
            key={tab.id}
            ref={isActive ? activeTabRef : null}
            type="button"
            onClick={() => onTabChange(tab.id)}
            className={`
              h-[34px] xs:h-[36px] lg:h-10
              px-[clamp(8px,2.5vw,14px)] lg:px-4
              py-[clamp(6px,1.8vw,10px)] lg:py-2.5
              rounded-full flex items-center justify-between text-left
              text-[clamp(11px,3vw,13px)] lg:text-[13px] font-medium
              transition-all whitespace-nowrap flex-shrink-0
              scroll-snap-align-center
              focus:outline-none focus:ring-2 focus:ring-secondary
              ${
                isActive
                  ? 'bg-[#527781] text-white shadow-xs'
                  : 'text-primary/70 hover:bg-neutral hover:text-primary'
              }
            `}
          >
            <div className="flex items-center gap-[clamp(4px,1.5vw,6px)] lg:gap-2.5">
              <Icon
                className={`w-[clamp(14px,3.5vw,16px)] h-[clamp(14px,3.5vw,16px)] lg:w-4 lg:h-4 flex-shrink-0 ${
                  isActive ? 'text-white' : 'text-primary/60'
                }`}
              />
              <span className="whitespace-nowrap">{tab.label}</span>
            </div>
            {isDirty && (
              <span
                className={`w-2 h-2 rounded-full ml-1.5 ${
                  isActive ? 'bg-amber-300' : 'bg-[#527781]'
                }`}
                title="Unsaved changes in this tab"
              />
            )}
          </button>
        );
      })}
    </nav>
  );
};
