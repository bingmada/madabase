import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Check, Compass, FileCheck2, RefreshCw } from "lucide-react";
import { JsonLd } from "@/components/JsonLd";
import { GuideCard, PublicationCard } from "@/components/PageParts";
import { TrackedLink } from "@/components/TrackedLink";
import { guides, publications, researchItems } from "@/lib/content";
import { pageMetadata, siteDescription, siteName, siteUrl } from "@/lib/seo";

export const metadata = pageMetadata(`${siteName} | Independent buying research`, siteDescription);

const decisionPaths = [
  {
    label: "Connected home",
    title: "Build the network before the automations.",
    body: "Sequence coverage, wired backhaul, controllers, and devices so the final system remains understandable.",
    href: "/guides/connected-home-buying-order",
  },
  {
    label: "Work and focus",
    title: "Fix recurring friction in the right order.",
    body: "Start with connectivity and fit, then improve lighting, meetings, and the smaller accessories around them.",
    href: "/guides/home-office-network-and-ergonomics",
  },
  {
    label: "Recurring cost",
    title: "Price the service, not only the device.",
    body: "Separate included functions from paid alerts, recording, AI features, and extra-device fees.",
    href: "/guides/household-tech-subscription-checklist",
  },
];

export default function HomePage() {
  const organization = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: siteName,
    url: siteUrl,
    description: siteDescription,
    subOrganization: publications.map((publication) => ({ "@type": "Organization", name: publication.name, url: publication.domain })),
  };
  const website = { "@context": "https://schema.org", "@type": "WebSite", name: siteName, alternateName: "madabase.com", url: siteUrl };

  return (
    <main>
      <JsonLd data={organization} />
      <JsonLd data={website} />

      <section className="home-hero">
        <Image
          alt="A lived-in connected home with a workspace, pet, family carrier, and smart-home details"
          className="home-hero-image"
          fill
          priority
          sizes="100vw"
          src="/images/madabase-home-hero.webp"
        />
        <div className="home-hero-shade" />
        <div className="shell home-hero-content">
          <div className="hero-copy">
            <p className="eyebrow on-dark">Independent consumer research</p>
            <h1>Madabase</h1>
            <p className="hero-dek">Clearer decisions for connected homes, better workspaces, family care, pet care, and the things that make daily life feel like yours.</p>
            <div className="hero-actions">
              <Link className="button button-light" href="/research">See the latest research <ArrowRight size={17} aria-hidden="true" /></Link>
              <Link className="button button-ghost" href="/methodology">How we decide</Link>
            </div>
          </div>
        </div>
      </section>

      <section className="signal-strip" aria-label="Editorial principles">
        <div className="shell signal-grid">
          <p><FileCheck2 size={18} aria-hidden="true" /><span><strong>Sources visible</strong> Official specifications and limitations stay attached to the decision.</span></p>
          <p><Compass size={18} aria-hidden="true" /><span><strong>Fit before hype</strong> The best option depends on the room, routine, person, and ecosystem.</span></p>
          <p><RefreshCw size={18} aria-hidden="true" /><span><strong>Updates recorded</strong> Model, price, subscription, and compatibility risks are revisited.</span></p>
        </div>
      </section>

      <section className="section publications-section" id="publications">
        <div className="shell">
          <div className="section-heading split-heading">
            <div>
              <p className="eyebrow">Six focused publications</p>
              <h2>Start with the decision you are actually making.</h2>
            </div>
            <p>Each publication stays narrow enough to understand its products, while Madabase connects the decisions that cross rooms and routines.</p>
          </div>
          <div className="publication-grid">
            {publications.map((publication, index) => <PublicationCard index={index} key={publication.key} publication={publication} />)}
          </div>
        </div>
      </section>

      <section className="section seasonal-section">
        <div className="shell seasonal-callout">
          <div>
            <p className="eyebrow on-dark">Seasonal decision desk · Halloween 2026</p>
            <h2>Plan the costume, scare, and setup while there is still time to test it.</h2>
            <p>Use the Madabase Halloween &amp; Costume Guide for sizing, masks, haunted props, animatronics, lighting, delivery timing, and simpler backups before October 31.</p>
          </div>
          <div className="seasonal-actions">
            <TrackedLink
              className="button button-light"
              href="https://costumes.madabase.com/best/halloween-animatronics-small-yards-and-porches"
              position="home-seasonal-small-space-animatronics"
              publication="Madabase Halloween & Costume Guide"
            >
              Compare small-space animatronics <ArrowRight size={17} aria-hidden="true" />
            </TrackedLink>
            <TrackedLink className="button button-ghost" href="https://costumes.madabase.com/halloween" position="home-seasonal-halloween" publication="Madabase Halloween & Costume Guide">
              Open Halloween planning
            </TrackedLink>
          </div>
        </div>
      </section>

      <section className="section research-section">
        <div className="shell">
          <div className="section-heading split-heading">
            <div>
              <p className="eyebrow">Recently checked</p>
              <h2>Research with a reason to exist.</h2>
            </div>
            <Link className="text-link" href="/research">View all selected research <ArrowRight size={16} aria-hidden="true" /></Link>
          </div>
          <div className="research-list">
            {researchItems.slice(0, 4).map((item, index) => (
              <article className="research-row" key={item.href}>
                <span className="research-index">0{index + 1}</span>
                <div>
                  <p className="eyebrow">{item.topic} · {item.publication}</p>
                  <h3>{item.title}</h3>
                  <p>{item.summary}</p>
                </div>
                <div className="research-action">
                  <span>{item.updated}</span>
                  <TrackedLink aria-label={`Read ${item.title}`} href={item.href} position="home-research" publication={item.publication}>
                    <ArrowRight size={20} aria-hidden="true" />
                  </TrackedLink>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="section path-section">
        <div className="shell">
          <div className="section-heading">
            <p className="eyebrow">Cross-category guides</p>
            <h2>Some purchases only make sense in sequence.</h2>
            <p>These original Madabase guides connect decisions that would otherwise be split between product categories.</p>
          </div>
          <div className="path-grid">
            {decisionPaths.map((path, index) => (
              <Link className="path-item" href={path.href} key={path.href}>
                <span className="path-number">0{index + 1}</span>
                <p className="eyebrow">{path.label}</p>
                <h3>{path.title}</h3>
                <p>{path.body}</p>
                <span className="text-link">Follow the decision path <ArrowRight size={16} aria-hidden="true" /></span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="section guide-preview-section">
        <div className="shell">
          <div className="section-heading split-heading">
            <div>
              <p className="eyebrow">Decision library</p>
              <h2>Plan the setup before choosing the object.</h2>
            </div>
            <Link className="text-link" href="/guides">Browse all guides <ArrowRight size={16} aria-hidden="true" /></Link>
          </div>
          <div className="guide-grid">
            {guides.map((guide) => <GuideCard guide={guide} key={guide.slug} />)}
          </div>
        </div>
      </section>

      <section className="method-band">
        <div className="shell method-band-grid">
          <div>
            <p className="eyebrow on-dark">Our standard</p>
            <h2>Evidence should change the recommendation.</h2>
            <p>We separate verified specifications from independent research and hands-on experience. Version drift, subscriptions, compatibility, fit, and return risk stay visible because they can reverse an otherwise attractive choice.</p>
            <Link className="button button-light" href="/methodology">Read the methodology <ArrowRight size={17} aria-hidden="true" /></Link>
          </div>
          <ul className="method-checks">
            <li><Check size={18} aria-hidden="true" />Exact model and variant checks</li>
            <li><Check size={18} aria-hidden="true" />Official sources and dated updates</li>
            <li><Check size={18} aria-hidden="true" />Best-for and skip reasons</li>
            <li><Check size={18} aria-hidden="true" />Recurring cost and ecosystem risk</li>
            <li><Check size={18} aria-hidden="true" />Clear affiliate disclosure</li>
          </ul>
        </div>
      </section>
    </main>
  );
}
