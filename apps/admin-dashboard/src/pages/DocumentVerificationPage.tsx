import React, { useState, useMemo } from 'react';
import {
  Search,
  ChevronDown,
  Filter,
  CheckCircle,
  XCircle,
  Clock,
  FileCheck2,
  Bike,
  Store,
  ChevronRight,
  ArrowUpDown,
} from 'lucide-react';
import { Card } from '../components/common/Card';
import { Badge } from '../components/common/Badge';
import { ApplicantDrawer } from '../components/verification/ApplicantDrawer';
import { useVerification } from '../context/VerificationContext';
import { Applicant, ApplicantType, VerificationStatus } from '../types';

export const DocumentVerificationPage: React.FC = () => {
  const { applicants, stats, selectedApplicant, setSelectedApplicant } = useVerification();

  // Tab: All | Riders | Vendors
  const [activeTab, setActiveTab] = useState<'All' | 'Riders' | 'Vendors'>('All');

  // Search & Filter state
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'All' | VerificationStatus>('All');
  const [dateFilter, setDateFilter] = useState('All Time');
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  // Filtered applicants
  const filteredApplicants = useMemo(() => {
    return applicants.filter((applicant) => {
      // Tab filter
      if (activeTab === 'Riders' && applicant.type !== 'Rider') return false;
      if (activeTab === 'Vendors' && applicant.type !== 'Vendor') return false;

      // Status filter
      if (statusFilter !== 'All') {
        if (statusFilter === 'Pending' && applicant.status !== 'Pending' && applicant.status !== 'Under Review') {
          return false;
        } else if (statusFilter !== 'Pending' && applicant.status !== statusFilter) {
          return false;
        }
      }

      // Search query filter (name, phone, city, id)
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const matchesName = applicant.name.toLowerCase().includes(query);
        const matchesCity = applicant.city.toLowerCase().includes(query);
        const matchesId = applicant.id.toLowerCase().includes(query);
        const matchesPhone = applicant.phone.includes(query);
        if (!matchesName && !matchesCity && !matchesId && !matchesPhone) return false;
      }

      return true;
    });
  }, [applicants, activeTab, statusFilter, searchQuery]);

  const handleOpenReview = (applicant: Applicant) => {
    setSelectedApplicant(applicant);
    setIsDrawerOpen(true);
  };

  const handleCloseReview = () => {
    setIsDrawerOpen(false);
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h2 className="text-2xl font-bold text-[#222026] tracking-tight">
          Document Verification
        </h2>
        <p className="text-sm text-[#8A8A93] mt-1">
          Review, approve, or reject mandatory regulatory compliance documents for onboarding partners
        </p>
      </div>

      {/* Top 4 Stat Cards in Exact Reference Card Style */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Submissions */}
        <Card className="p-5 flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold text-[#8A8A93] uppercase tracking-wider block">
              Total Submissions
            </span>
            <div className="text-3xl font-semibold text-[#222026] mt-1 tracking-tight">
              {stats.total}
            </div>
            <div className="mt-1">
              <Badge variant="soft-amber">Across India</Badge>
            </div>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-[#F6F6F8] border border-[#ECECF0] flex items-center justify-center text-[#222026]">
            <FileCheck2 className="w-6 h-6 text-[#222026]" />
          </div>
        </Card>

        {/* Pending Verifications */}
        <Card className="p-5 flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold text-[#8A8A93] uppercase tracking-wider block">
              Pending Review
            </span>
            <div className="text-3xl font-semibold text-[#F5B800] mt-1 tracking-tight">
              {stats.pending}
            </div>
            <div className="mt-1">
              <Badge variant="soft-amber">Urgent Queue</Badge>
            </div>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-[#FFF8E6] border border-[#FCE8A3] flex items-center justify-center text-[#F5B800]">
            <Clock className="w-6 h-6" />
          </div>
        </Card>

        {/* Approved Partners */}
        <Card className="p-5 flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold text-[#8A8A93] uppercase tracking-wider block">
              Approved
            </span>
            <div className="text-3xl font-semibold text-emerald-600 mt-1 tracking-tight">
              {stats.approved}
            </div>
            <div className="mt-1">
              <Badge variant="success">Active on app</Badge>
            </div>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-600">
            <CheckCircle className="w-6 h-6" />
          </div>
        </Card>

        {/* Rejected Documents */}
        <Card className="p-5 flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold text-[#8A8A93] uppercase tracking-wider block">
              Rejected / Non-Compliant
            </span>
            <div className="text-3xl font-semibold text-red-600 mt-1 tracking-tight">
              {stats.rejected}
            </div>
            <div className="mt-1">
              <Badge variant="danger">Re-upload needed</Badge>
            </div>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-red-50 border border-red-100 flex items-center justify-center text-red-600">
            <XCircle className="w-6 h-6" />
          </div>
        </Card>
      </div>

      {/* Main Table Card */}
      <Card className="p-6">
        {/* Controls Bar: Tab Pills + Search + Filters */}
        <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4 mb-6 pb-6 border-b border-[#ECECF0]">
          {/* Tab Pills: All | Riders | Vendors (Active = #F5B800) */}
          <div className="flex items-center gap-1.5 p-1 bg-[#F6F6F8] rounded-2xl border border-[#ECECF0] self-start">
            {(['All', 'Riders', 'Vendors'] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-5 py-2 rounded-xl text-xs font-bold transition-all duration-200 ${
                  activeTab === tab
                    ? 'bg-[#F5B800] text-[#222026] shadow-sm'
                    : 'text-[#8A8A93] hover:text-[#222026]'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          {/* Search Bar + Filters */}
          <div className="flex flex-wrap items-center gap-3">
            {/* Search Input */}
            <div className="relative flex-1 sm:w-64">
              <Search className="w-4 h-4 text-[#8A8A93] absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search by name, phone, city..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-[#F6F6F8] border border-[#ECECF0] rounded-full text-xs text-[#222026] placeholder-[#8A8A93] focus:outline-none focus:ring-2 focus:ring-[#F5B800] focus:bg-white transition-all"
              />
            </div>

            {/* Status Dropdown */}
            <div className="relative">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value as any)}
                className="appearance-none bg-[#F6F6F8] border border-[#ECECF0] rounded-full px-4 py-2 pr-8 text-xs font-medium text-[#222026] focus:outline-none focus:ring-2 focus:ring-[#F5B800] cursor-pointer"
              >
                <option value="All">All Statuses</option>
                <option value="Pending">Pending / Under Review</option>
                <option value="Approved">Approved</option>
                <option value="Rejected">Rejected</option>
              </select>
              <ChevronDown className="w-3.5 h-3.5 text-[#8A8A93] absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>

            {/* Date Range Dropdown */}
            <div className="relative hidden sm:block">
              <select
                value={dateFilter}
                onChange={(e) => setDateFilter(e.target.value)}
                className="appearance-none bg-[#F6F6F8] border border-[#ECECF0] rounded-full px-4 py-2 pr-8 text-xs font-medium text-[#222026] focus:outline-none focus:ring-2 focus:ring-[#F5B800] cursor-pointer"
              >
                <option value="All Time">All Time</option>
                <option value="Today">Today</option>
                <option value="This Week">This Week</option>
                <option value="This Month">This Month</option>
              </select>
              <ChevronDown className="w-3.5 h-3.5 text-[#8A8A93] absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>
          </div>
        </div>

        {/* Applicants Table */}
        <div className="overflow-x-auto no-scrollbar -mx-6 px-6">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-[#ECECF0] text-[#8A8A93] uppercase font-bold text-[10px] tracking-wider">
                <th className="py-3 px-3">Applicant</th>
                <th className="py-3 px-3">Partner Type</th>
                <th className="py-3 px-3">Location</th>
                <th className="py-3 px-3">Submitted Date</th>
                <th className="py-3 px-3">Documents</th>
                <th className="py-3 px-3">Status</th>
                <th className="py-3 px-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#ECECF0]">
              {filteredApplicants.length > 0 ? (
                filteredApplicants.map((applicant) => (
                  <tr
                    key={applicant.id}
                    className="hover:bg-[#F6F6F8]/60 transition-colors group"
                  >
                    {/* Name & Avatar */}
                    <td className="py-4 px-3">
                      <div className="flex items-center gap-3">
                        <img
                          src={applicant.avatar}
                          alt={applicant.name}
                          className="w-10 h-10 rounded-full object-cover ring-1 ring-[#ECECF0]"
                        />
                        <div>
                          <span className="font-bold text-[#222026] block text-sm group-hover:text-[#F5B800] transition-colors">
                            {applicant.name}
                          </span>
                          <span className="text-[#8A8A93] text-[11px] font-mono">
                            {applicant.phone}
                          </span>
                        </div>
                      </div>
                    </td>

                    {/* Partner Type Badge */}
                    <td className="py-4 px-3">
                      <span
                        className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full font-semibold text-[11px] ${
                          applicant.type === 'Rider'
                            ? 'bg-[#FCE8A3] text-[#8A6500]'
                            : 'bg-[#222026] text-white'
                        }`}
                      >
                        {applicant.type === 'Rider' ? (
                          <Bike className="w-3 h-3" />
                        ) : (
                          <Store className="w-3 h-3" />
                        )}
                        {applicant.type}
                      </span>
                    </td>

                    {/* City & State */}
                    <td className="py-4 px-3">
                      <span className="font-semibold text-[#222026] block">{applicant.city}</span>
                      <span className="text-[#8A8A93] text-[11px]">{applicant.state}</span>
                    </td>

                    {/* Submitted Date */}
                    <td className="py-4 px-3 text-[#63636E] font-medium">
                      {applicant.submittedAt}
                    </td>

                    {/* Documents Count with Mini Badges */}
                    <td className="py-4 px-3">
                      <div className="flex items-center gap-1.5">
                        <span className="font-bold text-[#222026]">
                          {applicant.documents.filter((d) => d.status === 'Approved').length} /{' '}
                          {applicant.documents.length}
                        </span>
                        <span className="text-[10px] text-[#8A8A93]">approved</span>
                      </div>
                    </td>

                    {/* Overall Status Badge */}
                    <td className="py-4 px-3">
                      <span
                        className={`inline-flex items-center gap-1 px-3 py-1 rounded-full font-semibold text-xs ${
                          applicant.status === 'Approved'
                            ? 'bg-emerald-100 text-emerald-800'
                            : applicant.status === 'Rejected'
                            ? 'bg-red-100 text-red-800'
                            : 'bg-[#FCE8A3] text-[#8A6500]'
                        }`}
                      >
                        {applicant.status === 'Approved' && <CheckCircle className="w-3 h-3" />}
                        {applicant.status === 'Rejected' && <XCircle className="w-3 h-3" />}
                        {(applicant.status === 'Pending' || applicant.status === 'Under Review') && (
                          <Clock className="w-3 h-3" />
                        )}
                        {applicant.status}
                      </span>
                    </td>

                    {/* Review Button */}
                    <td className="py-4 px-3 text-right">
                      <button
                        onClick={() => handleOpenReview(applicant)}
                        className="inline-flex items-center gap-1 px-4 py-2 bg-[#222026] hover:bg-[#F5B800] hover:text-[#222026] text-white font-semibold rounded-xl transition-all shadow-sm group-hover:scale-105"
                      >
                        <span>Review</span>
                        <ChevronRight className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                /* Empty state when no results match search/filter */
                <tr>
                  <td colSpan={7} className="py-12 text-center">
                    <div className="flex flex-col items-center justify-center text-[#8A8A93]">
                      <div className="w-14 h-14 rounded-2xl bg-[#F6F6F8] flex items-center justify-center mb-3 text-[#C4C4CC]">
                        <Search className="w-7 h-7" />
                      </div>
                      <h4 className="text-base font-semibold text-[#222026]">
                        No matching applicants found
                      </h4>
                      <p className="text-xs text-[#8A8A93] mt-1 max-w-sm">
                        Try adjusting your search terms or filters (e.g. changing tab or status filter)
                      </p>
                      <button
                        onClick={() => {
                          setSearchQuery('');
                          setStatusFilter('All');
                          setActiveTab('All');
                        }}
                        className="mt-4 px-4 py-2 rounded-xl bg-[#F6F6F8] text-[#222026] font-semibold text-xs hover:bg-[#ECECF0]"
                      >
                        Reset Filters
                      </button>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Footer info & pagination */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 mt-6 pt-4 border-t border-[#ECECF0] text-xs text-[#8A8A93]">
          <div>
            Showing <span className="font-semibold text-[#222026]">{filteredApplicants.length}</span>{' '}
            of <span className="font-semibold text-[#222026]">{applicants.length}</span> applicants
          </div>
          <div className="flex items-center gap-1">
            <button className="px-3 py-1.5 rounded-lg border border-[#ECECF0] hover:bg-[#F6F6F8] text-[#222026] font-medium disabled:opacity-40">
              Previous
            </button>
            <span className="px-3 py-1.5 rounded-lg bg-[#222026] text-white font-bold">1</span>
            <button className="px-3 py-1.5 rounded-lg border border-[#ECECF0] hover:bg-[#F6F6F8] text-[#222026] font-medium">
              Next
            </button>
          </div>
        </div>
      </Card>

      {/* Review Drawer Modal */}
      <ApplicantDrawer
        applicant={selectedApplicant}
        isOpen={isDrawerOpen}
        onClose={handleCloseReview}
      />
    </div>
  );
};
