import React, { useState, useEffect, useRef, useCallback } from "react";
import { Link, useNavigate } from "react-router-dom";
import Navbar from "../../components/layout/Navbar.jsx";
import Footer from "../../components/layout/Footer.jsx";
import ProductCard from "../../components/common/ProductCard.jsx";
import ProductSection from "../../components/common/ProductSection.jsx";
import StoreCard from "../../components/common/StoreCard.jsx";
import CategoryCard from "../../components/common/CategoryCard.jsx";
import OfferBannersRow from "../../components/common/OfferBannersRow.jsx";
import HomeBannerCarousel from "../../components/common/HomeBannerCarousel.jsx";
import {
  ArrowRight, ChevronLeft, ChevronRight, Sparkles,
  ShoppingBag, RefreshCw, AlertCircle
} from "lucide-react";
import { useCart } from "../../lib/context/CartContext.jsx";
import productService from "../../services/productService.js";
import { SHOP_BY_CATEGORY } from "../../lib/config/shopByCategory.js";
import { POPULAR_PRODUCTS } from "../../lib/config/popularProducts.js";
import { HOME_ESSENTIALS_PRODUCTS } from "../../lib/config/homeEssentialsProducts.js";
import { DAILY_CARE_PRODUCTS } from "../../lib/config/dailyCareProducts.js";
import { CHILL_FROZEN_PRODUCTS } from "../../lib/config/chillFrozenProducts.js";
import { stores as defaultStores } from "../../lib/data/storesData.js";

export default function AppKartHome() {
  const { userLocation } = useCart();
  const navigate = useNavigate();

  // Stores & Products State (Using instant local catalog data without network overhead)
  const stores = defaultStores;
  const loadingStores = false;
  const storeError = null;

  const popularProducts = POPULAR_PRODUCTS;
  const loadingPopular = false;
  const popularError = null;

  const homeProducts = HOME_ESSENTIALS_PRODUCTS;
  const loadingHome = false;
  const homeError = null;

  const dailyCareProducts = DAILY_CARE_PRODUCTS;
  const loadingDailyCare = false;
  const dailyCareError = null;

  const chillProducts = CHILL_FROZEN_PRODUCTS;
  const loadingChill = false;
  const chillError = null;

  const backendCategories = [];
  const noop = () => {};

  // Scroll helper
  const scrollRow = (ref, direction) => {
    if (!ref.current) return;
    const cardStep = 220 * 3;
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    ref.current.scrollBy({
      left: direction === "right" ? cardStep : -cardStep,
      behavior: prefersReducedMotion ? "auto" : "smooth",
    });
  };

  return (
    <div className="bg-white text-[#111925] min-h-screen flex flex-col font-sans" style={{ fontFamily: "'Manrope', sans-serif" }}>
      {/* Navbar (Figma 2 Rows) */}
      <Navbar />

      <main className="flex-1 max-w-[1216px] w-full mx-auto px-4 sm:px-6 xl:px-0 pt-6 pb-12 sm:pb-16 space-y-12">
        
        {/* 1. HERO SECTION (Auto-Scrolling Banner Carousel) */}
        <HomeBannerCarousel />

        {/* 2. "SHOP FROM NEARBY STORES" (Figma: Eyebrow #936D00, Title #101828, View all #2F6842, 5-col grid) */}
        <section aria-labelledby="stores-heading" className="w-full text-left">
          {/* Section Header: flex row space-between, 24px space to cards */}
          <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-6 gap-3">
            {/* Left Stack: 8px gap */}
            <div className="flex flex-col gap-2">
              <span
                className="uppercase font-extrabold text-[10px] leading-[15px] tracking-[1.6px] text-[#936D00]"
                style={{ fontFamily: "var(--font-sans, 'Manrope', sans-serif)" }}
              >
                AROUND THE CORNER
              </span>
              <h2
                id="stores-heading"
                className="font-extrabold text-[20px] sm:text-[24px] lg:text-[27px] leading-[26px] sm:leading-[30px] lg:leading-[32.4px] text-[#101828]"
                style={{ fontFamily: "var(--font-sans, 'Manrope', sans-serif)", letterSpacing: "-1.2px" }}
              >
                Shop from nearby stores
              </h2>
            </div>

            {/* Right: "View all stores" aligned to bottom of title row */}
            <Link
              to="/stores"
              className="inline-flex items-center gap-1 font-extrabold text-[11px] leading-[16.5px] tracking-normal text-[#2F6842] hover:underline focus:outline-hidden focus-visible:ring-2 focus-visible:ring-[#2F6842] focus-visible:ring-offset-2 rounded-xs self-start sm:self-end shrink-0"
              style={{ fontFamily: "var(--font-sans, 'Manrope', sans-serif)" }}
            >
              <span>View all stores</span>
              <ArrowRight size={12} className="text-[#2F6842] shrink-0" />
            </Link>
          </div>

          {/* Stores Content: 5 cards row */}
          {loadingStores ? (
            <div className="flex xl:grid xl:grid-cols-5 gap-4 overflow-x-auto xl:overflow-x-visible no-scrollbar snap-x snap-mandatory xl:snap-none scroll-smooth pb-1 xl:pb-0">
              {Array.from({ length: 5 }).map((_, i) => (
                <div
                  key={i}
                  className="w-[230.4px] min-w-[230.4px] max-w-[230.4px] xl:w-full xl:min-w-0 xl:max-w-none shrink-0 xl:shrink snap-start h-[167.25px] rounded-[18px] border-[0.8px] border-[#E6E8E5] overflow-hidden bg-white animate-pulse"
                >
                  <div className="h-[104px] bg-[#F4F5F8]" />
                  <div className="h-[63.25px] px-[14px] flex items-center justify-between">
                    <div className="space-y-1.5">
                      <div className="h-[13px] bg-[#ECEEF2] rounded w-24" />
                      <div className="h-[9px] bg-[#ECEEF2] rounded w-16" />
                    </div>
                    <div className="h-[14px] w-[14px] bg-[#ECEEF2] rounded" />
                  </div>
                </div>
              ))}
            </div>
          ) : storeError ? (
            <div className="p-8 text-center bg-[#F4F5F8] rounded-[18px] border border-[#E6E8E5] space-y-2">
              <p className="text-xs text-[#6B7280]">{storeError}</p>
              <button
                type="button"
                onClick={noop}
                className="text-xs font-bold text-[#2F6842] hover:underline inline-flex items-center gap-1 cursor-pointer"
              >
                <RefreshCw size={12} /> Retry
              </button>
            </div>
          ) : stores.length === 0 ? (
            <div className="p-8 text-center bg-[#F4F5F8] rounded-[18px] border border-[#E6E8E5]">
              <p className="text-sm font-bold text-[#101828]">No stores deliver to this location yet</p>
            </div>
          ) : (
            <div className="flex xl:grid xl:grid-cols-5 gap-4 overflow-x-auto xl:overflow-x-visible no-scrollbar snap-x snap-mandatory xl:snap-none scroll-smooth pb-1 xl:pb-0">
              {stores.slice(0, 5).map((store) => (
                <StoreCard key={store.id || store.slug} store={store} />
              ))}
            </div>
          )}
        </section>

        {/* 3. ROW OF 3 OFFER BANNERS (Bank offers pink gradient, Rewards cream, Combo offer image) */}
        <OfferBannersRow />

        {/* 4. "SHOP BY CATEGORY" (Figma: Eyebrow #936D00, Title #101828, 6-col grid, rounded 32px cards) */}
        <section aria-labelledby="category-heading" className="w-full text-left">
          {/* Section Header: Eyebrow and Title stacked with 8px gap, 24px space to grid */}
          <div className="flex flex-col gap-2 mb-6">
            <span
              className="uppercase font-extrabold text-[10px] leading-[15px] tracking-[1.6px] text-[#936D00]"
              style={{ fontFamily: "var(--font-sans, 'Manrope', sans-serif)" }}
            >
              EXPLORE THE AISLES
            </span>
            <h2
              id="category-heading"
              className="font-extrabold text-[20px] sm:text-[24px] lg:text-[27px] leading-[26px] sm:leading-[30px] lg:leading-[32.4px] text-[#101828]"
              style={{ fontFamily: "var(--font-sans, 'Manrope', sans-serif)", letterSpacing: "-1.2px" }}
            >
              Shop by category
            </h2>
          </div>

          {/* Grid Content: Exactly 12 cards from config in 6 cols desktop, 4 cols 1024, 3 cols 768/mobile, 2 cols <360 */}
          <div className="grid grid-cols-2 min-[360px]:grid-cols-3 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-2.5 sm:gap-3 md:gap-4">
            {SHOP_BY_CATEGORY.map((cat, idx) => (
              <CategoryCard
                key={cat.position || idx}
                category={cat}
                index={idx}
                backendCategories={backendCategories}
              />
            ))}
          </div>
        </section>

        {/* 5. "POPULAR RIGHT NOW" (Reusable ProductSection matching Figma) */}
        <ProductSection
          id="popular-section"
          eyebrow="CUSTOMER FAVOURITES"
          title="Popular right now"
          viewAllLink="/category/grocery"
          viewAllText="View all products"
          products={popularProducts}
          loading={loadingPopular}
          error={popularError}
          onRetry={noop}
        />

        {/* 6. "HOME ESSENTIALS" (Reusable ProductSection matching Figma) */}
        <ProductSection
          id="home-essentials-section"
          title="Home essentials"
          viewAllLink="/category/grocery"
          viewAllText="View all"
          products={homeProducts}
          loading={loadingHome}
          error={homeError}
          onRetry={noop}
        />

        {/* 7. "DAILY CARE" (Reusable ProductSection matching Figma) */}
        <ProductSection
          id="daily-care-section"
          title="Daily care"
          viewAllLink="/category/beauty"
          viewAllText="View all"
          products={dailyCareProducts}
          loading={loadingDailyCare}
          error={dailyCareError}
          onRetry={noop}
        />

        {/* 8. "CHILL ZONE" / "FROZEN FAVOURITES" (Exact Screenshot Specification) */}
        <section
          id="chill-zone-section"
          aria-labelledby="chill-heading"
          className="w-full rounded-[24px] sm:rounded-[32px] p-5 sm:p-7 lg:p-8 text-left relative overflow-hidden"
          style={{
            backgroundColor: "#C7E7FF",
          }}
        >
          {/* Header: Eyebrow + Title (No right link, matching screenshot) */}
          <div className="flex flex-col gap-2 mb-6">
            <span
              className="uppercase font-extrabold text-[10px] leading-[15px] tracking-[1.6px]"
              style={{
                color: "var(--color-eyebrow, #936D00)",
                fontFamily: "var(--font-sans, 'Manrope', sans-serif)",
              }}
            >
              Chill Zone
            </span>
            <h2
              id="chill-heading"
              className="font-extrabold text-[20px] sm:text-[24px] lg:text-[27px] leading-[26px] sm:leading-[30px] lg:leading-[32.4px]"
              style={{
                color: "var(--color-section-title, #101828)",
                fontFamily: "var(--font-sans, 'Manrope', sans-serif)",
                letterSpacing: "-1.2px",
              }}
            >
              Frozen favourites
            </h2>
          </div>

          {/* Cards Grid: 6 equal columns with 13px gap */}
          {loadingChill ? (
            <div className="flex lg:grid gap-3 sm:gap-[13px] overflow-x-auto lg:overflow-visible no-scrollbar snap-x snap-mandatory lg:grid-cols-4 xl:grid-cols-6 pb-2 lg:pb-0">
              {Array.from({ length: 6 }).map((_, idx) => (
                <div
                  key={idx}
                  className="w-[150px] min-w-[150px] sm:w-[176px] sm:min-w-[176px] md:w-[200px] md:min-w-[200px] lg:w-full lg:min-w-0 h-[280px] lg:h-[310.1px] rounded-[18px] border-[0.8px] border-[#E7E8E5] p-2 flex flex-col justify-between bg-white animate-pulse snap-start shrink-0 lg:shrink"
                >
                  <div className="w-full aspect-square rounded-[12px] bg-[#F4F5F8]" />
                  <div className="space-y-2 mt-3.5">
                    <div className="h-3 bg-[#F4F5F8] rounded w-3/4" />
                    <div className="h-2.5 bg-[#F4F5F8] rounded w-1/2" />
                  </div>
                  <div className="mt-auto pt-2 flex items-end justify-between">
                    <div className="h-4 bg-[#F4F5F8] rounded w-12" />
                    <div className="w-[68px] h-[32px] rounded-full bg-[#F4F5F8]" />
                  </div>
                </div>
              ))}
            </div>
          ) : chillError ? (
            <div className="p-8 text-center bg-white/80 rounded-[20px] border border-white/90 space-y-2">
              <p className="text-xs text-[#667085]" style={{ fontFamily: "var(--font-sans, 'Manrope', sans-serif)" }}>
                {chillError}
              </p>
              <button
                type="button"
                onClick={noop}
                className="text-xs font-bold text-[#2F6842] hover:underline inline-flex items-center gap-1 cursor-pointer"
                style={{ fontFamily: "var(--font-sans, 'Manrope', sans-serif)" }}
              >
                <RefreshCw size={12} /> Retry
              </button>
            </div>
          ) : (
            <div className="flex lg:grid gap-3 sm:gap-[13px] overflow-x-auto lg:overflow-visible no-scrollbar snap-x snap-mandatory scroll-smooth lg:grid-cols-4 xl:grid-cols-6 pb-2 lg:pb-0">
              {chillProducts.slice(0, 6).map((prod) => (
                <div
                  key={prod.id || prod.slug || prod._id}
                  className="w-[150px] min-w-[150px] sm:w-[176px] sm:min-w-[176px] md:w-[200px] md:min-w-[200px] lg:w-full lg:min-w-0 snap-start shrink-0 lg:shrink"
                >
                  <ProductCard product={prod} />
                </div>
              ))}
            </div>
          )}
        </section>

      </main>

      {/* Footer (Figma Dark Navy #111925) */}
      <Footer />
    </div>
  );
}
