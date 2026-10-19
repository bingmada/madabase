import type { SearchEntry } from "../../../shared/content-search";
import { searchContent } from "../../../shared/content-search";
import { SearchForm, SearchResultLink } from "../../../shared/SearchControls";
import searchIndex from "@/lib/search-index.json";
import { pageMetadata } from "@/lib/seo";
export const metadata = { ...pageMetadata("Search Madabase publications", "Find exact models, setup questions and comparisons across the active Madabase publications.", "/search"), robots: { index: false, follow: true } };
const siteNames: Record<string, string> = { main: "Madabase editorial", homeoffice: "Home office", network: "Home networking", smarthome: "Smart home", baby: "Baby gear", pet: "Pet care", style: "Style", costume: "Costumes" };
export default async function SearchPage({ searchParams }: { searchParams: Promise<Record<string, string | string[] | undefined>> }) {
  const params = await searchParams; const query = typeof params.q === "string" ? params.q.trim().slice(0,120) : "";
  const site = typeof params.site === "string" ? params.site : ""; const kind = typeof params.kind === "string" ? params.kind : "";
  const results = searchContent(searchIndex as SearchEntry[], query, { site, kind });
  const pageSize = 60;
  const pages = Math.max(1, Math.ceil(results.length / pageSize));
  const requestedPage = Number(typeof params.page === "string" ? params.page : "1");
  const page = Number.isSafeInteger(requestedPage) ? Math.min(pages, Math.max(1, requestedPage)) : 1;
  const pageHref = (next: number) => {
    const values = new URLSearchParams();
    for (const key of ["q", "kind", "category", "site"]) if (typeof params[key] === "string") values.set(key, params[key]);
    values.set("page", String(next));
    return `/search?${values}`;
  };
  return <main className="shell discovery-page"><p className="eyebrow">Madabase library</p><h1>Find a model, a question, or the next decision.</h1><p>Search the active publications together, or narrow to the topic you need. Results identify their publication before you open them.</p>
    <SearchForm query={query}><label>Publication <select name="site" defaultValue={site}><option value="">All publications</option>{Object.entries(siteNames).map(([key,name]) => <option key={key} value={key}>{name}</option>)}</select></label><label>Content type <select name="kind" defaultValue={kind}><option value="">All content</option><option value="guide">Guides</option><option value="product">Product research</option><option value="comparison">Comparisons</option><option value="topic">Compatibility and topics</option><option value="tool">Planning tools</option></select></label></SearchForm>
    <p role="status">{results.length} results{query ? ` for “${query}”` : " in the library"}</p>
    {!results.length ? <div className="discovery-card"><h2>No exact match</h2><p>Try the model number alone or remove a filter. An unlisted device does not establish incompatibility.</p><a href="/search">Clear search</a></div> : null}
    <div className="discovery-results">{results.slice((page - 1) * pageSize, page * pageSize).map((entry) => <article className="discovery-card" key={entry.href}><p className="eyebrow">{siteNames[entry.site]} · {entry.kind}</p><h2><SearchResultLink href={entry.href}>{entry.title}</SearchResultLink></h2><p>{entry.summary}</p></article>)}</div>
    {pages > 1 ? <nav className="discovery-chips" aria-label="Search result pages">{page > 1 ? <a href={pageHref(page - 1)} rel="prev">← Previous</a> : null}<span>Page {page} of {pages}</span>{page < pages ? <a href={pageHref(page + 1)} rel="next">Next →</a> : null}</nav> : null}
  </main>;
}
