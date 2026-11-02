import { merchant14OptionForGuide } from "@/lib/merchant14-task-options";
import { Merchant14TaskOption } from "./Merchant14TaskOption";
import Link from "next/link";
import { AffiliateButton } from "./AffiliateButton";
import { findProduct } from "@/lib/content";
import { merchant20AlternativeForGuide } from "@/lib/merchant20-alternatives";
import type { MarketKey, SiteKey } from "@/lib/types";
import { Merchant13TaskOption } from "./Merchant13TaskOption";

export function GuideTaskAlternative({ site, slug, market }: { site: SiteKey; slug: string; market?: MarketKey }) {
  const merchant14 = merchant14OptionForGuide(site, slug);
  if (merchant14) return <Merchant14TaskOption option={merchant14} market={market} />;
  if (site === "baby") return <Merchant13TaskOption site={site} slug={slug} market={market} />;
  const alternative = merchant20AlternativeForGuide(site, slug);
  if (alternative) {
    const { product, keep } = alternative;
    return <aside className="mt-6 min-w-0 rounded-md border border-[var(--border)] bg-white p-5" aria-label={`Separate option: ${product.name}`} data-guide-task-alternative={product.asin}>
      <p className="eyebrow">Another option for this task</p>
      <h2 className="mt-2 text-xl font-bold">{product.name}</h2>
      <p className="mt-3 text-sm leading-6">{product.summary} {product.verdict}</p>
      <p className="mt-3 text-sm leading-6 text-[var(--muted)]">{product.cons[0]}</p>
      <p className="mt-3 text-sm font-semibold leading-6">{product.specs["Return check"]}</p>
      <div className="mt-4"><AffiliateButton site={site} product={product} offer={product.offers[0]} market={market} modelLabel={product.name} position="guide-task-matched-alternative" resolveCreatorsListing={false} /></div>
      <p className="mt-3 text-sm leading-6 text-[var(--muted)]">{keep}</p>
      <details className="mt-4 text-sm leading-6"><summary>Sources and selected listing</summary><ul className="mt-2 space-y-3">{product.sources?.map((source) => <li className="break-words" key={source.url}><a className="font-semibold underline" href={source.url} target="_blank" rel="noopener noreferrer">{source.name}</a>{source.note ? <p>{source.note}</p> : null}</li>)}</ul></details>
    </aside>;
  }

  if (site !== "pet" || !["buying-guide", "vs-alternatives", "compatibility-and-fit-guide"].some((role) => slug === `treat-dispensing-pet-cameras-${role}`)) return null;
  // Reuse the peer-owned review route without adding a duplicate retail identity.
  const furbo = findProduct("pet", "furbo-360-dog-camera");
  if (furbo?.asin !== "B0BWN22T25" || !furbo.offers.length) return null;
  return <aside className="mt-6 rounded-md border border-[var(--border)] bg-white p-5" aria-label="Compare a stationary treat camera" data-guide-task-alternative="existing-furbo-review">
    <h2 className="text-xl font-bold">Could a stationary treat camera meet the task?</h2>
    <p className="mt-3 text-sm leading-6">The Furbo 360 Dog Camera is a separate stationary option for dog check-ins and treat interaction. It does not drive around like Belcore T1. The linked B0BWN22T25 requires paid activation; check the minimum term, renewal and current contract. Free basic access after cancellation remains unresolved.</p>
    <Link className="mt-4 inline-block font-bold underline" href="/reviews/furbo-360-dog-camera">Compare Furbo hardware and paid-plan conditions</Link>
    <p className="mt-3 text-sm leading-6 text-[var(--muted)]">Keep a suitable existing camera, or choose no camera if indoor recording and ongoing service do not meet the household&apos;s needs.</p>
  </aside>;
}
