import { getIndexableBlogPosts } from "@/lib/blog";
import { getSiteUrl } from "@/lib/seo";
import { getPopularTools, toolRegistry } from "@/lib/tool-registry";

export const dynamic = "force-static";

export async function GET() {
  const baseUrl = getSiteUrl();
  const popularTools = getPopularTools();
  const posts = await getIndexableBlogPosts("en");
  const topTools = popularTools.length > 0 ? popularTools : toolRegistry.slice(0, 12);

  const lines = [
    "# Madabase",
    "",
    "> Madabase is a browser-first online developer tools library for JSON, JWT, Base64, URLs, timestamps, Markdown, SQL, regex, text cleanup, and practical web workflows.",
    "",
    "## Primary Sections",
    "",
    `- Tools directory: ${baseUrl}/en/tools`,
    `- Developer tools: ${baseUrl}/en/tools/category/developer`,
    `- Web tools: ${baseUrl}/en/tools/category/web`,
    `- Text tools: ${baseUrl}/en/tools/category/text`,
    `- Creator tools: ${baseUrl}/en/tools/category/creator`,
    `- Blog: ${baseUrl}/en/blog`,
    `- About: ${baseUrl}/en/about`,
    `- Editorial policy: ${baseUrl}/en/editorial-policy`,
    `- Privacy: ${baseUrl}/en/privacy`,
    `- Terms: ${baseUrl}/en/terms`,
    `- Contact: ${baseUrl}/en/contact`,
    "- Pet gear buying guides: https://pets.madabase.com",
    "- Home office buying guides: https://homeoffice.madabase.com",
    "- Baby gear buying guides: https://baby.madabase.com",
    "- Home network buying guides: https://network.madabase.com",
    "- Smart-home buying guides: https://smarthome.madabase.com",
    "- Style accessory buying guides: https://style.madabase.com",
    "",
    "## Popular Tools",
    "",
    ...topTools.map((tool) => `- ${tool.h1.en}: ${baseUrl}/en/tools/${tool.slug} - ${tool.description.en}`),
    "",
    "## Reference Articles",
    "",
    ...posts.slice(0, 12).map((post) => `- ${post.title}: ${baseUrl}/en/blog/${post.slug} - ${post.description}`),
    "",
    "## Notes For Crawlers",
    "",
    "- Tool pages are the primary public content on this site.",
    "- Madabase also publishes topic-specific buying guide sites on selected subdomains; these are separate from the online tool library but part of the same editorial network.",
    "- Account, search, test result, and interactive flow pages are not intended as search landing pages.",
    "- All tools run in the browser unless a page explicitly says otherwise.",
    "",
  ];

  return new Response(lines.join("\n"), {
    headers: {
      "content-type": "text/plain; charset=utf-8",
      "cache-control": "public, max-age=3600, s-maxage=86400",
    },
  });
}
