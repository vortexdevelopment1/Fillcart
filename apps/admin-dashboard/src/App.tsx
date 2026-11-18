import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { MainLayout } from './components/layout/MainLayout';
import { HomePage } from './pages/HomePage';
import { DocumentVerificationPage } from './pages/DocumentVerificationPage';
import { ProductsPage } from './pages/ProductsPage';
import { VendorsPage } from './pages/VendorsPage';
import { RidersPage } from './pages/RidersPage';
import { OrdersPage } from './pages/OrdersPage';
import { FinancePage } from './pages/FinancePage';
import { ReportsPage } from './pages/ReportsPage';
import { StaffPage } from './pages/StaffPage';
import { AuditLogsPage } from './pages/AuditLogsPage';
import { SettingsPage } from './pages/SettingsPage';
import { PlaceholderPage } from './pages/PlaceholderPage';
import { NoAccessState } from './components/common/NoAccessState';
import { useApp } from './context/AppContext';
import { ModuleName } from './data/staffData';
import { Settings } from 'lucide-react';

const ProtectedRoute: React.FC<{ module: ModuleName; children: React.ReactElement }> = ({
  module,
  children,
}) => {
  const { hasPermission } = useApp();
  if (!hasPermission(module, 'View')) {
    return <NoAccessState moduleName={module} />;
  }
  return children;
};

export const App: React.FC = () => {
  return (
    <MainLayout>
      <Routes>
        {/* Home Dashboard */}
        <Route path="/" element={<HomePage />} />

        {/* 1. Document Verification */}
        <Route
          path="/document-verification"
          element={
            <ProtectedRoute module="Users">
              <DocumentVerificationPage />
            </ProtectedRoute>
          }
        />

        {/* 2. Vendor Management */}
        <Route
          path="/vendors"
          element={
            <ProtectedRoute module="Users">
              <VendorsPage />
            </ProtectedRoute>
          }
        />

        {/* 3. Rider Management */}
        <Route
          path="/riders"
          element={
            <ProtectedRoute module="Users">
              <RidersPage />
            </ProtectedRoute>
          }
        />

        {/* 4. Order Management (Built & Connected) */}
        <Route
          path="/orders"
          element={
            <ProtectedRoute module="Orders">
              <OrdersPage />
            </ProtectedRoute>
          }
        />

        {/* 5. Products & Categories */}
        <Route
          path="/products"
          element={
            <ProtectedRoute module="Products">
              <ProductsPage />
            </ProtectedRoute>
          }
        />

        {/* 6. Finance Hub (Single page with tabs) */}
        <Route
          path="/finance"
          element={
            <ProtectedRoute module="Payments">
              <FinancePage />
            </ProtectedRoute>
          }
        />

        {/* Redirects from old routes to matching /finance?tab=<name> */}
        <Route path="/payments" element={<Navigate to="/finance?tab=payments" replace />} />
        <Route path="/settlements" element={<Navigate to="/finance?tab=settlements" replace />} />
        <Route path="/commission" element={<Navigate to="/finance?tab=commission" replace />} />
        <Route path="/wallet" element={<Navigate to="/finance?tab=wallet" replace />} />
        <Route path="/coupons" element={<Navigate to="/finance?tab=coupons" replace />} />
        <Route path="/taxes" element={<Navigate to="/finance?tab=taxes" replace />} />
        <Route path="/finance-overview" element={<Navigate to="/finance?tab=overview" replace />} />

        {/* 7. Basic Reports (Built & Connected) */}
        <Route
          path="/reports"
          element={
            <ProtectedRoute module="Reports">
              <ReportsPage />
            </ProtectedRoute>
          }
        />

        {/* 8. Staff Roles & Permissions (Built & Connected) */}
        <Route
          path="/staff"
          element={
            <ProtectedRoute module="Settings">
              <StaffPage />
            </ProtectedRoute>
          }
        />

        {/* 9. Audit Logs (Built & Connected) */}
        <Route
          path="/audit-logs"
          element={
            <ProtectedRoute module="Audit Logs">
              <AuditLogsPage />
            </ProtectedRoute>
          }
        />

        {/* 10. System Settings */}
        <Route path="/settings" element={<SettingsPage />} />

        {/* Fallback to Home */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </MainLayout>
  );
};
