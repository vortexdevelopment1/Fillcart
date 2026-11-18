export interface GeneralSettings {
  platformName: string;
  logoUrl: string;
  supportEmail: string;
  supportPhone: string;
  timezone: string;
  currency: string;
  language: string;
  maintenanceMode: boolean;
  maintenanceMessage: string;
}

export interface OrdersDispatchSettings {
  assignmentMode: 'Manual' | 'Auto';
  autoAssignRadiusKm: number;
  riderAcceptTimeoutSec: number;
  cancellationWindowMin: number;
  deliveryRadiusKm: number;
  minOrderValueInr: number;
}

export interface OnboardingSettings {
  allowPharmacy: boolean;
  gstOptional: boolean;
  docExpiryReminderDays: number;
  autoActivateAfterVerification: boolean;
}

export interface FinanceSettings {
  defaultCommissionPct: number;
  settlementCycle: 'Weekly' | 'Monthly';
  paymentMethods: {
    upi: boolean;
    card: boolean;
    cod: boolean;
    wallet: boolean;
  };
  refundWindowDays: number;
  minPayoutInr: number;
}

export interface NotificationChannel {
  id: 'sms' | 'whatsapp' | 'email' | 'push';
  name: string;
  enabled: boolean;
  provider: string;
  senderId: string;
  apiKey: string;
}

export interface NotificationTemplate {
  id: string;
  title: string;
  event: string;
  subject: string;
  body: string;
  variables: string[];
}

export interface NotificationsSettings {
  channels: {
    sms: NotificationChannel;
    whatsapp: NotificationChannel;
    email: NotificationChannel;
    push: NotificationChannel;
  };
  templates: NotificationTemplate[];
}

export interface LogRetentionSettings {
  adminAuditDays: number;
  apiDays: number;
  userActivityDays: number;
  orderDays: number;
  securityDays: number;
  paymentDays: number;
}

export interface SecurityLogsSettings {
  adminLoginOtp: boolean;
  accessTokenExpiryMin: number;
  refreshTokenExpiryDays: number;
  sessionTimeoutMin: number;
  passwordRules: {
    minLength: number;
    requireNumberSymbol: boolean;
  };
  loginAttemptLimit: number;
  ipAllowlist: string[];
  logRetention: LogRetentionSettings;
}

export interface SystemSettings {
  general: GeneralSettings;
  orders: OrdersDispatchSettings;
  onboarding: OnboardingSettings;
  finance: FinanceSettings;
  notifications: NotificationsSettings;
  security: SecurityLogsSettings;
}

export type SettingsTabId =
  | 'general'
  | 'orders'
  | 'onboarding'
  | 'finance'
  | 'notifications'
  | 'security';
