"use client";
import { useState } from "react";
import type { Locale } from "@/lib/i18n";
import { formatHtml } from "@/lib/tool-transforms";
import { toolCopy } from "@/lib/tool-ui-copy";
import { fireAndForgetToolExecution } from "@/lib/tool-usage-client";
import { CopyButton, ResetButton, StatusMessage, ToolButton, ToolPanel, ToolTextarea } from "./ToolPrimitives";

const sample = '<main><h1>Madabase</h1><p>Online developer tools.</p><ul><li>JSON</li><li>JWT</li></ul></main>';
const sampleOutput = `<main>
  <h1>Madabase</h1>
  <p>Online developer tools.</p>
  <ul>
    <li>JSON</li>
    <li>JWT</li>
  </ul>
</main>`;

export function HtmlFormatter({ locale = "en" }: { locale?: Locale }) {
  const copy = toolCopy(locale);
  const [input, setInput] = useState(sample);
  const [output, setOutput] = useState(sampleOutput);
  const [message, setMessage] = useState("");

  async function format() {
    try {
      setOutput(await formatHtml(input));
      setMessage("");
      fireAndForgetToolExecution("html-formatter");
    } catch (error) {
      setMessage(error instanceof Error ? error.message : locale === "zh" ? "无法格式化 HTML。" : "Unable to format HTML.");
    }
  }

  return (
    <ToolPanel>
      <div className="space-y-4">
        <ToolTextarea label={locale === "zh" ? "HTML 输入" : "HTML input"} value={input} onChange={setInput} rows={8} />
        <div className="flex flex-wrap gap-2">
          <ToolButton onClick={format}>{locale === "zh" ? "格式化 HTML" : "Format HTML"}</ToolButton>
          <CopyButton value={output} label={copy.copy} copiedLabel={copy.copied} />
          <ResetButton label={copy.reset} onClick={() => { setInput(sample); setOutput(sampleOutput); setMessage(""); }} />
        </div>
        <StatusMessage message={message} tone="error" />
        <ToolTextarea label={locale === "zh" ? "格式化后的 HTML" : "Formatted HTML"} value={output} readOnly rows={10} />
      </div>
    </ToolPanel>
  );
}
