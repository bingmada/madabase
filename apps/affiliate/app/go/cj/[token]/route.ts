import { NextResponse } from "next/server";
import { newCjSid, verifiedCjRedirectUrl } from "@/lib/cj";
import { findAuthorizedCjOffer } from "@/lib/cj-offers";
import { getAffiliatePrisma, hasDatabaseUrl } from "@/lib/db";
import { getCurrentSite } from "@/lib/sites";
import { shouldRecordCjClick } from "@/lib/cj-click-traffic";

export const dynamic = "force-dynamic";

function unavailable(reason: string) {
  return NextResponse.json(
    { ok: false, error: "affiliate_link_unavailable", reason },
    { status: 503, headers: { "cache-control": "no-store" } },
  );
}

export async function GET(request: Request, { params }: { params: Promise<{ token: string }> }) {
  const site = await getCurrentSite();
  const { token } = await params;
  if (!/^[A-Za-z0-9_-]{12,96}$/.test(token)) return new NextResponse(null, { status: 404 });

  const authorizedOffer = findAuthorizedCjOffer(token);
  if (authorizedOffer) {
    if (authorizedOffer.site !== site.key) return new NextResponse(null, { status: 404 });
    if (!hasDatabaseUrl()) return unavailable("database_not_configured");

    const sid = newCjSid();
    const redirectUrl = verifiedCjRedirectUrl({
      trackingUrl: authorizedOffer.trackingUrl,
      destinationUrl: authorizedOffer.destinationUrl,
      pid: authorizedOffer.pid,
      aid: authorizedOffer.aid,
      sid,
      allowedDestinationHosts: authorizedOffer.allowedDestinationHosts,
    });
    if (!redirectUrl) return unavailable("invalid_tracking_url");

    const prisma = getAffiliatePrisma();
    try {
      if (shouldRecordCjClick(request)) {
        await prisma.merchant.upsert({
          where: {
            network_advertiserCid: {
              network: "cj",
              advertiserCid: authorizedOffer.advertiserCid,
            },
          },
          create: {
            slug: authorizedOffer.merchantSlug,
            name: authorizedOffer.merchantName,
            network: "cj",
            advertiserCid: authorizedOffer.advertiserCid,
          },
          update: {
            slug: authorizedOffer.merchantSlug,
            name: authorizedOffer.merchantName,
          },
        });
        await prisma.affiliateClick.create({
          data: {
            eventId: crypto.randomUUID(),
            site: authorizedOffer.site,
            productSlug: authorizedOffer.productSlug,
            merchant: authorizedOffer.merchantName,
            position: "cj-redirect",
            path: new URL(request.url).pathname,
            network: "cj",
            pid: authorizedOffer.pid,
            aid: authorizedOffer.aid,
            sid,
            destinationUrl: authorizedOffer.destinationUrl,
          },
        });
      }
    } catch {
      return unavailable("click_record_failed");
    }

    return NextResponse.redirect(redirectUrl, {
      status: 302,
      headers: {
        "cache-control": "private, no-store, max-age=0",
        "referrer-policy": "strict-origin-when-cross-origin",
        "x-robots-tag": "noindex, nofollow",
      },
    });
  }

  return new NextResponse(null, { status: 404 });
}
