import React from 'react';
import { Link } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { AlertTriangle } from 'lucide-react';
import { PendingVerificationsCard } from '../components/charts/PendingVerificationsCard';
import { VendorsCard } from '../components/charts/VendorsCard';
import { RidersTallCard } from '../components/charts/RidersTallCard';
import { TopOrdersCard } from '../components/charts/TopOrdersCard';
import { ProductsDonutCard } from '../components/charts/ProductsDonutCard';
import { PaymentsCreditsCard } from '../components/charts/PaymentsCreditsCard';
import { BasicReportsDarkCard } from '../components/charts/BasicReportsDarkCard';
import { PlatformActivityCard } from '../components/charts/PlatformActivityCard';

export const HomePage: React.FC = () => {
  const { settings } = useApp();
  const isMaintenance = settings?.general?.maintenanceMode;

  return (
    <div className="w-full h-auto xl:h-full min-h-0 flex flex-col">
      {/* PRIMARY Maintenance Mode Banner */}
      {isMaintenance && (
        <div className="w-full bg-primary text-white px-5 py-3 rounded-2xl mb-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-sm border border-white/10 flex-shrink-0 animate-fadeIn">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-white/15 flex items-center justify-center flex-shrink-0 text-amber-300">
              <AlertTriangle className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
                <p className="font-semibold text-xs tracking-wider uppercase text-white/90">
                  Maintenance mode is ON
                </p>
              </div>
              <p className="text-[12px] text-white/80 mt-0.5">
                {settings.general.maintenanceMessage ||
                  'Platform is currently closed for customer ordering.'}
              </p>
            </div>
          </div>
          <Link
            to="/settings"
            className="text-xs bg-white/15 hover:bg-white/25 text-white font-medium px-4 py-1.5 rounded-full transition-colors whitespace-nowrap self-start sm:self-auto"
          >
            Configure Settings &rarr;
          </Link>
        </div>
      )}

      <div className="w-full flex-1 min-h-0 min-w-0 flex flex-col xl:grid xl:grid-cols-[minmax(0,1fr)_clamp(260px,24%,330px)] gap-3.5 md:gap-4 items-stretch h-auto xl:h-full">
        {/* ──────────────── LEFT COLUMN ────────────────
            Desktop (>=1280px): 2 equal columns, 3 rows (auto, auto, 1fr)
            Tablet (768-1279px): 2 columns
            Mobile (<768px): 1 column in-flow blocks */}
        <div className="flex flex-col md:grid md:grid-cols-2 md:grid-rows-[auto_auto_auto] xl:grid-rows-[auto_auto_1fr] gap-3.5 md:gap-4 h-auto xl:h-full min-h-0 min-w-0 items-stretch">
          {/* Row 1, Col 1: Pending Verifications (Total Users) */}
          <PendingVerificationsCard />

          {/* Row 1, Col 2: Vendors (Orders Today) */}
          <VendorsCard />

          {/* Row 2, Col 1: Top Contacts (Top Vendors) */}
          <TopOrdersCard />

          {/* Row 2, Col 2: Products & Categories Donut (Revenue split) */}
          <ProductsDonutCard />

          {/* Row 3, Col-Span 2: Platform Activity bar chart (Orders by Month) */}
          <div className="col-span-1 md:col-span-2 h-auto xl:h-full min-h-[240px] xl:min-h-0 min-w-0 flex flex-col">
            <PlatformActivityCard />
          </div>
        </div>

        {/* ──────────────── RIGHT COLUMN ────────────────
            Desktop (>=1280px): Flex column, height 100%, gap 16px.
            Tablet (768-1279px): 3-card horizontal grid row.
            Mobile (<768px): Stacks in one column (Riders, Commission, Revenue). */}
        <div className="flex flex-col md:grid md:grid-cols-3 xl:flex xl:flex-col gap-3.5 md:gap-4 h-auto xl:h-full min-h-0 min-w-0 items-stretch">
          {/* Riders gradient card */}
          <RidersTallCard />

          {/* Payments & Statements card (Commission) */}
          <PaymentsCreditsCard />

          {/* Basic Reports dark card (Revenue) */}
          <BasicReportsDarkCard />
        </div>
      </div>
    </div>
  );
};
