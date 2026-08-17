import { ArrowRight, CheckCircle2, Menu, Scale, Search, ShieldCheck } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { buyerFacingSummary } from "@/lib/conversion-copy";
import type { SiteDecisionModule } from "@/lib/site-decision-modules";
import type { SiteConfig } from "@/lib/sites";
import type { Product, Roundup } from "@/lib/types";

export function SiteChrome({ site, children }: { site: SiteConfig; children: React.ReactNode }) {
  return (
    <body
      style={
        {
          "--brand": site.theme.brand,
          "--brand-strong": site.theme.brandStrong,
          "--brand-soft": site.theme.brandSoft,
          "--accent": site.theme.accent,
          "--accent-soft": site.theme.accentSoft,
        } as React.CSSProperties
      }
    >
      <header className="sticky top-0 z-50 border-b border-[var(--border)] bg-white/95 backdrop-blur">
        <div className="shell flex min-h-16 items-center justify-between gap-4 py-3">
          <Link className="shrink-0 whitespace-nowrap text-lg font-black text-[var(--brand-strong)]" href="/">
            {site.key === "costume" ? (
              <>
                <span className="sm:hidden">Madabase Halloween</span>
                <span className="hidden sm:inline">{site.name}</span>
              </>
            ) : site.name}
          </Link>
          <nav className="hidden min-w-0 flex-nowrap items-center justify-end gap-x-3 whitespace-nowrap text-xs font-semibold sm:flex sm:gap-x-4 sm:text-sm" aria-label="Primary navigation">
            <Link className="hidden hover:text-[var(--brand-strong)] sm:inline" href="/">
              Home
            </Link>
            {site.key === "costume" ? <Link className="font-black text-[#a14f1c] hover:text-[var(--brand-strong)]" href="/halloween">Halloween</Link> : null}
            {site.key === "costume" ? <Link className="hover:text-[var(--brand-strong)]" href="/halloween-ideas">Ideas & kits</Link> : null}
            {site.key === "costume" ? <Link className="hover:text-[var(--brand-strong)]" href="/catalog">Catalog</Link> : null}
            {site.categories.map((category) => (
              <Link className={site.key === "costume" ? "hidden" : "hover:text-[var(--brand-strong)]"} href={`/categories/${category.slug}`} key={category.slug}>
                {category.name}
              </Link>
            ))}
            <Link className="hidden hover:text-[var(--brand-strong)] sm:inline" href="/#guides">
              Guides
            </Link>
            {site.key === "costume" ? (
              <Link className="hidden hover:text-[var(--brand-strong)] sm:inline" href="/premium">Premium</Link>
            ) : (
              <Link className="hidden hover:text-[var(--brand-strong)] sm:inline" href="/#tools">Tools</Link>
            )}
            <Link className="hidden hover:text-[var(--brand-strong)] sm:inline" href="/methodology">
              Methodology
            </Link>
          </nav>
          <details className="relative sm:hidden">
            <summary className="button-secondary list-none cursor-pointer px-3 py-2" aria-label="Open navigation menu">
              <Menu aria-hidden="true" size={17} />
              <span>Browse</span>
            </summary>
            <div className="panel absolute right-0 top-full z-50 mt-2 w-56 p-2 shadow-[var(--shadow)]">
              <nav className="grid gap-1 text-sm font-semibold" aria-label="Mobile navigation">
                <Link className="rounded-md px-3 py-2 hover:bg-[var(--surface-muted)]" href="/">Home</Link>
                {site.key === "costume" ? <Link className="rounded-md px-3 py-2 font-black text-[#a14f1c] hover:bg-[var(--surface-muted)]" href="/halloween">Halloween 2026</Link> : null}
                {site.key === "costume" ? <Link className="rounded-md px-3 py-2 hover:bg-[var(--surface-muted)]" href="/halloween-ideas">Ideas & editorial kits</Link> : null}
                {site.key === "costume" ? <Link className="rounded-md px-3 py-2 hover:bg-[var(--surface-muted)]" href="/catalog">Catalog</Link> : null}
                {site.categories.map((category) => (
                  <Link className="rounded-md px-3 py-2 hover:bg-[var(--surface-muted)]" href={`/categories/${category.slug}`} key={category.slug}>
                    {category.name}
                  </Link>
                ))}
                <Link className="rounded-md px-3 py-2 hover:bg-[var(--surface-muted)]" href="/#guides">Guides</Link>
                {site.key === "costume" ? (
                  <Link className="rounded-md px-3 py-2 hover:bg-[var(--surface-muted)]" href="/premium">Premium & Professional</Link>
                ) : (
                  <Link className="rounded-md px-3 py-2 hover:bg-[var(--surface-muted)]" href="/#tools">Tools</Link>
                )}
                <Link className="rounded-md px-3 py-2 hover:bg-[var(--surface-muted)]" href="/methodology">Methodology</Link>
              </nav>
            </div>
          </details>
        </div>
      </header>
      {children}
      <footer className="border-t border-[var(--border)] bg-white">
        <div className="shell py-8 text-sm leading-6 text-[var(--muted)]">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <Link className="font-semibold text-[var(--text)] hover:text-[var(--brand-strong)]" href="/">
              {site.name}
            </Link>
            <nav className="flex flex-wrap gap-x-4 gap-y-2 font-semibold" aria-label="Site information">
              <Link className="hover:text-[var(--brand-strong)]" href="/about">
                About
              </Link>
              <Link className="hover:text-[var(--brand-strong)]" href="/methodology">
                Methodology
              </Link>
              <Link className="hover:text-[var(--brand-strong)]" href="/editorial-policy">
                Editorial policy
              </Link>
              <Link className="hover:text-[var(--brand-strong)]" href="/affiliate-disclosure">
                Affiliate disclosure
              </Link>
              <Link className="hover:text-[var(--brand-strong)]" href="/privacy">
                Privacy
              </Link>
              <Link className="hover:text-[var(--brand-strong)]" href="/contact">
                Contact
              </Link>
            </nav>
          </div>
          <p className="mt-2 max-w-3xl">{site.disclosure}</p>
          <nav className="mt-5 flex flex-wrap gap-x-4 gap-y-2 text-xs font-semibold uppercase tracking-[0.12em]" aria-label="Madabase network">
            <a className="hover:text-[var(--brand-strong)]" href="https://madabase.com">Madabase research</a>
            <a className="hover:text-[var(--brand-strong)]" href="https://pets.madabase.com">Pet gear</a>
            <a className="hover:text-[var(--brand-strong)]" href="https://homeoffice.madabase.com">Home office</a>
            <a className="hover:text-[var(--brand-strong)]" href="https://baby.madabase.com">Baby gear</a>
            <a className="hover:text-[var(--brand-strong)]" href="https://network.madabase.com">Home network</a>
            <a className="hover:text-[var(--brand-strong)]" href="https://smarthome.madabase.com">Smart home</a>
            <a className="hover:text-[var(--brand-strong)]" href="https://style.madabase.com">Style accessories</a>
          </nav>
        </div>
      </footer>
    </body>
  );
}

export function Hero({ site }: { site: SiteConfig }) {
  return (
    <section className="relative overflow-hidden bg-[#111814] text-white">
      <Image className="absolute inset-0 h-full w-full object-cover" src={site.heroImage} alt="" fill priority sizes="100vw" />
      <div className="absolute inset-0 bg-black/60" />
      <div className="shell relative grid min-h-[520px] content-end pb-12 pt-24">
        <div className="max-w-3xl">
          <p className="eyebrow text-white/80">{site.name}</p>
          <h1 className="mt-4 text-4xl font-black leading-tight text-white sm:text-6xl">{site.tagline}</h1>
          <p className="mt-5 max-w-2xl text-lg leading-8 text-white/82">{site.description}</p>
          <div className="mt-7 flex flex-wrap gap-3">
            <Link className="button-primary" href="#reviews">
              Start comparing
              <ArrowRight aria-hidden="true" size={16} />
            </Link>
            <Link className="button-secondary bg-white/95" href="#guides">
              Browse buying guides
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

export function TrustBar() {
  const items = [
    { icon: Search, label: "Independent, research-backed buying guidance" },
    { icon: Scale, label: "Exact model, compatibility, and retailer checks" },
    { icon: ShieldCheck, label: "Affiliate links clearly disclosed" },
  ];

  return (
    <div className="border-b border-[var(--border)] bg-white">
      <div className="shell grid gap-3 py-4 sm:grid-cols-3">
        {items.map((item) => (
          <div className="flex items-center gap-2 text-sm font-semibold text-[var(--muted)]" key={item.label}>
            <item.icon aria-hidden="true" className="text-[var(--brand)]" size={18} />
            {item.label}
          </div>
        ))}
      </div>
    </div>
  );
}

export function DecisionModules({ modules }: { modules: SiteDecisionModule[] }) {
  if (!modules.length) return null;

  return (
    <section className="section bg-white" aria-labelledby="decision-modules-heading">
      <div className="shell">
        <div className="max-w-3xl">
          <p className="eyebrow">Explore a complete setup</p>
          <h2 className="mt-3 text-3xl font-black sm:text-4xl" id="decision-modules-heading">Build the whole decision, not just a product list.</h2>
          <p className="mt-4 leading-8 text-[var(--muted)]">
            Each module connects products, comparisons, and practical checks around one real job so you can rule out the wrong fit earlier.
          </p>
        </div>
        <div className="mt-8 grid gap-5 lg:grid-cols-2">
          {modules.map((module) => (
            <article className="panel p-6" key={module.slug}>
              <p className="eyebrow">{module.eyebrow}</p>
              <h3 className="mt-3 text-2xl font-black">{module.title}</h3>
              <p className="mt-3 leading-7 text-[var(--muted)]">{module.description}</p>
              <nav className="mt-6" aria-label={`${module.title} buying paths`}>
                <ul className="grid gap-3">
                  {module.links.map((link) => (
                    <li key={link.href}>
                      <Link className="block rounded-md border border-[var(--border)] bg-[var(--surface-muted)] p-4 transition hover:border-[var(--brand)] hover:bg-white" href={link.href}>
                        <span className="flex items-start justify-between gap-3 font-bold text-[var(--brand-strong)]">
                          <span>{link.label}</span>
                          <span aria-hidden="true">→</span>
                        </span>
                        <span className="mt-1 block text-sm leading-6 text-[var(--muted)]">{link.note}</span>
                      </Link>
                    </li>
                  ))}
                </ul>
              </nav>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

export function ProductCard({ product }: { product: Product }) {
  const displayName = product.amazonTitle ?? product.name;
  const displayImage = product.amazonImage ?? product.image;

  return (
    <article className="panel overflow-hidden">
      <Link className="relative block h-52 w-full" href={`/reviews/${product.slug}`}>
        <Image className="object-cover" src={displayImage} alt={displayName} fill sizes="(min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw" />
      </Link>
      <div className="p-5">
        <div>
          <p className="text-xs font-bold uppercase text-[var(--muted)]">{product.brand}</p>
          <h3 className="mt-1 text-xl font-bold">{displayName}</h3>
        </div>
        <p className="mt-3 leading-7 text-[var(--muted)]">{buyerFacingSummary(product.summary)}</p>
        <p className="mt-3 text-sm font-semibold text-[var(--brand-strong)]">Best for: {product.bestFor}</p>
        <p className="mt-2 text-sm leading-6 text-[var(--muted)]">Main caution: {product.cons[0]}</p>
        <div className="mt-5 flex flex-wrap gap-2">
          <Link className="button-secondary" href={`/reviews/${product.slug}`}>
            Compare fit and trade-offs
            <ArrowRight aria-hidden="true" size={16} />
          </Link>
        </div>
      </div>
    </article>
  );
}

export function RoundupCard({ roundup }: { roundup: Roundup }) {
  return (
    <Link className="panel block p-5 transition hover:-translate-y-0.5 hover:shadow-[var(--shadow)]" href={`/best/${roundup.slug}`}>
      <p className="eyebrow">{roundup.category}</p>
      <h3 className="mt-3 text-xl font-bold">{roundup.title}</h3>
      <p className="mt-3 leading-7 text-[var(--muted)]">{roundup.dek}</p>
      <span className="mt-5 inline-flex items-center gap-2 text-sm font-bold text-[var(--brand-strong)]">
        Compare picks
        <ArrowRight aria-hidden="true" size={16} />
      </span>
    </Link>
  );
}

export function Disclosure({ site }: { site: SiteConfig }) {
  return (
    <div className="rounded-md border border-[var(--border)] bg-[var(--surface-muted)] p-4 text-sm leading-6 text-[var(--muted)]">
      <strong className="text-[var(--text)]">How links work:</strong> {site.disclosure}
      <p className="mt-2">
        Prices, availability, shipping, coupons, and seller details can change. Always confirm the current product listing and return policy before buying.
      </p>
    </div>
  );
}

export function MethodologyList({ items }: { items: string[] }) {
  return (
    <div className="panel p-5">
      <h2 className="flex items-center gap-2 text-xl font-bold">
        <CheckCircle2 aria-hidden="true" className="text-[var(--brand)]" size={20} />
        How we evaluate
      </h2>
      <ul className="mt-4 space-y-3 text-[var(--muted)]">
        {items.map((item) => (
          <li className="flex gap-2" key={item}>
            <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-[var(--brand)]" />
            {item}
          </li>
        ))}
      </ul>
    </div>
  );
}
