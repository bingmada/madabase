import { NextResponse } from "next/server";
import { hasQaParameters } from "../../../../../shared/analytics-traffic";
import { isPublishedCommerceClick } from "@/lib/commerce-inventory";
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

const marketKeys = new Set<MarketKey>(["gb", "ca", "de", "nl"]);

function cleanText(value: unknown, maxLength: number) {
  return typeof value === "string" && value.trim().length <= maxLength ? value.trim() : "";
}

export async function POST(request: Request) {
  const referrer = request.headers.get("referer");
  let qaVisit = false;
  if (referrer) {
    try {
      if (hasQaParameters(new URL(referrer).search)) {
        qaVisit = true;
      }
    } catch {
      // A missing or malformed referrer must not discard a real click.
    }
  }
  const body = await request.json().catch(() => ({}));
  const payload: ClickPayload = body && typeof body === "object" ? body : {};
  const site = cleanText(payload.site, 40) as SiteKey;
  const marketValue = cleanText(payload.market, 8);
  const market = marketKeys.has(marketValue as MarketKey) ? (marketValue as MarketKey) : "us";
  const productSlug = cleanText(payload.productSlug, 180);
  const merchant = cleanText(payload.merchant, 80);
  const position = cleanText(payload.position, 80);
  const path = cleanText(payload.path, 240);
  const eventId = cleanText(payload.eventId, 80);

  if (
    !eventId ||
    !merchant ||
    !position ||
    !path.startsWith("/") ||
    !isPublishedCommerceClick(site, productSlug, merchant)
  ) {
    return NextResponse.json(
      { ok: false, error: "invalid_click_event" },
      { status: 400 },
    );
  }

  // Exercise the real validator during release QA without recording a click.
  if (qaVisit) {
    return NextResponse.json({ ok: true, persisted: false, reason: "qa_visit", validated: true });
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
        market,
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
