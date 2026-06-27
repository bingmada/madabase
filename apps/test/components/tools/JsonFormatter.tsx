"use client";

import { useState } from "react";
import type { Locale } from "@/lib/i18n";
import { recordToolExecution } from "@/lib/limits";
import { formatJson, minifyJson } from "@/lib/tool-transforms";
import { toolCopy } from "@/lib/tool-ui-copy";
import { trackToolExecution } from "@/lib/tool-usage-client";
import { CopyButton, ResetButton, StatusMessage, ToolButton, ToolHistory, ToolPanel, ToolTextarea, downloadText, useToolHistory } from "./ToolPrimitives";

const sample = '{"name":"Madabase","tools":["JSON Formatter","JWT Decoder"],"online":true}';
const nestedSample = '{"user":{"id":1,"name":"Ada"},"events":[{"type":"login","ok":true},{"type":"export","ok":false}],"meta":{"source":"demo"}}';
const invalidSample = '{"name":"Madabase","tools":["JSON Formatter",]}';

export function JsonFormatter({ toolSlug = "json-formatter", locale = "en" }: { toolSlug?: string; locale?: Locale }) {
  const [input, setInput] = useState(sample);
  const [message, setMessage] = useState("");
  const [tone, setTone] = useState<"success" | "error">("success");
  const commonCopy = toolCopy(locale);
  const history = useToolHistory(`madabase:${toolSlug}:history`);
  const copy = {
    input: locale === "zh" ? "JSON 输入" : "JSON input",
    format: locale === "zh" ? "格式化" : "Format",
    minify: locale === "zh" ? "压缩" : "Minify",
    validate: locale === "zh" ? "校验" : "Validate",
    formatted: locale === "zh" ? "JSON 已格式化。" : "JSON formatted successfully.",
    minified: locale === "zh" ? "JSON 已压缩。" : "JSON minified successfully.",
    valid: locale === "zh" ? "JSON 有效。" : "Valid JSON.",
    invalid: locale === "zh" ? "JSON 无效。" : "Invalid JSON.",
    limit: locale === "zh" ? "今日在线使用次数已达上限。" : "Daily online usage limit reached.",
    examples: locale === "zh" ? "示例" : "Examples",
    basic: locale === "zh" ? "基础对象" : "Basic object",
    nested: locale === "zh" ? "嵌套数据" : "Nested data",
    invalidExample: locale === "zh" ? "错误示例" : "Invalid sample",
    download: locale === "zh" ? "下载 JSON" : "Download JSON",
  };

  async function markExecution() {
    const result = recordToolExecution(toolSlug);
    if (!result.allowed) {
      setMessage(result.reason ?? copy.limit);
      setTone("error");
      return false;
    }
    await trackToolExecution(toolSlug);
    return true;
  }

  async function format() {
    try {
      const nextInput = formatJson(input);
      setInput(nextInput);
      if (!(await markExecution())) return;
      history.remember(input, nextInput);
      setMessage(copy.formatted);
      setTone("success");
    } catch (error) {
      setMessage(error instanceof Error ? error.message : copy.invalid);
      setTone("error");
    }
  }

  async function minify() {
    try {
      const nextInput = minifyJson(input);
      setInput(nextInput);
      if (!(await markExecution())) return;
      history.remember(input, nextInput);
      setMessage(copy.minified);
      setTone("success");
    } catch (error) {
      setMessage(error instanceof Error ? error.message : copy.invalid);
      setTone("error");
    }
  }

  async function validate() {
    try {
      JSON.parse(input);
      if (!(await markExecution())) return;
      history.remember(input, input);
      setMessage(copy.valid);
      setTone("success");
    } catch (error) {
      setMessage(error instanceof Error ? error.message : copy.invalid);
      setTone("error");
    }
  }

  return (
    <ToolPanel>
      <div className="space-y-4">
        <ToolTextarea label={copy.input} value={input} onChange={setInput} rows={12} />
        <div className="flex flex-wrap items-center gap-2">
          <span className="code-font text-xs font-semibold uppercase tracking-[0.14em] text-[var(--text-soft)]">{copy.examples}</span>
          {[
            [copy.basic, sample],
            [copy.nested, nestedSample],
            [copy.invalidExample, invalidSample],
          ].map(([label, value]) => (
            <ToolButton key={label} variant="secondary" onClick={() => { setInput(value); setMessage(""); }}>
              {label}
            </ToolButton>
          ))}
        </div>
        <div className="flex flex-wrap gap-2">
          <ToolButton onClick={() => void format()}>{copy.format}</ToolButton>
          <ToolButton onClick={() => void minify()} variant="secondary">{copy.minify}</ToolButton>
          <ToolButton onClick={() => void validate()} variant="secondary">{copy.validate}</ToolButton>
          <CopyButton value={input} label={commonCopy.copy} copiedLabel={commonCopy.copied} />
          <ToolButton variant="secondary" onClick={() => downloadText("madabase-json.json", input)}>{copy.download}</ToolButton>
          <ResetButton label={commonCopy.reset} onClick={() => setInput(sample)} />
        </div>
        <StatusMessage message={message} tone={tone} />
        <ToolHistory
          items={history.items}
          locale={locale}
          onClear={history.clear}
          onUse={(item) => {
            setInput(item.output || item.input);
            setMessage("");
          }}
        />
      </div>
    </ToolPanel>
  );
}
