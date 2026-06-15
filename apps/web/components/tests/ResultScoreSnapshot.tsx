"use client";

import { useEffect, useMemo, useState } from "react";
import type { Locale } from "@/lib/i18n";

type StoredResult = {
  type: string;
  attemptId?: string;
  scores?: Record<string, number>;
};

export function ResultScoreSnapshot({
  locale,
  slug,
  attemptId,
  resultType,
}: {
  locale: Locale;
  slug: string;
  attemptId?: string | null;
  resultType: string;
}) {
  const [stored, setStored] = useState<StoredResult | null>(null);

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(`madabase:test:${slug}:last-result`);
      if (!raw) return;
      const parsed = JSON.parse(raw) as StoredResult;
      if (parsed.type?.toUpperCase() !== resultType.toUpperCase()) return;
      if (attemptId && parsed.attemptId !== attemptId) return;
      setStored(parsed);
    } catch {
      setStored(null);
    }
  }, [attemptId, resultType, slug]);

  const rows = useMemo(() => {
    const scores = stored?.scores ?? {};
    const values = Object.entries(scores).filter(([, value]) => Number.isFinite(value));
    const max = Math.max(...values.map(([, value]) => value), 1);
    return values.sort((a, b) => b[1] - a[1]).slice(0, 8).map(([key, value]) => ({
      key,
      value,
      percent: Math.max(6, Math.round((value / max) * 100)),
    }));
  }, [stored]);

  const copy = {
    en: {
      title: "Dimension snapshot",
      empty: "Dimension scores are shown when this browser has the fresh test result.",
    },
    zh: {
      title: "维度分数快照",
      empty: "当前浏览器保存有本次测评结果时，会展示真实维度分数。",
    },
  }[locale];

  return (
    <section className="rounded-md border border-[var(--border)] bg-white p-5">
      <h3 className="text-xl font-bold text-[var(--text)]">{copy.title}</h3>
      <div className="mt-4 space-y-3">
        {rows.length > 0 ? rows.map((row) => (
          <div key={row.key}>
            <div className="flex items-center justify-between gap-3">
              <span className="code-font text-xs font-bold text-[var(--text)]">{row.key}</span>
              <span className="code-font text-xs text-[var(--text-soft)]">{row.value}</span>
            </div>
            <div className="mt-1 h-2 overflow-hidden rounded-full bg-[var(--surface-muted)]">
              <div className="h-full rounded-full bg-[var(--brand)]" style={{ width: `${row.percent}%` }} />
            </div>
          </div>
        )) : <p className="text-sm leading-6 text-[var(--text-muted)]">{copy.empty}</p>}
      </div>
    </section>
  );
}
