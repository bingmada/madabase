import { siteKeys, sites } from "@/lib/sites";

export const dynamic = "force-static";

function escapeXml(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&apos;");
}

export function GET() {
  const body = [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
    ...siteKeys.filter((key) => !sites[key].previewNoIndex).map((key) => {
      const loc = new URL("/sitemap.xml", sites[key].domain).toString();

      return `  <sitemap><loc>${escapeXml(loc)}</loc></sitemap>`;
    }),
    "</sitemapindex>",
  ].join("\n");

  return new Response(body, {
    headers: {
      "content-type": "application/xml; charset=utf-8",
      "cache-control": "public, max-age=3600, s-maxage=3600",
    },
  });
}
