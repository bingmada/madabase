import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { productPicks, wellnessCategories } from "@/app/site-data";

export const metadata: Metadata = {
  title: "Categories",
  description:
    "Browse lingerie and sleepwear collections by silhouette, routine, layering, and buyer fit.",
  alternates: {
    canonical: "/categories",
  },
};

export default function Page() {
  return (
    <main className="guide-page wide-page">
      <header className="page-hero">
        <p className="section-label">Categories</p>
          <h1>Find the collection that fits your routine.</h1>
        <p>
          Start with the silhouette and occasion that make sense for you. These
          collections keep the decision practical before sending you to an
          approved retailer.
        </p>
      </header>
      <section className="category-grid">
        {wellnessCategories.filter((category) => category.availability === "active").map((category) => {
          const products = productPicks.filter((product) =>
            category.productNames.includes(product.name),
          );
          return (
            <Link className="category-card" href={`/categories/${category.slug}`} key={category.slug}>
              <p className="section-label">{category.eyebrow}</p>
              <h2>{category.title}</h2>
              <p>{category.description}</p>
              <span className="category-count">
                {products.length} active picks
              </span>
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
