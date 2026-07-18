import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, CheckCircle2 } from "lucide-react";
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
          <h2>Decision Rule</h2>
          <p>{category.decision}</p>
        </div>
      </section>

      <section className="product-list">
        {products.map((product) => (
          <article className="product-detail" key={product.name}>
            <div className={`product-art large ${product.art}`} aria-hidden="true">
              <span />
            </div>
            <div className="product-copy">
              <p className="guide-meta">{product.category}</p>
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
              <div className="disabled-cta">Affiliate link pending</div>
            </div>
          </article>
        ))}
      </section>
    </main>
  );
}
