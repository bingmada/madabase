ALTER TABLE "AffiliateClick" ADD COLUMN "market" TEXT;

CREATE TABLE "CommerceEvent" (
  "id" TEXT NOT NULL,
  "eventType" TEXT NOT NULL,
  "sessionId" TEXT NOT NULL,
  "site" TEXT NOT NULL,
  "path" TEXT NOT NULL,
  "pageType" TEXT NOT NULL,
  "market" TEXT NOT NULL,
  "releaseId" TEXT NOT NULL,
  "device" TEXT NOT NULL,
  "channel" TEXT NOT NULL,
  "source" TEXT NOT NULL,
  "campaign" TEXT NOT NULL,
  "productSlug" TEXT NOT NULL,
  "merchant" TEXT NOT NULL,
  "position" TEXT NOT NULL,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "CommerceEvent_pkey" PRIMARY KEY ("id"),
  CONSTRAINT "CommerceEvent_type_check" CHECK ("eventType" IN ('content_view','cta_view','affiliate_click'))
);
CREATE INDEX "CommerceEvent_site_createdAt_idx" ON "CommerceEvent"("site", "createdAt");
CREATE INDEX "CommerceEvent_releaseId_createdAt_idx" ON "CommerceEvent"("releaseId", "createdAt");
CREATE INDEX "CommerceEvent_path_eventType_createdAt_idx" ON "CommerceEvent"("path", "eventType", "createdAt");
