import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Clock3 } from "lucide-react";
import type { Guide, Publication } from "@/lib/content";
import { TrackedLink } from "./TrackedLink";

export function PageIntro({ eyebrow, title, body }: { eyebrow: string; title: string; body: string }) {
  return (
    <section className="page-intro">
      <div className="shell narrow">
        <p className="eyebrow">{eyebrow}</p>
        <h1>{title}</h1>
        <p className="lede">{body}</p>
      </div>
    </section>
  );
}

export function PublicationCard({ publication, index }: { publication: Publication; index: number }) {
  return (
    <article className="publication-card" style={{ "--publication-accent": publication.accent } as React.CSSProperties}>
      <a className="publication-image" href={publication.domain} aria-label={`Visit ${publication.name}`}>
        <Image alt={`${publication.label} research from ${publication.name}`} fill sizes="(max-width: 760px) 100vw, 50vw" src={publication.image} />
      </a>
      <div className="publication-copy">
        <div className="publication-heading">
          <div>
            <p className="eyebrow">{publication.label}</p>
            <h3>{publication.name}</h3>
          </div>
          <span className="publication-number">0{index + 1}</span>
        </div>
        <p>{publication.description}</p>
        <p className="decision-note">{publication.decision}</p>
        <div className="publication-actions">
          <TrackedLink className="text-link" href={publication.domain} position="publication-card" publication={publication.key}>
            Explore publication <ArrowRight size={16} aria-hidden="true" />
          </TrackedLink>
          <TrackedLink className="featured-link" href={publication.featuredHref} position="publication-featured" publication={publication.key}>
            {publication.featuredTitle}
          </TrackedLink>
        </div>
      </div>
    </article>
  );
}

export function GuideCard({ guide }: { guide: Guide }) {
  return (
    <article className="guide-card">
      <Link className="guide-card-image" href={`/guides/${guide.slug}`}>
        <Image alt="" fill sizes="(max-width: 760px) 100vw, 33vw" src={guide.image} />
      </Link>
      <div>
        <p className="eyebrow">{guide.category}</p>
        <h2><Link href={`/guides/${guide.slug}`}>{guide.title}</Link></h2>
        <p>{guide.dek}</p>
        <div className="guide-meta"><Clock3 size={15} aria-hidden="true" />{guide.readingTime}</div>
      </div>
    </article>
  );
}
