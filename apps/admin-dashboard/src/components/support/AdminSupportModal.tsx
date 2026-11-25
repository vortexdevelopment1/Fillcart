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
      setTicketSuccess(`Incident ticket #${created.ticketNumber || created.id} submitted to Platform Ops & Engineering.`);
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
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-3 sm:p-4 bg-ink/50 backdrop-blur-sm animate-fade-in font-sans">
      <div
        className="w-full max-w-3xl bg-white rounded-[24px] border border-primary/10 shadow-floating overflow-hidden flex flex-col max-h-[90vh] animate-scale-up"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-5 sm:px-6 py-4 border-b border-primary/10 flex items-center justify-between bg-neutral/30">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center flex-shrink-0">
              <LifeBuoy className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-heading text-lg font-normal text-ink leading-tight">
                Platform Ops & Tech Support
              </h3>
              <p className="font-sans text-xs text-ink/60 mt-0.5">
                Internal engineering runbooks, escalation matrix & incident desk
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-neutral hover:bg-neutral/80 flex items-center justify-center text-ink/70 hover:text-ink transition-colors cursor-pointer"
            aria-label="Close"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Navigation Tabs */}
        <div className="px-5 sm:px-6 py-2.5 border-b border-primary/10 bg-white flex items-center gap-2">
          <button
            type="button"
            onClick={() => setActiveTab('RUNBOOKS')}
            className={`px-3.5 py-1.5 rounded-full text-xs font-medium flex items-center gap-1.5 transition-all cursor-pointer ${
              activeTab === 'RUNBOOKS'
                ? 'bg-primary text-white shadow-sm'
                : 'text-ink/60 hover:text-ink hover:bg-neutral'
            }`}
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span>SOP Runbooks</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('CONTACTS')}
            className={`px-3.5 py-1.5 rounded-full text-xs font-medium flex items-center gap-1.5 transition-all cursor-pointer ${
              activeTab === 'CONTACTS'
                ? 'bg-primary text-white shadow-sm'
                : 'text-ink/60 hover:text-ink hover:bg-neutral'
            }`}
          >
            <Phone className="w-3.5 h-3.5" />
            <span>Escalation Matrix</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('TICKET')}
            className={`px-3.5 py-1.5 rounded-full text-xs font-medium flex items-center gap-1.5 transition-all cursor-pointer ${
              activeTab === 'TICKET'
                ? 'bg-primary text-white shadow-sm'
                : 'text-ink/60 hover:text-ink hover:bg-neutral'
            }`}
          >
            <Send className="w-3.5 h-3.5" />
            <span>Raise Tech Ticket</span>
          </button>
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto p-5 sm:p-6">
          {loading && contacts.length === 0 ? (
            <div className="py-16 text-center text-ink/50 text-xs flex flex-col items-center justify-center gap-2">
              <RefreshCw className="w-5 h-5 animate-spin text-primary" />
              <span>Loading support documentation...</span>
            </div>
          ) : activeTab === 'RUNBOOKS' ? (
            <div className="space-y-4">
              <div className="p-3 bg-neutral rounded-xl border border-primary/10 text-xs text-ink/80 flex items-start gap-2.5">
                <Shield className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                <div>
                  <span className="font-semibold text-ink">Standard Operating Procedures:</span> Follow these steps to resolve operational blocks before raising high-priority engineering incidents.
                </div>
              </div>

              {runbooks.map((book) => {
                const isExpanded = expandedRunbook === book.id;
                return (
                  <div
                    key={book.id}
                    className="border border-primary/10 rounded-[18px] overflow-hidden transition-all bg-white"
                  >
                    <button
                      type="button"
                      onClick={() => setExpandedRunbook(isExpanded ? null : book.id)}
                      className="w-full px-4 py-3 bg-neutral/40 hover:bg-neutral/70 flex items-center justify-between text-left cursor-pointer transition-colors"
                    >
                      <div className="flex items-center gap-2.5">
                        <FileText className="w-4 h-4 text-primary" />
                        <div>
                          <div className="text-xs font-medium text-ink">{book.title}</div>
                          <div className="text-[11px] text-ink/50">{book.summary}</div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="px-2 py-0.5 text-[10px] font-medium bg-primary/10 text-primary rounded-full">
                          {book.category}
                        </span>
                        {isExpanded ? (
                          <ChevronUp className="w-4 h-4 text-ink/40" />
                        ) : (
                          <ChevronDown className="w-4 h-4 text-ink/40" />
                        )}
                      </div>
                    </button>

                    {isExpanded && (
                      <div className="p-4 bg-white border-t border-primary/5">
                        <ol className="list-decimal list-inside space-y-2 text-xs text-ink/70">
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
              <div className="p-3 bg-neutral rounded-xl border border-primary/10 text-xs text-ink/80 flex items-start gap-2.5">
                <Clock className="w-4 h-4 text-secondary shrink-0 mt-0.5" />
                <div>
                  <span className="font-semibold text-ink">24x7 Tier-3 On-Call Escalation:</span> For critical payment failure spikes, database outages, or security incidents, call the primary phone directly.
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {contacts.map((contact, idx) => (
                  <div
                    key={idx}
                    className="p-4 rounded-[18px] border border-primary/10 bg-white hover:border-primary/25 transition-all shadow-card"
                  >
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-xs font-semibold text-ink">{contact.role}</span>
                      <span className="px-2 py-0.5 text-[10px] font-medium bg-primary/10 text-primary rounded-full">
                        {contact.availability}
                      </span>
                    </div>
                    <div className="text-xs text-ink/70 mb-3">{contact.name}</div>

                    <div className="space-y-1.5 text-xs text-ink/80 pt-2 border-t border-primary/5">
                      <div className="flex items-center gap-2">
                        <Phone className="w-3.5 h-3.5 text-secondary" />
                        <a href={`tel:${contact.phone}`} className="hover:text-primary transition-colors">
                          {contact.phone}
                        </a>
                      </div>
                      <div className="flex items-center gap-2">
                        <Mail className="w-3.5 h-3.5 text-secondary" />
                        <a href={`mailto:${contact.email}`} className="hover:text-primary transition-colors">
                          {contact.email}
                        </a>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="space-y-5">
              {ticketSuccess && (
                <div className="p-3 bg-[#D1FAE5] border border-[#A7F3D0] rounded-xl text-xs text-[#065F46] flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-[#065F46]" />
                    <span>{ticketSuccess}</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => setTicketSuccess(null)}
                    className="text-xs text-[#065F46] hover:underline"
                  >
                    Dismiss
                  </button>
                </div>
              )}

              {ticketError && (
                <div className="p-3 bg-[#FEE2E2] border border-[#FCA5A5] rounded-xl text-xs text-[#991B1B] flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 text-[#991B1B]" />
                  <span>{ticketError}</span>
                </div>
              )}

              <form onSubmit={handleCreateTicket} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-ink mb-1">
                    Subject / Summary
                  </label>
                  <input
                    type="text"
                    required
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    placeholder="e.g. Gateway webhook delay in settlements batch"
                    className="w-full px-3.5 py-2 text-xs rounded-xl border border-primary/15 focus:outline-none focus:ring-2 focus:ring-secondary focus:border-transparent"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-ink mb-1">Category</label>
                    <select
                      value={category}
                      onChange={(e) => setCategory(e.target.value as any)}
                      className="w-full px-3.5 py-2 text-xs rounded-xl border border-primary/15 focus:outline-none focus:ring-2 focus:ring-secondary focus:border-transparent bg-white"
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
                    <label className="block text-xs font-semibold text-ink mb-1">Priority</label>
                    <select
                      value={priority}
                      onChange={(e) => setPriority(e.target.value as any)}
                      className="w-full px-3.5 py-2 text-xs rounded-xl border border-primary/15 focus:outline-none focus:ring-2 focus:ring-secondary focus:border-transparent bg-white"
                    >
                      <option value="LOW">Low - General query</option>
                      <option value="MEDIUM">Medium - Non-blocking operational issue</option>
                      <option value="HIGH">High - Order/Payment settlement impact</option>
                      <option value="CRITICAL">Critical - System outage / Security threat</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-ink mb-1">
                    Detailed Description & Steps
                  </label>
                  <textarea
                    rows={4}
                    required
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Provide incident steps, related order/vendor IDs, and observed vs expected behavior..."
                    className="w-full px-3.5 py-2 text-xs rounded-xl border border-primary/15 focus:outline-none focus:ring-2 focus:ring-secondary focus:border-transparent resize-none"
                  />
                </div>

                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full py-2.5 px-4 bg-primary hover:bg-primary/90 text-white text-xs font-medium rounded-xl shadow-sm transition-colors flex items-center justify-center gap-2 disabled:opacity-60 cursor-pointer"
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
                <div className="pt-4 border-t border-primary/10">
                  <h4 className="text-xs font-semibold text-ink mb-3">Recently Logged Tickets</h4>
                  <div className="space-y-2">
                    {tickets.map((t) => (
                      <div
                        key={t.id}
                        className="p-3 rounded-xl border border-primary/10 bg-neutral/30 flex items-center justify-between text-xs"
                      >
                        <div className="flex items-center gap-2">
                          <span className="font-mono font-bold text-primary">{t.ticketNumber || t.id}</span>
                          <span className="text-ink font-medium">{t.subject}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-medium bg-neutral text-ink border border-primary/10">
                            {t.priority}
                          </span>
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-[#D1FAE5] text-[#065F46]">
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
        <div className="px-5 sm:px-6 py-3 border-t border-primary/10 bg-neutral/40 flex items-center justify-between text-xs text-ink/60">
          <span>Fillkart Internal Operations Desk</span>
          <button
            type="button"
            onClick={onClose}
            className="hover:text-ink font-medium cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
};
