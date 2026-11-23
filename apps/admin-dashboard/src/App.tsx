import React from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { MainLayout } from './components/layout/MainLayout';
import { HomePage } from './pages/HomePage';
import { DocumentVerificationPage } from './pages/DocumentVerificationPage';
import { ProductsPage } from './pages/ProductsPage';
import { VendorsPage } from './pages/VendorsPage';
import { VendorDetailPage } from './pages/VendorDetailPage';
import { RidersPage } from './pages/RidersPage';
import { RiderDetailPage } from './pages/RiderDetailPage';
import { OrdersPage } from './pages/OrdersPage';
import { FinancePage } from './pages/FinancePage';
import { ReportsPage } from './pages/ReportsPage';
import { StaffPage } from './pages/StaffPage';
import { AuditLogsPage } from './pages/AuditLogsPage';
import { SettingsPage } from './pages/SettingsPage';
import { SettingsGuard } from './components/settings/SettingsGuard';
import { LoginPage } from './pages/LoginPage';
import { NoAccessState } from './components/common/NoAccessState';
import { useApp } from './context/AppContext';
import { ModuleName } from './data/staffData';
import { adminApi } from './services/adminApi';

/**
 * Ensures user is authenticated before accessing the console.
 * Redirects unauthenticated requests to /login while preserving location state.
 */
const AuthGuard: React.FC<{ children: React.ReactElement }> = ({ children }) => {
  const isAuth = adminApi.isAuthenticated();
  const location = useLocation();

  if (!isAuth) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
};

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
    <Routes>
      {/* Standalone Login Route (No MainLayout shell) */}
      <Route path="/login" element={<LoginPage />} />

      {/* Authenticated Application Routes wrapped in MainLayout */}
      <Route
        path="/*"
        element={
          <AuthGuard>
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
                <Route
                  path="/vendors/:vendorId"
                  element={
                    <ProtectedRoute module="Users">
                      <VendorDetailPage />
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
                <Route
                  path="/riders/:riderId"
                  element={
                    <ProtectedRoute module="Users">
                      <RiderDetailPage />
                    </ProtectedRoute>
                  }
                />

                {/* 4. Order Management */}
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

                {/* 6. Finance Hub */}
                <Route
                  path="/finance"
                  element={
                    <ProtectedRoute module="Payments">
                      <FinancePage />
                    </ProtectedRoute>
                  }
                />

                {/* Redirects from legacy routes to matching /finance?tab=<name> */}
                <Route path="/payments" element={<Navigate to="/finance?tab=payments" replace />} />
                <Route path="/settlements" element={<Navigate to="/finance?tab=settlements" replace />} />
                <Route path="/commission" element={<Navigate to="/finance?tab=commission" replace />} />
                <Route path="/wallet" element={<Navigate to="/finance?tab=wallet" replace />} />
                <Route path="/coupons" element={<Navigate to="/finance?tab=coupons" replace />} />
                <Route path="/taxes" element={<Navigate to="/finance?tab=taxes" replace />} />
                <Route path="/finance-overview" element={<Navigate to="/finance?tab=overview" replace />} />

                {/* 7. Basic Reports */}
                <Route
                  path="/reports"
                  element={
                    <ProtectedRoute module="Reports">
                      <ReportsPage />
                    </ProtectedRoute>
                  }
                />

                {/* 8. Staff Roles & Permissions */}
                <Route
                  path="/staff"
                  element={
                    <ProtectedRoute module="Settings">
                      <StaffPage />
                    </ProtectedRoute>
                  }
                />

                {/* 9. Audit Logs */}
                <Route
                  path="/audit-logs"
                  element={
                    <ProtectedRoute module="Audit Logs">
                      <AuditLogsPage />
                    </ProtectedRoute>
                  }
                />

                {/* 10. System Settings */}
                <Route
                  path="/settings"
                  element={
                    <SettingsGuard>
                      <SettingsPage />
                    </SettingsGuard>
                  }
                />

                {/* Fallback to Home */}
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </MainLayout>
          </AuthGuard>
        }
      />
    </Routes>
  );
};
