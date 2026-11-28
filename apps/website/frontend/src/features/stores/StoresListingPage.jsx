import React, { useState, useMemo, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import Navbar from "../../components/layout/Navbar.jsx";
import Footer from "../../components/layout/Footer.jsx";
import StoreCard from "../../components/common/StoreCard.jsx";
import { stores } from "../../lib/data/storesData.js";
import { ChevronDown, Check } from "lucide-react";

export default function StoresListingPage() {
  const [activeFilter, setActiveFilter] = useState("all");
  const [sortBy, setSortBy] = useState("recommended");
  const [sortDropdownOpen, setSortDropdownOpen] = useState(false);
  const sortDropdownRef = useRef(null);

  const STORE_SORT_OPTIONS = [
    { value: "recommended", label: "Sort by: Recommended" },
    { value: "rating", label: "Sort by: Rating" },
    { value: "delivery", label: "Sort by: Delivery time" },
    { value: "distance", label: "Sort by: Distance" },
  ];

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (sortDropdownRef.current && !sortDropdownRef.current.contains(e.target)) {
        setSortDropdownOpen(false);
      }
    };
    if (sortDropdownOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      document.addEventListener("touchstart", handleClickOutside, { passive: true });
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("touchstart", handleClickOutside);
    };
  }, [sortDropdownOpen]);

  // Helper to parse delivery time in minutes
  const parseDeliveryTime = (timeStr) => {
    if (!timeStr) return 999;
    const matches = String(timeStr).match(/\d+/g);
    if (!matches) return 999;
    // If range like 15-20 min, use upper bound
    return parseInt(matches[matches.length - 1], 10);
  };

  // Helper to parse distance in km
  const parseDistance = (distStr) => {
    if (!distStr) return 999;
    const match = String(distStr).match(/[\d.]+/);
    return match ? parseFloat(match[0]) : 999;
  };

  // Filter & Sort
  const filteredAndSortedStores = useMemo(() => {
    let result = [...stores];

    // Filter
    if (activeFilter === "open-now") {
      result = result.filter((s) => s.isOpen !== false);
    } else if (activeFilter === "fastest") {
      result = result.filter((s) => parseDeliveryTime(s.deliveryTime) <= 20);
    } else if (activeFilter === "top-rated") {
      result = result.filter((s) => Number(s.rating) >= 4.7);
    }

    // Sort
    if (sortBy === "rating") {
      result.sort((a, b) => Number(b.rating) - Number(a.rating));
    } else if (sortBy === "delivery") {
      result.sort((a, b) => parseDeliveryTime(a.deliveryTime) - parseDeliveryTime(b.deliveryTime));
    } else if (sortBy === "distance") {
      result.sort((a, b) => parseDistance(a.distance) - parseDistance(b.distance));
    }

    return result;
  }, [activeFilter, sortBy]);

  const clearFilters = () => {
    setActiveFilter("all");
    setSortBy("recommended");
  };

  const filterChips = [
    { id: "all", label: "All" },
    { id: "open-now", label: "Open now" },
    { id: "fastest", label: "Fastest delivery" },
    { id: "top-rated", label: "Top rated" },
  ];

  return (
    <div
      style={{
        fontFamily: "var(--font-sans, 'Manrope', sans-serif)",
        color: "#101828",
      }}
      className="min-h-screen flex flex-col bg-[#FFFFFF]"
    >
      <Navbar />

      <main className="flex-1 w-full">
        {/* 1. HEADER BAND */}
        <section
          style={{
            background: "linear-gradient(180deg, #FFF6DB, #FFFBF0)",
            borderBottom: "0.8px solid #F5E3B0",
          }}
          className="w-full px-6 sm:px-12 lg:px-[112px] pt-[28px] pb-[32px] sm:pb-[40px]"
        >
          <div className="max-w-[1216px] mx-auto flex flex-col gap-[16px]">
            {/* Breadcrumb: Home / Stores */}
            <nav aria-label="Breadcrumb">
              <ol className="flex items-center gap-2 text-[12px] font-semibold text-[#667085]">
                <li>
                  <Link
                    to="/"
                    className="hover:text-[#101828] transition-colors focus:outline-hidden focus-visible:ring-1 focus-visible:ring-[#101828] rounded-xs"
                  >
                    Home
                  </Link>
                </li>
                <li aria-hidden="true" className="text-[#98A2B3]">
                  /
                </li>
                <li aria-current="page" className="text-[#101828]">
                  Stores
                </li>
              </ol>
            </nav>

            {/* Eyebrow */}
            <span
              style={{
                fontSize: "10px",
                fontWeight: 800,
                letterSpacing: "1.6px",
                color: "#936D00",
              }}
              className="uppercase leading-none"
            >
              AROUND THE CORNER
            </span>

            {/* H1 */}
            <h1
              style={{
                letterSpacing: "-1.6px",
              }}
              className="font-extrabold text-[32px] sm:text-[38px] md:text-[44px] leading-[40px] sm:leading-[46px] md:leading-[52px] text-[#101828] m-0"
            >
              Shop from <span style={{ color: "#D49400" }}>nearby stores</span>
            </h1>

            {/* Subtitle */}
            <p
              style={{
                fontSize: "16px",
                lineHeight: "26px",
                fontWeight: 500,
                color: "#475467",
              }}
              className="m-0"
            >
              Order from the stores near you and get it delivered fast.
            </p>
          </div>
        </section>

        {/* 2. TOOLBAR (Filter chips on left, count & sort on right) */}
        <section className="w-full px-6 sm:px-12 lg:px-[112px] pt-[28px]">
          <div className="max-w-[1216px] mx-auto flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            {/* Left: Filter Chips */}
            <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-1">
              {filterChips.map((chip) => {
                const isActive = activeFilter === chip.id;
                return (
                  <button
                    key={chip.id}
                    type="button"
                    onClick={() => setActiveFilter(chip.id)}
                    aria-pressed={isActive}
                    style={{
                      backgroundColor: isActive ? "#F5B800" : "#FFFFFF",
                      border: isActive ? "0.8px solid #F5B800" : "0.8px solid #E7E8E5",
                      color: "#101828",
                      fontWeight: isActive ? 800 : 600,
                      padding: "9px 18px",
                      fontSize: "13px",
                      borderRadius: "999px",
                    }}
                    className="whitespace-nowrap cursor-pointer transition-colors shadow-2xs hover:bg-[#F5B800]/20 focus:outline-hidden focus-visible:ring-2 focus-visible:ring-[#F5B800] focus-visible:ring-offset-2"
                  >
                    {chip.label}
                  </button>
                );
              })}
            </div>

            {/* Right: Count + Sort By */}
            <div className="flex items-center gap-4 shrink-0">
              <span className="text-[13px] font-semibold text-[#667085]">
                {filteredAndSortedStores.length} {filteredAndSortedStores.length === 1 ? "store" : "stores"}
              </span>

              {/* Sort By Custom Themed Dropdown */}
              <div className="relative inline-flex items-center" ref={sortDropdownRef}>
                <button
                  type="button"
                  onClick={() => setSortDropdownOpen((prev) => !prev)}
                  aria-haspopup="listbox"
                  aria-expanded={sortDropdownOpen}
                  className={`inline-flex items-center justify-between gap-2.5 border rounded-full px-4 py-1.5 text-[13px] font-[600] text-[#101828] bg-white cursor-pointer transition-all shadow-2xs hover:bg-[#F9FAFB] focus:outline-none select-none ${
                    sortDropdownOpen
                      ? "border-[#F5B800] ring-2 ring-[#F5B800]/20"
                      : "border-[#E7E8E5]"
                  }`}
                >
                  <span>
                    {STORE_SORT_OPTIONS.find((o) => o.value === sortBy)?.label || sortBy}
                  </span>
                  <ChevronDown
                    size={14}
                    strokeWidth={2.2}
                    className={`text-[#101828] transition-transform duration-200 shrink-0 ${
                      sortDropdownOpen ? "rotate-180" : ""
                    }`}
                  />
                </button>

                {sortDropdownOpen && (
                  <div
                    role="listbox"
                    className="absolute right-0 top-full mt-2 z-50 min-w-[210px] bg-white border border-[#E7E8E5] rounded-2xl p-1.5 shadow-[0_12px_30px_rgba(16,24,40,0.12)] animate-scale-up"
                    style={{ fontFamily: "'Manrope', sans-serif" }}
                  >
                    {STORE_SORT_OPTIONS.map((opt) => {
                      const isSelected = opt.value === sortBy;
                      return (
                        <button
                          key={opt.value}
                          type="button"
                          role="option"
                          aria-selected={isSelected}
                          onClick={() => {
                            setSortBy(opt.value);
                            setSortDropdownOpen(false);
                          }}
                          className={`w-full flex items-center justify-between px-3.5 py-2 text-[13px] rounded-xl text-left transition-colors cursor-pointer select-none ${
                            isSelected
                              ? "bg-[#FFF4DA] text-[#101828] font-bold"
                              : "text-[#101828] hover:bg-[#F4F5F8] font-semibold"
                          }`}
                        >
                          <span>{opt.label}</span>
                          {isSelected && (
                            <Check
                              size={15}
                              strokeWidth={2.4}
                              className="text-[#D49400] shrink-0 ml-2"
                            />
                          )}
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>

        {/* 3. STORES GRID (4 columns, gap 16px, padding 24px 112px 72px) */}
        <section className="w-full px-6 sm:px-12 lg:px-[112px] pt-[24px] pb-[72px]">
          <div className="max-w-[1216px] mx-auto">
            {filteredAndSortedStores.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
                {filteredAndSortedStores.map((store) => (
                  <StoreCard
                    key={store.slug}
                    store={store}
                    className="!w-full !min-w-0 !max-w-none"
                  />
                ))}
              </div>
            ) : (
              /* Empty Filter Results State */
              <div
                style={{
                  border: "0.8px solid #E7E8E5",
                  borderRadius: "24px",
                  padding: "64px 24px",
                }}
                className="w-full text-center bg-[#F9FAFB] flex flex-col items-center justify-center gap-3"
              >
                <p className="text-[16px] font-bold text-[#101828] m-0">
                  No stores match these filters
                </p>
                <button
                  type="button"
                  onClick={clearFilters}
                  style={{
                    backgroundColor: "#F5B800",
                    color: "#101828",
                    borderRadius: "999px",
                    padding: "10px 20px",
                    fontSize: "13px",
                    fontWeight: 800,
                  }}
                  className="cursor-pointer hover:brightness-105 transition-all shadow-xs focus:outline-hidden focus-visible:ring-2 focus-visible:ring-[#101828] focus-visible:ring-offset-2"
                >
                  Clear filters
                </button>
              </div>
            )}
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
