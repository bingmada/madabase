"use client";

import { useState } from "react";
import type { Locale } from "@/lib/i18n";
import { recordToolExecution } from "@/lib/limits";
import { trackToolExecution } from "@/lib/tool-usage-client";
import { CopyButton, ResetButton, StatusMessage, ToolButton, ToolPanel, ToolTextarea } from "./ToolPrimitives";

const sample = '{"name":"Madabase","tools":["JSON Formatter","JWT Decoder"],"online":true}';

export function JsonFormatter({ toolSlug = "json-formatter", locale = "en" }: { toolSlug?: string; locale?: Locale }) {
  const [input, setInput] = useState(sample);
  const [message, setMessage] = useState("");
  const [tone, setTone] = useState<"success" | "error">("success");
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
  };

  function parseJson() {
    return JSON.parse(input);
  }

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
      setInput(JSON.stringify(parseJson(), null, 2));
      if (!(await markExecution())) return;
      setMessage(copy.formatted);
      setTone("success");
    } catch (error) {
      setMessage(error instanceof Error ? error.message : copy.invalid);
      setTone("error");
    }
  }

  async function minify() {
    try {
      setInput(JSON.stringify(parseJson()));
      if (!(await markExecution())) return;
      setMessage(copy.minified);
      setTone("success");
    } catch (error) {
      setMessage(error instanceof Error ? error.message : copy.invalid);
      setTone("error");
    }
  }

  async function validate() {
    try {
      parseJson();
      if (!(await markExecution())) return;
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
        <div className="flex flex-wrap gap-2">
          <ToolButton onClick={() => void format()}>{copy.format}</ToolButton>
          <ToolButton onClick={() => void minify()} variant="secondary">{copy.minify}</ToolButton>
          <ToolButton onClick={() => void validate()} variant="secondary">{copy.validate}</ToolButton>
          <CopyButton value={input} />
          <ResetButton onClick={() => setInput(sample)} />
        </div>
        <StatusMessage message={message} tone={tone} />
      </div>
    </ToolPanel>
  );
}
