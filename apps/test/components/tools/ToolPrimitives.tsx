"use client";

import { Clipboard, RotateCcw } from "lucide-react";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

export type ToolHistoryItem = {
  input: string;
  output: string;
  createdAt: string;
};

export function useToolHistory(storageKey: string, limit = 5) {
  const [items, setItems] = useState<ToolHistoryItem[]>([]);

  useEffect(() => {
    try {
      const parsed = JSON.parse(window.localStorage.getItem(storageKey) ?? "[]") as ToolHistoryItem[];
      setItems(Array.isArray(parsed) ? parsed.slice(0, limit) : []);
    } catch {
      setItems([]);
    }
  }, [limit, storageKey]);

  function remember(input: string, output: string) {
    if (!input.trim() && !output.trim()) return;
    setItems((current) => {
      const next = [{ input, output, createdAt: new Date().toISOString() }, ...current.filter((item) => item.input !== input || item.output !== output)].slice(0, limit);
      window.localStorage.setItem(storageKey, JSON.stringify(next));
      return next;
    });
  }

  function clear() {
    window.localStorage.removeItem(storageKey);
    setItems([]);
  }

  return { items, remember, clear };
}

export function downloadText(filename: string, value: string) {
  if (!value) return;
  const blob = new Blob([value], { type: "text/plain;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  link.click();
  URL.revokeObjectURL(url);
}

export function ToolPanel({ children, label = "local browser tool" }: { children: React.ReactNode; label?: string }) {
  const pathname = usePathname();
  const displayLabel = label === "local browser tool" && pathname.startsWith("/zh/") ? "本地浏览器工具" : label;

  return (
    <div className="overflow-hidden rounded-md border border-[var(--border-strong)] bg-white shadow-[var(--shadow-soft)]">
      <div className="flex items-center justify-between border-b border-[var(--border)] bg-[var(--surface-code)] px-4 py-2.5">
        <div className="flex gap-1.5">
          <span className="h-2.5 w-2.5 rounded-full bg-[#ef4444]" />
          <span className="h-2.5 w-2.5 rounded-full bg-[#f59e0b]" />
          <span className="h-2.5 w-2.5 rounded-full bg-[#10b981]" />
        </div>
        <span className="text-[11px] font-semibold text-[#cbd8d2]">{displayLabel}</span>
      </div>
      <div className="workbench-grid bg-[var(--surface-muted)] p-3 sm:p-4">{children}</div>
    </div>
  );
}

export function ToolTextarea({
  label,
  value,
  onChange,
  placeholder,
  readOnly = false,
  rows = 10,
}: {
  label: string;
  value: string;
  onChange?: (value: string) => void;
  placeholder?: string;
  readOnly?: boolean;
  rows?: number;
}) {
  return (
    <label className="block">
      <span className="code-font text-xs font-semibold uppercase tracking-[0.14em] text-[var(--text-soft)]">{label}</span>
      <textarea
        value={value}
        onChange={(event) => onChange?.(event.target.value)}
        placeholder={placeholder}
        readOnly={readOnly}
        rows={rows}
        className="code-font mt-2 w-full resize-y rounded-md border border-[var(--border)] bg-white px-3 py-3 text-sm leading-6 text-[var(--text)] outline-none transition placeholder:text-[var(--text-soft)] focus:border-[var(--brand)] focus:ring-2 focus:ring-[rgba(15,118,110,0.13)]"
      />
    </label>
  );
}

export function ToolInput({
  label,
  value,
  onChange,
  placeholder,
  readOnly = false,
  type = "text",
}: {
  label: string;
  value: string;
  onChange?: (value: string) => void;
  placeholder?: string;
  readOnly?: boolean;
  type?: "text" | "number" | "time" | "datetime-local";
}) {
  return (
    <label className="block">
      <span className="code-font text-xs font-semibold uppercase tracking-[0.14em] text-[var(--text-soft)]">{label}</span>
      <input
        type={type}
        value={value}
        onChange={(event) => onChange?.(event.target.value)}
        placeholder={placeholder}
        readOnly={readOnly}
        className="code-font mt-2 h-11 w-full rounded-md border border-[var(--border)] bg-white px-3 text-sm text-[var(--text)] outline-none transition placeholder:text-[var(--text-soft)] focus:border-[var(--brand)] focus:ring-2 focus:ring-[rgba(15,118,110,0.13)]"
      />
    </label>
  );
}

export function ToolButton({
  children,
  onClick,
  variant = "primary",
}: {
  children: React.ReactNode;
  onClick: () => void;
  variant?: "primary" | "secondary";
}) {
  const classes =
    variant === "primary"
      ? "bg-[var(--surface-code)] text-white hover:bg-[var(--brand-strong)]"
      : "border border-[var(--border)] bg-white text-[var(--text)] hover:border-[var(--brand)] hover:bg-[var(--brand-soft)]";

  return (
    <button type="button" onClick={onClick} className={`inline-flex h-10 items-center justify-center rounded-md px-4 text-sm font-semibold shadow-sm transition ${classes}`}>
      {children}
    </button>
  );
}

export function StatusMessage({ message, tone = "neutral" }: { message: string; tone?: "neutral" | "success" | "error" }) {
  const toneClass = {
    neutral: "border-[var(--border)] bg-white text-[var(--text-muted)]",
    success: "border-[rgba(5,150,105,0.25)] bg-[rgba(5,150,105,0.08)] text-[var(--success)]",
    error: "border-rose-200 bg-rose-50 text-rose-700",
  }[tone];

  if (!message) return null;

  return <div className={`rounded-md border px-3 py-2 text-sm font-medium ${toneClass}`}>{message}</div>;
}

export function CopyButton({ value, label, copiedLabel }: { value: string; label?: string; copiedLabel?: string }) {
  const [copied, setCopied] = useState(false);
  const pathname = usePathname();
  const isZh = pathname.startsWith("/zh/");
  const displayLabel = label ?? (isZh ? "复制" : "Copy");
  const displayCopiedLabel = copiedLabel ?? (isZh ? "已复制" : "Copied");

  async function copy() {
    if (!value) return;
    await navigator.clipboard.writeText(value);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1200);
  }

  return (
    <button
      type="button"
      onClick={copy}
      className="inline-flex h-10 items-center gap-2 rounded-md border border-[var(--border)] bg-white px-3 text-sm font-semibold text-[var(--text)] shadow-sm transition hover:border-[var(--brand)] hover:bg-[var(--brand-soft)]"
      title={displayLabel}
    >
      <Clipboard className="h-4 w-4" aria-hidden="true" />
      {copied ? displayCopiedLabel : displayLabel}
    </button>
  );
}

export function ResetButton({ onClick, label }: { onClick: () => void; label?: string }) {
  const pathname = usePathname();
  const displayLabel = label ?? (pathname.startsWith("/zh/") ? "重置" : "Reset");
  return (
    <button
      type="button"
      onClick={onClick}
      className="inline-flex h-10 items-center gap-2 rounded-md border border-[var(--border)] bg-white px-3 text-sm font-semibold text-[var(--text)] shadow-sm transition hover:border-[var(--brand)] hover:bg-[var(--brand-soft)]"
      title={displayLabel}
    >
      <RotateCcw className="h-4 w-4" aria-hidden="true" />
      {displayLabel}
    </button>
  );
}

export function ToolHistory({
  items,
  onUse,
  onClear,
  locale = "en",
}: {
  items: ToolHistoryItem[];
  onUse: (item: ToolHistoryItem) => void;
  onClear: () => void;
  locale?: "en" | "zh";
}) {
  if (items.length === 0) return null;
  return (
    <div className="rounded-md border border-[var(--border)] bg-white p-3">
      <div className="flex items-center justify-between gap-3">
        <p className="code-font text-xs font-semibold uppercase tracking-[0.14em] text-[var(--text-soft)]">{locale === "zh" ? "历史记录" : "History"}</p>
        <button type="button" onClick={onClear} className="text-xs font-semibold text-[var(--text-muted)] transition hover:text-[var(--brand)]">
          {locale === "zh" ? "清空" : "Clear"}
        </button>
      </div>
      <div className="mt-2 flex flex-wrap gap-2">
        {items.map((item) => (
          <button
            key={`${item.createdAt}-${item.input.slice(0, 24)}`}
            type="button"
            onClick={() => onUse(item)}
            className="max-w-full truncate rounded-md border border-[var(--border)] bg-[var(--surface-muted)] px-2.5 py-1.5 text-xs font-semibold text-[var(--text)] transition hover:border-[var(--brand)] hover:bg-[var(--brand-soft)]"
            title={item.input}
          >
            {item.input.trim().slice(0, 42) || (locale === "zh" ? "空输入" : "Empty input")}
          </button>
        ))}
      </div>
    </div>
  );
}
