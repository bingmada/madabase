import Link from "next/link";
import type { CSSProperties } from "react";
import { AffiliateButtonGroup } from "./AffiliateButton";
import type { MarketKey, Product, Roundup } from "@/lib/types";
import type { SiteConfig } from "@/lib/sites";

export function ComparisonStart({ site, roundup, picks, market }: { site: SiteConfig; roundup: Roundup; picks: Product[]; market?: MarketKey }) {
  const table = roundup.comparisonTable;
  const modelCount = Math.min(picks.length, table?.columns.length ?? 2);
  return <section className="mt-5" aria-labelledby="comparison-verdict" data-decision-first-comparison="true">
    <p className="text-sm leading-6 text-[var(--muted)]">{roundup.dek}</p>
    <div className="mt-4 rounded-md border border-[var(--brand)] bg-[var(--brand-soft)] p-5">
      <h2 id="comparison-verdict" className="text-xl font-bold">The decision</h2>
      <p className="mt-3 leading-7">{roundup.quickAnswer ?? roundup.intro}</p>
      <div className="mt-4 flex flex-wrap gap-3 text-sm font-bold">
        {table ? <a className="underline underline-offset-4" href="#roundup-comparison">Compare the differences</a> : null}
        <a className="underline underline-offset-4" href="#comparison-models">Check each model</a>
        <a className="underline underline-offset-4" href="#comparison-sources">Read the sources</a>
      </div>
    </div>
    <p className="mt-3 text-xs leading-5 text-[var(--muted)]">Updated {roundup.updatedAt}. <Link href="/about" className="underline">{site.name} editorial desk</Link>.</p>
    {table ? <section className="mt-6 scroll-mt-24" id="roundup-comparison">
      <h2 className="text-xl font-bold">{table.title}</h2>
      <p className="mt-2 text-xs leading-5 text-[var(--muted)] sm:hidden">Scroll across to compare {modelCount === 2 ? "both models" : "the models"}.</p>
      <div className="guide-decision-scroll mt-4 overflow-x-auto rounded-md border border-[var(--border)] bg-white" role="region" aria-label={table.title} tabIndex={0}>
        <table className="guide-decision-table w-full text-left text-sm" style={{ "--guide-value-columns": table.columns.length } as CSSProperties}>
          <colgroup><col className="guide-decision-label-column" />{table.columns.map(column => <col className="guide-decision-value-column" key={column} />)}</colgroup>
          <thead className="bg-[var(--surface-muted)]"><tr><th className="px-4 py-3" scope="col">Check</th>{table.columns.map(column => <th className="px-4 py-3" scope="col" key={column}>{column}</th>)}</tr></thead>
          <tbody className="divide-y divide-[var(--border)]">{table.rows.map(row => <tr key={row.label}><th className="px-4 py-3" scope="row">{row.label}</th>{row.values.map((value,index) => <td className="px-4 py-3 leading-6" key={index}>{value}</td>)}</tr>)}</tbody>
        </table>
      </div>
    </section> : null}
    {roundup.decisionGuide?.length ? <div className="mt-5 grid gap-3 sm:grid-cols-2">{roundup.decisionGuide.map(item => <div className="rounded-md border border-[var(--border)] bg-white p-4" key={item.label}><h3 className="font-bold">{item.label}</h3><p className="mt-2 text-sm leading-6 text-[var(--muted)]">{item.detail}</p></div>)}</div> : null}
    <section className="mt-6 scroll-mt-24" id="comparison-models" aria-labelledby="comparison-models-heading">
      <h2 className="text-xl font-bold" id="comparison-models-heading">Continue with the model that fits</h2>
      <div className="mt-4 grid gap-3 sm:grid-cols-2" data-sticky-commerce-suppress="">{picks.slice(0,modelCount).map(product => <div className="min-w-0 rounded-md border border-[var(--border)] bg-white p-4" key={product.slug}>
        <h3 className="font-bold">{product.amazonTitle ?? product.name}</h3>
        <p className="my-3 text-sm leading-6 text-[var(--muted)]">{product.purchaseCheck ?? product.cons[0]}</p>
        {product.offers.length ? <AffiliateButtonGroup site={site.key} product={product} market={market} position="roundup-decision-model" limit={1} sticky={false} /> : <p className="text-sm font-semibold">The original retailer link remains paused. Read the model guide for separately named options and their conditions.</p>}
        <Link className="mt-3 block text-sm font-bold underline" href={`/reviews/${product.slug}`}>{market ? "Read the US model reference" : "Read this model’s guide"}</Link>
      </div>)}</div>
    </section>
  </section>;
}
