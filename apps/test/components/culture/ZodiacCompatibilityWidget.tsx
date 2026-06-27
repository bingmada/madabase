"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import type { Locale } from "@/lib/i18n";
import { getZodiacCompatibility, type ZodiacSignSlug, zodiacSigns } from "@/lib/zodiac-culture";

export function ZodiacCompatibilityWidget({ locale, initialFirst = "leo", initialSecond = "aquarius" }: { locale: Locale; initialFirst?: ZodiacSignSlug; initialSecond?: ZodiacSignSlug }) {
  const [first, setFirst] = useState<ZodiacSignSlug>(initialFirst);
  const [second, setSecond] = useState<ZodiacSignSlug>(initialSecond);
  const result = useMemo(() => getZodiacCompatibility(first, second, locale), [first, second, locale]);
  const toolHref = `/${locale}/tools/zodiac-compatibility`;

  return (
    <section className="rounded-md border border-[var(--border-strong)] bg-white p-5 shadow-[var(--shadow-soft)]">
      <div className="grid gap-4 md:grid-cols-[1fr_auto_1fr] md:items-end">
        <label className="block">
          <span className="text-xs font-semibold uppercase tracking-[0.14em] text-[var(--text-soft)]">{locale === "en" ? "First sign" : "第一个星座"}</span>
          <select value={first} onChange={(event) => setFirst(event.target.value as ZodiacSignSlug)} className="mt-2 h-11 w-full rounded-md border border-[var(--border)] bg-white px-3 text-sm font-semibold text-[var(--text)] outline-none transition focus:border-[var(--brand)] focus:ring-2 focus:ring-[rgba(15,118,110,0.13)]">
            {zodiacSigns.map((sign) => (
              <option key={sign.slug} value={sign.slug}>{sign.name[locale]}</option>
            ))}
          </select>
        </label>
        <div className="hidden pb-3 text-center text-sm font-bold text-[var(--brand-strong)] md:block">+</div>
        <label className="block">
          <span className="text-xs font-semibold uppercase tracking-[0.14em] text-[var(--text-soft)]">{locale === "en" ? "Second sign" : "第二个星座"}</span>
          <select value={second} onChange={(event) => setSecond(event.target.value as ZodiacSignSlug)} className="mt-2 h-11 w-full rounded-md border border-[var(--border)] bg-white px-3 text-sm font-semibold text-[var(--text)] outline-none transition focus:border-[var(--brand)] focus:ring-2 focus:ring-[rgba(15,118,110,0.13)]">
            {zodiacSigns.map((sign) => (
              <option key={sign.slug} value={sign.slug}>{sign.name[locale]}</option>
            ))}
          </select>
        </label>
      </div>

      <div className="mt-5 grid gap-4 lg:grid-cols-[0.7fr_1.3fr]">
        <div className="rounded-md border border-[var(--border)] bg-[var(--surface-muted)] p-5 text-center">
          <p className="text-sm font-semibold text-[var(--text-muted)]">{result.first.name[locale]} + {result.second.name[locale]}</p>
          <p className="mt-2 text-5xl font-black text-[var(--brand-strong)]">{result.score}%</p>
          <p className="mt-2 text-sm font-bold text-[var(--text)]">{result.tone}</p>
        </div>
        <div className="space-y-3">
          <div>
            <h3 className="text-sm font-bold text-[var(--text)]">{locale === "en" ? "Attraction" : "吸引点"}</h3>
            <p className="mt-1 text-sm leading-6 text-[var(--text-muted)]">{result.attraction}</p>
          </div>
          <div>
            <h3 className="text-sm font-bold text-[var(--text)]">{locale === "en" ? "Friction" : "冲突点"}</h3>
            <p className="mt-1 text-sm leading-6 text-[var(--text-muted)]">{result.friction}</p>
          </div>
          <div>
            <h3 className="text-sm font-bold text-[var(--text)]">{locale === "en" ? "Advice" : "相处建议"}</h3>
            <p className="mt-1 text-sm leading-6 text-[var(--text-muted)]">{result.advice}</p>
          </div>
        </div>
      </div>

      <Link href={toolHref} className="mt-5 inline-flex h-11 items-center rounded-md bg-[var(--surface-code)] px-4 text-sm font-semibold text-white shadow-sm transition hover:bg-[var(--brand-strong)]">
        {locale === "en" ? "Zodiac compatibility tool" : "星座配对工具"}
      </Link>
    </section>
  );
}
