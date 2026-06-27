import Link from "next/link";
import { notFound } from "next/navigation";
import { AffiliateButton } from "@/components/AffiliateButton";
import { JsonLd } from "@/components/JsonLd";
import { Disclosure, MethodologyList, ProductCard } from "@/components/LayoutParts";
import { findProduct, findRoundup } from "@/lib/content";
import { breadcrumbSchema, faqPageSchema, itemListSchema, pageMetadata } from "@/lib/seo";
import { getCurrentSite } from "@/lib/sites";
import type { SiteKey } from "@/lib/types";

function quickAnswer(roundupTitle: string, intent: string, picks: Array<ReturnType<typeof findProduct>>) {
  const firstPick = picks.find(Boolean);
  if (!firstPick) return intent;

  return `${roundupTitle}: start with ${firstPick.name} if your main need is ${firstPick.bestFor.toLowerCase()}. Compare the trade-offs before buying, especially ${firstPick.cons[0].toLowerCase()}.`;
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
};

function getRoundupAdvice(siteKey: SiteKey, category: string) {
  return roundupAdvice[siteKey][category] ?? {
    spendMore: "Spend more when the upgrade removes a repeated daily problem and has a clear return path if it does not fit.",
    spendLess: "Spend less when a simpler product solves the same use case with fewer parts, subscriptions, or cleaning steps.",
    compare: ["Exact model and version", "Room or body fit", "Cleaning and setup friction", "Return window"],
  };
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const site = await getCurrentSite();
  const { slug } = await params;
  const roundup = findRoundup(site.key, slug);
  if (!roundup) return {};
  return pageMetadata(site, `/best/${slug}`, roundup.title, roundup.dek);
}

export default async function RoundupPage({ params }: { params: Promise<{ slug: string }> }) {
  const site = await getCurrentSite();
  const { slug } = await params;
  const roundup = findRoundup(site.key, slug);
  if (!roundup) notFound();
  const picks = roundup.productSlugs.map((productSlug) => findProduct(site.key, productSlug)).filter(Boolean);
  const answer = quickAnswer(roundup.title, roundup.intent, picks);
  const advice = getRoundupAdvice(site.key, roundup.category);

  return (
    <main className="section">
      <JsonLd data={breadcrumbSchema(site, [{ name: "Home", path: "/" }, { name: roundup.title, path: `/best/${slug}` }])} />
      <JsonLd data={itemListSchema(site, roundup.title, picks.map((product) => ({ name: product!.name, path: `/reviews/${product!.slug}` })))} />
      <JsonLd data={faqPageSchema(roundup.faqs)} />
      <div className="shell">
        <div className="max-w-3xl">
          <p className="eyebrow">{roundup.category}</p>
          <h1 className="mt-3 text-4xl font-black leading-tight">{roundup.title}</h1>
          <p className="mt-5 text-lg leading-8 text-[var(--muted)]">{roundup.dek}</p>
          {roundup.intro ? <p className="mt-4 max-w-3xl leading-8 text-[var(--muted)]">{roundup.intro}</p> : null}
          <div className="mt-6 rounded-md border border-[var(--border)] bg-[var(--surface-muted)] p-5">
            <p className="text-xs font-bold uppercase text-[var(--muted)]">Quick answer</p>
            <p className="mt-2 text-lg font-bold leading-8 text-[var(--text)]">{answer}</p>
          </div>
        </div>
        <div className="mt-8 grid gap-5 lg:grid-cols-[1fr_320px]">
          <div className="space-y-5">
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
                          {product.offers[0] ? <AffiliateButton site={site.key} product={product} offer={product.offers[0]} position={`roundup-table-${index + 1}`} /> : null}
                        </div>
                      </div>
                    ) : null,
                  )}
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
            {picks.map((product, index) => product && <ProductCard key={product.slug} site={site} product={product} position={`roundup-${index + 1}`} />)}
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
          <aside className="space-y-5">
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
