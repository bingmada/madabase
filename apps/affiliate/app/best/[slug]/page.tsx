import Link from "next/link";
import { notFound } from "next/navigation";
import { AffiliateButtonGroup } from "@/components/AffiliateButton";
import { JsonLd } from "@/components/JsonLd";
import { Disclosure, ProductCard } from "@/components/LayoutParts";
import { BaseMarketEditionLinks } from "@/components/MarketExperience";
import { SearchOpportunityBacklinks, SearchOpportunityBlock } from "@/components/SearchOpportunityBlock";
import { findProduct, findRoundup, siteGuides } from "@/lib/content";
import { roundupCommerceProduct } from "@/lib/commerce-paths";
import { buyerFacingBody, buyerFacingHeading, buyerFacingSummary } from "@/lib/conversion-copy";
import { roundupEvidencePresentation } from "@/lib/evidence";
import { effectiveContentUpdatedAt, findSearchOpportunity, reviewedSearchDescription, searchOpportunityMetaDescription } from "@/lib/search-opportunities";
import { breadcrumbSchema, faqPageSchema, pageMetadata, roundupArticleSchema, roundupProductListSchema } from "@/lib/seo";
import { getCurrentSite } from "@/lib/sites";
import type { Product, Roundup, SiteKey } from "@/lib/types";

function quickAnswer(roundupTitle: string, intent: string, picks: Array<ReturnType<typeof findProduct>>) {
  const firstPick = picks.find(Boolean);
  if (!firstPick) return intent;

  return `Start with ${firstPick.name} if your main need is ${firstPick.bestFor.toLowerCase()}. Compare the trade-offs before buying, especially ${firstPick.cons[0].toLowerCase()}.`;
}

const roundupAdvice: Record<SiteKey, Record<string, { spendMore: string; spendLess: string; compare: string[] }>> = {
  pet: {
    feeding: {
      spendMore: "Spend more when portion consistency, sealed storage, power backup, or cleaning access prevents a daily feeding problem.",
      spendLess: "Spend less when you only need a simple schedule and your pet already handles bowls, kibble size, and routine changes well.",
      compare: ["Food type and kibble size", "Bowl and chute cleaning", "Power backup and lock design", "Replacement filters or parts"],
    },
    "home-care": {
      spendMore: "Spend more when odor, hair, or monitoring is a repeated apartment problem that affects daily comfort.",
      spendLess: "Spend less when a manual routine, washable cover, or basic camera solves the same issue without subscriptions.",
      compare: ["Room size and placement", "Noise during normal use", "Refill or filter cost", "Subscription boundaries"],
    },
    comfort: {
      spendMore: "Spend more when support, washable covers, size fit, or durability directly affects how often the pet uses the product.",
      spendLess: "Spend less for backup mats, travel gear, or products likely to be chewed before long-term comfort matters.",
      compare: ["Pet size and sleep shape", "Cover removal and washability", "Floor space", "Chewing or scratching risk"],
    },
  },
  homeoffice: {
    desks: {
      spendMore: "Spend more when stability, height range, cable movement, and desktop depth affect every workday.",
      spendLess: "Spend less when the desk is secondary, the setup is laptop-only, or accessories can solve the main constraint.",
      compare: ["Desktop depth and room path", "Height range", "Cable slack", "Assembly and return path"],
    },
    ergonomics: {
      spendMore: "Spend more when the product affects posture for long work blocks, especially chairs and monitor arms.",
      spendLess: "Spend less when you already have a comfortable posture and only need a small layout improvement.",
      compare: ["Adjustment range", "Body or monitor compatibility", "Return policy", "Long-session comfort"],
    },
    meetings: {
      spendMore: "Spend more when calls are part of the job and better lighting or audio reduces repeated meeting friction.",
      spendLess: "Spend less when room lighting, camera height, or a simple lamp placement can solve the problem first.",
      compare: ["Face lighting", "Glare control", "Control placement", "Desk footprint"],
    },
  },
  baby: {
    sleep: {
      spendMore: "Spend more when the product supports a clear, repeatable overnight routine within manufacturer guidance without adding confusing controls.",
      spendLess: "Spend less when the premium feature is analytics, app polish, or a bundle you do not need yet.",
      compare: ["Safe-use guidance", "Night controls", "Connection style", "Privacy and alerts"],
    },
    travel: {
      spendMore: "Spend more when fold size, carry comfort, and daily usability all matter in a small space.",
      spendLess: "Spend less when the product is only for occasional backup use or one short trip.",
      compare: ["Folded dimensions", "Weight and carry routine", "Age and weight limits", "Storage and cleaning"],
    },
    feeding: {
      spendMore: "Spend more when the appliance removes daily cleaning or drying friction across many bottles and parts.",
      spendLess: "Spend less when bottle volume is low, counter space is tight, or simpler cleaning steps already work.",
      compare: ["Bottle and part capacity", "Drying function", "Counter footprint", "Manual and pediatric guidance"],
    },
  },
  network: {
    wifi: {
      spendMore: "Spend more when a larger layout, wired backhaul, multi-gig internet, or many devices are already stressing the network.",
      spendLess: "Spend less when one well-placed router, an Ethernet run, or a cheaper Wi-Fi 6 mesh kit solves the real coverage gap.",
      compare: ["Home size and wall layout", "WAN/LAN port speeds", "Wired backhaul options", "Subscription and security features"],
    },
    wired: {
      spendMore: "Spend more when the wired path supports NAS, gaming, office calls, or future 2.5G and 10G upgrades.",
      spendLess: "Spend less for simple TV stands, printer corners, or rooms that only need basic gigabit Ethernet.",
      compare: ["Port count and speed", "Cable length and category", "Fanless or silent operation", "Laptop and dock compatibility"],
    },
    backup: {
      spendMore: "Spend more when the modem, ONT, router, and mesh node need to stay online through frequent short outages.",
      spendLess: "Spend less when you only need graceful shutdown time or your internet service fails during power cuts anyway.",
      compare: ["VA and watt rating", "Outlet spacing", "USB charging needs", "Expected router and modem runtime"],
    },
  },
  smarthome: {
    access: {
      spendMore: "Spend more when the upgrade adds a dependable entry method your household will use, while preserving key, keypad, or emergency access.",
      spendLess: "Spend less when fingerprint or keypad access solves the problem and UWB, Home Key, or advanced automation would add unused complexity.",
      compare: ["Door and deadbolt fit", "Entry methods", "Hub and ecosystem requirements", "Battery and backup access"],
    },
    cameras: {
      spendMore: "Spend more for the field of view, wiring flexibility, storage path, and alerts you will use—not for resolution alone.",
      spendLess: "Spend less when local storage and basic person alerts cover the entrance without a recurring plan.",
      compare: ["Battery versus hardwire", "Local and cloud storage", "Included chime", "Subscription-only features"],
    },
    climate: {
      spendMore: "Spend more when remote sensors, HVAC compatibility, and room-aware control solve real comfort problems.",
      spendLess: "Spend less when a basic programmable thermostat already handles the schedule and remote sensors are unnecessary.",
      compare: ["HVAC and wiring support", "Included sensors", "Ecosystem control", "Optional service features"],
    },
    automation: {
      spendMore: "Spend more on the required controller or border router when it creates a stable local foundation for several devices.",
      spendLess: "Spend less when one vendor app and local physical controls already meet the need.",
      compare: ["Controller roles", "Radio support", "Local fallback", "Cross-platform sharing"],
    },
  },
};

function getRoundupAdvice(siteKey: SiteKey, category: string) {
  return roundupAdvice[siteKey][category] ?? {
    spendMore: "Spend more when the upgrade removes a repeated daily problem and has a clear return path if it does not fit.",
    spendLess: "Spend less when a simpler product solves the same use case with fewer parts, subscriptions, or cleaning steps.",
    compare: ["Exact model and version", "Room or body fit", "Cleaning and setup friction", "Return window"],
  };
}

function officialSourceLinks(products: Product[], roundupSources: Roundup["sources"] = []) {
  return Array.from(
    new Map(
      [...roundupSources, ...products.flatMap((product) => product.sources ?? [])]
        .map((source) => [source.url, source]),
    ).values(),
  ).slice(0, 8);
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const site = await getCurrentSite();
  const { slug } = await params;
  const roundup = findRoundup(site.key, slug);
  if (!roundup) return {};
  const searchOpportunity = findSearchOpportunity(site.key, "roundup", slug);
  return pageMetadata(site, `/best/${slug}`, roundup.seoTitle ?? roundup.title, reviewedSearchDescription(site.key, "roundup", slug) ?? searchOpportunityMetaDescription(searchOpportunity, roundup.dek));
}

export default async function RoundupPage({ params }: { params: Promise<{ slug: string }> }) {
  const site = await getCurrentSite();
  const { slug } = await params;
  const roundup = findRoundup(site.key, slug);
  if (!roundup) notFound();
  const searchOpportunity = findSearchOpportunity(site.key, "roundup", slug);
  const effectiveUpdatedAt = effectiveContentUpdatedAt(roundup.updatedAt, searchOpportunity?.updatedAt);
  const effectiveRoundup = effectiveUpdatedAt === roundup.updatedAt ? roundup : { ...roundup, updatedAt: effectiveUpdatedAt };
  const picks = roundup.productSlugs
    .map((productSlug) => findProduct(site.key, productSlug))
    .filter((product): product is NonNullable<ReturnType<typeof findProduct>> => Boolean(product));
  const topPick = picks[0];
  const commerceProduct = roundupCommerceProduct(site.key, roundup);
  const commerceIsAlternative = Boolean(topPick && commerceProduct && topPick.slug !== commerceProduct.slug);
  const commercePathPaused = Boolean(topPick && !commerceProduct);
  const category = site.categories.find((item) => item.slug === roundup.category);
  const relatedGuides = siteGuides(site.key)
    .filter((guide) => guide.relatedRoundups.includes(roundup.slug))
    .slice(0, 6);
  const answer = roundup.quickAnswer ?? quickAnswer(roundup.title, roundup.intent, picks);
  const advice = getRoundupAdvice(site.key, roundup.category);
  const sources = officialSourceLinks(picks, roundup.sources);
  const evidencePresentation = roundupEvidencePresentation(picks);

  return (
    <main className="section">
      <JsonLd
        data={breadcrumbSchema(site, [
          { name: "Home", path: "/" },
          ...(category ? [{ name: category.name, path: `/categories/${category.slug}` }] : []),
          { name: roundup.title, path: `/best/${slug}` },
        ])}
      />
      <JsonLd data={roundupProductListSchema(site, roundup.title, picks)} />
      <JsonLd data={roundupArticleSchema(site, effectiveRoundup, picks)} />
      <JsonLd data={faqPageSchema(roundup.faqs)} />
      <div className="shell">
        <div className="max-w-3xl">
          {category ? (
            <Link className="eyebrow hover:underline" href={`/categories/${category.slug}`}>
              {category.name}
            </Link>
          ) : (
            <p className="eyebrow">{roundup.category}</p>
          )}
          <h1 className="mt-3 text-3xl font-black leading-tight sm:text-4xl">{roundup.title}</h1>
          <div className="mt-4 rounded-md border border-[var(--brand)] bg-[var(--brand-soft)] px-4 py-3" data-evidence-boundary="true">
            <p className="text-xs font-bold uppercase text-[var(--brand-strong)]">{evidencePresentation.label}</p>
            <p className="mt-1 text-sm font-semibold leading-6 text-[var(--text)]">{evidencePresentation.summary}</p>
          </div>
          {roundup.purchaseFlow === "task-links" ? (
            <div className="mt-4 rounded-md border border-[var(--border)] bg-white p-4 sm:p-5" data-roundup-task-choice="true">
              <p className="text-xs font-bold uppercase text-[var(--muted)]">Choose the task first</p>
              {roundup.purchaseCheck ? <p className="mt-2 text-sm leading-6" data-roundup-purchase-check="true">{roundup.purchaseCheck}</p> : null}
              <a className="button-secondary mt-3" href="#quick-comparison">Compare model conditions</a>
            </div>
          ) : topPick || commerceProduct ? (
            <div
              className="mt-4 grid gap-3 rounded-md border border-[var(--border)] bg-white p-4 sm:mt-5 sm:p-5"
              aria-label="First-screen purchase path"
              data-commerce-paused={commercePathPaused ? "true" : undefined}
              data-first-viewport-commerce="true"
            >
              <div>
                <p className="text-xs font-bold uppercase text-[var(--muted)]">{commercePathPaused ? "Exact retailer links paused" : "Current retailer option"}</p>
                <h2 className="mt-2 text-lg font-bold sm:text-xl">{topPick?.amazonTitle ?? topPick?.name ?? commerceProduct?.amazonTitle ?? commerceProduct?.name}</h2>
                {commerceIsAlternative ? (
                  <p className="mt-2 text-sm leading-5 text-[var(--muted)]">Different product: the first pick has no verified retailer path; this button is for {commerceProduct?.name}.</p>
                ) : commercePathPaused ? (
                  <p className="mt-2 text-sm leading-5 text-[var(--muted)]">The named product links are paused while their exact listings are rechecked. No unrelated product is substituted.</p>
                ) : topPick ? (
                  <p className="mt-2 text-sm leading-5 text-[var(--muted)]">Best for {topPick.bestFor.toLowerCase()}. Open the listing to compare the live price, availability, delivery, seller, and returns.</p>
                ) : null}
                {roundup.purchaseCheck ? <p className="mt-3 text-sm leading-6" data-roundup-purchase-check="true">{roundup.purchaseCheck}</p> : null}
              </div>
              <div className="flex flex-wrap items-start gap-2">
                {commerceProduct ? <AffiliateButtonGroup site={site.key} product={commerceProduct} position={commerceIsAlternative ? "roundup-first-viewport-verified-alternative" : "roundup-first-viewport-primary"} limit={1} firstViewport /> : null}
                {topPick ? <Link className="button-secondary" href={`/reviews/${topPick.slug}`}>Product guide</Link> : null}
              </div>
            </div>
          ) : null}
          <p className="mt-4 text-base leading-7 text-[var(--muted)] sm:mt-5 sm:text-lg sm:leading-8">{buyerFacingSummary(roundup.dek)}</p>
          {effectiveUpdatedAt ? (
            <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1 text-xs font-semibold text-[var(--muted)] sm:mt-4 sm:gap-y-2 sm:text-sm">
              <Link className="hidden underline underline-offset-4 sm:inline" href="/about">Prepared by the {site.name} editorial desk</Link>
              <span>Updated {effectiveUpdatedAt}</span>
            </div>
          ) : null}
          {roundup.intro ? <p className="mt-5 max-w-3xl leading-8 text-[var(--muted)]">{roundup.intro}</p> : null}
          <div className="mt-6 rounded-md border border-[var(--border)] bg-[var(--surface-muted)] p-5">
            <p className="text-xs font-bold uppercase text-[var(--muted)]">Quick answer</p>
            <p className="mt-2 text-lg font-bold leading-8 text-[var(--text)]">{answer}</p>
          </div>
          {searchOpportunity ? <SearchOpportunityBlock opportunity={searchOpportunity} /> : null}
          <SearchOpportunityBacklinks site={site.key} kind="roundup" slug={slug} />
          <BaseMarketEditionLinks site={site} basePath={`/best/${slug}`} />
        </div>
        <div className="mt-8 grid min-w-0 gap-5 lg:grid-cols-[minmax(0,1fr)_320px]">
          <div className="min-w-0 space-y-5">
            <Disclosure site={site} />
            {picks.length ? (
              <section className="panel scroll-mt-6 overflow-hidden" id="quick-comparison">
                <div className="border-b border-[var(--border)] p-5">
                  <h2 className="text-xl font-bold">Quick comparison</h2>
                  <p className="mt-2 text-sm leading-6 text-[var(--muted)]">Start here if you already know the job you need the product to solve.</p>
                </div>
                <div className="divide-y divide-[var(--border)]">
                  {picks.map((product, index) =>
                    product ? (
                      <div className="grid min-w-0 gap-4 p-5 md:grid-cols-[44px_minmax(0,1fr)_minmax(0,1fr)]" key={product.slug}>
                        <div className="flex h-9 w-9 items-center justify-center rounded-md bg-[var(--brand-soft)] text-sm font-black text-[var(--brand-strong)] md:row-span-3">
                          {index + 1}
                        </div>
                        <div className="min-w-0 md:col-span-2">
                          <p className="text-xs font-bold uppercase text-[var(--muted)]">{product.brand}</p>
                          <h3 className="mt-1 font-bold">{product.amazonTitle ?? product.name}</h3>
                        </div>
                        <div>
                          <p className="text-xs font-bold uppercase text-[var(--muted)]">Best for</p>
                          <p className="mt-1 text-sm leading-6">{product.bestFor}</p>
                        </div>
                        <div>
                          <p className="text-xs font-bold uppercase text-[var(--muted)]">Check first</p>
                          <p className="mt-1 text-sm leading-6">{product.cons[0]}</p>
                        </div>
                        <div>
                          <p className="text-xs font-bold uppercase text-[var(--muted)]">Facts</p>
                          <p className="mt-1 text-sm leading-6">
                            {product.asin ? `ASIN ${product.asin}` : product.priceBand} · {product.category}
                          </p>
                        </div>
                        {roundup.purchaseFlow === "task-links" && product.purchaseCheck ? (
                          <p className="text-sm leading-6 text-[var(--muted)] md:col-span-2 md:col-start-2" data-roundup-model-purchase-check="true">{product.purchaseCheck}</p>
                        ) : null}
                        <div className={`flex flex-wrap items-start gap-2 md:justify-end ${roundup.purchaseFlow === "task-links" ? "md:col-start-3" : ""}`}>
                          <Link className="button-secondary" href={`/reviews/${product.slug}`}>
                            Notes
                          </Link>
                          <AffiliateButtonGroup site={site.key} product={product} position={`roundup-table-${index + 1}`} limit={1} />
                        </div>
                      </div>
                    ) : null,
                  )}
                </div>
              </section>
            ) : null}
            {picks.length ? (
              <section className="panel p-5">
                <h2 className="text-xl font-bold">Compare the current options</h2>
                <p className="mt-2 text-sm leading-6 text-[var(--muted)]">
                  Match the exact model, bundle, seller, coupon, and return window before choosing between the picks.
                </p>
                <p className="mt-2 text-xs leading-5 text-[var(--muted)] sm:hidden">Swipe across the table to compare details; the product name stays in view.</p>
                <div className="mt-4 overflow-x-auto rounded-md border border-[var(--border)]" role="region" aria-label="Compare the current options" tabIndex={0}>
                  <table className="w-full min-w-[820px] text-left text-sm">
                    <thead className="bg-[var(--surface-muted)] text-xs uppercase text-[var(--muted)]">
                      <tr>
                        <th className="sticky left-0 z-20 min-w-[160px] bg-[var(--surface-muted)] px-4 py-3" scope="col">Pick</th>
                        <th className="px-4 py-3" scope="col">Key fit details</th>
                        <th className="px-4 py-3" scope="col">Exact listing</th>
                        <th className="px-4 py-3" scope="col">What can change</th>
                        <th className="px-4 py-3" scope="col">Updated</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[var(--border)] bg-white">
                      {picks.map((product) => (
                        <tr key={product.slug}>
                          <th className="sticky left-0 z-10 min-w-[160px] bg-white px-4 py-4 font-bold" scope="row">
                            <Link className="hover:text-[var(--brand-strong)] hover:underline" href={`/reviews/${product.slug}`}>
                              {product.amazonTitle ?? product.name}
                            </Link>
                          </th>
                          <td className="px-4 py-4 text-[var(--muted)]">
                            {Object.entries(product.specs)
                              .filter(([key]) => key !== "Link status" && key !== "ASIN")
                              .slice(0, 2)
                              .map(([key, value]) => `${key}: ${value}`)
                              .join(" · ") || product.bestFor}
                          </td>
                          <td className="px-4 py-4 text-[var(--muted)]">{product.asin ? `ASIN ${product.asin}` : product.specs.ASIN ?? "Confirm live listing"}</td>
                          <td className="px-4 py-4 text-[var(--muted)]">{product.offers[0]?.priceNote ?? product.evidence[0] ?? "Confirm seller, bundle, and return path"}</td>
                          <td className="px-4 py-4 text-[var(--muted)]">{product.updatedAt ?? "Pending"}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </section>
            ) : null}
            {roundup.decisionGuide?.length ? (
              <section className="panel p-5">
                <h2 className="text-xl font-bold">Quick picks by situation</h2>
                <div className="mt-4 grid gap-3 sm:grid-cols-2">
                  {roundup.decisionGuide.map((item) => (
                    <div className="rounded-md border border-[var(--border)] bg-[var(--surface-muted)] p-4" key={item.label}>
                      <h3 className="text-sm font-bold text-[var(--text)]">{item.label}</h3>
                      <p className="mt-2 text-sm leading-6 text-[var(--muted)]">{item.detail}</p>
                    </div>
                  ))}
                </div>
              </section>
            ) : null}
            {roundup.comparisonTable ? (
              <section className="panel scroll-mt-24 p-5" id="roundup-comparison">
                <p className="eyebrow">Side-by-side checks</p>
                <h2 className="mt-3 text-xl font-bold">{roundup.comparisonTable.title}</h2>
                {roundup.purchaseFlow === "task-links" ? <p className="mt-3 text-sm text-[var(--muted)]">Scroll across to compare models; the check name stays in view.</p> : null}
                <div className={`mt-5 overflow-x-auto rounded-md border border-[var(--border)] bg-white ${roundup.purchaseFlow === "task-links" ? "[container-type:inline-size]" : ""}`} role="region" aria-label={roundup.comparisonTable.title} tabIndex={0}>
                  <table className={`text-left text-sm ${roundup.purchaseFlow === "task-links" && roundup.comparisonTable.columns.length === 2 ? "w-[calc(200cqw-7rem)] table-fixed md:w-full md:table-auto" : `w-full ${roundup.comparisonTable.columns.length <= 2 ? "min-w-[600px]" : "min-w-[920px]"}`}`}>
                    <thead className="bg-[var(--surface-muted)] text-xs uppercase text-[var(--muted)]">
                      <tr>
                        <th className={`px-4 py-3 ${roundup.purchaseFlow === "task-links" ? "sticky left-0 z-10 w-28 bg-[var(--surface-muted)] md:w-auto" : ""}`} scope="col">Check</th>
                        {roundup.comparisonTable.columns.map((column) => (
                          <th className="px-4 py-3" scope="col" key={column}>{column}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[var(--border)]">
                      {roundup.comparisonTable.rows.map((row) => (
                        <tr key={row.label}>
                          <th className={`px-4 py-4 font-bold ${roundup.purchaseFlow === "task-links" ? "sticky left-0 z-10 bg-white" : ""}`} scope="row">{row.label}</th>
                          {roundup.comparisonTable?.columns.map((column, index) => (
                            <td className="px-4 py-4 leading-6 text-[var(--muted)]" key={`${row.label}-${column}`}>
                              {row.values[index] ?? "Confirm before purchase"}
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                {roundup.purchaseFlow === "task-links" ? (
                  <div className="mt-5 grid gap-3 sm:grid-cols-2" aria-label="Exact models from this comparison" data-comparison-model-actions="true">
                    {picks.map((product) => (
                      <div className="min-w-0 rounded-md border border-[var(--border)] bg-white p-4" key={product.slug}>
                        <h3 className="font-bold">{product.amazonTitle ?? product.name}</h3>
                        {product.purchaseCheck ? <p className="my-3 text-sm leading-6 text-[var(--muted)]">{product.purchaseCheck}</p> : null}
                        {product.offers.length ? <AffiliateButtonGroup site={site.key} product={product} position="roundup-comparison-exact-model" limit={1} sticky={false} /> : <p className="mt-3 text-sm font-bold">Exact retailer option paused</p>}
                        <Link className="mt-3 block text-sm font-bold underline" href={`/reviews/${product.slug}`}>Check the model details</Link>
                      </div>
                    ))}
                  </div>
                ) : null}
                {site.key === "baby" && ["babybjorn-harmony-vs-ergobaby-omni-breeze", "dr-browns-vs-baby-brezza-sterilizer-dryer"].includes(roundup.slug) ? <>
                  <div className="mt-5 grid gap-3 sm:grid-cols-2" aria-label="Exact models from this comparison" data-comparison-model-actions="true">
                    {picks.slice(0,2).map(product => <div className="min-w-0 rounded-md border border-[var(--border)] bg-white p-4" key={product.slug}>
                      <h3 className="font-bold">{product.name}</h3>
                      <p className="my-3 text-sm leading-6 text-[var(--muted)]">{product.slug === "babybjorn-carrier-harmony" ? "Compare for front-access fastening after checking the child's size, allowed position and fit on each caregiver. Confirm Silver 3D Mesh and the exact return terms." : product.slug === "ergobaby-omni-breeze-carrier" ? "Compare when hip carry or the higher overall range has a job. This is Omni Breeze in Onyx Black; use its own position instructions." : product.slug === "dr-browns-all-in-one-sterilizer-dryer" ? "Compare when the six-bottle layout fits your actual washed parts. Confirm AC177/AC377, the selected bundle and voltage." : "Compare Advanced when its larger modular layout fits your actual washed parts. Confirm Sterilizer Dryer Advanced, colour and voltage; Washer Pro is a different appliance."}</p>
                      {product.offers.length ? <AffiliateButtonGroup site={site.key} product={product} position="roundup-comparison-exact-model" limit={1} sticky={false} /> : <p className="text-sm font-bold">Exact retailer option paused</p>}
                      <Link className="mt-3 block text-sm font-bold underline" href={`/reviews/${product.slug}`}>Check the model details</Link>
                    </div>)}
                  </div>
                  <p className="mt-4 text-sm leading-6">Keep a working setup when it already meets the job. Pause the purchase when the exact model, child or part fit, or return conditions remain unclear.</p>
                </> : null}
              </section>
            ) : null}
            {roundup.sections?.map((section) => (
              <section className="panel p-5" key={section.heading}>
                <h2 className="text-xl font-bold">{buyerFacingHeading(section.heading)}</h2>
                <p className="mt-3 leading-7 text-[var(--muted)]">{buyerFacingBody(section.body)}</p>
              </section>
            ))}
            <section className="panel p-5">
              <h2 className="text-xl font-bold">How to choose without overbuying</h2>
              <div className="mt-4 grid gap-5 md:grid-cols-2">
                <div>
                  <h3 className="text-sm font-bold uppercase text-[var(--muted)]">When to spend more</h3>
                  <p className="mt-2 leading-7 text-[var(--muted)]">{advice.spendMore}</p>
                </div>
                <div>
                  <h3 className="text-sm font-bold uppercase text-[var(--muted)]">When to spend less</h3>
                  <p className="mt-2 leading-7 text-[var(--muted)]">{advice.spendLess}</p>
                </div>
              </div>
              <div className="mt-5">
                <h3 className="text-sm font-bold uppercase text-[var(--muted)]">Compare these details first</h3>
                <div className="mt-3 grid gap-3 sm:grid-cols-2">
                  {advice.compare.map((item) => (
                    <div className="rounded-md border border-[var(--border)] bg-[var(--surface-muted)] px-4 py-3 text-sm font-semibold" key={item}>
                      {item}
                    </div>
                  ))}
                </div>
              </div>
            </section>
            {relatedGuides.length ? (
              <section className="panel p-5">
                <h2 className="text-xl font-bold">Related setup and buying guides</h2>
                <div className="mt-4 grid gap-4 sm:grid-cols-2">
                  {relatedGuides.map((guide) => (
                    <Link className="rounded-md border border-[var(--border)] bg-[var(--surface-muted)] p-4" href={`/guides/${guide.slug}`} key={guide.slug}>
                      <p className="text-xs font-bold uppercase text-[var(--muted)]">{guide.category}</p>
                      <h3 className="mt-2 font-bold">{guide.title}</h3>
                      <p className="mt-2 text-sm leading-6 text-[var(--muted)]">{guide.dek}</p>
                    </Link>
                  ))}
                </div>
              </section>
            ) : null}
            {picks.map((product) => (
              <ProductCard key={product.slug} product={product} />
            ))}
            <section className="panel p-5">
              <h2 className="text-xl font-bold">FAQ</h2>
              <div className="mt-4 divide-y divide-[var(--border)]">
                {roundup.faqs.map((faq) => (
                  <div className="py-4" key={faq.question}>
                    <h3 className="font-bold">{faq.question}</h3>
                    <p className="mt-2 leading-7 text-[var(--muted)]">{faq.answer}</p>
                  </div>
                ))}
              </div>
            </section>
            <section className="panel p-5">
              <h2 className="text-xl font-bold">Sources and methodology</h2>
              <ul className="mt-4 space-y-2 text-sm leading-6 text-[var(--muted)]">
                {roundup.methodology.map((item) => <li key={item}>{item}</li>)}
              </ul>
              {sources.length ? (
                <div className="mt-5 grid gap-3 sm:grid-cols-2">
                  {sources.map((source) => (
                    <a className="rounded-md border border-[var(--border)] bg-[var(--surface-muted)] p-3 text-sm font-semibold text-[var(--brand-strong)] hover:underline" href={source.url} key={source.url} rel="noopener noreferrer" target="_blank">
                      {source.name}
                    </a>
                  ))}
                </div>
              ) : null}
            </section>
          </div>
          <aside className="space-y-5 lg:sticky lg:top-24 lg:self-start">
            <div className="panel p-5">
              <h2 className="text-xl font-bold">Who this helps</h2>
              <p className="mt-3 leading-7 text-[var(--muted)]">{roundup.intent}</p>
            </div>
          </aside>
        </div>
      </div>
    </main>
  );
}
