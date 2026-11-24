import { Routes, Route } from "react-router-dom";
import AppKartHome from "../features/home/AppKartHome.jsx";

/**
 * Route table for Fillcart Storefront.
 * Connected routes:
 * - Phase 3: feat/website-home (AppKartHome -> /)
 *
 * Upcoming feature routes (Phases 4 - 10):
 * - Phase 4: feat/website-stores (/stores, /store/:slug, /shops)
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
