import Link from "next/link";
import {
  searchOpportunityBacklinks,
  searchOpportunityLinks,
  searchOpportunityPath,
  type SearchOpportunity,
  type SearchOpportunityKind,
} from "@/lib/search-opportunities";
import { portfolioRankingRefreshAt } from "@/lib/portfolio-ranking-opportunities";
import type { SiteKey } from "@/lib/types";

export function SearchOpportunityBlock({ opportunity }: { opportunity: SearchOpportunity }) {
  const links = searchOpportunityLinks(opportunity);

  return (
    <section className="not-prose mt-8 rounded-md border border-[var(--brand)] bg-[var(--brand-soft)] p-5" aria-labelledby={`search-answer-${opportunity.slug}`}>
      <p className="eyebrow">Direct answer to the buying question</p>
      <h2 className="mt-2 text-2xl font-bold" id={`search-answer-${opportunity.slug}`}>{opportunity.query}</h2>
      <p className="mt-3 leading-7 text-[var(--text)]">{opportunity.answer}</p>
      <div className="mt-4 flex flex-wrap items-center gap-2 text-xs font-semibold uppercase tracking-[0.12em] text-[var(--muted)]">
        <span>Page structure updated {portfolioRankingRefreshAt}</span>
        <span aria-hidden="true">•</span>
        <span>Evidence checked {opportunity.updatedAt}</span>
        <span aria-hidden="true">•</span>
        <span>Reconfirm exact model and current terms</span>
      </div>
      {links.length ? (
        <div className="mt-5">
          <p className="text-xs font-bold uppercase tracking-[0.12em] text-[var(--brand-strong)]">Continue this decision</p>
          <div className="mt-3 grid gap-3 sm:grid-cols-2">
          {links.map((link, index) => (
            <Link className="rounded-md border border-[var(--border)] bg-white p-4 transition hover:border-[var(--brand)]" href={link.href} key={link.href}>
              <p className="text-xs font-bold uppercase text-[var(--muted)]">Decision {index + 1}</p>
              <h3 className="mt-1 font-bold text-[var(--text)]">{link.label}</h3>
              <p className="mt-2 line-clamp-2 text-sm leading-6 text-[var(--muted)]">{link.description}</p>
            </Link>
          ))}
          </div>
        </div>
      ) : null}
    </section>
  );
}

export function SearchOpportunityBacklinks({ site, kind, slug }: { site: SiteKey; kind: SearchOpportunityKind; slug: string }) {
  const opportunities = searchOpportunityBacklinks(site, kind, slug);
  if (!opportunities.length) return null;

  return (
    <section className="mt-6 rounded-md border border-[var(--border)] bg-white p-5">
      <p className="eyebrow">Related search answers</p>
      <div className="mt-3 grid gap-2">
        {opportunities.map((opportunity) => (
          <Link className="font-semibold text-[var(--brand-strong)] hover:underline" href={searchOpportunityPath(opportunity)} key={`${opportunity.kind}:${opportunity.slug}`}>
            {opportunity.query}
          </Link>
        ))}
      </div>
    </section>
  );
}
