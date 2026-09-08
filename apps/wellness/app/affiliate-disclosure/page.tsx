import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Affiliate Disclosure",
  description: "Affiliate disclosure for Madabase Women's Edit.",
  alternates: {
    canonical: "/affiliate-disclosure",
  },
};

export default function Page() {
  return (
    <main className="legal-page">
      <header className="page-hero">
        <p className="section-label">Disclosure</p>
        <h1>Affiliate Disclosure</h1>
        <p>
          Some pages include paid links to approved lingerie and sleepwear
          retailers.
        </p>
      </header>
      <section className="legal-panel">
        <p>
          If you buy through a paid link, we may earn a commission at no extra
          cost to you. Any paid relationship will be disclosed near relevant
          links and on the affected pages.
        </p>
        <p>
          This project does not use Amazon Associates links or Amazon tracking
          IDs. Avidlove is approved through CJ. Active links are labeled as
          sponsored and are enabled only for verified Avidlove destinations.
        </p>
      </section>
    </main>
  );
}
