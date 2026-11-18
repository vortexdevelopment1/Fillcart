import { SystemSettings } from '../types/settings';

// Backend note: "assignment mode, allow pharmacy, auto-activate" are not in the original API document; they are new keys under PUT /settings.

export const initialSettings: SystemSettings = {
  general: {
    platformName: 'Fillkart Hyperlocal',
    logoUrl: '/favicon.ico',
    supportEmail: 'support@fillkart.in',
    supportPhone: '+91 1800 202 8899',
    timezone: 'Asia/Kolkata (IST +05:30)',
    currency: 'INR (₹)',
    language: 'English (India)',
    maintenanceMode: false,
    maintenanceMessage:
      'We are upgrading Fillkart systems. We will be back shortly with lightning-fast delivery!',
  },
  orders: {
    assignmentMode: 'Manual',
    autoAssignRadiusKm: 5,
    riderAcceptTimeoutSec: 45,
    cancellationWindowMin: 5,
    deliveryRadiusKm: 15,
    minOrderValueInr: 99,
  },
  onboarding: {
    allowPharmacy: true,
    gstOptional: false,
    docExpiryReminderDays: 15,
    autoActivateAfterVerification: false,
  },
  finance: {
    defaultCommissionPct: 12,
    settlementCycle: 'Weekly',
    paymentMethods: {
      upi: true,
      card: true,
      cod: true,
      wallet: true,
    },
    refundWindowDays: 7,
    minPayoutInr: 500,
  },
  notifications: {
    channels: {
      sms: {
        id: 'sms',
        name: 'SMS Gateway',
        enabled: true,
        provider: 'Twilio India SMS',
        senderId: 'FILKRT',
        apiKey: '••••9102',
      },
      whatsapp: {
        id: 'whatsapp',
        name: 'WhatsApp Business API',
        enabled: true,
        provider: 'Gupshup Enterprise',
        senderId: '919876543210',
        apiKey: '••••7741',
      },
      email: {
        id: 'email',
        name: 'Email SMTP',
        enabled: true,
        provider: 'SendGrid Transactional',
        senderId: 'noreply@fillkart.in',
        apiKey: '••••3319',
      },
      push: {
        id: 'push',
        name: 'Push Notifications',
        enabled: true,
        provider: 'Firebase Cloud Messaging (FCM)',
        senderId: 'fillkart-fcm-prod',
        apiKey: '••••8842',
      },
    },
    templates: [
      {
        id: 'tpl-1',
        title: 'Order Placed',
        event: 'order.placed',
        subject: 'Order Confirmed: {orderId}',
        body: 'Hello {customerName}, your order {orderId} for ₹{amount} has been placed successfully and is being prepared by {vendorName}.',
        variables: ['{orderId}', '{customerName}', '{amount}', '{vendorName}'],
      },
      {
        id: 'tpl-2',
        title: 'OTP Verification',
        event: 'auth.otp',
        subject: 'Your Fillkart Login OTP',
        body: '{otp} is your Fillkart verification OTP. Valid for {validityMin} minutes. Do not share this OTP with anyone.',
        variables: ['{otp}', '{validityMin}'],
      },
      {
        id: 'tpl-3',
        title: 'Payout Released',
        event: 'payout.released',
        subject: 'Merchant Payout Released: {referenceId}',
        body: 'Dear {merchantName}, a payout of ₹{amount} has been credited to your bank account {bankAccount} for settlement batch {batchId}.',
        variables: ['{merchantName}', '{amount}', '{bankAccount}', '{batchId}', '{referenceId}'],
      },
      {
        id: 'tpl-4',
        title: 'Document Rejected',
        event: 'verification.rejected',
        subject: 'Document Verification Update',
        body: 'Dear {applicantName}, your submitted document ({documentType}) was rejected. Reason: {reason}. Please re-upload via your partner app.',
        variables: ['{applicantName}', '{documentType}', '{reason}'],
      },
    ],
  },
  security: {
    adminLoginOtp: true,
    accessTokenExpiryMin: 60,
    refreshTokenExpiryDays: 30,
    sessionTimeoutMin: 30,
    passwordRules: {
      minLength: 8,
      requireNumberSymbol: true,
    },
    loginAttemptLimit: 5,
    ipAllowlist: ['192.168.1.0/24', '103.21.244.0/22', '49.205.120.44'],
    logRetention: {
      adminAuditDays: 365,
      apiDays: 90,
      userActivityDays: 90,
      orderDays: 90,
      securityDays: 90,
      paymentDays: 365,
    },
  },
};
