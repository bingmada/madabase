import Link from "next/link";
import { notFound } from "next/navigation";
import { CompatibilityPlanner, type PlannerTopic } from "@/components/CompatibilityPlanner";
import { CompatibilityLibrary } from "@/components/CompatibilityLibrary";
import { JsonLd } from "@/components/JsonLd";
import { getCurrentSite } from "@/lib/sites";
import { pageMetadata, breadcrumbSchema } from "@/lib/seo";
import { compatibilityTopics, findCompatibilityTopic } from "@/lib/compatibility-topics";
export async function generateMetadata({ params }: { params: Promise<{ topic: string }> }) {
  const site = await getCurrentSite(); const item = findCompatibilityTopic(site.key, (await params).topic);
  if (!item) return {};
  return pageMetadata(site, `/compatibility/${item.id}`, item.title, item.summary);
}
export default async function CompatibilityPage({ params }: { params: Promise<{ topic: string }> }) {
  const site = await getCurrentSite(); const item = findCompatibilityTopic(site.key, (await params).topic);
  if (!item) notFound();
  return <main className="shell discovery-page"><JsonLd data={breadcrumbSchema(site, [{ name: "Home", path: "/" }, { name: "Compatibility", path: "/compatibility" }, { name: item.title, path: `/compatibility/${item.id}` }])} />
    <p className="eyebrow">{site.name} compatibility library</p><h1>{item.title}</h1><p>{item.summary}</p><p className="evidence-note">Prepared by the {site.name} editorial desk · evidence checked October 19, 2026 · official specifications and transparent calculations; no hands-on testing</p>
    <nav className="discovery-chips" aria-label="On this page"><a href="#compatibility-checker">Check my setup</a><a href="#reference">Read the reference</a><a href="#decision-notes">Buying decisions</a><a href="#sources">Sources</a></nav>
    <section className="discovery-card"><h2>The practical answer</h2><p>{item.answer}</p></section>
    <CompatibilityPlanner topic={item.id as PlannerTopic} />
    <CompatibilityLibrary topic={item.id as PlannerTopic} />
    <section id="decision-notes"><h2>Decisions the specifications alone do not settle</h2>{item.sections.map((section) => <section key={section.heading}><h2>{section.heading}</h2><p>{section.body}</p></section>)}</section>
    <section><h2>Common questions</h2>{item.faqs.map((faq) => <details key={faq.question}><summary>{faq.question}</summary><p>{faq.answer}</p></details>)}</section>
    <section><h2>Continue with an exact decision</h2><div className="discovery-grid">{item.links.map((link) => <article className="discovery-card" key={link.href}><h3><Link href={link.href}>{link.label} →</Link></h3><p>{link.note}</p></article>)}</div></section>
    <nav className="discovery-chips" aria-label="Other compatibility topics">{compatibilityTopics.filter((other) => other.site === site.key && other.id !== item.id).map((other) => <Link key={other.id} href={`/compatibility/${other.id}`}>{other.title}</Link>)}<Link href="/search">Search all models and guides</Link></nav>
  </main>;
}
