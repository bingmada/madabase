import { NextResponse } from "next/server";
import { hasQaParameters } from "../../../../../shared/analytics-traffic";
import { isPublishedCommerceClick } from "@/lib/commerce-inventory";
import { commercePage, commerceSiteMatchesHost, knownAutomation } from "@/lib/commerce-events";
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
  const requestHost = request.headers.get("host") || new URL(request.url).host;
  let host: string;
  try { host = new URL(`https://${requestHost}`).hostname; } catch { return NextResponse.json({ ok: false }, { status: 400 }); }
  const origin = request.headers.get("origin");
  try {
    if (request.headers.get("sec-fetch-site") === "cross-site" || (origin && new URL(origin).host !== requestHost)) return NextResponse.json({ ok: false, reason: "origin_mismatch" }, { status: 403 });
  } catch { return NextResponse.json({ ok: false, reason: "invalid_origin" }, { status: 403 }); }
  const referrer = request.headers.get("referer");
  let qaVisit = host === "localhost" || host === "127.0.0.1" || host.endsWith(".localhost");
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
  const page = commercePage(path);
  const eventId = cleanText(payload.eventId, 80);

  if (
    !eventId ||
    !merchant ||
    !position ||
    !page || !commerceSiteMatchesHost(site, host) || page.market !== market ||
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
  if (knownAutomation(request.headers.get("user-agent") || "")) return NextResponse.json({ ok: true, persisted: false, reason: "known_automation", validated: true });

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
