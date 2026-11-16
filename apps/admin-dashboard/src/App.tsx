import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { MainLayout } from './components/layout/MainLayout';
import { HomePage } from './pages/HomePage';
import { DocumentVerificationPage } from './pages/DocumentVerificationPage';
import { PlaceholderPage } from './pages/PlaceholderPage';
import {
  Store,
  Bike,
  ShoppingBag,
  Layers,
  CreditCard,
  BarChart3,
  ShieldCheck,
  History,
} from 'lucide-react';

export const App: React.FC = () => {
  return (
    <MainLayout>
      <Routes>
        {/* Home Dashboard (Exact visual match to reference) */}
        <Route path="/" element={<HomePage />} />

        {/* Fully Functional Document Verification Page */}
        <Route path="/document-verification" element={<DocumentVerificationPage />} />

        {/* Module Placeholders */}
        <Route
          path="/vendors"
          element={
            <PlaceholderPage
              title="Vendor Management"
              subtitle="Store onboarding, product listings, merchant compliance & revenue monitoring"
              icon={Store}
            />
          }
        />
        <Route
          path="/riders"
          element={
            <PlaceholderPage
              title="Rider Management"
              subtitle="Fleet operations, driver shifts, live GPS tracking & payout tier configs"
              icon={Bike}
            />
          }
        />
        <Route
          path="/orders"
          element={
            <PlaceholderPage
              title="Order Management"
              subtitle="Live dispatch pipeline, cart exceptions, refund requests & cancellation tickets"
              icon={ShoppingBag}
            />
          }
        />
        <Route
          path="/products"
          element={
            <PlaceholderPage
              title="Products & Categories"
              subtitle="Central master catalog, SKU variations, inventory thresholds & tax brackets"
              icon={Layers}
            />
          }
        />
        <Route
          path="/payments"
          element={
            <PlaceholderPage
              title="Payments & Statements"
              subtitle="Automated merchant payouts, UPI gateway reconciliations & delivery fees"
              icon={CreditCard}
            />
          }
        />
        <Route
          path="/reports"
          element={
            <PlaceholderPage
              title="Basic Reports"
              subtitle="Executive performance metrics, SLA delivery reports & regional revenue charts"
              icon={BarChart3}
            />
          }
        />
        <Route
          path="/staff"
          element={
            <PlaceholderPage
              title="Staff Roles & Permissions"
              subtitle="Internal ops hierarchy, RBAC policy assignments & two-factor authorization"
              icon={ShieldCheck}
            />
          }
        />
        <Route
          path="/audit-logs"
          element={
            <PlaceholderPage
              title="Audit Logs"
              subtitle="Immutable trail of administrative decisions, system logins & sensitive actions"
              icon={History}
            />
          }
        />

        {/* Fallback to Home */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </MainLayout>
  );
};
