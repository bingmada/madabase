CREATE TABLE "AffiliateClick" (
    "id" TEXT NOT NULL,
    "eventId" TEXT NOT NULL,
    "site" TEXT NOT NULL,
    "productSlug" TEXT NOT NULL,
    "merchant" TEXT NOT NULL,
    "position" TEXT NOT NULL,
    "path" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "AffiliateClick_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "AffiliateClick_eventId_key" ON "AffiliateClick"("eventId");
CREATE INDEX "AffiliateClick_site_createdAt_idx" ON "AffiliateClick"("site", "createdAt");
CREATE INDEX "AffiliateClick_productSlug_createdAt_idx" ON "AffiliateClick"("productSlug", "createdAt");
CREATE INDEX "AffiliateClick_path_createdAt_idx" ON "AffiliateClick"("path", "createdAt");
