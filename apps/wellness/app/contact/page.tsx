import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact",
  description: "Contact Madabase Wellness.",
  alternates: {
    canonical: "/contact",
  },
};

export default function Page() {
  return (
    <main className="legal-page">
      <header className="page-hero">
        <p className="section-label">Contact</p>
        <h1>Contact</h1>
        <p>
          For corrections, retailer policy changes, or partnership questions,
          contact the Madabase team.
        </p>
      </header>
      <section className="legal-panel">
        <p>Email: contact@madabase.com</p>
        <p>
          Please do not send private medical details. We cannot provide medical,
          legal, or relationship advice.
        </p>
      </section>
    </main>
  );
}
