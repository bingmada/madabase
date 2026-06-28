import { ArrowRight, CheckCircle2, Scale, Search, ShieldCheck } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import type { SiteConfig } from "@/lib/sites";
import type { Product, Roundup } from "@/lib/types";
import { AffiliateButton } from "./AffiliateButton";

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
        <div className="shell flex min-h-16 items-center justify-between gap-5 py-3">
          <Link className="text-lg font-black text-[var(--brand-strong)]" href="/">
            {site.name}
          </Link>
          <nav className="flex flex-wrap items-center justify-end gap-x-4 gap-y-2 text-sm font-semibold" aria-label="Primary navigation">
            <Link className="hover:text-[var(--brand-strong)]" href="/">
              Home
            </Link>
            {site.categories.map((category) => (
              <Link className="hover:text-[var(--brand-strong)]" href={`/categories/${category.slug}`} key={category.slug}>
                {category.name}
              </Link>
            ))}
            <Link className="hover:text-[var(--brand-strong)]" href="/#guides">
              Guides
            </Link>
            <Link className="hover:text-[var(--brand-strong)]" href="/#tools">
              Tools
            </Link>
            <Link className="hover:text-[var(--brand-strong)]" href="/methodology">
              Methodology
            </Link>
          </nav>
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
              <Link className="hover:text-[var(--brand-strong)]" href="/contact">
                Contact
              </Link>
            </nav>
          </div>
          <p className="mt-2 max-w-3xl">{site.disclosure}</p>
        </div>
      </footer>
    </body>
  );
}

export function Hero({ site }: { site: SiteConfig }) {
  return (
    <section className="relative overflow-hidden bg-[#111814] text-white">
      <Image className="absolute inset-0 h-full w-full object-cover opacity-45" src={site.heroImage} alt="" fill priority sizes="100vw" />
      <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/48 to-black/12" />
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
            <Link className="button-secondary bg-white/95" href="#tools">
              Use a calculator
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

export function TrustBar() {
  const items = [
    { icon: Search, label: "Built around real buying situations" },
    { icon: Scale, label: "Trade-offs before checkout" },
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

export function ProductCard({ site, product, position }: { site: SiteConfig; product: Product; position: string }) {
  const displayName = product.amazonTitle ?? product.name;
  const displayImage = product.amazonImage ?? product.image;

  return (
    <article className="panel overflow-hidden">
      <div className="relative h-52 w-full">
        <Image className="object-cover" src={displayImage} alt={displayName} fill sizes="(min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw" />
      </div>
      <div className="p-5">
        <div>
          <p className="text-xs font-bold uppercase text-[var(--muted)]">{product.brand}</p>
          <h3 className="mt-1 text-xl font-bold">{displayName}</h3>
        </div>
        <p className="mt-3 leading-7 text-[var(--muted)]">{product.summary}</p>
        <p className="mt-3 text-sm font-semibold text-[var(--brand-strong)]">Best for: {product.bestFor}</p>
        <div className="mt-5 flex flex-wrap gap-2">
          <Link className="button-secondary" href={`/reviews/${product.slug}`}>
            Read notes
          </Link>
          {product.offers[0] ? <AffiliateButton site={site.key} product={product} offer={product.offers[0]} position={position} /> : null}
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
