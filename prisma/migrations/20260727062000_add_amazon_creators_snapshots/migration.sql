-- Short-lived, product-only Creators API cache. No customer information,
-- credentials, or edited Amazon-vended URLs are stored here.

CREATE TABLE "AmazonProductSnapshot" (
    "id" TEXT NOT NULL,
    "site" TEXT NOT NULL,
    "market" TEXT NOT NULL,
    "productSlug" TEXT NOT NULL,
    "asin" TEXT NOT NULL,
    "marketplace" TEXT NOT NULL,
    "detailPageUrl" TEXT,
    "title" TEXT,
    "imageUrl" TEXT,
    "features" JSONB,
    "parentAsin" TEXT,
    "fetchedAt" TIMESTAMP(3) NOT NULL,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "lastErrorCode" TEXT,
    "lastErrorAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "AmazonProductSnapshot_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "AmazonProductSnapshot_site_market_productSlug_key"
    ON "AmazonProductSnapshot"("site", "market", "productSlug");

CREATE INDEX "AmazonProductSnapshot_marketplace_asin_idx"
    ON "AmazonProductSnapshot"("marketplace", "asin");

CREATE INDEX "AmazonProductSnapshot_expiresAt_idx"
    ON "AmazonProductSnapshot"("expiresAt");
