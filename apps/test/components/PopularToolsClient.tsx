"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { getPopularToolsFromEvents } from "@/lib/analytics";
import type { Locale } from "@/lib/i18n";
import { toolMap } from "@/lib/tool-registry";

export function PopularToolsClient({ locale }: { locale: Locale }) {
  const [items, setItems] = useState<Array<{ slug: string; count: number }>>([]);

  useEffect(() => {
    setItems(getPopularToolsFromEvents(6));
    const update = () => setItems(getPopularToolsFromEvents(6));
    window.addEventListener("madabase:analytics", update as EventListener);
    return () => window.removeEventListener("madabase:analytics", update as EventListener);
  }, []);

  if (items.length === 0) return null;

  return (
    <div className="mt-4 flex flex-wrap gap-2">
      {items.map(({ slug, count }) => {
        const tool = toolMap.get(slug);
        if (!tool) return null;
        return (
          <Link
            key={slug}
            href={`/${locale}/tools/${slug}`}
            className="inline-flex items-center gap-2 rounded-full border border-[var(--border)] bg-white px-3 py-1.5 text-sm text-[var(--text)] transition hover:border-[var(--brand)] hover:bg-[var(--brand-soft)]"
          >
            <span>{tool.h1[locale]}</span>
            <span className="code-font text-xs text-[var(--text-soft)]">{count}</span>
          </Link>
        );
      })}
    </div>
  );
}
