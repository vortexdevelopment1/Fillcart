import dotenv from "dotenv";
dotenv.config();

import { prisma } from "../src/db/prisma.js";
import { SHOP_BY_CATEGORY } from "../src/data/shopByCategory.js";
import { categoryPages } from "../src/data/categoryPageData.js";
import { stores } from "../src/data/storesData.js";
import { homeBanners } from "../src/data/homeBannersData.js";
import { bankOffers, walletOffers } from "../src/data/paymentOffersData.js";
import {
  popularRightNow,
  homeEssentials,
  dailyCare,
  frozenFood,
} from "../src/data/homeProductsData.js";
import { POPULAR_PRODUCTS } from "../src/data/popularProducts.js";
import { CHILL_FROZEN_PRODUCTS } from "../src/data/chillFrozenProducts.js";
import { DAILY_CARE_PRODUCTS } from "../src/data/dailyCareProducts.js";
import { HOME_ESSENTIALS_PRODUCTS } from "../src/data/homeEssentialsProducts.js";
import { toSlug } from "../src/data/productLookup.js";

async function main() {
  console.log("🌱 Starting customer database seeding...");

  // 1. Seed Categories
  console.log("Seeding categories...");
  const categoryMap = new Map();

  // Primary categories from SHOP_BY_CATEGORY (exact Figma order and tokens)
  for (const cat of SHOP_BY_CATEGORY) {
    const slug = cat.slug;
    const category = await prisma.category.upsert({
      where: { slug },
      update: {
        name: cat.label,
        position: cat.position,
        imageUrl: cat.image,
        colorToken: cat.colorToken,
        isFeatured: true,
        isActive: true,
      },
      create: {
        slug,
        name: cat.label,
        position: cat.position,
        imageUrl: cat.image,
        colorToken: cat.colorToken,
        isFeatured: true,
        isActive: true,
      },
    });
    categoryMap.set(slug, category.id);
    if (cat.alternateSlugs) {
      for (const alt of cat.alternateSlugs) {
        categoryMap.set(alt, category.id);
      }
    }
  }

  // Any remaining categories from categoryPages
  let extraPos = 20;
  for (const [key, pageData] of Object.entries(categoryPages)) {
    const slug = key;
    if (!categoryMap.has(slug)) {
      const name = pageData.hero?.titleHighlight || pageData.hero?.title || key;
      const category = await prisma.category.upsert({
        where: { slug },
        update: {
          name,
          subtitle: pageData.hero?.subtitle || null,
          position: extraPos++,
          imageUrl: pageData.hero?.image || null,
          isActive: true,
        },
        create: {
          slug,
          name,
          subtitle: pageData.hero?.subtitle || null,
          position: extraPos++,
          imageUrl: pageData.hero?.image || null,
          isActive: true,
        },
      });
      categoryMap.set(slug, category.id);
    }
  }
  console.log(`✓ Seeded ${categoryMap.size} categories.`);

  // 2. Seed Stores
  console.log("Seeding stores...");
  const storeMap = new Map();

  for (const st of stores) {
    const slug = st.slug;
    const delivMin = parseInt(String(st.deliveryTime || "20").replace(/[^0-9]/g, "")) || 20;
    const revCount = parseInt(String(st.ratingCount || "0").replace(/[^0-9]/g, "")) || 0;

    const store = await prisma.store.upsert({
      where: { slug },
      update: {
        name: st.name,
        category: st.tags || st.eyebrow || "Grocery & Essentials",
        rating: st.rating || 4.8,
        reviewCount: revCount,
        address: st.address && st.address !== "[Shop no., street, area, city, PIN]" ? st.address : "Indore, Madhya Pradesh",
        deliveryTimeMin: delivMin,
        deliveryTimeMax: delivMin + 10,
        minOrderAmount: st.minOrder || 0,
        freeDeliveryThreshold: st.freeDeliveryAbove || 199,
        phone: st.phone && st.phone !== "[Phone number]" ? st.phone : "+91 98765 43210",
        openHours: st.hours || "7 AM – 11 PM",
        coverImageUrl: st.cover || null,
        logoImageUrl: st.logo || null,
        isActive: true,
      },
      create: {
        slug,
        name: st.name,
        category: st.tags || st.eyebrow || "Grocery & Essentials",
        rating: st.rating || 4.8,
        reviewCount: revCount,
        address: st.address && st.address !== "[Shop no., street, area, city, PIN]" ? st.address : "Indore, Madhya Pradesh",
        deliveryTimeMin: delivMin,
        deliveryTimeMax: delivMin + 10,
        minOrderAmount: st.minOrder || 0,
        freeDeliveryThreshold: st.freeDeliveryAbove || 199,
        phone: st.phone && st.phone !== "[Phone number]" ? st.phone : "+91 98765 43210",
        openHours: st.hours || "7 AM – 11 PM",
        coverImageUrl: st.cover || null,
        logoImageUrl: st.logo || null,
        isActive: true,
      },
    });
    storeMap.set(slug, store.id);
  }
  console.log(`✓ Seeded ${storeMap.size} stores.`);

  const defaultStoreId = storeMap.get("fresh-mart-supermarket") || storeMap.values().next().value;

  // 3. Merge and Seed Products
  console.log("Merging and seeding products across all source lists...");

  const mergedProducts = new Map();

  function addOrMergeProduct(rawProd, flagOverrides = {}) {
    if (!rawProd) return;
    const slug = rawProd.slug || toSlug(rawProd.name);
    if (!slug) return;

    const existing = mergedProducts.get(slug);
    if (!existing) {
      mergedProducts.set(slug, {
        slug,
        name: rawProd.name,
        brand: rawProd.brand || "Local",
        price: Number(rawProd.price) || 0,
        mrp: Number(rawProd.oldPrice) || Number(rawProd.mrp) || Number(rawProd.price) || 0,
        unit: rawProd.unit || "1 unit",
        description: rawProd.description || `Fresh and verified ${rawProd.name} delivered quickly to your doorstep.`,
        rating: Number(rawProd.rating) || 4.8,
        reviewCount: parseInt(String(rawProd.ratingCount || rawProd.reviewCount || "0").replace(/[^0-9]/g, "")) || 0,
        inStock: rawProd.inStock !== false,
        primaryImageUrl: rawProd.image || rawProd.primaryImageUrl || null,
        galleryImageUrls: (rawProd.image || rawProd.primaryImageUrl) ? [rawProd.image || rawProd.primaryImageUrl] : [],
        categorySlug: rawProd.categorySlug || rawProd.categoryKey || rawProd.section || null,
        isPopular: Boolean(flagOverrides.isPopular || rawProd.isPopular),
        isHomeEssential: Boolean(flagOverrides.isHomeEssential || rawProd.isHomeEssential),
        isDailyCare: Boolean(flagOverrides.isDailyCare || rawProd.isDailyCare),
        isFrozen: Boolean(flagOverrides.isFrozen || rawProd.isFrozen),
      });
    } else {
      // 1. Flags are OR-ed: if either list flagged it true, keep it true
      if (flagOverrides.isPopular || rawProd.isPopular) existing.isPopular = true;
      if (flagOverrides.isHomeEssential || rawProd.isHomeEssential) existing.isHomeEssential = true;
      if (flagOverrides.isDailyCare || rawProd.isDailyCare) existing.isDailyCare = true;
      if (flagOverrides.isFrozen || rawProd.isFrozen) existing.isFrozen = true;

      // 2. Non-empty field resolution: better/non-empty data wins
      if (rawProd.name && !existing.name) existing.name = rawProd.name;
      if (rawProd.brand && rawProd.brand !== "Local" && (!existing.brand || existing.brand === "Local")) {
        existing.brand = rawProd.brand;
      }
      if ((Number(rawProd.price) || 0) > 0 && !existing.price) {
        existing.price = Number(rawProd.price);
      }
      if ((Number(rawProd.oldPrice) || Number(rawProd.mrp) || 0) > 0 && !existing.mrp) {
        existing.mrp = Number(rawProd.oldPrice) || Number(rawProd.mrp);
      }
      if (rawProd.unit && (!existing.unit || existing.unit === "1 unit")) {
        existing.unit = rawProd.unit;
      }
      if (rawProd.description && !existing.description) {
        existing.description = rawProd.description;
      }
      if ((rawProd.image || rawProd.primaryImageUrl) && !existing.primaryImageUrl) {
        existing.primaryImageUrl = rawProd.image || rawProd.primaryImageUrl;
        existing.galleryImageUrls = [existing.primaryImageUrl];
      }
      if (rawProd.rating && (!existing.rating || existing.rating === 4.8)) {
        existing.rating = Number(rawProd.rating);
      }
      const revCount = parseInt(String(rawProd.ratingCount || rawProd.reviewCount || "0").replace(/[^0-9]/g, ""));
      if (revCount > existing.reviewCount) {
        existing.reviewCount = revCount;
      }
      if (!existing.categorySlug && (rawProd.categorySlug || rawProd.categoryKey || rawProd.section)) {
        existing.categorySlug = rawProd.categorySlug || rawProd.categoryKey || rawProd.section;
      }
    }
  }

  // A. Ingest specialized lists with their guaranteed flags
  for (const p of popularRightNow) addOrMergeProduct(p, { isPopular: true });
  for (const p of POPULAR_PRODUCTS) addOrMergeProduct(p, { isPopular: true });

  for (const p of homeEssentials) addOrMergeProduct(p, { isHomeEssential: true });
  for (const p of HOME_ESSENTIALS_PRODUCTS) addOrMergeProduct(p, { isHomeEssential: true });

  for (const p of dailyCare) addOrMergeProduct(p, { isDailyCare: true });
  for (const p of DAILY_CARE_PRODUCTS) addOrMergeProduct(p, { isDailyCare: true });

  for (const p of frozenFood) addOrMergeProduct(p, { isFrozen: true });
  for (const p of CHILL_FROZEN_PRODUCTS) addOrMergeProduct(p, { isFrozen: true });

  // B. Ingest Category Pages products
  let catProductCount = 0;
  for (const [catSlug, catData] of Object.entries(categoryPages)) {
    for (const p of (catData.products || [])) {
      catProductCount++;
      addOrMergeProduct({ ...p, categorySlug: p.categorySlug || catSlug });
    }
  }

  // C. Ingest Stores products
  let storeProductCount = 0;
  for (const s of stores) {
    for (const sec of (s.sections || [])) {
      for (const p of (sec.products || [])) {
        if (p) {
          storeProductCount++;
          addOrMergeProduct(p);
        }
      }
    }
  }

  // D. Upsert merged products into the database
  let seededProductCount = 0;
  for (const prod of mergedProducts.values()) {
    // Resolve category id
    let categoryId = null;
    if (prod.categorySlug && categoryMap.has(prod.categorySlug)) {
      categoryId = categoryMap.get(prod.categorySlug);
    } else if (categoryMap.has("grocery")) {
      categoryId = categoryMap.get("grocery");
    }

    const updateData = {
      name: prod.name,
      brand: prod.brand,
      price: prod.price,
      mrp: prod.mrp,
      unit: prod.unit,
      description: prod.description,
      rating: prod.rating,
      reviewCount: prod.reviewCount,
      inStock: prod.inStock,
      countInStock: 50,
      primaryImageUrl: prod.primaryImageUrl,
      galleryImageUrls: prod.galleryImageUrls,
      categoryId,
      storeId: defaultStoreId,
      isActive: true,
    };

    // Update rule: never overwrite true flags with false
    if (prod.isPopular) updateData.isPopular = true;
    if (prod.isHomeEssential) updateData.isHomeEssential = true;
    if (prod.isDailyCare) updateData.isDailyCare = true;
    if (prod.isFrozen) updateData.isFrozen = true;

    await prisma.product.upsert({
      where: { slug: prod.slug },
      update: updateData,
      create: {
        slug: prod.slug,
        name: prod.name,
        brand: prod.brand,
        price: prod.price,
        mrp: prod.mrp,
        unit: prod.unit,
        description: prod.description,
        rating: prod.rating,
        reviewCount: prod.reviewCount,
        inStock: prod.inStock,
        countInStock: 50,
        primaryImageUrl: prod.primaryImageUrl,
        galleryImageUrls: prod.galleryImageUrls,
        categoryId,
        storeId: defaultStoreId,
        isPopular: prod.isPopular,
        isHomeEssential: prod.isHomeEssential,
        isDailyCare: prod.isDailyCare,
        isFrozen: prod.isFrozen,
        isActive: true,
      },
    });
    seededProductCount++;
  }
  console.log(`✓ Upserted ${seededProductCount} unique products.`);

  // 4. Seed Store-Product Many-to-Many Links
  console.log("Linking products to stores (StoreProduct)...");
  const allDbProducts = await prisma.product.findMany({
    select: { id: true, slug: true },
  });
  const productSlugToId = new Map(allDbProducts.map((p) => [p.slug, p.id]));

  const storeProductSummary = {};

  for (const st of stores) {
    const storeId = storeMap.get(st.slug);
    if (!storeId) {
      console.warn(`[StoreProduct] Warning: Store '${st.slug}' not found in database.`);
      continue;
    }

    const storeProductSlugs = new Set();
    for (const sec of (st.sections || [])) {
      for (const p of (sec.products || [])) {
        if (p) {
          const slug = p.slug || toSlug(p.name);
          if (slug) storeProductSlugs.add(slug);
        }
      }
    }

    const storeProductRows = [];
    for (const slug of storeProductSlugs) {
      const productId = productSlugToId.get(slug);
      if (!productId) {
        console.warn(`[StoreProduct] Warning: Product slug '${slug}' in store '${st.slug}' not found in products table.`);
        continue;
      }
      storeProductRows.push({
        storeId,
        productId,
      });
    }

    if (storeProductRows.length > 0) {
      await prisma.storeProduct.createMany({
        data: storeProductRows,
        skipDuplicates: true,
      });
    }

    storeProductSummary[st.slug] = storeProductRows.length;
  }

  console.log("\n================ Store Products Link Summary ================");
  for (const [storeSlug, count] of Object.entries(storeProductSummary)) {
    console.log(`  - ${storeSlug}: ${count} products linked`);
  }
  console.log("=============================================================\n");

  // 5. Seed Banners
  console.log("Seeding banners...");
  let bannerCount = 0;
  for (let i = 0; i < homeBanners.length; i++) {
    const b = homeBanners[i];
    if (b.type === "promo") {
      const existing = await prisma.banner.findFirst({
        where: { placement: "home_hero", title: (b.titleLines || []).join(" ") },
      });

      const title = (b.titleLines || []).join(" ") || "Special Promo";
      const subtitle = (b.subtitleLines || []).join(" ");

      if (existing) {
        await prisma.banner.update({
          where: { id: existing.id },
          data: {
            subtitle,
            imageUrl: b.image || null,
            targetUrl: b.ctaTo || "/category/grocery",
            displayOrder: i + 1,
            isActive: true,
          },
        });
      } else {
        await prisma.banner.create({
          data: {
            placement: "home_hero",
            title,
            subtitle,
            tag: b.ctaLabel || "Shop Now",
            imageUrl: b.image || null,
            targetUrl: b.ctaTo || "/category/grocery",
            displayOrder: i + 1,
            isActive: true,
          },
        });
      }
      bannerCount++;
    }
  }
  console.log(`✓ Seeded ${bannerCount} banners.`);

  // 5. Seed Offers
  console.log("Seeding payment offers...");
  let offerCount = 0;
  const allOffers = [
    ...bankOffers.map((o) => ({ ...o, type: "BANK" })),
    ...walletOffers.map((o) => ({ ...o, type: "WALLET" })),
  ];

  for (const off of allOffers) {
    const existing = await prisma.offer.findFirst({
      where: { code: off.code },
    });

    const description = (off.details || []).join(" • ");

    if (existing) {
      await prisma.offer.update({
        where: { id: existing.id },
        data: {
          type: off.type,
          partnerName: off.name,
          title: off.headline,
          discountText: off.headline,
          description,
          isActive: true,
        },
      });
    } else {
      await prisma.offer.create({
        data: {
          type: off.type,
          partnerName: off.name,
          code: off.code,
          title: off.headline,
          discountText: off.headline,
          description,
          isActive: true,
        },
      });
    }
    offerCount++;
  }
  console.log(`✓ Seeded ${offerCount} payment offers.`);

  // 6. Seed Test & Promotional Coupons
  if (prisma.coupon) {
    console.log("Seeding coupons...");
    const sampleCoupons = [
      {
        code: "WELCOME10",
        description: "10% off on your order up to ₹100",
        discountType: "PERCENT",
        discountValue: 10,
        minOrderValue: 0,
        maxDiscount: 100,
        perUserLimit: 1,
        isActive: true,
      },
      {
        code: "FLAT50",
        description: "Flat ₹50 off on orders above ₹499",
        discountType: "FLAT",
        discountValue: 50,
        minOrderValue: 499,
        maxDiscount: null,
        perUserLimit: 2,
        isActive: true,
      },
      {
        code: "EXPIRED20",
        description: "Expired 20% discount voucher",
        discountType: "PERCENT",
        discountValue: 20,
        minOrderValue: 100,
        maxDiscount: 200,
        expiresAt: new Date("2024-01-01T00:00:00.000Z"),
        perUserLimit: 1,
        isActive: true,
      },
      {
        code: "INACTIVE100",
        description: "Inactive promotional discount voucher",
        discountType: "FLAT",
        discountValue: 100,
        minOrderValue: 200,
        perUserLimit: 1,
        isActive: false,
      },
      {
        code: "FREEDEL",
        description: "Free delivery discount (waives standard delivery charge)",
        discountType: "FLAT",
        discountValue: 39,
        minOrderValue: 199,
        perUserLimit: 5,
        isActive: true,
      },
      {
        code: "ONCEONLY",
        description: "One-time customer reward coupon",
        discountType: "FLAT",
        discountValue: 25,
        minOrderValue: 50,
        perUserLimit: 1,
        isActive: true,
      },
    ];

    let couponCount = 0;
    for (const c of sampleCoupons) {
      await prisma.coupon.upsert({
        where: { code: c.code },
        update: {
          description: c.description,
          discountType: c.discountType,
          discountValue: c.discountValue,
          minOrderValue: c.minOrderValue,
          maxDiscount: c.maxDiscount,
          expiresAt: c.expiresAt || null,
          perUserLimit: c.perUserLimit,
          isActive: c.isActive,
        },
        create: {
          code: c.code,
          description: c.description,
          discountType: c.discountType,
          discountValue: c.discountValue,
          minOrderValue: c.minOrderValue,
          maxDiscount: c.maxDiscount,
          expiresAt: c.expiresAt || null,
          perUserLimit: c.perUserLimit,
          isActive: c.isActive,
        },
      });
      couponCount++;
    }
    console.log(`✓ Seeded ${couponCount} promotional coupons.`);
  }

  // Summary calculation
  let popularCount = 0;
  let homeEssentialCount = 0;
  let dailyCareCount = 0;
  let frozenCount = 0;

  for (const p of mergedProducts.values()) {
    if (p.isPopular) popularCount++;
    if (p.isHomeEssential) homeEssentialCount++;
    if (p.isDailyCare) dailyCareCount++;
    if (p.isFrozen) frozenCount++;
  }

  console.log("\n================ Product Seeding Summary ================");
  console.log("Source Lists Count:");
  console.log(`  - popularProducts.js (POPULAR_PRODUCTS): ${POPULAR_PRODUCTS.length}`);
  console.log(`  - homeProductsData.js (popularRightNow): ${popularRightNow.length}`);
  console.log(`  - homeEssentialsProducts.js (HOME_ESSENTIALS_PRODUCTS): ${HOME_ESSENTIALS_PRODUCTS.length}`);
  console.log(`  - homeProductsData.js (homeEssentials): ${homeEssentials.length}`);
  console.log(`  - dailyCareProducts.js (DAILY_CARE_PRODUCTS): ${DAILY_CARE_PRODUCTS.length}`);
  console.log(`  - homeProductsData.js (dailyCare): ${dailyCare.length}`);
  console.log(`  - chillFrozenProducts.js (CHILL_FROZEN_PRODUCTS): ${CHILL_FROZEN_PRODUCTS.length}`);
  console.log(`  - homeProductsData.js (frozenFood): ${frozenFood.length}`);
  console.log(`  - categoryPages (${Object.keys(categoryPages).length} categories): ${catProductCount}`);
  console.log(`  - stores (${stores.length} stores): ${storeProductCount}`);
  console.log("---------------------------------------------------------");
  console.log(`Unique Slugs Merged: ${mergedProducts.size}`);
  console.log("Database Flags Total (sent to database):");
  console.log(`  - is_popular: ${popularCount}`);
  console.log(`  - is_home_essential: ${homeEssentialCount}`);
  console.log(`  - is_daily_care: ${dailyCareCount}`);
  console.log(`  - is_frozen: ${frozenCount}`);
  console.log("=========================================================\n");

  console.log("✅ Customer database seeding completed successfully!");
}

main()
  .catch((e) => {
    console.error("❌ Seeding failed with error:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect?.();
  });
