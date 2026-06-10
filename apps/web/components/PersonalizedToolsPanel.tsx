import Link from "next/link";
import { getCurrentUser } from "@/lib/auth/services/sessionService";
import { prisma } from "@/lib/db/client";
import type { Locale } from "@/lib/i18n";
import { toolMap } from "@/lib/tools";
import { ToolIcon } from "./ToolIcon";

export async function PersonalizedToolsPanel({ locale }: { locale: Locale }) {
  const user = await getCurrentUser();
  if (!user) return null;

  const [recentUsage, favorites] = await Promise.all([
    prisma.toolUsage.findMany({
      where: { userId: user.id },
      orderBy: { lastUsedAt: "desc" },
      take: 4,
    }),
    prisma.favorite.findMany({
      where: { userId: user.id },
      orderBy: { createdAt: "desc" },
      take: 4,
    }),
  ]);

  if (recentUsage.length === 0 && favorites.length === 0) {
    return null;
  }

  const copy = {
    en: {
      eyebrow: "Personalized",
      title: "Pick up where you left off",
      recent: "Recently used",
      favorites: "Saved favorites",
      count: "uses",
      viewAllFavorites: "View all favorites",
      profile: "Open profile",
    },
    zh: {
      eyebrow: "个性化",
      title: "继续你上次的工作流",
      recent: "最近使用",
      favorites: "已收藏工具",
      count: "次使用",
      viewAllFavorites: "查看全部收藏",
      profile: "打开个人中心",
    },
  }[locale];

  return (
    <section className="mt-14 surface-card p-5 sm:p-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="eyebrow">{copy.eyebrow}</p>
          <h2 className="mt-3 text-2xl font-bold text-[var(--text)]">{copy.title}</h2>
        </div>
        <Link href={`/${locale}/profile`} className="text-sm font-semibold text-[var(--brand-strong)]">
          {copy.profile}
        </Link>
      </div>

      <div className="mt-6 grid gap-5 lg:grid-cols-2">
        <section className="rounded-md border border-[var(--border)] bg-white p-4">
          <div className="flex items-center justify-between gap-3">
            <h3 className="text-lg font-semibold text-[var(--text)]">{copy.recent}</h3>
          </div>
          <div className="mt-4 space-y-3">
            {recentUsage.length > 0 ? recentUsage.map((item) => {
              const tool = toolMap.get(item.toolSlug);
              if (!tool) return null;
              return (
                <Link
                  key={item.id}
                  href={`/${locale}/tools/${item.toolSlug}`}
                  className="group flex items-start gap-3 rounded-md border border-[var(--border)] bg-[var(--surface-muted)] p-3 transition hover:border-[var(--brand)] hover:bg-[var(--brand-soft)]"
                >
                  <span className="grid h-10 w-10 shrink-0 place-items-center rounded-md border border-[var(--border)] bg-white text-[var(--brand-strong)] transition group-hover:bg-white">
                    <ToolIcon component={tool.component} className="h-5 w-5" />
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-semibold text-[var(--text)]">{tool.h1[locale]}</p>
                    <p className="mt-1 text-xs text-[var(--text-soft)]">{item.count} {copy.count}</p>
                  </div>
                </Link>
              );
            }) : null}
          </div>
        </section>

        <section className="rounded-md border border-[var(--border)] bg-white p-4">
          <div className="flex items-center justify-between gap-3">
            <h3 className="text-lg font-semibold text-[var(--text)]">{copy.favorites}</h3>
            <Link href={`/${locale}/favorites`} className="text-sm font-semibold text-[var(--brand-strong)]">
              {copy.viewAllFavorites}
            </Link>
          </div>
          <div className="mt-4 space-y-3">
            {favorites.length > 0 ? favorites.map((favorite) => {
              const tool = toolMap.get(favorite.toolSlug);
              if (!tool) return null;
              return (
                <Link
                  key={favorite.id}
                  href={`/${locale}/tools/${favorite.toolSlug}`}
                  className="group flex items-start gap-3 rounded-md border border-[var(--border)] bg-[var(--surface-muted)] p-3 transition hover:border-[var(--brand)] hover:bg-[var(--brand-soft)]"
                >
                  <span className="grid h-10 w-10 shrink-0 place-items-center rounded-md border border-[var(--border)] bg-white text-[var(--brand-strong)] transition group-hover:bg-white">
                    <ToolIcon component={tool.component} className="h-5 w-5" />
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-semibold text-[var(--text)]">{tool.h1[locale]}</p>
                    <p className="mt-1 text-xs text-[var(--text-soft)]">{favorite.toolSlug}</p>
                  </div>
                </Link>
              );
            }) : null}
          </div>
        </section>
      </div>
    </section>
  );
}
