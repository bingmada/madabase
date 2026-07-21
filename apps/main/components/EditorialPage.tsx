import Link from "next/link";

export type EditorialSection = {
  heading: string;
  paragraphs: string[];
  bullets?: string[];
};

export function EditorialPage({
  eyebrow,
  title,
  lede,
  sections,
}: {
  eyebrow: string;
  title: string;
  lede: string;
  sections: EditorialSection[];
}) {
  return (
    <main>
      <section className="page-intro">
        <div className="shell narrow">
          <p className="eyebrow">{eyebrow}</p>
          <h1>{title}</h1>
          <p className="lede">{lede}</p>
        </div>
      </section>
      <div className="shell editorial-layout">
        <article className="prose">
          {sections.map((section) => (
            <section key={section.heading}>
              <h2>{section.heading}</h2>
              {section.paragraphs.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
              {section.bullets ? <ul>{section.bullets.map((item) => <li key={item}>{item}</li>)}</ul> : null}
            </section>
          ))}
        </article>
        <aside className="editorial-aside">
          <p className="eyebrow">Madabase standards</p>
          <p>Our recommendations separate verified facts, research synthesis, and hands-on evidence.</p>
          <Link className="text-link" href="/methodology">Read our methodology</Link>
          <Link className="text-link" href="/affiliate-disclosure">Affiliate disclosure</Link>
          <Link className="text-link" href="/contact">Report a correction</Link>
        </aside>
      </div>
    </main>
  );
}
