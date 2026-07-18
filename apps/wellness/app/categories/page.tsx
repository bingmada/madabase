import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { productPicks, wellnessCategories } from "@/app/site-data";

export const metadata: Metadata = {
  title: "Categories",
  description:
    "Browse adult wellness categories by product format, care routine, partner use, and buyer fit.",
  alternates: {
    canonical: "/categories",
  },
};

export default function Page() {
  return (
    <main className="guide-page wide-page">
      <header className="page-hero">
        <p className="section-label">Categories</p>
        <h1>Shop The Decision Path First</h1>
        <p>
          A complete adult-wellness catalog should help readers choose the right
          product type before sending them to a retailer. These categories keep
          the site broad while staying practical and non-explicit.
        </p>
      </header>
      <section className="category-grid">
        {wellnessCategories.map((category) => {
          const products = productPicks.filter((product) =>
            category.productNames.includes(product.name),
          );
          return (
            <Link className="category-card" href={`/categories/${category.slug}`} key={category.slug}>
              <p className="section-label">{category.eyebrow}</p>
              <h2>{category.title}</h2>
              <p>{category.description}</p>
              <span className="category-count">{products.length} products mapped</span>
              <span className="text-link compact-link">
                View category
                <ArrowRight size={16} aria-hidden="true" />
              </span>
            </Link>
          );
        })}
      </section>
    </main>
  );
}
