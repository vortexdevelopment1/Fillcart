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
    <div className="space-y-4 bg-white">
      {/* Back to Dashboard bar */}
      <div className="flex items-center justify-end">
        <button
          onClick={() => navigate('/')}
          className="flex items-center gap-1.5 px-4 py-2 rounded-full bg-white border border-primary/10 text-xs font-medium text-ink hover:bg-neutral shadow-sm transition-all"
        >
          <ArrowLeft className="w-3.5 h-3.5 text-ink" />
          <span>Back to Dashboard</span>
        </button>
      </div>

      {/* Clean Empty State Card */}
      <Card className="min-h-[420px] flex flex-col items-center justify-center text-center p-8">
        <div className="w-20 h-20 rounded-3xl bg-secondary border border-primary/10 flex items-center justify-center text-white mb-4 shadow-sm animate-pulse">
          <Icon className="w-10 h-10 text-white" />
        </div>

        <span className="px-3 py-1 rounded-full bg-secondary text-white text-xs font-bold mb-3 shadow-xs">
          Coming soon
        </span>

        <h3 className="text-xl font-bold text-ink tracking-tight">{title}</h3>

        <p className="text-sm text-ink/55 mt-2 max-w-md font-sans">
          This module will be built next
        </p>

        <div className="mt-8 pt-6 border-t border-primary/10 w-full max-w-sm flex items-center justify-center text-xs text-ink/55">
          Fillcart Unified Admin Platform • Milestone 2
        </div>
      </Card>
    </div>
  );
};
