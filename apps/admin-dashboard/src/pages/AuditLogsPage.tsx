import React, { useState, useMemo, useEffect, useRef } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { AuditLogEntry, AuditAction, ApiLogEntry, initialApiLogs } from '../data/auditData';
import { CustomSelect } from '../components/common/CustomSelect';
import {
  History,
  Search,
  Download,
  ChevronDown,
  ChevronUp,
  Shield,
  Laptop,
  Network,
  RotateCcw,
  ChevronsLeft,
  ChevronLeft,
  ChevronRight,
  ChevronsRight,
  User,
  AlertTriangle,
  Code2,
} from 'lucide-react';

export type AuditTab = 'Admin Audit' | 'API' | 'User Activity' | 'Payment' | 'Order' | 'Security';

const ALL_AUDIT_TABS: AuditTab[] = [
  'Admin Audit',
  'API',
  'User Activity',
  'Payment',
  'Order',
  'Security',
];

const RETENTION_DAYS: Record<AuditTab, number> = {
  'Admin Audit': 365,
  'API': 90,
  'User Activity': 90,
  'Payment': 365,
  'Order': 90,
  'Security': 90,
};

export const AuditLogsPage: React.FC = () => {
  const { auditLogs, currentRole } = useApp();
  const [searchParams, setSearchParams] = useSearchParams();

  // Role-based allowed tabs
  const allowedTabs = useMemo<AuditTab[]>(() => {
    if (currentRole === 'Finance Admin') {
      return ['Admin Audit', 'Payment'];
    }
    if (currentRole === 'Operations Admin') {
      return ['Admin Audit', 'Order', 'User Activity'];
    }
    if (currentRole === 'Support Admin') {
      return ['Order', 'User Activity'];
    }
    if (currentRole === 'Marketing Admin') {
      return ['User Activity'];
    }
    return ALL_AUDIT_TABS;
  }, [currentRole]);

  // Read initial tab from URL param if valid and allowed (case-insensitive)
  const getTabFromParam = (raw: string | null): AuditTab | null => {
    if (!raw) return null;
    const found = allowedTabs.find(
      (t) => t.toLowerCase() === raw.toLowerCase()
    );
    return found || null;
  };

  const initialTab = useMemo<AuditTab>(() => {
    const matched = getTabFromParam(searchParams.get('tab'));
    return matched || allowedTabs[0] || 'Admin Audit';
  }, [searchParams, allowedTabs]);

  const [activeTab, setActiveTab] = useState<AuditTab>(initialTab);
  const activeTabRef = useRef<HTMLButtonElement | null>(null);

  // Auto-scroll active tab into view on small screens
  useEffect(() => {
    if (activeTabRef.current && window.innerWidth < 1024) {
      activeTabRef.current.scrollIntoView({
        inline: 'center',
        block: 'nearest',
        behavior: 'smooth',
      });
    }
  }, [activeTab]);

  // Sync tab if URL param changes
  useEffect(() => {
    const matched = getTabFromParam(searchParams.get('tab'));
    if (matched && matched !== activeTab) {
      setActiveTab(matched);
    }
  }, [searchParams, allowedTabs]);

  // Sync if role changes
  useEffect(() => {
    if (!allowedTabs.includes(activeTab)) {
      setActiveTab(allowedTabs[0] || 'Admin Audit');
    }
  }, [allowedTabs, activeTab]);

  const [search, setSearch] = useState('');
  const [selectedModule, setSelectedModule] = useState('All');
  const [selectedAction, setSelectedAction] = useState('All');
  const [selectedAdmin, setSelectedAdmin] = useState('All');
  const [selectedMethod, setSelectedMethod] = useState('All');
  const [selectedStatusCode, setSelectedStatusCode] = useState('All');
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(8);
  const [expandedRowId, setExpandedRowId] = useState<string | null>(null);

  // API logs list
  const [apiLogs] = useState<ApiLogEntry[]>(initialApiLogs);

  // Distinct admins and modules for filter dropdowns
  const adminNames = useMemo<string[]>(() => {
    const set = new Set(auditLogs.map((l) => l.admin.name));
    return Array.from(set);
  }, [auditLogs]);

  const moduleNames = useMemo<string[]>(() => {
    const set = new Set(auditLogs.map((l) => l.module));
    return Array.from(set);
  }, [auditLogs]);

  // Filtered standard audit logs
  const filteredAuditLogs = useMemo(() => {
    return auditLogs.filter((log) => {
      // Role constraint: Finance Admin sees only Payments module under Admin Audit
      if (currentRole === 'Finance Admin' && activeTab === 'Admin Audit') {
        if (log.module !== 'Payments' && log.module !== 'Settlements' && log.module !== 'Finance') {
          return false;
        }
      }

      // Tab filters
      if (activeTab === 'Payment') {
        const isFinanceModule = log.module === 'Payments' || log.module === 'Settlements' || log.module === 'Finance';
        const isFinanceAdmin = log.admin.role.toLowerCase().includes('finance');
        const isFinanceAction =
          log.details.toLowerCase().includes('payout') ||
          log.details.toLowerCase().includes('refund') ||
          log.details.toLowerCase().includes('settlement') ||
          log.details.toLowerCase().includes('commission') ||
          log.details.toLowerCase().includes('gst') ||
          log.details.toLowerCase().includes('wallet') ||
          log.details.toLowerCase().includes('coupon') ||
          log.details.toLowerCase().includes('₹') ||
          log.target.startsWith('TXN-') ||
          log.target.startsWith('COMM-') ||
          log.target.startsWith('RDR-PAY') ||
          log.target.startsWith('TAX-') ||
          log.target.startsWith('DEP-');
        if (!isFinanceModule && !isFinanceAdmin && !isFinanceAction) return false;
      }
      if (activeTab === 'Order') {
        if (log.module !== 'Orders' && !log.target.startsWith('#FK-')) return false;
      }
      if (activeTab === 'Security' && log.module !== 'Security' && log.module !== 'Settings' && log.action !== 'Login') return false;
      if (activeTab === 'User Activity' && log.module !== 'Users' && log.module !== 'Vendors' && log.module !== 'Riders') return false;

      // Dropdown filters
      if (selectedModule !== 'All' && log.module !== selectedModule) return false;
      if (selectedAction !== 'All' && log.action !== selectedAction) return false;
      if (selectedAdmin !== 'All' && log.admin.name !== selectedAdmin) return false;

      if (search.trim()) {
        const q = search.toLowerCase().trim();
        const matchesTarget = log.target.toLowerCase().includes(q);
        const matchesDetail = log.details.toLowerCase().includes(q);
        const matchesAdmin = log.admin.name.toLowerCase().includes(q);
        const matchesIp = log.ip.toLowerCase().includes(q);
        if (!matchesTarget && !matchesDetail && !matchesAdmin && !matchesIp) return false;
      }

      return true;
    });
  }, [auditLogs, activeTab, selectedModule, selectedAction, selectedAdmin, search, currentRole]);

  // Filtered API logs
  const filteredApiLogs = useMemo(() => {
    return apiLogs.filter((log) => {
      if (selectedMethod !== 'All' && log.method !== selectedMethod) return false;
      if (selectedStatusCode !== 'All') {
        if (selectedStatusCode === '2xx' && (log.statusCode < 200 || log.statusCode >= 300)) return false;
        if (selectedStatusCode === '4xx' && (log.statusCode < 400 || log.statusCode >= 500)) return false;
        if (selectedStatusCode === '5xx' && log.statusCode < 500) return false;
      }
      if (search.trim()) {
        const q = search.toLowerCase().trim();
        const matchesEndpoint = log.endpoint.toLowerCase().includes(q);
        const matchesUser = log.userOrAdmin.toLowerCase().includes(q);
        const matchesIp = log.ip.toLowerCase().includes(q);
        const matchesReq = log.requestId.toLowerCase().includes(q);
        const matchesErr = (log.errorMessage || '').toLowerCase().includes(q);
        if (!matchesEndpoint && !matchesUser && !matchesIp && !matchesReq && !matchesErr) return false;
      }
      return true;
    });
  }, [apiLogs, selectedMethod, selectedStatusCode, search]);

  const isApiTab = activeTab === 'API';
  const totalItems = isApiTab ? filteredApiLogs.length : filteredAuditLogs.length;
  const totalPages = Math.max(1, Math.ceil(totalItems / pageSize));

  const paginatedLogs = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredAuditLogs.slice(start, start + pageSize);
  }, [filteredAuditLogs, currentPage, pageSize]);

  const paginatedApiLogs = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredApiLogs.slice(start, start + pageSize);
  }, [filteredApiLogs, currentPage, pageSize]);

  const toggleRow = (id: string) => {
    setExpandedRowId((prev) => (prev === id ? null : id));
  };

  const getActionBadgeClass = (action: AuditAction) => {
    switch (action) {
      case 'Create':
        return 'bg-primary text-white border-transparent';
      case 'Update':
        return 'bg-secondary text-white border-transparent';
      case 'Approve':
        return 'bg-primary text-white border-transparent';
      case 'Suspend':
        return 'bg-black text-white border-transparent';
      case 'Delete':
        return 'bg-secondary/18 text-primary border border-secondary/35';
      case 'Login':
        return 'bg-white text-primary border border-primary';
      default:
        return 'bg-neutral text-primary';
    }
  };

  const getMethodBadgeClass = (method: string) => {
    switch (method) {
      case 'GET':
        return 'bg-neutral text-primary border border-primary/20';
      case 'POST':
        return 'bg-primary text-white';
      case 'PATCH':
        return 'bg-secondary text-white';
      case 'PUT':
        return 'bg-primary/80 text-white';
      case 'DELETE':
        return 'bg-white text-primary border border-primary font-bold';
      default:
        return 'bg-neutral text-primary';
    }
  };

  const handleExportCSV = () => {
    if (isApiTab) {
      const headers = ['Request ID', 'Timestamp', 'Method', 'Endpoint', 'Status Code', 'Latency (ms)', 'User / Admin', 'IP', 'Error Code', 'Error Message', 'Browser'];
      const rows = filteredApiLogs.map((l) => [
        l.requestId,
        `"${l.timestamp}"`,
        l.method,
        `"${l.endpoint}"`,
        l.statusCode,
        l.latencyMs,
        `"${l.userOrAdmin}"`,
        l.ip,
        `"${l.errorCode || ''}"`,
        `"${(l.errorMessage || '').replace(/"/g, '""')}"`,
        `"${l.browser}"`,
      ]);
      const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
      const encodedUri = encodeURI(csvContent);
      const link = document.createElement('a');
      link.setAttribute('href', encodedUri);
      link.setAttribute('download', `fillkart_api_logs_${Date.now()}.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } else {
      const headers = ['Log ID', 'Timestamp', 'Admin Name', 'Admin Role', 'Action', 'Module', 'Target', 'Details', 'IP Address', 'Browser'];
      const rows = filteredAuditLogs.map((l) => [
        l.id,
        `"${l.timestamp}"`,
        `"${l.admin.name}"`,
        l.admin.role,
        l.action,
        l.module,
        `"${l.target}"`,
        `"${l.details.replace(/"/g, '""')}"`,
        l.ip,
        `"${l.browser}"`,
      ]);
      const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
      const encodedUri = encodeURI(csvContent);
      const link = document.createElement('a');
      link.setAttribute('href', encodedUri);
      link.setAttribute('download', `fillkart_${activeTab.toLowerCase().replace(/\s+/g, '_')}_trail_${Date.now()}.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  const resetFilters = () => {
    setSearch('');
    setSelectedModule('All');
    setSelectedAction('All');
    setSelectedAdmin('All');
    setSelectedMethod('All');
    setSelectedStatusCode('All');
    setCurrentPage(1);
  };

  const retentionText = `Retained for ${RETENTION_DAYS[activeTab]} days`;

  return (
    <div className="space-y-5 pb-12">
      {/* 0. Top Bar: Tabs + Retention Note Badge */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        {/* Navigation Tabs in exact required order */}
        <div className="p-1 rounded-full bg-neutral border border-primary/10 flex items-center gap-1 overflow-x-auto no-scrollbar max-w-full w-full sm:w-auto min-w-0 scroll-smooth [scroll-snap-type:x_proximity]">
          {allowedTabs.map((tab) => {
            const isActive = activeTab === tab;
            return (
              <button
                key={tab}
                ref={isActive ? activeTabRef : null}
                onClick={() => {
                  setActiveTab(tab);
                  setSearchParams({ tab });
                  setCurrentPage(1);
                }}
                className={`px-[clamp(10px,2.5vw,14px)] py-[clamp(5px,1.5vw,6px)] rounded-full font-sans text-[clamp(11px,2.8vw,12px)] sm:text-xs font-medium transition-all whitespace-nowrap flex-shrink-0 scroll-snap-align-center ${
                  isActive
                    ? 'bg-primary text-white shadow-sm'
                    : 'text-ink/70 hover:text-ink hover:bg-white/60'
                }`}
              >
                {tab}
              </button>
            );
          })}
        </div>

        {/* Retention info pill */}
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white border border-primary/20 text-[11px] font-sans text-primary shadow-2xs">
          <Shield className="w-3.5 h-3.5 text-secondary" />
          <span className="font-medium">{retentionText}</span>
        </div>
      </div>

      {/* 1. Header Toolbar: Title + Retention Subtitle + Filters + Export */}
      <div className="p-4 rounded-[24px] bg-white border border-primary/10 shadow-[0_2px_8px_rgba(18,55,71,0.02)] space-y-3.5">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="font-heading text-lg font-normal text-ink">
              {activeTab === 'Payment'
                ? `Finance & Settlement Audit Trails (${filteredAuditLogs.length})`
                : activeTab === 'API'
                ? `API Gateway Request Logs (${filteredApiLogs.length})`
                : `${activeTab} Trails (${filteredAuditLogs.length})`}
            </h2>
            <p className="font-sans text-xs text-ink/60">
              {retentionText} • {activeTab === 'Payment'
                ? 'Immutable ledger of merchant settlements, payouts, refunds, GST slabs & escrow reconciliations'
                : activeTab === 'API'
                ? 'Incoming and outbound administrative API transactions, status codes, latency and failure payloads'
                : 'Immutable append-only ledger of all platform administrative activities'}
            </p>
          </div>

          <button
            onClick={handleExportCSV}
            className="px-4 py-2 rounded-full bg-primary text-white font-sans text-xs font-medium hover:bg-primary/90 transition-colors shadow-sm flex items-center gap-1.5 focus:outline-none focus:ring-2 focus:ring-secondary"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export {isApiTab ? 'API Logs' : 'Audit Trail'} (CSV)</span>
          </button>
        </div>

        {/* Filters Row */}
        <div className="flex flex-wrap items-center gap-2.5 pt-1">
          {/* Search */}
          <div className="relative flex-1 min-w-[220px] max-w-sm">
            <Search className="w-4 h-4 text-ink/40 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder={isApiTab ? "Search endpoint, user, IP, request ID..." : "Search target, action details, IP, admin..."}
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full pl-9 pr-3 py-1.5 rounded-full border border-primary/15 bg-neutral/40 font-sans text-xs text-ink focus:outline-none focus:ring-2 focus:ring-secondary focus:bg-white transition-all"
            />
          </div>

          {isApiTab ? (
            <>
              {/* HTTP Method Filter */}
              <CustomSelect
                value={selectedMethod}
                onChange={(e) => {
                  setSelectedMethod(e.target.value);
                  setCurrentPage(1);
                }}
                className="px-3 py-1.5 rounded-full border border-primary/15 bg-neutral/40 font-sans text-xs text-ink focus:outline-none focus:ring-2 focus:ring-secondary"
              >
                <option value="All">All Methods</option>
                <option value="GET">GET</option>
                <option value="POST">POST</option>
                <option value="PATCH">PATCH</option>
                <option value="PUT">PUT</option>
                <option value="DELETE">DELETE</option>
              </CustomSelect>

              {/* Status Code Filter */}
              <CustomSelect
                value={selectedStatusCode}
                onChange={(e) => {
                  setSelectedStatusCode(e.target.value);
                  setCurrentPage(1);
                }}
                className="px-3 py-1.5 rounded-full border border-primary/15 bg-neutral/40 font-sans text-xs text-ink focus:outline-none focus:ring-2 focus:ring-secondary"
              >
                <option value="All">All Status Codes</option>
                <option value="2xx">2xx Success</option>
                <option value="4xx">4xx Client Error</option>
                <option value="5xx">5xx Server Error</option>
              </CustomSelect>
            </>
          ) : (
            <>
              {/* Module Filter (hidden/locked if Finance Admin) */}
              {currentRole !== 'Finance Admin' && (
                <CustomSelect
                  value={selectedModule}
                  onChange={(e) => {
                    setSelectedModule(e.target.value);
                    setCurrentPage(1);
                  }}
                  className="px-3 py-1.5 rounded-full border border-primary/15 bg-neutral/40 font-sans text-xs text-ink focus:outline-none focus:ring-2 focus:ring-secondary"
                >
                  <option value="All">All Modules</option>
                  {moduleNames.map((m) => (
                    <option key={m} value={m}>
                      {m}
                    </option>
                  ))}
                </CustomSelect>
              )}

              {/* Action Filter */}
              <CustomSelect
                value={selectedAction}
                onChange={(e) => {
                  setSelectedAction(e.target.value);
                  setCurrentPage(1);
                }}
                className="px-3 py-1.5 rounded-full border border-primary/15 bg-neutral/40 font-sans text-xs text-ink focus:outline-none focus:ring-2 focus:ring-secondary"
              >
                <option value="All">All Actions</option>
                {(['Create', 'Update', 'Delete', 'Approve', 'Suspend', 'Login'] as AuditAction[]).map(
                  (a) => (
                    <option key={a} value={a}>
                      {a}
                    </option>
                  )
                )}
              </CustomSelect>

              {/* Admin Filter */}
              <CustomSelect
                value={selectedAdmin}
                onChange={(e) => {
                  setSelectedAdmin(e.target.value);
                  setCurrentPage(1);
                }}
                className="px-3 py-1.5 rounded-full border border-primary/15 bg-neutral/40 font-sans text-xs text-ink focus:outline-none focus:ring-2 focus:ring-secondary"
              >
                <option value="All">All Admins</option>
                {adminNames.map((adm) => (
                  <option key={adm} value={adm}>
                    {adm}
                  </option>
                ))}
              </CustomSelect>
            </>
          )}

          {(search ||
            selectedModule !== 'All' ||
            selectedAction !== 'All' ||
            selectedAdmin !== 'All' ||
            selectedMethod !== 'All' ||
            selectedStatusCode !== 'All') && (
            <button
              onClick={resetFilters}
              className="px-3 py-1.5 rounded-full border border-primary/20 text-ink/75 hover:bg-neutral font-sans text-xs font-medium flex items-center gap-1.5 transition-colors"
            >
              <RotateCcw className="w-3 h-3" />
              <span>Reset</span>
            </button>
          )}
        </div>
      </div>

      {/* 2. Audit Log Rows (Accordion on click) */}
      <div className="space-y-2.5">
        {isApiTab ? (
          // ── API TAB ROWS ──
          paginatedApiLogs.length === 0 ? (
            <div className="p-12 text-center rounded-[20px] bg-white border border-primary/10">
              <Code2 className="w-10 h-10 text-primary/30 mx-auto mb-2" />
              <h4 className="font-heading text-base font-normal text-ink">No API logs match your filter</h4>
              <p className="font-sans text-xs text-ink/50 mt-1">Try resetting your filter parameters</p>
            </div>
          ) : (
            paginatedApiLogs.map((log) => {
              const isExpanded = expandedRowId === log.id;
              const is2xx = log.statusCode >= 200 && log.statusCode < 300;

              return (
                <div
                  key={log.id}
                  className={`w-full rounded-[20px] bg-white border transition-all duration-200 select-none overflow-hidden ${
                    isExpanded
                      ? 'border-secondary shadow-[0_4px_16px_rgba(18,55,71,0.06)]'
                      : 'border-primary/10 shadow-[0_2px_8px_rgba(18,55,71,0.03)] hover:border-secondary hover:bg-neutral/20'
                  }`}
                >
                  {/* Header Row: time | method badge | endpoint | status code badge | latency (ms) | user / admin | IP */}
                  <div
                    onClick={() => toggleRow(log.id)}
                    className="p-[12px_18px] cursor-pointer grid grid-cols-[1fr_auto] min-[1280px]:grid-cols-[160px_90px_minmax(180px,2fr)_80px_90px_160px_110px_32px] gap-3 items-center"
                  >
                    {/* Time */}
                    <div>
                      <span className="font-sans text-xs font-medium text-ink block leading-tight">
                        {log.timestamp}
                      </span>
                      <span className="font-sans text-[10px] text-ink/50 block mt-0.5 font-mono">
                        {log.requestId}
                      </span>
                    </div>

                    {/* Method badge */}
                    <div>
                      <span
                        className={`inline-flex items-center px-2 py-0.5 rounded-full font-mono text-[10px] font-semibold leading-none ${getMethodBadgeClass(
                          log.method
                        )}`}
                      >
                        {log.method}
                      </span>
                    </div>

                    {/* Endpoint */}
                    <div className="min-w-0">
                      <span className="font-mono text-xs font-medium text-primary block truncate">
                        {log.endpoint}
                      </span>
                    </div>

                    {/* Status Code badge (2xx PRIMARY, 4xx/5xx white + 1px PRIMARY border) */}
                    <div>
                      <span
                        className={`inline-flex items-center justify-center min-w-[50px] px-2 py-0.5 rounded-full font-mono text-[11px] font-semibold leading-none ${
                          is2xx
                            ? 'bg-primary text-white shadow-2xs'
                            : 'bg-white text-primary border border-primary shadow-2xs'
                        }`}
                      >
                        {log.statusCode}
                      </span>
                    </div>

                    {/* Latency (ms) */}
                    <div>
                      <span className="font-sans text-xs text-ink/70 font-medium">
                        {log.latencyMs} ms
                      </span>
                    </div>

                    {/* User / Admin */}
                    <div className="hidden min-[1280px]:block min-w-0">
                      <span className="font-sans text-xs text-ink truncate block">
                        {log.userOrAdmin}
                      </span>
                    </div>

                    {/* IP */}
                    <div className="hidden min-[1280px]:block">
                      <span className="font-mono text-[11px] text-ink/60">
                        {log.ip}
                      </span>
                    </div>

                    {/* Chevron */}
                    <div className="flex justify-end text-ink/50">
                      {isExpanded ? (
                        <ChevronUp className="w-4 h-4 text-primary" />
                      ) : (
                        <ChevronDown className="w-4 h-4" />
                      )}
                    </div>
                  </div>

                  {/* Expanded Accordion Body: request id, error code and message, browser */}
                  {isExpanded && (
                    <div className="px-5 pb-5 pt-2 border-t border-primary/10 bg-neutral/20 space-y-3 animate-in fade-in">
                      {log.errorCode && (
                        <div className="p-3.5 rounded-2xl bg-white border border-primary/30 flex items-start gap-2.5 shadow-2xs">
                          <AlertTriangle className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
                          <div className="space-y-0.5">
                            <span className="font-mono text-xs font-bold text-primary block">
                              [{log.errorCode}] {log.errorMessage}
                            </span>
                            <span className="font-sans text-[11px] text-ink/60 block">
                              Request was rejected by upstream security gate or runtime validation layer.
                            </span>
                          </div>
                        </div>
                      )}

                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                        <div className="p-3 rounded-xl bg-white border border-primary/10 space-y-1">
                          <div className="flex items-center gap-1.5 text-ink/60 text-[11px] font-medium">
                            <Code2 className="w-3.5 h-3.5 text-primary" />
                            <span>Request Trace ID</span>
                          </div>
                          <p className="font-mono text-xs font-medium text-primary select-all">{log.requestId}</p>
                          <p className="font-sans text-[10px] text-ink/50">Distributed trace token</p>
                        </div>

                        <div className="p-3 rounded-xl bg-white border border-primary/10 space-y-1">
                          <div className="flex items-center gap-1.5 text-ink/60 text-[11px] font-medium">
                            <Network className="w-3.5 h-3.5 text-secondary" />
                            <span>Client Network IP</span>
                          </div>
                          <p className="font-mono text-xs font-medium text-ink">{log.ip}</p>
                          <p className="font-sans text-[10px] text-ink/50">Gateway ingress interface</p>
                        </div>

                        <div className="p-3 rounded-xl bg-white border border-primary/10 space-y-1">
                          <div className="flex items-center gap-1.5 text-ink/60 text-[11px] font-medium">
                            <Laptop className="w-3.5 h-3.5 text-primary" />
                            <span>User Agent / Browser</span>
                          </div>
                          <p className="font-sans text-xs font-medium text-ink truncate">{log.browser}</p>
                          <p className="font-sans text-[10px] text-ink/50">Authenticated client TLS</p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              );
            })
          )
        ) : (
          // ── STANDARD AUDIT TRAIL ROWS ──
          paginatedLogs.length === 0 ? (
            <div className="p-12 text-center rounded-[20px] bg-white border border-primary/10">
              <History className="w-10 h-10 text-primary/30 mx-auto mb-2" />
              <h4 className="font-heading text-base font-normal text-ink">No audit records found</h4>
              <p className="font-sans text-xs text-ink/50 mt-1">Try resetting your filter parameters</p>
            </div>
          ) : (
            paginatedLogs.map((log) => {
              const isExpanded = expandedRowId === log.id;

              return (
                <div
                  key={log.id}
                  className={`w-full rounded-[20px] bg-white border transition-all duration-200 select-none overflow-hidden ${
                    isExpanded
                      ? 'border-secondary shadow-[0_4px_16px_rgba(18,55,71,0.06)]'
                      : 'border-primary/10 shadow-[0_2px_8px_rgba(18,55,71,0.03)] hover:border-secondary hover:bg-neutral/20'
                  }`}
                >
                  {/* Header Row */}
                  <div
                    onClick={() => toggleRow(log.id)}
                    className="p-[12px_18px] cursor-pointer grid grid-cols-[1fr_auto] min-[1280px]:grid-cols-[160px_160px_100px_130px_minmax(180px,2fr)_36px] gap-3 items-center"
                  >
                    {/* Col 1: Time */}
                    <div>
                      <span className="font-sans text-xs font-medium text-ink block leading-tight">
                        {log.timestamp}
                      </span>
                      <span className="font-sans text-[10px] text-ink/50 block mt-0.5">
                        {log.id}
                      </span>
                    </div>

                    {/* Col 2: Admin */}
                    <div className="hidden min-[1280px]:block min-w-0">
                      <span className="font-sans text-xs font-medium text-ink block truncate leading-tight">
                        {log.admin.name}
                      </span>
                      <span className="font-sans text-[10px] text-primary/80 font-medium block mt-0.5 truncate">
                        {log.admin.role}
                      </span>
                    </div>

                    {/* Col 3: Action Badge */}
                    <div className="flex items-center justify-start">
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full font-sans text-[10px] font-medium leading-none ${getActionBadgeClass(
                          log.action
                        )}`}
                      >
                        {log.action}
                      </span>
                    </div>

                    {/* Col 4: Module */}
                    <div className="hidden min-[1280px]:block">
                      <span className="px-2 py-0.5 rounded-md bg-neutral text-ink/80 font-sans text-[11px] font-medium border border-primary/10 whitespace-nowrap">
                        {log.module}
                      </span>
                    </div>

                    {/* Col 5: Target & Detail */}
                    <div className="min-w-0">
                      <div className="flex items-center gap-2 truncate">
                        <strong className="font-sans text-xs font-medium text-primary flex-shrink-0">
                          {log.target}
                        </strong>
                        <span className="font-sans text-xs text-ink/75 truncate hidden sm:inline">
                          — {log.details}
                        </span>
                      </div>
                    </div>

                    {/* Col 6: Expand Chevron */}
                    <div className="flex justify-end text-ink/50">
                      {isExpanded ? (
                        <ChevronUp className="w-4 h-4 text-primary" />
                      ) : (
                        <ChevronDown className="w-4 h-4" />
                      )}
                    </div>
                  </div>

                  {/* Expanded Accordion Body */}
                  {isExpanded && (
                    <div className="px-5 pb-5 pt-1 border-t border-primary/10 bg-neutral/20 space-y-3.5 animate-in fade-in">
                      <div className="p-3.5 rounded-2xl bg-white border border-primary/10 space-y-2">
                        <div className="flex items-center gap-2">
                          <Shield className="w-4 h-4 text-primary" />
                          <h4 className="font-sans text-xs font-medium text-ink">Action Overview</h4>
                        </div>
                        <p className="font-sans text-xs text-ink leading-relaxed">{log.details}</p>
                      </div>

                      {/* Metadata Grid */}
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                        <div className="p-3 rounded-xl bg-white border border-primary/10 space-y-1">
                          <div className="flex items-center gap-1.5 text-ink/60 text-[11px] font-medium">
                            <User className="w-3.5 h-3.5 text-primary" />
                            <span>Admin Identity</span>
                          </div>
                          <p className="font-sans text-xs font-medium text-ink">{log.admin.name}</p>
                          <p className="font-sans text-[11px] text-ink/60">{log.admin.email}</p>
                        </div>

                        <div className="p-3 rounded-xl bg-white border border-primary/10 space-y-1">
                          <div className="flex items-center gap-1.5 text-ink/60 text-[11px] font-medium">
                            <Network className="w-3.5 h-3.5 text-secondary" />
                            <span>Network Address</span>
                          </div>
                          <p className="font-sans text-xs font-medium text-ink">{log.ip}</p>
                          <p className="font-sans text-[11px] text-ink/60">Internal Ops Gateway</p>
                        </div>

                        <div className="p-3 rounded-xl bg-white border border-primary/10 space-y-1">
                          <div className="flex items-center gap-1.5 text-ink/60 text-[11px] font-medium">
                            <Laptop className="w-3.5 h-3.5 text-primary" />
                            <span>Client Environment</span>
                          </div>
                          <p className="font-sans text-xs font-medium text-ink truncate">{log.browser}</p>
                          <p className="font-sans text-[11px] text-ink/60">Verified TLS Session</p>
                        </div>
                      </div>

                      {/* Before-to-After Diff Table (if update) */}
                      {log.diff && log.diff.length > 0 && (
                        <div className="border border-primary/10 rounded-xl overflow-hidden bg-white">
                          <div className="p-2.5 bg-neutral/60 border-b border-primary/10 font-sans text-[11px] font-medium text-ink">
                            State Mutation Diff (Before → After)
                          </div>
                          <table className="w-full text-left text-xs font-sans">
                            <thead>
                              <tr className="border-b border-primary/5 text-ink/60 text-[10px]">
                                <th className="py-2 px-3">Field</th>
                                <th className="py-2 px-3">Before Value</th>
                                <th className="py-2 px-3">Mutated Value</th>
                              </tr>
                            </thead>
                            <tbody>
                              {log.diff.map((d, i) => (
                                <tr key={i} className="border-b border-primary/5 last:border-b-0">
                                  <td className="py-2 px-3 font-medium text-primary">{d.field}</td>
                                  <td className="py-2 px-3 text-ink/60 line-through">{d.before}</td>
                                  <td className="py-2 px-3 text-secondary font-medium">{d.after}</td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })
          ))}
      </div>

      {/* 3. Pagination Controls */}
      {totalPages > 1 && (
        <div className="p-3 rounded-2xl bg-white border border-primary/10 flex flex-wrap items-center justify-between gap-3 text-xs font-sans">
          <div className="text-ink/60 text-[11px]">
            Showing {(currentPage - 1) * pageSize + 1} to{' '}
            {Math.min(currentPage * pageSize, totalItems)} of {totalItems} entries
          </div>

          <div className="flex items-center gap-1">
            <button
              onClick={() => setCurrentPage(1)}
              disabled={currentPage === 1}
              className="p-1.5 rounded-lg border border-primary/10 hover:bg-neutral disabled:opacity-40 disabled:cursor-not-allowed text-ink"
              title="First Page"
            >
              <ChevronsLeft className="w-4 h-4" />
            </button>
            <button
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="p-1.5 rounded-lg border border-primary/10 hover:bg-neutral disabled:opacity-40 disabled:cursor-not-allowed text-ink"
              title="Previous Page"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>

            <span className="px-3 py-1 text-primary font-medium text-xs">
              Page {currentPage} of {totalPages}
            </span>

            <button
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="p-1.5 rounded-lg border border-primary/10 hover:bg-neutral disabled:opacity-40 disabled:cursor-not-allowed text-ink"
              title="Next Page"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
            <button
              onClick={() => setCurrentPage(totalPages)}
              disabled={currentPage === totalPages}
              className="p-1.5 rounded-lg border border-primary/10 hover:bg-neutral disabled:opacity-40 disabled:cursor-not-allowed text-ink"
              title="Last Page"
            >
              <ChevronsRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
