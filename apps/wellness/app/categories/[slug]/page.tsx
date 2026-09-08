import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, CheckCircle2, ExternalLink } from "lucide-react";
import { productPicks, site, wellnessCategories } from "@/app/site-data";

type PageProps = {
  params: Promise<{
    slug: string;
  }>;
};

export function generateStaticParams() {
  return wellnessCategories.map((category) => ({
    slug: category.slug,
  }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const category = wellnessCategories.find((item) => item.slug === slug);

  if (!category) {
    return {
      title: "Category",
    };
  }

  return {
    title: category.title,
    description: category.description,
    alternates: {
      canonical: `${site.domain}/categories/${category.slug}`,
    },
  };
}

export default async function Page({ params }: PageProps) {
  const { slug } = await params;
  const category = wellnessCategories.find((item) => item.slug === slug);

  if (!category) notFound();

  const products = productPicks.filter((product) =>
    category.productNames.includes(product.name),
  );

  return (
    <main className="guide-page wide-page">
      <Link className="back-link" href="/categories">
        <ArrowLeft size={16} aria-hidden="true" />
        Categories
      </Link>
      <header className="page-hero">
        <p className="section-label">{category.eyebrow}</p>
        <h1>{category.title}</h1>
        <p>{category.description}</p>
      </header>

      <section className="link-disabled-banner">
        <CheckCircle2 size={20} aria-hidden="true" />
        <div>
          <h2>{category.availability === "active" ? "Decision Rule" : "Coverage In Progress"}</h2>
          <p>{category.decision}</p>
        </div>
      </section>

      {products.length > 0 ? (
        <section className="product-list">
          {products.map((product) => (
          <article className="product-detail" key={product.name}>
            <div className="product-image-frame product-image-frame-large">
              <Image
                src={product.imageUrl}
                alt={product.name}
                fill
                sizes="(max-width: 900px) 100vw, 40vw"
                unoptimized
              />
            </div>
            <div className="product-copy">
              <p className="guide-meta">{product.category} <span className="catalog-price">Catalog reference {product.price}</span></p>
              <h2>{product.name}</h2>
              <p>{product.editorialNote}</p>
              <dl className="spec-list">
                {product.specs.map((spec) => (
                  <div key={spec.label}>
                    <dt>{spec.label}</dt>
                    <dd>{spec.value}</dd>
                  </div>
                ))}
              </dl>
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
            </div>
          </article>
          ))}
        </section>
      ) : (
        <section className="coverage-pending">
          <p className="section-label">Partner coverage</p>
          <h2>This category is ready for research, not retailer links yet.</h2>
          <p>
            We will add products only after an appropriate partner program is
            approved and its current catalog details are checked.
          </p>
          <Link className="text-link compact-link" href="/categories">
            Browse active collections
            <ArrowLeft size={16} aria-hidden="true" />
          </Link>
        </section>
      )}
    </main>
  );
}
