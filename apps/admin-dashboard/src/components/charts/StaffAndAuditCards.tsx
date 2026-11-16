import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card } from '../common/Card';
import { ShieldCheck, History, ArrowRight } from 'lucide-react';
import { auditLogsSample } from '../../data/mockDashboardData';

export const StaffCard: React.FC = () => {
  const navigate = useNavigate();

  return (
    <Card
      onClick={() => navigate('/staff')}
      title="Staff Roles & Access"
      className="flex flex-col justify-between"
    >
      <div className="flex items-center justify-between mb-4 mt-1">
        <div>
          <span className="text-2xl font-semibold text-black">14 Admins</span>
          <p className="text-xs text-black/55 mt-0.5">3 roles active across hubs</p>
        </div>
        <div className="w-10 h-10 rounded-2xl bg-secondary text-black flex items-center justify-center">
          <ShieldCheck className="w-5 h-5 text-black" />
        </div>
      </div>

      <div className="flex flex-wrap gap-2 text-xs">
        <span className="px-3 py-1 bg-white border border-black/[0.08] rounded-full text-black font-medium">
          Superadmin (2)
        </span>
        <span className="px-3 py-1 bg-white border border-black/[0.08] rounded-full text-black font-medium">
          Verification Ops (8)
        </span>
        <span className="px-3 py-1 bg-white border border-black/[0.08] rounded-full text-black font-medium">
          Finance Manager (4)
        </span>
      </div>

      <div className="mt-4 pt-3 border-t border-black/[0.08] flex items-center justify-between text-xs text-black font-semibold group">
        <span>Manage Permissions</span>
        <ArrowRight className="w-4 h-4 text-black group-hover:translate-x-1 transition-transform" />
      </div>
    </Card>
  );
};

export const AuditLogsCard: React.FC = () => {
  const navigate = useNavigate();

  return (
    <Card
      onClick={() => navigate('/audit-logs')}
      title="Audit Logs"
      className="flex flex-col justify-between"
    >
      <div className="space-y-3 mt-1">
        {auditLogsSample.map((log) => (
          <div key={log.id} className="flex items-start gap-3 text-xs">
            <img
              src={log.adminAvatar}
              alt={log.adminName}
              className="w-7 h-7 rounded-full object-cover ring-1 ring-black/[0.08] mt-0.5"
            />
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between">
                <span className="font-semibold text-black truncate">{log.adminName}</span>
                <span className="text-[10px] text-black/55">{log.timeAgo}</span>
              </div>
              <p className="text-black/55 truncate text-[11px] mt-0.5">
                <span className="text-black font-medium">{log.action}: </span>
                {log.target}
              </p>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-4 pt-3 border-t border-black/[0.08] flex items-center justify-between text-xs text-black/55 group hover:text-black">
        <div className="flex items-center gap-1.5">
          <History className="w-3.5 h-3.5" />
          <span>View all security events</span>
        </div>
        <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
      </div>
    </Card>
  );
};
