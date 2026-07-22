import { CheckCircle2, CircleDollarSign, Link2Off, PackageCheck } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { JsonLd } from "@/components/JsonLd";
import { costumeGuides, findCostumeProduct } from "@/lib/costume-content";
import { breadcrumbSchema, pageMetadata } from "@/lib/seo";
import { getCurrentSite } from "@/lib/sites";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const site = await getCurrentSite();
  const { slug } = await params;
  if (site.key !== "costume") return {};
  const product = findCostumeProduct(slug);
  if (!product) return {};

  return pageMetadata(site, `/products/${slug}`, `${product.name}: Fit and Buying Preview`, product.summary);
}

export default async function CostumeProductPage({ params }: { params: Promise<{ slug: string }> }) {
  const site = await getCurrentSite();
  const { slug } = await params;
  if (site.key !== "costume") notFound();
  const product = findCostumeProduct(slug);
  if (!product) notFound();
  const category = site.categories.find((item) => item.slug === product.category);
  const relatedGuides = costumeGuides.filter((guide) => guide.category === product.category).slice(0, 3);

  return (
    <main className="section">
      <JsonLd data={breadcrumbSchema(site, [
        { name: "Home", path: "/" },
        ...(category ? [{ name: category.name, path: `/categories/${category.slug}` }] : []),
        { name: product.name, path: `/products/${product.slug}` },
      ])} />
      <div className="shell">
        <div className="grid gap-8 lg:grid-cols-[minmax(0,1.35fr)_minmax(300px,.65fr)]">
          <article>
            <p className="eyebrow">{product.typeLabel} · launch candidate</p>
            <h1 className="mt-3 text-4xl font-black leading-tight">{product.name}</h1>
            <p className="mt-5 max-w-3xl text-lg leading-8 text-[var(--muted)]">{product.summary}</p>
            <section className="costume-card-art mt-8 min-h-64 rounded-md p-6 text-white" aria-label="Editorial placeholder; merchant image permission pending">
              <p className="text-xs font-black uppercase tracking-[0.14em] text-white/70">Editorial placeholder</p>
              <p className="mt-24 max-w-xl text-2xl font-black">Official product imagery stays off this preview until CJ feed terms or written authorization cover public use.</p>
            </section>
            <section className="mt-9">
              <p className="eyebrow">The buyer&apos;s job</p>
              <h2 className="mt-3 text-2xl font-bold">What this page must help decide</h2>
              <p className="mt-4 text-lg leading-8 text-[var(--muted)]">{product.buyerJob}</p>
              <div className="mt-6 grid gap-4 sm:grid-cols-2">
                {product.checks.map((check) => (
                  <div className="panel flex gap-3 p-4" key={check}>
                    <CheckCircle2 aria-hidden="true" className="mt-0.5 shrink-0 text-[var(--brand)]" size={19} />
                    <span className="font-semibold leading-6">{check}</span>
                  </div>
                ))}
              </div>
            </section>
            <section className="mt-9 rounded-md border border-[var(--border)] bg-white p-5">
              <h2 className="text-2xl font-bold">Identity and evidence status</h2>
              <dl className="mt-4 divide-y divide-[var(--border)] text-sm">
                <div className="grid gap-2 py-3 sm:grid-cols-[180px_1fr]"><dt className="font-semibold text-[var(--muted)]">Merchant</dt><dd className="font-bold">Abracadabra NYC</dd></div>
                <div className="grid gap-2 py-3 sm:grid-cols-[180px_1fr]"><dt className="font-semibold text-[var(--muted)]">Source status</dt><dd className="font-bold">{product.sourceIdentity}</dd></div>
                <div className="grid gap-2 py-3 sm:grid-cols-[180px_1fr]"><dt className="font-semibold text-[var(--muted)]">Price status</dt><dd className="font-bold">{product.observedPrice ? `${product.observedPrice} previously observed; current feed price pending` : "Current feed price pending"}</dd></div>
                <div className="grid gap-2 py-3 sm:grid-cols-[180px_1fr]"><dt className="font-semibold text-[var(--muted)]">Evidence mode</dt><dd className="font-bold">Editorial decision preview; no hands-on claim</dd></div>
              </dl>
            </section>
          </article>

          <aside className="space-y-5 lg:sticky lg:top-24 lg:self-start">
            <div className="panel p-5">
              <Link2Off aria-hidden="true" className="text-[var(--brand)]" size={22} />
              <h2 className="mt-4 text-xl font-bold">Purchase link intentionally disabled</h2>
              <p className="mt-3 text-sm leading-6 text-[var(--muted)]">Costume PID 101838067 and one sample CJ path are verified. This page gets a live button only after its own feed identity, exact variant, destination, and dormant link record pass together.</p>
            </div>
            <div className="panel p-5">
              <PackageCheck aria-hidden="true" className="text-[var(--brand)]" size={22} />
              <h2 className="mt-4 text-xl font-bold">Catalog launch gates</h2>
              <ul className="mt-3 space-y-3 text-sm leading-6 text-[var(--muted)]">
                <li>Exact feed product and variant identity</li>
                <li>Current price and availability</li>
                <li>Authorized image-use status</li>
                <li>Distinct buyer guidance and internal links</li>
                <li>Verified CJ redirect and local click record</li>
              </ul>
            </div>
            {product.premium || product.professional ? (
              <Link className="costume-premium-panel block p-5" href="/premium">
                <CircleDollarSign aria-hidden="true" className="text-[#f4d79b]" size={22} />
                <h2 className="mt-4 text-xl font-bold text-white">Premium & Professional edit</h2>
                <p className="mt-2 text-sm leading-6 text-white/75">Compare repeat use, construction, alteration, transport, care, and storage before paying more.</p>
              </Link>
            ) : null}
          </aside>
        </div>

        {relatedGuides.length ? (
          <section className="mt-12 border-t border-[var(--border)] pt-10">
            <p className="eyebrow">Related guides</p>
            <h2 className="mt-3 text-3xl font-black">Resolve the surrounding decisions</h2>
            <div className="mt-6 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
              {relatedGuides.map((guide) => (
                <Link className="panel p-5" href={`/guides/${guide.slug}`} key={guide.slug}>
                  <h3 className="text-xl font-bold">{guide.title}</h3>
                  <p className="mt-3 leading-7 text-[var(--muted)]">{guide.dek}</p>
                </Link>
              ))}
            </div>
          </section>
        ) : null}
      </div>
    </main>
  );
}
