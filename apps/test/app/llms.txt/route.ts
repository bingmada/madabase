import { getSiteUrl } from "@/lib/seo";
import { testRegistry } from "@/lib/test-registry";

export const dynamic = "force-static";

export async function GET() {
  const baseUrl = getSiteUrl();
  const lines = [
    "# Madabase Tests",
    "",
    "> Interactive personality, career, relationship, learning, and self-discovery tests.",
    "",
    "## Test directory",
    "",
    `- English: ${baseUrl}/en`,
    `- 中文: ${baseUrl}/zh`,
    "",
    "## Available tests",
    "",
    ...testRegistry.map((test) => `- ${test.title.en}: ${baseUrl}/en/${test.slug} - ${test.description.en}`),
    "",
    "## Notes",
    "",
    "- Public test landing pages are indexable.",
    "- Question flows, personal results, and account pages are not intended as search landing pages.",
    "- Results are designed for self-reflection and are not clinical diagnoses.",
    "",
  ];

  return new Response(lines.join("\n"), {
    headers: {
      "content-type": "text/plain; charset=utf-8",
      "cache-control": "public, max-age=3600, s-maxage=86400",
    },
  });
}
