import Image from "next/image";
import Link from "next/link";
import { ArrowRight, CheckCircle2, ExternalLink } from "lucide-react";
import { principles, productPicks, wellnessCategories } from "./site-data";

export default function Home() {
  const activeCategories = wellnessCategories.filter(
    (category) => category.availability === "active",
  );
  const expandingCategories = wellnessCategories.filter(
    (category) => category.availability === "expanding",
  );
  const featuredProducts = [
    productPicks.find((product) => product.name === "Modal Cami Pajama Set"),
    productPicks.find((product) => product.name === "Satin Kimono Wedding Party Robe"),
    productPicks.find((product) => product.name === "High-Neck Lace Bralette"),
  ].filter(Boolean);

  return (
    <main>
      <section className="hero womens-hero">
        <Image
          src="/images/wellness/hero-womens-edit.png"
          alt="Lingerie, a silk robe, and loungewear arranged in a sunlit editorial still life"
          fill
          priority
          sizes="100vw"
          className="hero-image"
        />
        <div className="hero-scrim" />
        <div className="hero-content">
          <p className="kicker">Women&apos;s lingerie and homewear</p>
          <h1>Find the pieces that fit your everyday.</h1>
          <p>
            A growing, fit-led directory for lingerie, sleepwear, and easy home
            layers. Start with how a piece needs to feel, fit, and work in your routine.
          </p>
          <div className="hero-actions">
            <Link className="button button-primary" href="/categories">
              Explore the directory
              <ArrowRight size={18} aria-hidden="true" />
            </Link>
            <Link className="button button-secondary" href="#active-collections">
              Shop available collections
            </Link>
          </div>
        </div>
      </section>

      <section className="directory-band">
        <div className="directory-band-heading">
          <p className="section-label">The Women&apos;s Edit</p>
          <h2>Choose the kind of comfort you are shopping for.</h2>
        </div>
        <div className="directory-points">
          <span>Fit and coverage</span><span>Fabric and care</span><span>Routine and occasion</span>
        </div>
      </section>

      <section className="section category-directory">
        <div className="section-heading section-heading-row">
          <div><p className="section-label">Available now</p><h2>Start with a collection</h2></div>
          <p>These paths have an approved retailer destination today. We keep the choice practical before you leave the site.</p>
        </div>
        <div className="category-grid home-category-grid">
          {activeCategories.map((category, index) => (
            <Link className={`category-card category-card-${index + 1}`} href={`/categories/${category.slug}`} key={category.slug}>
              <div className="category-card-topline"><p className="section-label">{category.eyebrow}</p><span className="category-state">Live</span></div>
              <h3>{category.title}</h3>
              <p>{category.description}</p>
              <div className="category-card-footer"><span>{category.shoppingFocus}</span><ArrowRight size={18} aria-hidden="true" /></div>
            </Link>
          ))}
        </div>
      </section>

      <section className="section expansion-section">
        <div className="section-heading section-heading-row">
          <div><p className="section-label">Directory expansion</p><h2>More everyday categories are being built.</h2></div>
          <p>The taxonomy is ready, while retailer coverage is added only after a program is approved and its destination is checked.</p>
        </div>
        <div className="expansion-list">
          {expandingCategories.map((category) => (
            <Link href={`/categories/${category.slug}`} key={category.slug}>
              <span className="expansion-name">{category.title}</span><span>{category.shoppingFocus}</span><span className="expansion-status">In progress</span><ArrowRight size={17} aria-hidden="true" />
            </Link>
          ))}
        </div>
      </section>

      <section className="partner-focus" id="active-collections">
        <div className="partner-focus-copy">
          <p className="section-label">Active retailer coverage</p><h2>One approved partner, clearly labeled.</h2>
          <p>Avidlove is the only retailer with active product links today. We use the current CJ catalog price as a reference and send shoppers to the retailer for live sizing, color, and stock.</p>
          <Link className="text-link" href="/affiliate-disclosure">How affiliate links work<ArrowRight size={16} aria-hidden="true" /></Link>
        </div>
        <div className="active-partner-panel">
          <div className="active-partner-heading"><span className="partner-monogram">A</span><div><strong>Avidlove via CJ</strong><span>Approved product links</span></div><CheckCircle2 size={20} aria-hidden="true" /></div>
          <div className="active-partner-metrics"><div><strong>{productPicks.length}</strong><span>Live picks</span></div><div><strong>US</strong><span>Current market</span></div><div><strong>1</strong><span>Verified partner</span></div></div>
        </div>
      </section>

      <section className="section product-section">
        <div className="section-heading section-heading-row"><div><p className="section-label">The first product edit</p><h2>Start with a routine, then choose a piece.</h2></div><p>These are individual CJ catalog entries, arranged around a decision rather than a long, unfiltered retailer feed.</p></div>
        <div className="featured-edit">
          {featuredProducts.map((product, index) => product && (
            <article className={`featured-product featured-product-${index + 1}`} key={product.name}>
              <div className="product-image-frame">
                <Image
                  src={product.imageUrl}
                  alt={product.name}
                  fill
                  sizes="(max-width: 900px) 100vw, 33vw"
                  unoptimized
                />
              </div>
              <div className="featured-product-copy"><p className="guide-meta">{product.category} <span>{product.price}</span></p><h3>{product.name}</h3><p>{product.bestFor}</p><a className="text-link product-link" href={product.affiliateUrl} rel="sponsored nofollow" target="_blank">View at Avidlove<ExternalLink size={16} aria-hidden="true" /></a></div>
            </article>
          ))}
        </div>
        <div className="inventory-routes">
          {activeCategories.map((category) => (
            <Link href={`/categories/${category.slug}`} key={category.slug}>
              <span>{category.title}</span><strong>{category.productNames.length} picks</strong><span>{category.shoppingFocus}</span><ArrowRight size={17} aria-hidden="true" />
            </Link>
          ))}
        </div>
      </section>

      <section className="band principles">
        {principles.map((principle) => {
          const Icon = principle.icon;
          return <article key={principle.title}><Icon size={22} aria-hidden="true" /><h2>{principle.title}</h2><p>{principle.body}</p></article>;
        })}
      </section>

      <section className="band checklist-band">
        <div><p className="section-label">Publishing standard</p><h2>Coverage only goes live when the details are ready.</h2></div>
        <ul className="check-list">
          {["Retailer and collection destination match", "Affiliate disclosure is visible", "The partner program is approved", "Fit, fabric, and care claims are sourceable", "Tracking links are verified before activation"].map((item) => <li key={item}><CheckCircle2 size={18} aria-hidden="true" />{item}</li>)}
        </ul>
      </section>
    </main>
  );
}
