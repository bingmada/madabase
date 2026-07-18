import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Affiliate Disclosure",
  description: "Affiliate disclosure for Madabase Wellness.",
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
          Some future pages may include paid links to approved adult-wellness
          retailers.
        </p>
      </header>
      <section className="legal-panel">
        <p>
          If you buy through a paid link, we may earn a commission at no extra
          cost to you. Any paid relationship will be disclosed near relevant
          links and on affected pages.
        </p>
        <p>
          This project does not use Amazon Associates links or Amazon tracking
          IDs. Merchant links are disabled until direct partner programs are
          approved.
        </p>
      </section>
    </main>
  );
}
