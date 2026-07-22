import { siteGuides, siteProducts, siteRoundups, siteTools } from "@/lib/content";
import { getCurrentSite } from "@/lib/sites";
import { costumeProductCandidates } from "@/lib/costume-content";

type LlmIndexItem = { slug: string } & ({ title: string } | { name: string });

function linesFor(label: string, items: LlmIndexItem[], prefix: string) {
  return [
    `## ${label}`,
    ...items.map((item) => `- ${"title" in item ? item.title : item.name}: ${prefix}/${item.slug}`),
  ];
}

export async function GET() {
  const site = await getCurrentSite();
  const products = siteProducts(site.key);
  const roundups = siteRoundups(site.key);
  const guides = siteGuides(site.key);
  const tools = siteTools(site.key);

  const body = [
    `# ${site.name}`,
    "",
    site.description,
    "",
    "This site publishes practical buying notes, comparison guides, and decision checklists. It focuses on use-case fit, compatibility checks, product trade-offs, and affiliate disclosure.",
    "",
    site.key === "costume"
      ? "Affiliate disclosure: this noindex preview has no live purchase links. Production Abracadabra links will use CJ and the dedicated Costume promotional-property PID after product and attribution verification."
      : "Affiliate disclosure: As an Amazon Associate, this site may earn from qualifying purchases. Prices, availability, seller details, and product versions should be confirmed on the retailer page before buying.",
    "",
    ...(site.key === "costume"
      ? linesFor("Product decision previews", costumeProductCandidates, "/products")
      : linesFor("Product evidence pages", products, "/reviews")),
    "",
    ...linesFor("Comparison pages", roundups, "/best"),
    "",
    ...linesFor("Explainer guides", guides, "/guides"),
    "",
    ...linesFor("Tools", tools, "/tools"),
    "",
    "Important site information:",
    "- About: /about",
    "- Methodology: /methodology",
    "- Editorial policy: /editorial-policy",
    "- Affiliate disclosure: /affiliate-disclosure",
    "- Contact: /contact",
    "",
  ].join("\n");

  return new Response(body, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "s-maxage=3600, stale-while-revalidate=86400",
    },
  });
}
