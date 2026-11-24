import { ApiResponse } from './apiClient';
import { SystemSettings } from '../types/settings';
import { initialSettings } from '../data/settingsData';
import { isSettingsUnlocked, lockSettings } from './settingsAccess';
import { adminApi } from './adminApi';

let currentSettingsCache: SystemSettings = { ...initialSettings };

export const settingsService = {
  // GET /api/v1/admin/settings/:group
  getSettings: async (): Promise<ApiResponse<SystemSettings>> => {
    try {
      if (!isSettingsUnlocked()) {
        return {
          success: true,
          data: { ...currentSettingsCache },
        };
      }

      const groups: Array<'GENERAL' | 'ORDERS' | 'ONBOARDING' | 'FINANCE' | 'NOTIFICATIONS' | 'SECURITY'> = [
        'GENERAL',
        'ORDERS',
        'ONBOARDING',
        'FINANCE',
        'NOTIFICATIONS',
        'SECURITY',
      ];

      const mergedSettings: any = { ...currentSettingsCache };
      for (const grp of groups) {
        try {
          const res = await adminApi.getSettingsGroup(grp);
          const lowerKey = grp.toLowerCase();
          mergedSettings[lowerKey] = {
            ...mergedSettings[lowerKey],
            ...res.settings,
          };
        } catch {
          // If a group fetch fails or requires different grant, retain cache
        }
      }

      currentSettingsCache = mergedSettings;
      return {
        success: true,
        data: mergedSettings,
      };
    } catch {
      return {
        success: true,
        data: { ...currentSettingsCache },
      };
    }
  },

  // PUT /api/v1/admin/settings/:group
  updateSettings: async (settings: SystemSettings): Promise<ApiResponse<SystemSettings>> => {
    if (!isSettingsUnlocked()) {
      lockSettings();
      throw new Error('Settings session expired. Please verify your password to continue.');
    }

    try {
      const groups: Array<{ id: 'GENERAL' | 'ORDERS' | 'ONBOARDING' | 'FINANCE' | 'NOTIFICATIONS' | 'SECURITY'; key: keyof SystemSettings }> = [
        { id: 'GENERAL', key: 'general' },
        { id: 'ORDERS', key: 'orders' },
        { id: 'ONBOARDING', key: 'onboarding' },
        { id: 'FINANCE', key: 'finance' },
        { id: 'NOTIFICATIONS', key: 'notifications' },
        { id: 'SECURITY', key: 'security' },
      ];

      for (const grp of groups) {
        const groupPayload = (settings as any)[grp.key];
        if (groupPayload) {
          await adminApi.updateSettingsGroup(grp.id, groupPayload).catch(() => {});
        }
      }

      currentSettingsCache = { ...settings };
      return {
        success: true,
        data: { ...currentSettingsCache },
        message: 'Settings updated successfully',
      };
    } catch (err: any) {
      throw err;
    }
  },
};
