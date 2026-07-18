import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Methodology",
  description: "How Madabase Wellness evaluates adult wellness products and retailers.",
  alternates: {
    canonical: "/methodology",
  },
};

export default function Page() {
  return (
    <main className="legal-page">
      <header className="page-hero">
        <p className="section-label">Methodology</p>
        <h1>How We Evaluate</h1>
        <p>
          Recommendations are based on verifiable purchase criteria, clear
          evidence labels, and visible skip reasons.
        </p>
      </header>
      <section className="legal-panel">
        <h2>Evidence Modes</h2>
        <p>
          Official-spec coverage uses manufacturer or retailer documentation.
          Research-synthesis coverage combines attributed public evidence with
          editorial judgment. Hands-on claims are used only when the product was
          directly inspected or tested.
        </p>
        <h2>Evaluation Criteria</h2>
        <p>
          We prioritize surface material, waterproof rating, charging design,
          cleaning burden, storage, warranty, discreet shipping, billing
          descriptor, return policy, and whether the product has a clear fit and
          clear skip reason.
        </p>
        <h2>Retailer Criteria</h2>
        <p>
          Retailer coverage favors programs with explicit adult-wellness
          compliance, plain packaging language, visible support policies, and
          stable affiliate tracking outside Amazon Associates.
        </p>
      </section>
    </main>
  );
}
