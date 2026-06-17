"use client";

import { useState } from "react";
import type { Locale } from "@/lib/i18n";
import { fireAndForgetToolExecution } from "@/lib/tool-usage-client";
import { ResetButton, StatusMessage, ToolButton, ToolPanel, ToolTextarea } from "./ToolPrimitives";

const sample = `# Madabase

Online developer tools today.

- JSON Formatter
- JWT Decoder
- Markdown Preview

\`\`\`ts
type Tool = "useful";
\`\`\`
`;

function renderInline(text: string) {
  const parts = text.split(/(\*\*[^*]+\*\*|`[^`]+`|\[[^\]]+\]\([^)]+\))/g);
  return parts.map((part, index) => {
    if (part.startsWith("**") && part.endsWith("**")) return <strong key={index}>{part.slice(2, -2)}</strong>;
    if (part.startsWith("`") && part.endsWith("`")) return <code key={index} className="code-font rounded bg-[var(--surface-muted)] px-1 py-0.5 text-sm">{part.slice(1, -1)}</code>;
    const link = part.match(/^\[([^\]]+)\]\(([^)]+)\)$/);
    if (link) return <a key={index} href={link[2]} className="text-[var(--brand-strong)] underline">{link[1]}</a>;
    return <span key={index}>{part}</span>;
  });
}

function MarkdownContent({ value }: { value: string }) {
  const blocks = value.split(/\n{2,}/);
  let codeMode = false;

  return (
    <div className="space-y-4">
      {blocks.map((block, index) => {
        if (block.startsWith("```")) {
          codeMode = !codeMode;
          const code = block.replace(/^```\w*\n?/, "").replace(/```$/, "");
          return <pre key={index} className="code-font overflow-auto rounded-md bg-[var(--surface-code)] p-4 text-sm text-[#dbe4df]"><code>{code}</code></pre>;
        }
        if (codeMode) return <pre key={index} className="code-font overflow-auto rounded-md bg-[var(--surface-code)] p-4 text-sm text-[#dbe4df]"><code>{block}</code></pre>;
        if (block.startsWith("# ")) return <h1 key={index} className="text-3xl font-black text-[var(--text)]">{renderInline(block.slice(2))}</h1>;
        if (block.startsWith("## ")) return <h2 key={index} className="text-2xl font-bold text-[var(--text)]">{renderInline(block.slice(3))}</h2>;
        if (block.startsWith("> ")) return <blockquote key={index} className="border-l-4 border-[var(--brand)] pl-4 text-[var(--text-muted)]">{renderInline(block.slice(2))}</blockquote>;
        if (block.split("\n").every((line) => line.startsWith("- "))) {
          return (
            <ul key={index} className="list-disc space-y-1 pl-5 text-[var(--text-muted)]">
              {block.split("\n").map((line) => <li key={line}>{renderInline(line.slice(2))}</li>)}
            </ul>
          );
        }
        return <p key={index} className="leading-7 text-[var(--text-muted)]">{renderInline(block)}</p>;
      })}
    </div>
  );
}

export function MarkdownPreview({ locale = "en" }: { locale?: Locale }) {
  const [input, setInput] = useState(sample);
  const [previewInput, setPreviewInput] = useState(sample);
  const [message, setMessage] = useState(locale === "zh" ? "编辑 Markdown 后点击预览。" : "Edit markdown and click preview.");
  const [tone, setTone] = useState<"neutral" | "success" | "error">("neutral");
  const copy = {
    preview: locale === "zh" ? "预览 Markdown" : "Preview Markdown",
    reset: locale === "zh" ? "重置" : "Reset",
    idle: locale === "zh" ? "编辑 Markdown 后点击预览。" : "Edit markdown and click preview.",
    updated: locale === "zh" ? "预览已更新。" : "Preview updated.",
    input: locale === "zh" ? "Markdown 输入" : "Markdown",
    output: locale === "zh" ? "预览结果" : "Preview",
  };

  function preview() {
    setPreviewInput(input);
    setMessage(copy.updated);
    setTone("success");
    fireAndForgetToolExecution("markdown-preview");
  }

  return (
    <ToolPanel>
      <div className="space-y-4">
        <div className="flex flex-wrap justify-end gap-2">
          <ToolButton onClick={preview}>{copy.preview}</ToolButton>
          <ResetButton onClick={() => {
            setInput(sample);
            setPreviewInput(sample);
            setMessage(copy.idle);
            setTone("neutral");
          }} label={copy.reset} />
        </div>
        <StatusMessage message={message} tone={tone} />
        <div className="grid gap-4 lg:grid-cols-2">
          <ToolTextarea label={copy.input} value={input} onChange={setInput} rows={16} />
          <section className="rounded-md border border-[var(--border)] bg-white p-4">
            <h2 className="code-font mb-3 text-xs font-semibold uppercase tracking-[0.14em] text-[var(--text-soft)]">{copy.output}</h2>
            <MarkdownContent value={previewInput} />
          </section>
        </div>
      </div>
    </ToolPanel>
  );
}
