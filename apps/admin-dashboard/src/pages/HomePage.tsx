import React from 'react';
import { PendingVerificationsCard } from '../components/charts/PendingVerificationsCard';
import { VendorsCard } from '../components/charts/VendorsCard';
import { RidersTallCard } from '../components/charts/RidersTallCard';
import { TopOrdersCard } from '../components/charts/TopOrdersCard';
import { ProductsDonutCard } from '../components/charts/ProductsDonutCard';
import { PaymentsCreditsCard } from '../components/charts/PaymentsCreditsCard';
import { BasicReportsDarkCard } from '../components/charts/BasicReportsDarkCard';
import { PlatformActivityCard } from '../components/charts/PlatformActivityCard';

export const HomePage: React.FC = () => {
  return (
    <div className="w-full h-full min-h-0 grid grid-cols-1 xl:grid-cols-[minmax(0,1fr)_clamp(240px,24%,330px)] gap-4">
      {/* ──────────────── LEFT COLUMN ────────────────
          Nested grid: 2 equal columns, 3 rows (auto, auto, 1fr)
          Row 3 (Platform Activity) takes all remaining vertical space */}
      <div className="grid grid-cols-1 sm:grid-cols-2 grid-rows-[auto_auto_1fr] gap-4 h-full min-h-0">
        {/* Row 1, Col 1: Pending Verifications (Delivery Rate) */}
        <PendingVerificationsCard />

        {/* Row 1, Col 2: Vendors (Campaigns) */}
        <VendorsCard />

        {/* Row 2, Col 1: Top Contacts (Orders by Store) */}
        <TopOrdersCard />

        {/* Row 2, Col 2: Products & Categories Donut */}
        <ProductsDonutCard />

        {/* Row 3, Col-Span 2: Platform Activity bar chart (ONLY under the left 2 columns) */}
        <div className="col-span-1 sm:col-span-2 h-full min-h-[240px] xl:min-h-0 flex flex-col">
          <PlatformActivityCard />
        </div>
      </div>

      {/* ──────────────── RIGHT COLUMN ────────────────
          Desktop (>=1280px): Flex column, height 100%, gap 16px.
          Tablet (768-1279px): 3-card horizontal grid row.
          Mobile (<768px): Stacks in one column. */}
      <div className="grid grid-cols-1 md:grid-cols-3 xl:flex xl:flex-col gap-4 h-full min-h-0">
        {/* Riders gradient card: flex 1.4 */}
        <RidersTallCard />

        {/* Payments & Statements card: compact ~110px */}
        <PaymentsCreditsCard />

        {/* Basic Reports dark card: flex 1 */}
        <BasicReportsDarkCard />
      </div>
    </div>
  );
};
