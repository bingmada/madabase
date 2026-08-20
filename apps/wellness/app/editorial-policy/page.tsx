import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Editorial Policy",
  description: "Editorial standards for Madabase Wellness.",
  alternates: {
    canonical: "/editorial-policy",
  },
};

export default function Page() {
  return (
    <main className="legal-page">
      <header className="page-hero">
        <p className="section-label">Policy</p>
        <h1>Editorial Policy</h1>
        <p>
          The site is written for readers who want careful, non-explicit
          lingerie and sleepwear purchase guidance.
        </p>
      </header>
      <section className="legal-panel">
        <p>
          We avoid explicit imagery, sensational language, sexualized claims,
          and medical promises. We do not target or collect knowingly from
          readers under 18.
        </p>
        <p>
          Affiliate relationships do not control editorial conclusions. A
          product can be excluded, delayed, or marked unsuitable when evidence is
          unclear or the retailer terms are not buyer-friendly.
        </p>
        <p>
          Pages are updated when material specs, retailer policies, or affiliate
          relationships change.
        </p>
      </section>
    </main>
  );
}
