import Link from "next/link";
import { AffiliateButton } from "./AffiliateButton";
import { findGuide, findProduct } from "@/lib/content";
import { merchant21Alternatives, merchant21FamilyForGuide } from "@/lib/merchant21-alternatives";
import type { MarketKey, SiteKey } from "@/lib/types";
import { additionalGuidePurchaseOption } from "@/lib/additional-guide-purchase-options";
import { findCommerceProduct } from "@/lib/commerce-paths";

const comparisons = [
  { family: "outdoor-security-cameras", kind: "guide", slug: "floodlight-security-cameras-buying-guide", title: "For one solar-lit event view: compare Reolink FL10B", body: "This is a separate solar floodlight camera when one serviceable position, suitable sunlight and motion-event recording meet the job. It is not the GMK four-pack, PoE or continuous recording. Review its charging, mounting and storage conditions before choosing that different format." },
  { family: "robot-vacuums", kind: "guide", slug: "robot-mops-buying-guide", title: "Compare the original MOVA P10 Pro Ultra vacuum/mop", body: "The documented original P10 Pro Ultra is a separate vacuum-and-mop option with its own floor, dock, pad-care and total-cost checks. It does not establish the Bagotte M6 Pro's instructions, a shared app or 90 days without care. Choose the original model deliberately; Gen2 and MOBIUS are different products." },
  { family: "smart-blind-motors", kind: "product", slug: "switchbot-blind-tilt", title: "For horizontal blinds with a tilt wand: compare Blind Tilt", body: "If the actual task is tilting compatible horizontal slats, this separate wand-drive format may avoid replacing the roller tube. It does not raise a roller shade or replace GM25LEU. Confirm the blind mechanism first; a tubular shade needs its own documented motor and adapter fit." },
  { family: "smart-dimmer-switches", kind: "product", slug: "tapo-s505d-matter-smart-dimmer", title: "For one control location: compare Tapo S505D", body: "S505D is a separate single-pole dimmer for an appropriate neutral-wire circuit and compatible lamps, assessed by a qualified electrician. It is not a substitute for the KS230 main/satellite two-location pair. If two locations are required, resolve the exact paired installation instead of buying a single-pole switch." },
] as const;

export function GuideMerchant21Routes({ site, slug, market }: { site: SiteKey; slug: string; market?: MarketKey }) {
  if (site !== "smarthome") return null;
  if (additionalGuidePurchaseOption(site, slug)) return null;
  const family = merchant21FamilyForGuide(slug);
  const alternative = merchant21Alternatives.find(row => row.family === family);
  if (alternative) {
    const { keep } = alternative;
    const product = findCommerceProduct(site, alternative.product.slug);
    if (!product?.offers.length || product.asin !== alternative.product.asin) return null;
    return <aside className="mt-6 min-w-0 rounded-md border border-[var(--border)] bg-white p-5" aria-label={`Separate option: ${product.name}`} data-merchant21-route={product.asin}>
      <p className="eyebrow">Another option for this task</p>
      <h2 className="mt-2 text-xl font-bold">{product.name}</h2>
      <p className="mt-3 text-sm leading-6">{product.summary} {product.verdict}</p>
      <p className="mt-3 text-sm leading-6 text-[var(--muted)]">{product.cons[0]}</p>
      <p className="mt-3 text-sm font-semibold leading-6">{product.specs["Return check"]}</p>
      <div className="mt-4"><AffiliateButton site={site} product={product} offer={product.offers[0]} market={market} modelLabel={product.name} position="guide-merchant21-task-alternative" resolveCreatorsListing={false} /></div>
      <p className="mt-3 text-sm leading-6 text-[var(--muted)]">{keep}</p>
      <details className="mt-4 text-sm leading-6"><summary>Sources and selected listing</summary><ul className="mt-2 space-y-3">{product.sources?.map(source => <li key={source.url}><a className="font-semibold underline" href={source.url} target="_blank" rel="noopener noreferrer">{source.name}</a><p>{source.note}</p></li>)}</ul></details>
    </aside>;
  }
  const comparison = comparisons.find(row => row.family === family);
  if (!comparison || !(comparison.kind === "guide" ? findGuide(site, comparison.slug) : findProduct(site, comparison.slug))) return null;
  return <aside className="mt-6 rounded-md border border-[var(--border)] bg-white p-5" aria-label={comparison.title} data-merchant21-route={comparison.slug}>
    <h2 className="text-xl font-bold">{comparison.title}</h2>
    <p className="mt-3 text-sm leading-6">{comparison.body}</p>
    <Link className="mt-4 inline-block font-bold underline" href={`/${comparison.kind === "guide" ? "guides" : "reviews"}/${comparison.slug}`}>Review the separate model and buying conditions</Link>
    <p className="mt-3 text-sm leading-6 text-[var(--muted)]">Keep an adequate existing setup. A different model only helps when its own conditions meet the actual task.</p>
  </aside>;
}
