import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About",
  description: "About Madabase Intimates and its lingerie editorial scope.",
  alternates: {
    canonical: "/about",
  },
};

export default function Page() {
  return (
    <main className="legal-page">
      <header className="page-hero">
        <p className="section-label">About</p>
        <h1>Intimates, Kept Practical</h1>
        <p>
          Madabase Intimates is an editorial project focused on practical
          lingerie and sleepwear buying guidance.
        </p>
      </header>
      <section className="legal-panel">
        <p>
          The site covers buying criteria that can be evaluated without
          sensational claims: fit, coverage, fabric, care instructions, sizing,
          return terms, and retailer reliability.
        </p>
        <p>
          It does not publish explicit imagery, sexual performance advice,
          medical treatment claims, or content directed to minors.
        </p>
      </section>
    </main>
  );
}
