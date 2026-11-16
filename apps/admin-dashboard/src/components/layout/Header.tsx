import React, { useState, useEffect } from 'react';
import { Search, RotateCw } from 'lucide-react';
import { useToast } from '../../context/ToastContext';

export const Header: React.FC = () => {
  const [greeting, setGreeting] = useState('Good Afternoon');
  const [isSyncing, setIsSyncing] = useState(false);
  const [lastSyncText, setLastSyncText] = useState('Just now');
  const { addToast } = useToast();

  useEffect(() => {
    const hour = new Date().getHours();
    if (hour < 12) {
      setGreeting('Good Morning');
    } else if (hour < 18) {
      setGreeting('Good Afternoon');
    } else {
      setGreeting('Good Evening');
    }
  }, []);

  const handleManualSync = () => {
    if (isSyncing) return;
    setIsSyncing(true);
    setLastSyncText('Syncing...');

    setTimeout(() => {
      setIsSyncing(false);
      setLastSyncText('Just now');
      addToast('info', 'Data Synchronized', 'All operations data refreshed from platform network.');
    }, 900);
  };

  return (
    <header className="flex items-center justify-between gap-4 mb-3.5 flex-shrink-0 pl-11 lg:pl-0">
      {/* Left: Greeting heading 32px, weight 400; subtitle 13px, muted (#000000 at 55%) */}
      <div>
        <h1 className="text-[32px] font-normal text-black tracking-tight leading-tight">
          {greeting}, <span className="font-normal">Sarah</span>
        </h1>
        <p className="text-[13px] text-black/55 mt-0.5 font-sans leading-none">
          Your latest platform updates here
        </p>
      </div>

      {/* Right Controls: Search button, Sync Pill, Avatar */}
      <div className="flex items-center gap-3">
        {/* Search Icon Button */}
        <button
          className="w-10 h-10 rounded-full bg-white border border-black/[0.08] flex items-center justify-center text-black hover:bg-black/[0.03] transition-colors shadow-sm focus:outline-none focus:ring-2 focus:ring-primary"
          title="Search anything..."
          aria-label="Search"
        >
          <Search className="w-4 h-4 text-black" />
        </button>

        {/* Sync Pill: "Last sync / Just now" */}
        <button
          onClick={handleManualSync}
          className="h-10 px-3.5 rounded-full bg-white border border-black/[0.08] flex items-center gap-2 shadow-sm hover:bg-black/[0.03] transition-all group focus:outline-none focus:ring-2 focus:ring-primary"
          title="Click to sync operations state"
        >
          <RotateCw
            className={`w-3.5 h-3.5 text-black/55 group-hover:text-black transition-transform ${
              isSyncing ? 'animate-spin text-primary' : ''
            }`}
          />
          <div className="text-left text-xs leading-none">
            <span className="text-black/55 block text-[9px] mb-0.5">Last sync</span>
            <span className="text-black font-medium block text-[11px]">{lastSyncText}</span>
          </div>
        </button>

        {/* Round Avatar Profile */}
        <div className="relative pl-1">
          <img
            src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80"
            alt="Sarah Profile"
            className="w-10 h-10 rounded-full object-cover border-2 border-white shadow-sm ring-1 ring-black/[0.08]"
          />
          <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-primary rounded-full border-2 border-white" />
        </div>
      </div>
    </header>
  );
};
