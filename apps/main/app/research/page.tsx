import { ArrowRight } from "lucide-react";
import { JsonLd } from "@/components/JsonLd";
import { PageIntro } from "@/components/PageParts";
import { TrackedLink } from "@/components/TrackedLink";
import { publications, researchItems } from "@/lib/content";
import { pageMetadata, siteUrl } from "@/lib/seo";

export const metadata = pageMetadata(
  "Latest buying research",
  "Selected, recently checked buying research from the six Madabase publications, with model, compatibility, fit, subscription, and version risks kept visible.",
  "/research",
);

export default function ResearchPage() {
  const itemList = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "Selected Madabase buying research",
    itemListElement: researchItems.map((item, index) => ({ "@type": "ListItem", position: index + 1, name: item.title, url: item.href })),
  };

  return (
    <main>
      <JsonLd data={itemList} />
      <PageIntro eyebrow="Latest research" title="Selected decisions, recently checked." body="This is a deliberately small view of the work across Madabase. Each entry is here because model identity, compatibility, total cost, fit, or a meaningful trade-off was checked and made visible." />
      <section className="section">
        <div className="shell research-page-grid">
          {researchItems.map((item, index) => (
            <article className="research-feature" key={item.href}>
              <div className="research-feature-number">0{index + 1}</div>
              <div>
                <p className="eyebrow">{item.topic} · {item.publication}</p>
                <h2>{item.title}</h2>
                <p>{item.summary}</p>
                <span className="updated-label">{item.updated}</span>
              </div>
              <TrackedLink className="button button-dark" href={item.href} position="research-index" publication={item.publication}>
                Read the research <ArrowRight size={16} aria-hidden="true" />
              </TrackedLink>
            </article>
          ))}
        </div>
      </section>
      <section className="publication-directory">
        <div className="shell directory-grid">
          <div>
            <p className="eyebrow on-dark">Browse by publication</p>
            <h2>Go deeper in one decision area.</h2>
            <p>The six publications maintain their own complete archives, sitemaps, evidence pages, and update paths.</p>
          </div>
          <div className="directory-links">
            {publications.map((publication) => (
              <TrackedLink href={publication.domain} key={publication.key} position="research-directory" publication={publication.key}>
                <span>{publication.name}<small>{publication.label}</small></span><ArrowRight size={17} aria-hidden="true" />
              </TrackedLink>
            ))}
          </div>
        </div>
      </section>
      <JsonLd data={{ "@context": "https://schema.org", "@type": "CollectionPage", name: "Latest Madabase research", url: `${siteUrl}/research` }} />
    </main>
  );
}
