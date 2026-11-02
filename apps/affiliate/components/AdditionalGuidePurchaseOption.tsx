import { findCommerceProduct } from "@/lib/commerce-paths";
import { additionalGuidePurchaseOption } from "@/lib/additional-guide-purchase-options";
import type { MarketKey, SiteKey } from "@/lib/types";
import { AffiliateButton } from "./AffiliateButton";

export function AdditionalGuidePurchaseOption({ site, slug, market }: {
  site: SiteKey; slug: string; market?: MarketKey;
}) {
  const option = additionalGuidePurchaseOption(site, slug);
  if (!option) return null;
  const product = findCommerceProduct(site, option.productSlug);
  if (!product || product.asin !== option.asin) {
    throw new Error(`Unmatched explicit buying identity: ${site}:${slug}`);
  }
  const offer = product.offers.find((candidate) => candidate.merchant === "Amazon US");
  // A later exact-product pause must remove this route without breaking the page.
  if (!offer) return null;
  const destination = new URL(offer.url);
  if (!["amazon.com", "www.amazon.com"].includes(destination.hostname)
    || destination.pathname.match(/^\/dp\/([A-Z0-9]{10})(?:\/|$)/i)?.[1] !== option.asin) {
    throw new Error(`Unmatched explicit buying identity: ${site}:${slug}`);
  }
  return <aside className="mt-6 min-w-0 rounded-md border border-[var(--border)] bg-white p-5"
    aria-label={`Separate option: ${product.name}`} data-guide-task-alternative={product.asin}>
    <p className="eyebrow">Another option for this task</p>
    <h2 className="mt-2 text-xl font-bold">{product.name}</h2>
    <p className="mt-3 text-sm leading-6">{option.qualifier ?? product.purchaseCheck ?? product.verdict}</p>
    <p className="mt-3 text-sm leading-6 text-[var(--muted)]">{option.stop ?? product.cons[0]}</p>
    {["Return check", "Retail field conflict"].map((key) => product.specs[key]
      ? <p className="mt-3 text-sm leading-6" key={key}>{product.specs[key]}</p> : null)}
    {market ? <p className="mt-3 text-sm leading-6">Amazon.com · U.S. listing. Check delivery eligibility, regional compatibility and any import costs separately.</p> : null}
    <div className="mt-4"><AffiliateButton site={site} product={product} offer={offer}
      market={market} modelLabel={product.name} position="guide-additional-exact-option"
      resolveCreatorsListing={false} sticky /></div>
    <p className="mt-2 text-xs leading-5 text-[var(--muted)]">{offer.priceNote}</p>
    <p className="mt-3 text-sm leading-6 text-[var(--muted)]">{option.keep}</p>
    <details className="mt-4 text-sm leading-6"><summary>Sources and selected listing</summary>
      <ul className="mt-2 space-y-3">{product.sources?.map((source) => <li className="break-words" key={source.url}>
        <a className="font-semibold underline" href={source.url} target="_blank" rel="noopener noreferrer">{source.name}</a>
        {source.note ? <p>{source.note}</p> : null}
      </li>)}</ul>
    </details>
  </aside>;
}
