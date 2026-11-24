import { Routes, Route } from "react-router-dom";

/**
 * Route table for Fillcart Storefront.
 * In Phase 1, feature pages have not yet been migrated into src/features/.
 * The routes will be connected phase by phase as features are migrated:
 * - Phase 3: feat/website-home (AppKartHome)
 * - Phase 4: feat/website-stores (StoresListingPage, StoreDetailPage)
 * - Phase 5: feat/website-catalog (CategoriesPage, CategoryListingPage, SearchResultsPage, ProductDetailPage)
 * - Phase 6: feat/website-cart (CartPage, WishlistPage)
 * - Phase 7: feat/website-offers (PaymentOffersPage)
 * - Phase 8: feat/website-profile (UserProfilePage, ProfileOrders, ProfileAddresses, ProfilePrescriptions, ProfileAccount)
 * - Phase 9: feat/website-pages (AboutPage, ContactPage, SupportPage, LegalPage, FeaturesPage, HowItWorksPage, BecomeVendorPage, BecomeRiderPage, CareersPage, BlogPage, SubscriptionPage, NotFoundPage)
 * - Phase 10: feat/website-auth (CustomerLoginPage, CustomerRegistrationPage)
 */
export default function AppRoutes() {
  return (
    <Routes>
      <Route
        path="/"
        element={
          <div className="min-h-screen flex items-center justify-center bg-gray-50 text-gray-800">
            <div className="text-center p-8 bg-white shadow-md rounded-2xl max-w-md">
              <h1 className="text-2xl font-bold mb-2">Fillcart Storefront</h1>
              <p className="text-sm text-gray-500">Website setup and foundation initialized (Phase 1).</p>
            </div>
          </div>
        }
      />
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
