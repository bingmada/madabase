import { ArrowRight, Layers3, ListChecks, PackageOpen } from "lucide-react";
import Link from "next/link";
import { JsonLd } from "@/components/JsonLd";
import { Disclosure } from "@/components/LayoutParts";
import { costumeHalloweenIdeas } from "@/lib/costume-halloween-ideas";
import { breadcrumbSchema, itemListSchema, pageMetadata } from "@/lib/seo";
import { getCurrentSite } from "@/lib/sites";
import { notFound } from "next/navigation";

export async function generateMetadata() {
  const site = await getCurrentSite();
  if (site.key !== "costume") return {};

  return pageMetadata(
    site,
    "/halloween-ideas",
    "Halloween Costume Ideas, Scene Recipes, and Editorial Kits",
    "Build a coherent clown carnival, zombie graveyard, or witch apothecary with original stories, separately sold products, setup steps, and safety checks.",
    "/images/affiliate/hero-halloween-costume-studio-v1.webp",
  );
}

export default async function HalloweenIdeasPage() {
  const site = await getCurrentSite();
  if (site.key !== "costume") notFound();

  return (
    <main>
      <JsonLd data={breadcrumbSchema(site, [
        { name: "Home", path: "/" },
        { name: "Halloween ideas", path: "/halloween-ideas" },
      ])} />
      <JsonLd data={itemListSchema(
        site,
        "Halloween costume ideas and scene recipes",
        costumeHalloweenIdeas.map((idea) => ({ name: idea.title, path: `/halloween-ideas/${idea.slug}` })),
      )} />

      <section className="section bg-[#170f20] text-white">
        <div className="shell">
          <p className="text-xs font-black uppercase tracking-[0.16em] text-[#ffc56d]">Stories, looks, and scene recipes</p>
          <h1 className="mt-4 max-w-4xl text-4xl font-black leading-tight text-white sm:text-6xl">Halloween costume ideas that build one readable story</h1>
          <p className="mt-5 max-w-3xl text-lg leading-8 text-white/80">
            Each editorial kit starts with a character and a setting, then assigns every costume, mask, light, or moving prop a specific job. Products are sold separately; the story and setup plan are the bundle.
          </p>
          <p className="mt-5 text-sm font-semibold text-white/60">Editorial recipes reviewed August 6, 2026</p>
        </div>
      </section>

      <section className="section bg-white">
        <div className="shell grid gap-5 md:grid-cols-3">
          {[
            { icon: Layers3, title: "One focal character", body: "A host, shopkeeper, or newly risen zombie gives the scene a point of view before you add equipment." },
            { icon: PackageOpen, title: "Separately sold layers", body: "Every exact product keeps its own retailer page, availability, shipping, included pieces, and return terms." },
            { icon: ListChecks, title: "A real build order", body: "Fit, route, power, weather, visibility, supervision, cleanup, and storage are part of the recommendation." },
          ].map((item) => (
            <article className="panel p-5" key={item.title}>
              <item.icon aria-hidden="true" className="text-[var(--brand)]" size={23} />
              <h2 className="mt-4 text-xl font-bold">{item.title}</h2>
              <p className="mt-3 leading-7 text-[var(--muted)]">{item.body}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="section">
        <div className="shell">
          <div className="max-w-3xl">
            <p className="eyebrow">Choose the story first</p>
            <h2 className="mt-3 text-3xl font-black sm:text-4xl">Three distinct Halloween jobs—not three keyword variations.</h2>
          </div>
          <div className="mt-8 grid gap-6 lg:grid-cols-3">
            {costumeHalloweenIdeas.map((idea, index) => (
              <Link className="panel flex h-full flex-col p-6 transition hover:-translate-y-0.5 hover:shadow-[var(--shadow)]" href={`/halloween-ideas/${idea.slug}`} key={idea.slug}>
                <p className="eyebrow">Recipe {index + 1} · {idea.eyebrow}</p>
                <h2 className="mt-3 text-2xl font-black">{idea.title}</h2>
                <p className="mt-4 flex-1 leading-7 text-[var(--muted)]">{idea.dek}</p>
                <span className="mt-6 inline-flex items-center gap-2 text-sm font-bold text-[var(--brand-strong)]">
                  Open the complete recipe <ArrowRight aria-hidden="true" size={16} />
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="section bg-white">
        <div className="shell grid gap-6 lg:grid-cols-[1fr_.72fr]">
          <article className="panel p-6">
            <p className="eyebrow">How to use these kits</p>
            <h2 className="mt-3 text-2xl font-bold">Start with the smallest complete version.</h2>
            <p className="mt-3 leading-8 text-[var(--muted)]">
              Fit the focal costume first, make inexpensive story props from materials already available, and add powered or moving products only when the route, venue, setup time, supervision, and storage can support them.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Link className="button-primary" href="/halloween">Open the Halloween planning hub</Link>
              <Link className="button-secondary" href="/catalog?occasion=halloween">Filter Halloween products</Link>
            </div>
          </article>
          <Disclosure site={site} />
        </div>
      </section>
    </main>
  );
}
