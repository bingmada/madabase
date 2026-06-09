import type { Locale } from "@/lib/i18n";

export function AdSlot({
  locale,
  position,
  size = "banner",
}: {
  locale: Locale;
  position: "header" | "content" | "footer" | "sidebar" | "inline";
  size?: "banner" | "square" | "native";
}) {
  const labels = {
    en: {
      header: "Header Ad Slot",
      content: "Content Ad Slot",
      footer: "Footer Ad Slot",
      sidebar: "Sidebar Ad Slot",
      inline: "Inline Ad Slot",
      body: "Reserved for future ad network integration.",
      banner: "Banner",
      square: "Square",
      native: "Native",
    },
    zh: {
      header: "顶部广告位",
      content: "内容广告位",
      footer: "底部广告位",
      sidebar: "侧边广告位",
      inline: "段内广告位",
      body: "预留给未来广告平台接入。",
      banner: "横幅",
      square: "方形",
      native: "原生",
    },
  }[locale];

  const sizeClass = {
    banner: "min-h-24",
    square: "min-h-56",
    native: "min-h-32",
  }[size];

  return (
    <div className={`my-8 rounded-md border border-dashed border-[var(--border-strong)] bg-[rgba(255,255,255,0.54)] px-4 py-4 text-center text-xs text-[var(--text-soft)] ${sizeClass}`}>
      <div className="code-font font-semibold uppercase tracking-[0.16em]">{labels[position]} · {labels[size]}</div>
      <div className="mt-1">{labels.body}</div>
    </div>
  );
}
