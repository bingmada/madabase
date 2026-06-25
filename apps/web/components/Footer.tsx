"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export function Footer() {
  const pathname = usePathname();
  const locale = pathname.startsWith("/zh") ? "zh" : "en";
  const copy = {
    en: {
      description: "Online tools, practical SEO content, and useful workflows for developers and creators.",
      platform: "Platform",
      tools: "Tools",
      blog: "Blog",
      contact: "Contact",
    },
    zh: {
      description: "在线工具、实用 SEO 内容，以及面向开发者和创作者的高效工作流。",
      platform: "平台",
      tools: "工具",
      blog: "博客",
      contact: "联系我们",
    },
  }[locale];

  return (
    <footer className="border-t border-[var(--border)] bg-white/60">
      <div className="mx-auto grid max-w-6xl gap-6 px-4 py-8 text-sm text-[var(--text-muted)] sm:px-6 lg:px-8 md:grid-cols-[1.2fr_0.8fr_0.8fr]">
        <div>
          <p className="font-semibold text-[var(--text)]">Madabase</p>
          <p className="mt-2 leading-6">{copy.description}</p>
        </div>
        <div>
          <p className="font-semibold text-[var(--text)]">{copy.platform}</p>
          <div className="mt-2 flex flex-col gap-2">
            <Link href={`/${locale}/tools`}>{copy.tools}</Link>
            <Link href={`/${locale}/blog`}>{copy.blog}</Link>
            <Link href={`/${locale}/contact`}>{copy.contact}</Link>
          </div>
        </div>
        <div className="flex flex-col justify-between gap-2">
          <span>© 2026 Madabase</span>
          <a className="text-sm font-semibold text-[var(--brand-strong)]" href="mailto:bingmada003@gmail.com">bingmada003@gmail.com</a>
        </div>
      </div>
    </footer>
  );
}
