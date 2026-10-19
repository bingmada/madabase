import Link from "next/link";
import { notFound } from "next/navigation";
import { getCurrentSite } from "@/lib/sites";
import { pageMetadata } from "@/lib/seo";
import { compatibilityTopics } from "@/lib/compatibility-topics";
export async function generateMetadata() { const site = await getCurrentSite(); return pageMetadata(site, "/compatibility", "Compatibility and upgrade library", "Check the exact device, connection path, installation limits and required parts before choosing an upgrade."); }
export default async function CompatibilityHome() {
  const site = await getCurrentSite(); const topics = compatibilityTopics.filter((item) => item.site === site.key); if (!topics.length) notFound();
  return <main className="shell discovery-page"><p className="eyebrow">{site.name}</p><h1>Build a setup that fits together.</h1><p>Choose the job first. Each topic combines a condition-based checker with readable reference tables, official sources, missing-part checks and reasons to skip a purchase.</p><div className="discovery-grid">{topics.map((item) => <article className="discovery-card" key={item.id}><h2><Link href={`/compatibility/${item.id}`}>{item.title} →</Link></h2><p>{item.summary}</p></article>)}</div><section><h2>How to read a compatibility result</h2><p>A conditional match means the documented limits fit the inputs and the listed checks still apply. A requirement conflict identifies a known limit that fails. Evidence incomplete means the model, software, adapter or installation condition has not been established. We do not turn missing data into a compatible recommendation.</p><p>These are official-spec research tools, not hands-on tests. Product availability is separate from compatibility, and there is no obligation to buy something after checking a setup.</p></section><Link href="/search">Search the complete library →</Link></main>;
}
