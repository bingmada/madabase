import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy",
  description: "Privacy overview for Madabase Women's Edit.",
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
          providers, including Microsoft Clarity, may process standard technical
          data such as IP address, device, browser, referring page, and page
          views.
        </p>
        <p>
          When visitors follow affiliate links, the destination retailer and CJ
          may use tracking technologies to attribute purchases. Our redirect
          records the product, merchant, page path, and a non-personal click ID
          so link operation can be checked. Relevant disclosures appear near
          those links.
        </p>
      </section>
    </main>
  );
}
