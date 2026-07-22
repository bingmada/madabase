import { NextResponse } from "next/server";
import { newCjSid, verifiedCjRedirectUrl } from "@/lib/cj";
import { getAffiliatePrisma, hasDatabaseUrl } from "@/lib/db";
import { getCurrentSite } from "@/lib/sites";

export const dynamic = "force-dynamic";

function unavailable(reason: string) {
  return NextResponse.json(
    { ok: false, error: "affiliate_link_unavailable", reason },
    { status: 503, headers: { "cache-control": "no-store" } },
  );
}

export async function GET(request: Request, { params }: { params: Promise<{ token: string }> }) {
  const site = await getCurrentSite();
  if (site.key !== "costume") return new NextResponse(null, { status: 404 });
  if (!hasDatabaseUrl()) return unavailable("database_not_configured");

  const { token } = await params;
  if (!/^[A-Za-z0-9_-]{12,96}$/.test(token)) return new NextResponse(null, { status: 404 });

  const prisma = getAffiliatePrisma();
  const link = await prisma.affiliateLink.findUnique({
    where: { clickToken: token },
    include: { merchant: true, merchantProduct: true },
  });

  if (!link || !link.active || !link.verifiedAt || link.site !== "costume" || link.network !== "cj") {
    return unavailable("link_not_verified");
  }

  const configuredPid = process.env.CJ_COSTUME_PID;
  if (!configuredPid || configuredPid !== link.pid) return unavailable("costume_pid_mismatch");
  if (link.merchant.advertiserCid !== "7889430" || link.merchant.slug !== "abracadabra-nyc") {
    return unavailable("merchant_mismatch");
  }

  const sid = newCjSid();
  const redirectUrl = verifiedCjRedirectUrl({
    trackingUrl: link.trackingUrl,
    destinationUrl: link.destinationUrl,
    pid: link.pid,
    aid: link.aid,
    sid,
  });
  if (!redirectUrl) return unavailable("invalid_tracking_url");

  const eventId = crypto.randomUUID();
  await prisma.affiliateClick.create({
    data: {
      eventId,
      site: "costume",
      productSlug: link.merchantProduct?.slug ?? `cj-link-${link.clickToken}`,
      merchant: link.merchant.name,
      position: "cj-redirect",
      path: new URL(request.url).pathname,
      network: "cj",
      pid: link.pid,
      aid: link.aid,
      sid,
      destinationUrl: link.destinationUrl,
      affiliateLinkId: link.id,
      merchantProductId: link.merchantProductId,
    },
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
