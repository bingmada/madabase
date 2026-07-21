import { JsonLd } from "@/components/JsonLd";
import { GuideCard, PageIntro } from "@/components/PageParts";
import { guides } from "@/lib/content";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata(
  "Cross-category decision guides",
  "Original Madabase guides for connected-home buying order, home-office upgrades, and household technology subscriptions.",
  "/guides",
);

export default function GuidesPage() {
  return (
    <main>
      <JsonLd data={{ "@context": "https://schema.org", "@type": "ItemList", name: "Madabase decision guides", itemListElement: guides.map((guide, index) => ({ "@type": "ListItem", position: index + 1, name: guide.title, url: `https://madabase.com/guides/${guide.slug}` })) }} />
      <PageIntro eyebrow="Decision guides" title="The choices that cross categories." body="Product sites usually divide the world into aisles. These guides follow the household decision instead, connecting the network, room, routine, person, service, and long-term cost." />
      <section className="section">
        <div className="shell guide-index-grid">
          {guides.map((guide) => <GuideCard guide={guide} key={guide.slug} />)}
        </div>
      </section>
    </main>
  );
}
