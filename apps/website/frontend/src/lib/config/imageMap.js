/**
 * FillCarts Image Map Configuration
 * Single source of truth for all mapped image assets across the application.
 * UI ONLY project: values are public asset paths served from public/.
 * 
 * Keys with confirmed matching files are set to their public path.
 * Keys where no local matching file exists are explicitly set to null.
 */

export const imageMap = {
  // 1. STORE COVERS & STORE LOGOS
  storeCover: {
    // 5 Figma sequence stores
    "fresh-mart-supermarket": "https://res.cloudinary.com/l44x18ko/image/upload/v1795688075/fillcart/stores/fresh-mart-supermarket-cover.png",
    freshmart: "https://res.cloudinary.com/l44x18ko/image/upload/v1795688076/fillcart/stores/freshmart-cover.png",
    "fresh-mart": "https://res.cloudinary.com/l44x18ko/image/upload/v1795688075/fillcart/stores/fresh-mart-supermarket-cover.png",
    "fresh-market": "https://res.cloudinary.com/l44x18ko/image/upload/v1795688075/fillcart/stores/fresh-mart-supermarket-cover.png",
    freshMarket: "https://res.cloudinary.com/l44x18ko/image/upload/v1795688075/fillcart/stores/fresh-mart-supermarket-cover.png",

    "daily-needs-express": "https://res.cloudinary.com/l44x18ko/image/upload/v1795688075/fillcart/stores/daily-needs-express-cover.png",
    "daily-needs": "https://res.cloudinary.com/l44x18ko/image/upload/v1795688074/fillcart/stores/daily-needs-cover.png",
    dailyFreshOrganics: "https://res.cloudinary.com/l44x18ko/image/upload/v1795688075/fillcart/stores/daily-needs-express-cover.png",
    "daily-fresh-organics": "https://res.cloudinary.com/l44x18ko/image/upload/v1795688075/fillcart/stores/daily-needs-express-cover.png",

    "indore-grocery": "https://res.cloudinary.com/l44x18ko/image/upload/v1795688081/fillcart/stores/indore-grocery-cover.png",
    "green-leaf-farm-organics": "https://res.cloudinary.com/l44x18ko/image/upload/v1795688076/fillcart/stores/green-leaf-farm-organics-cover.png",
    organicGreens: "https://res.cloudinary.com/l44x18ko/image/upload/v1795688076/fillcart/stores/green-leaf-farm-organics-cover.png",
    "organic-greens": "https://res.cloudinary.com/l44x18ko/image/upload/v1795688076/fillcart/stores/green-leaf-farm-organics-cover.png",

    "sharma-super-store": "https://res.cloudinary.com/l44x18ko/image/upload/v1795688083/fillcart/stores/sharma-super-store-cover.png",
    "medplus-pharmacy-wellness": "https://res.cloudinary.com/l44x18ko/image/upload/v1795688082/fillcart/stores/medplus-pharmacy-wellness-cover.png",
    wellnessCornerPharmacy: "https://res.cloudinary.com/l44x18ko/image/upload/v1795688082/fillcart/stores/medplus-pharmacy-wellness-cover.png",
    "wellness-corner-pharmacy": "https://res.cloudinary.com/l44x18ko/image/upload/v1795688082/fillcart/stores/medplus-pharmacy-wellness-cover.png",

    "city-mart": "https://res.cloudinary.com/l44x18ko/image/upload/v1795688074/fillcart/stores/city-mart-cover.png",
    "city-artisan-bakery": "https://res.cloudinary.com/l44x18ko/image/upload/v1795688074/fillcart/stores/city-artisan-bakery-cover.png",
    cityArtisanBakery: "https://res.cloudinary.com/l44x18ko/image/upload/v1795688074/fillcart/stores/city-artisan-bakery-cover.png",
  },
  storeLogo: {
    "fresh-mart-supermarket": "/images/stores/fresh-mart-logo.svg",
    freshmart: "/images/stores/fresh-mart-logo.svg",
    "fresh-market": "/images/stores/fresh-mart-logo.svg",
    "fresh-mart": "/images/stores/fresh-mart-logo.svg",
    freshMarket: "/images/stores/fresh-mart-logo.svg",

    "daily-needs-express": "https://res.cloudinary.com/l44x18ko/image/upload/v1795688075/fillcart/stores/daily-needs-express-cover.png",
    "daily-needs": "https://res.cloudinary.com/l44x18ko/image/upload/v1795688074/fillcart/stores/daily-needs-cover.png",
    dailyFreshOrganics: "https://res.cloudinary.com/l44x18ko/image/upload/v1795688075/fillcart/stores/daily-needs-express-cover.png",
    "daily-fresh-organics": "https://res.cloudinary.com/l44x18ko/image/upload/v1795688075/fillcart/stores/daily-needs-express-cover.png",

    "indore-grocery": "https://res.cloudinary.com/l44x18ko/image/upload/v1795688081/fillcart/stores/indore-grocery-cover.png",
    "green-leaf-farm-organics": "https://res.cloudinary.com/l44x18ko/image/upload/v1795688076/fillcart/stores/green-leaf-farm-organics-cover.png",
    organicGreens: "https://res.cloudinary.com/l44x18ko/image/upload/v1795688076/fillcart/stores/green-leaf-farm-organics-cover.png",
    "organic-greens": "https://res.cloudinary.com/l44x18ko/image/upload/v1795688076/fillcart/stores/green-leaf-farm-organics-cover.png",

    "sharma-super-store": "https://res.cloudinary.com/l44x18ko/image/upload/v1795688083/fillcart/stores/sharma-super-store-cover.png",
    "medplus-pharmacy-wellness": "https://res.cloudinary.com/l44x18ko/image/upload/v1795688082/fillcart/stores/medplus-pharmacy-wellness-cover.png",
    wellnessCornerPharmacy: "https://res.cloudinary.com/l44x18ko/image/upload/v1795688082/fillcart/stores/medplus-pharmacy-wellness-cover.png",
    "wellness-corner-pharmacy": "https://res.cloudinary.com/l44x18ko/image/upload/v1795688082/fillcart/stores/medplus-pharmacy-wellness-cover.png",

    "city-mart": "https://res.cloudinary.com/l44x18ko/image/upload/v1795688074/fillcart/stores/city-mart-cover.png",
    "city-artisan-bakery": "https://res.cloudinary.com/l44x18ko/image/upload/v1795688074/fillcart/stores/city-artisan-bakery-cover.png",
    cityArtisanBakery: "https://res.cloudinary.com/l44x18ko/image/upload/v1795688074/fillcart/stores/city-artisan-bakery-cover.png",
  },

  // 2. CATEGORY TILES (Store Detail Page & Category Page - SVG Assets)
  categoryTile: {
    attaDalRice: "https://res.cloudinary.com/l44x18ko/image/upload/v1795688029/fillcart/categories/atta-dal-rice.svg",
    oilGheeMasala: "https://res.cloudinary.com/l44x18ko/image/upload/v1795688037/fillcart/categories/oil-ghee-masala.svg",
    dryFruitsBreakfast: "https://res.cloudinary.com/l44x18ko/image/upload/v1795688031/fillcart/categories/dry-fruits-breakfast.svg",
    fruitsVeggies: "https://res.cloudinary.com/l44x18ko/image/upload/v1795688037/fillcart/categories/fruits-veggies.svg",
    dairy: "https://res.cloudinary.com/l44x18ko/image/upload/v1795688041/fillcart/categories/dairy.svg",
    eggsMeatFish: "https://res.cloudinary.com/l44x18ko/image/upload/v1795688032/fillcart/categories/eggs-meat-fish.svg",
    snacksBeverages: "https://res.cloudinary.com/l44x18ko/image/upload/v1795688051/fillcart/categories/snacks-beverages.svg",
    biscuitsCookies: "https://res.cloudinary.com/l44x18ko/image/upload/v1795688030/fillcart/categories/biscuits-cookies.svg",
    fallback: "https://res.cloudinary.com/l44x18ko/image/upload/v1795688031/fillcart/categories/category-fallback.png",
  },

  // 3. HOME PAGE "SHOP BY CATEGORY" TILES (12 Figma Specified Cards)
  homeCategoryTile: {
    grocery: "https://res.cloudinary.com/l44x18ko/image/upload/v1795688047/fillcart/home/home-staples.png",
    dairy: "https://res.cloudinary.com/l44x18ko/image/upload/v1795688043/fillcart/home/home-dairy.png",
    chickenMeatFish: "https://res.cloudinary.com/l44x18ko/image/upload/v1795688046/fillcart/home/home-pet-care.png",
    electronics: "https://res.cloudinary.com/l44x18ko/image/upload/v1795688045/fillcart/home/home-meat.png",
    stationery: "https://res.cloudinary.com/l44x18ko/image/upload/v1795688044/fillcart/home/home-electronics.png",
    beauty: "https://res.cloudinary.com/l44x18ko/image/upload/v1795688047/fillcart/home/home-stationery.png",
    homeEssentials: "https://res.cloudinary.com/l44x18ko/image/upload/v1795688042/fillcart/home/home-beauty.png",
    dailyCare: "https://res.cloudinary.com/l44x18ko/image/upload/v1795688044/fillcart/home/home-essentials.png",
    fragranceGrooming: "https://res.cloudinary.com/l44x18ko/image/upload/v1795688042/fillcart/home/home-daily-care.png",
    sports: "https://res.cloudinary.com/l44x18ko/image/upload/v1795688046/fillcart/home/home-paan-corner.png",
    petCare: "https://res.cloudinary.com/l44x18ko/image/upload/v1795688047/fillcart/home/home-sports.png",
    paanCorner: "https://res.cloudinary.com/l44x18ko/image/upload/v1795688044/fillcart/home/home-fragrance.png",
  },

  // 4. PROMO BANNERS
  promoBanner: {
    dailyEssentials: "https://res.cloudinary.com/l44x18ko/image/upload/v1795688002/fillcart/banners/banner-cleaning-supplies.png",
    dealsOfTheDay: "https://res.cloudinary.com/l44x18ko/image/upload/v1795688016/fillcart/banners/deals-of-the-day.svg",
  },

  // 5. PAYMENT & SPECIAL OFFERS BANNERS
  offerBanner: {
    bankOffers: "https://res.cloudinary.com/l44x18ko/image/upload/v1795688051/fillcart/offers/offer-bank-cards.png",
    bankCardRed: "https://res.cloudinary.com/l44x18ko/image/upload/v1795688045/fillcart/home/home-frozen-food.png",
    bankCardPurple: "https://res.cloudinary.com/l44x18ko/image/upload/v1795688047/fillcart/home/home-pharma.png",
    walletCashback: "https://res.cloudinary.com/l44x18ko/image/upload/v1795688048/fillcart/home/home-wellness.png",
    walletCashbackAlt: "https://res.cloudinary.com/l44x18ko/image/upload/v1795688051/fillcart/offers/offer-wallet.png",
    comboOffer: "https://res.cloudinary.com/l44x18ko/image/upload/v1795688049/fillcart/home/home-organic.png",
  },

  // 6. HERO BANNERS & PAGE BACKGROUNDS
  hero: {
    home: "https://res.cloudinary.com/l44x18ko/image/upload/v1795688025/fillcart/banners/hero-banner.svg",
    categoryGrocery: "https://res.cloudinary.com/l44x18ko/image/upload/v1795688029/fillcart/banners/category-hero.svg",
    about: "https://res.cloudinary.com/l44x18ko/image/upload/v1795688013/fillcart/about/about-hero-bg.svg",
    aboutHeroPhoto: "https://res.cloudinary.com/l44x18ko/image/upload/v1795688001/fillcart/about/about-hero.jpg",
    contact: "https://res.cloudinary.com/l44x18ko/image/upload/v1795688040/fillcart/contact/contact-hero-bg.svg",
    riderPartner: "https://res.cloudinary.com/l44x18ko/image/upload/v1795688083/fillcart/stores/rider-partner-hero.jpg",
    ourStory: "https://res.cloudinary.com/l44x18ko/image/upload/v1795688000/fillcart/about/our-story-photo.jpg",
  },

  // 7. PRODUCT DEFAULTS & SPECIFIC PRODUCTS
  productDefault: "https://res.cloudinary.com/l44x18ko/image/upload/v1795688066/fillcart/products/placeholder.png",

  productImage: {
    // Staples & Grains
    atta: "https://res.cloudinary.com/l44x18ko/image/upload/v1795688073/fillcart/products/whole-wheat-atta-flour.svg",
    basmatiRice: "https://res.cloudinary.com/l44x18ko/image/upload/v1795688070/fillcart/products/royal-basmati-rice.svg",
    toorDal: "https://res.cloudinary.com/l44x18ko/image/upload/v1795688072/fillcart/products/toor-dal-pulses.svg",
    cookingOil: "https://res.cloudinary.com/l44x18ko/image/upload/v1795688054/fillcart/products/fortune-sunflower-oil.svg",
    sugar: "https://res.cloudinary.com/l44x18ko/image/upload/v1795688070/fillcart/products/refined-pure-sugar.svg",
    salt: "https://res.cloudinary.com/l44x18ko/image/upload/v1795688071/fillcart/products/tata-salt.svg",
    tea: "https://res.cloudinary.com/l44x18ko/image/upload/v1795688071/fillcart/products/tata-tea-gold.svg",
    instantNoodles: "https://res.cloudinary.com/l44x18ko/image/upload/v1795688061/fillcart/products/instant-noodles.svg",

    // Fruits & Vegetables
    tomato: "https://res.cloudinary.com/l44x18ko/image/upload/v1795688057/fillcart/products/fresh-tomato.svg",
    tomatoesOnVine: "https://res.cloudinary.com/l44x18ko/image/upload/v1795688072/fillcart/products/tomatoes-on-vine.svg",
    redOnion: "https://res.cloudinary.com/l44x18ko/image/upload/v1795688056/fillcart/products/fresh-red-onion.svg",
    potato: "https://res.cloudinary.com/l44x18ko/image/upload/v1795688067/fillcart/products/potato.png",
    carrot: "https://res.cloudinary.com/l44x18ko/image/upload/v1795688056/fillcart/products/fresh-carrots.svg",
    banana: "https://res.cloudinary.com/l44x18ko/image/upload/v1795688054/fillcart/products/fresh-banana-robusta.svg",
    capsicum: "https://res.cloudinary.com/l44x18ko/image/upload/v1795688059/fillcart/products/green-capsicum.svg",
    cauliflower: "https://res.cloudinary.com/l44x18ko/image/upload/v1795688056/fillcart/products/fresh-cauliflower.svg",
    cucumber: "https://res.cloudinary.com/l44x18ko/image/upload/v1795688053/fillcart/products/cucumber.png",
    greenPeas: "https://res.cloudinary.com/l44x18ko/image/upload/v1795688059/fillcart/products/garden-green-peas.png",
    apples: "https://res.cloudinary.com/l44x18ko/image/upload/v1795688067/fillcart/products/product-apples.svg",

    // Dairy & Bakery
    milk: "https://res.cloudinary.com/l44x18ko/image/upload/v1795688069/fillcart/products/product-milk.svg",
    eggs: "https://res.cloudinary.com/l44x18ko/image/upload/v1795688068/fillcart/products/product-eggs.png",
    bread: "https://res.cloudinary.com/l44x18ko/image/upload/v1795688069/fillcart/products/product-bread.png",
    oilBottle: "https://res.cloudinary.com/l44x18ko/image/upload/v1795688071/fillcart/products/product-oil.png",

    // Cleaning & Home Care
    citrusCleaner: "https://res.cloudinary.com/l44x18ko/image/upload/v1795688053/fillcart/products/citrus-surface-cleaner.png",
    naturalCleaningSpray: "https://res.cloudinary.com/l44x18ko/image/upload/v1795688064/fillcart/products/natural-cleaning-spray.png",
    glassCleaner: "https://res.cloudinary.com/l44x18ko/image/upload/v1795688058/fillcart/products/glass-cleaner.png",
    laundryDetergent: "https://res.cloudinary.com/l44x18ko/image/upload/v1795688068/fillcart/products/product-detergent.png",
    homeCareKit: "https://res.cloudinary.com/l44x18ko/image/upload/v1795688060/fillcart/products/home-care-kit.png",
    personalCareKit: "https://res.cloudinary.com/l44x18ko/image/upload/v1795688067/fillcart/products/personal-care-kit.png",
    kitchenScrubPads: "https://res.cloudinary.com/l44x18ko/image/upload/v1795688062/fillcart/products/kitchen-scrub-pads.png",

    // Personal Care & Grooming
    dailyFaceCleanser: "https://res.cloudinary.com/l44x18ko/image/upload/v1795688054/fillcart/products/daily-face-cleanser.png",
    everydaySkinDuo: "https://res.cloudinary.com/l44x18ko/image/upload/v1795688055/fillcart/products/everyday-skin-duo.png",
    freshBathEssentials: "https://res.cloudinary.com/l44x18ko/image/upload/v1795688056/fillcart/products/fresh-bath-essentials.png",
    hydratingBodyLotion: "https://res.cloudinary.com/l44x18ko/image/upload/v1795688060/fillcart/products/hydrating-body-lotion.png",
    nourishingShampoo: "https://res.cloudinary.com/l44x18ko/image/upload/v1795688065/fillcart/products/nourishing-shampoo.png",

    // Chill / Frozen Zone
    frenchFries: "https://res.cloudinary.com/l44x18ko/image/upload/v1795688052/fillcart/products/classic-french-fries.png",
    margheritaPizza: "https://res.cloudinary.com/l44x18ko/image/upload/v1795688063/fillcart/products/margherita-pizza.png",
    mixedVegetables: "https://res.cloudinary.com/l44x18ko/image/upload/v1795688065/fillcart/products/mixed-vegetables.png",
    readyMealBowl: "https://res.cloudinary.com/l44x18ko/image/upload/v1795688069/fillcart/products/ready-meal-bowl.png",
    iceCreamCone: "https://res.cloudinary.com/l44x18ko/image/upload/v1795688073/fillcart/products/vanilla-sprinkle-cone.png",
  },

  // 8. BRAND ICONS & APP BADGES
  brand: {
    logo: "/images/brand/logo.svg",
    logoYellow: "/Yellow theme logo.svg",
    cartButton: "/images/icons/cart-button.svg",
    googlePlay: "/images/icons/google-play-badge.svg",
    appStore: "/images/icons/app-store-badge.svg",
    favicon: "/favicon.ico",
  },
};

export default imageMap;
