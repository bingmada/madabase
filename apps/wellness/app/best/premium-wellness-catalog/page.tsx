import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, CheckCircle2, Link2Off } from "lucide-react";
import { productPicks, wellnessCategories } from "@/app/site-data";

export const metadata: Metadata = {
  title: "Premium Wellness Catalog",
  description:
    "A link-disabled, multi-merchant adult wellness catalog prepared for affiliate approvals across LELO, Lovehoney, We-Vibe, Bellesa, and other partners.",
  alternates: {
    canonical: "/best/premium-wellness-catalog",
  },
};

export default function Page() {
  return (
    <main className="guide-page wide-page">
      <Link className="back-link" href="/">
        <ArrowLeft size={16} aria-hidden="true" />
        Home
      </Link>
      <header className="page-hero">
        <p className="section-label">Multi-Merchant Catalog</p>
        <h1>Premium Wellness Catalog Prepared For Link-In</h1>
        <p>
          This catalog is intentionally merchant-neutral. LELO is the first
          product source being prepared, while Lovehoney, We-Vibe, Bellesa, and
          other approved programs can be added without changing the site
          structure.
        </p>
      </header>

      <section className="link-disabled-banner">
        <Link2Off size={20} aria-hidden="true" />
        <div>
          <h2>Affiliate Links Disabled</h2>
          <p>
            No outbound merchant buttons are active yet. Add approved tracking
            links and authorized assets only after each partner account is
            accepted.
          </p>
        </div>
      </section>

      <section className="merchant-strip" aria-label="Merchant readiness">
        {["LELO", "Lovehoney", "We-Vibe", "Bellesa", "Multi-merchant"].map((merchant) => (
          <div key={merchant}>
            <strong>{merchant}</strong>
            <span>
              {productPicks.filter((product) => product.merchant === merchant).length} mapped
            </span>
          </div>
        ))}
      </section>

      <section className="product-list">
        {wellnessCategories.map((category) => {
          const products = productPicks.filter((product) =>
            category.productNames.includes(product.name),
          );

          return (
            <div className="catalog-group" key={category.slug}>
              <div className="catalog-group-heading">
                <p className="section-label">{category.eyebrow}</p>
                <h2>{category.title}</h2>
                <p>{category.description}</p>
              </div>
              {products.map((product) => (
                <article className="product-detail" key={`${category.slug}-${product.name}`}>
                  <div className={`product-art large ${product.art}`} aria-hidden="true">
                    <span />
                  </div>
                  <div className="product-copy">
                    <p className="guide-meta">
                      {product.merchant} · {product.category}
                    </p>
                    <h2>{product.name}</h2>
                    <p>{product.editorialNote}</p>
                    <div className="fit-grid">
                      <div>
                        <h3>Best For</h3>
                        <p>{product.bestFor}</p>
                      </div>
                      <div>
                        <h3>Skip If</h3>
                        <p>{product.skipIf}</p>
                      </div>
                    </div>
                    <dl className="spec-list">
                      {product.specs.map((spec) => (
                        <div key={spec.label}>
                          <dt>{spec.label}</dt>
                          <dd>{spec.value}</dd>
                        </div>
                      ))}
                    </dl>
                    <div className="disabled-cta">
                      <CheckCircle2 size={16} aria-hidden="true" />
                      {product.status}
                    </div>
                  </div>
                </article>
              ))}
            </div>
          );
        })}
      </section>
    </main>
  );
}
