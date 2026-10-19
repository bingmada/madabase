"use client";
import { useState } from "react";
import { searchContent, type SearchEntry } from "../../shared/content-search";
import { entryTopic, topicsForSite } from "@/lib/discovery-topics";
import { SearchResultLink } from "../../shared/SearchControls";

export function CategoryBrowser({ entries, site }: { entries: SearchEntry[]; site: string }) {
  const [query, setQuery] = useState("");
  const [kind, setKind] = useState("");
  const [topic, setTopic] = useState("");
  const [limit, setLimit] = useState(12);
  const results = searchContent(entries, query, { kind }).filter((entry) => !topic || entryTopic(entry) === topic);
  return <section className="compat-panel" aria-labelledby="category-browser-heading"><h2 id="category-browser-heading">Find the right page in this category</h2><p>Choose a task or enter a model to narrow the reading list.</p><div className="compat-form" onChange={() => setLimit(12)}>
    <label><span>Model or question in this category</span><input type="search" maxLength={120} value={query} onChange={(event) => setQuery(event.target.value)} /></label>
    <label><span>Content type</span><select value={kind} onChange={(event) => setKind(event.target.value)}><option value="">All content</option><option value="guide">Guides</option><option value="product">Product research</option><option value="comparison">Comparisons</option><option value="tool">Tools</option><option value="topic">Compatibility references</option></select></label>
    {topicsForSite(site).length ? <label><span>Task</span><select value={topic} onChange={(event) => setTopic(event.target.value)}><option value="">All tasks</option>{topicsForSite(site).filter((item) => entries.some((entry) => entryTopic(entry) === item.id)).map((item) => <option value={item.id} key={item.id}>{item.label}</option>)}<option value="other">Other questions</option></select></label> : null}
  </div><p role="status" className="mt-4">{results.length} matching pages</p><ul className="category-browser-results">{results.slice(0,limit).map((entry) => <li key={entry.href}><SearchResultLink href={entry.href}>{entry.title}</SearchResultLink><span className="evidence-note"> — {entry.kind}</span></li>)}</ul>{results.length > limit ? <button className="button-secondary mt-4" type="button" onClick={() => setLimit(limit+12)}>Show 12 more</button> : null}{!results.length ? <p>Try fewer filters or the model number alone. An absent model is not a compatibility verdict.</p> : null}</section>;
}
