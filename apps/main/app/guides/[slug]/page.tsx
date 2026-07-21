import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, ArrowRight, Check, ExternalLink } from "lucide-react";
import { notFound } from "next/navigation";
import { JsonLd } from "@/components/JsonLd";
import { TrackedLink } from "@/components/TrackedLink";
import { getGuide, guides } from "@/lib/content";
import { pageMetadata, siteUrl } from "@/lib/seo";

export function generateStaticParams() {
  return guides.map((guide) => ({ slug: guide.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const guide = getGuide((await params).slug);
  return guide ? pageMetadata(guide.title, guide.dek, `/guides/${guide.slug}`) : {};
}

export default async function GuidePage({ params }: { params: Promise<{ slug: string }> }) {
  const guide = getGuide((await params).slug);
  if (!guide) notFound();

  const canonical = `${siteUrl}/guides/${guide.slug}`;
  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: guide.title,
    description: guide.dek,
    dateModified: "2026-07-21",
    datePublished: "2026-07-21",
    mainEntityOfPage: canonical,
    image: `${siteUrl}${guide.image}`,
    author: { "@type": "Organization", name: "Madabase Editorial", url: `${siteUrl}/about` },
    publisher: { "@type": "Organization", name: "Madabase", url: siteUrl },
  };
  const breadcrumbs = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: siteUrl },
      { "@type": "ListItem", position: 2, name: "Guides", item: `${siteUrl}/guides` },
      { "@type": "ListItem", position: 3, name: guide.title, item: canonical },
    ],
  };

  return (
    <main>
      <JsonLd data={articleSchema} />
      <JsonLd data={breadcrumbs} />
      <article>
        <header className="article-header">
          <div className="shell article-header-grid">
            <div>
              <Link className="back-link" href="/guides"><ArrowLeft size={15} aria-hidden="true" />All decision guides</Link>
              <p className="eyebrow">{guide.category}</p>
              <h1>{guide.title}</h1>
              <p className="article-dek">{guide.dek}</p>
              <p className="article-meta">Updated {guide.updatedAt} · {guide.readingTime} · Research synthesis</p>
            </div>
            <div className="article-image">
              <Image alt="" fill priority sizes="(max-width: 900px) 100vw, 44vw" src={guide.image} />
            </div>
          </div>
        </header>

        <div className="shell article-layout">
          <div className="article-main">
            <section className="verdict-box">
              <p className="eyebrow">The short answer</p>
              <p>{guide.verdict}</p>
            </section>
            <section className="sequence-block">
              <p className="eyebrow">Decision sequence</p>
              <ol>
                {guide.steps.map((step) => <li key={step}>{step}</li>)}
              </ol>
            </section>
            <div className="article-prose">
              {guide.sections.map((section) => (
                <section key={section.heading}>
                  <h2>{section.heading}</h2>
                  {section.paragraphs.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
                  {section.bullets ? <ul>{section.bullets.map((item) => <li key={item}><Check size={16} aria-hidden="true" />{item}</li>)}</ul> : null}
                </section>
              ))}
            </div>
            <section className="source-block">
              <h2>Primary references</h2>
              <p>These sources support the standards and framework used in this guide. Product-specific decisions remain linked to the focused Madabase publications below.</p>
              <ul>
                {guide.sources.map((source) => <li key={source.href}><a href={source.href}>{source.label}<ExternalLink size={14} aria-hidden="true" /></a></li>)}
              </ul>
            </section>
          </div>
          <aside className="article-aside">
            <p className="eyebrow">Continue the decision</p>
            {guide.related.map((item) => (
              <TrackedLink href={item.href} key={item.href} position="guide-related">
                <span>{item.label}</span><ArrowRight size={16} aria-hidden="true" />
              </TrackedLink>
            ))}
            <div className="research-note">
              <strong>Evidence note</strong>
              <p>This guide synthesizes official documentation and the focused research maintained across Madabase publications. It does not claim hands-on testing.</p>
            </div>
          </aside>
        </div>
      </article>
    </main>
  );
}
