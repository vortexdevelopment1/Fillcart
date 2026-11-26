import { useEffect } from "react";
import { BrowserRouter, useLocation } from "react-router-dom";
import { AuthProvider } from "../lib/context/AuthContext.jsx";
import { CartProvider } from "../lib/context/CartContext.jsx";
import { WishlistProvider } from "../lib/context/WishlistContext.jsx";
import AppRoutes from "./routes.jsx";

function ScrollToTop() {
  const { pathname, hash } = useLocation();

  useEffect(() => {
    if (!hash && pathname !== "/terms" && pathname !== "/privacy") {
      window.scrollTo(0, 0);
    }
  }, [pathname, hash]);

  return null;
}

export default function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <WishlistProvider>
          <BrowserRouter>
            <ScrollToTop />
            <AppRoutes />
          </BrowserRouter>
        </WishlistProvider>
      </CartProvider>
    </AuthProvider>
  );
}
