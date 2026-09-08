import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, CheckCircle2, ExternalLink } from "lucide-react";
import { AffiliateLink } from "@/components/AffiliateLink";
import { productPicks, site, wellnessCategories } from "@/app/site-data";

type PageProps = {
  params: Promise<{
    slug: string;
  }>;
};

export function generateStaticParams() {
  return wellnessCategories
    .filter((category) => category.availability === "active")
    .map((category) => ({
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
    ...(category.availability === "hidden"
      ? {
          robots: {
            index: false,
            follow: true,
            nocache: true,
          },
        }
      : {}),
  };
}

export default async function Page({ params }: PageProps) {
  const { slug } = await params;
  const category = wellnessCategories.find((item) => item.slug === slug);

  if (!category || category.availability === "hidden") notFound();

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
          <h2>Decision Rule</h2>
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
              <p className="evidence-note"><strong>Evidence:</strong> official retailer listing and CJ catalog; not a hands-on test.</p>
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
              <AffiliateLink
                className="button button-primary"
                href={product.affiliateUrl}
                merchant={product.merchant}
                position={`category-${category.slug}`}
                productSlug={product.slug}
              >
                View At {product.merchant}
                <ExternalLink size={16} aria-hidden="true" />
              </AffiliateLink>
            </div>
          </article>
          ))}
        </section>
      ) : null}
    </main>
  );
}
