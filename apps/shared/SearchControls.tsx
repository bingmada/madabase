"use client";

import type { ReactNode } from "react";
import { isQaVisit } from "../../shared/analytics-traffic";

export function discoveryEvent(name: string, value: string) {
  if (isQaVisit()) return;
  const analytics = window as Window & { clarity?: (...args: string[]) => void };
  analytics.clarity?.("set", "discovery_context", value.slice(0, 100));
  analytics.clarity?.("event", name);
}

export function SearchForm({ query = "", children, compact = false }: { query?: string; children?: ReactNode; compact?: boolean }) {
  return <form action="/search" method="get" className={`discovery-search${compact ? " discovery-search-compact" : ""}`} role="search" onSubmit={() => discoveryEvent("site_search", "submitted")}>
    <label className="discovery-search-label" htmlFor={compact ? "compact-site-query" : "site-query"}>Find a model, comparison, or buying question</label>
    <div className="discovery-search-row"><input id={compact ? "compact-site-query" : "site-query"} name="q" type="search" maxLength={120} defaultValue={query} placeholder="Try a model number or buying question…" /><button type="submit">Search</button></div>
    {children}
  </form>;
}

export function SearchResultLink({ href, children }: { href: string; children: ReactNode }) {
  return <a href={href} onClick={() => discoveryEvent("search_result_click", href)}>{children}</a>;
}
