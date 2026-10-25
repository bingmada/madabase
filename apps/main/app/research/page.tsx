import { ArrowRight } from "lucide-react";
import { JsonLd } from "@/components/JsonLd";
import { PageIntro } from "@/components/PageParts";
import { TrackedLink } from "@/components/TrackedLink";
import { publications, researchItems } from "@/lib/content";
import { pageMetadata, siteUrl } from "@/lib/seo";

export const metadata = pageMetadata(
  "Latest buying research",
  "Substantive updates from Madabase publications and seasonal guides, with model, compatibility, fit, subscription, and version risks kept visible.",
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
      <PageIntro eyebrow="Latest research" title="What changed in the decision library." body="Recent additions and substantive updates, newest first. Each entry explains what changed in the linked guide or planner. A page update does not certify current retailer stock or pricing." />
      <section className="section" aria-labelledby="research-resources">
        <div className="shell">
          <p className="eyebrow">Use and share the research</p>
          <h2 id="research-resources">Worksheets, compatibility references and cost comparisons.</h2>
          <div className="research-resources-grid">
            {[
              { title: "Printer stand measurement worksheet", href: "https://homeoffice.madabase.com/guides/office-printer-stands-buying-guide#fit-worksheet", summary: "Compare operating width, depth, lid clearance and documented shelf capacity using your own measurements.", publication: "homeoffice" },
              { title: "Lumbar cushion seat-depth worksheet", href: "https://homeoffice.madabase.com/guides/office-lumbar-cushions-buying-guide#fit-worksheet", summary: "See how a fitted cushion changes usable seat depth, then print a record for your real chair.", publication: "homeoffice" },
              { title: "Tiny PC compatibility references", href: "https://homeoffice.madabase.com/compatibility/mini-pcs", summary: "Compare eight generations and retain the model-specific memory, storage and unresolved-parts limits.", publication: "homeoffice" },
              { title: "Household technology ownership cost", href: "/guides/household-tech-subscription-checklist#ownership-cost-calculator", summary: "Compare two options over one, three or five years, including recurring costs and unknown inputs.", publication: "main" },
            ].map((resource) => <article className="research-resource" key={resource.href}>
              <h3>{resource.title}</h3><p>{resource.summary}</p><TrackedLink className="button button-light" href={resource.href} position="research-resource" publication={resource.publication}>Open the resource <ArrowRight size={16} aria-hidden="true" /></TrackedLink>
            </article>)}
          </div>
        </div>
      </section>
      <section className="section">
        <div className="shell research-page-grid">
          {researchItems.map((item, index) => (
            <article className="research-feature" key={item.href}>
              <div className="research-feature-number">{String(index + 1).padStart(2, "0")}</div>
              <div>
                <p className="eyebrow">{item.topic} · {item.publication}</p>
                <h2>{item.title}</h2>
                <p>{item.summary}</p>
                <p><strong>What changed:</strong> {item.change}</p>
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
