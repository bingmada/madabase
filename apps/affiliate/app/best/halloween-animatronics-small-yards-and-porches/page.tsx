import { ArrowRight, CircleAlert, CloudRain, PackageCheck, PlugZap, Ruler, Route } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { CostumeCatalogCard } from "@/components/CostumeCatalog";
import { JsonLd } from "@/components/JsonLd";
import { Disclosure } from "@/components/LayoutParts";
import { listCuratedCostumeProducts } from "@/lib/costume-catalog";
import { costumeHalloweenPicks } from "@/lib/costume-halloween";
import { breadcrumbSchema, faqPageSchema, itemListSchema, pageMetadata } from "@/lib/seo";
import { getCurrentSite } from "@/lib/sites";

export const dynamic = "force-dynamic";

const pagePath = "/best/halloween-animatronics-small-yards-and-porches";
const pageTitle = "Best Halloween Animatronics for Small Yards and Porches (2026)";
const pageDescription = "Compare three Halloween animatronic formats for a small yard or porch by placement, power, weather protection, guest clearance, and storage.";

const animatronicSlugs = [
  "ground-breaker-zombie-left-arm-grabber-animatronic-prop-ghfielf",
  "floating-ghost-revenant-uv-reactive-animatronic-tocj9ij",
  "haunted-tree-led-light-up-animatronic-9oq3s6r",
];

const comparison = [
  {
    slug: animatronicSlugs[0],
    label: "Low path scare",
    format: "Ground-level moving prop",
    startHereWhen: "you want a low scare beside a controlled, covered route",
    placementRisk: "Reach, movement, cables, and trip exposure near guests",
    confirm: "Assembled footprint, movement envelope, trigger, power, weather limits, and supervision",
  },
  {
    slug: animatronicSlugs[1],
    label: "Overhead ghost effect",
    format: "Hanging UV-reactive effect",
    startHereWhen: "you have a dark, protected space plus verified mounting and UV coverage",
    placementRisk: "Mounting support, overhead movement, ambient light, and guest clearance",
    confirm: "Installed size and weight, mounting method, UV source, power, motion, and environmental limits",
  },
  {
    slug: animatronicSlugs[2],
    label: "Vertical focal point",
    format: "Standing lighted centerpiece",
    startHereWhen: "one supervised porch or entry focal point matters more than multiple small effects",
    placementRisk: "Height, footprint, wind exposure, power routing, and off-season storage",
    confirm: "Box and assembled dimensions, weight, motion, power, indoor/outdoor rating, and setup help",
  },
];

const setupChecks = [
  {
    icon: Ruler,
    title: "Measure the installed effect",
    body: "Record the assembled footprint, height, movement envelope, reach, and the route used to carry the box into place. A product photo cannot answer any of those fit questions.",
  },
  {
    icon: Route,
    title: "Protect the guest route",
    body: "Keep steps, railings, doors, sidewalks, and the exit path clear. Treat low movement, hanging parts, stakes, and extension cords as route hazards until the final setup proves otherwise.",
  },
  {
    icon: PlugZap,
    title: "Plan power before placement",
    body: "Confirm the current listing's power method, cord path, trigger, sound controls, and outlet needs. Do not assume an animatronic is battery-powered or that an adapter is weather-rated.",
  },
  {
    icon: CloudRain,
    title: "Treat weather claims literally",
    body: "If the exact listing does not state the needed outdoor or weather rating, plan a protected placement or skip it. Porch cover is not proof that wind or water cannot reach the product.",
  },
  {
    icon: PackageCheck,
    title: "Reserve storage now",
    body: "Check box dimensions, takedown steps, fragile moving parts, and dry storage before ordering. A compact display area can still create a large off-season storage problem.",
  },
];

const faqs = [
  {
    question: "What type of Halloween animatronic works best in a small yard?",
    answer: "Start with placement rather than theme. A low ground prop can work beside a controlled route, a hanging effect can preserve floor area when mounting is verified, and a vertical centerpiece can concentrate the scene in one location. Exact installed dimensions and movement still decide whether any option fits.",
  },
  {
    question: "Can I use an indoor Halloween animatronic on a covered porch?",
    answer: "Do not infer outdoor suitability from a covered location. Use the exact product's stated environmental and weather limits, account for wind-driven rain and condensation, and choose a protected alternative when the required rating is not explicit.",
  },
  {
    question: "Are Halloween animatronics battery-powered or plug-in?",
    answer: "Power varies by exact product and version. Confirm the current retailer listing, included adapter or battery requirements, cord length, outlet location, and weather-safe cable route before choosing the display position.",
  },
  {
    question: "How early should I order a Halloween animatronic?",
    answer: "Order early enough to inspect the exact item, assemble it, test movement and sound, solve power and mounting, and still have time for a return or simpler backup. Large, unfamiliar, or installation-heavy effects need more lead time than compact decor.",
  },
];

export async function generateMetadata() {
  const site = await getCurrentSite();
  if (site.key !== "costume") return {};

  return pageMetadata(site, pagePath, pageTitle, pageDescription);
}

export default async function SmallSpaceHalloweenAnimatronicsPage() {
  const site = await getCurrentSite();
  if (site.key !== "costume") notFound();

  const products = await listCuratedCostumeProducts(animatronicSlugs);
  const productsBySlug = new Map(products.map((product) => [product.slug, product]));
  const orderedProducts = animatronicSlugs.flatMap((slug) => {
    const product = productsBySlug.get(slug);
    return product ? [product] : [];
  });
  const heroProduct = orderedProducts.find((product) =>
    product.activeLink && product.authorizedImage && product.availability !== "out of stock",
  );
  const editorialPicks = costumeHalloweenPicks.filter((pick) => animatronicSlugs.includes(pick.slug));
  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: pageTitle,
    description: pageDescription,
    datePublished: "2026-08-03",
    dateModified: "2026-08-03",
    mainEntityOfPage: { "@type": "WebPage", "@id": new URL(pagePath, site.domain).toString() },
    author: { "@type": "Organization", name: `${site.name} editorial desk`, url: site.domain },
    publisher: { "@type": "Organization", name: site.name, url: site.domain },
    about: ["Halloween animatronics", "small yards", "porches", "haunted props"],
  };

  return (
    <main>
      <JsonLd
        data={breadcrumbSchema(site, [
          { name: "Home", path: "/" },
          { name: "Haunted Props", path: "/categories/props-animatronics" },
          { name: "Small-yard Halloween animatronics", path: pagePath },
        ])}
      />
      <JsonLd data={articleSchema} />
      <JsonLd data={faqPageSchema(faqs)} />
      {orderedProducts.length ? (
        <JsonLd
          data={itemListSchema(
            site,
            "Three Halloween animatronic formats for small yards and porches",
            orderedProducts.map((product) => ({ name: product.title, path: `/products/${product.slug}` })),
          )}
        />
      ) : null}

      <section className="border-b border-[#4a2b56] bg-[#170f20] text-white">
        <div className="shell py-14 sm:py-20">
          <Link className="text-xs font-black uppercase tracking-[0.14em] text-[#ffc56d] hover:underline" href="/categories/props-animatronics">
            Halloween props and animatronics
          </Link>
          <h1 className="mt-4 max-w-4xl text-4xl font-black leading-tight text-white sm:text-6xl">Best Halloween animatronics for small yards and porches</h1>
          {heroProduct?.activeLink ? (
            <div className="mt-5 flex flex-wrap gap-3" aria-label="First-screen CJ retailer option" data-first-viewport-commerce="true">
              <Link className="button-primary !bg-[#df7627] !text-white" href={`/go/cj/${heroProduct.activeLink.clickToken}`} rel="nofollow sponsored" data-first-viewport-affiliate="true">
                Check {heroProduct.title} at Abracadabra <ArrowRight aria-hidden="true" size={16} />
              </Link>
            </div>
          ) : null}
          <p className="mt-5 max-w-3xl text-lg leading-8 text-white/80">
            The right format is the one your real route can support. Compare one low path scare, one hanging UV effect, and one vertical centerpiece before committing space, power, mounting, or storage.
          </p>
          <div className="mt-7 max-w-3xl rounded-md border border-[#ffc56d]/35 bg-white/5 p-5">
            <p className="text-xs font-black uppercase tracking-[0.12em] text-[#ffc56d]">Direct answer</p>
            <p className="mt-3 leading-7 text-white/85">
              Choose the Ground Breaker for a controlled low placement, the Floating Ghost for a verified overhead UV setup, or the Haunted Tree for one vertical focal point. Skip all three until the exact listing confirms dimensions, power, weather limits, clearance, and return terms for your setup.
            </p>
          </div>
          <div className="mt-7 flex flex-wrap gap-3">
            <Link className="button-primary !bg-[#df7627] !text-white" href="#animatronic-picks">Compare the three picks <ArrowRight aria-hidden="true" size={16} /></Link>
            <Link className="button-secondary bg-white/95" href="/guides/large-prop-animatronic-space-and-power-checklist">Open the setup checklist</Link>
          </div>
          <p className="mt-5 text-sm leading-6 text-white/55">Updated August 3, 2026 · Research synthesis from the authorized CJ catalog and exact retailer listing identity; not a hands-on test.</p>
        </div>
      </section>

      <section className="section bg-white">
        <div className="shell">
          <p className="eyebrow">Format-first comparison</p>
          <h2 className="mt-3 max-w-3xl text-3xl font-black sm:text-4xl">Match the scare to the available zone.</h2>
          <div className="mt-8 overflow-x-auto rounded-md border border-[var(--border)]">
            <table className="w-full min-w-[820px] border-collapse text-left text-sm">
              <thead className="bg-[var(--surface-muted)]">
                <tr>
                  <th className="p-4 font-black">Use case</th>
                  <th className="p-4 font-black">Format</th>
                  <th className="p-4 font-black">Start here when</th>
                  <th className="p-4 font-black">Main placement risk</th>
                  <th className="p-4 font-black">Confirm before ordering</th>
                </tr>
              </thead>
              <tbody>
                {comparison.map((row) => (
                  <tr className="border-t border-[var(--border)] align-top" key={row.slug}>
                    <th className="p-4 font-bold">{row.label}</th>
                    <td className="p-4 leading-6 text-[var(--muted)]">{row.format}</td>
                    <td className="p-4 leading-6 text-[var(--muted)]">{row.startHereWhen}</td>
                    <td className="p-4 leading-6 text-[var(--muted)]">{row.placementRisk}</td>
                    <td className="p-4 leading-6 text-[var(--muted)]">{row.confirm}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="mt-4 text-sm leading-6 text-[var(--muted)]">This table compares installation formats, not unverified dimensions or weather ratings. Recheck the exact current listing before purchase.</p>
        </div>
      </section>

      <section className="section">
        <div className="shell">
          <p className="eyebrow">Small-space setup gate</p>
          <h2 className="mt-3 max-w-3xl text-3xl font-black sm:text-4xl">Five checks can eliminate the wrong prop quickly.</h2>
          <div className="mt-8 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {setupChecks.map((check) => (
              <article className="panel p-5" key={check.title}>
                <check.icon aria-hidden="true" className="text-[#c45f1e]" size={23} />
                <h3 className="mt-4 text-xl font-bold">{check.title}</h3>
                <p className="mt-3 leading-7 text-[var(--muted)]">{check.body}</p>
              </article>
            ))}
            <article className="panel border-[#d99162] bg-[#fff8f2] p-5">
              <CircleAlert aria-hidden="true" className="text-[#9b4212]" size={23} />
              <h3 className="mt-4 text-xl font-bold">Use a simpler backup</h3>
              <p className="mt-3 leading-7 text-[var(--muted)]">If fit, power, mounting, weather, or timing stays uncertain, use a static protected prop or lighting effect rather than forcing an animated setup into the route.</p>
            </article>
          </div>
        </div>
      </section>

      <section className="section bg-white" id="animatronic-picks">
        <div className="shell">
          <p className="eyebrow">Exact products in the current Costume catalog</p>
          <h2 className="mt-3 max-w-3xl text-3xl font-black sm:text-4xl">Three formats, each with a clear best-for and skip-if case.</h2>
          {orderedProducts.length ? (
            <div className="mt-8 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
              {orderedProducts.map((product) => <CostumeCatalogCard key={product.id} product={product} retailerCta />)}
            </div>
          ) : (
            <div className="panel mt-8 p-6">
              <h3 className="text-xl font-bold">Current retailer data is reconnecting.</h3>
              <p className="mt-3 leading-7 text-[var(--muted)]">Use the placement comparison and setup guide while exact product availability refreshes.</p>
            </div>
          )}
          <div className="mt-8 grid gap-5 lg:grid-cols-3">
            {editorialPicks.map((pick) => (
              <article className="panel p-5" key={pick.slug}>
                <p className="eyebrow">{pick.collection}</p>
                <h3 className="mt-3 text-xl font-bold">{pick.expectedTitle}</h3>
                <p className="mt-4 text-sm leading-6"><strong>Best for:</strong> {pick.bestFor}</p>
                <p className="mt-3 text-sm leading-6 text-[var(--muted)]"><strong className="text-[var(--text)]">Skip if:</strong> {pick.skipIf}</p>
                <Link className="mt-5 inline-flex items-center gap-2 text-sm font-bold text-[var(--brand-strong)]" href={`/products/${pick.slug}`}>Read exact product checks <ArrowRight aria-hidden="true" size={16} /></Link>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="section">
        <div className="shell grid gap-6 lg:grid-cols-[1fr_.65fr]">
          <article className="panel p-6">
            <p className="eyebrow">Frequently asked questions</p>
            <h2 className="mt-3 text-3xl font-black">Before the box arrives</h2>
            <div className="mt-6 divide-y divide-[var(--border)]">
              {faqs.map((faq) => (
                <div className="py-5 first:pt-0" key={faq.question}>
                  <h3 className="text-lg font-bold">{faq.question}</h3>
                  <p className="mt-3 leading-7 text-[var(--muted)]">{faq.answer}</p>
                </div>
              ))}
            </div>
            <div className="mt-6 flex flex-wrap gap-3">
              <Link className="button-secondary" href="/halloween">Return to Halloween planning</Link>
              <Link className="button-secondary" href="/guides/costume-prop-care-and-storage-guide">Plan storage and care</Link>
            </div>
          </article>
          <Disclosure site={site} />
        </div>
      </section>
    </main>
  );
}
