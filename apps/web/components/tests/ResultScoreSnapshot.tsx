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
  scoreMaxes,
  scoreLabels,
  title,
}: {
  locale: Locale;
  slug: string;
  attemptId?: string | null;
  resultType: string;
  scoreMaxes?: Record<string, number>;
  scoreLabels?: Record<string, string>;
  title?: string;
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
    return values.sort((a, b) => b[1] - a[1]).slice(0, 8).map(([key, value]) => ({
      key,
      value,
      max: Math.max(scoreMaxes?.[key] ?? value, 1),
      percent: Math.max(6, Math.min(100, Math.round((value / Math.max(scoreMaxes?.[key] ?? value, 1)) * 100))),
    }));
  }, [scoreMaxes, stored]);

  const copy = {
    en: {
      title: "Dimension snapshot",
      max: "max",
      empty: "Dimension scores are shown when this browser has the fresh test result.",
      labels: {
        E: "Extraversion",
        I: "Introversion",
        S: "Sensing",
        N: "Intuition",
        T: "Thinking",
        F: "Feeling",
        J: "Judging",
        P: "Perceiving",
      },
    },
    zh: {
      title: "维度分数快照",
      max: "满分",
      empty: "当前浏览器保存有本次测评结果时，会展示真实维度分数。",
      labels: {
        E: "外向",
        I: "内向",
        S: "实感",
        N: "直觉",
        T: "思考",
        F: "情感",
        J: "判断",
        P: "知觉",
      },
    },
  }[locale];

  return (
    <section className="rounded-md border border-[var(--border)] bg-white p-5">
      <h3 className="text-xl font-bold text-[var(--text)]">{title ?? copy.title}</h3>
      <div className="mt-4 space-y-3">
        {rows.length > 0 ? rows.map((row) => (
          <div key={row.key}>
            <div className="flex items-center justify-between gap-3">
              <span className="text-xs font-bold text-[var(--text)]">
                {copy.labels[row.key as keyof typeof copy.labels] ?? scoreLabels?.[row.key] ?? row.key}
                <span className="code-font ml-2 text-[var(--text-soft)]">{row.key}</span>
              </span>
              <span className="code-font text-xs text-[var(--text-soft)]">
                {row.value} / {row.max} {copy.max}
              </span>
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
