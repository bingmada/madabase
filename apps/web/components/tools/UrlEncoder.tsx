"use client";
import { useState } from "react";
import type { Locale } from "@/lib/i18n";
import { fireAndForgetToolExecution } from "@/lib/tool-usage-client";
import { CopyButton, ResetButton, StatusMessage, ToolButton, ToolPanel, ToolTextarea } from "./ToolPrimitives";

const sample = "https://madabase.com/tools/json-formatter?query=hello world";

export function UrlEncoder({ locale = "en" }: { locale?: Locale }) {
  const [input, setInput] = useState(sample);
  const [output, setOutput] = useState(encodeURIComponent(sample));
  const [message, setMessage] = useState("");
  const copy = {
    input: locale === "zh" ? "输入内容" : "Input",
    output: locale === "zh" ? "输出结果" : "Output",
    encode: locale === "zh" ? "编码" : "Encode",
    decode: locale === "zh" ? "解码" : "Decode",
    error: locale === "zh" ? "无法处理 URL 输入。" : "Unable to process URL input.",
  };

  function run(mode: "encode" | "decode") {
    try {
      setOutput(mode === "encode" ? encodeURIComponent(input) : decodeURIComponent(input));
      setMessage("");
      fireAndForgetToolExecution("url-encoder");
    } catch (error) {
      setMessage(error instanceof Error ? error.message : copy.error);
    }
  }

  return (
    <ToolPanel>
      <div className="space-y-4">
        <ToolTextarea label={copy.input} value={input} onChange={setInput} rows={6} />
        <div className="flex flex-wrap gap-2">
          <ToolButton onClick={() => run("encode")}>{copy.encode}</ToolButton>
          <ToolButton onClick={() => run("decode")} variant="secondary">{copy.decode}</ToolButton>
          <CopyButton value={output} />
          <ResetButton onClick={() => { setInput(sample); setOutput(encodeURIComponent(sample)); setMessage(""); }} />
        </div>
        <StatusMessage message={message} tone="error" />
        <ToolTextarea label={copy.output} value={output} readOnly rows={6} />
      </div>
    </ToolPanel>
  );
}
