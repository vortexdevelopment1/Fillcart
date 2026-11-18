import { ApiResponse, mockDelay } from './apiClient';
import { SystemSettings } from '../types/settings';
import { initialSettings } from '../data/settingsData';

// Backend note: "assignment mode, allow pharmacy, auto-activate" are not in the original API document; they are new keys under PUT /settings.

let currentSettingsCache: SystemSettings = { ...initialSettings };

export const settingsService = {
  // GET /api/v1/admin/settings
  getSettings: async (): Promise<ApiResponse<SystemSettings>> => {
    await mockDelay(300);
    return {
      success: true,
      data: { ...currentSettingsCache },
    };
  },

  // PUT /api/v1/admin/settings
  updateSettings: async (settings: SystemSettings): Promise<ApiResponse<SystemSettings>> => {
    await mockDelay(300);
    currentSettingsCache = { ...settings };
    return {
      success: true,
      data: { ...currentSettingsCache },
      message: 'Settings updated successfully',
    };
  },
};
