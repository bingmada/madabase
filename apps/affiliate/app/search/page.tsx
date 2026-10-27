import Link from "next/link";
import { entryTopic, topicsForSite } from "@/lib/discovery-topics";
import { getCurrentSite } from "@/lib/sites";
import { siteSearchIndex } from "@/lib/site-search";
import { pageMetadata } from "@/lib/seo";
import { searchContent } from "../../../shared/content-search";
import { SearchForm, SearchResultLink } from "../../../shared/SearchControls";

export async function generateMetadata() {
  const site = await getCurrentSite();
  return { ...pageMetadata(site, "/search", `Search ${site.name}`, "Find exact models, compatibility guidance and comparisons in this publication."), robots: { index: false, follow: true } };
}
export default async function SearchPage({ searchParams }: { searchParams: Promise<Record<string, string | string[] | undefined>> }) {
  const site = await getCurrentSite();
  const params = await searchParams;
  const query = typeof params.q === "string" ? params.q.trim().slice(0, 120) : "";
  const kind = typeof params.kind === "string" ? params.kind : "";
  const category = typeof params.category === "string" ? params.category : "";
  const topic = typeof params.topic === "string" ? params.topic : "";
  const taskLabel = topicsForSite(site.key).find((item) => item.id === topic)?.label;
  const index = siteSearchIndex(site.key);
  const results = searchContent(index, query, { kind, category }).filter((entry) => !topic || entryTopic(entry) === topic);
  const pageSize = 60;
  const pages = Math.max(1, Math.ceil(results.length / pageSize));
  const requestedPage = Number(typeof params.page === "string" ? params.page : "1");
  const page = Number.isSafeInteger(requestedPage) ? Math.min(pages, Math.max(1, requestedPage)) : 1;
  const pageHref = (next: number) => {
    const values = new URLSearchParams();
    for (const key of ["q", "kind", "category", "site", "topic"]) if (typeof params[key] === "string") values.set(key, params[key]);
    values.set("page", String(next));
    return `/search?${values}`;
  };
  return <main className="shell discovery-page"><p className="eyebrow">{site.name} library</p><h1>{taskLabel ?? "Find the answer for your setup."}</h1><p>{taskLabel ? `Browse ${taskLabel.toLowerCase()} references, exact models and comparisons. Add your model or question to narrow the list.` : "Search models and questions across this publication. Results open our evidence and decision pages."}</p>
    <SearchForm query={query}><label>Content type <select name="kind" defaultValue={kind}><option value="">All content</option><option value="topic">Compatibility tools</option><option value="guide">Guides</option><option value="product">Product research</option><option value="comparison">Comparisons</option><option value="tool">Planning tools</option></select></label><label>Category <select name="category" defaultValue={category}><option value="">All categories</option>{[...new Set(index.map((entry) => entry.category))].sort().map((name) => <option value={name} key={name}>{site.categories.find((item) => item.slug === name)?.name ?? name}</option>)}</select></label>{topicsForSite(site.key).length ? <label>Task <select name="topic" defaultValue={topic}><option value="">All tasks</option>{topicsForSite(site.key).map((item) => <option value={item.id} key={item.id}>{item.label}</option>)}<option value="other">Other questions</option></select></label> : null}</SearchForm>
    <p role="status">{results.length} {results.length === 1 ? "result" : "results"}{query ? ` for “${query}”` : " in the library"} · {index.length} searchable pages</p>
    {!results.length ? <div className="discovery-card"><h2>No exact match yet</h2><p>Try the model number alone, remove one filter, or browse a category. We do not substitute another model as a compatibility answer.</p><Link href={`/search?q=${encodeURIComponent(query)}`}>Remove filters and keep this question</Link>{["homeoffice","network"].includes(site.key) ? <p><Link href="/compatibility">Browse the supported compatibility topics</Link>. An unlisted device remains unverified.</p> : null}{null}</div> : null}
    <div className="discovery-results">{results.slice((page - 1) * pageSize, page * pageSize).map((entry) => <article className="discovery-card" key={entry.href}><p className="eyebrow">{site.categories.find((item) => item.slug === entry.category)?.name ?? entry.category} · {entry.kind}</p><h2><SearchResultLink href={entry.href}>{entry.title}</SearchResultLink></h2><p>{entry.summary}</p></article>)}</div>
    {pages > 1 ? <nav className="discovery-chips" aria-label="Search result pages">{page > 1 ? <a href={pageHref(page - 1)} rel="prev">← Previous</a> : null}<span>Page {page} of {pages}</span>{page < pages ? <a href={pageHref(page + 1)} rel="next">Next →</a> : null}</nav> : null}
    <nav className="discovery-chips" aria-label="Browse categories">{site.categories.map((category) => <Link href={`/categories/${category.slug}`} key={category.slug}>{category.name}</Link>)}{null}</nav>
  </main>;
}
