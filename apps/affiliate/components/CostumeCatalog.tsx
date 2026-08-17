import { ArrowLeft, ArrowRight, ImageOff, Link2Off, Search, ShieldCheck } from "lucide-react";
import Link from "next/link";
import type { SiteConfig } from "@/lib/sites";
import { TrackedCommerceLink } from "./TrackedCommerceLink";
import {
  formatCostumePrice,
  listCostumeCatalogProducts,
  type CostumeCatalogCategory,
  type CostumeCatalogFilters,
  type CostumeCatalogProduct,
} from "@/lib/costume-catalog";

function catalogHref(basePath: string, filters: CostumeCatalogFilters, page: number) {
  const query = new URLSearchParams();
  if (filters.q) query.set("q", filters.q);
  if (filters.category) query.set("category", filters.category);
  if (filters.price) query.set("price", filters.price);
  if (filters.audience) query.set("audience", filters.audience);
  if (filters.occasion) query.set("occasion", filters.occasion);
  if (filters.feature) query.set("feature", filters.feature);
  if (filters.sort !== "featured") query.set("sort", filters.sort);
  if (page > 1) query.set("page", String(page));
  return `${basePath}${query.size ? `?${query}` : ""}`;
}

function audienceLabel(audience: string[]) {
  return audience.length ? audience.join(" · ") : "Audience not specified";
}

export function CostumeCatalogCard({ product, retailerCta = false }: { product: CostumeCatalogProduct; retailerCta?: boolean }) {
  return (
    <article className="panel flex h-full flex-col overflow-hidden">
      <div className="costume-card-art relative grid min-h-48 content-between overflow-hidden p-5">
        {product.authorizedImage ? (
          <>
            {/* Product images are rendered only after an authorized source is stored. */}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              alt={product.authorizedImage.altText || product.title}
              className="absolute inset-0 h-full w-full object-contain bg-white"
              loading="lazy"
              referrerPolicy="no-referrer"
              src={product.authorizedImage.url}
            />
            <div className="absolute inset-x-0 top-0 h-20 bg-gradient-to-b from-black/70 to-transparent" aria-hidden="true" />
          </>
        ) : null}
        <div className="relative z-10 flex flex-wrap gap-2">
          {product.premium ? <span className="costume-chip">$1,000+</span> : null}
          {product.professional ? <span className="costume-chip">Professional</span> : null}
          {product.halloween ? <span className="costume-chip">Halloween</span> : null}
          {product.rental ? <span className="costume-chip">Rental</span> : null}
        </div>
        {!product.authorizedImage ? (
          <div className="relative z-10 flex items-center gap-2 text-xs font-black uppercase tracking-[0.14em] text-white/80">
            <ImageOff aria-hidden="true" size={16} />
            Image unavailable
          </div>
        ) : null}
      </div>
      <div className="flex flex-1 flex-col p-5">
        <p className="eyebrow">{product.brand || product.productType || "Abracadabra NYC"}</p>
        <h2 className="mt-2 text-xl font-bold leading-7">{product.title}</h2>
        <p className="mt-3 text-sm font-semibold text-[var(--brand-strong)]">{formatCostumePrice(product)} · {product.availability}</p>
        <p className="mt-2 flex-1 text-sm leading-6 text-[var(--muted)]">{audienceLabel(product.audience)}</p>
        <div className="mt-5 flex flex-wrap gap-2">
          <Link className="button-secondary self-start" href={`/products/${product.slug}`}>
            View product details
            <ArrowRight aria-hidden="true" size={16} />
          </Link>
          {retailerCta && product.activeLink && product.authorizedImage && product.availability !== "out of stock" ? (
            <Link className="button-primary self-start" href={`/go/cj/${product.activeLink.clickToken}`} rel="nofollow sponsored">
              Check current price &amp; availability
              <ArrowRight aria-hidden="true" size={16} />
            </Link>
          ) : null}
        </div>
      </div>
    </article>
  );
}

function CatalogFilters({
  basePath,
  filters,
  lockedCategory,
  lockedFeature,
  site,
}: {
  basePath: string;
  filters: CostumeCatalogFilters;
  lockedCategory?: CostumeCatalogCategory;
  lockedFeature?: CostumeCatalogFilters["feature"];
  site: SiteConfig;
}) {
  return (
    <form className="panel grid gap-4 p-5 lg:grid-cols-6" action={basePath} method="get">
      <label className="lg:col-span-2">
        <span className="mb-2 block text-xs font-black uppercase tracking-[0.12em] text-[var(--muted)]">Search products</span>
        <span className="flex items-center gap-2 rounded-md border border-[var(--border)] bg-white px-3">
          <Search aria-hidden="true" className="text-[var(--muted)]" size={17} />
          <input className="min-h-11 w-full bg-transparent outline-none" defaultValue={filters.q} name="q" placeholder="Character, prop, mask, wig…" type="search" />
        </span>
      </label>
      {lockedCategory ? <input name="category" type="hidden" value={lockedCategory} /> : (
        <label>
          <span className="mb-2 block text-xs font-black uppercase tracking-[0.12em] text-[var(--muted)]">Type</span>
          <select className="min-h-11 w-full rounded-md border border-[var(--border)] bg-white px-3" defaultValue={filters.category ?? ""} name="category">
            <option value="">All types</option>
            {site.categories.map((category) => <option key={category.slug} value={category.slug}>{category.name}</option>)}
          </select>
        </label>
      )}
      <label>
        <span className="mb-2 block text-xs font-black uppercase tracking-[0.12em] text-[var(--muted)]">Price</span>
        <select className="min-h-11 w-full rounded-md border border-[var(--border)] bg-white px-3" defaultValue={filters.price ?? ""} name="price">
          <option value="">Any price</option>
          <option value="under-50">Under $50</option>
          <option value="50-199">$50–$199</option>
          <option value="200-999">$200–$999</option>
          <option value="1000-plus">$1,000+</option>
        </select>
      </label>
      <label>
        <span className="mb-2 block text-xs font-black uppercase tracking-[0.12em] text-[var(--muted)]">Audience</span>
        <select className="min-h-11 w-full rounded-md border border-[var(--border)] bg-white px-3" defaultValue={filters.audience ?? ""} name="audience">
          <option value="">Any audience</option>
          <option value="adult">Adult</option>
          <option value="kids">Kids</option>
          <option value="female">Women / female</option>
          <option value="male">Men / male</option>
          <option value="unisex">Unisex</option>
        </select>
      </label>
      <label>
        <span className="mb-2 block text-xs font-black uppercase tracking-[0.12em] text-[var(--muted)]">Occasion</span>
        <select className="min-h-11 w-full rounded-md border border-[var(--border)] bg-white px-3" defaultValue={filters.occasion ?? ""} name="occasion">
          <option value="">Any occasion</option>
          <option value="halloween">Halloween</option>
          <option value="year-round">Year-round</option>
        </select>
      </label>
      {lockedFeature ? <input name="feature" type="hidden" value={lockedFeature} /> : (
        <label>
          <span className="mb-2 block text-xs font-black uppercase tracking-[0.12em] text-[var(--muted)]">Collection</span>
          <select className="min-h-11 w-full rounded-md border border-[var(--border)] bg-white px-3" defaultValue={filters.feature ?? ""} name="feature">
            <option value="">All collections</option>
            <option value="premium">$1,000+ Premium</option>
            <option value="professional">Professional</option>
            <option value="rental">Rental</option>
          </select>
        </label>
      )}
      <label>
        <span className="mb-2 block text-xs font-black uppercase tracking-[0.12em] text-[var(--muted)]">Sort</span>
        <select className="min-h-11 w-full rounded-md border border-[var(--border)] bg-white px-3" defaultValue={filters.sort} name="sort">
          <option value="featured">Featured</option>
          <option value="price-asc">Price: low to high</option>
          <option value="price-desc">Price: high to low</option>
          <option value="name">Name</option>
        </select>
      </label>
      <div className="flex items-end gap-3 lg:col-span-2">
        <button className="button-primary min-h-11" type="submit">Apply filters</button>
        <Link className="button-secondary min-h-11" href={basePath}>Clear</Link>
      </div>
    </form>
  );
}

export async function CostumeCatalogExplorer({
  site,
  filters,
  basePath = "/catalog",
  lockedCategory,
  lockedFeature,
}: {
  site: SiteConfig;
  filters: CostumeCatalogFilters;
  basePath?: string;
  lockedCategory?: CostumeCatalogCategory;
  lockedFeature?: CostumeCatalogFilters["feature"];
}) {
  const result = await listCostumeCatalogProducts(filters);

  return (
    <>
      <CatalogFilters basePath={basePath} filters={filters} lockedCategory={lockedCategory} lockedFeature={lockedFeature} site={site} />
      {!result.available ? (
        <div className="panel mt-8 p-6">
          <h2 className="text-2xl font-bold">The catalog is temporarily unavailable.</h2>
          <p className="mt-3 leading-7 text-[var(--muted)]">Please try again shortly. The buying guides remain available while product information reconnects.</p>
        </div>
      ) : result.items.length ? (
        <>
          <div className="mt-7 flex flex-wrap items-center justify-between gap-3">
            <p className="font-semibold"><strong>{result.total.toLocaleString("en-US")}</strong> matching products</p>
            <p className="text-sm text-[var(--muted)]">Page {result.page} of {result.totalPages} · 24 per page</p>
          </div>
          <div className="mt-6 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {result.items.map((product) => <CostumeCatalogCard key={product.id} product={product} />)}
          </div>
          {result.totalPages > 1 ? (
            <nav className="mt-9 flex items-center justify-between gap-4" aria-label="Catalog pagination">
              {result.page > 1 ? (
                <Link className="button-secondary" href={catalogHref(basePath, filters, result.page - 1)}><ArrowLeft aria-hidden="true" size={16} /> Previous</Link>
              ) : <span />}
              {result.page < result.totalPages ? (
                <Link className="button-secondary" href={catalogHref(basePath, filters, result.page + 1)}>Next <ArrowRight aria-hidden="true" size={16} /></Link>
              ) : null}
            </nav>
          ) : null}
        </>
      ) : (
        <div className="panel mt-8 p-6">
          <h2 className="text-2xl font-bold">No products match these filters.</h2>
          <p className="mt-3 leading-7 text-[var(--muted)]">Clear one filter or search a broader product term.</p>
          <Link className="button-secondary mt-5" href={basePath}>Clear filters</Link>
        </div>
      )}
      <aside className="mt-10 grid gap-4 md:grid-cols-2">
        <div className="panel flex gap-3 p-5">
          <ImageOff aria-hidden="true" className="mt-1 shrink-0 text-[var(--brand)]" size={21} />
          <p className="text-sm leading-6 text-[var(--muted)]"><strong className="text-[var(--text)]">Images come from authorized sources.</strong> Product images are supplied through the retailer&apos;s CJ catalog or other approved merchant materials.</p>
        </div>
        <div className="panel flex gap-3 p-5">
          <ShieldCheck aria-hidden="true" className="mt-1 shrink-0 text-[var(--brand)]" size={21} />
          <p className="text-sm leading-6 text-[var(--muted)]"><strong className="text-[var(--text)]">Retailer links are product-specific.</strong> A purchase button appears only after the exact Abracadabra destination and CJ attribution path are checked.</p>
        </div>
      </aside>
    </>
  );
}

export function CostumePurchaseState({ product, firstViewport = false }: { product: CostumeCatalogProduct; firstViewport?: boolean }) {
  const ready = Boolean(product.activeLink && product.authorizedImage && product.availability !== "out of stock");

  if (ready && product.activeLink) {
    return (
      <div className="panel p-5">
        <ShieldCheck aria-hidden="true" className="text-[var(--brand)]" size={22} />
        <h2 className="mt-4 text-xl font-bold">Available at Abracadabra NYC</h2>
        <p className="mt-3 text-sm leading-6 text-[var(--muted)]">Check the exact variant, current availability, shipping, and return terms on the retailer page.</p>
        {firstViewport ? (
          <div className="mt-5">
            <TrackedCommerceLink
              firstViewport
              href={`/go/cj/${product.activeLink.clickToken}`}
              label="Check current price & availability at Abracadabra NYC"
              merchant="Abracadabra NYC"
              position="costume-product-first-viewport"
              productName={product.title}
              productSlug={product.slug}
              site="costume"
            />
          </div>
        ) : (
          <Link className="button-primary mt-5" href={`/go/cj/${product.activeLink.clickToken}`} rel="nofollow sponsored">Check current price &amp; availability at Abracadabra NYC <ArrowRight aria-hidden="true" size={16} /></Link>
        )}
      </div>
    );
  }

  return (
    <div className="panel p-5">
      <Link2Off aria-hidden="true" className="text-[var(--brand)]" size={22} />
      <h2 className="mt-4 text-xl font-bold">Retailer link unavailable</h2>
      <p className="mt-3 text-sm leading-6 text-[var(--muted)]">We show a retailer button only after confirming the exact product and destination. You can still use the details and buying checks on this page to compare options.</p>
    </div>
  );
}
