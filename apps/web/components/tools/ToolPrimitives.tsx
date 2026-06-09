"use client";

import { Clipboard, RotateCcw } from "lucide-react";
import { useState } from "react";

export function ToolPanel({ children }: { children: React.ReactNode }) {
  return (
    <div className="overflow-hidden rounded-md border border-[var(--border-strong)] bg-white shadow-[var(--shadow-soft)]">
      <div className="flex items-center justify-between border-b border-[var(--border)] bg-[var(--surface-code)] px-4 py-2.5">
        <div className="flex gap-1.5">
          <span className="h-2.5 w-2.5 rounded-full bg-[#ef4444]" />
          <span className="h-2.5 w-2.5 rounded-full bg-[#f59e0b]" />
          <span className="h-2.5 w-2.5 rounded-full bg-[#10b981]" />
        </div>
        <span className="code-font text-[11px] font-semibold uppercase tracking-[0.18em] text-[#cbd8d2]">local browser tool</span>
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
  type?: "text" | "number";
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

export function CopyButton({ value, label = "Copy" }: { value: string; label?: string }) {
  const [copied, setCopied] = useState(false);

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
      title={label}
    >
      <Clipboard className="h-4 w-4" aria-hidden="true" />
      {copied ? "Copied" : label}
    </button>
  );
}

export function ResetButton({ onClick }: { onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="inline-flex h-10 items-center gap-2 rounded-md border border-[var(--border)] bg-white px-3 text-sm font-semibold text-[var(--text)] shadow-sm transition hover:border-[var(--brand)] hover:bg-[var(--brand-soft)]"
      title="Reset"
    >
      <RotateCcw className="h-4 w-4" aria-hidden="true" />
      Reset
    </button>
  );
}
