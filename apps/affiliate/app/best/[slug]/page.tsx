import Link from "next/link";
import { notFound } from "next/navigation";
import { AffiliateButtonGroup } from "@/components/AffiliateButton";
import { JsonLd } from "@/components/JsonLd";
import { Disclosure, MethodologyList, ProductCard } from "@/components/LayoutParts";
import { StyleCollectionPage } from "@/components/StyleExperience";
import { findProduct, findRoundup, siteGuides } from "@/lib/content";
import { breadcrumbSchema, faqPageSchema, pageMetadata, roundupProductListSchema } from "@/lib/seo";
import { getCurrentSite } from "@/lib/sites";
import type { Product, SiteKey } from "@/lib/types";

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
  style: {
    jewelry: {
      spendMore: "Spend more when the exact materials, closure, construction, and dimensions support comfortable repeat wear.",
      spendLess: "Spend less when the piece is highly occasion-specific or the listing does not identify the material details you need.",
      compare: ["Length and width", "Closure style", "Exact material claims", "Seller and return path"],
    },
    bags: {
      spendMore: "Spend more when construction, strap adjustment, usable capacity, and licensed design all support regular carry.",
      spendLess: "Spend less when a neutral bag plus a removable charm creates the same outfit effect with more flexibility.",
      compare: ["Exterior and opening size", "Real carry list", "Strap range", "Material and care"],
    },
    hair: {
      spendMore: "Spend more when the spring, teeth, finish, and size support the hairstyle you repeat most often.",
      spendLess: "Spend less on highly seasonal motifs or multipacks when only one clip size fits your hair.",
      compare: ["Clip dimensions", "Hair volume", "Spring and teeth", "Snag risk"],
    },
    scarves: {
      spendMore: "Spend more for a verified fiber, finished edges, and dimensions that support several real tying methods.",
      spendLess: "Spend less when the scarf will mainly decorate a bag handle or serve one event outfit.",
      compare: ["Fiber claim", "Dimensions", "Edge finish", "Care"],
    },
    socks: {
      spendMore: "Spend more when the fiber blend, heel shape, cuff, and wash performance make the pair easy to repeat.",
      spendLess: "Spend less on multipacks when novelty matters more than long-term structure.",
      compare: ["Size range", "Fiber blend", "Cuff fit", "Pattern stretch"],
    },
    styling: {
      spendMore: "Spend more on one focal accessory that works with several owned outfits and is comfortable enough to repeat.",
      spendLess: "Spend less on a trend-specific motif that requires several new clothing purchases to make it work.",
      compare: ["Focal zone", "Color repetition", "Visual scale", "Dress-code fit"],
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

function officialSourceLinks(products: Product[]) {
  return Array.from(
    new Map(
      products
        .flatMap((product) => product.sources ?? [])
        .map((source) => [source.url, source]),
    ).values(),
  ).slice(0, 8);
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const site = await getCurrentSite();
  const { slug } = await params;
  const roundup = findRoundup(site.key, slug);
  if (!roundup) return {};
  return pageMetadata(site, `/best/${slug}`, roundup.seoTitle ?? roundup.title, roundup.dek);
}

export default async function RoundupPage({ params }: { params: Promise<{ slug: string }> }) {
  const site = await getCurrentSite();
  const { slug } = await params;
  const roundup = findRoundup(site.key, slug);
  if (!roundup) notFound();
  const picks = roundup.productSlugs
    .map((productSlug) => findProduct(site.key, productSlug))
    .filter((product): product is NonNullable<ReturnType<typeof findProduct>> => Boolean(product));
  const topPick = picks[0];
  const topPickTradeOff = topPick?.cons[0] ?? "Confirm exact model, seller, and current configuration before checkout.";
  const category = site.categories.find((item) => item.slug === roundup.category);
  const relatedGuides = siteGuides(site.key)
    .filter((guide) => guide.relatedRoundups.includes(roundup.slug))
    .slice(0, 6);
  const answer = quickAnswer(roundup.title, roundup.intent, picks);
  const advice = getRoundupAdvice(site.key, roundup.category);
  const sources = officialSourceLinks(picks);
  if (site.key === "style") {
    return (
      <>
        <JsonLd
          data={breadcrumbSchema(site, [
            { name: "Home", path: "/" },
            ...(category ? [{ name: category.name, path: `/categories/${category.slug}` }] : []),
            { name: roundup.title, path: `/best/${slug}` },
          ])}
        />
        <JsonLd data={roundupProductListSchema(site, roundup.title, picks)} />
        <JsonLd data={faqPageSchema(roundup.faqs)} />
        <StyleCollectionPage site={site} roundup={roundup} products={picks} />
      </>
    );
  }

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
          <h1 className="mt-3 text-4xl font-black leading-tight">{roundup.title}</h1>
          <p className="mt-5 text-lg leading-8 text-[var(--muted)]">{roundup.dek}</p>
          {roundup.updatedAt ? (
            <div className="mt-4 flex flex-wrap gap-x-4 gap-y-2 text-sm font-semibold text-[var(--muted)]">
              <span>Prepared by the {site.name} editorial desk</span>
              <span>Updated {roundup.updatedAt}</span>
            </div>
          ) : null}
          {topPick ? (
            <div className="mt-5 grid gap-4 rounded-md border border-[var(--border)] bg-white p-5 sm:grid-cols-[1fr_auto]">
              <div>
                <p className="text-xs font-bold uppercase text-[var(--muted)]">Best starting pick</p>
                <h2 className="mt-2 text-xl font-bold">{topPick.amazonTitle ?? topPick.name}</h2>
                <p className="mt-2 text-sm leading-6 text-[var(--muted)]">Best for: {topPick.bestFor}</p>
                <p className="mt-1 text-sm leading-6 text-[var(--muted)]">Skip if: {topPickTradeOff}</p>
                <p className="mt-1 text-sm font-semibold leading-6 text-[var(--brand-strong)]">Price band: {topPick.priceBand}</p>
              </div>
              <div className="flex flex-wrap items-start gap-2 sm:justify-end">
                <Link className="button-secondary" href={`/reviews/${topPick.slug}`}>
                  Evidence notes
                </Link>
                <AffiliateButtonGroup site={site.key} product={topPick} position="roundup-hero-primary" limit={1} />
              </div>
            </div>
          ) : null}
          {roundup.intro ? <p className="mt-5 max-w-3xl leading-8 text-[var(--muted)]">{roundup.intro}</p> : null}
          <div className="mt-6 rounded-md border border-[var(--border)] bg-[var(--surface-muted)] p-5">
            <p className="text-xs font-bold uppercase text-[var(--muted)]">Quick answer</p>
            <p className="mt-2 text-lg font-bold leading-8 text-[var(--text)]">{answer}</p>
          </div>
        </div>
        <div className="mt-8 grid min-w-0 gap-5 lg:grid-cols-[minmax(0,1fr)_320px]">
          <div className="min-w-0 space-y-5">
            <Disclosure site={site} />
            {picks.length ? (
              <section className="panel overflow-hidden">
                <div className="border-b border-[var(--border)] p-5">
                  <h2 className="text-xl font-bold">Quick comparison</h2>
                  <p className="mt-2 text-sm leading-6 text-[var(--muted)]">Start here if you already know the job you need the product to solve.</p>
                </div>
                <div className="divide-y divide-[var(--border)]">
                  {picks.map((product, index) =>
                    product ? (
                      <div className="grid gap-4 p-5 md:grid-cols-[44px_1.1fr_1fr_1fr_0.8fr_auto]" key={product.slug}>
                        <div className="flex h-9 w-9 items-center justify-center rounded-md bg-[var(--brand-soft)] text-sm font-black text-[var(--brand-strong)]">
                          {index + 1}
                        </div>
                        <div>
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
                        <div className="flex flex-wrap items-start gap-2 md:justify-end">
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
                <h2 className="text-xl font-bold">Evidence basis and listing risk</h2>
                <p className="mt-2 text-sm leading-6 text-[var(--muted)]">
                  We use manufacturer specs where available, then treat Amazon as a listing-verification step for ASIN, bundle, seller, coupon, and return-window risk.
                </p>
                <div className="mt-4 overflow-x-auto rounded-md border border-[var(--border)]">
                  <table className="w-full min-w-[820px] text-left text-sm">
                    <thead className="bg-[var(--surface-muted)] text-xs uppercase text-[var(--muted)]">
                      <tr>
                        <th className="px-4 py-3">Pick</th>
                        <th className="px-4 py-3">Official specs</th>
                        <th className="px-4 py-3">Amazon/listing anchor</th>
                        <th className="px-4 py-3">Version or price risk</th>
                        <th className="px-4 py-3">Updated</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[var(--border)] bg-white">
                      {picks.map((product) => (
                        <tr key={product.slug}>
                          <th className="px-4 py-4 font-bold">
                            <Link className="hover:text-[var(--brand-strong)] hover:underline" href={`/reviews/${product.slug}`}>
                              {product.amazonTitle ?? product.name}
                            </Link>
                          </th>
                          <td className="px-4 py-4 text-[var(--muted)]">
                            {product.sources?.length ? `${product.sources.length} source${product.sources.length === 1 ? "" : "s"}` : "Source link pending"}
                          </td>
                          <td className="px-4 py-4 text-[var(--muted)]">{product.asin ? `ASIN ${product.asin}` : product.specs.ASIN ?? "Confirm live listing"}</td>
                          <td className="px-4 py-4 text-[var(--muted)]">{product.offers[0]?.priceNote ?? product.evidence[0] ?? "Confirm seller, bundle, and return path"}</td>
                          <td className="px-4 py-4 text-[var(--muted)]">{product.updatedAt ?? "Pending"}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                {sources.length ? (
                  <div className="mt-4 grid gap-3 sm:grid-cols-2">
                    {sources.map((source) => (
                      <a className="rounded-md border border-[var(--border)] bg-[var(--surface-muted)] p-4 text-sm font-semibold text-[var(--brand-strong)] hover:underline" href={source.url} key={source.url} rel="noopener noreferrer" target="_blank">
                        {source.name}
                      </a>
                    ))}
                  </div>
                ) : null}
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
            {roundup.sections?.map((section) => (
              <section className="panel p-5" key={section.heading}>
                <h2 className="text-xl font-bold">{section.heading}</h2>
                <p className="mt-3 leading-7 text-[var(--muted)]">{section.body}</p>
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
            {picks.map((product, index) => (
              <ProductCard key={product.slug} site={site} product={product} position={`roundup-${index + 1}`} offerLimit={1} />
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
          </div>
          <aside className="space-y-5 lg:sticky lg:top-24 lg:self-start">
            <MethodologyList items={roundup.methodology} />
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
