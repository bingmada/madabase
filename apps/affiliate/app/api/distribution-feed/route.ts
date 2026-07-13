import { distributionItems } from "@/lib/distribution";
import { getCurrentSite, getSiteByKey, siteKeys } from "@/lib/sites";
import type { SiteKey } from "@/lib/types";

export async function GET(request: Request) {
  const requestUrl = new URL(request.url);
  const requestedSite = requestUrl.searchParams.get("site");
  const currentSite = await getCurrentSite();
  const site = requestedSite && siteKeys.includes(requestedSite as SiteKey)
    ? getSiteByKey(requestedSite)
    : currentSite;
  const requestedLimit = Number.parseInt(requestUrl.searchParams.get("limit") ?? "24", 10);
  const limit = Number.isFinite(requestedLimit) ? Math.min(Math.max(requestedLimit, 1), 100) : 24;
  const items = distributionItems(site, limit).map((item) => {
    const destination = new URL(item.path, site.domain);
    destination.searchParams.set("utm_source", "pinterest");
    destination.searchParams.set("utm_medium", "organic_social");
    destination.searchParams.set("utm_campaign", `${site.key}_evidence_pages`);
    destination.searchParams.set("utm_content", `${item.kind}_${item.slug}`);
    const category = site.categories.find((candidate) => candidate.slug === item.category);
    const pinImage = new URL(`/api/pinterest-image/${item.kind}/${item.slug}`, site.domain);

    return {
      id: `${site.key}:${item.kind}:${item.slug}`,
      site: site.key,
      kind: item.kind,
      sourceUrl: new URL(item.path, site.domain).toString(),
      destinationUrl: destination.toString(),
      pinImageUrl: pinImage.toString(),
      board: `${site.name} | ${category?.name ?? "Buying Guides"}`,
      pinTitle: item.title,
      pinDescription: `${item.summary} ${item.decisionLabel}: ${item.decisionDetail} Read the full evidence-led guide before choosing.`.slice(0, 480),
      altText: `${item.title}. ${item.decisionLabel}: ${item.decisionDetail}`.slice(0, 480),
    };
  });

  return Response.json(
    {
      version: 1,
      generatedAt: new Date().toISOString(),
      site: site.key,
      domain: site.domain,
      count: items.length,
      items,
    },
    {
      headers: {
        "cache-control": "public, max-age=0, s-maxage=3600, stale-while-revalidate=86400",
        "x-robots-tag": "noindex, nofollow",
      },
    },
  );
}
