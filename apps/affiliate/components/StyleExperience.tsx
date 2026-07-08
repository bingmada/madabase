import { ArrowRight, Check, Heart, Sparkles } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
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
          <nav className="style-nav" aria-label="Primary navigation">
            <Link href="/categories/jewelry">Odd jewelry</Link>
            <Link href="/categories/bags">Bags</Link>
            <Link href="/categories/hair">Hair</Link>
            <Link href="/categories/scarves">Scarves</Link>
            <Link href="/categories/socks">Socks</Link>
            <Link href="/#collections">The edit</Link>
          </nav>
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

function StyleProductCard({ site, product, position, tall = false }: { site: SiteConfig; product: Product; position: string; tall?: boolean }) {
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
        <Image className="object-cover transition duration-500 group-hover:scale-[1.025]" src={displayImage} alt={displayName} fill sizes="(min-width: 1024px) 30vw, 50vw" />
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
            Styling notes <ArrowRight size={14} />
          </Link>
          <AffiliateButtonGroup site={site.key} product={product} position={position} />
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
  const heroProducts = newest.slice(0, 3);
  const displayProducts = newest.slice(0, 12);
  const collections = roundups.slice().reverse().slice(0, 4);
  return (
    <main>
      <section className="style-hero">
        <div className="style-shell grid items-center gap-10 py-12 lg:grid-cols-[0.88fr_1.12fr] lg:py-20">
          <div className="relative z-10">
            <p className="style-kicker"><Sparkles size={14} /> The expressive accessory edit</p>
            <h1 className="mt-5 max-w-xl font-serif text-6xl leading-[0.92] tracking-[-0.04em] text-[#2a2220] sm:text-7xl">
              Find your one weird thing.
            </h1>
            <p className="mt-7 max-w-lg text-lg leading-8 text-[#685b56]">
              Odd earrings, character bags, sculptural clips, scarves, and statement socks for people who want an outfit to say something—without saying everything at once.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link className="style-cta" href="/categories/jewelry">Shop odd jewelry <ArrowRight size={16} /></Link>
              <Link className="style-cta-secondary" href="/categories/hair">Browse the new edit</Link>
            </div>
          </div>
          <div className="style-hero-collage">
            {heroProducts.map((product, index) => (
              <Link className={`style-collage-card style-collage-${index + 1}`} href={`/reviews/${product.slug}`} key={product.slug}>
                <Image className="object-cover" src={product.amazonImage ?? product.image} alt={product.amazonTitle ?? product.name} fill priority sizes="(min-width: 1024px) 28vw, 60vw" />
              </Link>
            ))}
            <div className="style-collage-note">Interesting<br />on purpose.</div>
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
              <StyleProductCard key={product.slug} site={site} product={product} position={`style-home-${index + 1}`} tall={index % 3 === 0} />
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
  site,
  title,
  description,
  products,
  roundups,
  guides,
}: {
  site: SiteConfig;
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
          <h1 className="mt-4 max-w-3xl font-serif text-6xl leading-none tracking-[-0.035em]">{title}</h1>
          <p className="mt-6 max-w-2xl text-lg leading-8 text-[#6b5e58]">{description}</p>
          <div className="mt-8 flex flex-wrap gap-2 text-xs font-bold uppercase tracking-[0.11em]">
            <span className="style-pill">One focal point</span>
            <span className="style-pill">Scale checked</span>
            <span className="style-pill">Material notes</span>
            <span className="style-pill">Real outfit range</span>
          </div>
        </div>
      </section>
      <section className="style-section">
        <div className="style-shell">
          <div className="grid gap-x-7 gap-y-14 sm:grid-cols-2 lg:grid-cols-3">
            {products.map((product, index) => (
              <StyleProductCard key={product.slug} site={site} product={product} position={`style-category-${index + 1}`} tall={index % 4 === 0 || index % 4 === 3} />
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

export function StyleProductPage({
  site,
  product,
  related,
}: {
  site: SiteConfig;
  product: Product;
  related: Product[];
}) {
  const name = product.amazonTitle ?? product.name;
  const image = product.amazonImage ?? product.image;
  const hasOffer = product.offers.length > 0;
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
  return (
    <main>
      <section className="style-section pt-8 sm:pt-12">
        <div className="style-shell grid gap-10 lg:grid-cols-[1.05fr_0.95fr]">
          <div className="relative aspect-[4/5] overflow-hidden bg-[#efe5df]">
            <Image className="object-cover" src={image} alt={name} fill priority sizes="(min-width: 1024px) 52vw, 100vw" />
            <span className="style-image-badge left-5 right-auto top-5">{badge}</span>
          </div>
          <div className="flex flex-col justify-center lg:py-8">
            <Link className="style-kicker" href={`/categories/${product.category}`}>{product.brand}</Link>
            <h1 className="mt-4 font-serif text-5xl leading-[1.02] tracking-[-0.035em] sm:text-6xl">{name}</h1>
            <p className="mt-6 text-lg leading-8 text-[#6b5f59]">{product.summary}</p>
            <div className="mt-7 border-y border-[#d9ccc4] py-5">
              <p className="text-xs font-bold uppercase tracking-[0.12em] text-[#986174]">Wear it for</p>
              <p className="mt-2 font-serif text-2xl">{product.bestFor}</p>
            </div>
            <div className="mt-7 flex flex-wrap gap-3">
              <AffiliateButtonGroup site={site.key} product={product} position="style-product-hero" />
              <Link className="style-cta-secondary" href={`/best/${roundupSlug}`}>
                See similar energy
              </Link>
            </div>
            <p className="mt-4 text-xs leading-5 text-[#897b75]">
              {hasOffer
                ? "Affiliate links. Check the selected variation, seller, materials, dimensions, and return terms at the retailer."
                : "The retailer link is still being verified. Product notes stay visible, but no unverified purchase link is shown."}
            </p>
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
          <div className="grid gap-4 sm:grid-cols-2">
            {product.evidence.map((item, index) => (
              <div className="border-t border-[#d6c9c1] py-5" key={item}>
                <span className="font-serif text-2xl text-[#a24d67]">0{index + 1}</span>
                <p className="mt-3 text-sm leading-7 text-[#6f625c]">{item}</p>
              </div>
            ))}
            {Object.entries(product.specs).slice(0, 4).map(([label, value]) => (
              <div className="border-t border-[#d6c9c1] py-5" key={label}>
                <p className="text-xs font-bold uppercase tracking-[0.12em] text-[#986174]">{label}</p>
                <p className="mt-3 font-serif text-xl">{value}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {related.length ? (
        <section className="style-section border-t border-[#dfd2ca] bg-[#fffaf6]">
          <div className="style-shell">
            <p className="style-kicker">Same mood, different object</p>
            <h2 className="mt-3 font-serif text-4xl">Keep looking sideways.</h2>
            <div className="mt-8 grid gap-7 sm:grid-cols-2 lg:grid-cols-3">
              {related.slice(0, 3).map((item, index) => <StyleProductCard key={item.slug} site={site} product={item} position={`style-related-${index + 1}`} />)}
            </div>
          </div>
        </section>
      ) : null}
    </main>
  );
}

export function StyleCollectionPage({ site, roundup, products }: { site: SiteConfig; roundup: Roundup; products: Product[] }) {
  return (
    <main>
      <section className="bg-[#211d1b] text-[#fff9f5]">
        <div className="style-shell py-16 sm:py-24">
          <p className="text-xs font-bold uppercase tracking-[0.17em] text-[#d5a6b5]">The Sideglance edit</p>
          <h1 className="mt-5 max-w-4xl font-serif text-6xl leading-[0.95] tracking-[-0.04em]">{roundup.title}</h1>
          <p className="mt-7 max-w-2xl text-lg leading-8 text-[#d6cbc5]">{roundup.intro ?? roundup.dek}</p>
        </div>
      </section>
      <section className="style-section">
        <div className="style-shell">
          <div className="grid gap-x-7 gap-y-14 sm:grid-cols-2 lg:grid-cols-3">
            {products.map((product, index) => <StyleProductCard key={product.slug} site={site} product={product} position={`style-collection-${index + 1}`} tall={index % 3 === 0} />)}
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
    </main>
  );
}
