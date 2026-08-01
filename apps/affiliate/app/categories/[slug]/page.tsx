import Link from "next/link";
import { notFound } from "next/navigation";
import { JsonLd } from "@/components/JsonLd";
import { BaseMarketEditionLinks } from "@/components/MarketExperience";
import { ProductCard, RoundupCard } from "@/components/LayoutParts";
import { StyleCategoryPage } from "@/components/StyleExperience";
import { CostumeCategoryPage } from "@/components/CostumeExperience";
import { siteGuides, siteProducts, siteRoundups, siteTools } from "@/lib/content";
import { breadcrumbSchema, itemListSchema, pageMetadata } from "@/lib/seo";
import { prioritizeBySearchDemand } from "@/lib/search-demand-priorities";
import { getCurrentSite } from "@/lib/sites";
import type { SiteKey } from "@/lib/types";
import { parseCostumeCatalogFilters, type CostumeCatalogCategory } from "@/lib/costume-catalog";

const categoryFrameworks: Record<SiteKey, Record<string, { focus: string; checks: string[] }>> = {
  pet: {
    feeding: {
      focus: "Feeding gear should make timing, hydration, and portion routines easier without creating a hard-to-clean appliance.",
      checks: ["Food type and portion consistency", "Dishwasher-safe or removable parts", "Power backup and lock design", "Pet behavior around bowls and fountains"],
    },
    "home-care": {
      focus: "Pet home-care products are useful only when they reduce repeated odor, hair, monitoring, or air-quality friction in the rooms you actually use.",
      checks: ["Room placement and noise", "Filter, refill, or subscription cost", "Fabric and litter source control", "Daily cleanup workflow"],
    },
    comfort: {
      focus: "Comfort products should fit the pet's body and habits first; style, color, and decorative details come after washability and durability.",
      checks: ["Pet size and sleep shape", "Cover removal and washing", "Chewing or scratching risk", "Floor space and portability"],
    },
  },
  homeoffice: {
    desks: {
      focus: "Desk upgrades should solve posture, depth, power, and setup friction before they solve aesthetics.",
      checks: ["Room path and chair pullout", "Desktop depth and monitor distance", "Cable routing and outlet location", "Standing height and stability"],
    },
    ergonomics: {
      focus: "Ergonomic gear needs measurable fit: adjustment range, body compatibility, monitor position, and return policy matter more than the label.",
      checks: ["Seat height and depth", "Lumbar and arm adjustment", "Monitor weight and VESA support", "Return window for fit risk"],
    },
    meetings: {
      focus: "Meeting upgrades should improve face lighting, camera height, sound, and controls without turning the desk into a studio.",
      checks: ["Light placement and glare", "Camera height", "Desk footprint", "Controls reachable during calls"],
    },
  },
  baby: {
    sleep: {
      focus: "Sleep-category gear should support safe, simple overnight routines; app features and analytics should not distract from safe-use basics.",
      checks: ["Age, weight, and safe-use limits", "Night controls and brightness", "Connection style and privacy", "Cleaning and power setup"],
    },
    travel: {
      focus: "Travel gear earns its space when it works for errands, storage, and caregiver comfort, not only one airport scenario.",
      checks: ["Folded size and carry weight", "Age and weight limits", "Storage location", "Daily comfort and cleaning"],
    },
    feeding: {
      focus: "Feeding gear should match the actual bottle, pump-part, cleaning, and drying routine rather than just adding another countertop device.",
      checks: ["Bottle and part count", "Drying bottleneck", "Counter footprint", "Manual and safety guidance"],
    },
  },
  network: {
    wifi: {
      focus: "Wi-Fi upgrades should start with layout, router placement, wired backhaul, and device count before chasing the largest speed number.",
      checks: ["Home size and walls", "WAN and LAN port speeds", "Wired backhaul path", "Device count and client support"],
    },
    wired: {
      focus: "Wired networking gear should make important rooms boringly stable: office desks, TV stands, consoles, NAS boxes, and network shelves.",
      checks: ["Port count", "Cable length and category", "Silent operation", "Adapter and laptop compatibility"],
    },
    backup: {
      focus: "Network backup power is most useful when it keeps the modem, ONT, router, and one key access point online during short outages.",
      checks: ["Router and modem wattage", "Outlet count", "Runtime expectation", "Battery replacement path"],
    },
  },
  smarthome: {
    access: {
      focus: "A smart lock should fit the existing door, preserve a dependable local entry method, and match the household's phone and hub ecosystem.",
      checks: ["Deadbolt and door dimensions", "Local backup entry", "Hub or controller requirements", "Battery and weather rating"],
    },
    cameras: {
      focus: "A video doorbell is a camera, alert system, and recurring storage decision—not only a resolution number.",
      checks: ["Field of view and placement", "Battery or wiring path", "Local versus cloud storage", "Subscription feature boundaries"],
    },
    climate: {
      focus: "Thermostat choice starts at the HVAC wiring panel; app design and automation matter only after system compatibility is confirmed.",
      checks: ["HVAC compatibility", "C-wire or adapter need", "Included room sensors", "Ecosystem and subscription"],
    },
    automation: {
      focus: "Home-automation standards describe different layers. Plan controllers, border routers, radios, and fallback controls before choosing logos.",
      checks: ["Matter controller", "Thread border router", "Zigbee hub", "Local control when offline"],
    },
  },
  style: {
    jewelry: {
      focus: "Statement jewelry should be visually specific without becoming physically annoying; scale, weight, closure, material claims, and outfit role matter together.",
      checks: ["Length and face scale", "Closure and earlobe comfort", "Metal and material claims", "One clear outfit focal point"],
    },
    bags: {
      focus: "An expressive bag still has to carry the day: measure the opening, strap range, interior, and actual essentials before buying the character or shape.",
      checks: ["Exterior dimensions", "Phone and wallet fit", "Strap adjustment", "Seller and return path"],
    },
    hair: {
      focus: "A decorative clip works only when its opening, spring tension, teeth, and weight match the wearer's hair volume and intended style.",
      checks: ["Clip opening and size", "Hair volume and texture", "Teeth and spring tension", "Snag points and finish"],
    },
    scarves: {
      focus: "Scarf material, dimensions, edge finish, and care determine whether it works at the neck, in hair, on a bag, or only in product photos.",
      checks: ["Fiber claim", "Length and width", "Edge finish", "Care and color transfer"],
    },
    socks: {
      focus: "Statement socks still need a usable cuff, fiber blend, wash routine, and shoe fit; the graphic is only one part of the choice.",
      checks: ["Size range", "Fiber blend", "Cuff pressure", "Pattern after stretching"],
    },
    styling: {
      focus: "The easiest expressive outfits use one deliberate focal piece, repeat one color or shape, and keep the remaining elements quieter.",
      checks: ["Choose the focal item", "Repeat one color", "Balance visual scale", "Match the dress code"],
    },
  },
  costume: {
    costumes: {
      focus: "Costume choice begins with the wearer, measurements, movement, event duration, included pieces, and return risk—not the character image alone.",
      checks: ["Exact product and included pieces", "Body and garment measurements", "Movement, visibility, and layers", "Delivery and return terms"],
    },
    "props-animatronics": {
      focus: "Props and animatronics need a verified route, footprint, material, power plan, venue fit, supervision plan, and storage location.",
      checks: ["Dimensions and weight", "Power and moving parts", "Venue and weather limits", "Shipping, setup, and storage"],
    },
    "masks-prosthetics": {
      focus: "Masks and prosthetics should be compared by fit, visibility, breathing, material identity, application, removal, and realistic wear time.",
      checks: ["Head and face fit", "Visibility and ventilation", "Material and adhesive compatibility", "Application and removal time"],
    },
    "wigs-makeup": {
      focus: "Wigs, facial hair, makeup, and effects work as a system: confirm fit, fiber, heat limits, skin-contact materials, touch-ups, removal, and care.",
      checks: ["Cap and hairline fit", "Fiber and heat limits", "Compatible application products", "Removal, cleaning, and storage"],
    },
    "accessories-party-effects": {
      focus: "Accessories and party effects should match the room, audience, setup time, power, cleanup, delivery window, and repeat-use plan.",
      checks: ["Dimensions and quantity", "Power or consumables", "Indoor or outdoor fit", "Setup, cleanup, and storage"],
    },
  },
};

function getCategoryFramework(siteKey: SiteKey, category: string) {
  return categoryFrameworks[siteKey][category] ?? {
    focus: "Start with the repeated routine problem, then compare products by fit, setup friction, cleaning, and return path.",
    checks: ["Exact model and version", "Room, body, or age fit", "Cleaning and maintenance", "Return policy"],
  };
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const site = await getCurrentSite();
  const { slug } = await params;
  const category = site.categories.find((item) => item.slug === slug);
  if (!category) return {};
  return pageMetadata(site, `/categories/${slug}`, `${category.name} Buying Guides`, category.description);
}

export default async function CategoryPage({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const site = await getCurrentSite();
  const { slug } = await params;
  const category = site.categories.find((item) => item.slug === slug);
  if (!category) notFound();
  if (site.key === "costume") {
    const categorySlug = slug as CostumeCatalogCategory;
    const filters = parseCostumeCatalogFilters(await searchParams, { category: categorySlug });
    return <CostumeCategoryPage filters={filters} site={site} slug={categorySlug} />;
  }
  const products = prioritizeBySearchDemand(
    site.key,
    siteProducts(site.key)
      .filter((item) => item.category === slug && (site.key === "style" || item.offers.length > 0))
      .reverse(),
    (item) => `/reviews/${item.slug}`,
  );
  const roundups = prioritizeBySearchDemand(
    site.key,
    siteRoundups(site.key).filter((item) => item.category === slug),
    (item) => `/best/${item.slug}`,
  );
  const guides = prioritizeBySearchDemand(
    site.key,
    siteGuides(site.key).filter((item) => item.category === slug),
    (item) => `/guides/${item.slug}`,
  );
  const tools = siteTools(site.key).filter((item) => item.category === slug);
  const categoryItems = [
    ...products.map((product) => ({ name: product.amazonTitle ?? product.name, path: `/reviews/${product.slug}` })),
    ...roundups.map((roundup) => ({ name: roundup.title, path: `/best/${roundup.slug}` })),
    ...guides.map((guide) => ({ name: guide.title, path: `/guides/${guide.slug}` })),
    ...tools.map((tool) => ({ name: tool.title, path: `/tools/${tool.slug}` })),
  ];
  const framework = getCategoryFramework(site.key, slug);
  if (site.key === "style") {
    return (
      <>
        <JsonLd data={breadcrumbSchema(site, [{ name: "Home", path: "/" }, { name: category.name, path: `/categories/${slug}` }])} />
        <JsonLd data={itemListSchema(site, `${category.name} buying guides`, categoryItems)} />
        <StyleCategoryPage
          title={category.name}
          description={category.description}
          products={products}
          roundups={roundups}
          guides={guides}
        />
        <div className="style-shell pb-12">
          <BaseMarketEditionLinks site={site} basePath={`/categories/${slug}`} />
        </div>
      </>
    );
  }

  return (
    <main className="section">
      <JsonLd data={breadcrumbSchema(site, [{ name: "Home", path: "/" }, { name: category.name, path: `/categories/${slug}` }])} />
      <JsonLd data={itemListSchema(site, `${category.name} buying guides`, categoryItems)} />
      <div className="shell">
        <p className="eyebrow">Category</p>
        <h1 className="mt-3 text-4xl font-black">{category.name}</h1>
        <p className="mt-4 max-w-2xl text-lg leading-8 text-[var(--muted)]">{category.description}</p>
        <BaseMarketEditionLinks site={site} basePath={`/categories/${slug}`} />
        <section className="mt-8 rounded-md border border-[var(--border)] bg-[var(--surface-muted)] p-5">
          <h2 className="text-xl font-bold">How to think about {category.name.toLowerCase()}</h2>
          <p className="mt-3 max-w-3xl leading-7 text-[var(--muted)]">{framework.focus}</p>
          <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {framework.checks.map((check) => (
              <div className="rounded-md bg-white px-4 py-3 text-sm font-semibold text-[var(--text)]" key={check}>
                {check}
              </div>
            ))}
          </div>
        </section>
        {products.length ? (
          <section className="mt-10" aria-labelledby="product-reviews-heading">
            <div className="max-w-2xl">
              <p className="eyebrow">Product reviews</p>
              <h2 className="mt-3 text-3xl font-black" id="product-reviews-heading">Compare products in this category</h2>
              <p className="mt-4 leading-8 text-[var(--muted)]">
                Check model-specific strengths, trade-offs, compatibility details, and alternatives before opening the retailer listing.
              </p>
            </div>
            <div className="mt-8 grid gap-5 lg:grid-cols-3">
            {products.map((product) => (
              <ProductCard key={product.slug} product={product} />
            ))}
            </div>
          </section>
        ) : null}
        <section className="mt-10" aria-labelledby="category-guides-heading">
          <div className="max-w-2xl">
            <p className="eyebrow">Comparisons and guides</p>
            <h2 className="mt-3 text-3xl font-black" id="category-guides-heading">Choose with the full setup in view</h2>
          </div>
        <div className="mt-8 grid gap-5 md:grid-cols-2">
          {roundups.map((roundup) => (
            <RoundupCard roundup={roundup} key={roundup.slug} />
          ))}
          {guides.map((guide) => (
            <Link className="panel p-5" href={`/guides/${guide.slug}`} key={guide.slug}>
              <p className="eyebrow">Guide</p>
              <h2 className="mt-3 text-xl font-bold">{guide.title}</h2>
              <p className="mt-3 leading-7 text-[var(--muted)]">{guide.dek}</p>
            </Link>
          ))}
          {tools.map((tool) => (
            <Link className="panel p-5" href={`/tools/${tool.slug}`} key={tool.slug}>
              <p className="eyebrow">Tool</p>
              <h2 className="mt-3 text-xl font-bold">{tool.title}</h2>
              <p className="mt-3 leading-7 text-[var(--muted)]">{tool.dek}</p>
            </Link>
          ))}
        </div>
        </section>
      </div>
    </main>
  );
}
