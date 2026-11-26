import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import api from "../../services/api.js";
import { useCart } from "./CartContext.jsx";

const WishlistContext = createContext(null);

export function WishlistProvider({ children }) {
  const cartContext = useCart() || {};
  const { user, setShowLoginModal } = cartContext;

  const [wishlist, setWishlist] = useState([]);
  const [loading, setLoading] = useState(false);

  // Load wishlist from localStorage
  const fetchWishlist = useCallback(() => {
    const userKey = user
      ? `fillcarts_wishlist_${user.phone || user.email || user.id}`
      : "fillcarts_guest_wishlist";
    const stored = localStorage.getItem(userKey);
    if (stored) {
      try {
        setWishlist(JSON.parse(stored));
        return;
      } catch (err) {}
    }
    setWishlist([]);
  }, [user]);

  // Sync wishlist whenever authenticated user changes
  useEffect(() => {
    fetchWishlist();
  }, [user, fetchWishlist]);

  // Check if product is in wishlist
  const isInWishlist = useCallback(
    (productId) => {
      if (!productId) return false;
      const cleanTargetId = String(productId).trim();
      return wishlist.some((item) => {
        if (!item) return false;
        const itemId = String(item.id || item.productId || item._id || "");
        const mongoId = item._id ? String(item._id) : "";
        const customId = item.productId ? String(item.productId) : "";
        return (
          itemId === cleanTargetId ||
          mongoId === cleanTargetId ||
          customId === cleanTargetId
        );
      });
    },
    [wishlist]
  );

  // Add product to local wishlist
  const addToWishlist = async (product) => {
    if (!product) return false;
    const prodId = product.productId || product._id || product.id;
    if (!prodId) return false;

    setWishlist((prev) => {
      const exists = prev.some((item) => {
        const iId = String(item.id || item.productId || item._id || "");
        return iId === String(prodId);
      });
      if (exists) return prev;
      const updated = [
        {
          ...product,
          id: product.productId || product.id || String(product._id),
          wishlistedAt: new Date().toISOString(),
        },
        ...prev,
      ];
      const userKey = user
        ? `fillcarts_wishlist_${user.phone || user.email || user.id}`
        : "fillcarts_guest_wishlist";
      localStorage.setItem(userKey, JSON.stringify(updated));
      return updated;
    });
    return true;
  };

  // Remove product from local wishlist
  const removeFromWishlist = async (productId) => {
    if (!productId) return false;
    const cleanTargetId = String(productId).trim();

    setWishlist((prev) => {
      const updated = prev.filter((item) => {
        if (!item) return false;
        const itemId = String(item.id || item.productId || item._id || "");
        const mongoId = item._id ? String(item._id) : "";
        const customId = item.productId ? String(item.productId) : "";
        return (
          itemId !== cleanTargetId &&
          mongoId !== cleanTargetId &&
          customId !== cleanTargetId
        );
      });
      const userKey = user
        ? `fillcarts_wishlist_${user.phone || user.email || user.id}`
        : "fillcarts_guest_wishlist";
      localStorage.setItem(userKey, JSON.stringify(updated));
      return updated;
    });
    return true;
  };

  // Toggle wishlist state
  const toggleWishlist = async (product) => {
    if (!product) return false;
    if (!user) {
      if (typeof setShowLoginModal === "function") {
        setShowLoginModal(true);
      }
      return false;
    }

    const prodId = product.productId || product._id || product.id;
    if (!prodId) return false;

    if (isInWishlist(prodId)) {
      await removeFromWishlist(prodId);
      return false; // Removed
    } else {
      await addToWishlist(product);
      return true; // Added
    }
  };

  const wishlistCount = wishlist.length;

  return (
    <WishlistContext.Provider
      value={{
        wishlist,
        wishlistCount,
        loading,
        isInWishlist,
        addToWishlist,
        removeFromWishlist,
        toggleWishlist,
        fetchWishlist,
      }}
    >
      {children}
    </WishlistContext.Provider>
  );
}

export function useWishlist() {
  const context = useContext(WishlistContext);
  if (!context) {
    throw new Error("useWishlist must be used within a WishlistProvider");
  }
  return context;
}

export default WishlistContext;
