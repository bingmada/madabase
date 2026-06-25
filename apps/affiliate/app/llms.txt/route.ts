import { siteGuides, siteRoundups, siteTools } from "@/lib/content";
import { getCurrentSite } from "@/lib/sites";

function linesFor(label: string, items: Array<{ title: string; slug: string }>, prefix: string) {
  return [`## ${label}`, ...items.map((item) => `- ${item.title}: ${prefix}/${item.slug}`)];
}

export async function GET() {
  const site = await getCurrentSite();
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
    "Affiliate disclosure: As an Amazon Associate, this site may earn from qualifying purchases. Prices, availability, seller details, and product versions should be confirmed on the retailer page before buying.",
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
