"use client";

import Link from "next/link";
import { Search } from "lucide-react";
import { useMemo, useState } from "react";
import type { Locale } from "@/lib/i18n";
import type { SearchItem } from "@/lib/search-index";

export function SearchClient({ locale, items }: { locale: Locale; items: SearchItem[] }) {
  const [query, setQuery] = useState("");
  const normalizedQuery = query.trim().toLowerCase();
  const results = useMemo(() => {
    if (!normalizedQuery) return items.slice(0, 12);
    const terms = normalizedQuery.split(/\s+/).filter(Boolean);
    return items
      .map((item) => {
        const haystack = `${item.title} ${item.description} ${item.keywords}`.toLowerCase();
        const score = terms.reduce((sum, term) => sum + (haystack.includes(term) ? 1 : 0), 0);
        return { item, score };
      })
      .filter(({ score }) => score > 0)
      .sort((a, b) => b.score - a.score)
      .map(({ item }) => item)
      .slice(0, 30);
  }, [items, normalizedQuery]);

  const typeLabel = {
    tool: locale === "zh" ? "工具" : "Tool",
    test: locale === "zh" ? "测试" : "Test",
    blog: locale === "zh" ? "博客" : "Blog",
  };

  return (
    <section className="surface-card-strong p-5 sm:p-7">
      <label className="block">
        <span className="text-xs font-semibold uppercase tracking-[0.14em] text-[var(--text-soft)]">{locale === "zh" ? "搜索关键词" : "Search query"}</span>
        <div className="mt-2 flex items-center gap-2 rounded-md border border-[var(--border)] bg-white px-3 focus-within:border-[var(--brand)] focus-within:ring-2 focus-within:ring-[rgba(15,118,110,0.13)]">
          <Search className="h-4 w-4 text-[var(--text-soft)]" />
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder={locale === "zh" ? "搜索 JSON、BMI、MBTI、星座..." : "Search JSON, BMI, MBTI, zodiac..."}
            className="h-12 min-w-0 flex-1 bg-transparent text-base text-[var(--text)] outline-none placeholder:text-[var(--text-soft)]"
            autoFocus
          />
        </div>
      </label>

      <div className="mt-6 grid gap-4">
        {results.map((item) => (
          <Link key={`${item.type}-${item.href}`} href={item.href} className="rounded-md border border-[var(--border)] bg-white p-4 transition hover:border-[var(--brand)] hover:bg-[var(--brand-soft)]">
            <p className="text-xs font-semibold text-[var(--text-soft)]">{typeLabel[item.type]}</p>
            <h2 className="mt-1 text-lg font-bold text-[var(--text)]">{item.title}</h2>
            <p className="mt-2 text-sm leading-6 text-[var(--text-muted)]">{item.description}</p>
          </Link>
        ))}
        {results.length === 0 ? <p className="rounded-md border border-[var(--border)] bg-white p-4 text-sm text-[var(--text-muted)]">{locale === "zh" ? "没有找到匹配结果。" : "No matching results."}</p> : null}
      </div>
    </section>
  );
}
