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
} from 'lucide-react';
import { adminApi } from '../../services/adminApi';
import type { AdminNotificationItem } from '../../types/adminApi';

interface AdminNotificationsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCountChange?: (count: number) => void;
}

export const AdminNotificationsModal: React.FC<AdminNotificationsModalProps> = ({
  isOpen,
  onClose,
  onCountChange,
}) => {
  const navigate = useNavigate();
  const [items, setItems] = useState<AdminNotificationItem[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<'ALL' | 'KYC' | 'ORDERS' | 'SYSTEM' | 'FINANCE'>('ALL');

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
    return item.category === activeTab;
  });

  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case 'CRITICAL':
        return <ShieldAlert className="w-4 h-4 text-rose-600" />;
      case 'WARNING':
        return <AlertTriangle className="w-4 h-4 text-amber-500" />;
      case 'SUCCESS':
        return <CheckCircle2 className="w-4 h-4 text-emerald-500" />;
      case 'INFO':
      default:
        return <Info className="w-4 h-4 text-sky-500" />;
    }
  };

  const getSeverityBadge = (severity: string) => {
    switch (severity) {
      case 'CRITICAL':
        return 'bg-rose-50 text-rose-700 border-rose-200';
      case 'WARNING':
        return 'bg-amber-50 text-amber-700 border-amber-200';
      case 'SUCCESS':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case 'INFO':
      default:
        return 'bg-sky-50 text-sky-700 border-sky-200';
    }
  };

  return createPortal(
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-fade-in">
      <div
        className="w-full max-w-2xl bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[85vh] animate-scale-up"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/70">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-teal-50 border border-teal-200 text-teal-700 flex items-center justify-center">
              <Bell className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-semibold text-slate-900 text-base">Admin Notifications</h3>
                {unreadCount > 0 && (
                  <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-rose-500 text-white animate-pulse">
                    {unreadCount} new
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-500">Real-time alerts for KYC, orders, catalog and system</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {unreadCount > 0 && (
              <button
                onClick={handleMarkAllRead}
                className="px-2.5 py-1.5 text-xs font-medium text-slate-600 hover:text-teal-700 hover:bg-white rounded-lg border border-slate-200 transition-colors flex items-center gap-1.5"
                title="Mark all as read"
              >
                <CheckCheck className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Mark all read</span>
              </button>
            )}
            <button
              onClick={fetchNotifications}
              disabled={loading}
              className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-white border border-transparent hover:border-slate-200 transition-colors"
              title="Refresh"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin text-teal-600' : ''}`} />
            </button>
            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-white border border-transparent hover:border-slate-200 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Category Tabs */}
        <div className="px-6 py-2 border-b border-slate-100 bg-white flex items-center gap-2 overflow-x-auto text-xs">
          {(['ALL', 'KYC', 'ORDERS', 'SYSTEM', 'FINANCE'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-3 py-1.5 rounded-lg font-medium transition-colors ${
                activeTab === tab
                  ? 'bg-slate-900 text-white shadow-sm'
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              {tab === 'ALL' ? 'All Alerts' : tab}
            </button>
          ))}
        </div>

        {/* Notification List */}
        <div className="flex-1 overflow-y-auto p-4 divide-y divide-slate-100 space-y-2">
          {loading && items.length === 0 ? (
            <div className="py-12 text-center text-slate-400 text-sm flex flex-col items-center gap-2">
              <RefreshCw className="w-5 h-5 animate-spin text-teal-600" />
              <span>Loading notifications...</span>
            </div>
          ) : filteredItems.length === 0 ? (
            <div className="py-16 text-center text-slate-400 text-sm flex flex-col items-center justify-center">
              <Bell className="w-10 h-10 text-slate-200 mb-2" />
              <p className="font-medium text-slate-600">No notifications here</p>
              <p className="text-xs text-slate-400">Everything is running smoothly on the platform.</p>
            </div>
          ) : (
            filteredItems.map((item) => (
              <div
                key={item.id}
                className={`p-3.5 rounded-xl transition-all border ${
                  item.isRead
                    ? 'bg-white border-transparent hover:border-slate-200'
                    : 'bg-teal-50/30 border-teal-100 shadow-xs'
                }`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-start gap-3 flex-1 min-w-0">
                    <div className="mt-0.5 p-1.5 rounded-lg bg-slate-100">
                      {getSeverityIcon(item.severity)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1 flex-wrap">
                        <span className="font-semibold text-slate-900 text-xs sm:text-sm">
                          {item.title}
                        </span>
                        <span
                          className={`px-1.5 py-0.5 rounded text-[10px] font-semibold border ${getSeverityBadge(
                            item.severity
                          )}`}
                        >
                          {item.severity}
                        </span>
                        <span className="text-[11px] text-slate-400">
                          {new Date(item.createdAt).toLocaleTimeString([], {
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </span>
                      </div>
                      <p className="text-xs text-slate-600 leading-relaxed mb-2">
                        {item.message}
                      </p>

                      <div className="flex items-center gap-2">
                        {item.actionUrl && (
                          <button
                            onClick={() => handleNavigate(item.actionUrl, item.id)}
                            className="inline-flex items-center gap-1 text-xs font-semibold text-teal-700 hover:text-teal-800 hover:underline"
                          >
                            <span>{item.actionLabel || 'Open Operational Page'}</span>
                            <ArrowUpRight className="w-3.5 h-3.5" />
                          </button>
                        )}
                        {!item.isRead && (
                          <button
                            onClick={() => handleMarkAsRead(item.id)}
                            className="text-xs text-slate-400 hover:text-slate-600 font-medium ml-auto"
                          >
                            Dismiss
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-3 border-t border-slate-100 bg-slate-50 flex items-center justify-between text-xs text-slate-500">
          <span className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            Live sync active
          </span>
          <button
            onClick={() => {
              navigate('/settings?tab=notifications');
              onClose();
            }}
            className="text-teal-700 hover:text-teal-800 font-medium flex items-center gap-1"
          >
            <span>Configure SMS/Email Gateways</span>
            <ExternalLink className="w-3 h-3" />
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
};
