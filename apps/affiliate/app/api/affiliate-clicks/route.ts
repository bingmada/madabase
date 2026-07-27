import { NextResponse } from "next/server";
import { findProduct } from "@/lib/content";
import { getAffiliatePrisma, hasDatabaseUrl } from "@/lib/db";
import type { MarketKey, SiteKey } from "@/lib/types";

type ClickPayload = {
  eventId?: string;
  site?: string;
  market?: string;
  productSlug?: string;
  merchant?: string;
  position?: string;
  path?: string;
};

const siteKeys = new Set<SiteKey>([
  "pet",
  "homeoffice",
  "baby",
  "network",
  "smarthome",
  "style",
]);
const marketKeys = new Set<MarketKey>(["gb", "ca", "de", "nl"]);

function cleanText(value: string | undefined, maxLength: number) {
  return value?.trim().slice(0, maxLength) ?? "";
}

export async function POST(request: Request) {
  const payload = (await request.json().catch(() => ({}))) as ClickPayload;
  const site = cleanText(payload.site, 40) as SiteKey;
  const marketValue = cleanText(payload.market, 8);
  const market = marketKeys.has(marketValue as MarketKey) ? (marketValue as MarketKey) : "us";
  const productSlug = cleanText(payload.productSlug, 120);
  const merchant = cleanText(payload.merchant, 80);
  const position = cleanText(payload.position, 80);
  const path = cleanText(payload.path, 240);
  const eventId = cleanText(payload.eventId, 80);
  const product = siteKeys.has(site)
    ? findProduct(site, productSlug)
    : undefined;

  if (
    !eventId ||
    !product ||
    !merchant ||
    !position ||
    !path.startsWith("/") ||
    !product.offers.some((offer) => offer.merchant === merchant)
  ) {
    return NextResponse.json(
      { ok: false, error: "invalid_click_event" },
      { status: 400 },
    );
  }

  const cleanPayload = {
    eventId,
    site,
    market,
    productSlug,
    merchant,
    position,
    path,
    at: new Date().toISOString(),
  };

  if (!hasDatabaseUrl()) {
    console.warn("affiliate_click_not_persisted", {
      ...cleanPayload,
      reason: "DATABASE_URL is not set",
    });
    return NextResponse.json({ ok: true, persisted: false }, { status: 202 });
  }

  try {
    await getAffiliatePrisma().affiliateClick.upsert({
      where: { eventId },
      update: {},
      create: {
        eventId,
        site,
        productSlug,
        merchant,
        position,
        path,
      },
    });

    console.info("affiliate_click_persisted", cleanPayload);
    return NextResponse.json({ ok: true, persisted: true });
  } catch (error) {
    console.error("affiliate_click_not_persisted", {
      ...cleanPayload,
      reason: error instanceof Error ? error.message : "unknown_error",
    });
    return NextResponse.json({ ok: true, persisted: false }, { status: 202 });
  }
}
