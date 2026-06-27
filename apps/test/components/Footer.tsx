"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export function Footer() {
  const pathname = usePathname();
  const locale = pathname.startsWith("/zh") ? "zh" : "en";
  const mainSiteUrl = process.env.NEXT_PUBLIC_MAIN_SITE_URL ?? "https://madabase.com";
  const copy = {
    en: {
      description: "Interactive tests for personality, career, relationships, and self-discovery.",
      tests: "All tests",
      tools: "Madabase tools",
    },
    zh: {
      description: "面向人格、职业、关系与自我探索的互动测试。",
      tests: "全部测试",
      tools: "Madabase 工具",
    },
  }[locale];

  return (
    <footer className="border-t border-[var(--border)] bg-white/60">
      <div className="mx-auto flex max-w-6xl flex-col justify-between gap-6 px-4 py-8 text-sm text-[var(--text-muted)] sm:px-6 md:flex-row lg:px-8">
        <div>
          <p className="font-semibold text-[var(--text)]">Madabase Tests</p>
          <p className="mt-2 leading-6">{copy.description}</p>
        </div>
        <div className="flex flex-wrap items-center gap-5">
          <Link href={`/${locale}`}>{copy.tests}</Link>
          <a href={`${mainSiteUrl}/${locale}/tools`}>{copy.tools}</a>
          <span>© 2026 Madabase</span>
        </div>
      </div>
    </footer>
  );
}
