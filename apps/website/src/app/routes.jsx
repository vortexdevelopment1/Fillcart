import { Routes, Route, Navigate } from "react-router-dom";
import AppKartHome from "../features/home/AppKartHome.jsx";
import StoresListingPage from "../features/stores/StoresListingPage.jsx";
import StoreDetailPage from "../features/stores/StoreDetailPage.jsx";

/**
 * Route table for Fillcart Storefront.
 * Connected routes:
 * - Phase 3: feat/website-home (/)
 * - Phase 4: feat/website-stores (/stores, /store/:slug, /shops)
 *
 * Upcoming feature routes (Phases 5 - 10):
 * - Phase 5: feat/website-catalog (/category/:slug, /categories, /search, /product/:slug)
 * - Phase 6: feat/website-cart (/cart, /wishlist)
 * - Phase 7: feat/website-offers (/offers/payment, /payment-offers)
 * - Phase 8: feat/website-profile (/profile/*)
 * - Phase 9: feat/website-pages (/about, /contact, /support, /terms, /privacy, etc.)
 * - Phase 10: feat/website-auth (/login, /register)
 */
export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<AppKartHome />} />
      <Route path="/stores" element={<StoresListingPage />} />
      <Route path="/store/:slug" element={<StoreDetailPage />} />
      <Route path="/shops" element={<Navigate to="/stores" replace />} />
      <Route
        path="*"
        element={
          <div className="min-h-screen flex items-center justify-center text-gray-600">
            Page pending feature migration
          </div>
        }
      />
    </Routes>
  );
}
