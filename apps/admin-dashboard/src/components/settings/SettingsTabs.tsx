import React from 'react';
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

  return (
    <nav
      aria-label="Settings navigation"
      className="flex flex-row lg:flex-col gap-1.5 overflow-x-auto pb-2 lg:pb-0 scrollbar-none flex-shrink-0 lg:w-[230px]"
    >
      {visibleTabs.map((tab) => {
        const Icon = tab.icon;
        const isActive = activeTab === tab.id;
        const isDirty = dirtyTabs.includes(tab.id);

        return (
          <button
            key={tab.id}
            type="button"
            onClick={() => onTabChange(tab.id)}
            className={`h-10 px-4 rounded-full flex items-center justify-between text-left text-[13px] font-medium transition-all whitespace-nowrap focus:outline-none focus:ring-2 focus:ring-secondary ${
              isActive
                ? 'bg-[#527781] text-white shadow-xs'
                : 'text-primary/70 hover:bg-neutral hover:text-primary'
            }`}
          >
            <div className="flex items-center gap-2.5">
              <Icon
                className={`w-4 h-4 flex-shrink-0 ${
                  isActive ? 'text-white' : 'text-primary/60'
                }`}
              />
              <span>{tab.label}</span>
            </div>
            {isDirty && (
              <span
                className={`w-2 h-2 rounded-full ${
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
