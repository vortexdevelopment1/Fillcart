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
    <header className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8 pt-2">
      {/* Left: Greeting & Subtitle (Arbutus Slab styling) */}
      <div>
        <h1 className="text-2xl md:text-3xl font-normal text-[#222026] tracking-tight">
          {greeting}, <span className="font-semibold">Admin</span>
        </h1>
        <p className="text-sm text-[#8A8A93] mt-1 font-sans">
          Your latest platform updates here
        </p>
      </div>

      {/* Right Controls: Search button, Sync Pill, Avatar */}
      <div className="flex items-center gap-3 self-end md:self-auto">
        {/* Search Icon Button */}
        <button
          className="w-11 h-11 rounded-full bg-white border border-[#ECECF0] flex items-center justify-center text-[#222026] hover:bg-[#F6F6F8] transition-colors shadow-sm focus:outline-none focus:ring-2 focus:ring-[#F5B800]"
          title="Search anything..."
          aria-label="Search"
        >
          <Search className="w-4 h-4 text-[#222026]" />
        </button>

        {/* Sync Pill: "Last sync / Just now" (Exact match to reference pill button) */}
        <button
          onClick={handleManualSync}
          className="h-11 px-4 rounded-full bg-white border border-[#ECECF0] flex items-center gap-2.5 shadow-sm hover:bg-[#F6F6F8] transition-all group focus:outline-none focus:ring-2 focus:ring-[#F5B800]"
          title="Click to sync operations state"
        >
          <RotateCw
            className={`w-4 h-4 text-[#8A8A93] group-hover:text-[#222026] transition-transform ${
              isSyncing ? 'animate-spin text-[#F5B800]' : ''
            }`}
          />
          <div className="text-left text-xs leading-tight">
            <span className="text-[#8A8A93] block text-[10px]">Last sync</span>
            <span className="text-[#222026] font-medium block">{lastSyncText}</span>
          </div>
        </button>

        {/* Round Avatar Profile */}
        <div className="relative pl-1">
          <img
            src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80"
            alt="Admin Profile"
            className="w-11 h-11 rounded-full object-cover border-2 border-white shadow-sm ring-1 ring-[#ECECF0]"
          />
          <span className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-500 rounded-full border-2 border-white" />
        </div>
      </div>
    </header>
  );
};
