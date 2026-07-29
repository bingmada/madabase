import { ArrowRight, CalendarClock, CircleAlert, PlugZap, Ruler, Sparkles } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { JsonLd } from "@/components/JsonLd";
import { CostumeCatalogCard } from "@/components/CostumeCatalog";
import { Disclosure } from "@/components/LayoutParts";
import { listCuratedCostumeProducts } from "@/lib/costume-catalog";
import { costumeHalloweenPicks, costumeHalloweenSlugs } from "@/lib/costume-halloween";
import { costumeHalloweenIdeas } from "@/lib/costume-halloween-ideas";
import { breadcrumbSchema, itemListSchema, pageMetadata } from "@/lib/seo";
import { getCurrentSite } from "@/lib/sites";

export const dynamic = "force-dynamic";

export async function generateMetadata() {
  const site = await getCurrentSite();
  if (site.key !== "costume") return {};

  return pageMetadata(
    site,
    "/halloween",
    "Halloween Costumes, Masks, Animatronics, and Decorations for 2026",
    "Plan a complete 2026 Halloween look or haunted setup with selected costumes, masks, animatronics, pumpkins, lights, sizing checks, and ordering timelines.",
    "/images/affiliate/hero-halloween-costume-studio-v1.webp",
  );
}

const planningSteps = [
  {
    label: "Now through August",
    title: "Solve high-risk choices first",
    body: "Start with uncertain sizing, premium creature costumes, masks, large props, special effects, and anything that needs assembly, lighting, practice, or an exchange window.",
  },
  {
    label: "September",
    title: "Fit, test, and complete the scene",
    body: "Walk, sit, see, breathe, trigger animatronics, test light and sound, map power and guest routes, and identify every missing accessory or consumable.",
  },
  {
    label: "Early October",
    title: "Protect delivery and backup time",
    body: "Recheck stock, exact variants, shipping promises, return terms, batteries, mounting hardware, makeup supplies, weather protection, and a simpler fallback.",
  },
  {
    label: "Final ten days",
    title: "Choose certainty over ambition",
    body: "Avoid an untested size or complicated effect merely because the photo is stronger. Prioritize confirmed stock, realistic arrival, safe setup, and a complete wearable or display plan.",
  },
];

const decisionChecks = [
  {
    icon: Ruler,
    title: "Costume and mask fit",
    body: "Use the exact product chart and head or body measurements. Confirm included pieces, visibility, breathing, movement, layers, footwear, and realistic wear time.",
  },
  {
    icon: PlugZap,
    title: "Prop installation",
    body: "Measure the box, delivery route, footprint, height, and movement envelope. Confirm power, triggers, sound, cables, weather limits, supervision, and storage.",
  },
  {
    icon: CircleAlert,
    title: "Checkout certainty",
    body: "Recheck the selected variant, current stock, shipping estimate, seller terms, seasonal returns, and every accessory needed to make the Halloween plan complete.",
  },
];

export default async function HalloweenPage() {
  const site = await getCurrentSite();
  if (site.key !== "costume") notFound();

  const products = await listCuratedCostumeProducts(costumeHalloweenSlugs);
  const productItems = products.map((product) => ({
    name: product.title,
    path: `/products/${product.slug}`,
  }));

  return (
    <main>
      <JsonLd data={breadcrumbSchema(site, [
        { name: "Home", path: "/" },
        { name: "Halloween 2026", path: "/halloween" },
      ])} />
      {productItems.length ? <JsonLd data={itemListSchema(site, "Selected Halloween costumes, masks, props, and decorations for 2026", productItems)} /> : null}

      <section className="relative overflow-hidden bg-[#0d0913] text-white">
        <Image
          alt=""
          className="absolute inset-0 h-full w-full object-cover"
          fill
          priority
          sizes="100vw"
          src="/images/affiliate/hero-halloween-costume-studio-v1.webp"
        />
        <div className="absolute inset-0 bg-black/45" />
        <div className="shell relative grid min-h-[560px] content-end pb-14 pt-24">
          <div className="max-w-3xl">
            <p className="text-xs font-black uppercase tracking-[0.16em] text-[#ffc56d]">Halloween 2026 planning guide</p>
            <h1 className="mt-4 text-4xl font-black leading-tight text-white sm:text-6xl">Build the look, scare, and setup before October 31.</h1>
            <p className="mt-5 max-w-2xl text-lg leading-8 text-white/85">
              Start early with the choices most likely to fail late: costume sizing, mask wearability, animatronic space and power, effect testing, missing pieces, shipping, and returns.
            </p>
            <div className="mt-7 flex flex-wrap gap-3">
              <Link className="button-primary !bg-[#df7627] !text-white" href="#halloween-picks">See the Halloween edit <ArrowRight aria-hidden="true" size={16} /></Link>
              <Link className="button-secondary bg-white/95" href="/guides/when-to-order-a-halloween-costume">Open the ordering timeline</Link>
            </div>
          </div>
        </div>
      </section>

      <section className="section bg-white">
        <div className="shell">
          <p className="eyebrow">Three decisions before checkout</p>
          <h2 className="mt-3 max-w-3xl text-3xl font-black sm:text-4xl">Halloween products fail in different ways.</h2>
          <div className="mt-8 grid gap-5 lg:grid-cols-3">
            {decisionChecks.map((check) => (
              <article className="panel p-5" key={check.title}>
                <check.icon aria-hidden="true" className="text-[#c45f1e]" size={23} />
                <h3 className="mt-4 text-xl font-bold">{check.title}</h3>
                <p className="mt-3 leading-7 text-[var(--muted)]">{check.body}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="section bg-[#170f20] text-white">
        <div className="shell">
          <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
            <div className="max-w-3xl">
              <p className="text-xs font-black uppercase tracking-[0.14em] text-[#ffc56d]">Original costume-to-scene recipes</p>
              <h2 className="mt-3 text-3xl font-black text-white sm:text-4xl">Choose a story before you choose more products.</h2>
              <p className="mt-4 leading-8 text-white/75">
                These editorial kits connect separately sold costumes, masks, props, and lights to a character, setting, build order, and safety checklist.
              </p>
            </div>
            <Link className="button-primary shrink-0 !bg-[#df7627] !text-white" href="/halloween-ideas">See all ideas & kits <ArrowRight aria-hidden="true" size={16} /></Link>
          </div>
          <div className="mt-8 grid gap-5 lg:grid-cols-3">
            {costumeHalloweenIdeas.map((idea) => (
              <Link className="rounded-md border border-white/15 bg-white/5 p-5 transition hover:bg-white/10" href={`/halloween-ideas/${idea.slug}`} key={idea.slug}>
                <p className="text-xs font-black uppercase tracking-[0.12em] text-[#ffc56d]">{idea.eyebrow}</p>
                <h3 className="mt-3 text-xl font-bold text-white">{idea.title}</h3>
                <p className="mt-3 leading-7 text-white/70">{idea.dek}</p>
                <span className="mt-5 inline-flex items-center gap-2 text-sm font-bold text-white">Open recipe <ArrowRight aria-hidden="true" size={16} /></span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="section" id="halloween-picks">
        <div className="shell">
          <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
            <div className="max-w-3xl">
              <p className="eyebrow">Selected from the active retailer catalog</p>
              <h2 className="mt-3 text-3xl font-black sm:text-4xl">{costumeHalloweenPicks.length} products with a clear Halloween job.</h2>
              <p className="mt-4 leading-8 text-[var(--muted)]">
                This is a deliberately small edit: five wearable transformations, three haunted-scene props, and four compact atmosphere pieces. Each product has an authorized Feed image and an active exact-product CJ destination.
              </p>
            </div>
            <Link className="button-secondary" href="/catalog?occasion=halloween">Filter the full Halloween catalog <ArrowRight aria-hidden="true" size={16} /></Link>
          </div>
          {products.length ? (
            <div className="mt-8 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
              {products.map((product) => <CostumeCatalogCard key={product.id} product={product} />)}
            </div>
          ) : (
            <div className="panel mt-8 p-6">
              <h3 className="text-xl font-bold">The Halloween edit is reconnecting to current retailer data.</h3>
              <p className="mt-3 leading-7 text-[var(--muted)]">Use the filtered catalog and planning guides while availability is refreshed.</p>
              <Link className="button-secondary mt-5" href="/catalog?occasion=halloween">Browse Halloween catalog</Link>
            </div>
          )}
        </div>
      </section>

      <section className="section bg-white">
        <div className="shell">
          <div className="max-w-3xl">
            <p className="eyebrow">Work backward from October 31</p>
            <h2 className="mt-3 text-3xl font-black sm:text-4xl">A practical Halloween ordering timeline</h2>
            <p className="mt-4 leading-8 text-[var(--muted)]">The right date depends on how many unknowns remain—not on a single universal shipping cutoff.</p>
          </div>
          <ol className="mt-8 grid gap-5 md:grid-cols-2">
            {planningSteps.map((step, index) => (
              <li className="panel p-5" key={step.label}>
                <div className="flex items-center gap-3">
                  <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-[#f8e5d5] font-black text-[#8f3f13]">{index + 1}</span>
                  <p className="text-xs font-black uppercase tracking-[0.12em] text-[var(--muted)]">{step.label}</p>
                </div>
                <h3 className="mt-4 text-xl font-bold">{step.title}</h3>
                <p className="mt-3 leading-7 text-[var(--muted)]">{step.body}</p>
              </li>
            ))}
          </ol>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link className="button-primary" href="/guides/when-to-order-a-halloween-costume"><CalendarClock aria-hidden="true" size={17} /> Read the full timing guide</Link>
            <Link className="button-secondary" href="/guides/costume-sizing-measurements-and-returns">Check sizing and return risk</Link>
            <Link className="button-secondary" href="/guides/large-prop-animatronic-space-and-power-checklist">Check prop space and power</Link>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="shell grid gap-6 lg:grid-cols-[1fr_.7fr]">
          <article className="panel p-6">
            <Sparkles aria-hidden="true" className="text-[#c45f1e]" size={23} />
            <h2 className="mt-4 text-2xl font-bold">Why this page starts early</h2>
            <p className="mt-3 leading-8 text-[var(--muted)]">
              Search discovery, costume exchanges, alterations, prop installation, makeup practice, and a tested backup all need lead time. The edit can change as stock changes, but the planning URL remains useful before and after Halloween.
            </p>
          </article>
          <Disclosure site={site} />
        </div>
      </section>
    </main>
  );
}
