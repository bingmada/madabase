import Image from "next/image";
import Link from "next/link";
import { ArrowRight, CheckCircle2, ExternalLink } from "lucide-react";
import {
  approvedPartners,
  principles,
  productPicks,
  wellnessCategories,
} from "./site-data";

export default function Home() {
  return (
    <main>
      <section className="hero">
        <Image
          src="/images/wellness/hero.png"
          alt="Unbranded lingerie and sleepwear arranged in a calm editorial still life"
          fill
          priority
          sizes="100vw"
          className="hero-image"
        />
        <div className="hero-scrim" />
        <div className="hero-content">
          <p className="kicker">Lingerie and sleepwear buying guides</p>
          <h1>Madabase Intimates</h1>
          <p>
            Calm, practical guidance for choosing lingerie and sleepwear, with
            attention to fit, fabric, care, and the occasion you are shopping for.
          </p>
          <div className="hero-actions">
            <Link className="button button-primary" href="/categories">
              Browse Collections
              <ArrowRight size={18} aria-hidden="true" />
            </Link>
            <Link className="button button-secondary" href="/methodology">
              Our Method
            </Link>
          </div>
        </div>
      </section>

      <section className="band intro-grid">
        <div>
          <p className="section-label">Positioning</p>
          <h2>Built as a practical fashion and comfort resource.</h2>
        </div>
        <p>
          The editorial boundary is simple: no explicit media, no suggestive
          claims, and no invented product testing. Coverage stays with practical
          purchase criteria a careful shopper can verify before checkout.
        </p>
      </section>

      <section className="section">
        <div className="section-heading">
          <p className="section-label">Catalog</p>
          <h2>Start With The Right Collection</h2>
          <p>
            Choose by silhouette, routine, and layering needs first. Brand links
            come only after the recommendation context is clear.
          </p>
        </div>
        <div className="category-grid home-category-grid">
          {wellnessCategories.slice(0, 6).map((category) => (
            <Link className="category-card" href={`/categories/${category.slug}`} key={category.slug}>
              <p className="section-label">{category.eyebrow}</p>
              <h3>{category.title}</h3>
              <p>{category.description}</p>
              <span className="category-count">
                {category.productNames.length} products mapped
              </span>
            </Link>
          ))}
        </div>
        <Link className="text-link" href="/categories">
          View all categories
          <ArrowRight size={16} aria-hidden="true" />
        </Link>
      </section>

      <section className="band principles">
        {principles.map((principle) => {
          const Icon = principle.icon;
          return (
            <article key={principle.title}>
              <Icon size={22} aria-hidden="true" />
              <h2>{principle.title}</h2>
              <p>{principle.body}</p>
            </article>
          );
        })}
      </section>

      <section className="section">
        <div className="section-heading">
          <p className="section-label">Approved Partner</p>
          <h2>Avidlove Collection Coverage Is Ready</h2>
          <p>
            Avidlove has approved the site through CJ. Collection links point to
            the retailer&apos;s main storefront while individual product details are
            still verified before they are added.
          </p>
        </div>
        <div className="product-grid">
          {productPicks.slice(0, 8).map((product) => (
            <article className="product-card" key={product.name}>
              <div className={`product-art ${product.art}`} aria-hidden="true">
                <span />
              </div>
              <p className="guide-meta">
                {product.merchant} · {product.category}
              </p>
              <h3>{product.name}</h3>
              <p>{product.bestFor}</p>
              {product.affiliateUrl ? (
                <a
                  className="button button-primary"
                  href={product.affiliateUrl}
                  rel="sponsored nofollow"
                  target="_blank"
                >
                  View At {product.merchant}
                  <ExternalLink size={16} aria-hidden="true" />
                </a>
              ) : (
                <div className="disabled-cta">{product.status}</div>
              )}
            </article>
          ))}
        </div>
        <Link className="text-link" href="/categories">
          Explore all collections
          <ArrowRight size={16} aria-hidden="true" />
        </Link>
      </section>

      <section className="section partner-section">
        <div className="section-heading">
          <p className="section-label">Partners</p>
          <h2>Partner Links Are Verified Before Activation</h2>
          <p>
            Only approved direct partner programs are used here. No Amazon links
            or Amazon tracking IDs are used in this project.
          </p>
        </div>
        <div className="partner-list">
          {approvedPartners.map((partner) => (
            <div className="partner-row" key={partner}>
              <span>{partner}</span>
              <span className="pending">
                CJ approved - collection link active
                <ExternalLink size={14} aria-hidden="true" />
              </span>
            </div>
          ))}
        </div>
      </section>

      <section className="band checklist-band">
        <div>
          <p className="section-label">Publishing Standard</p>
          <h2>What Must Be Verified Before A Link Goes Live</h2>
        </div>
        <ul className="check-list">
          {[
            "Collection page and retailer destination match",
            "Affiliate disclosure visible",
            "Editorial policy and methodology live",
            "Privacy and contact pages live",
            "Current tracking link verified in CJ",
          ].map((item) => (
            <li key={item}>
              <CheckCircle2 size={18} aria-hidden="true" />
              {item}
            </li>
          ))}
        </ul>
      </section>
    </main>
  );
}
