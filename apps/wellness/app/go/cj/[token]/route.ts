import { NextResponse } from "next/server";
import {
  avidloveCj,
  avidloveProductLink,
  productPicks,
} from "@/app/site-data";
import { newCjSid, verifiedCjRedirectUrl } from "@/lib/cj";

export const dynamic = "force-dynamic";

function unavailable(reason: string) {
  return NextResponse.json(
    { ok: false, error: "affiliate_link_unavailable", reason },
    { status: 503, headers: { "cache-control": "no-store" } },
  );
}

export async function GET(
  request: Request,
  { params }: { params: Promise<{ token: string }> },
) {
  const { token } = await params;
  if (!/^[a-z0-9-]{12,96}$/.test(token)) {
    return new NextResponse(null, { status: 404 });
  }

  const product = productPicks.find((candidate) => candidate.slug === token);
  if (!product || product.merchant !== "Avidlove") {
    return new NextResponse(null, { status: 404 });
  }

  const sid = newCjSid();
  const redirectUrl = verifiedCjRedirectUrl({
    trackingUrl: avidloveProductLink(product.destinationUrl),
    destinationUrl: product.destinationUrl,
    pid: avidloveCj.pid,
    aid: avidloveCj.aid,
    sid,
    allowedDestinationHosts: avidloveCj.allowedDestinationHosts,
  });
  if (!redirectUrl) return unavailable("invalid_tracking_url");

  console.info("wellness_affiliate_click", {
    eventId: crypto.randomUUID(),
    site: "wellness",
    market: "us",
    productSlug: product.slug,
    merchant: product.merchant,
    position: "cj-redirect",
    path: new URL(request.url).pathname,
    network: "cj",
    pid: avidloveCj.pid,
    aid: avidloveCj.aid,
    sid,
    destinationUrl: product.destinationUrl,
    occurredAt: new Date().toISOString(),
  });

  return NextResponse.redirect(redirectUrl, {
    status: 302,
    headers: {
      "cache-control": "private, no-store, max-age=0",
      "referrer-policy": "strict-origin-when-cross-origin",
      "x-robots-tag": "noindex, nofollow",
    },
  });
}
