import Link from "next/link";
import { ArrowLeft, CheckCircle2 } from "lucide-react";
import type { Guide } from "./site-data";

export function GuidePage({ guide }: { guide: Guide }) {
  const Icon = guide.icon;

  return (
    <main className="guide-page">
      <Link className="back-link" href="/">
        <ArrowLeft size={16} aria-hidden="true" />
        Guides
      </Link>
      <header className="page-hero">
        <span className="icon-chip">
          <Icon size={22} aria-hidden="true" />
        </span>
        <p className="section-label">
          {guide.eyebrow} · {guide.minutes}
        </p>
        <h1>{guide.title}</h1>
        <p>{guide.description}</p>
      </header>
      <div className="guide-body">
        {guide.sections.map((section) => (
          <section className="guide-section" key={section.title}>
            <h2>{section.title}</h2>
            <p>{section.body}</p>
          </section>
        ))}
        <section className="legal-panel">
          <h2>Purchase Checklist</h2>
          <ul className="check-list">
            {guide.checklist.map((item) => (
              <li key={item}>
                <CheckCircle2 size={18} aria-hidden="true" />
                {item}
              </li>
            ))}
          </ul>
        </section>
      </div>
    </main>
  );
}
