-- Costume catalog and CJ attribution boundary. Raw catalog rows remain separate
-- from editorial/indexing state so a full feed import cannot publish URLs.

CREATE TABLE "Merchant" (
    "id" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "network" TEXT NOT NULL,
    "advertiserCid" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "Merchant_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "MerchantProduct" (
    "id" TEXT NOT NULL,
    "merchantId" TEXT NOT NULL,
    "externalId" TEXT NOT NULL,
    "variantId" TEXT NOT NULL DEFAULT '',
    "sourceFeedId" TEXT,
    "slug" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "brand" TEXT,
    "productType" TEXT,
    "categorySlug" TEXT,
    "tags" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "audience" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "price" DECIMAL(12,2),
    "currency" TEXT NOT NULL DEFAULT 'USD',
    "availability" TEXT NOT NULL DEFAULT 'unknown',
    "destinationUrl" TEXT NOT NULL,
    "premium" BOOLEAN NOT NULL DEFAULT false,
    "professional" BOOLEAN NOT NULL DEFAULT false,
    "halloween" BOOLEAN NOT NULL DEFAULT false,
    "rental" BOOLEAN NOT NULL DEFAULT false,
    "firstSeenAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "lastSeenAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "sourceUpdatedAt" TIMESTAMP(3),
    "softRetiredAt" TIMESTAMP(3),
    "raw" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "MerchantProduct_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "MerchantProductImage" (
    "id" TEXT NOT NULL,
    "productId" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "position" INTEGER NOT NULL DEFAULT 0,
    "altText" TEXT,
    "usageStatus" TEXT NOT NULL DEFAULT 'pending',
    "permissionRef" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "MerchantProductImage_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "AffiliateLink" (
    "id" TEXT NOT NULL,
    "network" TEXT NOT NULL DEFAULT 'cj',
    "merchantId" TEXT NOT NULL,
    "merchantProductId" TEXT,
    "site" TEXT NOT NULL,
    "pid" TEXT NOT NULL,
    "aid" TEXT NOT NULL,
    "networkLinkId" TEXT,
    "clickToken" TEXT NOT NULL,
    "destinationUrl" TEXT NOT NULL,
    "trackingUrl" TEXT NOT NULL,
    "active" BOOLEAN NOT NULL DEFAULT false,
    "verifiedAt" TIMESTAMP(3),
    "lastCheckedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "AffiliateLink_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "EditorialProduct" (
    "id" TEXT NOT NULL,
    "merchantProductId" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'draft',
    "indexable" BOOLEAN NOT NULL DEFAULT false,
    "buyerJob" TEXT,
    "summary" TEXT,
    "guidance" JSONB,
    "evidence" JSONB,
    "curatedAt" TIMESTAMP(3),
    "publishedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "EditorialProduct_pkey" PRIMARY KEY ("id")
);

ALTER TABLE "AffiliateClick"
    ADD COLUMN "network" TEXT,
    ADD COLUMN "pid" TEXT,
    ADD COLUMN "aid" TEXT,
    ADD COLUMN "sid" TEXT,
    ADD COLUMN "destinationUrl" TEXT,
    ADD COLUMN "affiliateLinkId" TEXT,
    ADD COLUMN "merchantProductId" TEXT;

CREATE TABLE "AffiliateTransaction" (
    "id" TEXT NOT NULL,
    "network" TEXT NOT NULL DEFAULT 'cj',
    "externalActionId" TEXT NOT NULL,
    "merchantId" TEXT,
    "merchantProductId" TEXT,
    "affiliateClickId" TEXT,
    "sid" TEXT,
    "status" TEXT NOT NULL,
    "saleAmount" DECIMAL(14,2),
    "commissionAmount" DECIMAL(14,2) NOT NULL,
    "currency" TEXT NOT NULL DEFAULT 'USD',
    "eventAt" TIMESTAMP(3) NOT NULL,
    "lockingDate" TIMESTAMP(3),
    "sourceUpdatedAt" TIMESTAMP(3),
    "raw" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "AffiliateTransaction_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "ProductSyncRun" (
    "id" TEXT NOT NULL,
    "merchantId" TEXT NOT NULL,
    "source" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "cursor" TEXT,
    "seenCount" INTEGER NOT NULL DEFAULT 0,
    "insertedCount" INTEGER NOT NULL DEFAULT 0,
    "updatedCount" INTEGER NOT NULL DEFAULT 0,
    "retiredCount" INTEGER NOT NULL DEFAULT 0,
    "failedCount" INTEGER NOT NULL DEFAULT 0,
    "errorSummary" TEXT,
    "startedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "completedAt" TIMESTAMP(3),
    CONSTRAINT "ProductSyncRun_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "Merchant_slug_key" ON "Merchant"("slug");
CREATE UNIQUE INDEX "Merchant_network_advertiserCid_key" ON "Merchant"("network", "advertiserCid");
CREATE UNIQUE INDEX "MerchantProduct_slug_key" ON "MerchantProduct"("slug");
CREATE UNIQUE INDEX "MerchantProduct_merchantId_externalId_variantId_key" ON "MerchantProduct"("merchantId", "externalId", "variantId");
CREATE INDEX "MerchantProduct_merchantId_availability_lastSeenAt_idx" ON "MerchantProduct"("merchantId", "availability", "lastSeenAt");
CREATE INDEX "MerchantProduct_categorySlug_availability_idx" ON "MerchantProduct"("categorySlug", "availability");
CREATE INDEX "MerchantProduct_premium_professional_idx" ON "MerchantProduct"("premium", "professional");
CREATE INDEX "MerchantProduct_softRetiredAt_idx" ON "MerchantProduct"("softRetiredAt");
CREATE UNIQUE INDEX "MerchantProductImage_productId_url_key" ON "MerchantProductImage"("productId", "url");
CREATE INDEX "MerchantProductImage_productId_position_idx" ON "MerchantProductImage"("productId", "position");
CREATE INDEX "MerchantProductImage_usageStatus_idx" ON "MerchantProductImage"("usageStatus");
CREATE UNIQUE INDEX "AffiliateLink_clickToken_key" ON "AffiliateLink"("clickToken");
CREATE INDEX "AffiliateLink_merchantId_site_active_idx" ON "AffiliateLink"("merchantId", "site", "active");
CREATE INDEX "AffiliateLink_merchantProductId_active_idx" ON "AffiliateLink"("merchantProductId", "active");
CREATE INDEX "AffiliateLink_pid_aid_idx" ON "AffiliateLink"("pid", "aid");
CREATE UNIQUE INDEX "EditorialProduct_merchantProductId_key" ON "EditorialProduct"("merchantProductId");
CREATE UNIQUE INDEX "EditorialProduct_slug_key" ON "EditorialProduct"("slug");
CREATE INDEX "EditorialProduct_status_indexable_idx" ON "EditorialProduct"("status", "indexable");
CREATE UNIQUE INDEX "AffiliateClick_sid_key" ON "AffiliateClick"("sid");
CREATE INDEX "AffiliateClick_affiliateLinkId_createdAt_idx" ON "AffiliateClick"("affiliateLinkId", "createdAt");
CREATE INDEX "AffiliateClick_merchantProductId_createdAt_idx" ON "AffiliateClick"("merchantProductId", "createdAt");
CREATE UNIQUE INDEX "AffiliateTransaction_network_externalActionId_key" ON "AffiliateTransaction"("network", "externalActionId");
CREATE INDEX "AffiliateTransaction_merchantId_eventAt_idx" ON "AffiliateTransaction"("merchantId", "eventAt");
CREATE INDEX "AffiliateTransaction_merchantProductId_eventAt_idx" ON "AffiliateTransaction"("merchantProductId", "eventAt");
CREATE INDEX "AffiliateTransaction_affiliateClickId_idx" ON "AffiliateTransaction"("affiliateClickId");
CREATE INDEX "AffiliateTransaction_sid_idx" ON "AffiliateTransaction"("sid");
CREATE INDEX "AffiliateTransaction_status_lockingDate_idx" ON "AffiliateTransaction"("status", "lockingDate");
CREATE INDEX "ProductSyncRun_merchantId_startedAt_idx" ON "ProductSyncRun"("merchantId", "startedAt");
CREATE INDEX "ProductSyncRun_status_startedAt_idx" ON "ProductSyncRun"("status", "startedAt");

ALTER TABLE "MerchantProduct" ADD CONSTRAINT "MerchantProduct_merchantId_fkey" FOREIGN KEY ("merchantId") REFERENCES "Merchant"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "MerchantProductImage" ADD CONSTRAINT "MerchantProductImage_productId_fkey" FOREIGN KEY ("productId") REFERENCES "MerchantProduct"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "AffiliateLink" ADD CONSTRAINT "AffiliateLink_merchantId_fkey" FOREIGN KEY ("merchantId") REFERENCES "Merchant"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "AffiliateLink" ADD CONSTRAINT "AffiliateLink_merchantProductId_fkey" FOREIGN KEY ("merchantProductId") REFERENCES "MerchantProduct"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "EditorialProduct" ADD CONSTRAINT "EditorialProduct_merchantProductId_fkey" FOREIGN KEY ("merchantProductId") REFERENCES "MerchantProduct"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "AffiliateClick" ADD CONSTRAINT "AffiliateClick_affiliateLinkId_fkey" FOREIGN KEY ("affiliateLinkId") REFERENCES "AffiliateLink"("id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "AffiliateClick" ADD CONSTRAINT "AffiliateClick_merchantProductId_fkey" FOREIGN KEY ("merchantProductId") REFERENCES "MerchantProduct"("id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "AffiliateTransaction" ADD CONSTRAINT "AffiliateTransaction_merchantId_fkey" FOREIGN KEY ("merchantId") REFERENCES "Merchant"("id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "AffiliateTransaction" ADD CONSTRAINT "AffiliateTransaction_merchantProductId_fkey" FOREIGN KEY ("merchantProductId") REFERENCES "MerchantProduct"("id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "AffiliateTransaction" ADD CONSTRAINT "AffiliateTransaction_affiliateClickId_fkey" FOREIGN KEY ("affiliateClickId") REFERENCES "AffiliateClick"("id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "ProductSyncRun" ADD CONSTRAINT "ProductSyncRun_merchantId_fkey" FOREIGN KEY ("merchantId") REFERENCES "Merchant"("id") ON DELETE CASCADE ON UPDATE CASCADE;
