import { Routes, Route, Navigate, useSearchParams } from "react-router-dom";
import AppKartHome from "../features/home/AppKartHome.jsx";
import StoresListingPage from "../features/stores/StoresListingPage.jsx";
import StoreDetailPage from "../features/stores/StoreDetailPage.jsx";
import CategoryListingPage from "../features/catalog/CategoryListingPage.jsx";
import SearchResultsPage from "../features/catalog/SearchResultsPage.jsx";
import ProductDetailPage from "../features/product/ProductDetailPage.jsx";

function CategoriesRedirect() {
  const [searchParams] = useSearchParams();
  const cat = searchParams.get("cat");
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
 *
 * Upcoming feature routes (Phases 6 - 10):
 * - Phase 6: feat/website-cart (/cart, /wishlist)
 * - Phase 7: feat/website-offers (/offers/payment, /payment-offers)
 * - Phase 8: feat/website-profile (/profile/*)
 * - Phase 9: feat/website-pages (/about, /contact, /support, /terms, /privacy, etc.)
 * - Phase 10: feat/website-auth (/login, /register)
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

      {/* Fallback */}
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
