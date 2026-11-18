import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { useToast } from '../context/ToastContext';
import { NoAccessState } from '../components/common/NoAccessState';
import { settingsService } from '../services/settingsService';
import { SystemSettings, SettingsTabId } from '../types/settings';
import { SettingsTabs } from '../components/settings/SettingsTabs';
import { GeneralTab } from '../components/settings/GeneralTab';
import { OrdersDispatchTab } from '../components/settings/OrdersDispatchTab';
import { OnboardingTab } from '../components/settings/OnboardingTab';
import { FinanceTab } from '../components/settings/FinanceTab';
import { NotificationsTab } from '../components/settings/NotificationsTab';
import { SecurityLogsTab } from '../components/settings/SecurityLogsTab';
import { SettingsStickyBar } from '../components/settings/SettingsStickyBar';
import { SaveConfirmModal, ChangedFieldDiff } from '../components/settings/SaveConfirmModal';
import { UnsavedPromptModal } from '../components/settings/UnsavedPromptModal';

export const SettingsPage: React.FC = () => {
  const { currentRole, hasPermission, settings: storeSettings, updateSettings: updateStoreSettings, logAudit } = useApp();
  const { addToast } = useToast();
  const [searchParams, setSearchParams] = useSearchParams();

  // RBAC Permission Check
  // Super Admin: all tabs
  // Finance Admin: Finance tab only
  // Marketing Admin: Notifications tab only
  // Other roles: No access
  const isSuperAdmin = currentRole === 'Super Admin';
  const isFinanceAdmin = currentRole === 'Finance Admin';
  const isMarketingAdmin = currentRole === 'Marketing Admin';

  const allowedTabs = useMemo<SettingsTabId[]>(() => {
    if (isSuperAdmin) return ['general', 'orders', 'onboarding', 'finance', 'notifications', 'security'];
    if (isFinanceAdmin) return ['finance'];
    if (isMarketingAdmin) return ['notifications'];
    return [];
  }, [isSuperAdmin, isFinanceAdmin, isMarketingAdmin]);

  const hasAccess = allowedTabs.length > 0;
  const isReadOnly = !hasPermission('Settings', 'Edit') && !isSuperAdmin;

  // Active Tab from URL params or default
  const defaultTab = allowedTabs[0] || 'general';
  const tabFromUrl = searchParams.get('tab') as SettingsTabId | null;
  const initialActiveTab = tabFromUrl && allowedTabs.includes(tabFromUrl) ? tabFromUrl : defaultTab;

  const [activeTab, setActiveTab] = useState<SettingsTabId>(initialActiveTab);

  // Form Data State
  const [formData, setFormData] = useState<SystemSettings>(storeSettings);
  const [savedSettings, setSavedSettings] = useState<SystemSettings>(storeSettings);
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});

  // Modals & Save State
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [isUnsavedModalOpen, setIsUnsavedModalOpen] = useState(false);
  const [pendingTabSwitch, setPendingTabSwitch] = useState<SettingsTabId | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  // Sync with store on mount / external update
  useEffect(() => {
    setFormData(storeSettings);
    setSavedSettings(storeSettings);
  }, [storeSettings]);

  // Sync activeTab with URL
  useEffect(() => {
    if (tabFromUrl && allowedTabs.includes(tabFromUrl) && tabFromUrl !== activeTab) {
      setActiveTab(tabFromUrl);
    }
  }, [tabFromUrl, allowedTabs, activeTab]);

  // Calculate Field Diffs
  const diffs = useMemo<ChangedFieldDiff[]>(() => {
    const list: ChangedFieldDiff[] = [];

    // 1. General
    if (formData.general.platformName !== savedSettings.general.platformName) {
      list.push({
        key: 'general.platformName',
        label: 'Platform Name',
        tab: 'general',
        before: savedSettings.general.platformName,
        after: formData.general.platformName,
        isCritical: false,
      });
    }
    if (formData.general.logoUrl !== savedSettings.general.logoUrl) {
      list.push({
        key: 'general.logoUrl',
        label: 'Platform Logo',
        tab: 'general',
        before: 'Current Logo',
        after: 'Updated Logo',
        isCritical: false,
      });
    }
    if (formData.general.supportEmail !== savedSettings.general.supportEmail) {
      list.push({
        key: 'general.supportEmail',
        label: 'Support Email',
        tab: 'general',
        before: savedSettings.general.supportEmail,
        after: formData.general.supportEmail,
        isCritical: false,
      });
    }
    if (formData.general.supportPhone !== savedSettings.general.supportPhone) {
      list.push({
        key: 'general.supportPhone',
        label: 'Support Phone',
        tab: 'general',
        before: savedSettings.general.supportPhone,
        after: formData.general.supportPhone,
        isCritical: false,
      });
    }
    if (formData.general.timezone !== savedSettings.general.timezone) {
      list.push({
        key: 'general.timezone',
        label: 'Timezone',
        tab: 'general',
        before: savedSettings.general.timezone,
        after: formData.general.timezone,
        isCritical: false,
      });
    }
    if (formData.general.language !== savedSettings.general.language) {
      list.push({
        key: 'general.language',
        label: 'Default Language',
        tab: 'general',
        before: savedSettings.general.language,
        after: formData.general.language,
        isCritical: false,
      });
    }
    if (formData.general.maintenanceMode !== savedSettings.general.maintenanceMode) {
      list.push({
        key: 'general.maintenanceMode',
        label: 'Maintenance Mode',
        tab: 'general',
        before: savedSettings.general.maintenanceMode ? 'ON' : 'OFF',
        after: formData.general.maintenanceMode ? 'ON' : 'OFF',
        isCritical: true,
      });
    }
    if (formData.general.maintenanceMessage !== savedSettings.general.maintenanceMessage) {
      list.push({
        key: 'general.maintenanceMessage',
        label: 'Maintenance Message',
        tab: 'general',
        before: savedSettings.general.maintenanceMessage,
        after: formData.general.maintenanceMessage,
        isCritical: false,
      });
    }

    // 2. Orders & Dispatch
    if (formData.orders.assignmentMode !== savedSettings.orders.assignmentMode) {
      list.push({
        key: 'orders.assignmentMode',
        label: 'Order Assignment Mode',
        tab: 'orders',
        before: savedSettings.orders.assignmentMode,
        after: formData.orders.assignmentMode,
        isCritical: true,
      });
    }
    if (formData.orders.autoAssignRadiusKm !== savedSettings.orders.autoAssignRadiusKm) {
      list.push({
        key: 'orders.autoAssignRadiusKm',
        label: 'Auto-Assign Radius',
        tab: 'orders',
        before: `${savedSettings.orders.autoAssignRadiusKm} km`,
        after: `${formData.orders.autoAssignRadiusKm} km`,
        isCritical: false,
      });
    }
    if (formData.orders.riderAcceptTimeoutSec !== savedSettings.orders.riderAcceptTimeoutSec) {
      list.push({
        key: 'orders.riderAcceptTimeoutSec',
        label: 'Rider Accept Timeout',
        tab: 'orders',
        before: `${savedSettings.orders.riderAcceptTimeoutSec} sec`,
        after: `${formData.orders.riderAcceptTimeoutSec} sec`,
        isCritical: false,
      });
    }
    if (formData.orders.cancellationWindowMin !== savedSettings.orders.cancellationWindowMin) {
      list.push({
        key: 'orders.cancellationWindowMin',
        label: 'Cancellation Window',
        tab: 'orders',
        before: `${savedSettings.orders.cancellationWindowMin} min`,
        after: `${formData.orders.cancellationWindowMin} min`,
        isCritical: false,
      });
    }
    if (formData.orders.deliveryRadiusKm !== savedSettings.orders.deliveryRadiusKm) {
      list.push({
        key: 'orders.deliveryRadiusKm',
        label: 'Delivery Radius',
        tab: 'orders',
        before: `${savedSettings.orders.deliveryRadiusKm} km`,
        after: `${formData.orders.deliveryRadiusKm} km`,
        isCritical: false,
      });
    }
    if (formData.orders.minOrderValueInr !== savedSettings.orders.minOrderValueInr) {
      list.push({
        key: 'orders.minOrderValueInr',
        label: 'Minimum Order Value',
        tab: 'orders',
        before: `₹${savedSettings.orders.minOrderValueInr}`,
        after: `₹${formData.orders.minOrderValueInr}`,
        isCritical: false,
      });
    }

    // 3. Onboarding
    if (formData.onboarding.allowPharmacy !== savedSettings.onboarding.allowPharmacy) {
      list.push({
        key: 'onboarding.allowPharmacy',
        label: 'Allow Pharmacy Vendors',
        tab: 'onboarding',
        before: savedSettings.onboarding.allowPharmacy ? 'Allowed' : 'Disabled',
        after: formData.onboarding.allowPharmacy ? 'Allowed' : 'Disabled',
        isCritical: false,
      });
    }
    if (formData.onboarding.gstOptional !== savedSettings.onboarding.gstOptional) {
      list.push({
        key: 'onboarding.gstOptional',
        label: 'GST Optional for Vendors',
        tab: 'onboarding',
        before: savedSettings.onboarding.gstOptional ? 'Optional' : 'Mandatory',
        after: formData.onboarding.gstOptional ? 'Optional' : 'Mandatory',
        isCritical: false,
      });
    }
    if (formData.onboarding.docExpiryReminderDays !== savedSettings.onboarding.docExpiryReminderDays) {
      list.push({
        key: 'onboarding.docExpiryReminderDays',
        label: 'Document Expiry Reminder',
        tab: 'onboarding',
        before: `${savedSettings.onboarding.docExpiryReminderDays} days`,
        after: `${formData.onboarding.docExpiryReminderDays} days`,
        isCritical: false,
      });
    }
    if (formData.onboarding.autoActivateAfterVerification !== savedSettings.onboarding.autoActivateAfterVerification) {
      list.push({
        key: 'onboarding.autoActivateAfterVerification',
        label: 'Auto-Activate After Verification',
        tab: 'onboarding',
        before: savedSettings.onboarding.autoActivateAfterVerification ? 'Enabled' : 'Disabled (Manual)',
        after: formData.onboarding.autoActivateAfterVerification ? 'Enabled' : 'Disabled (Manual)',
        isCritical: false,
      });
    }

    // 4. Finance
    if (formData.finance.defaultCommissionPct !== savedSettings.finance.defaultCommissionPct) {
      list.push({
        key: 'finance.defaultCommissionPct',
        label: 'Default Commission Rate',
        tab: 'finance',
        before: `${savedSettings.finance.defaultCommissionPct}%`,
        after: `${formData.finance.defaultCommissionPct}%`,
        isCritical: false,
      });
    }
    if (formData.finance.settlementCycle !== savedSettings.finance.settlementCycle) {
      list.push({
        key: 'finance.settlementCycle',
        label: 'Settlement Cycle',
        tab: 'finance',
        before: savedSettings.finance.settlementCycle,
        after: formData.finance.settlementCycle,
        isCritical: false,
      });
    }
    if (formData.finance.refundWindowDays !== savedSettings.finance.refundWindowDays) {
      list.push({
        key: 'finance.refundWindowDays',
        label: 'Refund Dispute Window',
        tab: 'finance',
        before: `${savedSettings.finance.refundWindowDays} days`,
        after: `${formData.finance.refundWindowDays} days`,
        isCritical: false,
      });
    }
    if (formData.finance.minPayoutInr !== savedSettings.finance.minPayoutInr) {
      list.push({
        key: 'finance.minPayoutInr',
        label: 'Minimum Payout Threshold',
        tab: 'finance',
        before: `₹${savedSettings.finance.minPayoutInr}`,
        after: `₹${formData.finance.minPayoutInr}`,
        isCritical: false,
      });
    }
    // Payment methods toggles
    (['upi', 'card', 'cod', 'wallet'] as const).forEach((pm) => {
      if (formData.finance.paymentMethods[pm] !== savedSettings.finance.paymentMethods[pm]) {
        list.push({
          key: `finance.paymentMethods.${pm}`,
          label: `Payment Method: ${pm.toUpperCase()}`,
          tab: 'finance',
          before: savedSettings.finance.paymentMethods[pm] ? 'Enabled' : 'Disabled',
          after: formData.finance.paymentMethods[pm] ? 'Enabled' : 'Disabled',
          isCritical: false,
        });
      }
    });

    // 5. Notifications
    (Object.keys(formData.notifications.channels) as Array<keyof SystemSettings['notifications']['channels']>).forEach(
      (chKey) => {
        const curCh = formData.notifications.channels[chKey];
        const oldCh = savedSettings.notifications.channels[chKey];
        if (curCh.enabled !== oldCh.enabled) {
          list.push({
            key: `notifications.channels.${chKey}.enabled`,
            label: `${curCh.name} Gateway`,
            tab: 'notifications',
            before: oldCh.enabled ? 'Enabled' : 'Disabled',
            after: curCh.enabled ? 'Enabled' : 'Disabled',
            isCritical: false,
          });
        }
        if (curCh.senderId !== oldCh.senderId) {
          list.push({
            key: `notifications.channels.${chKey}.senderId`,
            label: `${curCh.name} Sender ID`,
            tab: 'notifications',
            before: oldCh.senderId,
            after: curCh.senderId,
            isCritical: false,
          });
        }
        if (curCh.apiKey !== oldCh.apiKey) {
          list.push({
            key: `notifications.channels.${chKey}.apiKey`,
            label: `${curCh.name} API Key`,
            tab: 'notifications',
            before: oldCh.apiKey,
            after: curCh.apiKey,
            isCritical: false,
          });
        }
      }
    );

    // Templates diff
    formData.notifications.templates.forEach((tpl) => {
      const oldTpl = savedSettings.notifications.templates.find((t) => t.id === tpl.id);
      if (oldTpl && (oldTpl.body !== tpl.body || oldTpl.subject !== tpl.subject)) {
        list.push({
          key: `notifications.templates.${tpl.id}`,
          label: `Template: ${tpl.title}`,
          tab: 'notifications',
          before: oldTpl.body.slice(0, 30) + '...',
          after: tpl.body.slice(0, 30) + '...',
          isCritical: false,
        });
      }
    });

    // 6. Security & Logs
    if (formData.security.adminLoginOtp !== savedSettings.security.adminLoginOtp) {
      list.push({
        key: 'security.adminLoginOtp',
        label: 'Admin Login 2FA OTP',
        tab: 'security',
        before: savedSettings.security.adminLoginOtp ? 'Enabled' : 'Disabled',
        after: formData.security.adminLoginOtp ? 'Enabled' : 'Disabled',
        isCritical: true,
      });
    }
    if (formData.security.accessTokenExpiryMin !== savedSettings.security.accessTokenExpiryMin) {
      list.push({
        key: 'security.accessTokenExpiryMin',
        label: 'Access Token Expiry',
        tab: 'security',
        before: `${savedSettings.security.accessTokenExpiryMin} min`,
        after: `${formData.security.accessTokenExpiryMin} min`,
        isCritical: true,
      });
    }
    if (formData.security.refreshTokenExpiryDays !== savedSettings.security.refreshTokenExpiryDays) {
      list.push({
        key: 'security.refreshTokenExpiryDays',
        label: 'Refresh Token Expiry',
        tab: 'security',
        before: `${savedSettings.security.refreshTokenExpiryDays} days`,
        after: `${formData.security.refreshTokenExpiryDays} days`,
        isCritical: true,
      });
    }
    if (formData.security.sessionTimeoutMin !== savedSettings.security.sessionTimeoutMin) {
      list.push({
        key: 'security.sessionTimeoutMin',
        label: 'Screen Inactivity Lockout',
        tab: 'security',
        before: `${savedSettings.security.sessionTimeoutMin} min`,
        after: `${formData.security.sessionTimeoutMin} min`,
        isCritical: false,
      });
    }
    if (formData.security.passwordRules.minLength !== savedSettings.security.passwordRules.minLength) {
      list.push({
        key: 'security.passwordRules.minLength',
        label: 'Min Password Length',
        tab: 'security',
        before: `${savedSettings.security.passwordRules.minLength} chars`,
        after: `${formData.security.passwordRules.minLength} chars`,
        isCritical: false,
      });
    }
    if (formData.security.passwordRules.requireNumberSymbol !== savedSettings.security.passwordRules.requireNumberSymbol) {
      list.push({
        key: 'security.passwordRules.requireNumberSymbol',
        label: 'Require Special Char & Number',
        tab: 'security',
        before: savedSettings.security.passwordRules.requireNumberSymbol ? 'Yes' : 'No',
        after: formData.security.passwordRules.requireNumberSymbol ? 'Yes' : 'No',
        isCritical: false,
      });
    }
    if (formData.security.loginAttemptLimit !== savedSettings.security.loginAttemptLimit) {
      list.push({
        key: 'security.loginAttemptLimit',
        label: 'Login Attempt Lockout Limit',
        tab: 'security',
        before: `${savedSettings.security.loginAttemptLimit} attempts`,
        after: `${formData.security.loginAttemptLimit} attempts`,
        isCritical: false,
      });
    }
    if (JSON.stringify(formData.security.ipAllowlist) !== JSON.stringify(savedSettings.security.ipAllowlist)) {
      list.push({
        key: 'security.ipAllowlist',
        label: 'Admin IP Allowlist',
        tab: 'security',
        before: `${savedSettings.security.ipAllowlist.length} IPs`,
        after: `${formData.security.ipAllowlist.length} IPs`,
        isCritical: true,
      });
    }

    // Log Retentions
    (Object.keys(formData.security.logRetention) as Array<keyof SystemSettings['security']['logRetention']>).forEach(
      (rKey) => {
        if (formData.security.logRetention[rKey] !== savedSettings.security.logRetention[rKey]) {
          list.push({
            key: `security.logRetention.${rKey}`,
            label: `Retention: ${rKey.replace('Days', '')}`,
            tab: 'security',
            before: `${savedSettings.security.logRetention[rKey]} days`,
            after: `${formData.security.logRetention[rKey]} days`,
            isCritical: true,
          });
        }
      }
    );

    return list;
  }, [formData, savedSettings]);

  const isDirty = diffs.length > 0;

  // Tabs containing dirty changes
  const dirtyTabs = useMemo<SettingsTabId[]>(() => {
    const tabs = new Set<SettingsTabId>();
    diffs.forEach((d) => tabs.add(d.tab as SettingsTabId));
    return Array.from(tabs);
  }, [diffs]);

  // Handle Tab Switch
  const handleTabChange = useCallback(
    (nextTab: SettingsTabId) => {
      if (nextTab === activeTab) return;

      // If changes exist in current tab, warn user
      const isCurrentTabDirty = dirtyTabs.includes(activeTab);
      if (isCurrentTabDirty) {
        setPendingTabSwitch(nextTab);
        setIsUnsavedModalOpen(true);
        return;
      }

      setActiveTab(nextTab);
      setSearchParams({ tab: nextTab });
    },
    [activeTab, dirtyTabs, setSearchParams]
  );

  const confirmDiscardAndSwitch = () => {
    // Reset formData to savedSettings
    setFormData(savedSettings);
    setIsUnsavedModalOpen(false);
    if (pendingTabSwitch) {
      setActiveTab(pendingTabSwitch);
      setSearchParams({ tab: pendingTabSwitch });
      setPendingTabSwitch(null);
    }
  };

  const handleDiscardAll = () => {
    setFormData(savedSettings);
    setValidationErrors({});
    addToast('info', 'Changes Discarded', 'Platform settings restored to active production configuration.');
  };

  // Validate form fields
  const validateForm = (): boolean => {
    const errors: Record<string, string> = {};

    // General validation
    if (!formData.general.platformName.trim()) {
      errors.platformName = 'Platform name cannot be empty';
    }
    if (!formData.general.supportEmail.includes('@')) {
      errors.supportEmail = 'Enter a valid support email address';
    }

    // Orders validation
    if (formData.orders.autoAssignRadiusKm < 1 || formData.orders.autoAssignRadiusKm > 25) {
      errors.autoAssignRadiusKm = 'Must be between 1 and 25 km';
    }
    if (formData.orders.riderAcceptTimeoutSec < 15 || formData.orders.riderAcceptTimeoutSec > 180) {
      errors.riderAcceptTimeoutSec = 'Must be between 15 and 180 seconds';
    }
    if (formData.orders.cancellationWindowMin < 1 || formData.orders.cancellationWindowMin > 30) {
      errors.cancellationWindowMin = 'Must be between 1 and 30 minutes';
    }
    if (formData.orders.deliveryRadiusKm < 1 || formData.orders.deliveryRadiusKm > 50) {
      errors.deliveryRadiusKm = 'Must be between 1 and 50 km';
    }

    // Finance validation
    if (formData.finance.defaultCommissionPct < 0 || formData.finance.defaultCommissionPct > 50) {
      errors.defaultCommissionPct = 'Commission must be between 0% and 50%';
    }
    if (formData.finance.refundWindowDays < 1 || formData.finance.refundWindowDays > 30) {
      errors.refundWindowDays = 'Must be between 1 and 30 days';
    }
    if (formData.finance.minPayoutInr < 100 || formData.finance.minPayoutInr > 10000) {
      errors.minPayoutInr = 'Must be between ₹100 and ₹10,000';
    }

    // Security validation
    if (formData.security.accessTokenExpiryMin < 5 || formData.security.accessTokenExpiryMin > 1440) {
      errors.accessTokenExpiryMin = 'Token lifetime must be between 5 and 1440 minutes';
    }
    if (formData.security.refreshTokenExpiryDays < 1 || formData.security.refreshTokenExpiryDays > 90) {
      errors.refreshTokenExpiryDays = 'Must be between 1 and 90 days';
    }
    if (formData.security.sessionTimeoutMin < 5 || formData.security.sessionTimeoutMin > 480) {
      errors.sessionTimeoutMin = 'Must be between 5 and 480 minutes';
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleOpenSaveModal = () => {
    if (!validateForm()) {
      addToast('error', 'Validation Error', 'Please correct highlighted errors in the form before saving.');
      return;
    }
    setIsConfirmModalOpen(true);
  };

  const handleConfirmSave = async (reason: string) => {
    setIsSaving(true);
    try {
      // 1. Call service layer (PUT /api/v1/admin/settings)
      await settingsService.updateSettings(formData);

      // 2. Update store state (drives live application behavior)
      updateStoreSettings(formData);

      // 3. Create one audit log entry per changed field
      diffs.forEach((diff) => {
        logAudit(
          'Update',
          'Settings',
          `Settings: ${diff.label}`,
          `Updated ${diff.label}: changed from "${diff.before}" to "${diff.after}". Reason: ${
            reason || 'Platform configuration update'
          }`,
          'Admin Audit',
          [{ field: diff.key, before: diff.before, after: diff.after }]
        );
      });

      // 4. Update saved reference and close
      setSavedSettings(formData);
      setIsConfirmModalOpen(false);
      addToast(
        'success',
        'Settings saved',
        `${diffs.length} parameter${diffs.length !== 1 ? 's' : ''} applied and recorded in Admin Audit.`
      );
    } catch {
      addToast('error', 'Save Failed', 'Unable to persist settings to server. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  if (!hasAccess) {
    return <NoAccessState moduleName="Settings" />;
  }

  return (
    <div className="w-full h-full flex flex-col min-h-0 relative pb-16">
      {/* ──────────────── LAYOUT: LEFT TABS (HORIZONTAL <1000px) + RIGHT SETTINGS CARD ──────────────── */}
      <div className="flex-1 min-h-0 flex flex-col lg:flex-row gap-5 items-start">
        {/* Left / Top Tabs */}
        <SettingsTabs
          activeTab={activeTab}
          onTabChange={handleTabChange}
          allowedTabs={allowedTabs}
          dirtyTabs={dirtyTabs}
        />

        {/* Right Settings Card */}
        <div className="flex-1 w-full min-h-0 bg-white rounded-2xl border border-primary/10 shadow-sm p-5 sm:p-7 overflow-y-auto">
          {activeTab === 'general' && (
            <GeneralTab
              data={formData.general}
              onChange={(updates) =>
                setFormData((prev) => ({
                  ...prev,
                  general: { ...prev.general, ...updates },
                }))
              }
              readOnly={isReadOnly}
              errors={validationErrors}
            />
          )}

          {activeTab === 'orders' && (
            <OrdersDispatchTab
              data={formData.orders}
              onChange={(updates) =>
                setFormData((prev) => ({
                  ...prev,
                  orders: { ...prev.orders, ...updates },
                }))
              }
              readOnly={isReadOnly}
              errors={validationErrors}
            />
          )}

          {activeTab === 'onboarding' && (
            <OnboardingTab
              data={formData.onboarding}
              onChange={(updates) =>
                setFormData((prev) => ({
                  ...prev,
                  onboarding: { ...prev.onboarding, ...updates },
                }))
              }
              readOnly={isReadOnly}
              errors={validationErrors}
            />
          )}

          {activeTab === 'finance' && (
            <FinanceTab
              data={formData.finance}
              onChange={(updates) =>
                setFormData((prev) => ({
                  ...prev,
                  finance: { ...prev.finance, ...updates },
                }))
              }
              readOnly={isReadOnly}
              errors={validationErrors}
            />
          )}

          {activeTab === 'notifications' && (
            <NotificationsTab
              data={formData.notifications}
              onChange={(updates) =>
                setFormData((prev) => ({
                  ...prev,
                  notifications: { ...prev.notifications, ...updates },
                }))
              }
              readOnly={isReadOnly}
            />
          )}

          {activeTab === 'security' && (
            <SecurityLogsTab
              data={formData.security}
              onChange={(updates) =>
                setFormData((prev) => ({
                  ...prev,
                  security: { ...prev.security, ...updates },
                }))
              }
              readOnly={isReadOnly}
              errors={validationErrors}
            />
          )}
        </div>
      </div>

      {/* ──────────────── STICKY SAVE CHANGES BAR AT BOTTOM ──────────────── */}
      <SettingsStickyBar
        isDirty={isDirty}
        dirtyCount={diffs.length}
        onDiscard={handleDiscardAll}
        onSave={handleOpenSaveModal}
        isSaving={isSaving}
      />

      {/* ──────────────── MODALS ──────────────── */}
      <SaveConfirmModal
        isOpen={isConfirmModalOpen}
        onClose={() => setIsConfirmModalOpen(false)}
        diffs={diffs}
        onConfirm={handleConfirmSave}
        isSaving={isSaving}
      />

      <UnsavedPromptModal
        isOpen={isUnsavedModalOpen}
        onCancel={() => {
          setIsUnsavedModalOpen(false);
          setPendingTabSwitch(null);
        }}
        onConfirmDiscard={confirmDiscardAndSwitch}
        targetTabName={pendingTabSwitch || ''}
      />
    </div>
  );
};
