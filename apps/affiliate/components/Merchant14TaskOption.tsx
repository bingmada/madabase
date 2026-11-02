import { AffiliateButton } from "./AffiliateButton";
import type { Merchant14TaskOptionEntry } from "@/lib/merchant14-task-options";
import type { MarketKey } from "@/lib/types";
import { findCommerceProduct } from "@/lib/commerce-paths";
import { AmazonUsListingNotice } from "./AmazonUsListingNotice";

export function Merchant14TaskOption({ option, market }: { option: Merchant14TaskOptionEntry; market?: MarketKey }) {
  const { keep } = option;
  const product = findCommerceProduct(option.product.site, option.product.slug);
  if (!product?.offers.length || product.asin !== option.product.asin) return null;
  return <aside className="mt-6 min-w-0 rounded-md border border-[var(--border)] bg-white p-5" aria-label={`Separate option: ${product.name}`} data-guide-task-alternative={product.asin}>
    <p className="eyebrow">Another option for this task</p>
    <h2 className="mt-2 text-xl font-bold">{product.name}</h2>
    <p className="mt-3 text-sm leading-6">{product.summary}</p>
    <p className="mt-3 text-sm leading-6">{product.verdict}</p>
    <p className="mt-3 text-sm leading-6 text-[var(--muted)]">{product.cons[0]}</p>
    <p className="mt-3 text-sm font-semibold leading-6">{product.specs["Return check"]}</p>
    <AmazonUsListingNotice market={market} />
    <div className="mt-4"><AffiliateButton site={product.site} product={product} offer={product.offers[0]} market={market} modelLabel={product.name} position="guide-task-matched-alternative" resolveCreatorsListing={false} /></div>
    <p className="mt-3 text-sm leading-6 text-[var(--muted)]">{keep}</p>
    <details className="mt-4 text-sm leading-6"><summary>Sources and selected listing</summary><ul className="mt-2 space-y-3">{product.sources?.map(source => <li className="break-words" key={source.url}><a className="font-semibold underline" href={source.url} target="_blank" rel="noopener noreferrer">{source.name}</a>{source.note ? <p>{source.note}</p> : null}</li>)}</ul></details>
  </aside>;
}
