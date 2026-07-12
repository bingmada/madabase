import type { ReactNode } from "react";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import type { Locale } from "@/lib/i18n";

export type InfoSection = {
  heading: string;
  paragraphs: string[];
  bullets?: string[];
};

export async function InfoPage({
  locale,
  pathname,
  eyebrow,
  title,
  description,
  sections,
  footer,
}: {
  locale: Locale;
  pathname: string;
  eyebrow: string;
  title: string;
  description: string;
  sections: InfoSection[];
  footer?: ReactNode;
}) {
  return (
    <div className="min-h-screen bg-transparent">
      <Header locale={locale} pathname={pathname} />
      <main className="page-shell">
        <section className="surface-card-strong p-6 sm:p-8 lg:p-10">
          <p className="eyebrow">{eyebrow}</p>
          <h1 className="mt-4 max-w-4xl text-4xl font-black tracking-tight text-[var(--text)] sm:text-5xl">{title}</h1>
          <p className="mt-5 max-w-3xl text-lg leading-8 text-[var(--text-muted)]">{description}</p>
        </section>

        <article className="mt-8 space-y-8 rounded-md border border-[var(--border)] bg-white/70 p-6 sm:p-8 lg:p-10">
          {sections.map((section) => (
            <section key={section.heading} className="border-b border-[var(--border)] pb-8 last:border-b-0 last:pb-0">
              <h2 className="text-2xl font-bold text-[var(--text)]">{section.heading}</h2>
              <div className="mt-4 space-y-4 text-[15px] leading-8 text-[var(--text-muted)]">
                {section.paragraphs.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
              </div>
              {section.bullets ? (
                <ul className="mt-4 list-disc space-y-2 pl-5 text-[15px] leading-7 text-[var(--text-muted)]">
                  {section.bullets.map((bullet) => <li key={bullet}>{bullet}</li>)}
                </ul>
              ) : null}
            </section>
          ))}
          {footer}
        </article>
      </main>
      <Footer />
    </div>
  );
}
