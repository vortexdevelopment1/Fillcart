-- CreateTable
CREATE TABLE "store_products" (
    "store_id" TEXT NOT NULL,
    "product_id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "store_products_pkey" PRIMARY KEY ("store_id","product_id")
);

-- CreateIndex
CREATE INDEX "store_products_store_id_idx" ON "store_products"("store_id");

-- CreateIndex
CREATE INDEX "store_products_product_id_idx" ON "store_products"("product_id");

-- AddForeignKey
ALTER TABLE "store_products" ADD CONSTRAINT "store_products_store_id_fkey" FOREIGN KEY ("store_id") REFERENCES "stores"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "store_products" ADD CONSTRAINT "store_products_product_id_fkey" FOREIGN KEY ("product_id") REFERENCES "products"("id") ON DELETE CASCADE ON UPDATE CASCADE;
