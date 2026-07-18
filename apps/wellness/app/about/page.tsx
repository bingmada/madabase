import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About",
  description: "About Madabase Wellness and its adult wellness editorial scope.",
  alternates: {
    canonical: "/about",
  },
};

export default function Page() {
  return (
    <main className="legal-page">
      <header className="page-hero">
        <p className="section-label">About</p>
        <h1>Adult Wellness, Kept Practical</h1>
        <p>
          Madabase Wellness is a separate editorial project focused on adult
          intimacy-product research for readers 18 and older.
        </p>
      </header>
      <section className="legal-panel">
        <p>
          The site covers buying criteria that can be evaluated without explicit
          content: body-safe materials, cleaning, storage, privacy, returns,
          controls, noise, charging, warranty, and retailer reliability.
        </p>
        <p>
          It does not publish explicit images, sexual performance advice,
          medical treatment claims, or content directed to minors.
        </p>
      </section>
    </main>
  );
}
