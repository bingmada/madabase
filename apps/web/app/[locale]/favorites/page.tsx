import Link from "next/link";
import { notFound } from "next/navigation";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { requireUser } from "@/lib/auth/services/sessionService";
import { prisma } from "@/lib/db/client";
import { isLocale, locales } from "@/lib/i18n";
import { buildPageMetadata } from "@/lib/seo";
import { toolMap } from "@/lib/tools";

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) return {};
  return buildPageMetadata({
    title: locale === "en" ? "Favorites" : "收藏",
    description: locale === "en" ? "View your saved favorite tools." : "查看你收藏的工具。",
    locale,
    path: "/favorites",
    keywords: ["madabase favorites"],
  });
}

export default async function FavoritesPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const user = await requireUser(locale);
  const favorites = await prisma.favorite.findMany({ where: { userId: user.id }, orderBy: { createdAt: "desc" } });

  return (
    <div className="min-h-screen bg-transparent">
      <Header locale={locale} pathname="/favorites" />
      <main className="content-shell py-10">
        <section className="surface-card-strong p-6 sm:p-8">
          <p className="eyebrow">{locale === "en" ? "Saved tools" : "已保存工具"}</p>
          <h1 className="mt-4 text-3xl font-black tracking-tight text-[var(--text)]">{locale === "en" ? "My Favorite Tools" : "我的收藏工具"}</h1>
          <div className="mt-6 space-y-3">
            {favorites.length > 0 ? favorites.map((favorite) => {
              const tool = toolMap.get(favorite.toolSlug);
              return (
                <Link
                  key={favorite.id}
                  href={`/${locale}/tools/${favorite.toolSlug}`}
                  className="block rounded-md border border-[var(--border)] bg-white p-4 transition hover:-translate-y-0.5 hover:border-[var(--brand)] hover:shadow-[var(--shadow-soft)]"
                >
                  <p className="text-sm font-semibold text-[var(--text)]">{tool?.h1[locale] ?? favorite.toolSlug}</p>
                  <p className="mt-1 text-xs text-[var(--text-soft)]">{favorite.toolSlug}</p>
                </Link>
              );
            }) : (
              <div className="rounded-md border border-dashed border-[var(--border-strong)] bg-[var(--surface-muted)] p-4 text-sm text-[var(--text-muted)]">
                {locale === "en" ? "No favorites yet. Save tools from any tool page to build your shortlist." : "还没有收藏。你可以在任意工具详情页点击收藏，建立自己的常用清单。"}
              </div>
            )}
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
