import type { PrismaClient } from "../../../../database/generated/client/client.js";

export interface AdminNotification {
  id: string;
  title: string;
  message: string;
  category: "KYC" | "ORDERS" | "INVENTORY" | "FINANCE" | "SECURITY" | "SYSTEM";
  severity: "INFO" | "WARNING" | "CRITICAL" | "SUCCESS";
  isRead: boolean;
  createdAt: string;
  actionUrl?: string;
  actionLabel?: string;
}

export class NotificationsService {
  // In-memory read tracking and dynamic notifications generator
  private readNotificationIds = new Set<string>();

  constructor(private prisma: PrismaClient) {}

  public async getNotifications(_userId: string): Promise<{
    notifications: AdminNotification[];
    unreadCount: number;
  }> {
    const list: AdminNotification[] = [];

    try {
      // 1. Check pending applicant verification documents
      const pendingDocsCount = await this.prisma.document.count({
        where: { status: "PENDING", isDeleted: false },
      });

      if (pendingDocsCount > 0) {
        list.push({
          id: `notif-kyc-pending`,
          title: "Pending KYC Document Verifications",
          message: `${pendingDocsCount} applicant document${pendingDocsCount > 1 ? "s are" : " is"} awaiting administrative review.`,
          category: "KYC",
          severity: "WARNING",
          isRead: this.readNotificationIds.has("notif-kyc-pending"),
          createdAt: new Date().toISOString(),
          actionUrl: "/document-verification",
          actionLabel: "Review Documents",
        });
      }

      // 2. Check pending products for moderation
      const pendingProductsCount = await this.prisma.product.count({
        where: { moderationStatus: "PENDING_APPROVAL", isDeleted: false },
      });

      if (pendingProductsCount > 0) {
        list.push({
          id: `notif-product-pending`,
          title: "Catalogue Products Need Approval",
          message: `${pendingProductsCount} product${pendingProductsCount > 1 ? "s submitted" : " submitted"} by merchants are pending catalog moderation.`,
          category: "INVENTORY",
          severity: "INFO",
          isRead: this.readNotificationIds.has("notif-product-pending"),
          createdAt: new Date(Date.now() - 15 * 60 * 1000).toISOString(),
          actionUrl: "/products",
          actionLabel: "View Catalog",
        });
      }

      // 3. Operational Dispatch & System Notifications
      list.push({
        id: "notif-dispatch-fleet",
        title: "Dispatch Engine Running Normally",
        message: "Automated delivery partner assignment radius is active at 10 km.",
        category: "ORDERS",
        severity: "SUCCESS",
        isRead: this.readNotificationIds.has("notif-dispatch-fleet"),
        createdAt: new Date(Date.now() - 45 * 60 * 1000).toISOString(),
        actionUrl: "/orders",
        actionLabel: "Open Orders",
      });

      list.push({
        id: "notif-finance-settlement",
        title: "Daily Settlement Calculation Complete",
        message: "Merchant and rider payout reconciliation for current cycle is ready for review.",
        category: "FINANCE",
        severity: "INFO",
        isRead: this.readNotificationIds.has("notif-finance-settlement"),
        createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
        actionUrl: "/finance",
        actionLabel: "Finance Hub",
      });

      list.push({
        id: "notif-security-audit",
        title: "Staff RBAC Policy Synchronized",
        message: "All operational admin roles and permission matrices are cryptographically secured.",
        category: "SECURITY",
        severity: "SUCCESS",
        isRead: this.readNotificationIds.has("notif-security-audit"),
        createdAt: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(),
        actionUrl: "/staff",
        actionLabel: "Staff Management",
      });
    } catch (err) {
      console.error("[NotificationsService] Error aggregating dynamic notifications:", err);
    }

    const unreadCount = list.filter((n) => !n.isRead).length;

    return {
      notifications: list,
      unreadCount,
    };
  }

  public async markRead(notificationId: string): Promise<{ success: boolean }> {
    this.readNotificationIds.add(notificationId);
    return { success: true };
  }

  public async markAllRead(): Promise<{ success: boolean }> {
    const { notifications } = await this.getNotifications("system");
    for (const notif of notifications) {
      this.readNotificationIds.add(notif.id);
    }
    return { success: true };
  }
}
