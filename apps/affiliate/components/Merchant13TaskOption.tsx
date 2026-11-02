import Link from "next/link";
import { AffiliateButton } from "./AffiliateButton";
import { findProduct } from "@/lib/content";
import { merchant13OptionForGuide } from "@/lib/merchant13-task-options";
import { amazonAsinAffiliateUrl } from "@/lib/affiliate-tracking";
import { amazonFamilyProductIdentity, findAmazonFamilyProduct } from "@/lib/amazon-family-products";
import type { MarketKey, SiteKey } from "@/lib/types";

export function Merchant13TaskOption({ site, slug, market }: { site: SiteKey; slug: string; market?: MarketKey }) {
  const option = merchant13OptionForGuide(site, slug);
  if (option) {
    const { product, keep } = option;
    return <aside className="mt-6 min-w-0 rounded-md border border-[var(--border)] bg-white p-5" aria-label={`Separate option: ${product.name}`} data-guide-task-alternative={product.asin}>
      <p className="eyebrow">Another option for this task</p>
      <h2 className="mt-2 text-xl font-bold">{product.name}</h2>
      <p className="mt-3 text-sm leading-6">{product.summary} {product.verdict}</p>
      <p className="mt-3 text-sm leading-6 text-[var(--muted)]">{product.cons[0]}</p>
      <p className="mt-3 text-sm font-semibold leading-6">{product.specs["Return check"]}</p>
      <div className="mt-4"><AffiliateButton site={site} product={product} offer={product.offers[0]} market={market} modelLabel={product.name} position="guide-task-matched-alternative" resolveCreatorsListing={false} /></div>
      <p className="mt-3 text-sm leading-6 text-[var(--muted)]">{keep}</p>
      <details className="mt-4 text-sm leading-6"><summary>Sources and selected listing</summary><ul className="mt-2 space-y-3">{product.sources?.map(source => <li className="break-words" key={source.url}><a className="font-semibold underline" href={source.url} target="_blank" rel="noopener noreferrer">{source.name}</a>{source.note ? <p>{source.note}</p> : null}</li>)}</ul></details>
    </aside>;
  }
  if (site !== "baby") return null;
  const roles = ["buying-guide", "vs-alternatives", "compatibility-and-fit-guide", "ownership-cost-and-maintenance", "setup-and-daily-workflow", "safety-and-skip-guide"];
  const differentFormat = roles.some(role => slug === `bedside-bassinets-${role}`)
    ? { family: "convertible-baby-cribs", asin: "B0D59KYGJ4", model: "Dream On Me Owen — a separate full-size crib", body: "If attachment to an adult bed is unnecessary and there is enough measured room, a freestanding full-size crib is a different sleep-space format to compare. Owen is not a compact bedside bassinet and must not be attached to the adult bed or used with a side removed for bedside access. Match the supplied Owen 6578 instructions, hardware, mattress support position and required full-size mattress; do not assume a mattress or conversion kits are included.", guide: "convertible-baby-cribs-compatibility-and-fit-guide", keep: "Keep a suitable separate sleep space when it already works. If compactness, bedside attachment, the actual mattress fit or the applicable stopping limits are unresolved, this option does not establish a fit." }
    : roles.some(role => slug === `baby-travel-systems-${role}`)
      ? { family: "full-size-strollers", asin: "B09FM2H1N8", model: "Chicco Bravo Quick-Fold Black — a separate walking stroller", body: "If the actual need is walking with a child who meets the stroller-seat instructions, compare the separately identified Bravo Black stroller. This is not a verified substitute for the disputed Pramette infant-seat bundle: a car seat is not assumed included. Any infant-seat use requires the exact Chicco-approved seat, tray and frame combination and its own child limits. It does not resolve newborn vehicle transport or approve an unspecified adapter.", guide: "full-size-strollers-compatibility-and-fit-guide", keep: "Keep a suitable current stroller. If infant car-to-stroller transfer or a complete travel-system bundle is essential, settle that exact kit first; buying a walking stroller alone does not satisfy it." }
      : undefined;
  if (differentFormat) {
    const family = findAmazonFamilyProduct("baby", differentFormat.family);
    if (family?.asin !== differentFormat.asin || family.offerBlock) return null;
    const identity = amazonFamilyProductIdentity(family);
    const offer = { merchant: "Amazon US", url: amazonAsinAffiliateUrl("baby", family.asin), label: `Check ${differentFormat.model} on Amazon`, priceNote: "A separately named format. Confirm supplied model, contents, child and space requirements, condition, seller, delivery and live returns." };
    return <aside className="mt-6 min-w-0 rounded-md border border-[var(--border)] bg-white p-5" aria-label={`Different format: ${differentFormat.model}`} data-guide-task-alternative={family.asin}>
      <p className="eyebrow">If a different format meets the need</p>
      <h2 className="mt-2 text-xl font-bold">{differentFormat.model}</h2>
      <p className="mt-3 text-sm leading-6">{differentFormat.body}</p>
      <a className="mt-3 inline-block font-semibold underline" href={`/guides/${differentFormat.guide}`}>Read this model’s fit, original instructions and stopping checks</a>
      <div className="mt-4"><AffiliateButton site={site} product={identity} offer={offer} market={market} modelLabel={differentFormat.model} position="guide-task-matched-alternative" resolveCreatorsListing={false} /></div>
      <p className="mt-3 text-sm leading-6 text-[var(--muted)]">{differentFormat.keep}</p>
    </aside>;
  }
  if (!roles.some(role => slug === `hip-seat-carriers-${role}`)) return null;
  const tula = findProduct("baby", "baby-tula-lite-carrier");
  if (tula?.asin !== "B09X8R4PZH" || !tula.offers.length) return null;
  return <aside className="mt-6 min-w-0 rounded-md border border-[var(--border)] bg-white p-5" aria-label="Separate structured carrier option" data-guide-task-alternative={tula.asin}>
    <p className="eyebrow">If a different carrier format fits</p>
    <h2 className="mt-2 text-xl font-bold">Baby Tula Lite — Slate, a structured carrier</h2>
    <p className="mt-3 text-sm leading-6">This is a different packable structured carrier, not a hip-seat attachment or the unavailable PlateauELK. Compare it only if front inward carry at 12–30 lb fits the child and caregiver, including knee-to-knee support without overextension. Back carry begins at 18 lb and also needs stable head, neck and torso control and seated readiness. It has no newborn, outward-facing or infant-insert option.</p>
    <p className="mt-3 text-sm leading-6 text-[var(--muted)]">If supported hip-seat carrying is the requirement, Lite does not establish that result. Match its supplied manual and physical fit. On November 1 the Slate offer was $89 from BabyTula, shipped by Amazon, with expanded free 90-day returns; selected New condition was not explicit in this refresh. Recheck live terms.</p>
    <div className="mt-4"><AffiliateButton site={site} product={tula} offer={tula.offers[0]} market={market} modelLabel="Baby Tula Lite Slate — separate structured carrier" position="guide-task-matched-alternative" resolveCreatorsListing={false} /></div>
    <p className="mt-3 text-sm leading-6 text-[var(--muted)]">Keep a suitable existing carrier or supported carrying routine. An unknown fit, undersized baby or required hip-seat mode is a reason to stop.</p>
    <Link className="mt-3 inline-block font-semibold underline" href="/reviews/baby-tula-lite-carrier">Read the Lite position, manual and fit checks</Link>
  </aside>;
}
