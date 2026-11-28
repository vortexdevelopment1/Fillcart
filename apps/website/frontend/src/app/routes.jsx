import { lazy, Suspense } from "react";
import { Routes, Route, Navigate, useSearchParams } from "react-router-dom";
import AppKartHome from "../features/home/AppKartHome.jsx";
import StoresListingPage from "../features/stores/StoresListingPage.jsx";
import StoreDetailPage from "../features/stores/StoreDetailPage.jsx";
import CategoryListingPage from "../features/catalog/CategoryListingPage.jsx";
import SearchResultsPage from "../features/catalog/SearchResultsPage.jsx";
import ProductDetailPage from "../features/product/ProductDetailPage.jsx";
import CartPage from "../features/cart/CartPage.jsx";
import WishlistPage from "../features/wishlist/WishlistPage.jsx";
import PaymentOffersPage from "../features/offers/PaymentOffersPage.jsx";
import UserProfilePage from "../features/profile/UserProfilePage.jsx";
import ProfileOrders from "../features/profile/ProfileOrders.jsx";
import ProfileAddresses from "../features/profile/ProfileAddresses.jsx";
import ProfilePrescriptions from "../features/profile/ProfilePrescriptions.jsx";
import ProfileAccount from "../features/profile/ProfileAccount.jsx";
import AboutPage from "../features/about/AboutPage.jsx";
import ContactPage from "../features/contact/ContactPage.jsx";
import SupportPage from "../features/support/SupportPage.jsx";
import LegalPage from "../features/legal/LegalPage.jsx";
import FeaturesPage from "../features/misc/FeaturesPage.jsx";
import HowItWorksPage from "../features/misc/HowItWorksPage.jsx";
import BecomeVendorPage from "../features/vendors/BecomeVendorPage.jsx";
import BecomeRiderPage from "../features/services/BecomeRiderPage.jsx";
import CareersPage from "../features/careers/CareersPage.jsx";
import BlogPage from "../features/misc/BlogPage.jsx";
import SubscriptionPage from "../features/misc/SubscriptionPage.jsx";
import NotFoundPage from "../features/misc/NotFoundPage.jsx";
import CustomerLoginPage from "../features/auth/CustomerLoginPage.jsx";
import CustomerRegistrationPage from "../features/auth/CustomerRegistrationPage.jsx";

const StyleguidePage = lazy(() => import("../features/misc/StyleguidePage.jsx"));

function CategoriesRedirect() {
  const [searchParams] = useSearchParams();
  const q = searchParams.get("q");
  const cat = searchParams.get("cat");
  if (q) {
    return <Navigate to={`/search?${searchParams.toString()}`} replace />;
  }
  if (cat) {
    return <Navigate to={`/category/${cat}`} replace />;
  }
  return <Navigate to="/category/grocery" replace />;
}

/**
 * Route table for Fillcart Storefront.
 * Connected routes:
 * - Phase 3: feat/website-home (/)
 * - Phase 4: feat/website-stores (/stores, /store/:slug, /shops)
 * - Phase 5: feat/website-catalog (/category/:slug, /categories, /groceries, /category, /search, /product/:slug, /product/:id)
 * - Phase 6: feat/website-cart (/cart, /wishlist)
 * - Phase 7: feat/website-offers (/offers/payment, /payment-offers)
 * - Phase 8: feat/website-profile (/profile, /profile/orders, /profile/addresses, /profile/prescriptions, /profile/account, /profile/:tab)
 * - Phase 9: feat/website-pages (/about, /contact, /support, /faq, /help, /terms, /privacy, /how-it-works, /features, /careers, /blog, /subscriptions, /become-vendor, /partner/vendor, /become-rider, /partner/rider, /styleguide)
 * - Phase 10: feat/website-auth (/login, /register, /login/customer)
 */
export default function AppRoutes() {
  return (
    <Routes>
      {/* Home */}
      <Route path="/" element={<AppKartHome />} />

      {/* Stores */}
      <Route path="/stores" element={<StoresListingPage />} />
      <Route path="/store/:slug" element={<StoreDetailPage />} />
      <Route path="/shops" element={<Navigate to="/stores" replace />} />

      {/* Catalog & Search */}
      <Route path="/search" element={<SearchResultsPage />} />
      <Route path="/categories" element={<CategoriesRedirect />} />
      <Route path="/groceries" element={<Navigate to="/category/grocery" replace />} />
      <Route path="/category" element={<Navigate to="/category/grocery" replace />} />
      <Route path="/category/:slug" element={<CategoryListingPage />} />

      {/* Product Detail */}
      <Route path="/product/:slug" element={<ProductDetailPage />} />
      <Route path="/product/:id" element={<ProductDetailPage />} />

      {/* Cart & Wishlist */}
      <Route path="/cart" element={<CartPage />} />
      <Route path="/wishlist" element={<WishlistPage />} />

      {/* Offers */}
      <Route path="/offers/payment" element={<PaymentOffersPage />} />
      <Route path="/payment-offers" element={<Navigate to="/offers/payment" replace />} />

      {/* Profile */}
      <Route path="/profile" element={<Navigate to="/profile/orders" replace />} />
      <Route path="/profile/orders" element={<ProfileOrders />} />
      <Route path="/profile/addresses" element={<ProfileAddresses />} />
      <Route path="/profile/prescriptions" element={<ProfilePrescriptions />} />
      <Route path="/profile/account" element={<ProfileAccount />} />
      <Route path="/profile/:tab" element={<UserProfilePage />} />

      {/* Auth */}
      <Route path="/login" element={<CustomerLoginPage />} />
      <Route path="/register" element={<CustomerRegistrationPage />} />
      <Route path="/login/customer" element={<CustomerLoginPage />} />

      {/* Content & Policy Pages */}
      <Route path="/features" element={<FeaturesPage />} />
      <Route path="/about" element={<AboutPage />} />
      <Route path="/support" element={<SupportPage />} />
      <Route path="/faq" element={<Navigate to="/support" replace />} />
      <Route path="/help" element={<Navigate to="/support" replace />} />
      <Route path="/subscriptions" element={<SubscriptionPage />} />
      <Route path="/careers" element={<CareersPage />} />
      <Route path="/blog" element={<BlogPage />} />
      <Route path="/terms" element={<LegalPage />} />
      <Route path="/privacy" element={<LegalPage />} />
      <Route path="/contact" element={<ContactPage />} />
      <Route path="/how-it-works" element={<HowItWorksPage />} />
      <Route path="/become-vendor" element={<BecomeVendorPage />} />
      <Route path="/partner/vendor" element={<BecomeVendorPage />} />
      <Route path="/become-rider" element={<BecomeRiderPage />} />
      <Route path="/partner/rider" element={<BecomeRiderPage />} />

      {/* Dev-only styleguide route */}
      {(import.meta.env.DEV || import.meta.env.MODE !== "production") && (
        <Route
          path="/styleguide"
          element={
            <Suspense fallback={<div className="p-8 text-center text-sm font-bold text-[#101828]">Loading styleguide...</div>}>
              <StyleguidePage />
            </Suspense>
          }
        />
      )}

      {/* 404 Not Found Page */}
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}
