import Image from "next/image";
import Link from "next/link";
import { ArrowRight, CheckCircle2, ExternalLink } from "lucide-react";
import {
  guides,
  pendingPartners,
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
          alt="Premium unbranded adult wellness products arranged in a discreet editorial still life"
          fill
          priority
          sizes="100vw"
          className="hero-image"
        />
        <div className="hero-scrim" />
        <div className="hero-content">
          <p className="kicker">Adult wellness guides for readers 18+</p>
          <h1>Madabase Wellness</h1>
          <p>
            Calm, evidence-led buying guidance for intimacy products, with
            attention to materials, hygiene, shipping privacy, and beginner fit.
          </p>
          <div className="hero-actions">
            <Link className="button button-primary" href="/guides/body-safe-materials">
              Start With Materials
              <ArrowRight size={18} aria-hidden="true" />
            </Link>
            <Link className="button button-secondary" href="/categories">
              Browse Categories
            </Link>
          </div>
        </div>
      </section>

      <section className="band intro-grid">
        <div>
          <p className="section-label">Positioning</p>
          <h2>Built as a health and care resource, not an adult-content site.</h2>
        </div>
        <p>
          The editorial boundary is simple: no explicit media, no arousal
          claims, no under-18 audience, and no medical promises. Product coverage
          is limited to practical purchase criteria that a careful adult buyer
          can verify before checkout.
        </p>
      </section>

      <section className="section">
        <div className="section-heading">
          <p className="section-label">Catalog</p>
          <h2>A Full Category Map Before Links Go Live</h2>
          <p>
            The site now mirrors a real retailer-style taxonomy while keeping
            decisions editorial: format first, fit second, merchant link last.
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

      <section className="section">
        <div className="section-heading">
          <p className="section-label">Guides</p>
          <h2>Ready For The First Publish</h2>
        </div>
        <div className="guide-grid">
          {guides.map((guide) => {
            const Icon = guide.icon;
            return (
              <Link className="guide-card" href={guide.slug} key={guide.slug}>
                <span className="icon-chip">
                  <Icon size={20} aria-hidden="true" />
                </span>
                <span className="guide-meta">
                  {guide.eyebrow} · {guide.minutes}
                </span>
                <h3>{guide.title}</h3>
                <p>{guide.description}</p>
              </Link>
            );
          })}
        </div>
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
          <p className="section-label">Merchant Roadmap</p>
          <h2>Product Picks Ready For Multi-Partner Link-In</h2>
          <p>
            LELO is the first mapped merchant, but the structure is ready for
            Lovehoney, We-Vibe, Bellesa, and other direct programs. Local
            unbranded art and disabled CTAs stay in place until approval.
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
              <div className="disabled-cta">{product.status}</div>
            </article>
          ))}
        </div>
        <Link className="text-link" href="/best/premium-wellness-catalog">
          View the full premium wellness catalog
          <ArrowRight size={16} aria-hidden="true" />
        </Link>
      </section>

      <section className="section partner-section">
        <div className="section-heading">
          <p className="section-label">Partners</p>
          <h2>Merchant Links Are Intentionally Disabled</h2>
          <p>
            These slots are ready for approved direct partner programs. No
            Amazon links or Amazon tracking IDs are used in this project.
          </p>
        </div>
        <div className="partner-list">
          {pendingPartners.map((partner) => (
            <div className="partner-row" key={partner}>
              <span>{partner}</span>
              <span className="pending">
                Application pending
                <ExternalLink size={14} aria-hidden="true" />
              </span>
            </div>
          ))}
        </div>
      </section>

      <section className="band checklist-band">
        <div>
          <p className="section-label">Launch Gate</p>
          <h2>Minimum Pages Before Applying</h2>
        </div>
        <ul className="check-list">
          {[
            "Homepage and guide pages published",
            "Affiliate disclosure visible",
            "Editorial policy and methodology live",
            "Privacy and contact pages live",
            "No external merchant links until approval",
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
