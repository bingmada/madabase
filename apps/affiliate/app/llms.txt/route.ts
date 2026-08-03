import { siteGuides, siteProducts, siteRoundups, siteTools } from "@/lib/content";
import {
  hasIndexableLocalizedMarketPages,
  indexableLocalizedMarketPagesForSite,
  localizedMarketPath,
} from "@/lib/market-content";
import { marketKeys, marketPath, markets, supportsMarketEditions } from "@/lib/markets";
import { getCurrentSite } from "@/lib/sites";
import { listIndexableCostumeProducts } from "@/lib/costume-catalog";
import { costumeHalloweenIdeas } from "@/lib/costume-halloween-ideas";

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
  const costumeProducts = site.key === "costume" ? await listIndexableCostumeProducts(100) : [];
  const countryEditionLines = supportsMarketEditions(site.key)
    && hasIndexableLocalizedMarketPages(site.key)
    ? [
        "## Country editions",
        ...marketKeys.flatMap((key) => {
          const market = markets[key];
          return [
            `- ${market.localName} edition home: ${marketPath(market)}`,
            ...indexableLocalizedMarketPagesForSite(site.key, key).map(
              ({ page, variant }) => `- ${variant.title}: ${localizedMarketPath(market, page)}`,
            ),
          ];
        }),
        "",
      ]
    : [];

  const body = [
    `# ${site.name}`,
    "",
    site.description,
    "",
    "This site publishes practical buying notes, comparison guides, and decision checklists. It focuses on use-case fit, compatibility checks, product trade-offs, and affiliate disclosure.",
    "",
    site.key === "costume"
      ? "Affiliate disclosure: eligible Abracadabra purchase links use CJ and the dedicated Costume promotional-property PID. A link is shown only after the exact product destination and attribution path are checked."
      : "Affiliate disclosure: As an Amazon Associate, this site may earn from qualifying purchases. Prices, availability, seller details, and product versions should be confirmed on the retailer page before buying.",
    "",
    ...(site.key === "costume"
      ? [
          "Seasonal planning:",
          "- Halloween 2026 costumes, masks, animatronics, and decorations: /halloween",
          "- Halloween animatronics for small yards and porches: /best/halloween-animatronics-small-yards-and-porches",
          "- Halloween costume ideas and editorial kits: /halloween-ideas",
          ...costumeHalloweenIdeas.map((idea) => `- ${idea.title}: /halloween-ideas/${idea.slug}`),
          "",
        ]
      : []),
    ...(site.key === "costume"
      ? linesFor("Reviewed product pages", costumeProducts, "/products")
      : linesFor("Product evidence pages", products, "/reviews")),
    "",
    ...linesFor("Comparison pages", roundups, "/best"),
    "",
    ...linesFor("Explainer guides", guides, "/guides"),
    "",
    ...linesFor("Tools", tools, "/tools"),
    "",
    ...countryEditionLines,
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
