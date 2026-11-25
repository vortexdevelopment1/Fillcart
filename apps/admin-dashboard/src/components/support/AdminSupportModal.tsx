import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import {
  X,
  LifeBuoy,
  BookOpen,
  Phone,
  Mail,
  Send,
  AlertCircle,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  FileText,
  Clock,
  Shield,
  RefreshCw,
} from 'lucide-react';
import { adminApi } from '../../services/adminApi';
import type {
  SupportContact,
  SupportRunbook,
  SupportTicketItem,
  CreateSupportTicketPayload,
} from '../../types/adminApi';

interface AdminSupportModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AdminSupportModal: React.FC<AdminSupportModalProps> = ({ isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState<'RUNBOOKS' | 'CONTACTS' | 'TICKET'>('RUNBOOKS');
  const [contacts, setContacts] = useState<SupportContact[]>([]);
  const [runbooks, setRunbooks] = useState<SupportRunbook[]>([]);
  const [tickets, setTickets] = useState<SupportTicketItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [expandedRunbook, setExpandedRunbook] = useState<string | null>(null);

  // Form state
  const [subject, setSubject] = useState('');
  const [category, setCategory] = useState<
    | 'BUG_REPORT'
    | 'PAYMENT_GATEWAY'
    | 'DISPATCH_SYSTEM'
    | 'DATABASE_SYNC'
    | 'ACCESS_PERMISSION'
    | 'FEATURE_REQUEST'
    | 'OTHER'
  >('BUG_REPORT');
  const [priority, setPriority] = useState<'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL'>('MEDIUM');
  const [description, setDescription] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [ticketSuccess, setTicketSuccess] = useState<string | null>(null);
  const [ticketError, setTicketError] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      loadSupportInfo();
    }
  }, [isOpen]);

  const loadSupportInfo = async () => {
    try {
      setLoading(true);
      const data = await adminApi.getSupportInfo();
      setContacts(data.contacts);
      setRunbooks(data.runbooks);
      setTickets(data.recentTickets || []);
      if (data.runbooks.length > 0) {
        setExpandedRunbook(data.runbooks[0].id);
      }
    } catch {
      // keep empty
    } finally {
      setLoading(false);
    }
  };

  const handleCreateTicket = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!subject.trim() || !description.trim()) {
      setTicketError('Please provide both subject and description.');
      return;
    }

    try {
      setSubmitting(true);
      setTicketError(null);
      const payload: CreateSupportTicketPayload = {
        subject: subject.trim(),
        category,
        priority,
        description: description.trim(),
      };
      const created = await adminApi.createSupportTicket(payload);
      setTickets((prev) => [created, ...prev]);
      setTicketSuccess(`Incident ticket #${created.id} submitted to Platform Ops & Engineering.`);
      setSubject('');
      setDescription('');
    } catch {
      setTicketError('Failed to submit ticket. Please reach out to emergency on-call directly.');
    } finally {
      setSubmitting(false);
    }
  };

  if (!isOpen || typeof document === 'undefined') return null;

  return createPortal(
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-fade-in">
      <div
        className="w-full max-w-3xl bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[90vh] animate-scale-up"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/70">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-teal-50 border border-teal-200 text-teal-700 flex items-center justify-center">
              <LifeBuoy className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-semibold text-slate-900 text-base">Platform Ops & Tech Support</h3>
              <p className="text-xs text-slate-500">Internal engineering runbooks, escalation matrix & incident desk</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-white border border-transparent hover:border-slate-200 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Navigation Tabs */}
        <div className="px-6 py-2 border-b border-slate-100 bg-white flex items-center gap-2">
          <button
            onClick={() => setActiveTab('RUNBOOKS')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium flex items-center gap-1.5 transition-colors ${
              activeTab === 'RUNBOOKS'
                ? 'bg-slate-900 text-white shadow-sm'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span>SOP Runbooks</span>
          </button>
          <button
            onClick={() => setActiveTab('CONTACTS')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium flex items-center gap-1.5 transition-colors ${
              activeTab === 'CONTACTS'
                ? 'bg-slate-900 text-white shadow-sm'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <Phone className="w-3.5 h-3.5" />
            <span>Escalation Matrix</span>
          </button>
          <button
            onClick={() => setActiveTab('TICKET')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium flex items-center gap-1.5 transition-colors ${
              activeTab === 'TICKET'
                ? 'bg-slate-900 text-white shadow-sm'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <Send className="w-3.5 h-3.5" />
            <span>Raise Tech Ticket</span>
          </button>
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto p-6">
          {loading && contacts.length === 0 ? (
            <div className="py-16 text-center text-slate-400 text-sm flex flex-col items-center justify-center gap-2">
              <RefreshCw className="w-5 h-5 animate-spin text-teal-600" />
              <span>Loading support documentation...</span>
            </div>
          ) : activeTab === 'RUNBOOKS' ? (
            <div className="space-y-4">
              <div className="p-3 bg-teal-50/50 rounded-xl border border-teal-100 text-xs text-teal-800 flex items-start gap-2.5">
                <Shield className="w-4 h-4 text-teal-600 shrink-0 mt-0.5" />
                <div>
                  <span className="font-semibold">Standard Operating Procedures:</span> Follow these steps to resolve operational blocks before raising high-priority engineering incidents.
                </div>
              </div>

              {runbooks.map((book) => {
                const isExpanded = expandedRunbook === book.id;
                return (
                  <div
                    key={book.id}
                    className="border border-slate-200 rounded-xl overflow-hidden transition-all"
                  >
                    <button
                      onClick={() => setExpandedRunbook(isExpanded ? null : book.id)}
                      className="w-full px-4 py-3 bg-slate-50/60 hover:bg-slate-50 flex items-center justify-between text-left"
                    >
                      <div className="flex items-center gap-2.5">
                        <FileText className="w-4 h-4 text-slate-500" />
                        <div>
                          <div className="text-xs font-semibold text-slate-900">{book.title}</div>
                          <div className="text-[11px] text-slate-500">{book.summary}</div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="px-2 py-0.5 text-[10px] font-semibold bg-slate-200 text-slate-700 rounded">
                          {book.category}
                        </span>
                        {isExpanded ? (
                          <ChevronUp className="w-4 h-4 text-slate-400" />
                        ) : (
                          <ChevronDown className="w-4 h-4 text-slate-400" />
                        )}
                      </div>
                    </button>

                    {isExpanded && (
                      <div className="p-4 bg-white border-t border-slate-100">
                        <ol className="list-decimal list-inside space-y-2 text-xs text-slate-600">
                          {book.steps.map((step, idx) => (
                            <li key={idx} className="leading-relaxed">
                              {step}
                            </li>
                          ))}
                        </ol>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          ) : activeTab === 'CONTACTS' ? (
            <div className="space-y-4">
              <div className="p-3 bg-amber-50/50 rounded-xl border border-amber-100 text-xs text-amber-800 flex items-start gap-2.5">
                <Clock className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                <div>
                  <span className="font-semibold">24x7 Tier-3 On-Call Escalation:</span> For critical payment failure spikes, database outages, or security incidents, call the primary phone directly.
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {contacts.map((contact, idx) => (
                  <div
                    key={idx}
                    className="p-4 rounded-xl border border-slate-200 bg-white hover:border-slate-300 transition-all shadow-xs"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-semibold text-slate-900">{contact.role}</span>
                      <span className="px-2 py-0.5 text-[10px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-full">
                        {contact.availability}
                      </span>
                    </div>
                    <div className="text-xs font-medium text-slate-700 mb-3">{contact.name}</div>

                    <div className="space-y-1.5 text-xs text-slate-600">
                      <div className="flex items-center gap-2">
                        <Phone className="w-3.5 h-3.5 text-slate-400" />
                        <a href={`tel:${contact.phone}`} className="hover:text-teal-700">
                          {contact.phone}
                        </a>
                      </div>
                      <div className="flex items-center gap-2">
                        <Mail className="w-3.5 h-3.5 text-slate-400" />
                        <a href={`mailto:${contact.email}`} className="hover:text-teal-700">
                          {contact.email}
                        </a>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              {ticketSuccess && (
                <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-700 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span>{ticketSuccess}</span>
                  </div>
                  <button
                    onClick={() => setTicketSuccess(null)}
                    className="text-xs text-emerald-600 hover:text-emerald-800"
                  >
                    Dismiss
                  </button>
                </div>
              )}

              {ticketError && (
                <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-700 flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 text-rose-600" />
                  <span>{ticketError}</span>
                </div>
              )}

              <form onSubmit={handleCreateTicket} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Subject / Summary
                  </label>
                  <input
                    type="text"
                    required
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    placeholder="e.g. Gateway webhook delay in settlements batch"
                    className="w-full px-3 py-2 text-xs rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-teal-600 focus:border-transparent"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Category</label>
                    <select
                      value={category}
                      onChange={(e) => setCategory(e.target.value as any)}
                      className="w-full px-3 py-2 text-xs rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-teal-600 focus:border-transparent"
                    >
                      <option value="BUG_REPORT">Engineering / System Bug</option>
                      <option value="PAYMENT_GATEWAY">Payment Gateway / Disputed Webhook</option>
                      <option value="DISPATCH_SYSTEM">Dispatch / Rider Routing Issue</option>
                      <option value="DATABASE_SYNC">Database & Inventory Desync</option>
                      <option value="ACCESS_PERMISSION">Admin Access & Role Elevation</option>
                      <option value="OTHER">General Platform Escalation</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Priority</label>
                    <select
                      value={priority}
                      onChange={(e) => setPriority(e.target.value as any)}
                      className="w-full px-3 py-2 text-xs rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-teal-600 focus:border-transparent"
                    >
                      <option value="LOW">Low - General query</option>
                      <option value="MEDIUM">Medium - Non-blocking operational issue</option>
                      <option value="HIGH">High - Order/Payment settlement impact</option>
                      <option value="CRITICAL">Critical - System outage / Security threat</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Detailed Description & Steps
                  </label>
                  <textarea
                    rows={4}
                    required
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Provide incident steps, related order/vendor IDs, and observed vs expected behavior..."
                    className="w-full px-3 py-2 text-xs rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-teal-600 focus:border-transparent resize-none"
                  />
                </div>

                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full py-2.5 px-4 bg-teal-700 hover:bg-teal-800 text-white text-xs font-semibold rounded-lg shadow-sm transition-colors flex items-center justify-center gap-2 disabled:opacity-60"
                >
                  {submitting ? (
                    <>
                      <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                      <span>Submitting Incident...</span>
                    </>
                  ) : (
                    <>
                      <Send className="w-3.5 h-3.5" />
                      <span>Submit Internal Incident Ticket</span>
                    </>
                  )}
                </button>
              </form>

              {tickets.length > 0 && (
                <div className="pt-4 border-t border-slate-100">
                  <h4 className="text-xs font-semibold text-slate-700 mb-3">Recently Logged Tickets</h4>
                  <div className="space-y-2">
                    {tickets.map((t) => (
                      <div
                        key={t.id}
                        className="p-3 rounded-lg border border-slate-200 bg-slate-50/50 flex items-center justify-between text-xs"
                      >
                        <div className="flex items-center gap-2">
                          <span className="font-mono font-bold text-teal-800">{t.ticketNumber || t.id}</span>
                          <span className="text-slate-800 font-medium">{t.subject}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-slate-200 text-slate-700">
                            {t.priority}
                          </span>
                          <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-emerald-100 text-emerald-800">
                            {t.status}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-3 border-t border-slate-100 bg-slate-50 flex items-center justify-between text-xs text-slate-500">
          <span>Fillkart Internal Operations Desk</span>
          <button onClick={onClose} className="hover:text-slate-700 font-medium">
            Close
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
};
