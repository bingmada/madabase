"use client";
import { useMemo, useState } from "react";
import type { Locale } from "@/lib/i18n";
import { fireAndForgetToolExecution } from "@/lib/tool-usage-client";
import { ResetButton, StatusMessage, ToolButton, ToolPanel, ToolTextarea } from "./ToolPrimitives";

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
      JSON.parse(input);
      return { message: copy.valid, tone: "success" as const };
    } catch (error) {
      return { message: error instanceof Error ? error.message : copy.invalid, tone: "error" as const };
    }
  }, [copy.invalid, copy.valid, input]);

  return (
    <ToolPanel>
      <div className="space-y-4">
        <ToolTextarea label={copy.input} value={input} onChange={(value) => { setInput(value); setValidated(false); }} rows={12} />
        <div className="flex flex-wrap gap-2">
          <ToolButton onClick={() => { setValidated(true); fireAndForgetToolExecution("json-validator"); }}>{copy.validate}</ToolButton>
          <ResetButton label={copy.reset} onClick={() => { setInput(sample); setValidated(false); }} />
        </div>
        <StatusMessage message={validated ? result.message : copy.idle} tone={validated ? result.tone : "neutral"} />
      </div>
    </ToolPanel>
  );
}
