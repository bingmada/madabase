import { ArrowRight, CalendarDays, Check, ExternalLink, Heart, Menu, ShieldCheck, Sparkles } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { productEvidencePresentation } from "@/lib/evidence";
import type { SiteConfig } from "@/lib/sites";
import type { Guide, Product, Roundup } from "@/lib/types";
import { AffiliateButtonGroup } from "./AffiliateButton";

export function StyleChrome({ site, children }: { site: SiteConfig; children: React.ReactNode }) {
  return (
    <body className="style-site">
      <header className="style-header">
        <div className="style-shell flex min-h-20 items-center justify-between gap-5">
          <Link className="style-logo" href="/">
            Sideglance
            <span>Style</span>
          </Link>
          <nav className="style-nav style-nav-desktop" aria-label="Primary navigation">
            <Link href="/categories/jewelry">Odd jewelry</Link>
            <Link href="/categories/bags">Bags</Link>
            <Link href="/categories/hair">Hair</Link>
            <Link href="/categories/scarves">Scarves</Link>
            <Link href="/categories/socks">Socks</Link>
            <Link href="/#collections">The edit</Link>
          </nav>
          <details className="style-mobile-nav">
            <summary><Menu aria-hidden="true" size={18} /> Browse</summary>
            <nav aria-label="Mobile navigation">
              <Link href="/categories/jewelry">Odd jewelry</Link>
              <Link href="/categories/bags">Bags</Link>
              <Link href="/categories/hair">Hair</Link>
              <Link href="/categories/scarves">Scarves</Link>
              <Link href="/categories/socks">Socks</Link>
              <Link href="/#collections">The edit</Link>
            </nav>
          </details>
        </div>
      </header>
      {children}
      <footer className="border-t border-[#2e2926] bg-[#211d1b] text-[#f7eee7]">
        <div className="style-shell grid gap-8 py-12 md:grid-cols-[1.2fr_1fr]">
          <div>
            <p className="style-logo text-[#f7eee7]">Sideglance <span>Style</span></p>
            <p className="mt-4 max-w-lg text-sm leading-7 text-[#cfc2ba]">
              One interesting thing, worn on purpose. We check scale, comfort, material claims, capacity, and return risk before sending you to the retailer.
            </p>
            <p className="mt-4 max-w-lg text-xs leading-6 text-[#ad9f97]">{site.disclosure}</p>
          </div>
          <nav className="grid grid-cols-2 gap-x-8 gap-y-3 text-sm" aria-label="Site information">
            <Link href="/about">About</Link>
            <Link href="/methodology">How we choose</Link>
            <Link href="/editorial-policy">Editorial policy</Link>
            <Link href="/affiliate-disclosure">Affiliate disclosure</Link>
            <Link href="/privacy">Privacy</Link>
            <Link href="/contact">Contact</Link>
          </nav>
          <nav className="md:col-span-2 flex flex-wrap gap-x-4 gap-y-2 text-xs font-bold uppercase tracking-[0.14em] text-[#cfc2ba]" aria-label="Madabase network">
            <a className="hover:text-[#f7eee7]" href="https://madabase.com">Madabase tools</a>
            <a className="hover:text-[#f7eee7]" href="https://pets.madabase.com">Pet gear</a>
            <a className="hover:text-[#f7eee7]" href="https://homeoffice.madabase.com">Home office</a>
            <a className="hover:text-[#f7eee7]" href="https://baby.madabase.com">Baby gear</a>
            <a className="hover:text-[#f7eee7]" href="https://network.madabase.com">Home network</a>
            <a className="hover:text-[#f7eee7]" href="https://smarthome.madabase.com">Smart home</a>
          </nav>
        </div>
      </footer>
    </body>
  );
}

function StyleProductCard({ product, tall = false, priority = false }: { product: Product; tall?: boolean; priority?: boolean }) {
  const displayName = product.amazonTitle ?? product.name;
  const displayImage = product.amazonImage ?? product.image;
  const badge =
    {
      bags: "Carry the mood",
      hair: "Top it off",
      scarves: "Tie it your way",
      socks: "Start at the ankle",
      jewelry: "Wear the weird",
    }[product.category] ?? "One good detail";
  return (
    <article className="group">
      <Link className={`style-product-image ${tall ? "aspect-[3/4]" : "aspect-square"}`} href={`/reviews/${product.slug}`}>
        <Image className="object-cover transition duration-500 group-hover:scale-[1.025]" src={displayImage} alt={displayName} fill priority={priority} sizes="(min-width: 1024px) 30vw, 50vw" />
        <span className="style-image-badge">{badge}</span>
      </Link>
      <div className="pt-4">
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-[#8a5e68]">{product.brand}</p>
            <h3 className="mt-1 font-serif text-xl leading-snug text-[#27211f]">
              <Link href={`/reviews/${product.slug}`}>{displayName}</Link>
            </h3>
          </div>
          <span className="shrink-0 rounded-full border border-[#d9cbc3] px-2.5 py-1 text-xs font-bold">{product.priceBand}</span>
        </div>
        <p className="mt-2 text-sm leading-6 text-[#70645f]">Wear it for: {product.bestFor}</p>
        <div className="mt-4 flex flex-wrap items-center gap-2">
          <Link className="style-link" href={`/reviews/${product.slug}`}>
            Check fit and buying notes <ArrowRight size={14} />
          </Link>
        </div>
      </div>
    </article>
  );
}

function CollectionCard({ roundup, tone }: { roundup: Roundup; tone: "rose" | "sage" | "cream" }) {
  return (
    <Link className={`style-collection style-collection-${tone}`} href={`/best/${roundup.slug}`}>
      <p className="text-[11px] font-bold uppercase tracking-[0.16em]">The edit</p>
      <h3 className="mt-5 max-w-lg font-serif text-3xl leading-tight">{roundup.title}</h3>
      <p className="mt-4 max-w-xl text-sm leading-7 opacity-75">{roundup.dek}</p>
      <span className="mt-8 inline-flex items-center gap-2 text-sm font-bold">Open the collection <ArrowRight size={16} /></span>
    </Link>
  );
}

export function StyleHome({
  site,
  products,
  roundups,
  guides,
}: {
  site: SiteConfig;
  products: Product[];
  roundups: Roundup[];
  guides: Guide[];
}) {
  const newest = products.slice().reverse();
  const displayProducts = newest.slice(0, 12);
  const collections = roundups.slice().reverse().slice(0, 4);
  return (
    <main>
      <section className="style-hero">
        <Image className="style-hero-image" src={site.heroImage} alt="Statement accessories arranged on a dressing table" fill priority sizes="100vw" />
        <div className="style-hero-shade" />
        <div className="style-shell style-hero-content">
          <div className="relative z-10 max-w-2xl">
            <p className="style-kicker"><Sparkles size={14} /> The expressive accessory edit</p>
            <h1 className="mt-5 max-w-2xl font-serif text-5xl leading-[0.98] text-white sm:text-6xl">
              Statement accessories for real outfits.
            </h1>
            <p className="mt-7 max-w-xl text-lg leading-8 text-[#f5ebe5]">
              Compare odd earrings, expressive mini bags, sculptural clips, scarves, and statement socks by scale, materials, comfort, capacity, seller risk, and return terms.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link className="style-cta" href="/categories/jewelry">Shop odd jewelry <ArrowRight size={16} /></Link>
              <Link className="style-cta-secondary style-cta-on-dark" href="/#collections">Compare curated picks</Link>
            </div>
          </div>
        </div>
      </section>

      <section className="border-y border-[#dfd2ca] bg-[#fffaf6]">
        <div className="style-shell flex flex-wrap items-center gap-x-7 gap-y-3 py-4 text-xs font-bold uppercase tracking-[0.13em] text-[#776761]">
          <span>Shop your mood</span>
          <Link href="/best/best-weird-earrings-that-are-still-wearable">Conversation starters</Link>
          <Link href="/best/best-betsey-johnson-mismatched-earrings">Mismatched</Link>
          <Link href="/best/best-loungefly-mini-backpacks-by-outfit">Disney energy</Link>
          <Link href="/guides/how-to-style-novelty-accessories-without-looking-costumey">Not costumey</Link>
        </div>
      </section>

      <section className="style-section">
        <div className="style-shell">
          <div className="flex flex-wrap items-end justify-between gap-5">
            <div>
              <p className="style-kicker"><Heart size={14} /> Freshly noticed</p>
              <h2 className="mt-3 font-serif text-4xl tracking-tight text-[#2a2220] sm:text-5xl">Things worth a second look</h2>
            </div>
            <Link className="style-link" href="/categories/jewelry">See all accessories <ArrowRight size={14} /></Link>
          </div>
          <div className="mt-10 grid gap-x-6 gap-y-12 sm:grid-cols-2 lg:grid-cols-4">
            {displayProducts.map((product, index) => (
              <StyleProductCard key={product.slug} product={product} tall={index % 3 === 0} />
            ))}
          </div>
        </div>
      </section>

      <section className="style-section bg-[#211d1b] text-[#fff9f5]" id="collections">
        <div className="style-shell">
          <p className="text-xs font-bold uppercase tracking-[0.17em] text-[#d7b4be]">Curated, not endless</p>
          <h2 className="mt-3 max-w-2xl font-serif text-5xl leading-tight">Choose a point of view.</h2>
          <div className="mt-10 grid gap-5 lg:grid-cols-2">
            {collections.map((roundup, index) => (
              <CollectionCard key={roundup.slug} roundup={roundup} tone={(["rose", "sage", "cream", "rose"] as const)[index]} />
            ))}
          </div>
        </div>
      </section>

      <section className="style-section bg-[#efe5df]">
        <div className="style-shell grid gap-8 lg:grid-cols-[0.7fr_1.3fr]">
          <div>
            <p className="style-kicker">Closet notes</p>
            <h2 className="mt-3 font-serif text-4xl leading-tight">How to wear the interesting thing.</h2>
            <p className="mt-4 leading-7 text-[#6f615c]">Short, useful guides about scale, color repetition, comfort, and keeping the outfit intentional.</p>
          </div>
          <div className="grid gap-3">
            {guides.slice().reverse().slice(0, 5).map((guide, index) => (
              <Link className="style-guide-row" href={`/guides/${guide.slug}`} key={guide.slug}>
                <span className="font-serif text-2xl text-[#a24d67]">0{index + 1}</span>
                <span>
                  <strong className="font-serif text-xl">{guide.title}</strong>
                  <span className="mt-1 block text-sm leading-6 text-[#72645f]">{guide.dek}</span>
                </span>
                <ArrowRight className="ml-auto shrink-0" size={18} />
              </Link>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}

export function StyleCategoryPage({
  title,
  description,
  products,
  roundups,
  guides,
}: {
  title: string;
  description: string;
  products: Product[];
  roundups: Roundup[];
  guides: Guide[];
}) {
  return (
    <main>
      <section className="border-b border-[#dfd2ca] bg-[#efe5df]">
        <div className="style-shell py-14 sm:py-20">
          <p className="style-kicker">Browse by feeling</p>
          <h1 className="mt-4 max-w-3xl break-words font-serif text-5xl leading-none sm:text-6xl">{title}</h1>
          <p className="mt-6 max-w-2xl text-lg leading-8 text-[#6b5e58]">{description}</p>
          <p className="mt-5 text-sm font-bold text-[#713248]">{products.length} buying note{products.length === 1 ? "" : "s"} in this edit</p>
          <div className="mt-8 flex flex-wrap gap-2 text-xs font-bold uppercase tracking-[0.11em]">
            <span className="style-pill">One focal point</span>
            <span className="style-pill">Scale checked</span>
            <span className="style-pill">Material notes</span>
            <span className="style-pill">Real outfit range</span>
          </div>
          <nav className="mt-7 flex flex-wrap gap-x-5 gap-y-3 text-sm font-bold" aria-label="Style categories">
            <Link className="style-link" href="/categories/jewelry">Jewelry</Link>
            <Link className="style-link" href="/categories/bags">Bags</Link>
            <Link className="style-link" href="/categories/hair">Hair</Link>
            <Link className="style-link" href="/categories/scarves">Scarves</Link>
            <Link className="style-link" href="/categories/socks">Socks</Link>
          </nav>
        </div>
      </section>
      <section className="style-section">
        <div className="style-shell">
          <div className="grid gap-x-7 gap-y-14 sm:grid-cols-2 lg:grid-cols-3">
            {products.map((product, index) => (
              <StyleProductCard key={product.slug} product={product} tall={index % 4 === 0 || index % 4 === 3} priority={index === 0} />
            ))}
          </div>
        </div>
      </section>
      {roundups.length || guides.length ? (
        <section className="style-section border-t border-[#dfd2ca] bg-[#fffaf6]">
          <div className="style-shell">
            <p className="style-kicker">Go deeper</p>
            <h2 className="mt-3 font-serif text-4xl">Edits and styling notes</h2>
            <div className="mt-8 grid gap-4 md:grid-cols-2">
              {roundups.map((roundup, index) => <CollectionCard key={roundup.slug} roundup={roundup} tone={index % 2 ? "sage" : "rose"} />)}
              {guides.map((guide) => (
                <Link className="style-collection style-collection-cream" href={`/guides/${guide.slug}`} key={guide.slug}>
                  <p className="text-[11px] font-bold uppercase tracking-[0.16em]">Closet note</p>
                  <h3 className="mt-5 font-serif text-3xl">{guide.title}</h3>
                  <p className="mt-4 text-sm leading-7 opacity-75">{guide.dek}</p>
                  <span className="mt-8 inline-flex items-center gap-2 text-sm font-bold">Read the note <ArrowRight size={16} /></span>
                </Link>
              ))}
            </div>
          </div>
        </section>
      ) : null}
    </main>
  );
}

export function StyleGuidePage({
  guide,
  relatedProducts,
  relatedGuides,
  relatedRoundups,
  advice,
}: {
  guide: Guide;
  relatedProducts: Product[];
  relatedGuides: Guide[];
  relatedRoundups: Roundup[];
  advice: { checklist: string[]; mistakes: string[]; categoryChecks: string[]; decision: string };
}) {
  const startingProduct = relatedProducts[0];
  const startingRoundup = relatedRoundups[0];
  return (
    <main>
      <section className="bg-[#211d1b] text-[#fff9f5]">
        <div className="style-shell py-14 sm:py-20">
          <p className="text-xs font-bold uppercase tracking-[0.16em] text-[#d5a6b5]">Closet note · {guide.category}</p>
          <h1 className="mt-5 max-w-4xl break-words font-serif text-5xl leading-[0.98] sm:text-6xl">{guide.title}</h1>
          <p className="mt-7 max-w-2xl text-lg leading-8 text-[#d6cbc5]">{guide.dek}</p>
          <p className="mt-5 inline-flex items-center gap-2 text-xs font-semibold text-[#cdbeb7]"><CalendarDays size={14} /> Updated {guide.updatedAt ?? "on the current review cycle"}</p>
          {startingProduct || startingRoundup ? (
            <div className="mt-8 max-w-3xl border-y border-[#5d514d] py-5">
              <p className="text-xs font-bold uppercase tracking-[0.14em] text-[#d5a6b5]">Best starting point</p>
              <div className="mt-3 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
                <div>
                  <p className="font-serif text-2xl">{startingProduct ? startingProduct.amazonTitle ?? startingProduct.name : startingRoundup?.title}</p>
                  <p className="mt-2 text-sm leading-6 text-[#d6cbc5]">Start with the fit, scale, material, and return checks before comparing decorative details.</p>
                </div>
                <Link className="style-cta style-cta-light shrink-0" href={startingProduct ? `/reviews/${startingProduct.slug}` : `/best/${startingRoundup?.slug}`}>Open the decision page <ArrowRight size={16} /></Link>
              </div>
            </div>
          ) : null}
        </div>
      </section>

      {guide.image ? (
        <section className="style-section pb-0">
          <figure className="style-shell">
            <div className="relative aspect-[16/9] overflow-hidden bg-[#efe5df]">
              <Image className="object-cover" src={guide.image} alt={guide.imageAlt ?? guide.title} fill priority sizes="(min-width: 1320px) 1224px, 100vw" />
            </div>
            <figcaption className="mt-3 text-xs leading-5 text-[#7b6d67]">Editorial visualization for styling context. Exact retailer product artwork, materials, finish, and scale can differ.</figcaption>
          </figure>
        </section>
      ) : null}

      <section className="style-section">
        <div className="style-shell grid gap-10 lg:grid-cols-[0.7fr_1.3fr]">
          <div>
            <p className="style-kicker">The practical answer</p>
            <h2 className="mt-3 font-serif text-4xl">Make the interesting item easier to wear.</h2>
          </div>
          <article className="divide-y divide-[#d6c9c1] border-t border-[#d6c9c1]">
            {guide.sections.map((section) => (
              <section className="py-6" key={section.heading}>
                <h2 className="font-serif text-2xl">{section.heading}</h2>
                <p className="mt-3 leading-7 text-[#6f625c]">{section.body}</p>
              </section>
            ))}
          </article>
        </div>
      </section>

      {guide.comparisonTable ? (
        <section className="style-section border-y border-[#dfd2ca] bg-[#fffaf6]">
          <div className="style-shell">
            <p className="style-kicker">Decision evidence</p>
            <h2 className="mt-3 font-serif text-4xl">{guide.comparisonTable.title}</h2>
            <div className="mt-7 overflow-x-auto border-y border-[#d6c9c1]">
              <table className="w-full min-w-[720px] text-left text-sm">
                <thead className="border-b border-[#d6c9c1] text-xs font-bold uppercase tracking-[0.1em] text-[#986174]">
                  <tr><th className="px-4 py-4">Check</th>{guide.comparisonTable.columns.map((column) => <th className="px-4 py-4" key={column}>{column}</th>)}</tr>
                </thead>
                <tbody className="divide-y divide-[#d6c9c1]">
                  {guide.comparisonTable.rows.map((row) => (
                    <tr key={row.label}>
                      <th className="px-4 py-5 font-serif text-lg">{row.label}</th>
                      {guide.comparisonTable?.columns.map((column, index) => <td className="px-4 py-5 leading-6 text-[#6f625c]" key={`${row.label}-${column}`}>{row.values[index] ?? "Confirm before purchase"}</td>)}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>
      ) : null}

      <section className="style-section bg-[#efe5df]">
        <div className="style-shell">
          <p className="style-kicker">Buying framework</p>
          <h2 className="mt-3 font-serif text-4xl">What to check before you choose.</h2>
          <div className="mt-8 grid gap-8 md:grid-cols-3">
            {[
              ["Checklist", advice.checklist],
              ["Common mistakes", advice.mistakes],
              ["Category checks", advice.categoryChecks],
            ].map(([heading, items]) => (
              <section className="border-t border-[#cdbeb6] pt-5" key={heading as string}>
                <h3 className="font-serif text-2xl">{heading as string}</h3>
                <ul className="mt-4 space-y-3 text-sm leading-7 text-[#5e534e]">{(items as string[]).map((item) => <li key={item}>{item}</li>)}</ul>
              </section>
            ))}
          </div>
          <div className="mt-8 border-l-2 border-[#a24d67] bg-[#fffaf6] px-5 py-5">
            <p className="text-xs font-bold uppercase tracking-[0.12em] text-[#986174]">Decision rule</p>
            <p className="mt-2 max-w-3xl leading-7 text-[#4f4540]">{advice.decision}</p>
          </div>
        </div>
      </section>

      {guide.sources?.length ? (
        <section className="style-section border-t border-[#dfd2ca]">
          <div className="style-shell max-w-4xl">
            <p className="style-kicker">Source trail</p>
            <h2 className="mt-3 font-serif text-4xl">References checked</h2>
            <ul className="mt-6 divide-y divide-[#d6c9c1] border-t border-[#d6c9c1]">
              {guide.sources.map((source) => (
                <li className="py-5" key={source.url}>
                  <a className="style-link" href={source.url} rel="noopener noreferrer" target="_blank">{source.name} <ExternalLink size={14} /></a>
                  {source.note ? <p className="mt-2 text-sm leading-6 text-[#6f625c]">{source.note}</p> : null}
                </li>
              ))}
            </ul>
          </div>
        </section>
      ) : null}

      {relatedProducts.length || relatedRoundups.length || relatedGuides.length ? (
        <section className="style-section border-t border-[#dfd2ca] bg-[#fffaf6]">
          <div className="style-shell">
            <p className="style-kicker">Keep comparing</p>
            <h2 className="mt-3 font-serif text-4xl">Related evidence and edits.</h2>
            {relatedProducts.length ? <div className="mt-8 grid gap-7 sm:grid-cols-2 lg:grid-cols-3">{relatedProducts.slice(0, 3).map((product) => <StyleProductCard key={product.slug} product={product} />)}</div> : null}
            <div className="mt-8 grid gap-4 md:grid-cols-2">
              {relatedRoundups.slice(0, 2).map((roundup, index) => <CollectionCard key={roundup.slug} roundup={roundup} tone={index ? "sage" : "rose"} />)}
              {relatedGuides.slice(0, 2).map((item) => (
                <Link className="style-collection style-collection-cream" href={`/guides/${item.slug}`} key={item.slug}>
                  <p className="text-[11px] font-bold uppercase tracking-[0.16em]">Closet note</p>
                  <h3 className="mt-5 font-serif text-3xl">{item.title}</h3>
                  <p className="mt-4 text-sm leading-7 opacity-75">{item.dek}</p>
                  <span className="mt-8 inline-flex items-center gap-2 text-sm font-bold">Read the guide <ArrowRight size={16} /></span>
                </Link>
              ))}
            </div>
          </div>
        </section>
      ) : null}
    </main>
  );
}

export function StyleProductPage({
  site,
  product,
  related,
  relatedRoundups,
  relatedGuides,
}: {
  site: SiteConfig;
  product: Product;
  related: Product[];
  relatedRoundups: Roundup[];
  relatedGuides: Guide[];
}) {
  const name = product.amazonTitle ?? product.name;
  const image = product.amazonImage ?? product.image;
  const hasOffer = product.offers.length > 0;
  const evidencePresentation = productEvidencePresentation(product);
  const badge =
    {
      bags: "Character carry",
      hair: "Hair detail",
      scarves: "Tie-on color",
      socks: "Ankle statement",
      jewelry: "Conversation piece",
    }[product.category] ?? "Expressive extra";
  const roundupSlug =
    {
      bags: "best-loungefly-mini-backpacks-by-outfit",
      hair: "best-playful-hair-accessories",
      scarves: "best-scarves-for-outfit-color",
      socks: "best-funny-socks-for-colorful-outfits",
      jewelry: "best-weird-earrings-that-are-still-wearable",
    }[product.category] ?? "best-statement-accessories-for-one-focal-point";
  const decisionRows = [
    ["Best for", product.bestFor],
    ["Skip if", product.cons[0] ?? "The main trade-off affects how you plan to wear or carry it."],
    ["Verify first", product.evidence[0] ?? "Confirm scale, materials, seller, and return terms before checkout."],
  ];
  return (
    <main>
      <section className="style-section pt-8 sm:pt-12">
        <div className="style-shell grid gap-10 lg:grid-cols-[1.05fr_0.95fr]">
          <figure className="order-2 lg:order-1">
            <div className="relative aspect-[4/5] overflow-hidden bg-[#efe5df]">
              <Image className="object-cover" src={image} alt={name} fill priority sizes="(min-width: 1024px) 52vw, 100vw" />
              <span className="style-image-badge style-image-badge-top">{badge}</span>
            </div>
            <figcaption className="mt-3 text-xs leading-5 text-[#7b6d67]">
              Editorial visualization for category and styling context. Exact retailer artwork, color, hardware, finish, and scale can differ; verify the live listing before purchase.
            </figcaption>
          </figure>
          <div className="order-1 flex flex-col justify-center lg:order-2 lg:py-8">
            <Link className="style-kicker" href={`/categories/${product.category}`}>{product.brand}</Link>
            <h1 className="mt-4 break-words font-serif text-4xl leading-[1.05] sm:text-5xl">{name}</h1>
            <p className="mt-4 inline-flex items-center gap-2 text-xs font-semibold text-[#7b6d67]"><CalendarDays size={14} /> Updated {product.updatedAt ?? "on the current review cycle"}</p>
            <p className="mt-6 text-lg leading-8 text-[#6b5f59]">{product.summary}</p>
            <div className="mt-7 divide-y divide-[#d9ccc4] border-y border-[#d9ccc4]">
              {decisionRows.map(([label, detail]) => (
                <div className="grid gap-1 py-4 sm:grid-cols-[100px_1fr]" key={label}>
                  <p className="text-xs font-bold uppercase tracking-[0.12em] text-[#986174]">{label}</p>
                  <p className="text-sm font-semibold leading-6 text-[#4f4540]">{detail}</p>
                </div>
              ))}
            </div>
            <div className="mt-7 flex flex-wrap gap-3">
              <AffiliateButtonGroup site={site.key} product={product} position="style-product-hero" />
              <Link className="style-cta-secondary" href={`/best/${relatedRoundups[0]?.slug ?? roundupSlug}`}>
                Compare similar picks
              </Link>
            </div>
            <p className="mt-4 text-xs leading-5 text-[#897b75]">
              {hasOffer
                ? "Affiliate links. Check the selected variation, seller, materials, dimensions, and return terms at the retailer."
                : "The retailer link is still being verified. Product notes stay visible, but no unverified purchase link is shown."}
            </p>
            <div className="mt-7 border-l-2 border-[#a24d67] bg-[#fffaf6] px-5 py-4">
              <p className="text-xs font-bold uppercase tracking-[0.12em] text-[#986174]">{evidencePresentation.label}</p>
              <p className="mt-2 text-sm font-semibold leading-6 text-[#4f4540]">{evidencePresentation.note}</p>
            </div>
          </div>
        </div>
      </section>

      <section className="style-section bg-[#211d1b] text-[#fff9f5]">
        <div className="style-shell grid gap-10 lg:grid-cols-3">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.16em] text-[#d5a6b5]">The quick take</p>
            <p className="mt-4 font-serif text-3xl leading-tight">{product.verdict}</p>
          </div>
          <div>
            <h2 className="font-serif text-2xl">Why it works</h2>
            <ul className="mt-5 space-y-4 text-sm leading-7 text-[#d6cbc5]">
              {product.pros.map((item) => <li className="flex gap-3" key={item}><Check className="mt-1 shrink-0 text-[#d8a3b3]" size={16} />{item}</li>)}
            </ul>
          </div>
          <div>
            <h2 className="font-serif text-2xl">Pause before checkout</h2>
            <ul className="mt-5 space-y-4 text-sm leading-7 text-[#d6cbc5]">
              {product.cons.map((item) => <li className="flex gap-3" key={item}><span className="mt-2 h-2 w-2 shrink-0 rounded-full bg-[#d8a3b3]" />{item}</li>)}
            </ul>
          </div>
        </div>
      </section>

      <section className="style-section">
        <div className="style-shell grid gap-10 lg:grid-cols-[0.7fr_1.3fr]">
          <div>
            <p className="style-kicker">Before it joins the outfit</p>
            <h2 className="mt-3 font-serif text-4xl">Check the real-world details.</h2>
          </div>
          <div className="grid gap-x-7 sm:grid-cols-2">
            {product.evidence.map((item, index) => (
              <div className="border-t border-[#d6c9c1] py-5" key={item}>
                <span className="font-serif text-2xl text-[#a24d67]">0{index + 1}</span>
                <p className="mt-3 text-sm leading-7 text-[#6f625c]">{item}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="style-section border-y border-[#dfd2ca] bg-[#fffaf6]">
        <div className="style-shell grid gap-10 lg:grid-cols-[0.7fr_1.3fr]">
          <div>
            <p className="style-kicker"><ShieldCheck size={14} /> Listing checklist</p>
            <h2 className="mt-3 font-serif text-4xl">Match the exact version.</h2>
            <p className="mt-4 text-sm leading-7 text-[#6f625c]">Use these fields against the live retailer page. Price, seller, selected color, bundle, and return terms can change without notice.</p>
          </div>
          <dl className="grid gap-x-7 sm:grid-cols-2">
            {Object.entries(product.specs).map(([label, value]) => (
              <div className="border-t border-[#d6c9c1] py-5" key={label}>
                <dt className="text-xs font-bold uppercase tracking-[0.12em] text-[#986174]">{label}</dt>
                <dd className="mt-3 font-serif text-xl">{value}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      {product.editorialSections?.length ? (
        <section className="style-section">
          <div className="style-shell grid gap-10 lg:grid-cols-[0.7fr_1.3fr]">
            <div>
              <p className="style-kicker">Independent read</p>
              <h2 className="mt-3 font-serif text-4xl">What the listing does not decide for you.</h2>
            </div>
            <div className="divide-y divide-[#d6c9c1] border-t border-[#d6c9c1]">
              {product.editorialSections.map((section) => (
                <section className="py-6" key={section.heading}>
                  <h3 className="font-serif text-2xl">{section.heading}</h3>
                  <p className="mt-3 leading-7 text-[#6f625c]">{section.body}</p>
                </section>
              ))}
            </div>
          </div>
        </section>
      ) : null}

      {product.alternatives?.length || product.sources?.length ? (
        <section className="style-section border-y border-[#dfd2ca] bg-[#efe5df]">
          <div className="style-shell grid gap-10 lg:grid-cols-2">
            {product.alternatives?.length ? (
              <div>
                <p className="style-kicker">Choose another route</p>
                <h2 className="mt-3 font-serif text-3xl">Alternatives worth considering</h2>
                <ul className="mt-6 divide-y divide-[#cdbeb6] border-t border-[#cdbeb6]">
                  {product.alternatives.map((alternative) => <li className="py-4 text-sm leading-7 text-[#5e534e]" key={alternative}>{alternative}</li>)}
                </ul>
              </div>
            ) : null}
            {product.sources?.length ? (
              <div>
                <p className="style-kicker">Source trail</p>
                <h2 className="mt-3 font-serif text-3xl">References checked</h2>
                <ul className="mt-6 divide-y divide-[#cdbeb6] border-t border-[#cdbeb6]">
                  {product.sources.map((source) => (
                    <li className="py-4" key={source.url}>
                      <a className="style-link" href={source.url} rel="noopener noreferrer" target="_blank">{source.name} <ExternalLink size={14} /></a>
                      {source.note ? <p className="mt-2 text-xs leading-6 text-[#6f625c]">{source.note}</p> : null}
                    </li>
                  ))}
                </ul>
              </div>
            ) : null}
          </div>
        </section>
      ) : null}

      {related.length ? (
        <section className="style-section border-t border-[#dfd2ca] bg-[#fffaf6]">
          <div className="style-shell">
            <p className="style-kicker">Same mood, different object</p>
            <h2 className="mt-3 font-serif text-4xl">Keep looking sideways.</h2>
            <div className="mt-8 grid gap-7 sm:grid-cols-2 lg:grid-cols-3">
              {related.slice(0, 3).map((item) => <StyleProductCard key={item.slug} product={item} />)}
            </div>
          </div>
        </section>
      ) : null}

      {relatedRoundups.length || relatedGuides.length ? (
        <section className="style-section border-t border-[#dfd2ca]">
          <div className="style-shell">
            <p className="style-kicker">Continue the decision</p>
            <h2 className="mt-3 font-serif text-4xl">Compare before you commit.</h2>
            <div className="mt-8 grid gap-4 md:grid-cols-2">
              {relatedRoundups.slice(0, 2).map((roundup, index) => <CollectionCard key={roundup.slug} roundup={roundup} tone={index ? "sage" : "rose"} />)}
              {relatedGuides.slice(0, 2).map((guide) => (
                <Link className="style-collection style-collection-cream" href={`/guides/${guide.slug}`} key={guide.slug}>
                  <p className="text-[11px] font-bold uppercase tracking-[0.16em]">Closet note</p>
                  <h3 className="mt-5 font-serif text-3xl">{guide.title}</h3>
                  <p className="mt-4 text-sm leading-7 opacity-75">{guide.dek}</p>
                  <span className="mt-8 inline-flex items-center gap-2 text-sm font-bold">Read the guide <ArrowRight size={16} /></span>
                </Link>
              ))}
            </div>
          </div>
        </section>
      ) : null}
    </main>
  );
}

export function StyleCollectionPage({ roundup, products }: { roundup: Roundup; products: Product[] }) {
  const topPick = products[0];
  return (
    <main>
      <section className="bg-[#211d1b] text-[#fff9f5]">
        <div className="style-shell py-16 sm:py-24">
          <p className="text-xs font-bold uppercase tracking-[0.17em] text-[#d5a6b5]">The Sideglance edit</p>
          <h1 className="mt-5 max-w-4xl break-words font-serif text-5xl leading-[0.98] sm:text-6xl">{roundup.title}</h1>
          <p className="mt-7 max-w-2xl text-lg leading-8 text-[#d6cbc5]">{roundup.intro ?? roundup.dek}</p>
          <p className="mt-5 inline-flex items-center gap-2 text-xs font-semibold text-[#cdbeb7]"><CalendarDays size={14} /> Updated {roundup.updatedAt ?? "on the current review cycle"}</p>
          {topPick ? (
            <div className="mt-8 max-w-3xl border-y border-[#5d514d] py-5">
              <p className="text-xs font-bold uppercase tracking-[0.14em] text-[#d5a6b5]">Best starting point</p>
              <div className="mt-3 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
                <div>
                  <p className="font-serif text-2xl">{topPick.amazonTitle ?? topPick.name}</p>
                  <p className="mt-2 text-sm leading-6 text-[#d6cbc5]">Best for {topPick.bestFor.toLowerCase()}; skip it if {topPick.cons[0]?.toLowerCase()}.</p>
                </div>
                <Link className="style-cta style-cta-light shrink-0" href={`/reviews/${topPick.slug}`}>Check the evidence <ArrowRight size={16} /></Link>
              </div>
            </div>
          ) : null}
        </div>
      </section>
      {products.length ? (
        <section className="style-section border-b border-[#dfd2ca] bg-[#fffaf6]">
          <div className="style-shell">
            <p className="style-kicker">At a glance</p>
            <h2 className="mt-3 font-serif text-4xl">Compare the trade-offs.</h2>
            <div className="mt-7 overflow-x-auto border-y border-[#d6c9c1]">
              <table className="w-full min-w-[760px] text-left text-sm">
                <thead className="border-b border-[#d6c9c1] text-xs font-bold uppercase tracking-[0.1em] text-[#986174]">
                  <tr>
                    <th className="px-4 py-4">Pick</th>
                    <th className="px-4 py-4">Best for</th>
                    <th className="px-4 py-4">Price band</th>
                    <th className="px-4 py-4">Main caution</th>
                    <th className="px-4 py-4"><span className="sr-only">Read</span></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#d6c9c1]">
                  {products.map((product) => (
                    <tr key={product.slug}>
                      <th className="px-4 py-5 font-serif text-lg">{product.amazonTitle ?? product.name}</th>
                      <td className="px-4 py-5 leading-6 text-[#6f625c]">{product.bestFor}</td>
                      <td className="px-4 py-5 font-bold">{product.priceBand}</td>
                      <td className="px-4 py-5 leading-6 text-[#6f625c]">{product.cons[0]}</td>
                      <td className="px-4 py-5"><Link className="style-link whitespace-nowrap" href={`/reviews/${product.slug}`}>Evidence <ArrowRight size={14} /></Link></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>
      ) : null}
      <section className="style-section">
        <div className="style-shell">
          <div className="grid gap-x-7 gap-y-14 sm:grid-cols-2 lg:grid-cols-3">
            {products.map((product, index) => <StyleProductCard key={product.slug} product={product} tall={index % 3 === 0} />)}
          </div>
        </div>
      </section>
      <section className="style-section border-t border-[#dfd2ca] bg-[#efe5df]">
        <div className="style-shell grid gap-8 lg:grid-cols-[0.7fr_1.3fr]">
          <div>
            <p className="style-kicker">How to choose</p>
            <h2 className="mt-3 font-serif text-4xl">Let the object do one job.</h2>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            {(roundup.decisionGuide ?? []).map((item) => (
              <div className="border-t border-[#cdbeb6] py-5" key={item.label}>
                <h3 className="font-serif text-2xl">{item.label}</h3>
                <p className="mt-3 text-sm leading-7 text-[#6f625c]">{item.detail}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
      {roundup.sections?.length ? (
        <section className="style-section border-t border-[#dfd2ca]">
          <div className="style-shell grid gap-10 lg:grid-cols-[0.7fr_1.3fr]">
            <div>
              <p className="style-kicker">Buying context</p>
              <h2 className="mt-3 font-serif text-4xl">The details behind the shortlist.</h2>
            </div>
            <div className="divide-y divide-[#d6c9c1] border-t border-[#d6c9c1]">
              {roundup.sections.map((section) => (
                <section className="py-6" key={section.heading}>
                  <h3 className="font-serif text-2xl">{section.heading}</h3>
                  <p className="mt-3 leading-7 text-[#6f625c]">{section.body}</p>
                </section>
              ))}
            </div>
          </div>
        </section>
      ) : null}
      <section className="style-section border-t border-[#dfd2ca] bg-[#211d1b] text-[#fff9f5]">
        <div className="style-shell grid gap-10 lg:grid-cols-2">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.16em] text-[#d5a6b5]">How we narrowed it</p>
            <h2 className="mt-3 font-serif text-4xl">Method before motif.</h2>
            <ul className="mt-6 space-y-4 text-sm leading-7 text-[#d6cbc5]">
              {roundup.methodology.map((item) => <li className="flex gap-3" key={item}><Check className="mt-1 shrink-0 text-[#d8a3b3]" size={16} />{item}</li>)}
            </ul>
          </div>
          {roundup.faqs.length ? (
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.16em] text-[#d5a6b5]">Quick answers</p>
              <div className="mt-4 divide-y divide-[#5d514d] border-t border-[#5d514d]">
                {roundup.faqs.map((faq) => (
                  <details className="style-faq py-4" key={faq.question}>
                    <summary className="cursor-pointer font-serif text-xl">{faq.question}</summary>
                    <p className="mt-3 pr-6 text-sm leading-7 text-[#d6cbc5]">{faq.answer}</p>
                  </details>
                ))}
              </div>
            </div>
          ) : null}
        </div>
      </section>
    </main>
  );
}
