"use client";
import { useMemo, useState } from "react";
import type { Locale } from "@/lib/i18n";
import { fireAndForgetToolExecution } from "@/lib/tool-usage-client";
import { CopyButton, ResetButton, StatusMessage, ToolButton, ToolPanel, ToolTextarea } from "./ToolPrimitives";

const sample = '{\n  "status": "ok",\n  "count": 3\n}';

export function JsonValidator({ locale = "en" }: { locale?: Locale }) {
  const [input, setInput] = useState(sample);
  const [validated, setValidated] = useState(false);
  const copy = {
    input: locale === "zh" ? "JSON 输入" : "JSON input",
    validate: locale === "zh" ? "校验 JSON" : "Validate JSON",
    reset: locale === "zh" ? "重置" : "Reset",
    valid: locale === "zh" ? "JSON 有效。" : "Valid JSON.",
    invalid: locale === "zh" ? "JSON 无效。" : "Invalid JSON.",
    idle: locale === "zh" ? "粘贴 JSON 后点击校验。" : "Paste JSON and run validation.",
  };

  const result = useMemo(() => {
    try {
      const parsed = JSON.parse(input) as unknown;
      const type = Array.isArray(parsed) ? "array" : parsed === null ? "null" : typeof parsed;
      const topLevel = Array.isArray(parsed)
        ? `${parsed.length} ${locale === "zh" ? "项" : "items"}`
        : parsed && typeof parsed === "object"
          ? `${Object.keys(parsed).length} ${locale === "zh" ? "个顶层键" : "top-level keys"}`
          : locale === "zh" ? "标量值" : "scalar value";
      const formatted = JSON.stringify(parsed, null, 2);
      const summary = locale === "zh"
        ? [`类型：${type}`, `结构：${topLevel}`, `字符数：${input.length}`, `字节数：${new TextEncoder().encode(input).length}`].join("\n")
        : [`Type: ${type}`, `Shape: ${topLevel}`, `Characters: ${input.length}`, `Bytes: ${new TextEncoder().encode(input).length}`].join("\n");
      return { message: copy.valid, tone: "success" as const, summary, formatted };
    } catch (error) {
      return { message: error instanceof Error ? error.message : copy.invalid, tone: "error" as const, summary: "", formatted: "" };
    }
  }, [copy.invalid, copy.valid, input, locale]);

  return (
    <ToolPanel>
      <div className="space-y-4">
        <ToolTextarea label={copy.input} value={input} onChange={(value) => { setInput(value); setValidated(false); }} rows={12} />
        <div className="flex flex-wrap gap-2">
          <ToolButton onClick={() => { setValidated(true); fireAndForgetToolExecution("json-validator"); }}>{copy.validate}</ToolButton>
          <ResetButton label={copy.reset} onClick={() => { setInput(sample); setValidated(false); }} />
        </div>
        <StatusMessage message={validated ? result.message : copy.idle} tone={validated ? result.tone : "neutral"} />
        {validated && result.tone === "success" ? (
          <div className="grid gap-4 lg:grid-cols-[0.8fr_1.2fr]">
            <div className="space-y-3 rounded-md border border-[var(--border)] bg-white p-4">
              <p className="code-font text-xs font-semibold uppercase tracking-[0.14em] text-[var(--text-soft)]">{locale === "zh" ? "摘要" : "Summary"}</p>
              <pre className="code-font whitespace-pre-wrap text-sm leading-6 text-[var(--text)]">{result.summary}</pre>
              <CopyButton value={result.summary} />
            </div>
            <div className="space-y-3">
              <ToolTextarea label={locale === "zh" ? "格式化预览" : "Formatted preview"} value={result.formatted} readOnly rows={8} />
              <CopyButton value={result.formatted} />
            </div>
          </div>
        ) : null}
      </div>
    </ToolPanel>
  );
}
