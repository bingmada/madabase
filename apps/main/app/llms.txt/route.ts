import { guides, publications, researchItems } from "@/lib/content";
import { siteDescription, siteUrl } from "@/lib/seo";

export const dynamic = "force-static";

export function GET() {
  const lines = [
    "# Madabase",
    "",
    `> ${siteDescription}`,
    "",
    "## Core pages",
    `- Research methodology: ${siteUrl}/methodology`,
    `- Editorial policy: ${siteUrl}/editorial-policy`,
    `- Affiliate disclosure: ${siteUrl}/affiliate-disclosure`,
    `- About: ${siteUrl}/about`,
    "",
    "## Original decision guides",
    ...guides.map((guide) => `- ${guide.title}: ${siteUrl}/guides/${guide.slug}`),
    "",
    "## Focused publications",
    ...publications.map((publication) => `- ${publication.name} (${publication.label}): ${publication.domain}`),
    "",
    "## Selected current research",
    ...researchItems.map((item) => `- ${item.title}: ${item.href}`),
    "",
    "Madabase pages identify official-spec, research-synthesis, and hands-on evidence separately. Research-synthesis pages do not claim first-hand use.",
  ];

  return new Response(lines.join("\n"), { headers: { "Content-Type": "text/plain; charset=utf-8" } });
}
