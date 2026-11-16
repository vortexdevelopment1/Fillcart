import React from 'react';
import { PendingVerificationsCard } from '../components/charts/PendingVerificationsCard';
import { VendorsCard } from '../components/charts/VendorsCard';
import { RidersTallCard } from '../components/charts/RidersTallCard';
import { TopOrdersCard } from '../components/charts/TopOrdersCard';
import { ProductsDonutCard } from '../components/charts/ProductsDonutCard';
import { PaymentsCreditsCard } from '../components/charts/PaymentsCreditsCard';
import { BasicReportsDarkCard } from '../components/charts/BasicReportsDarkCard';
import { PlatformActivityCard } from '../components/charts/PlatformActivityCard';
import { StaffCard, AuditLogsCard } from '../components/charts/StaffAndAuditCards';

export const HomePage: React.FC = () => {
  return (
    <div className="space-y-6">
      {/* Upper Grid Section: Matching Reference 3-Column Asymmetric Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left 8 Columns (Row 1 & Row 2 left content) */}
        <div className="lg:col-span-8 flex flex-col gap-6">
          {/* Row 1: Pending Verifications + Vendors */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <PendingVerificationsCard />
            <VendorsCard />
          </div>

          {/* Row 2: Orders + Products Donut */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <TopOrdersCard />
            <ProductsDonutCard />
          </div>
        </div>

        {/* Right 4 Columns (Tall Riders Card + Payments + Basic Reports) */}
        <div className="lg:col-span-4 flex flex-col gap-6">
          {/* Riders Tall Gradient Card (Contacts replica) */}
          <RidersTallCard />

          {/* Payments & Statements (Credits replica) */}
          <PaymentsCreditsCard />

          {/* Basic Reports (Texts Sent replica) */}
          <BasicReportsDarkCard />
        </div>
      </div>

      {/* Row 3: Full Width Platform Activity Bar Chart (Messages By Month replica) */}
      <div className="w-full">
        <PlatformActivityCard />
      </div>

      {/* Row 4: Operational Governance Cards (Staff & Audit Logs) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <StaffCard />
        <AuditLogsCard />
      </div>
    </div>
  );
};
