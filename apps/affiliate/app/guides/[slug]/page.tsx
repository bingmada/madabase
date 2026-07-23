import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { AffiliateButtonGroup } from "@/components/AffiliateButton";
import { JsonLd } from "@/components/JsonLd";
import { SearchOpportunityBacklinks, SearchOpportunityBlock } from "@/components/SearchOpportunityBlock";
import { StyleGuidePage } from "@/components/StyleExperience";
import { findGuide, findProduct, findRoundup, siteGuides } from "@/lib/content";
import { findSearchOpportunity } from "@/lib/search-opportunities";
import { breadcrumbSchema, guideSchema, pageMetadata } from "@/lib/seo";
import { getCurrentSite } from "@/lib/sites";
import type { SiteKey } from "@/lib/types";

type AdviceBlock = {
  checklist: string[];
  mistakes: string[];
  decision: string;
};

const siteAdvice: Record<SiteKey, AdviceBlock> = {
  pet: {
    checklist: [
      "Confirm the product fits the pet's size, food type, room layout, and cleaning routine.",
      "Check replacement parts, filters, bags, refills, or app features before comparing price.",
      "Read recent owner feedback for noise, durability, chewing risk, and setup friction.",
    ],
    mistakes: [
      "Buying the largest or smartest option before checking daily cleaning effort.",
      "Treating odor, hydration, feeding, or monitoring gear as a substitute for the routine itself.",
      "Ignoring where the pet actually eats, sleeps, waits, or makes messes during the day.",
    ],
    decision: "Choose the simpler product when the problem is routine consistency; choose the more specialized product only when it removes a repeated chore you already know you have.",
  },
  homeoffice: {
    checklist: [
      "Measure the desk, chair clearance, monitor distance, wall outlet path, and device count first.",
      "Check return policy for body-fit products such as chairs, desks, arms, and lighting.",
      "Confirm compatibility with your laptop, monitor weight, desk edge, cable path, and room lighting.",
    ],
    mistakes: [
      "Buying an ergonomic-looking product without checking the adjustment range.",
      "Solving visual clutter before solving posture, power, and daily connection friction.",
      "Assuming one accessory can fix a desk layout that lacks depth or cable slack.",
    ],
    decision: "Spend more when the product affects daily posture or every workday setup; spend less when the item is only organizing a stable setup you already like.",
  },
  baby: {
    checklist: [
      "Read the exact age, weight, position, cleaning, and safety-use limits for the model.",
      "Check whether the product solves a daily routine problem or only looks useful on a registry.",
      "Confirm the current bundle, accessories, replacement parts, and return path before buying.",
    ],
    mistakes: [
      "Buying for every possible scenario instead of the next few months of real care.",
      "Letting app features, analytics, or premium bundles distract from safe-use guidance.",
      "Choosing a large appliance or stroller before checking storage and cleaning friction.",
    ],
    decision: "Prefer the product that is easier to use consistently within manufacturer guidance; skip upgrades that add cleaning, charging, storage, or app work without solving a current routine problem.",
  },
  network: {
    checklist: [
      "Map the modem or ONT location, office desk, TV area, and any rooms that need wired stability.",
      "Check WAN/LAN port speeds, wired backhaul options, and whether your internet plan actually needs Wi-Fi 7.",
      "Count fixed devices separately from phones, tablets, and smart-home gear before buying a bigger system.",
    ],
    mistakes: [
      "Buying the fastest advertised Wi-Fi number while leaving the router in a bad location.",
      "Ignoring Ethernet paths that could make mesh nodes, TVs, consoles, or office desks more stable.",
      "Choosing a premium router before checking client device support, subscription features, and return path.",
    ],
    decision: "Spend more when coverage, wired backhaul, multi-gig ports, or device count solves a known bottleneck; spend less when placement or one Ethernet run fixes the problem first.",
  },
  smarthome: {
    checklist: [
      "Confirm the exact lock, doorbell, thermostat, controller, and ecosystem versions before buying.",
      "Check what remains available locally when Wi-Fi, cloud service, or a subscription is unavailable.",
      "Map wiring, door dimensions, radio coverage, storage, and household access before installation.",
    ],
    mistakes: [
      "Treating Matter, Thread, Zigbee, Wi-Fi, and Bluetooth as interchangeable labels.",
      "Buying an ecosystem feature before confirming the required hub, controller, or border router.",
      "Ignoring subscription boundaries, batteries, replacement access, and emergency fallback controls.",
    ],
    decision: "Choose the device with the clearest compatibility and local fallback path; add premium ecosystem features only when they remove a recurring household problem.",
  },
  style: {
    checklist: [
      "Use stated dimensions and compare them with an accessory already comfortable to wear or carry.",
      "Check closure, strap range, material language, seller, and return path before choosing the motif.",
      "Name the accessory's outfit role: focal point, color repeat, texture, or practical carry.",
    ],
    mistakes: [
      "Judging scale only from close-up product photography.",
      "Treating nickel-free, plated, base metal, and hypoallergenic as interchangeable claims.",
      "Combining several large novelty motifs without a shared palette or quiet clothing base.",
    ],
    decision: "Choose the expressive item that fits a real outfit and physical routine first; the most unusual design is useful only when its scale, comfort, and carry method make it easy to wear.",
  },
  costume: {
    checklist: [
      "Confirm the exact product or variant, included pieces, dimensions, materials, availability, delivery timing, and current return terms.",
      "Plan the full event workflow: fitting, movement, visibility, power, application, removal, transport, cleaning, and storage.",
      "Treat seasonal photography and a familiar license as starting points, not proof of fit, construction, or repeat-use value.",
    ],
    mistakes: [
      "Choosing from the character image without checking measurements and included components.",
      "Buying a large prop or effect before measuring doors, venue paths, power, weather exposure, and storage.",
      "Leaving delivery, exchanges, alterations, makeup practice, or prop testing until the final week.",
    ],
    decision: "Choose the option that can be fitted, used, transported, removed, cleaned, and stored safely for the real event; spend more only when construction or repeat use solves a known need.",
  },
};

const categoryAdvice: Record<string, string[]> = {
  feeding: ["Capacity matters only after you count real daily parts or meals.", "Cleaning access is a buying feature, not a minor detail.", "Recurring parts and refills can change the total cost more than the sale price."],
  "home-care": ["Separate source control from air or surface cleanup.", "Noise and placement matter because these products live in shared rooms.", "Replacement filters, bags, and refills should be checked before purchase."],
  comfort: ["Fit, washable materials, and long-term durability matter more than product photos.", "Measure the actual sleeping or resting area before choosing size.", "Skip soft upgrades that create more cleaning work than comfort."],
  desks: ["Depth and cable path usually matter more than desktop width.", "Standing setups need safe slack through the full height range.", "Measure the room path, chair pullout, and outlet location before buying."],
  ergonomics: ["Adjustment range is more important than an ergonomic label.", "Body-fit products need a realistic return path.", "Monitor and keyboard height should be solved separately."],
  meetings: ["Light placement usually improves calls before a new camera does.", "Avoid gear that requires awkward controls during meeting days.", "Check glare, background brightness, and audio before buying more accessories."],
  sleep: ["Safe-use guidance comes before convenience features.", "Night controls should be simple when caregivers are tired.", "Treat analytics and smart alerts as optional, not required."],
  travel: ["Folded size, carry weight, and storage routine matter together.", "Check age and weight limits before comparing style.", "The right travel product should also survive ordinary errands."],
  wifi: ["Coverage claims assume ideal rooms; walls, floors, and router placement change the result.", "Multi-gig ports matter only when the modem, router, switch, and client path can use them.", "Mesh is easier, but wired backhaul is usually the cleaner long-term upgrade."],
  wired: ["A cheap switch is fine for simple rooms, but port speed and management features matter for NAS or office setups.", "Cable category should match run length and future speed needs.", "Adapters and hubs should be checked against laptop charging, display, and Ethernet needs together."],
  backup: ["UPS sizing starts with modem, ONT, router, and mesh node power draw.", "Runtime claims depend on load, battery age, and outlet layout.", "Keep network backup simple enough that it still works during a real outage."],
  access: ["Measure the door and existing deadbolt before comparing unlock methods.", "Keep at least one dependable local fallback entry method.", "Confirm which hub or controller unlocks remote and cross-platform features."],
  cameras: ["Compare storage and alert features before comparing headline resolution.", "Battery placement is easier, but wired power can reduce charging work.", "Check what the subscription changes after any trial ends."],
  climate: ["Use the manufacturer's compatibility checker before removing the old thermostat.", "A C-wire or power adapter can matter more than app preference.", "Room sensors help only when placement and HVAC behavior match the problem."],
  automation: ["Matter is an application standard; Thread and Zigbee are network technologies.", "A Matter controller and a Thread border router are different roles.", "Prefer physical and local fallback controls for essential routines."],
  jewelry: ["Length, width, closure, and exact material claims matter together.", "Compare listed dimensions with an owned pair.", "Let one face-and-neckline item be the focal point."],
  bags: ["Exterior dimensions overstate usable capacity.", "Check the zipper opening, strap range, and real carry list.", "Confirm the seller and inspect construction during the return window."],
  hair: ["Match clip size to hair volume, not only the motif.", "Check teeth, spring tension, and decorative snag points.", "A large claw should hold the intended twist without scalp pressure."],
  scarves: ["Dimensions decide whether a scarf works at the neck, hair, bag, or waist.", "Read fiber claims literally: satin describes a weave, not necessarily silk.", "Check care instructions and color transfer before tying against light clothing."],
  socks: ["Check the stated size range and fiber blend.", "A graphic can distort when stretched across the foot or calf.", "Choose cuff pressure and shoe thickness before choosing the joke."],
  styling: ["Assign one focal zone.", "Repeat one color or shape once.", "Use a full-body photo to check balance."],
  costumes: ["Use the exact product size chart.", "List every included and missing piece.", "Test sitting, walking, stairs, and visibility before the event."],
  "props-animatronics": ["Measure the shipping and setup route.", "Confirm power, sound, motion, weather, and supervision limits.", "Plan transport and off-season storage."],
  "masks-prosthetics": ["Check head or face measurements and visibility.", "Identify every skin-contact material.", "Follow exact application and removal instructions."],
  "wigs-makeup": ["Check cap fit, fiber, and heat limits.", "Use only compatible skin and hair products.", "Plan touch-ups, removal, cleaning, and shape-preserving storage."],
  "accessories-party-effects": ["Confirm dimensions, quantity, power, and consumables.", "Match indoor or outdoor limits to the venue.", "Budget setup, cleanup, and storage time."],
};

function guideAdvice(siteKey: SiteKey, category: string) {
  return {
    ...siteAdvice[siteKey],
    categoryChecks: categoryAdvice[category] ?? ["Check the exact model, room fit, cleaning routine, and return policy before buying.", "Compare total ownership cost, not only the first checkout price.", "Choose the option that solves the recurring problem with the least added friction."],
  };
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const site = await getCurrentSite();
  const { slug } = await params;
  const guide = findGuide(site.key, slug);
  if (!guide) return {};
  return pageMetadata(site, `/guides/${slug}`, guide.title, guide.dek, guide.image);
}

export default async function GuidePage({ params }: { params: Promise<{ slug: string }> }) {
  const site = await getCurrentSite();
  const { slug } = await params;
  const guide = findGuide(site.key, slug);
  if (!guide) notFound();
  const searchOpportunity = findSearchOpportunity(site.key, "guide", slug);
  const effectiveUpdatedAt = searchOpportunity?.updatedAt ?? guide.updatedAt;
  const advice = guideAdvice(site.key, guide.category);
  const category = site.categories.find((item) => item.slug === guide.category);
  const relatedProducts = (guide.relatedProducts ?? [])
    .map((productSlug) => findProduct(site.key, productSlug))
    .filter((product): product is NonNullable<ReturnType<typeof findProduct>> => Boolean(product));
  const explicitRelatedGuides = (guide.relatedGuides ?? [])
    .filter((guideSlug) => guideSlug !== guide.slug)
    .map((guideSlug) => findGuide(site.key, guideSlug))
    .filter((item): item is NonNullable<ReturnType<typeof findGuide>> => Boolean(item));
  const relatedGuides = [
    ...explicitRelatedGuides,
    ...siteGuides(site.key).filter((item) => item.slug !== guide.slug && item.category === guide.category),
    ...siteGuides(site.key).filter((item) => item.slug !== guide.slug),
  ]
    .filter((item, index, items) => items.findIndex((candidate) => candidate.slug === item.slug) === index)
    .slice(0, 4);
  const topProduct = relatedProducts[0];
  const relatedRoundups = guide.relatedRoundups
    .map((roundupSlug) => findRoundup(site.key, roundupSlug))
    .filter((roundup): roundup is NonNullable<ReturnType<typeof findRoundup>> => Boolean(roundup));
  const topRoundup = relatedRoundups[0];
  const directAnswer = guide.sections[0]?.body ?? advice.decision;

  if (site.key === "style") {
    return (
      <>
        <JsonLd
          data={breadcrumbSchema(site, [
            { name: "Home", path: "/" },
            ...(category ? [{ name: category.name, path: `/categories/${category.slug}` }] : []),
            { name: guide.title, path: `/guides/${slug}` },
          ])}
        />
        <JsonLd data={guideSchema(site, guide)} />
        <StyleGuidePage
          guide={guide}
          relatedProducts={relatedProducts}
          relatedGuides={relatedGuides}
          relatedRoundups={relatedRoundups}
          advice={advice}
        />
        <div className="style-shell pb-12">
          <SearchOpportunityBacklinks site={site.key} kind="guide" slug={slug} />
        </div>
      </>
    );
  }

  return (
    <main className="section">
      <JsonLd
        data={breadcrumbSchema(site, [
          { name: "Home", path: "/" },
          ...(category ? [{ name: category.name, path: `/categories/${category.slug}` }] : []),
          { name: guide.title, path: `/guides/${slug}` },
        ])}
      />
      <JsonLd data={guideSchema(site, guide)} />
      <div className="shell max-w-4xl">
        {category ? (
          <Link className="eyebrow hover:underline" href={`/categories/${category.slug}`}>
            {category.name}
          </Link>
        ) : (
          <p className="eyebrow">{guide.category}</p>
        )}
        <h1 className="mt-3 text-3xl font-black leading-tight sm:text-4xl">{guide.title}</h1>
        <p className="mt-5 text-lg leading-8 text-[var(--muted)]">{guide.dek}</p>
        <div className="mt-5 flex flex-wrap gap-x-4 gap-y-2 text-sm font-semibold text-[var(--muted)]">
          <span>Prepared by the {site.name} editorial desk</span>
          {effectiveUpdatedAt ? <span>Updated {effectiveUpdatedAt}</span> : null}
        </div>
        <section className="mt-8 rounded-md border border-[var(--brand)] bg-[var(--brand-soft)] p-5" aria-labelledby="guide-quick-answer">
          <p className="eyebrow">Quick answer</p>
          <h2 className="mt-2 text-xl font-bold" id="guide-quick-answer">The practical answer</h2>
          <p className="mt-3 leading-7 text-[var(--text)]">{directAnswer}</p>
        </section>
        {searchOpportunity ? <SearchOpportunityBlock opportunity={searchOpportunity} /> : null}
        <SearchOpportunityBacklinks site={site.key} kind="guide" slug={slug} />
        {topProduct || topRoundup ? (
          <section className="mt-8 rounded-md border border-[var(--border)] bg-[var(--surface-muted)] p-5">
            <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="eyebrow">Best starting point</p>
                <h2 className="mt-2 text-2xl font-bold">{topProduct ? topProduct.name : "Compare the short list"}</h2>
                {topProduct ? <p className="mt-2 text-sm font-semibold text-[var(--brand-strong)]">Price band: {topProduct.priceBand}</p> : null}
              </div>
              <div className="flex shrink-0 flex-wrap gap-2 sm:justify-end">
                {topProduct ? (
                  <>
                    <Link className="button-secondary" href={`/reviews/${topProduct.slug}`}>Read evidence</Link>
                    <AffiliateButtonGroup site={site.key} product={topProduct} position="guide-hero-primary" limit={1} />
                  </>
                ) : null}
                {topRoundup ? <Link className="button-secondary" href={`/best/${topRoundup.slug}`}>Compare picks</Link> : null}
              </div>
            </div>
            <p className="mt-4 max-w-2xl leading-7 text-[var(--muted)]">
              {topProduct
                ? `Start with the evidence page for ${topProduct.name}, then compare the alternatives against your layout, budget, and compatibility needs.`
                : "Use the comparison page to narrow the choices before reading the setup details below."}
            </p>
          </section>
        ) : null}
        {guide.image ? (
          <figure className="mt-8">
            <div className="relative aspect-[16/9] w-full overflow-hidden rounded-md bg-[var(--surface-muted)]">
              <Image
                alt={guide.imageAlt ?? guide.title}
                className="object-cover"
                fill
                priority
                sizes="(min-width: 1024px) 896px, 100vw"
                src={guide.image}
              />
            </div>
            {guide.image.includes("-realistic.webp") ? (
              <figcaption className="mt-2 text-xs leading-5 text-[var(--muted)]">
                Editorial image for visual context; device appearance and configuration can vary by model and region.
              </figcaption>
            ) : null}
          </figure>
        ) : null}
        <article className="prose-lite mt-8">
          {guide.sections.map((section) => (
            <section key={section.heading}>
              <h2>{section.heading}</h2>
              <p>{section.body}</p>
            </section>
          ))}
        </article>
        {guide.comparisonTable ? (
          <section className="mt-10">
            <p className="eyebrow">Decision evidence</p>
            <h2 className="mt-3 text-2xl font-bold">{guide.comparisonTable.title}</h2>
            <div className="mt-5 overflow-x-auto rounded-md border border-[var(--border)] bg-white">
              <table className="w-full min-w-[680px] text-left text-sm">
                <thead className="bg-[var(--surface-muted)] text-xs uppercase text-[var(--muted)]">
                  <tr>
                    <th className="px-4 py-3">Check</th>
                    {guide.comparisonTable.columns.map((column) => (
                      <th className="px-4 py-3" key={column}>{column}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-[var(--border)]">
                  {guide.comparisonTable.rows.map((row) => (
                    <tr key={row.label}>
                      <th className="px-4 py-4 font-bold">{row.label}</th>
                      {guide.comparisonTable?.columns.map((column, index) => (
                        <td className="px-4 py-4 leading-6 text-[var(--muted)]" key={`${row.label}-${column}`}>
                          {row.values[index] ?? "Confirm before purchase"}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        ) : null}
        {guide.sources?.length ? (
          <section className="mt-10 rounded-md border border-[var(--border)] bg-white p-5">
            <p className="eyebrow">Primary sources</p>
            <h2 className="mt-3 text-2xl font-bold">References used for this guide</h2>
            <ul className="mt-4 space-y-4">
              {guide.sources.map((source) => (
                <li key={source.url}>
                  <a className="font-bold text-[var(--brand-strong)] underline-offset-4 hover:underline" href={source.url} rel="noopener noreferrer" target="_blank">
                    {source.name}
                  </a>
                  {source.note ? <p className="mt-1 text-sm leading-6 text-[var(--muted)]">{source.note}</p> : null}
                </li>
              ))}
            </ul>
          </section>
        ) : null}
        <section className="mt-10">
          <p className="eyebrow">Buying framework</p>
          <h2 className="mt-3 text-2xl font-bold">What to check before you choose</h2>
          <div className="mt-5 grid gap-6 md:grid-cols-3">
            <div>
              <h3 className="font-bold">Checklist</h3>
              <ul className="mt-3 space-y-3 text-sm leading-6 text-[var(--muted)]">
                {advice.checklist.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>
            <div>
              <h3 className="font-bold">Common mistakes</h3>
              <ul className="mt-3 space-y-3 text-sm leading-6 text-[var(--muted)]">
                {advice.mistakes.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>
            <div>
              <h3 className="font-bold">Category checks</h3>
              <ul className="mt-3 space-y-3 text-sm leading-6 text-[var(--muted)]">
                {advice.categoryChecks.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>
          </div>
          <div className="mt-6 rounded-md border border-[var(--border)] bg-[var(--surface-muted)] p-5">
            <h3 className="font-bold">Decision rule</h3>
            <p className="mt-2 leading-7 text-[var(--muted)]">{advice.decision}</p>
          </div>
        </section>
        <div className="mt-10 grid gap-4 sm:grid-cols-2">
          {relatedGuides.map((item) => (
            <Link className="panel p-5" href={`/guides/${item.slug}`} key={item.slug}>
              <p className="eyebrow">Related guide</p>
              <h2 className="mt-3 text-xl font-bold">{item.title}</h2>
              <p className="mt-3 leading-7 text-[var(--muted)]">{item.dek}</p>
            </Link>
          ))}
          {(guide.relatedProducts ?? []).map((slug) => {
            const product = findProduct(site.key, slug);
            return product ? (
              <Link className="panel p-5" href={`/reviews/${product.slug}`} key={product.slug}>
                <p className="eyebrow">Related product guide</p>
                <h2 className="mt-3 text-xl font-bold">{product.name}</h2>
                <p className="mt-3 leading-7 text-[var(--muted)]">{product.summary}</p>
              </Link>
            ) : null;
          })}
          {guide.relatedRoundups.map((slug) => {
            const roundup = findRoundup(site.key, slug);
            return roundup ? (
              <Link className="panel p-5" href={`/best/${roundup.slug}`} key={roundup.slug}>
                <p className="eyebrow">Related comparison</p>
                <h2 className="mt-3 text-xl font-bold">{roundup.title}</h2>
                <p className="mt-3 leading-7 text-[var(--muted)]">{roundup.dek}</p>
              </Link>
            ) : null;
          })}
        </div>
      </div>
    </main>
  );
}
