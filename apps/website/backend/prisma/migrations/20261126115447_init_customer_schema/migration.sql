-- CreateTable
CREATE TABLE "stores" (
    "id" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "category" TEXT,
    "rating" DECIMAL(2,1) NOT NULL DEFAULT 4.8,
    "review_count" INTEGER NOT NULL DEFAULT 0,
    "address" TEXT,
    "latitude" DECIMAL(10,8),
    "longitude" DECIMAL(11,8),
    "delivery_time_min" INTEGER,
    "delivery_time_max" INTEGER,
    "min_order_amount" DECIMAL(10,2) NOT NULL DEFAULT 0,
    "free_delivery_threshold" DECIMAL(10,2) NOT NULL DEFAULT 299.00,
    "phone" TEXT,
    "open_hours" TEXT,
    "cover_image_url" TEXT,
    "logo_image_url" TEXT,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "stores_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "categories" (
    "id" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "subtitle" TEXT,
    "position" INTEGER NOT NULL DEFAULT 0,
    "icon_name" TEXT,
    "image_url" TEXT,
    "color_token" TEXT,
    "is_featured" BOOLEAN NOT NULL DEFAULT false,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "categories_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "products" (
    "id" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "brand" TEXT,
    "price" DECIMAL(10,2) NOT NULL,
    "mrp" DECIMAL(10,2) NOT NULL,
    "unit" TEXT NOT NULL,
    "description" TEXT,
    "rating" DECIMAL(2,1) NOT NULL DEFAULT 4.8,
    "review_count" INTEGER NOT NULL DEFAULT 0,
    "in_stock" BOOLEAN NOT NULL DEFAULT true,
    "count_in_stock" INTEGER NOT NULL DEFAULT 50,
    "primary_image_url" TEXT,
    "gallery_image_urls" JSONB,
    "nutritional_info" JSONB,
    "tags" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "is_popular" BOOLEAN NOT NULL DEFAULT false,
    "is_home_essential" BOOLEAN NOT NULL DEFAULT false,
    "is_daily_care" BOOLEAN NOT NULL DEFAULT false,
    "is_frozen" BOOLEAN NOT NULL DEFAULT false,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "category_id" TEXT,
    "store_id" TEXT,

    CONSTRAINT "products_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "banners" (
    "id" TEXT NOT NULL,
    "placement" TEXT NOT NULL DEFAULT 'home_hero',
    "title" TEXT NOT NULL,
    "subtitle" TEXT,
    "tag" TEXT,
    "image_url" TEXT,
    "target_url" TEXT,
    "display_order" INTEGER NOT NULL DEFAULT 0,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "expires_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "banners_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "offers" (
    "id" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "partner_name" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "discount_text" TEXT,
    "min_order" DECIMAL(10,2),
    "description" TEXT,
    "valid_until" TIMESTAMP(3),
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "offers_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "contact_messages" (
    "id" TEXT NOT NULL,
    "full_name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phone" TEXT,
    "subject" TEXT,
    "message" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'NEW',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "contact_messages_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "stores_slug_key" ON "stores"("slug");

-- CreateIndex
CREATE INDEX "stores_is_active_idx" ON "stores"("is_active");

-- CreateIndex
CREATE UNIQUE INDEX "categories_slug_key" ON "categories"("slug");

-- CreateIndex
CREATE INDEX "categories_position_idx" ON "categories"("position");

-- CreateIndex
CREATE UNIQUE INDEX "products_slug_key" ON "products"("slug");

-- CreateIndex
CREATE INDEX "products_category_id_idx" ON "products"("category_id");

-- CreateIndex
CREATE INDEX "products_store_id_idx" ON "products"("store_id");

-- CreateIndex
CREATE INDEX "products_is_popular_idx" ON "products"("is_popular");

-- CreateIndex
CREATE INDEX "banners_placement_is_active_display_order_idx" ON "banners"("placement", "is_active", "display_order");

-- CreateIndex
CREATE INDEX "offers_type_is_active_idx" ON "offers"("type", "is_active");

-- AddForeignKey
ALTER TABLE "products" ADD CONSTRAINT "products_category_id_fkey" FOREIGN KEY ("category_id") REFERENCES "categories"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "products" ADD CONSTRAINT "products_store_id_fkey" FOREIGN KEY ("store_id") REFERENCES "stores"("id") ON DELETE SET NULL ON UPDATE CASCADE;
