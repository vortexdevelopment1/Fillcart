import React from 'react';
import { Card } from '../components/common/Card';
import { LucideIcon, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface PlaceholderPageProps {
  title: string;
  subtitle?: string;
  icon: LucideIcon;
}

export const PlaceholderPage: React.FC<PlaceholderPageProps> = ({
  title,
  subtitle = 'Enterprise Operations & Governance',
  icon: Icon,
}) => {
  const navigate = useNavigate();

  return (
    <div className="space-y-6 bg-white">
      {/* Title & Back Link */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-black tracking-tight">{title}</h2>
          <p className="text-sm text-black/55 mt-1">{subtitle}</p>
        </div>
        <button
          onClick={() => navigate('/')}
          className="flex items-center gap-1.5 px-4 py-2 rounded-2xl bg-white border border-black/[0.08] text-xs font-semibold text-black hover:bg-black/[0.03] shadow-sm transition-all"
        >
          <ArrowLeft className="w-4 h-4 text-black" />
          <span>Back to Dashboard</span>
        </button>
      </div>

      {/* Clean Empty State Card */}
      <Card className="min-h-[420px] flex flex-col items-center justify-center text-center p-8">
        <div className="w-20 h-20 rounded-3xl bg-secondary border border-black/[0.08] flex items-center justify-center text-black mb-4 shadow-sm animate-pulse">
          <Icon className="w-10 h-10 text-black" />
        </div>

        <span className="px-3 py-1 rounded-full bg-secondary text-black text-xs font-bold mb-3">
          Coming soon
        </span>

        <h3 className="text-xl font-bold text-black tracking-tight">{title}</h3>

        <p className="text-sm text-black/55 mt-2 max-w-md font-sans">
          This module will be built next
        </p>

        <div className="mt-8 pt-6 border-t border-black/[0.08] w-full max-w-sm flex items-center justify-center text-xs text-black/55">
          Fillcart Unified Admin Platform • Milestone 2
        </div>
      </Card>
    </div>
  );
};
