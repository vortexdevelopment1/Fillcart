import React, { useState, useEffect, useCallback } from 'react';
import { createPortal } from 'react-dom';
import { useNavigate } from 'react-router-dom';
import {
  X,
  Bell,
  CheckCheck,
  RefreshCw,
  AlertTriangle,
  Info,
  CheckCircle2,
  ShieldAlert,
  ArrowUpRight,
  ExternalLink,
  FileCheck2,
  Package,
  ShoppingBag,
  DollarSign,
  ShieldCheck,
} from 'lucide-react';
import { adminApi } from '../../services/adminApi';
import type { AdminNotificationItem } from '../../types/adminApi';

interface AdminNotificationsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCountChange?: (count: number) => void;
}

type CategoryTab = 'ALL' | 'KYC' | 'ORDERS' | 'INVENTORY' | 'FINANCE' | 'SECURITY';

const TAB_DESCRIPTIONS: Record<CategoryTab, string> = {
  ALL: 'Overview of all active operations: pending approvals, dispatch SLA, finance settlements & security.',
  KYC: 'Vendor & rider registrations: Review government documents (GST, PAN, Driving License, RC) before onboarding.',
  ORDERS: 'Live order pipeline: Delayed dispatch, cancellation requests, delivery partner assignment exceptions.',
  INVENTORY: 'Catalog & products: New merchant product submissions needing admin moderation and stock alerts.',
  FINANCE: 'Banking & settlements: Merchant weekly payouts, payment gateway double-debit reconciliations & refund disputes.',
  SECURITY: 'Security & staff: Two-factor auth, admin session logs, password updates & role permission changes.',
};

export const AdminNotificationsModal: React.FC<AdminNotificationsModalProps> = ({
  isOpen,
  onClose,
  onCountChange,
}) => {
  const navigate = useNavigate();
  const [items, setItems] = useState<AdminNotificationItem[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<CategoryTab>('ALL');

  const fetchNotifications = useCallback(async () => {
    try {
      setLoading(true);
      const data = await adminApi.getNotifications();
      setItems(data.notifications);
      setUnreadCount(data.unreadCount);
      if (onCountChange) {
        onCountChange(data.unreadCount);
      }
    } catch {
      // keep current items
    } finally {
      setLoading(false);
    }
  }, [onCountChange]);

  useEffect(() => {
    if (isOpen) {
      fetchNotifications();
    }
  }, [isOpen, fetchNotifications]);

  const handleMarkAsRead = async (id: string) => {
    try {
      await adminApi.markNotificationRead(id);
      setItems((prev) =>
        prev.map((item) => (item.id === id ? { ...item, isRead: true } : item))
      );
      setUnreadCount((prev) => Math.max(0, prev - 1));
      if (onCountChange) {
        onCountChange(Math.max(0, unreadCount - 1));
      }
    } catch {
      // fail silently
    }
  };

  const handleMarkAllRead = async () => {
    try {
      await adminApi.markAllNotificationsRead();
      setItems((prev) => prev.map((item) => ({ ...item, isRead: true })));
      setUnreadCount(0);
      if (onCountChange) {
        onCountChange(0);
      }
    } catch {
      // fail silently
    }
  };

  const handleNavigate = (link?: string, notifId?: string) => {
    if (notifId) {
      handleMarkAsRead(notifId);
    }
    if (link) {
      navigate(link);
      onClose();
    }
  };

  if (!isOpen || typeof document === 'undefined') return null;

  const filteredItems = items.filter((item) => {
    if (activeTab === 'ALL') return true;
    if (activeTab === 'INVENTORY' && item.category === 'SYSTEM') return true;
    return item.category === activeTab;
  });

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'KYC':
        return <FileCheck2 className="w-4 h-4 text-primary" />;
      case 'ORDERS':
        return <ShoppingBag className="w-4 h-4 text-primary" />;
      case 'FINANCE':
        return <DollarSign className="w-4 h-4 text-primary" />;
      case 'INVENTORY':
      case 'SYSTEM':
        return <Package className="w-4 h-4 text-primary" />;
      case 'SECURITY':
        return <ShieldCheck className="w-4 h-4 text-primary" />;
      default:
        return <Bell className="w-4 h-4 text-primary" />;
    }
  };

  const getSeverityBadge = (severity: string) => {
    switch (severity) {
      case 'CRITICAL':
        return 'bg-[#FEE2E2] text-[#991B1B] border-[#FCA5A5]';
      case 'WARNING':
        return 'bg-[#FEF3C7] text-[#92400E] border-[#FCD34D]';
      case 'SUCCESS':
        return 'bg-[#D1FAE5] text-[#065F46] border-[#A7F3D0]';
      case 'INFO':
      default:
        return 'bg-primary/10 text-primary border-primary/20';
    }
  };

  return createPortal(
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-3 sm:p-4 bg-ink/50 backdrop-blur-sm animate-fade-in font-sans">
      <div
        className="w-full max-w-2xl bg-white rounded-[24px] border border-primary/10 shadow-floating overflow-hidden flex flex-col h-[580px] max-h-[90vh] animate-scale-up"
        onClick={(e) => e.stopPropagation()}
      >
        {/* ──────── Modal Header ──────── */}
        <div className="px-5 sm:px-6 py-4 border-b border-primary/10 flex items-center justify-between bg-neutral/30">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center flex-shrink-0">
              <Bell className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-heading text-lg font-normal text-ink leading-tight">
                  Admin Notifications
                </h3>
                {unreadCount > 0 && (
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-primary text-white">
                    {unreadCount} new
                  </span>
                )}
              </div>
              <p className="font-sans text-xs text-ink/60 mt-0.5">
                Real-time operational alerts for daily platform governance
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {unreadCount > 0 && (
              <button
                type="button"
                onClick={handleMarkAllRead}
                className="px-2.5 py-1.5 text-xs font-medium text-ink/70 hover:text-ink hover:bg-neutral rounded-xl border border-primary/10 transition-colors flex items-center gap-1.5 cursor-pointer"
                title="Mark all as read"
              >
                <CheckCheck className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Mark all read</span>
              </button>
            )}
            <button
              type="button"
              onClick={fetchNotifications}
              disabled={loading}
              className="w-8 h-8 rounded-full bg-neutral hover:bg-neutral/80 flex items-center justify-center text-ink/70 hover:text-ink transition-colors cursor-pointer"
              title="Refresh alerts"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin text-primary' : ''}`} />
            </button>
            <button
              type="button"
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-neutral hover:bg-neutral/80 flex items-center justify-center text-ink/70 hover:text-ink transition-colors cursor-pointer"
              aria-label="Close"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* ──────── Category Tabs ──────── */}
        <div className="px-5 sm:px-6 pt-3 pb-2 border-b border-primary/10 bg-white">
          <div className="flex items-center gap-1.5 overflow-x-auto text-xs pb-1 scrollbar-none">
            {(
              [
                { key: 'ALL', label: 'All Alerts' },
                { key: 'KYC', label: 'KYC Docs' },
                { key: 'ORDERS', label: 'Orders & Fleet' },
                { key: 'INVENTORY', label: 'Catalog & Stock' },
                { key: 'FINANCE', label: 'Finance & Payouts' },
                { key: 'SECURITY', label: 'Security' },
              ] as const
            ).map((tab) => (
              <button
                key={tab.key}
                type="button"
                onClick={() => setActiveTab(tab.key)}
                className={`px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-all cursor-pointer ${
                  activeTab === tab.key
                    ? 'bg-primary text-white shadow-sm'
                    : 'text-ink/60 hover:text-ink hover:bg-neutral'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Tab Explanatory Banner */}
          <div className="mt-2 py-1.5 px-3 rounded-lg bg-neutral/60 border border-primary/5 text-[11px] text-ink/70 flex items-center gap-2">
            <Info className="w-3.5 h-3.5 text-secondary flex-shrink-0" />
            <span className="truncate">{TAB_DESCRIPTIONS[activeTab]}</span>
          </div>
        </div>

        {/* ──────── Notification Items List ──────── */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-2.5">
          {loading && items.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center text-ink/50 text-xs gap-2 py-10">
              <RefreshCw className="w-5 h-5 animate-spin text-primary" />
              <span>Fetching live alerts...</span>
            </div>
          ) : filteredItems.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center text-ink/50 text-xs py-10">
              <div className="w-12 h-12 rounded-2xl bg-neutral flex items-center justify-center text-ink/30 mb-3">
                <Bell className="w-6 h-6" />
              </div>
              <p className="font-heading text-sm text-ink font-normal">No pending alerts here</p>
              <p className="font-sans text-[11px] text-ink/50 mt-1 max-w-sm">
                No active notifications in this category. All operations are running within SLA limits.
              </p>
            </div>
          ) : (
            filteredItems.map((item) => (
              <div
                key={item.id}
                className={`p-3.5 sm:p-4 rounded-[18px] transition-all border ${
                  item.isRead
                    ? 'bg-white border-primary/10 hover:border-primary/20'
                    : 'bg-primary/[0.03] border-primary/25 shadow-xs'
                }`}
              >
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                    {getCategoryIcon(item.category)}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1 flex-wrap">
                      <span className="font-sans font-medium text-ink text-xs sm:text-sm">
                        {item.title}
                      </span>
                      <span
                        className={`px-2 py-0.5 rounded-full text-[10px] font-semibold border ${getSeverityBadge(
                          item.severity
                        )}`}
                      >
                        {item.severity}
                      </span>
                      <span className="text-[10px] text-ink/40 font-normal ml-auto">
                        {new Date(item.createdAt).toLocaleTimeString([], {
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </span>
                    </div>

                    <p className="font-sans text-xs text-ink/70 leading-relaxed mb-3">
                      {item.message}
                    </p>

                    <div className="flex items-center justify-between gap-2 pt-1 border-t border-primary/5">
                      {item.actionUrl ? (
                        <button
                          type="button"
                          onClick={() => handleNavigate(item.actionUrl, item.id)}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-primary hover:bg-primary/90 text-white text-xs font-medium transition-colors cursor-pointer shadow-xs"
                        >
                          <span>{item.actionLabel || 'Go to Page'}</span>
                          <ArrowUpRight className="w-3.5 h-3.5" />
                        </button>
                      ) : (
                        <div />
                      )}

                      {!item.isRead && (
                        <button
                          type="button"
                          onClick={() => handleMarkAsRead(item.id)}
                          className="text-xs text-ink/40 hover:text-ink font-medium px-2 py-1 rounded hover:bg-neutral transition-colors cursor-pointer"
                        >
                          Mark as read
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* ──────── Modal Footer ──────── */}
        <div className="px-5 sm:px-6 py-3 border-t border-primary/10 bg-neutral/40 flex items-center justify-between text-xs text-ink/60">
          <span className="flex items-center gap-1.5 text-[11px]">
            <span className="w-2 h-2 rounded-full bg-secondary animate-pulse" />
            Live sync connected
          </span>
          <button
            type="button"
            onClick={() => {
              navigate('/settings?tab=notifications');
              onClose();
            }}
            className="text-primary hover:text-secondary font-medium flex items-center gap-1 text-[11px] underline underline-offset-2 cursor-pointer"
          >
            <span>Customer SMS/Email Gateway Settings</span>
            <ExternalLink className="w-3 h-3" />
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
};
