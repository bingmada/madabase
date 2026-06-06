import type { Locale } from "@/lib/i18n";

export function AdSlot({ locale, position }: { locale: Locale; position: "header" | "content" | "footer" }) {
  const labels = {
    en: {
      header: "Header Ad Slot",
      content: "Content Ad Slot",
      footer: "Footer Ad Slot",
      body: "Reserved for future ad network integration.",
    },
    zh: {
      header: "顶部广告位",
      content: "内容广告位",
      footer: "底部广告位",
      body: "预留给未来广告平台接入。",
    },
  }[locale];

  return (
    <div className="my-8 rounded-md border border-dashed border-[var(--border-strong)] bg-[rgba(255,255,255,0.54)] px-4 py-4 text-center text-xs text-[var(--text-soft)]">
      <div className="code-font font-semibold uppercase tracking-[0.16em]">{labels[position]}</div>
      <div className="mt-1">{labels.body}</div>
    </div>
  );
}
