import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy",
  description: "Privacy overview for Madabase Wellness.",
  alternates: {
    canonical: "/privacy",
  },
};

export default function Page() {
  return (
    <main className="legal-page">
      <header className="page-hero">
        <p className="section-label">Privacy</p>
        <h1>Privacy</h1>
        <p>
          This site is designed to work as a lightweight editorial resource
          without account creation.
        </p>
      </header>
      <section className="legal-panel">
        <p>
          We do not ask visitors to create accounts, submit sensitive health
          information, or provide payment details. Hosting and analytics
          providers may process standard technical data such as IP address,
          device, browser, referring page, and page views.
        </p>
        <p>
          When affiliate links are added later, the destination retailer and
          affiliate network may use tracking technologies to attribute purchases.
          Relevant disclosures will be shown near those links.
        </p>
      </section>
    </main>
  );
}
